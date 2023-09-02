import {PetsRepository} from '@/repositories/pets-repository';
import {ResourceNotFoundError} from './errors/resource-not-found-error';

interface DeletePetServiceRequest {
  petId: string;
}

export class DeletePetService {
  constructor(private petsRepository: PetsRepository) {}

  async deletePetService({petId}: DeletePetServiceRequest): Promise<void> {
    const pet = await this.petsRepository.findById(petId);

    if (!pet) {
      throw new ResourceNotFoundError();
    }
    await this.petsRepository.delete(pet);
  }
}
