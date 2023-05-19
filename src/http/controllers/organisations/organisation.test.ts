import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import request from 'supertest'
import { app } from '@/app'

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
			mobile:'07123456789',
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
			mobile:'07123456789',
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
			mobile:'07123456789',
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
})