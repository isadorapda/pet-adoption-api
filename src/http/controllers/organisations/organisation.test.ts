import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrganisation } from '@/utils/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Organisation Controllers E2E', () => {
	beforeAll(async()=>{
		await app.ready()
	})
	afterAll(async()=>{
		await app.close()
	})

	test('Should be able to register an organisation', async () => {
		const response = await request(app.server).post('/organisations').send({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.adopt@email.com',
			mobile:'447123456789',
			address: '',
			password: '123456',
		})

		expect(response.statusCode).toEqual(201)
	})

	test('Should be able to auth an organisation', async () => {
		await request(app.server).post('/organisations').send({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.adopt@email.com',
			mobile:'447123456789',
			address: '',
			password: '123456',
		})

		const response = await request(app.server).post('/sessions').send({
			email: 'pet.adopt@email.com',
			password: '123456',
		})

		expect(response.statusCode).toEqual(200)

		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})

	test('Should be able to refresh token when expired', async () => {
		await request(app.server).post('/organisations').send({
			name: 'Pet Org',
			city: 'London',
			postcode: 'AB12 3CD',
			email: 'pet.adopt@email.com',
			mobile:'447123456789',
			address: '',
			password: '123456',
		})

		const authResponse = await request(app.server).post('/sessions').send({
			email: 'pet.adopt@email.com',
			password: '123456',
		})

		const cookies = authResponse.get('Set-Cookie')

		const response = await request(app.server).patch('/token/refresh').set('Cookie',cookies).send()

		expect(response.status).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})

		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken='),
		])
	})

	test('Should be able to edit organisation\'s profile', async ()=>{
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		const editOrgResponse = await request(app.server).patch(`/me/${org.id}/edit`).set('Authorization', `Bearer ${token}`).send({
			mobile: '447123456700',
			address: 'New Address',
		})

		expect(editOrgResponse.status).toEqual(200)
		expect(editOrgResponse.body).toEqual(
			expect.objectContaining({
				address: 'New Address',
			})
		)
	})

	test('Should not be able to update organisation\'s email to an already existing one', async ()=>{
		await prisma.organisation.create({
			data: {
				city: 'London',
				email: 'pet1@email.com',
				mobile: '4412345678900',
				name: 'Pet',
				password_hash: await hash('123456', 6),
				postcode: 'AB12 2B',
				address:''
			}
            
		})
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		const editOrgResponse = await request(app.server).patch(`/me/${org.id}/edit`).set('Authorization', `Bearer ${token}`).send({
			email: 'pet1@email.com',
		})

		expect(editOrgResponse.status).toEqual(409)
	})

	test('Should be able to delete an organisation\'s profile', async ()=>{
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		const editOrgResponse = await request(app.server).delete(`/me/${org.id}/delete`).set('Authorization', `Bearer ${token}`).send()

		expect(editOrgResponse.status).toEqual(200)
	})

	test('Should be able to delete a pet ', async ()=>{
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		const pet = await prisma.pet.create({
			data: {
				age:3,
				may_live_with: 'ANY',
				name:'Bob',
				pet_type: 'CAT',
				sex: 'MALE',
				size: 'SMALL',
				organisation_id:org.id
			}
		})
		const editOrgResponse = await request(app.server).delete(`/me/pets/${pet.id}/delete`).set('Authorization', `Bearer ${token}`).send()

		expect(editOrgResponse.status).toEqual(200)
	})

	test.only('Should be able to edit pet details', async ()=>{
		const {token} = await createAndAuthenticateOrganisation(app)
		const org = await prisma.organisation.findFirstOrThrow()
		const pet = await prisma.pet.create({
			data: {
				age:3,
				may_live_with: 'ANY',
				name:'Bob',
				pet_type: 'CAT',
				sex: 'MALE',
				size: 'SMALL',
				organisation_id:org.id
			}
		})
		const editOrgResponse = await request(app.server).patch(`/me/pets/${pet.id}/edit`).set('Authorization', `Bearer ${token}`).send({
			petId:pet.id,
			age:5, 
		})

		expect(editOrgResponse.status).toEqual(200)
	})
})