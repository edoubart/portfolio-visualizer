// NPM Packages
import deepMerge from 'deepmerge';

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
import { getFetched, getFetching } from './helpers';

// Data
import portfolio from './../../data/recommended-portfolio/index.json';

function traverseCash(portfolio) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    const asset = portfolio;

    if (asset.type === 'cash') {
      const price = 1; // 1 USD

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
      ...portfolio,
      children: Object.keys(portfolio.children)
      .reduce((results, id) => {
        return {
          ...results,
          [id]: traverseCash(portfolio.children[id]),
        };
      }, {}),
    };
  }

  return result;
}

let cashUpdatedPortfolio;
if (portfolio.children.hasOwnProperty('cash')) {
  cashUpdatedPortfolio = traverseCash(portfolio);
}
else {
  cashUpdatedPortfolio = portfolio;
}

const initialState = {
  portfolio: {
    ...cashUpdatedPortfolio,
    value: 0,
  },
  fetched: false,
  fetchedCryptos: false,
  fetchedMetals: false,
  fetchedStocks: false,
  fetching: false,
  fetchingCryptos: false,
  fetchingMetals: false,
  fetchingStocks: false,
  errors: [],
  errorsCryptos: [],
  errorsMetals: [],
  errorsStocks: [],
  updatedPortfolioValues: false,
  updatedPortfolioAllocations: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CRYPTOS_REQUEST:
      return {
        ...state,
        fetching: true,
        fetched: false,
        fetchingCryptos: true,
        fetchedCryptos: false,
      };
    case FETCH_CRYPTOS_SUCCESS:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          children: {
            ...state.portfolio.children,
            cryptos: deepMerge(
              state.portfolio.children.cryptos,
              action.payload.children.cryptos,
            ),
          },
          value: action.payload.value ?
            state.portfolio.value + action.payload.value :
            state.portfolio.value,
        },
        fetchingCryptos: false,
        fetchedCryptos: true,
        fetching: getFetching(state, 'cryptos'),
        fetched: getFetched(state, 'cryptos'),
      };
    case FETCH_CRYPTOS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        fetchingCryptos: false,
        fetchedCryptos: false,
        // errors:
        // errorsCryptos:
      };
    case FETCH_METALS_REQUEST:
      return {
        ...state,
        fetching: true,
        fetched: false,
        fetchingMetals: true,
        fetchedMetals: false,
      };
    case FETCH_METALS_SUCCESS:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          children: {
            ...state.portfolio.children,
            metals: deepMerge(
              state.portfolio.children.metals,
              action.payload.children.metals,
            ),
          },
          value: action.payload.value ?
            state.portfolio.value + action.payload.value :
            state.portfolio.value,
        },
        fetchingMetals: false,
        fetchedMetals: true,
        fetching: getFetching(state, 'metals'),
        fetched: getFetched(state, 'metals'),
      };
    case FETCH_METALS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        fetchingMetals: false,
        fetchedMetals: false,
        // errors:
        // errorsMetals:
      };
    case FETCH_STOCKS_REQUEST:
      return {
        ...state,
        fetching: true,
        fetched: false,
        fetchingStocks: true,
        fetchedStocks: false,
      };
    case FETCH_STOCKS_SUCCESS:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          children: {
            ...state.portfolio.children,
            stocks: deepMerge(
              state.portfolio.children.stocks,
              action.payload.children.stocks,
            ),
          },
          value: action.payload.value ?
            state.portfolio.value + action.payload.value :
            state.portfolio.value,
        },
        fetchingStocks: false,
        fetchedStocks: true,
        fetching: getFetching(state, 'stocks'),
        fetched: getFetched(state, 'stocks'),
      };
    case FETCH_STOCKS_FAILURE:
      return {
        ...state,
        fetching: false,
        fetched: false,
        fetchingStocks: false,
        fetchedStocks: false,
        // errors:
        // errorsStocks:
      };
    case UPDATE_PORTFOLIO_VALUES:
      return {
        ...state,
        portfolio: deepMerge(state.portfolio, action.payload),
        updatedPortfolioValues: true,
      };
    case UPDATE_PORTFOLIO_ALLOCATIONS:
      return {
        ...state,
        portfolio: deepMerge(state.portfolio, action.payload),
        updatedPortfolioAllocations: true,
      };
    default:
      return state;
  }
};

export default reducer;
