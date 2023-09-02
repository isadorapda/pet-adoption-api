import {
  OrganisationNoPassword,
  OrganisationRepository,
} from '@/repositories/organisation-repository';
import {compare} from 'bcryptjs';
import {InvalidCredentialsError} from './errors/invalid-credentials-error';
import {removePasswordHash} from '@/utils/removePasswordHash';

interface AuthenticateOrganisationServiceRequest {
  email: string;
  password: string;
}
interface AuthenticateOrganisationServiceResponse {
  organisation: OrganisationNoPassword;
}

export class AuthenticateOrganisationService {
  constructor(private organisationRepository: OrganisationRepository) {}

  async authenticateOrgService({
    email,
    password,
  }: AuthenticateOrganisationServiceRequest): Promise<AuthenticateOrganisationServiceResponse> {
    const organisation = await this.organisationRepository.findByEmailValidation(email);

    if (!organisation) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, organisation.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {organisation: removePasswordHash(organisation)};
  }
}
