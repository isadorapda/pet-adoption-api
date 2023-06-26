import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { FetchOrgService } from '@/services/fetch-org.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchOrganisationController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const orgParamsSchema = z.object({
		orgId: z.string().uuid(),
	})

	const { orgId } = orgParamsSchema.parse(request.params)

	const orgRepository = new PrismaOrganisationsRepository()
	const orgService = new FetchOrgService(orgRepository)

	const { organisation } = await orgService.service({
		orgId,
	})

	return reply.status(200).send({ organisation })
}
