const METALS_API = {
  id: 'metals',
  name: 'Metals API',
  apiBaseURL: 'https://metals-api.com/api',
  apiEndpoint: '/latest',
  apiKey: '***',
  params: {
    access_key: '[provider.apiKey]',
    base: '[asset.symbol]',
    symbols: CURRENCY.toUpperCase(),
  },
  response: {
    firstLevelKey: 'rates',
    secondLevelKey: CURRENCY.toUpperCase(),
  }
};
