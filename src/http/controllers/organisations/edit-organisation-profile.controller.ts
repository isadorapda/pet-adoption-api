import { PrismaOrganisationsRepository } from '@/repositories/prisma/prisma-organisation-repository'
import { EditOrganisationProfileService } from '@/services/edit-organisation-profile.service'
import { EmailAlreadyRegisteredError } from '@/services/errors/email-already-registered-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'


const editOrganisationProfileParamsSchema = z.object({
	orgId: z.string().uuid(),
})

const editOrgBodySchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	password: z.string().min(6).optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	postcode: z.string().min(5).optional(),
	mobile: z.string().min(9).trim().regex(/^[1-9]\d*$/g).optional(),
})

export async function editOrganisationController(
	request: FastifyRequest,
	reply: FastifyReply
) {

	const {orgId} = editOrganisationProfileParamsSchema.parse(request.params)
	const body =
    editOrgBodySchema.parse(request.body)
	try{
		const orgRepository = new PrismaOrganisationsRepository()
		const orgService = new EditOrganisationProfileService(orgRepository)
		const { organisation } = await orgService.editOrgProfileService({
			orgId,
			...body
		})
		return reply.status(200).send(organisation)
	} catch (error) {
		if (error instanceof EmailAlreadyRegisteredError) {
			return reply.status(409).send({
				message: error.message,
			})
		}
		throw error
	}	
}