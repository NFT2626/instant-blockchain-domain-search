import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:8000/subgraphs/name/saleel/domains';
const NEAR_RPC = 'https://rpc.mainnet.near.org/';
const WEB2_API = 'http://localhost:9000/';

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
