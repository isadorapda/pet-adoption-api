import { Organisation, Prisma } from '@prisma/client'

export interface OrganisationRepository{
    create(data: Prisma.OrganisationCreateInput):Promise<Organisation>
    findByEmail(email: string):Promise<Organisation | null>
}