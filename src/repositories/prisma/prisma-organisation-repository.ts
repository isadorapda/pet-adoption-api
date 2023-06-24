import {  Organisation, Prisma } from '@prisma/client'
import {  OrganisationNoPassword, OrganisationRepository, SortProps } from '../organisation-repository'
import { prisma } from '@/lib/prisma'
import { EditOrganisationInput } from '@/types/organisation'
import { removePasswordHash, removePasswordHashes } from '@/utils/removePasswordHash'

export class PrismaOrganisationsRepository implements OrganisationRepository {
	
	async findManyByCity(city: string) {
		const orgs = await prisma.organisation.findMany({
			where: { city },
		})

		return removePasswordHashes(orgs)
	}

	async findById(id: string) {
		const organisation = await prisma.organisation.findUnique({
			where: { id },
			include: { pets: true },
		})

		if (!organisation) {
			return null
		}

		return removePasswordHash(organisation)
	}

	async findByEmail(email: string) {
		const organisation = await prisma.organisation.findUnique({
			where: { email },
		})

		if(!organisation) {
			return null
		}

		return removePasswordHash(organisation)

	}

	async  findByEmailValidation(email: string): Promise<Organisation | null> {
		return await prisma.organisation.findUnique({
			where: { email },
		})
	}

	async create(data: Prisma.OrganisationCreateInput) {
		const organisation = await prisma.organisation.create({ data })
		
		return removePasswordHash(organisation)
	}

	async save({ id, ...data }: EditOrganisationInput) {
		const  organisation  = await prisma.organisation.update({
			where: {
				id
			},
			data
		})

		return removePasswordHash(organisation)
	}

	async  deleteAccount(data: OrganisationNoPassword): Promise<void> {
		const deletePets = prisma.pet.deleteMany({
			where: {
				organisation:{
					id: data.id,
				}
			}
		})
		const deleteOrganisation = prisma.organisation.delete({
			where: { id: data.id },
		})

		await prisma.$transaction([deletePets,deleteOrganisation])
	}
	async findSortedPetsByOrgId(id: string, { field, order,petType }: SortProps): Promise<OrganisationNoPassword | null> {

		const organisation = await prisma.organisation.findUnique({
			where: { id },
			include: { pets: {
				orderBy:{
					[field]: order,
				},
				
				where: petType ? {
					pet_type: petType,
				} : undefined,
            
			} },
		})
    
		if (!organisation) {
			return null
		}
    
		return removePasswordHash(organisation)
        
	}
}
