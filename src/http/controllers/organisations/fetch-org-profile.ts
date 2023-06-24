
import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { GetOrgProfileService } from '@/services/fetch-org-profile.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


export async function profileController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const sortPetsQuerySchema = z.object({
		field: z.string().optional(),
		order: z.union([z.literal('asc'),z.literal('desc')]).optional(),
	})

	const {field,order} = sortPetsQuerySchema.parse(request.query)

	const orgRepository = new PrismaOrganisationsRepository()
	const orgService = new GetOrgProfileService(orgRepository)

	const { organisation } = await orgService.service({
		orgId: request.user.sub,
		field,
		order,
	})

	return reply.status(200).send(
		{user:organisation})
}