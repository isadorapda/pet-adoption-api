import {PrismaOrganisationsRepository} from '@/repositories/prisma/prisma-organisation-repository';
import {FetchSortedPetsOrgService} from '@/services/fetch-sorted-pets-org.service';
import {FastifyReply, FastifyRequest} from 'fastify';
import {z} from 'zod';

export async function fetchOrgSortedPetsController(request: FastifyRequest, reply: FastifyReply) {
  const sortPetsQuerySchema = z.object({
    field: z.string().default('created_at'),
    order: z.union([z.literal('asc'), z.literal('desc')]).default('desc'),
    petType: z.enum(['DOG', 'CAT']).optional(),
  });

  const sort = sortPetsQuerySchema.parse(request.query);
  const {field, order, petType} = sort;

  const orgParamsSchema = z.object({
    orgId: z.string().uuid(),
  });

  const {orgId} = orgParamsSchema.parse(request.params);

  const orgRepository = new PrismaOrganisationsRepository();
  const orgService = new FetchSortedPetsOrgService(orgRepository);

  const {organisation} = await orgService.service({
    orgId,
    field,
    order,
    petType,
  });

  return reply.status(200).send({user: organisation});
}
