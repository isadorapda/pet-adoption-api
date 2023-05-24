import { Organisation, Prisma } from '@prisma/client'
import { OrganisationRepository } from '../organisation-repository'
import { prisma } from '@/lib/prisma'

export class PrismaOrganisationsRepository implements OrganisationRepository {
	async findManyByCity(city: string): Promise<Organisation[]> {
		const orgs = await prisma.organisation.findMany({
			where: { city },
		})
		return orgs
	}
	async findById(id: string) {
		const organisation = await prisma.organisation.findUnique({
			where: { id },
			include: { pets: true },
		})
		return organisation
	}
	async findByEmail(email: string) {
		const organisation = await prisma.organisation.findUnique({
			where: { email },
		})
		return organisation
	}
	async create(data: Prisma.OrganisationCreateInput) {
		const organisation = await prisma.organisation.create({ data })
		return organisation
	}
}
