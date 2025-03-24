// NPM Packages
import { Fragment } from 'react';
import {
  Label,
  Loader,
  Table,
} from 'semantic-ui-react';

// Custom Modules
import { formatCurrency, formatPercentage } from './../../helpers';

// Styles
import './index.css';

// Constants
const LABEL_OPACITY = 0.85;
const LABEL_WHITE_SPACE = 'nowrap';
const LOADER_ACTIVE = true;
const LOADER_INLINE = 'centered';
const LOADER_SIZE = 'mini';
const TABLE_CELLED = true;
const TABLE_COMPACT = true;
const TABLE_STRUCTURED = true;
const TABLE_HEADER_CELL_1 = 'Name';
const TABLE_HEADER_CELL_2 = 'Symbol';
const TABLE_HEADER_CELL_3 = 'Quantity';
const TABLE_HEADER_CELL_4 = 'Price';
const TABLE_HEADER_CELL_5 = 'Value';
const TABLE_HEADER_CELL_6 = 'Allocation';

function Assets(props) {
  // Calculated Constants
  const maxDepth = depthOf(props.data.portfolio);

  // Helpers
  function countDescendants(portfolio) {
    let result;

    if (!portfolio.children) {
      result = 1;
    }
    else {
      let childrenCount = 0;

      const firstChild = Object.values(portfolio.children)[0];
      if (firstChild.children) {
        childrenCount = Object.keys(portfolio.children).length;
      }

      result = childrenCount + Object.values(portfolio.children)
        .reduce((count, portfolio) => {
          return count + countDescendants(portfolio);
        }, 0);
    }

    return result;
  }

  function depthOf(portfolio) {
    let level = 1;

    for (let key in portfolio.children) {
      let child = portfolio.children[key];

      if (!child.hasOwnProperty('children')) {
        continue;
      }
      else {
        let depth = depthOf(child) + 1;

        level = Math.max(depth, level);
      }
    }

    return level;
  }

  // Recursive Renderers
  function renderChildren(portfolio) {
    return Object.values(portfolio.children)
      .map(child => {
        child.parent = portfolio.id;
        child.level = portfolio.level + 1;

        return traverse(child);
      })
  }

  function renderChildrenOnly(portfolio) {
    return (
      <Fragment key={portfolio.id}>
        { renderChildren(portfolio) }
      </Fragment>
    );
  }

  function renderPortfolioAndChildren(portfolio) {
    return (
      <Fragment key={portfolio.id}>
        <Table.Row>
          <Table.Cell
            rowSpan={countDescendants(portfolio)}
          >
            <Label
              style={{
                backgroundColor: portfolio.color,
                opacity: LABEL_OPACITY,
              }}
            >
              { renderAssetNameAndAllocation(portfolio) }
            </Label>
          </Table.Cell>
        </Table.Row>
        { renderChildren(portfolio) }
      </Fragment>
    );
  }

  function renderPortfolioAndChildrenWithFirstChild(portfolio) {
    const firstChild = Object.values(portfolio.children)[0];
    const colSpan = maxDepth - portfolio.level;

    return (
      <Fragment key={portfolio.id}>
        <Table.Row>
          <Table.Cell
            rowSpan={countDescendants(portfolio)}
          >
            <Label
              style={{
                backgroundColor: portfolio.color,
                opacity: LABEL_OPACITY,
              }}
            >
              { renderAssetNameAndAllocation(portfolio) }
            </Label>
          </Table.Cell>
          <Table.Cell
            colSpan={colSpan}
            rowSpan={countDescendants(firstChild) + 1}
          >
            <Label
              style={{
                backgroundColor: firstChild.color,
                opacity: LABEL_OPACITY,
              }}
            >
                { renderAssetNameAndAllocation(firstChild) }
            </Label>
          </Table.Cell>
        </Table.Row>
        { renderChildren(portfolio) }
      </Fragment>
    );
  }

  function renderPortfolioAndChildrenWithoutFirstChild(portfolio) {
    const colSpan = maxDepth - portfolio.level;

    return (
      <Fragment key={portfolio.id}>
        <Table.Row>
          <Table.Cell
            colSpan={colSpan + 1}
            rowSpan={countDescendants(portfolio) + 1}
          >
            <Label
              style={{
                backgroundColor: portfolio.color,
                opacity: LABEL_OPACITY,
              }}
            >
              { renderAssetNameAndAllocation(portfolio) }
            </Label>
          </Table.Cell>
        </Table.Row>
        { renderChildren(portfolio) }
      </Fragment>
    );
  }

  function traverse(portfolio) {
    let result;

    if (!portfolio.level) {
      portfolio.level = 1;
    }

    if (!portfolio.parent) {
      portfolio.parent = 'root';
    }

    if (!portfolio.children) {
      // If portfolio doesn't have any children,
      // it's not a portfolio,
      // it's an asset!
      const asset = portfolio;

      result = renderAsset(asset);
    }
    else {
      const firstChild = Object.values(portfolio.children)[0];

      if (firstChild.firstChild) {
        if (depthOf(firstChild) > 1) {
          result = renderPortfolioAndChildren(portfolio);
        }
        else {
          result = renderPortfolioAndChildrenWithFirstChild(portfolio);
        }
      }
      else {
        if (!portfolio.firstChild) {
          result = renderPortfolioAndChildrenWithoutFirstChild(portfolio);
        }
        else {
          result = renderChildrenOnly(portfolio);
        }
      }
    }

    return result;
  }

  // Renderers
  function renderAsset(asset) {
    return (
      <Table.Row key={asset.name}>
        <Table.Cell>
          <Label
            style={{
              backgroundColor: asset.color,
              opacity: LABEL_OPACITY,
              whiteSpace: LABEL_WHITE_SPACE,
            }}
          >
            { renderAssetNameAndAllocation(asset) }
          </Label>
        </Table.Cell>
        <Table.Cell>
          { asset.symbol }
        </Table.Cell>
        <Table.Cell>
          { asset.quantity || 0 }
        </Table.Cell>
        <Table.Cell>
          {
            (props.data.fetching && renderLoader())
            || renderAssetPrice(asset)
          }
        </Table.Cell>
        <Table.Cell>
          {
            (props.data.fetching && renderLoader())
            || renderAssetValue(asset)
          }
        </Table.Cell>
        <Table.Cell>
          {
            (props.data.fetching && renderLoader())
            || renderAssetOverallAllocation(asset)
          }
        </Table.Cell>
      </Table.Row>
    );
  }

  function renderLoader() {
    return (
      <Loader
        active={LOADER_ACTIVE}
        inline={LOADER_INLINE}
        size={LOADER_SIZE}
      />
    );
  }

  function renderAssetAllocation(asset) {
    let result;

    if (asset.allocation) {
      result = formatPercentage(asset.allocation);
    }
    else {
      result = formatPercentage(0);
    }

    return result;
  }

  function renderAssetNameAndAllocation(asset) {
    return asset.name + ' (' + renderAssetAllocation(asset) + ')';
  }

  function renderAssetOverallAllocation(asset) {
    let result;

    if (asset.overallAllocation) {
      result = formatPercentage(asset.overallAllocation);
    }
    else {
      result = formatPercentage(0);
    }

    return result;
  }

  function renderAssetPrice(asset) {
    let result;

    if (asset.price) {
      result = formatCurrency(asset.price);
    }
    else {
      result = formatCurrency(0);
    }

    return result;
  }

  function renderAssetValue(asset) {
    let result;

    if (asset.value) {
      result = formatCurrency(asset.value);
    }
    else {
      result = formatCurrency(0);
    }

    return result;
  }

  function renderTableBody(portfolio) {
    return (
      <Table.Body>
        { traverse(portfolio) }
      </Table.Body>
    );
  }

  function renderTableHeader(portfolio) {
    let colSpan = maxDepth + 1;

    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={colSpan}>
            { TABLE_HEADER_CELL_1 }
          </Table.HeaderCell>
          <Table.HeaderCell>
            { TABLE_HEADER_CELL_2 }
          </Table.HeaderCell>
          <Table.HeaderCell>
            { TABLE_HEADER_CELL_3 }
          </Table.HeaderCell>
          <Table.HeaderCell>
            { TABLE_HEADER_CELL_4 }
          </Table.HeaderCell>
          <Table.HeaderCell>
            { TABLE_HEADER_CELL_5 }
          </Table.HeaderCell>
          <Table.HeaderCell>
            { TABLE_HEADER_CELL_6 }
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  return (
    <Table
      className='Assets'
      celled={TABLE_CELLED}
      compact={TABLE_COMPACT}
      structured={TABLE_STRUCTURED}
    >
      { renderTableHeader(props.data.portfolio) }
      { renderTableBody(props.data.portfolio) }
    </Table>
  );
}

export default Assets;
