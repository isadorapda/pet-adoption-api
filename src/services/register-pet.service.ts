import {OrganisationRepository} from '@/repositories/organisation-repository';
import {PetsRepository} from '@/repositories/pets-repository';
import {MayLiveWith, Pet, PetType, Sex, Size} from '@prisma/client';
import {ResourceNotFoundError} from './errors/resource-not-found-error';
import {PetImagesRepository} from '@/repositories/pet-images-repository';
interface RegisterPetServiceRequest {
  organisationId: string;
  name: string;
  sex: Sex;
  pet_type: PetType;
  size: Size;
  description?: string;
  may_live_with: MayLiveWith;
  ideal_home?: string;
  breed?: string;
  age: number;
  pet_photos?: Array<string>;
}
interface RegisterPetServiceResponse {
  pet: Pet;
}

export class RegisterPetService {
  constructor(
    private organisationRepository: OrganisationRepository,
    private petsRepository: PetsRepository,
    private petImagesRepository: PetImagesRepository,
  ) {}

  async registerPetService({
    organisationId,
    name,
    sex,
    pet_type,
    size,
    age,
    breed,
    description,
    ideal_home,
    may_live_with,
    pet_photos,
  }: RegisterPetServiceRequest): Promise<RegisterPetServiceResponse> {
    const org = await this.organisationRepository.findById(organisationId);
    if (!org) {
      throw new ResourceNotFoundError();
    }

    const {id} = await this.petsRepository.create({
      name,
      sex,
      pet_type,
      size,
      age,
      breed,
      description,
      ideal_home,
      may_live_with,
      organisation_id: organisationId,
    });

    const buffers = [];
    if (pet_photos) {
      for (const photo of pet_photos) {
        const imageBuffer = Buffer.from(photo.split(',')[1], 'base64');
        buffers.push(imageBuffer);
      }
      await this.petImagesRepository.addImages(id, buffers);
    }

    const pet = await this.petsRepository.findById(id);
    if (!pet) {
      throw new Error('Pet was just created, should not happen');
    }
    return {pet};
  }
}
