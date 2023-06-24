import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrganisationRepository, SortProps } from '@/repositories/organisation-repository'

interface DeleteOrganisationServiceRequest{
    orgId:string
    sort:SortProps
}


export class DeleteOrganisationService{
	constructor(private organisationsRepository: OrganisationRepository){}

	async deleteOrganisationService(orgProps:DeleteOrganisationServiceRequest):Promise<void> {
		const {orgId} = orgProps
		const organisation = await this.organisationsRepository.findById(orgId)

		if(!organisation){
			throw new ResourceNotFoundError()
		}
		await this.organisationsRepository.deleteAccount(organisation)
	}
}