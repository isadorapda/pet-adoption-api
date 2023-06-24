import { EditOrganisationInput } from '@/types/organisation'
import { Organisation, Pet, Prisma } from '@prisma/client'

export type OrganisationNoPassword = Omit<Organisation, 'password_hash'> & { password_hash?: never }

export type SortProps = {
    field?: string | keyof Pet
    order?: 'asc'| 'desc'
} 
export interface OrganisationRepository {
    create(data: Prisma.OrganisationCreateInput): Promise<OrganisationNoPassword>
    findByEmail(email: string): Promise<OrganisationNoPassword | null>
    findById(id: string, {field,order}:SortProps): Promise<OrganisationNoPassword | null>
    findManyByCity(city: string): Promise<OrganisationNoPassword[] | null>
    save(data: EditOrganisationInput): Promise<Partial< OrganisationNoPassword>>
    deleteAccount(data:OrganisationNoPassword): Promise<void>
    findByEmailValidation(email: string): Promise<Organisation | null>
}