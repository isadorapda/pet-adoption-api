import {PrismaPetsRepository} from '@/repositories/prisma/prisma-pets-repository';
import {DeletePetService} from '@/services/delete-pet.service';
import {FastifyReply, FastifyRequest} from 'fastify';
import {z} from 'zod';

export async function deletePetController(request: FastifyRequest, reply: FastifyReply) {
  const deletePetParamsSchema = z.object({
    petId: z.string().uuid(),
  });

  const {petId} = deletePetParamsSchema.parse(request.params);

  const petRepository = new PrismaPetsRepository();
  const service = new DeletePetService(petRepository);

  await service.deletePetService({petId});

  return reply.status(200).send();
}
