import { OrganisationRepository } from '@/repositories/organisation-repository'
import { Organisation } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateOrganisationServiceRequest{
    email:string
    password:string
}
interface AuthenticateOrganisationServiceResponse{
    organisation:Organisation
}

export class AuthenticateOrganisationService{
	constructor(private organisationRepository:OrganisationRepository){}

	async authenticateOrgService({email,password}:AuthenticateOrganisationServiceRequest):Promise<AuthenticateOrganisationServiceResponse> {
		const organisation = await this.organisationRepository.findByEmail(email)

		if(!organisation){
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatch = await compare(password,organisation.password_hash)

		if(!doesPasswordMatch){
			throw new InvalidCredentialsError()
		}

		return {organisation}
	}
}