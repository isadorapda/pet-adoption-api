import {app} from '@/app';
import {prisma} from '@/lib/prisma';
import {createAndAuthenticateOrganisation} from '@/utils/create-and-authenticate-org';
import request from 'supertest';

describe('Fetch breeds E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  test('should be able to list breeds', async () => {
    await createAndAuthenticateOrganisation(app);

    const org = await prisma.organisation.findFirstOrThrow();
    await prisma.pet.createMany({
      data: [
        {
          age: 3,
          breed: 'pug',
          may_live_with: 'ANY',
          name: 'Bob',
          pet_type: 'DOG',
          sex: 'MALE',
          size: 'SMALL',
          organisation_id: org.id,
        },
        {
          age: 3,
          breed: 'siamese',
          may_live_with: 'ANY',
          name: 'Lyra',
          pet_type: 'CAT',
          sex: 'FEMALE',
          size: 'SMALL',
          organisation_id: org.id,
        },
      ],
    });

    const breedResponse = await request(app.server).get('/pets/breeds').send();
    expect(breedResponse.statusCode).toEqual(200);
    expect(breedResponse.body.breeds).toEqual(expect.arrayContaining(['pug', 'siamese']));
  });
});
