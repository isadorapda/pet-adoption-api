/* eslint-disable no-mixed-spaces-and-tabs */
import {
  OrganisationNoPassword,
  OrganisationRepository,
} from '@/repositories/organisation-repository';
import {ResourceNotFoundError} from './errors/resource-not-found-error';
import {PetType} from '@prisma/client';

interface FetchSortedPetsOrgServiceRequest {
  orgId: string;
  field: string;
  order: 'desc' | 'asc';
  petType?: PetType;
}
interface FetchSortedOrgServiceResponse {
  organisation: OrganisationNoPassword;
}

export class FetchSortedPetsOrgService {
  constructor(public organisationsRepository: OrganisationRepository) {}
  async service({
    orgId,
    field,
    order,
    petType,
  }: FetchSortedPetsOrgServiceRequest): Promise<FetchSortedOrgServiceResponse> {
    const organisation = await this.organisationsRepository.findSortedPetsByOrgId(orgId, {
      field,
      order,
      petType,
    });

    if (!organisation) {
      throw new ResourceNotFoundError();
    }
    console.log('ooooo', organisation);
    return {organisation};
  }
}
