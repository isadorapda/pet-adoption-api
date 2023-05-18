import { InMomoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import {beforeEach, describe, expect, test} from 'vitest'
import { GetPetDetailsService } from './get-pet-details.service'
import { InMemoryOrganisationsRepository } from '@/repositories/in-memory/in-memory-org-repository'

let petsRepository: InMomoryPetsRepository
let organisationsRepository: InMemoryOrganisationsRepository
let sut: GetPetDetailsService

describe('Get Pet Details Service', () => {
	beforeEach(() => {
		organisationsRepository = new InMemoryOrganisationsRepository()
		petsRepository = new InMomoryPetsRepository(organisationsRepository)
		sut = new GetPetDetailsService(petsRepository)
	})

	test('Should be able to access a pet\'s details', async () => {
		const createPet = await petsRepository.create({
			name: 'Fiona',
			pet_type: 'DOG',
			age: 3,
			size: 'SMALL',
			organisation_id: 'Org-01',
		})

		const {pet} = await sut.petDetailsService({
			petId: createPet.id
		})

		expect(pet.name).toEqual('Fiona')
	})

	test('Should not be able to access a pet\'s details with wrong id', async () => {
		await expect(()=>
			sut.petDetailsService({
				petId: 'non-existing-id'
			})).rejects.toBeInstanceOf(Error)
	})
})