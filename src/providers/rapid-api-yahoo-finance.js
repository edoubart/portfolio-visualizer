const RAPID_API_YAHOO_FINANCE = {
  id: 'stocks',
  name: 'RapidAPI: Yahoo Finance by Api Dojo',
  apiBaseURL: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market',
  apiEndpoint: '/get-quotes',
  apiHost: 'apidojo-yahoo-finance-v1.p.rapidapi.com',
  apiKey: process.env.REACT_APP_PROVIDER_STOCKS_YAHOO_FINANCE_API_KEY,
  apiVersion: 'v2',
  headers: {
    'x-rapidapi-key': '[provider.apiKey]',
    'x-rapidapi-host': '[provider.apiHost]',
  },
  params: {
    region: REGION,
    symbols: '[asset.symbol]',
  },
  response: {
    firstLevelKey: '0',
    secondLevelKey: 'price',
  },
};
