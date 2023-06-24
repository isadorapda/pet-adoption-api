import { OrganisationNoPassword, OrganisationRepository } from '@/repositories/organisation-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Pet } from '@prisma/client'


interface GetOrgProfileServiceRequest {
	orgId: string
    field?: string | keyof Pet
    order?: 'asc'| 'desc'
}
interface GetOrgProfileServiceResponse {
	organisation: OrganisationNoPassword
}

export class GetOrgProfileService {
	constructor(public organisationsRepository: OrganisationRepository) { }
	async service({
		orgId,field,order
	}: GetOrgProfileServiceRequest): Promise<GetOrgProfileServiceResponse> {
		const organisation = await this.organisationsRepository.findById(orgId,{field,order})

		if (!organisation) {
			throw new ResourceNotFoundError()
		}
		return { organisation }
	}
}
