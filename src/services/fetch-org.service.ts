/* eslint-disable no-mixed-spaces-and-tabs */
import {
	OrganisationNoPassword,
	OrganisationRepository,
} from '@/repositories/organisation-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { PetType } from '@prisma/client'

interface FetchOrgServiceRequest {
    orgId: string
    field: string
    order: 'desc' | 'asc'
    petType?: PetType
}
interface FetchOrgServiceResponse {
    organisation: OrganisationNoPassword
}

export class FetchOrgService {
	constructor(public organisationsRepository: OrganisationRepository) { }
	async service({
		orgId,
		field,
		order,
		petType
	}: FetchOrgServiceRequest): Promise<FetchOrgServiceResponse> {
		const organisation =
            await this.organisationsRepository.findSortedPetsByOrgId(orgId, {
            	field,
            	order,
            	petType
            })

		if (!organisation) {
			throw new ResourceNotFoundError()
		}

		return { organisation }
	}
}
