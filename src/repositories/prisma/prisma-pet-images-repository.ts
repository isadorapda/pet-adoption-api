import {PetImagesRepository} from '../pet-images-repository';
import {prisma} from '@/lib/prisma';
import {randomUUID} from 'node:crypto';
import {uploadImage} from '@/aws/s3';

export class PrismaPetImagesRepository implements PetImagesRepository {
  async getImages(imageIds: string[]) {
    return (await prisma.petPhoto.findMany({where: {id: {in: imageIds}}})).map(({url}) => url);
  }

  async addImages(petId: string, imageStreams: Buffer[]) {
    prisma.pet.findFirstOrThrow({where: {id: petId}});
    const petPhotoInput = [];

    for (const imageStream of imageStreams) {
      const imageKey = randomUUID();
      console.log('IMAGEEEEE', imageStream);
      const url = uploadImage(imageKey, imageStream);
      petPhotoInput.push({url, id: imageKey, pet_id: petId});
    }

    await prisma.petPhoto.createMany({data: petPhotoInput});
    console.log('lastttttt');
    return;
  }
}
