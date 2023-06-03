import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { app } from '@/app'
import { createAndAuthenticateOrganisation } from '@/utils/create-and-authenticate-org'
import { MayLiveWith, PetSize } from './register-pet.controller'

describe('Pet Controllers E2E', () => {
	beforeAll(async() => {
		await app.ready()
	})
	afterAll(async() => {
		await app.close()
	})

	test('Should be able to register a pet', async () => {
		const {token} = await createAndAuthenticateOrganisation(app)

		const org = await prisma.organisation.findFirstOrThrow()
		const response = await request(app.server).post(`/organisations/${org.id}/pets`).set('Authorization', `Bearer ${token}`).send({
			name: 'Fiona',
			pet_type: 'DOG',
			age: 3,
			size: PetSize.SMALL,
			breed:'Husky',
			description: '',
			ideal_home:'Outside space',
			may_live_with:MayLiveWith.ANY,
			sex:'FEMALE',
		})

		expect(response.statusCode).toEqual(201)
	})
	test('Should not be able to register a pet without name', async () => {
		const {token} = await createAndAuthenticateOrganisation(app)

		const org = await prisma.organisation.findFirstOrThrow()
		const response = await request(app.server).post(`/organisations/${org.id}/pets`).set('Authorization', `Bearer ${token}`).send({
			name: '',
			pet_type: 'DOG',
			age: 3,
			size: PetSize.SMALL,
			breed:'Husky',
			description: '',
			ideal_home:'Outside space',
			may_live_with:MayLiveWith.ANY,
			sex:'FEMALE',
		})

		expect(response.statusCode).toEqual(500)
	})

	
})