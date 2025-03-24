const CURRENCY_API = {
  id: 'metals',
  name: 'Currency API',
  apiBaseURL: 'http://api.currencylayer.com',
  apiEndpoint: '/live',
  apiKey: process.env.REACT_APP_PROVIDER_METALS_CURRENCY_API_KEY,
  params: {
    access_key: '[provider.apiKey]',
    currencies: '[asset.symbol]',
  },
  response: {
    firstLevelKey: 'quotes',
    secondLevelKey: CURRENCY + '[asset.symbol]',
  },
};
