import {beforeEach, describe, expect, test} from 'vitest';
import {EditOrganisationProfileService} from './edit-organisation-profile.service';
import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {hash} from 'bcryptjs';
import {EmailAlreadyRegisteredError} from './errors/email-already-registered-error';
import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';

let organisationRepository: InMemoryOrganisationsRepository;
let petsRepository: InMomoryPetsRepository;
let sut: EditOrganisationProfileService;
describe('Edit Organisation Profile Service', () => {
  beforeEach(() => {
    petsRepository = new InMomoryPetsRepository(organisationRepository);
    organisationRepository = new InMemoryOrganisationsRepository(petsRepository);
    sut = new EditOrganisationProfileService(organisationRepository);
  });

  test("Should be able to edit an organisation's information in its profile", async () => {
    const org = await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });

    const {organisation} = await sut.editOrgProfileService({
      orgId: org.id,
      mobile: '44700456789',
      address: 'New Avenue, 123',
    });

    expect(organisation).toMatchObject({
      mobile: '44700456789',
      address: 'New Avenue, 123',
    });
  });

  test('Should not be able to update email to an already registered email', async () => {
    await organisationRepository.create({
      name: 'Org 2',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });
    const org = await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.editOrgProfileService({
        orgId: org.id,
        email: 'org@email.com',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });
});
