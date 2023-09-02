import {Organisation} from '@prisma/client';

export function removePasswordHash(input: Organisation) {
  const {password_hash: _password_hash, ...org} = input;

  return org;
}

export function removePasswordHashes(input: Array<Organisation>) {
  return input.map(removePasswordHash);
}
