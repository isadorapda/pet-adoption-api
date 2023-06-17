import { OrganisationRepository } from '@/repositories/organisation-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { MayLiveWith, Pet, PetType, Sex, Size } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface RegisterPetServiceRequest {
	organisationId: string
	name: string
	sex: Sex
	pet_type: PetType
	size: Size
	description?: string
	may_live_with: MayLiveWith
	ideal_home?: string
	breed?: string
	age: number
}
interface RegisterPetServiceResponse {
	pet: Pet
}

export class RegisterPetService {
	constructor(private organisationRepository: OrganisationRepository, private petsRepository: PetsRepository) { }

	async registerPetService({ organisationId, name, sex, pet_type, size, age, breed, description, ideal_home, may_live_with }: RegisterPetServiceRequest): Promise<RegisterPetServiceResponse> {

		const org = await this.organisationRepository.findById(organisationId)

		if (!org) {
			throw new ResourceNotFoundError()
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
			organisation_id: organisationId,
		})

		return { pet }

	}
}