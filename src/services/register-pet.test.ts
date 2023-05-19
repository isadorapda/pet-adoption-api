import { InMomoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import {beforeEach, describe, expect, test} from 'vitest'
import { RegisterPetService } from './register-pet.service'
import { InMemoryOrganisationsRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMomoryPetsRepository
let organisationsRepository: InMemoryOrganisationsRepository
let sut: RegisterPetService

describe('Register a pet service', () => {
	beforeEach(() => {
		organisationsRepository = new InMemoryOrganisationsRepository()
		petsRepository = new InMomoryPetsRepository(organisationsRepository)
		sut = new RegisterPetService(organisationsRepository, petsRepository)
        
	})

	test('Should be able to register a pet', async () => {
		const org = await organisationsRepository.create({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.org@email.com',
			mobile:'07123456789',
			address: '',
			password_hash: await hash('123456',6),
		})

		const {pet} = await sut.registerPetService({
			name: 'Fiona',
			pet_type: 'DOG',
			age: 3,
			size: 'SMALL',
			breed:'Husky',
			description: '',
			ideal_home:'Outside space',
			may_live_with:'',
			sex:'FEMALE',
			organisationId: org.id,
		})

		expect(pet.id).toEqual(expect.any(String))
	})

	test('Should not be able to register a pet without organisation id', async () => {
		await expect(()=>
			sut.registerPetService({
				name: 'Fiona',
				pet_type: 'DOG',
				age: 3,
				size: 'SMALL',
				breed:'Husky',
				description: '',
				ideal_home:'Outside space',
				may_live_with:'',
				sex:'FEMALE',
				organisationId: 'non-exististing-org',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)


	})
})