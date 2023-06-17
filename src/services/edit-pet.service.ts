import { PetsRepository } from '@/repositories/pets-repository'
import { MayLiveWith, Pet, PetType, Sex, Size } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditPetServiceRequest{
    petId:string
    name?:string
    sex?:Sex
    pet_type?: PetType 
    size?: Size 
    description?: string 
    may_live_with?: MayLiveWith
    ideal_home?: string 
    breed?: string 
    age?: number
}

interface EditPetServiceResponse{
    pet:Pet
}

export class EditPetService{
	constructor(private petsRepository:PetsRepository){}

	async editPetService(editPetInput:EditPetServiceRequest):Promise<EditPetServiceResponse> {
		const {petId} = editPetInput

		const pet = await this.petsRepository.findById(petId)

		if(!pet){
			throw new ResourceNotFoundError()
		}
		
		const {petId:id, ...parsedInput} = editPetInput
		const updatedPetInfo = await this.petsRepository.save({...parsedInput, id})

		return {pet: updatedPetInfo}
	}
}