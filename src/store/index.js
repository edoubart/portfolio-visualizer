// NPM Packages
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// Custom Modules
import root from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  || compose;

const store = createStore(root, /* preloadedState, */ composeEnhancers(
  applyMiddleware(logger, thunk)
));

export default store;
