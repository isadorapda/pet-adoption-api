import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrganisation } from '@/utils/create-and-authenticate-org'

describe('Get pet details controller E2E', () => {
	beforeAll(async()=>{
		await app.ready()
	})
	afterAll(async()=>{
		await app.close()
	})

	test('Should be able to access a pet details', async () => {
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		await request(app.server).post(`/organisations/${org.id}/pets`).set('Authorization', `Bearer ${token}`).send({
			name: 'Fiona',
			pet_type: 'DOG',
			age: 3,
			size: 'SMALL',
			breed:'Husky',
			description: '',
			ideal_home:'Outside space',
			may_live_with:'',
			sex:'FEMALE',
		})
		const pet = await prisma.pet.findFirstOrThrow()

		const response = await request(app.server).get(`/pets/${pet.id}/details`).send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pet).toEqual(
			expect.objectContaining({
				name: 'Fiona',
			})
		)
	})
})