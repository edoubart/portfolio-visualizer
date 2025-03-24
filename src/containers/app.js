// NPM Packages
import { connect } from 'react-redux';

// Custom Modules
import {
  fetchCryptosRequest,
  fetchMetalsRequest,
  fetchStocksRequest,
  updatePortfolioAllocations,
  updatePortfolioValues,
} from './../store/actions';
import App from './../components/App';

const mapStateToProps = state => {
  return {
    data: {
      fetched: state.fetched,
      fetchedCryptos: state.fetchedCryptos,
      fetchedMetals: state.fetchedMetals,
      fetchedStocks: state.fetchedStocks,
      fetching: state.fetching,
      fetchingCryptos: state.fetchingCryptos,
      fetchingMetals: state.fetchingMetals,
      fetchingStocks: state.fetchingStocks,
      errors: state.errors,
      errorsCryptos: state.errorsCryptos,
      errorsMetals: state.errorsMetals,
      errorsStocks: state.errorsStocks,
      portfolio: state.portfolio,
      updatedPortfolioAllocations: state.updatedPortfolioAllocations,
      updatedPortfolioValues: state.updatedPortfolioValues,
    },
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handlers: {
      fetchCryptos: portfolio => fetchCryptosRequest(portfolio, dispatch),
      fetchMetals: portfolio => fetchMetalsRequest(portfolio, dispatch),
      fetchStocks: portfolio => fetchStocksRequest(portfolio, dispatch),
      updatePortfolioAllocations: portfolio => updatePortfolioAllocations(portfolio, dispatch),
      updatePortfolioValues: portfolio => updatePortfolioValues(portfolio, dispatch),
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
