import {FastifyInstance} from 'fastify';
import {registerPetController} from './register-pet.controller';
import {searchPetController} from './search-pet.controller';
import {getPetDetailsController} from './get-pet-details.controller';
import {verifyJWT} from '@/http/middlewares/verify-jwt';
import {fetchBreedsController} from './fetch-breeds.controller';

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets/search', searchPetController);
  app.get('/pets/:petId/details', getPetDetailsController);
  app.get('/pets/breeds', fetchBreedsController);
  app.post('/organisations/:organisationId/pets', {onRequest: [verifyJWT]}, registerPetController);
}
