import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { AuthenticateOrganisationService } from '@/services/authenticate-org.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import {z} from 'zod'

export async function authenticateOrganisationController(request:FastifyRequest, reply: FastifyReply){
	const authenticateOrganisationBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const {email,password} = authenticateOrganisationBodySchema.parse(request.body)

	try {
		const organisationRepository = new PrismaOrganisationsRepository()
		const authService = new AuthenticateOrganisationService(organisationRepository)

		const {organisation}=await authService.authenticateOrgService({
			email,
			password,
		})
		const token = await reply.jwtSign(
			{},
			{
				sign:{
					sub: organisation.id,
				}
			}
		)

		const refreshToken = await reply.jwtSign(
			{},
			{
				sign:{
					sub:organisation.id,
					expiresIn: '7d',
				}
			}
		)
		return reply.setCookie('refreshToken', refreshToken,{
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite:true
		}).status(200).send({token})
	} catch (error) {
		throw new Error()
	}

}