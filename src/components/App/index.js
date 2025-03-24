// NPM Packages
import { useEffect } from 'react';
import { Grid, Loader } from 'semantic-ui-react'

// Custom Modules
import Assets from './../assets';
import Carousel from './../Carousel';
import DonutChart from './../DonutChart';
import Icicle from './../Icicle';
import Sunburst from './../Sunburst';
import ZoomableIcicle from './../ZoomableIcicle';
import ZoomableSunburst from './../ZoomableSunburst';

// Styles
import './index.css';

// Constants
const GRID_COLUMN_LEFT_CONTAINER_WIDTH = 11;
const GRID_COLUMN_RIGHT_CONTAINER_WIDTH = 5;
const GRID_DIVIDED = 'vertically';
const GRID_ROW_COLUMNS = 2;
const LOADER_ACTIVE = true;
const LOADER_SIZE = 'huge';
const LOADER_TEXT = 'Loading ...';

function App(props) {
  /*********
   * Hooks *
   ********/

  /*
   * Async sequence:
   *   1. Fetch cryptos;
   *   2. Fetch metals;
   *   3. Fetch stocks;
   *   4. Update portfolio values;
   *   5. Update portfolio allocations.
   */

  // 1. Fetch cryptos.
  useEffect(() => {
    if (
      props.data.portfolio.children.hasOwnProperty('cryptos')
      && !props.data.fetchingCryptos
      && !props.data.fetchedCryptos
      && !props.data.fetching
    ) {
      props.handlers.fetchCryptos(props.data.portfolio);
    }
  }, [
    props.data.fetchingCryptos,
    props.data.fetchedCryptos,
    props.data.fetching,
    props.handlers,
    props.handlers.fetchCryptos,
    props.data.portfolio,
  ]);

  // 2. Fetch metals.
  useEffect(() => {
    if (
      props.data.portfolio.children.hasOwnProperty('metals')
      && !props.data.fetchingMetals
      && !props.data.fetchedMetals
      && !props.data.fetching
    ) {
      props.handlers.fetchMetals(props.data.portfolio);
    }
  }, [
    props.data.fetchingMetals,
    props.data.fetchedMetals,
    props.data.fetching,
    props.handlers,
    props.handlers.fetchMetals,
    props.data.portfolio,
  ]);

  // 3. Fetch stocks.
  useEffect(() => {
    if (
      props.data.portfolio.children.hasOwnProperty('stocks')
      && !props.data.fetchingStocks
      && !props.data.fetchedStocks
      && !props.data.fetching
    ) {
      props.handlers.fetchStocks(props.data.portfolio);
    }
  }, [
    props.data.fetchingStocks,
    props.data.fetchedStocks,
    props.data.fetching,
    props.handlers,
    props.handlers.fetchStocks,
    props.data.portfolio,
  ]);

  // 4. Update portfolio values.
  useEffect(() => {
    if (
      props.data.fetched
      && !props.data.updatedPortfolioValues
    ) {
      props.handlers.updatePortfolioValues(props.data.portfolio);
    }
  }, [
    props.data.fetched,
    props.data.updatedPortfolioValues,
    props.handlers,
    props.handlers.updatePortfolioValues,
    props.data.portfolio,
  ]);

  // 5. Update portfolio allocations.
  useEffect(() => {
    if (
      props.data.updatedPortfolioValues
      && !props.data.updatedPortfolioAllocations
    ) {
      props.handlers.updatePortfolioAllocations(props.data.portfolio);
    }
  }, [
    props.data.updatedPortfolioValues,
    props.data.updatedPortfolioAllocations,
    props.handlers,
    props.handlers.updatePortfolioAllocations,
    props.data.portfolio,
  ]);

  // Renderers
  function renderDonutChart() {
    return (
      <DonutChart
        data={{
          portfolio: props.data.portfolio,
        }}
      />
    );
  }

  function renderLoader() {
    return (
      <Loader
        active={LOADER_ACTIVE}
        size={LOADER_SIZE}
      >
        { LOADER_TEXT }
      </Loader>
    );
  }

  function renderSunburst() {
    return (
      <Sunburst
        data={{
          portfolio: props.data.portfolio,
        }}
      />
    )
  }

  function renderZoomableSunburst() {
    return (
      <ZoomableSunburst
        data={{
          portfolio: props.data.portfolio,
        }}
      />
    )
  }

  function renderIcicle() {
    return (
      <Icicle
        data={{
          portfolio: props.data.portfolio,
        }}
      />
    );
  }

  function renderZoomableIcicle() {
    return (
      <ZoomableIcicle
        data={{
          portfolio: props.data.portfolio,
        }}
      />
    );
  }

  function renderVisualizations() {
    let result;

    if (!props.data.updatedPortfolioAllocations) {
      result = renderLoader();
    }
    else {
      result = (
        <Carousel
          data={{
            visualizations: {
              'donut-chart': {
                id: 'donut-chart',
                label: 'Donut Chart',
                component: renderDonutChart(),
              },
              'sunburst': {
                id: 'sunburst',
                label: 'Sunburst',
                component: renderSunburst(),
              },
              'zoomable-sunburst': {
                id: 'zoomable-sunburst',
                label: 'Zoomable Sunburst',
                component: renderZoomableSunburst(),
              },
              'icicle': {
                id: 'icicle',
                label: 'Icicle',
                component: renderIcicle(),
              },
              'zoomable-icicle': {
                id: 'zoomable-icicle',
                label: 'Zoomable Icicle',
                component: renderZoomableIcicle(),
              },
            },
          }}
        />
      );
    }

    return result;
  }

  return (
    <div className='App'>
      <Grid divided={GRID_DIVIDED}>
        <Grid.Row columns={GRID_ROW_COLUMNS}>
          <Grid.Column
            className='LeftContainer'
            width={GRID_COLUMN_LEFT_CONTAINER_WIDTH}
          >
            <Assets
              data={{
                fetching: props.data.fetching,
                portfolio: props.data.portfolio,
              }}
            />
          </Grid.Column>
          <Grid.Column
            className='RightContainer'
            width={GRID_COLUMN_RIGHT_CONTAINER_WIDTH}
          >
            { renderVisualizations() }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default App;
