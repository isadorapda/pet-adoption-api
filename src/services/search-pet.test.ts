import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';
import {SearchPetService} from './search-pet.service';
import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {hash} from 'bcryptjs';

let petsRepo: InMomoryPetsRepository;
let orgsRepo: InMemoryOrganisationsRepository;
let sut: SearchPetService;

describe('Search Pet', () => {
  beforeEach(async () => {
    orgsRepo = new InMemoryOrganisationsRepository(petsRepo);
    petsRepo = new InMomoryPetsRepository(orgsRepo);
    sut = new SearchPetService(petsRepo);

    await orgsRepo.create({
      id: 'Org-01',
      name: 'Pet Org',
      city: 'Manchester',
      email: 'petrehome@email.com',
      mobile: '07123456789',
      postcode: 'MN12 3OP',
      password_hash: await hash('123456', 6),
    });
  });

  test('Should be able to search pet by city ', async () => {
    await petsRepo.create({
      name: 'Fiona',
      pet_type: 'DOG',
      age: 3,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });
    await petsRepo.create({
      name: 'Lyra',
      pet_type: 'CAT',
      age: 4,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });

    const {pets} = await sut.searchPetService({
      location: 'Manchester',
      limit: 20,
      field: 'created_at',
      order: 'desc',
      page: 1,
    });

    expect(pets).toHaveLength(2);
    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Fiona',
      }),
      expect.objectContaining({
        name: 'Lyra',
      }),
    ]);
  });

  test('Should be able to fetch paginated pet search', async () => {
    for (let i = 1; i <= 22; i++) {
      await petsRepo.create({
        name: `Fiona ${i}`,
        pet_type: 'DOG',
        age: 3,
        sex: 'FEMALE',
        size: 'SMALL',
        may_live_with: 'ANY',
        organisation_id: 'Org-01',
      });
    }

    const {pets} = await sut.searchPetService({
      location: 'Manchester',
      limit: 20,
      field: 'created_at',
      order: 'desc',
      page: 2,
    });

    expect(pets).toHaveLength(2);
    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Fiona 21',
      }),
      expect.objectContaining({
        name: 'Fiona 22',
      }),
    ]);
  });

  test('Should be able to filter pets', async () => {
    await petsRepo.create({
      name: 'Fiona',
      pet_type: 'DOG',
      age: 3,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });
    await petsRepo.create({
      name: 'Martin',
      pet_type: 'DOG',
      age: 3,
      sex: 'MALE',
      may_live_with: 'ANY',
      size: 'LARGE',
      organisation_id: 'Org-01',
    });
    await petsRepo.create({
      name: 'Lyra',
      pet_type: 'CAT',
      age: 4.5,
      sex: 'FEMALE',
      size: 'TINY',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });

    const {pets} = await sut.searchPetService({
      location: 'Manchester',
      pet_type: 'CAT',
      age_min: 4,
      age_max: 5.9,
      limit: 20,
      field: 'created_at',
      order: 'desc',
      page: 1,
    });

    expect(pets).toHaveLength(1);
    expect(pets).toEqual([
      expect.objectContaining({
        name: 'Lyra',
      }),
    ]);
  });
});
