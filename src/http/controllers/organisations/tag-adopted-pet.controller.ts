import {PrismaPetsRepository} from '@/repositories/prisma/prisma-pets-repository';
import {TagPetAsAdoptedService} from '@/services/tag-adopted-pet.service';
import {FastifyReply, FastifyRequest} from 'fastify';
import {z} from 'zod';

export async function tagPetAsAdoptedController(request: FastifyRequest, reply: FastifyReply) {
  const tagAdoptedPetParamsSchema = z.object({
    petId: z.string().uuid(),
  });

  const {petId} = tagAdoptedPetParamsSchema.parse(request.params);

  const petRepository = new PrismaPetsRepository();
  const service = new TagPetAsAdoptedService(petRepository);

  const {pet} = await service.tagAdoptedPetService({petId});

  return reply.status(200).send({pet});
}
