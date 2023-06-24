import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { DeleteOrganisationService } from '@/services/delete-organisation-account.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteOrganisationController(request:FastifyRequest, reply:FastifyReply){
	const deleteOrganisationParamsSchema = z.object({
		orgId: z.string().uuid(),
	})

	const {orgId} = deleteOrganisationParamsSchema.parse(request.params)

	try {
		const organisationRepository = new PrismaOrganisationsRepository()
		const service = new DeleteOrganisationService(organisationRepository )
    
		await service.deleteOrganisationService({orgId})
    
		return reply.status(200).send()
	} catch (error) {
		console.error(error)
	}

}