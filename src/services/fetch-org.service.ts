import { OrganisationRepository } from '@/repositories/organisation-repository'
import { Organisation } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface FetchOrgServiceRequest {
  orgId: string
}
interface FetchOrgServiceResponse {
  organisation: Organisation
}

export class FetchOrgService {
	constructor(public organisationsRepository: OrganisationRepository) {}
	async service({
		orgId,
	}: FetchOrgServiceRequest): Promise<FetchOrgServiceResponse> {
		const organisation = await this.organisationsRepository.findById(orgId)

		if (!organisation) {
			throw new ResourceNotFoundError()
		}
		return { organisation }
	}
}
