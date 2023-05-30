import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrganisation } from '@/utils/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { MayLiveWith} from './register-pet.controller'

describe('Search pet controller', () => {
	beforeAll(async () => {
		await app.ready()
	})
	afterAll(async () => {
		await app.close()
	})

	test('Should be able to search pet by city', async () => {
		const { token } = await createAndAuthenticateOrganisation(app)

		const org = await prisma.organisation.findFirstOrThrow()
		await request(app.server)
			.post(`/organisations/${org.id}/pets`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Fiona',
				pet_type: 'DOG',
				age: 3,
				size: 'SMALL',
				breed: 'Husky',
				description: '',
				ideal_home: 'Outside space',
				sex: 'FEMALE',
				may_live_with: MayLiveWith.ANY,
			})

		const response = await request(app.server)
			.get('/pets/search')
			.query({ location: 'London' })
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pets).toHaveLength(1)
		expect(response.body.pets).toEqual([
			expect.objectContaining({
				name: 'Fiona',
			}),
		])
	})

	test('Should be able to filter pets on search', async () => {
		const org = await prisma.organisation.create({
			data: {
				name: 'Pet 1',
				city: 'London',
				postcode: 'AB12 3CD',
				email: 'adopt@email.com',
				mobile: '07123456789',
				address: '',
				password_hash: await hash('123456', 6),
			},
		})

		await prisma.pet.createMany({
			data: [
				{
					name: 'Fiona',
					pet_type: 'DOG',
					age: 1,
					size: 'SMALL',
					breed: 'Husky',
					description: '',
					ideal_home: 'Outside space',
					sex: 'FEMALE',
					organisation_id: org.id,
					may_live_with: MayLiveWith.ANY,
				},
				{
					name: 'Bob',
					pet_type: 'DOG',
					age: 2.4,
					size: 'MEDIUM',
					breed: 'Husky',
					description: '',
					ideal_home: 'Outside space',
					sex: 'MALE',
					may_live_with: MayLiveWith.ANY,
					organisation_id: org.id,
				},
				{
					name: 'Lila',
					pet_type: 'DOG',
					age: 3,
					size: 'LARGE',
					breed: 'Collie',
					description: '',
					ideal_home: 'Outside space',
					sex: 'FEMALE',
					may_live_with: MayLiveWith.ANY,
					organisation_id: org.id,
				},
			],
		})

		const response = await request(app.server)
			.get('/pets/search')
			.query({ location: 'London', sex: 'MALE', pet_type: 'DOG' })
			.send()
		expect(response.statusCode).toEqual(200)
		expect(response.body.pets).toHaveLength(1)
		expect(response.body.pets).toEqual([
			expect.objectContaining({
				name: 'Bob',
			}),
		])
		const response2 = await request(app.server)
			.get('/pets/search')
			.query({ location: 'London', size: 'LARGE' })
			.send()
		expect(response2.statusCode).toEqual(200)
		expect(response2.body.pets).toHaveLength(1)
		expect(response2.body.pets).toEqual([
			expect.objectContaining({
				name: 'Lila',
			}),
		])
		
	})
	test('Should be able to filter pets by age', async () => {
		const org = await prisma.organisation.create({
			data: {
				name: 'Hommy',
				city: 'Manchester',
				postcode: 'AB12 3CD',
				email: 'hommy@email.com',
				mobile: '07123456789',
				address: '',
				password_hash: await hash('123456', 6),
			},
		})

		await prisma.pet.createMany({
			data: [
				{
					name: 'Fiona',
					pet_type: 'DOG',
					age: 1,
					size: 'MEDIUM',
					breed: 'Husky',
					description: '',
					ideal_home: 'Outside space',
					sex: 'FEMALE',
					organisation_id: org.id,
					may_live_with: MayLiveWith.ANY,
				},
				{
					name: 'Bob',
					pet_type: 'DOG',
					age: 2.4,
					size: 'LARGE',
					breed: 'Husky',
					description: '',
					ideal_home: 'Outside space',
					sex: 'MALE',
					may_live_with: MayLiveWith.ANY,
					organisation_id: org.id,
				},
				{
					name: 'Lila',
					pet_type: 'DOG',
					age: 3,
					size: 'TINY',
					breed: 'Collie',
					description: '',
					ideal_home: 'Outside space',
					sex: 'FEMALE',
					may_live_with: MayLiveWith.ANY,
					organisation_id: org.id,
				},
			],
		})


		const response3 = await request(app.server)
			.get('/pets/search')
			.query({ location: 'Manchester', age_min:0.6, age_max:2.9 })
			.send()
		expect(response3.statusCode).toEqual(200)
		expect(response3.body.pets).toHaveLength(2)
		expect(response3.body.pets).toEqual([
			expect.objectContaining({
				name: 'Fiona',
			}),
			expect.objectContaining({
				name: 'Bob',
			}),
		])
	})
})
