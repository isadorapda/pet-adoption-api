import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {EditPetService} from './edit-pet.service';
import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';

let petsRepository: InMomoryPetsRepository;
let organisationRepository: InMemoryOrganisationsRepository;
let sut: EditPetService;

describe('Edit pet service', () => {
  beforeEach(() => {
    organisationRepository = new InMemoryOrganisationsRepository(petsRepository);
    petsRepository = new InMomoryPetsRepository(organisationRepository);
    sut = new EditPetService(petsRepository);
  });
  test('organisation should be able to edit pet information', async () => {
    const createPet = await petsRepository.create({
      name: 'Fiona',
      pet_type: 'DOG',
      age: 3,
      size: 'SMALL',
      may_live_with: 'ANY',
      sex: 'FEMALE',
      organisation_id: 'Org-01',
    });

    const {pet} = await sut.editPetService({
      breed: 'Pug',
      age: 7,
      petId: createPet.id,
    });

    expect(pet).toMatchObject({
      breed: 'Pug',
      age: 7,
      id: createPet.id,
    });
  });
});
