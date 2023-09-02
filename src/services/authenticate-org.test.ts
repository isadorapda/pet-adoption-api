import {beforeEach, describe, expect, test} from 'vitest';
import {AuthenticateOrganisationService} from './authenticate-org.service';
import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {hash} from 'bcryptjs';
import {InvalidCredentialsError} from './errors/invalid-credentials-error';
import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';

let organisationRepository: InMemoryOrganisationsRepository;
let petsRepository: InMomoryPetsRepository;
let sut: AuthenticateOrganisationService;

describe('Authenticate Organisation Service', () => {
  beforeEach(() => {
    petsRepository = new InMomoryPetsRepository(organisationRepository);
    organisationRepository = new InMemoryOrganisationsRepository(petsRepository);
    sut = new AuthenticateOrganisationService(organisationRepository);
  });

  test('Should be able to authenticate an organisation login', async () => {
    await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });

    const {organisation} = await sut.authenticateOrgService({
      email: 'pet.org@email.com',
      password: '123456',
    });

    expect(organisation.id).toEqual(expect.any(String));
  });

  test('Should not be able to authenticate an organisation login with a wrong email', async () => {
    await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });
    await expect(() =>
      sut.authenticateOrgService({
        email: 'petOrg@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test('Should not be able to authenticate an organisation login with wrong password', async () => {
    await organisationRepository.create({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.authenticateOrgService({
        email: 'pet.org@email.com',
        password: '123457',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
