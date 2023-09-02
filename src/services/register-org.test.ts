import {InMemoryOrganisationsRepository} from '@/repositories/in-memory/in-memory-org-repository';
import {beforeEach, describe, expect, test} from 'vitest';
import {RegisterOrganisationService} from './register-org.service';
import {compare, hash} from 'bcryptjs';
import {EmailAlreadyRegisteredError} from './errors/email-already-registered-error';
import {InMomoryPetsRepository} from '@/repositories/in-memory/in-memory-pets-repository';

let organisationsRepository: InMemoryOrganisationsRepository;
let petsRepository: InMomoryPetsRepository;
let sut: RegisterOrganisationService;

describe('Register Organisation Service', () => {
  beforeEach(() => {
    petsRepository = new InMomoryPetsRepository(organisationsRepository);
    organisationsRepository = new InMemoryOrganisationsRepository(petsRepository);
    sut = new RegisterOrganisationService(organisationsRepository);
  });

  test('Should be able to register an organisation', async () => {
    const {organisation} = await sut.registerOrgService({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password: '123456',
    });

    expect(organisation.id).toEqual(expect.any(String));
  });

  test("Organisation's password should be hashed upon registration", async () => {
    const {organisation} = await sut.registerOrgService({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: 'pet.org@email.com',
      mobile: '447123456789',
      address: '',
      password: '123456',
    });
    const password_hash = await hash('123456', 6);

    const isPasswordCorrectlyHashed = await compare('123456', password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);

    expect(organisation.id).toEqual(expect.any(String));
  });

  test('Should not be possible to register organisation with an already registered email', async () => {
    const email = 'pet.org@email.com';

    await sut.registerOrgService({
      name: 'Pet Org',
      city: 'London',
      postcode: 'AB12 3CD',
      email: email,
      mobile: '447123456789',
      address: '',
      password: '123456',
    });

    await expect(() =>
      sut.registerOrgService({
        name: 'Pet Org',
        city: 'London',
        postcode: 'AB12 3CD',
        email: email,
        mobile: '447123456789',
        address: '',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyRegisteredError);
  });
});
