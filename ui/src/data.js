import axios from 'axios';
import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';
import { BigNumber } from '@ethersproject/bignumber';
import { NFTContractAddresses, Providers } from './constants';

const GRAPHQL_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/saleel/domain-availability';
const NEAR_RPC = 'https://rpc.mainnet.near.org/';
const WEB2_API = 'http://localhost:9000/';
const OPENSEA_API = 'https://api.opensea.io/api/v1';
const OPENSEA_TOKEN = 'f87d8ef226cd45b0b89d7c4b001ff74d';

const axiosInstance = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  method: 'POST',
});

let ethController;
export async function getNameDetails(name) {
  if (ethController) {
    ethController.abort();
  }

  ethController = new AbortController();

  const { data } = await axiosInstance({
    signal: ethController.signal,
    data: {
      query: `
      {
        domainName(id: "${name}") {
          id
          name
          eth {
            owner
            expires
          }
          crypto {
            owner
            expires
          }
          zil {
            owner
            expires
          }
          coin {
            owner
            expires
          }
          wallet {
            owner
            expires
          }
          bitcoin {
            owner
            expires
          }
          x {
            owner
            expires
          }
          _888 {
            owner
            expires
          }
          nft {
            owner
            expires
          }
          dao {
            owner
            expires
          }
          blockchain {
            owner
            expires
          }
        }
      }
  `,
    },
  });

  ethController = null;

  if (data.errors) {
    throw new Error(`Error while fetching data: ${JSON.stringify(data.errors)}`);
  }

  return data.data.domainName;
}

let nearRpcQueryId = 100;
let nearController;
export async function getNearNameDetails(name) {
  nearRpcQueryId += 1;

  if (nearController) {
    nearController.abort();
  }

  nearController = new AbortController();

  const nearName = `${name}.near`;
  const { data } = await axios(NEAR_RPC, {
    method: 'POST',
    data: {
      id: nearRpcQueryId,
      jsonrpc: '2.0',
      method: 'query',
      params: { request_type: 'view_account', account_id: nearName, finality: 'optimistic' },
    },
    signal: nearController.signal,
  });

  nearController = null;

  if (data?.error?.cause?.name === 'UNKNOWN_ACCOUNT') {
    return null;
  }

  return {
    name,
    near: {
      tld: 'near',
      owner: nearName,
      expires: 0,
    },
  };
}

let web2Controller;
export async function getWeb2Details(name) {
  if (web2Controller) {
    web2Controller.abort();
  }

  web2Controller = new AbortController();

  const { data } = await axios(WEB2_API, {
    method: 'GET',
    params: {
      name,
    },
    signal: web2Controller.signal,
  });

  web2Controller = null;

  return data;
}

export async function getDomainListings(name) {
  const labelHash = keccak256(toUtf8Bytes(name));
  const ensTokenId = BigNumber.from(labelHash).toString();

  let urlParams = [ensTokenId].map((e) => `token_ids=${e}`);
  urlParams = urlParams.concat([NFTContractAddresses[Providers.ENS]].map((e) => `asset_contract_addresses=${e}`));

  const { data } = await axios.get(`${OPENSEA_API}/assets?${urlParams.join('&')}`, {
    headers: {
      'X-API-KEY': OPENSEA_TOKEN,
    },
  });

  if (data && data.assets) {
    return data.assets.map((datum) => {
      if (!datum.orders && !datum.sell_orders) {
        return null;
      }

      let currentPrice = datum.orders?.[0]?.current_price;
      if (!currentPrice && datum.sell_orders) {
        currentPrice = datum.sell_orders?.[0]?.current_price;
      }

      currentPrice = Number(currentPrice ?? 0) / (10 ** 18); // Convert to normal price

      return {
        name: datum.name,
        currentPrice,
        currency: 'Ξ',
        link: datum.permalink,
      };
    }).filter(Boolean);
  }

  return [];
}
