import {FastifyInstance} from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateOrganisation(app: FastifyInstance) {
  await request(app.server).post('/organisations').send({
    name: 'Pet Org',
    city: 'London',
    postcode: 'AB12 3CD',
    email: 'pet.adopt@email.com',
    mobile: '447123456789',
    address: '',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'pet.adopt@email.com',
    password: '123456',
  });
  const {token} = authResponse.body;

  return {token};
}
