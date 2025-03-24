function getFetched(state, currentAssetClass) {
  let result;

  switch (currentAssetClass) {
    case 'cryptos':
      if (
        state.portfolio.children.hasOwnProperty('metals')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = (state.fetchedMetals && state.fetchedStocks) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('metals')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchedMetals ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('metals')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchedStocks ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('metals')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = true;
      }
      else {
        result = true;
      }

      break;
    case 'metals':
      if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = (state.fetchedCryptos && state.fetchedStocks) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchedCryptos ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchedStocks ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = true;
      }
      else {
        result = true;
      }

      break;
    case 'stocks':
      if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = (state.fetchedCryptos || state.fetchedMetals) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = state.fetchedCryptos ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = state.fetchedMetals ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = true;
      }
      else {
        result = true;
      }

      break;
    default:
      result = true;
  }

  return result;
}

function getFetching(state, currentAssetClass) {
  let result;

  switch (currentAssetClass) {
    case 'cryptos':
      if (
        state.portfolio.children.hasOwnProperty('metals')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = (state.fetchingMetals || state.fetchingStocks) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('metals')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchingMetals ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('metals')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchingStocks ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('metals')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = false;
      }
      else {
        result = false;
      }

      break;
    case 'metals':
      if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = (state.fetchingCryptos || state.fetchingStocks) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchingCryptos ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = state.fetchingStocks ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('stocks')
      ) {
        result = false;
      }
      else {
        result = false;
      }

      break;
    case 'stocks':
      if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = (state.fetchingCryptos || state.fetchingMetals) ? true : false;
      }
      else if (
        state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = state.fetchingCryptos ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = state.fetchingMetals ? true : false;
      }
      else if (
        !state.portfolio.children.hasOwnProperty('cryptos')
        && !state.portfolio.children.hasOwnProperty('metals')
      ) {
        result = false;
      }
      else {
        result = false;
      }

      break;
    default:
      result = false;
  }

  return result;
}

export {
  getFetched,
  getFetching,
};
