/* eslint-disable no-mixed-spaces-and-tabs */
import {
  OrganisationNoPassword,
  OrganisationRepository,
} from '@/repositories/organisation-repository';
import {ResourceNotFoundError} from './errors/resource-not-found-error';

interface FetchOrgServiceRequest {
  orgId: string;
}
interface FetchSortedOrgServiceResponse {
  organisation: OrganisationNoPassword;
}

export class FetchOrgService {
  constructor(public organisationsRepository: OrganisationRepository) {}
  async service({orgId}: FetchOrgServiceRequest): Promise<FetchSortedOrgServiceResponse> {
    const organisation = await this.organisationsRepository.findById(orgId);

    if (!organisation) {
      throw new ResourceNotFoundError();
    }

    return {organisation};
  }
}
