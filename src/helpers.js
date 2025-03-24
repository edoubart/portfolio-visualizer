// Constants
const CURRENCY = 'USD';
const LOCALE = 'en-US';
const PORTFOLIO_NAME_KEY = 'Portfolio';

function formatCurrency(value) {
  // Constants
  const STYLE = 'currency';

  return Number.parseFloat(value)
    .toLocaleString(LOCALE, {
      style: STYLE,
      currency: CURRENCY,
    });
}

function formatPercentage(value) {
  return Number.parseFloat(value)
    .toFixed(2) + '%';
}

function gatherAssetIdsByAssetClassId(portfolio, assetClassId, id = null) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    result = id;
  }
  else {
    let children;
    if (
      portfolio.name === PORTFOLIO_NAME_KEY &&
      portfolio.children.hasOwnProperty(assetClassId)
    ) {
      children = portfolio.children[assetClassId].children;
    }
    else {
      children = portfolio.children;
    }

    result = Object.keys(children)
      .map((id) => {
        return gatherAssetIdsByAssetClassId(children[id], assetClassId, id);
      })
      .flat();
  }

  return result;
}

function gatherAssetSymbolsByAssetClassId(portfolio, assetClassId) {
  let result;

  if (!portfolio.children) {
    // If portfolio doesn't have any children,
    // it's not a portfolio,
    // it's an asset!
    result = portfolio.symbol;
  }
  else {
    let children;
    if (
      portfolio.name === PORTFOLIO_NAME_KEY &&
      portfolio.children.hasOwnProperty(assetClassId)
    ) {
      children = portfolio.children[assetClassId].children;
    }
    else {
      children = portfolio.children;
    }

    result = Object.values(children)
      .map((portfolio) => {
        return gatherAssetSymbolsByAssetClassId(portfolio, assetClassId);
      })
      .flat();
  }

  return result;
}

export {
  formatCurrency,
  formatPercentage,
  gatherAssetIdsByAssetClassId,
  gatherAssetSymbolsByAssetClassId,
};
