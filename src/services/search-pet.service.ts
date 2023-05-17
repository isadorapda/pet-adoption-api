import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface SearchPetServiceRequest{
    location: string
}
interface SearchPetServiceResponse{
    pets: Pet[]
}

export class SearchPetService{
	constructor(private petsRepositry:PetsRepository){}
    
	async searchPetService({location}:SearchPetServiceRequest):Promise<SearchPetServiceResponse> {

		const pets = await this.petsRepositry.findAllByLocation(location)

		return {pets}
	}

}