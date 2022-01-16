import { Providers } from './constants';

export function getRegistrationUrl(provider, name, tld) {
  if (provider === Providers.ENS) {
    return `https://app.ens.domains/name/${name}.${tld}/register`;
  }

  if (provider === Providers.UnstoppableDomains) {
    return `https://unstoppabledomains.com/search?searchTerm=${name}.${tld}`;
  }

  if (provider === Providers.UnstoppableDomains) {
    return `https://unstoppabledomains.com/search?searchTerm=${name}.${tld}`;
  }

  if (provider === Providers.Near) {
    return 'https://wallet.near.org/create';
  }

  if (provider === Providers.Web2) {
    if (tld === 'twitter') {
      return 'https://twitter.com/';
    }
    return `https://godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${name}.${tld}`;
  }

  return null;
}

export function validateName(provider, name) {
  if (provider === Providers.ENS) {
    return name.length >= 3;
  }

  return true;
}
