import {beforeEach, describe, expect, test} from 'vitest'
import { InMomoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { DeletePetService } from './delete-pet.service'
import { InMemoryOrganisationsRepository } from '@/repositories/in-memory/in-memory-org-repository'

let petsRepository:InMomoryPetsRepository
let organisationsRepository: InMemoryOrganisationsRepository
let sut: DeletePetService

describe('Delete Pet Service', () => {
	beforeEach(() => {
		organisationsRepository = new InMemoryOrganisationsRepository()
		petsRepository = new InMomoryPetsRepository(organisationsRepository)
		sut = new DeletePetService(petsRepository)
	})

	test('Should be able to delete a pet', async () => {
		const createPet = await petsRepository.create({
			name: 'Fiona',
			pet_type: 'DOG',
			age: 3,
			size: 'SMALL',
			may_live_with:'ANY',
			sex: 'FEMALE',
			organisation_id: 'Org-01',
		})

		await sut.deletePetService({
			petId: createPet.id,
		})

		expect(petsRepository.pets).toHaveLength(0)
	})


})