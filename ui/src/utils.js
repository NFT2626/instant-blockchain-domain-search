import { Providers } from './constants';

export function getRegistrationUrl(provider, name, tld) {
  if (provider === Providers.ENS) {
    return `https://app.ens.domains/name/${name}.${tld}/register`;
  }

  return null;
}

export function validateName(provider, name) {
  if (provider === Providers.ENS) {
    return name.length >= 3;
  }

  return true;
}
