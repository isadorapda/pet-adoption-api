import { OrganisationRepository } from '@/repositories/organisation-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { Pet, PetType, Sex, Size } from '@prisma/client'

interface RegisterPetServiceRequest{
    organisationId:string
    name:string
    sex:Sex | null
    pet_type: PetType 
    size: Size | null
    description: string | null
    may_live_with: string | null
    ideal_home: string | null
    breed: string | null
    age: number
}
interface RegisterPetServiceResponse{
    pet: Pet
}

export class RegisterPetService{
	constructor(private organisationRepository: OrganisationRepository, private petsRepository: PetsRepository){}

	async registerPetService({organisationId,name,sex,pet_type,size,age,breed,description,ideal_home,may_live_with}:RegisterPetServiceRequest):Promise<RegisterPetServiceResponse> {

		const org = await this.organisationRepository.findById(organisationId)

		if(!org){
			throw new Error('Resource not found')
		}
		const pet = await this.petsRepository.create({
			name,
			sex,
			pet_type,
			size,
			age,
			breed,
			description,
			ideal_home,
			may_live_with,
			organisation_id:organisationId,
		})

		return {pet}

	}
}