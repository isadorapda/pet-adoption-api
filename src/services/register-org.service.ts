import { OrganisationRepository } from '@/repositories/organisation-repository'
import { Organisation } from '@prisma/client'
import { hash } from 'bcryptjs'

interface RegisterOrganisationServiceRequest{
    name: string;
    email: string;
    city:string;
    address:string | null;
    password: string;
    mobile:string;
    postcode:string;
}
interface RegisterOrganisationServiceResponse{
    organisation:Organisation
}

export class RegisterOrganisationService{
	constructor(private organisationRepository:OrganisationRepository){}

	async registerOrgService({name,email,password,postcode,mobile,city,address}:RegisterOrganisationServiceRequest):Promise<RegisterOrganisationServiceResponse>{
		const password_hash = await hash(password,6)

		const emailAlreadyRegistered = await this.organisationRepository.findByEmail(email)

		if(emailAlreadyRegistered){
			throw new Error('Email already registered')
		}

		const organisation = await this.organisationRepository.create({
			name,
			email,
			password_hash,
			postcode,
			mobile,
			city,
			address
		})

		return {organisation}
	}
}