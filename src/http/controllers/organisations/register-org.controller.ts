import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { RegisterOrganisationService } from '@/services/register-org.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'

export async function registerOrganisationController(request:FastifyRequest, reply: FastifyReply){
	const registerOrgBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		address: z.string(),
		city: z.string(),
		postcode: z.string(),
		mobile: z.string().min(9),
	})

	const {name,email,password,address,postcode,mobile,city} = registerOrgBodySchema.parse(request.body)

	try {
		const orgRepository = new PrismaOrganisationsRepository()
		const orgService = new RegisterOrganisationService(orgRepository)
		await orgService.registerOrgService({
			name,
			email,
			password,
			address,
			postcode,
			mobile,
			city
		})
	} catch (error) {
		throw new Error()
	}
	return reply.status(201).send()
}