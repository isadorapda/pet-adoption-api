import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrganisation } from '@/utils/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'

describe('Search pet controller', () => {
	beforeAll(async() => {
		await app.ready()
	})
	afterAll(async() => {
		await app.close()
	})

	test('Should be able to search pet by city', async ()=>{
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

		const response = await request(app.server).get('/pets/search').query({location:'London'}).send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pets).toHaveLength(1)
		expect(response.body.pets).toEqual([
			expect.objectContaining({
				name: 'Fiona',
			}),
		])
	})

	test('Should be able to filter pets on search', async ()=>{
		const org = await prisma.organisation.findFirstOrThrow()

		await prisma.pet.createMany({
			data:[
				{
					name: 'Fiona',
					pet_type: 'DOG',
					age: 3,
					size: 'MEDIUM',
					breed:'Husky',
					description: '',
					ideal_home:'Outside space',
					may_live_with:'',
					sex:'FEMALE',
					organisation_id:org.id,
				},
				{
					name: 'Bob',
					pet_type: 'DOG',
					age: 3,
					size: 'LARGE',
					breed:'Husky',
					description: '',
					ideal_home:'Outside space',
					may_live_with:'',
					sex:'MALE',
					organisation_id:org.id,
				},
				{
					name: 'Lila',
					pet_type: 'DOG',
					age: 3,
					size: 'MEDIUM',
					breed:'Collie',
					description: '',
					ideal_home:'Outside space',
					may_live_with:'',
					sex:'FEMALE',
					organisation_id:org.id,
				},
			]
			
		})

		const response = await request(app.server).get('/pets/search').query({location:'London',sex:'FEMALE',size:'MEDIUM',pet_type:'DOG'}).send()
        
		expect(response.statusCode).toEqual(200)
		expect(response.body.pets).toHaveLength(2)
		expect(response.body.pets).toEqual([
			expect.objectContaining({
				name: 'Fiona',
			}),
			expect.objectContaining({
				name: 'Lila',
			}),
		])
        
		const response2 = await request(app.server).get('/pets/search').query({location:'London',sex:'FEMALE',size:'MEDIUM',pet_type:'DOG',breed:'Collie',age:3}).send()
		expect(response2.statusCode).toEqual(200)
		expect(response2.body.pets).toHaveLength(1)
		expect(response2.body.pets).toEqual([
         
			expect.objectContaining({
				name: 'Lila',
			}),
		])
	})



})