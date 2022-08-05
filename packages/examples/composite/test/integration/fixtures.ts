import nock from 'nock'

export const dataProviderConfig: {
  [index: string]: { providerUrlEnvVar: string; providerUrl: string }
} = {
  //The underlying adapters that this composite adapter invokes
  coingecko: {
    providerUrlEnvVar: 'COINGECKO_ADAPTER_URL',
    providerUrl: 'http://localhost:8081',
  },
  coinmarketcap: {
    providerUrlEnvVar: 'COINMARKETCAP_ADAPTER_URL',
    providerUrl: 'http://localhost:8082',
  },
}

export const mockDataProviderResponses = (): nock.Scope => {
  nock(dataProviderConfig.coinmarketcap.providerUrl)
    .post('/')
    .reply(
      200,
      {
        jobRunID: '1',
        providerStatusCode: 200,
        result: 3139.726053759448,
        statusCode: 200,
        data: {
          result: 3139.726053759448,
        },
      },
      [
        'X-Powered-By',
        'Express',
        'Content-Type',
        'application/json; charset=utf-8',
        'Content-Length',
        '714',
        'ETag',
        'W/"4c-80HqZxTKkxT2QbzJJxLmlKoGX1c"',
        'Date',
        'Mon, 20 Sep 2021 14:30:57 GMT',
        'Connection',
        'close',
      ],
    )

  nock(dataProviderConfig.coingecko.providerUrl)
    .post('/')
    .reply(
      200,
      {
        jobRunID: '1',
        providerStatusCode: 200,
        result: 3068.06,
        statusCode: 200,
        data: {
          result: 3068.06,
        },
      },
      [
        'X-Powered-By',
        'Express',
        'Content-Type',
        'application/json; charset=utf-8',
        'Content-Length',
        '714',
        'ETag',
        'W/"4c-80HqZxTKkxT2QbzJJxLmlKoGX1c"',
        'Date',
        'Mon, 20 Sep 2021 14:30:57 GMT',
        'Connection',
        'close',
      ],
    )
}
