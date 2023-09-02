import {Organisation, Pet, Prisma} from '@prisma/client';

export type EditOrganisationInput = Partial<Organisation> & Pick<Organisation, 'id'>;
export type EditPetInput = Prisma.PetUpdateInput & Pick<Pet, 'id'>;
