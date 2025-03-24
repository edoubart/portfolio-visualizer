const COIN_GECKO_API = {
  id: 'cryptos',
  name: 'Coin Gecko API',
  apiBaseURL: 'https://api.coingecko.com/api',
  apiEndpoint: '/simple/price',
  apiVersion: 'v3',
  params: {
    ids: '[asset.id]',
    vs_currencies: CURRENCY.toLowerCase(),
  },
  response: {
    firstLevelKey: '[asset.id]',
    secondLevelKey: CURRENCY.toLowerCase(),
  },
};
