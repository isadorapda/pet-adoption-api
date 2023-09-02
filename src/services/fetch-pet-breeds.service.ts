import {PetsRepository} from '@/repositories/pets-repository';

export interface FetchBreedsServiceResponse {
  breeds: Array<string>;
}

export class FetchBreedsService {
  constructor(private petsRepositry: PetsRepository) {}

  async fetchBreedsService(): Promise<FetchBreedsServiceResponse> {
    const breeds = await this.petsRepositry.getBreeds();

    return {breeds};
  }
}
