import axios from 'axios';

const GRAPHQL_ENDPOINT = 'http://localhost:8000/subgraphs/name/saleel/domains';

const axiosInstance = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  method: 'POST'
});

export async function getNameDetails(name) {
  const { data } = await axiosInstance({
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
  ` }
  });

  if (data.errors) {
    throw new Error('Error while fetching data: ' + JSON.stringify(data.errors));
  }

  return data.data.domainName;
}