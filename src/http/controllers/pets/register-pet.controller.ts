import {PrismaOrganisationsRepository} from '@/repositories/prisma/prisma-organisation-repository';
import {PrismaPetImagesRepository} from '@/repositories/prisma/prisma-pet-images-repository';
import {PrismaPetsRepository} from '@/repositories/prisma/prisma-pets-repository';
import {RegisterPetService} from '@/services/register-pet.service';
import {FastifyReply, FastifyRequest} from 'fastify';
import {z} from 'zod';

export enum MayLiveWith {
  CATS = 'CATS',
  DOGS = 'DOGS',
  CHILDREN = 'CHILDREN',
  ELDER = 'ELDER',
  ANY = 'ANY',
}
export enum PetSize {
  TINY = 'TINY',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  GIANT = 'GIANT',
}

export async function registerPetController(request: FastifyRequest, reply: FastifyReply) {
  const registerPetParamsSchema = z.object({
    organisationId: z.string().uuid(),
  });

  const registerPetBodySchema = z.object({
    name: z.string().min(2),
    pet_type: z.enum(['DOG', 'CAT']),
    age: z.coerce.number().gt(0),
    sex: z.enum(['MALE', 'FEMALE']),
    size: z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT']),
    description: z.string().max(1000).optional(),
    breed: z
      .string()
      .optional()
      .transform((val) => val?.toLowerCase().trim().replace(/\W/g, '_')),
    may_live_with: z.nativeEnum(MayLiveWith),
    ideal_home: z.string().max(500).optional(),
    pet_photos: z.array(z.string()).optional(),
  });

  const {organisationId} = registerPetParamsSchema.parse(request.params);

  console.log('ioadhioa', {req: request.body});

  const {
    name,
    age,
    breed,
    description,
    ideal_home,
    may_live_with,
    pet_type,
    sex,
    size,
    pet_photos,
  } = registerPetBodySchema.parse(request.body);

  console.log('ioadhioa', {pet_photos});

  const orgRepository = new PrismaOrganisationsRepository();
  const petRepository = new PrismaPetsRepository();
  const petImagesRepository = new PrismaPetImagesRepository();
  const registerPetService = new RegisterPetService(
    orgRepository,
    petRepository,
    petImagesRepository,
  );

  console.log({pet_photos});

  const {pet} = await registerPetService.registerPetService({
    organisationId,
    age,
    breed,
    description,
    ideal_home,
    may_live_with,
    pet_type,
    sex,
    size,
    name,
    pet_photos,
  });

  return reply.status(201).send(pet);
}
