export const Providers = {
  ENS: 'ENS',
  UnstoppableDomains: 'UnstoppableDomains',
};

export const ProviderTLDMapping = {
  ENS: ['eth'],
  UnstoppableDomains: [
    'crypto',
    'coin',
    'wallet',
    'bitcoin',
    'x',
    'nft',
    'dao',
    'blockchain',
    'zil',
    '888',
  ],
};

// Needed because numbers cannot be field names in GraphQL (.888)
export const TLDResponseMapping = {
  eth: 'eth',
  crypto: 'crypto',
  zil: 'zil',
  coin: 'coin',
  wallet: 'wallet',
  bitcoin: 'bitcoin',
  x: 'x',
  888: '_888',
  nft: 'nft',
  dao: 'dao',
  blockchain: 'blockchain',
};
