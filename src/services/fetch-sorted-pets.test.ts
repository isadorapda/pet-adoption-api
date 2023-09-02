import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';
import {FetchSortedPetsOrgService} from './fetch-sorted-pets-org.service';
import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {hash} from 'bcryptjs';

let orgRepository: InMemoryOrganisationsRepository;
let petsRepository: InMomoryPetsRepository;
let sut: FetchSortedPetsOrgService;

describe('Fetch list of sorted pets', () => {
  beforeEach(async () => {
    petsRepository = new InMomoryPetsRepository(orgRepository);
    orgRepository = new InMemoryOrganisationsRepository(petsRepository);
    sut = new FetchSortedPetsOrgService(orgRepository);
    await orgRepository.create({
      id: 'Org-01',
      name: 'Pet Org',
      city: 'Manchester',
      email: 'petrehome@email.com',
      mobile: '447123456789',
      postcode: 'MN12 3OP',
      password_hash: await hash('123456', 6),
    });
  });

  test('should be able to sort pets', async () => {
    await petsRepository.create({
      name: 'Fiona',
      pet_type: 'DOG',
      age: 9,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });
    await petsRepository.create({
      name: 'Lyra',
      pet_type: 'CAT',
      age: 4,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });
    await petsRepository.create({
      name: 'Zoe',
      pet_type: 'CAT',
      age: 1,
      sex: 'FEMALE',
      size: 'SMALL',
      may_live_with: 'ANY',
      organisation_id: 'Org-01',
    });

    const {organisation} = await sut.service({orgId: 'Org-01', field: 'age', order: 'asc'});
    // const orgTest = await orgRepository.orgs.
    // console.log('ORGA',orgTest)

    // expect(organisation).toMatchObject(

    // 	{pets: expect.arrayContaining([
    // 		expect.objectContaining({age:1}),
    // 		expect.objectContaining({age:4}),
    // 		expect.objectContaining({age:9}),
    // 	])}

    // )
  });
});
