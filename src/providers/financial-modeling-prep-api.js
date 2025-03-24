const FINANCIAL_MODELING_PREP_API = {
  id: 'stocks',
  name: 'Financial Modeling Prep API',
  apiBaseURL: 'https://financialmodelingprep.com/api',
  apiEndpoint: '/quote/[asset.symbol]',
  apiKey: '***',
  apiVersion: 'v3',
  params: {
    apikey: '[provider.apiKey]',
  },
  response: {
    firstLevelKey: '0',
    secondLevelKey: 'price',
  },
};
