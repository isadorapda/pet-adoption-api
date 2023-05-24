import { OrganisationRepository } from '@/repositories/organisation-repository'
import { Organisation } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'


interface GetOrgProfileServiceRequest {
  orgId: string
}
interface GetOrgProfileServiceResponse {
organisation : Organisation
}

export class GetOrgProfileService {
	constructor(public organisationsRepository: OrganisationRepository) {}
	async service({
		orgId,
	}: GetOrgProfileServiceRequest): Promise<GetOrgProfileServiceResponse> {
		const organisation = await this.organisationsRepository.findById(orgId)

		if (!organisation) {
			throw new ResourceNotFoundError()
		}
		return { organisation }
	}
}
