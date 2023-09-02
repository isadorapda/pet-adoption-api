import {PetsRepository} from '@/repositories/pets-repository';
import {Pet} from '@prisma/client';
import {ResourceNotFoundError} from './errors/resource-not-found-error';
import {prisma} from '@/lib/prisma';

interface TagPetAsAdoptedServiceRequest {
  petId: string;
}

interface TagPetAsAdoptedServiceResponse {
  pet: Pet;
}

export class TagPetAsAdoptedService {
  constructor(private petsRepository: PetsRepository) {}

  async tagAdoptedPetService({
    petId,
  }: TagPetAsAdoptedServiceRequest): Promise<TagPetAsAdoptedServiceResponse> {
    const pet = await prisma.pet.findUnique({
      where: {
        id: petId,
      },
    });

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    pet.adopted_at = new Date();

    await this.petsRepository.save(pet);
    return {pet};
  }
}
