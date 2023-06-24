
import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { GetOrgProfileService } from '@/services/fetch-org-profile.service'
import { FastifyReply, FastifyRequest } from 'fastify'


export async function profileController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const orgRepository = new PrismaOrganisationsRepository()
	const orgService = new GetOrgProfileService(orgRepository)
	const { organisation } = await orgService.service({
		orgId: request.user.sub
	})

	return reply.status(200).send(
		{user:organisation})
}