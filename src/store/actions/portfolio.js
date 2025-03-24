// Custom Modules
import {
  FETCH_CRYPTOS_REQUEST,
  FETCH_CRYPTOS_SUCCESS,
  FETCH_CRYPTOS_FAILURE,
  FETCH_METALS_REQUEST,
  FETCH_METALS_SUCCESS,
  FETCH_METALS_FAILURE,
  FETCH_STOCKS_REQUEST,
  FETCH_STOCKS_SUCCESS,
  FETCH_STOCKS_FAILURE,
  UPDATE_PORTFOLIO_ALLOCATIONS,
  UPDATE_PORTFOLIO_VALUES,
} from './../actionTypes';

import {
  gatherAssetIdsByAssetClassId,
  gatherAssetSymbolsByAssetClassId,
} from './../../helpers';

// Data
import cryptosFixture from './../../fixtures/recommended-portfolio/cryptos.json';
import metalsFixture from './../../fixtures/recommended-portfolio/metals.json';
import stocksFixture from './../../fixtures/recommended-portfolio/stocks.json';

// Constants
const ASSET_CLASS_ID_CRYPTOS = 'cryptos';
const ASSET_CLASS_ID_METALS = 'metals';
const ASSET_CLASS_ID_STOCKS = 'stocks';
const CURRENCY = 'USD';
const HEADERS_CONTENT_TYPE_KEY = 'Content-Type';
const HEADERS_CONTENT_TYPE_VALUE = 'application/json';
const METHOD = 'GET';
const MODE = 'cors';
const REGION = 'US';

const PROVIDERS = {
  'cryptos': {
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
  },
  'metals': {
    id: 'metals',
    name: 'Currency API',
    apiBaseURL: 'http://api.currencylayer.com',
    apiEndpoint: '/live',
    apiKey: process.env.REACT_APP_PROVIDER_METALS_CURRENCY_LAYER_API_KEY,
    params: {
      access_key: '[provider.apiKey]',
      currencies: '[asset.symbol]',
    },
    response: {
      firstLevelKey: 'quotes',
      secondLevelKey: CURRENCY + '[asset.symbol]',
    },
  },
  'stocks': {
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
  },
};

function getHeaders(assetClassId) {
  let headers;

  const provider = PROVIDERS[assetClassId];

  if (provider) {
    switch (assetClassId) {
      case ASSET_CLASS_ID_STOCKS:
        headers = Object.keys(provider.headers)
          .reduce((results, id) => {
            return {
              ...results,
              [id]: provider.headers[id]
                .replace(/\[(.*?)\]/, (match, p) => {
                  let result;

                  const ps = p.split('.');
                  const object = ps[0];
                  const property = ps[1];

                  if (object === 'provider') {
                    result = provider[property];
                  }

                  return result;
                }),
            };
          }, {});

        break;
      default:
        console.log('Asset Class Not Supported');
    }
  }
  else {
    console.log('Asset Class Not Supported');
  }

  return headers;
}

function getURL(assetIdsOrSymbols, assetClassId) {
  let url;

  const provider = PROVIDERS[assetClassId];

  if (provider) {
    switch (assetClassId) {
      case ASSET_CLASS_ID_CRYPTOS:
        url = provider.apiBaseURL
          + (provider.apiVersion ? '/' + provider.apiVersion : '')
          + provider.apiEndpoint
          + '?'
          + getQueryStringParameters(assetIdsOrSymbols, assetClassId);

        break;
      case ASSET_CLASS_ID_METALS:
        url = provider.apiBaseURL
          + (provider.apiVersion ? '/' + provider.apiVersion : '')
          + provider.apiEndpoint
          .replace(/\[(.*?)\]/, (match, p) => {
            let result;

            const ps = p.split('.');
            const object = ps[0];
            const property = ps[1];

            if (object === 'asset') {
              result = Object
                .keys(assetIdsOrSymbols)
                .map(id => assetIdsOrSymbols)
                .join(',');
            }
            else if (object === 'provider') {
              result = provider[property];
            }

            return result;
          })
          + '?'
          + getQueryStringParameters(assetIdsOrSymbols, assetClassId);
        break;
      case ASSET_CLASS_ID_STOCKS:
        url = provider.apiBaseURL
          + (provider.apiVersion ? '/' + provider.apiVersion : '')
          + provider.apiEndpoint
          .replace(/\[(.*?)\]/, (match, p) => {
            let result;

            const ps = p.split('.');
            const object = ps[0];
            const property = ps[1];

            if (object === 'asset') {
              result = Object
                .keys(assetIdsOrSymbols)
                .map(id => assetIdsOrSymbols)
                .join(',');
            }
            else if (object === 'provider') {
              result = provider[property];
            }

            return result;
          })
          + '?'
          + getQueryStringParameters(assetIdsOrSymbols, assetClassId);
        break;
      default:
        console.log('Asset Class Not Supported');
    }
  }
  else {
    console.log('Asset Class Not Supported');
  }

  return url;
}

function getQueryStringParameters(assetIdsOrSymbols, assetClassId) {
  let queryStrings;

  const provider = PROVIDERS[assetClassId];

  if (provider) {
    let params = Object
      .keys(provider.params)
      .reduce((params, id) => {
        return {
          ...params,
          [id]: provider.params[id]
            .replace(/\[(.*?)\]/, (match, p) => {
              let result;

              const ps = p.split('.');
              const object = ps[0];
              const property = ps[1];

              if (object === 'asset') {
                result = assetIdsOrSymbols.join(',');
              }
              else if (object === 'provider') {
                result = provider[property];
              }

              return result;
            }),
        };
      }, {});

    queryStrings = new URLSearchParams(params);
  }
  else {
    console.log('Asset Class Not Supported');
  }

  return queryStrings;
}

function traverseCryptos(portfolio, assetClassId, data, id = null) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    if (asset.type === 'crypto') {
      if (data.hasOwnProperty(id)) {
        const price = data[id]['usd'];

        result = {
          ...asset,
          price,
          value: asset.quantity * price,
        };
      }
      else {
        result = {
          ...asset,
        };
      }
    }
    else {
      result = {
        ...asset,
      };
    }
  }
  else {
    result = {
      ...portfolio,
      children: Object.keys(portfolio.children)
        .reduce((results, id) => {
          return {
            ...results,
            [id]: traverseCryptos(
              portfolio.children[id],
              assetClassId,
              data,
              id
            ),
          };
        }, {}),
    };
  }

  return result;
}

function traverseMetals(portfolio, assetClassId, data) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    if (asset.type === 'metal') {
      if (data['quotes'].hasOwnProperty(CURRENCY + asset.symbol)) {
        const price = 1 / data['quotes'][CURRENCY + asset.symbol];

        result = {
          ...asset,
          price,
          value: asset.quantity * price,
        };
      }
      else {
        result = {
          ...asset,
        };
      }
    }
    else {
      result = {
        ...asset,
      };
    }
  }
  else {
    result = {
      ...portfolio,
      children: Object.keys(portfolio.children)
        .reduce((results, id) => {
          return {
            ...results,
            [id]: traverseMetals(
              portfolio.children[id],
              assetClassId,
              data
            ),
          };
        }, {}),
    };
  }

  return result;
}

function traverseStocks(portfolio, assetClassId, data) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    if (asset.type === 'stock') {
      const datum = data['quoteResponse']['result']
        .find(d => d.symbol === asset.symbol)
      if (datum) {
        const price = datum['regularMarketPrice'];

        result = {
          ...asset,
          price,
          value: asset.quantity * price,
        };
      }
      else {
        result = asset;
      }
    }
    else {
      result = asset;
    }
  }
  else {
    result = {
      ...portfolio,
      children: Object.keys(portfolio.children)
      .reduce((results, id) => {
        return {
          ...results,
          [id]: traverseStocks(
            portfolio.children[id],
            assetClassId,
            data
          ),
        };
      }, {}),
    }
  }

  return result;
}

function getResponseValue(portfolio, assetClassId, data) {
  let result;

  switch (assetClassId) {
    case ASSET_CLASS_ID_CRYPTOS:
      result = traverseCryptos(portfolio, assetClassId, data);

      break;
    case ASSET_CLASS_ID_METALS:
      result = traverseMetals(portfolio, assetClassId, data);

      break;
    case ASSET_CLASS_ID_STOCKS:
      result = traverseStocks(portfolio, assetClassId, data);

      break;
    default:
      console.log('Asset Class Not Supported');
  }

  return result;
}

function fetchCryptosRequest(portfolio, dispatch) {
  dispatch({
    type: FETCH_CRYPTOS_REQUEST,
  });

  const cryptoIds = gatherAssetIdsByAssetClassId(
    portfolio,
    ASSET_CLASS_ID_CRYPTOS
  );

  const url = getURL(
    cryptoIds,
    ASSET_CLASS_ID_CRYPTOS
  );

  if (process.env.REACT_APP_STANDALONE === 'on') {
    setTimeout(() => {
      dispatch(
        fetchCryptosSuccess(
          getResponseValue(portfolio, ASSET_CLASS_ID_CRYPTOS, cryptosFixture)
        )
      );
    }, process.env.REACT_APP_STANDALONE_DELAY);
  }
  else {
    fetch(url, {
      headers: {
        [HEADERS_CONTENT_TYPE_KEY]: HEADERS_CONTENT_TYPE_VALUE,
      },
      method: METHOD,
      mode: MODE,
    })
      .then(response => response.json())
      .then(data => {
        dispatch(
          fetchCryptosSuccess(
            getResponseValue(portfolio, ASSET_CLASS_ID_CRYPTOS, data)
          )
        );
      })
      .catch((error) => {
        dispatch(fetchCryptosFailure(error));
      });
  }
}

function fetchCryptosSuccess(data) {
  return {
    payload: data,
    type: FETCH_CRYPTOS_SUCCESS,
  };
}

function fetchCryptosFailure(data) {
  return {
    payload: data,
    type: FETCH_CRYPTOS_FAILURE,
  };
}

function fetchMetalsRequest(portfolio, dispatch) {
  dispatch({
    type: FETCH_METALS_REQUEST,
  });

  const metalSymbols = gatherAssetSymbolsByAssetClassId(
    portfolio,
    ASSET_CLASS_ID_METALS
  );

  const url = getURL(
    metalSymbols,
    ASSET_CLASS_ID_METALS
  );

  if (process.env.REACT_APP_STANDALONE === 'on') {
    setTimeout(() => {
      dispatch(
        fetchMetalsSuccess(
          getResponseValue(portfolio, ASSET_CLASS_ID_METALS, metalsFixture)
        )
      );
    }, process.env.REACT_APP_STANDALONE_DELAY);
  }
  else {
    fetch(url, {
      method: METHOD,
      mode: MODE,
    })
      .then(response => response.json())
      .then(data => {
        dispatch(
          fetchMetalsSuccess(
            getResponseValue(portfolio, ASSET_CLASS_ID_METALS, data)
          )
        );
      })
      .catch((error) => {
        dispatch(fetchMetalsFailure(error));
      });
  }
}

function fetchMetalsSuccess(data) {
  return {
    payload: data,
    type: FETCH_METALS_SUCCESS,
  };
}

function fetchMetalsFailure(data) {
  return {
    payload: data,
    type: FETCH_METALS_FAILURE,
  };
}

function fetchStocksRequest(portfolio, dispatch) {
  dispatch({
    type: FETCH_STOCKS_REQUEST,
  });

  const stockSymbols = gatherAssetSymbolsByAssetClassId(
    portfolio,
    ASSET_CLASS_ID_STOCKS
  );

  const url = getURL(
    stockSymbols,
    ASSET_CLASS_ID_STOCKS
  );

  const headers = getHeaders(ASSET_CLASS_ID_STOCKS);

  if (process.env.REACT_APP_STANDALONE === 'on') {
    setTimeout(() => {
      dispatch(
        fetchStocksSuccess(
          getResponseValue(portfolio, ASSET_CLASS_ID_STOCKS, stocksFixture)
        )
      );
    }, process.env.REACT_APP_STANDALONE_DELAY);
  }
  else {
    fetch(url, {
      headers,
      method: METHOD,
      mode: MODE,
    })
      .then(response => response.json())
      .then(data => {
        dispatch(
          fetchStocksSuccess(
            getResponseValue(portfolio, ASSET_CLASS_ID_STOCKS, data)
          )
        );
      })
      .catch((error) => {
        dispatch(fetchStocksFailure(error));
      });
  }
}

function fetchStocksSuccess(data) {
  return {
    payload: data,
    type: FETCH_STOCKS_SUCCESS,
  };
}

function fetchStocksFailure(data) {
  return {
    payload: data,
    type: FETCH_STOCKS_FAILURE,
  };
}

function calculateTotalValue(portfolio) {
  let result = 0

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    if (asset.quantity && asset.price) {
      result = asset.quantity * asset.price;
    }
    else {
      result = 0;
    }
  }
  else {
    const children = portfolio.children;

    result = Object.keys(children)
      .reduce((totalValue, id) => {
        return totalValue + calculateTotalValue(children[id]);
      }, 0);
  }

  return result;
}

function updateLevelValues(portfolio) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    result = {
      ...asset,
    };
  }
  else {
    result = {
      ...portfolio,
      children: Object.keys(portfolio.children)
        .reduce((results, id) => {
          return {
            ...results,
            [id]: updateLevelValues(portfolio.children[id]),
          };
        }, {}),
      value: calculateTotalValue(portfolio),
    };
  }

  return result;
}

function updateLevelAllocations(portfolio, portfolioValue, totalValue) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    /*
     * portfolioValue -> 100
     * asset.value -> asset.allocation
     * asset.allocation = (asset.value * 100) / portfolioValue
     */
    result = {
      ...asset,
      allocation: (asset.value * 100) / portfolioValue,
      overallAllocation: (asset.value * 100) / totalValue,
    };
  }
  else {
    result = {
      ...portfolio,
      children: Object.keys(portfolio.children)
        .reduce((results, id) => {
          return {
            ...results,
            [id]: updateLevelAllocations(portfolio.children[id], portfolio.value, totalValue),
          };
        }, {}),
      allocation: (portfolio.value * 100) / portfolioValue,
    };
  }

  return result;
}

function updatePortfolioValues(portfolio, dispatch) {
  const updatedPortfolio = updateLevelValues(portfolio);

  return dispatch({
    payload: updatedPortfolio,
    type: UPDATE_PORTFOLIO_VALUES,
  });
}

function updatePortfolioAllocations(portfolio, dispatch) {
  const updatedPortfolio = updateLevelAllocations(portfolio, portfolio.value, portfolio.value);

  return dispatch({
    payload: updatedPortfolio,
    type: UPDATE_PORTFOLIO_ALLOCATIONS,
  });
}

export {
  fetchCryptosRequest,
  fetchCryptosSuccess,
  fetchCryptosFailure,
  fetchMetalsRequest,
  fetchMetalsSuccess,
  fetchMetalsFailure,
  fetchStocksRequest,
  fetchStocksSuccess,
  fetchStocksFailure,
  updatePortfolioValues,
  updatePortfolioAllocations,
};
