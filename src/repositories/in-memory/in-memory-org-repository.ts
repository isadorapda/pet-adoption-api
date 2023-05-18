import { Organisation, Prisma } from '@prisma/client'
import { OrganisationRepository } from '../organisation-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrganisationsRepository implements OrganisationRepository{
	public orgs: Organisation[] = []

	async create(data: Prisma.OrganisationCreateInput): Promise<Organisation> {
		const org = {
			id: data.id ?? randomUUID(),
			name: data.name,
			email: data.email,
			postcode: data.postcode,
			city: data.city,
			mobile: data.mobile,
			password_hash: data.password_hash,
			address: data.address??null,
		}

		this.orgs.push(org)
		return org

	}
	async findByEmail(email: string): Promise<Organisation | null> {
		const organisation  = this.orgs.find((org)=>org.email === email)
		if(!organisation) {
			return null
		}

		return organisation
	}
	async findById(id: string): Promise<Organisation | null> {
		const organisation  = this.orgs.find((org)=>org.id === id)
		if(!organisation) {
			return null
		}

		return organisation
	}
	async findManyByCity(city: string){
		const organisation  = this.orgs.filter((org)=>org.city === city)
		if(!organisation) {
			return null
		}

		return organisation
	}


}