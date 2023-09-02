import {Organisation, Pet, Prisma} from '@prisma/client';
import {
  OrganisationNoPassword,
  OrganisationRepository,
  SortProps,
} from '../organisation-repository';
import {randomUUID} from 'node:crypto';
import {removePasswordHash, removePasswordHashes} from '@/utils/removePasswordHash';
import {EditOrganisationInput} from '@/types/organisation';
import {InMomoryPetsRepository} from './in-memory-pets-repository';

export class InMemoryOrganisationsRepository implements OrganisationRepository {
  constructor(private petsRepository: InMomoryPetsRepository) {}

  public orgs: Organisation[] = [];
  public partialOrgs: EditOrganisationInput[] = [];

  async create(data: Prisma.OrganisationCreateInput): Promise<OrganisationNoPassword> {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      postcode: data.postcode,
      city: data.city,
      mobile: data.mobile,
      password_hash: data.password_hash,
      address: data.address ?? null,
      created_at: new Date(),
    };

    this.orgs.push(org);
    return removePasswordHash(org);
  }
  async findByEmail(email: string): Promise<OrganisationNoPassword | null> {
    const organisation = this.orgs.find((org) => org.email === email);
    if (!organisation) {
      return null;
    }

    return removePasswordHash(organisation);
  }

  async findById(id: string): Promise<OrganisationNoPassword | null> {
    const organisation = this.orgs.find((org) => org.id === id);
    if (!organisation) {
      return null;
    }

    return removePasswordHash(organisation);
  }

  async findManyByCity(city: string): Promise<OrganisationNoPassword[] | null> {
    const organisation = this.orgs.filter((org) => org.city === city);
    if (!organisation) {
      return null;
    }

    return removePasswordHashes(organisation);
  }

  async save(data: EditOrganisationInput): Promise<Partial<OrganisationNoPassword>> {
    const orgIndex = this.partialOrgs.findIndex((org) => org.id === data.id);
    if (orgIndex !== -1) {
      this.partialOrgs[orgIndex] = data;
    }
    const {password_hash: _password_hash, ...org} = data;
    return org;
  }

  async deleteAccount(data: OrganisationNoPassword): Promise<void> {
    const orgIndex = this.orgs.findIndex((org) => org.id === data.id);
    if (orgIndex !== -1) {
      this.orgs.splice(orgIndex, 1);
    }
  }

  async findByEmailValidation(email: string): Promise<Organisation | null> {
    const organisation = this.orgs.find((org) => org.email === email);
    if (!organisation) {
      return null;
    }

    return organisation;
  }

  async findSortedPetsByOrgId(
    id: string,
    {field, order, petType}: SortProps,
  ): Promise<OrganisationNoPassword | null> {
    const organisation = this.orgs.find((org) => org.id === id);
    if (!organisation) {
      return null;
    }
    const parsedField = field as keyof Pet;

    const pets = this.petsRepository.pets.filter((pet) => pet.organisation_id === id);

    pets.sort((a, b) => {
      const aValue = a[parsedField] ?? a['created_at'];
      const bValue = b[parsedField] ?? b['created_at'];

      if (order === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    return removePasswordHash(organisation);
  }
}
