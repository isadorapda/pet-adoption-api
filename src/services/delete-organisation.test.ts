import {beforeEach, describe, expect, test} from 'vitest';
import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {hash} from 'bcryptjs';
import {DeleteOrganisationService} from './delete-organisation-account.service';

let organisationRepository: InMemoryOrganisationsRepository;
let sut: DeleteOrganisationService;
describe('Delete Organisation Profile Service', () => {
  beforeEach(() => {
    organisationRepository = new InMemoryOrganisationsRepository();
    sut = new DeleteOrganisationService(organisationRepository);
  });

  test("Should be able to delete an organisation's account", async () => {
    const org = await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });

    await sut.deleteOrganisationService({
      orgId: org.id,
    });

    expect(organisationRepository.orgs).toHaveLength(0);
  });
});
