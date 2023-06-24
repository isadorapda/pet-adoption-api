import { OrganisationNoPassword, OrganisationRepository } from '@/repositories/organisation-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { EmailAlreadyRegisteredError } from './errors/email-already-registered-error'

interface EditOrganisationProfileServiceRequest {
	orgId: string
	name?: string
	email?: string
	city?: string
	address?: string
	password?: string
	mobile?: string
	postcode?: string
}
interface EditOrganisationProfileServiceResponse {
	organisation: Partial<OrganisationNoPassword>
}

export class EditOrganisationProfileService {
	constructor(private organisationRepository: OrganisationRepository) { }

	async editOrgProfileService(
		input: EditOrganisationProfileServiceRequest
	): Promise<EditOrganisationProfileServiceResponse> {
		const { email, password, orgId } = input

		const organisation = await this.organisationRepository.findById(orgId)

		if (!organisation) {
			throw new ResourceNotFoundError()
		}

		let password_hash
		let emailAlreadyRegistered
		if (password) {
			password_hash = await hash(password, 6)
		}
		if (email && email !== organisation.email) {
			emailAlreadyRegistered = await this.organisationRepository.findByEmail(
				email
			)
		}
		if (emailAlreadyRegistered) {
			throw new EmailAlreadyRegisteredError()
		}

		console.log('banana')

		const { orgId: id, ...parsedInput } = input

		const updatedOrganisation = await this.organisationRepository.save({
			...parsedInput,
			password_hash,
			id,
		})

		return { organisation: updatedOrganisation }
	}
}
