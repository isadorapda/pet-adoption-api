import { Organisation, Pet } from '@prisma/client'

export type EditOrganisationInput = Partial<Organisation> & Pick<Organisation, 'id'>
export type EditPetInput = Partial<Pet> & Pick<Pet, 'id'>