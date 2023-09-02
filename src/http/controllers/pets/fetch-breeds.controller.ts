import {PrismaPetsRepository} from '@/repositories/prisma/prisma-pets-repository';
import {FetchBreedsService} from '@/services/fetch-pet-breeds.service';
import {FastifyReply, FastifyRequest} from 'fastify';

export async function fetchBreedsController(request: FastifyRequest, reply: FastifyReply) {
  const petsRepository = new PrismaPetsRepository();
  const fetchBreedsService = new FetchBreedsService(petsRepository);

  const {breeds} = await fetchBreedsService.fetchBreedsService();

  return reply.status(200).send({breeds});
}
