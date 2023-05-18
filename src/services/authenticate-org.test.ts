import {beforeEach, describe, expect, test} from 'vitest'
import { AuthenticateOrganisationService } from './authenticate-org.service'
import { InMemoryOrganisationsRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { hash } from 'bcryptjs'


let organisationRepository:InMemoryOrganisationsRepository
let sut: AuthenticateOrganisationService

describe('Authenticate Organisation Service', () => {
	beforeEach(() => {
		organisationRepository = new InMemoryOrganisationsRepository()
		sut = new AuthenticateOrganisationService(organisationRepository)
	})

	test('Should be able to authenticate an organisation login', async () => {
		await organisationRepository.create({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.org@email.com',
			mobile:'07123456789',
			address: '',
			password_hash: await hash('123456',6),
		})

		const {organisation} = await sut.authenticateOrgService({
			email: 'pet.org@email.com',
			password:'123456'
		})

		expect(organisation.id).toEqual(expect.any(String))
	})

	test('Should not be able to authenticate an organisation login with a wrong email', async () => {
	
		await expect(()=>sut.authenticateOrgService({
			email: 'pet.org@email.com',
			password:'123456'
		})).rejects.toBeInstanceOf(Error)
	})

	test('Should not be able to authenticate an organisation login with wrong password', async () => {
		await organisationRepository.create({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.org@email.com',
			mobile:'07123456789',
			address: '',
			password_hash: await hash('123456',6),
		})

		await expect(()=>sut.authenticateOrgService({
			email: 'pet.org@email.com',
			password:'123457'
		})).rejects.toBeInstanceOf(Error)
	})
})