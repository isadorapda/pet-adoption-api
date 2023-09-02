import {Pet, PetPhoto} from '@prisma/client';

export interface PetImagesRepository {
  addImages: (petId: Pet['id'], imageStreams: Array<Buffer>) => Promise<void>;
  getImages: (imageIds: Array<PetPhoto['id']>) => Promise<Array<PetPhoto['url']>>;
}
