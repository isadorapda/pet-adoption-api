import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrganisationRepository } from '@/repositories/organisation-repository'

interface DeleteOrganisationServiceRequest{
    orgId:string
}


export class DeleteOrganisationService{
	constructor(private organisationsRepository: OrganisationRepository){}

	async deleteOrganisationService({orgId}:DeleteOrganisationServiceRequest):Promise<void> {
		const organisation = await this.organisationsRepository.findById(orgId)

		if(!organisation){
			throw new ResourceNotFoundError()
		}
		await this.organisationsRepository.deleteAccount(organisation)
	}
}