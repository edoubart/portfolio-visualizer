// NPM Paallocation
import * as d3 from 'd3';

// Custom Modules
import useD3 from './../../hooks/useD3';

// Helpers
import { formatCurrency, formatPercentage } from './../../helpers';

// Styles
import './index.css';

// Constants
const HEIGHT = 500;
const WIDTH = 500;

function ZoomableIcicle(props) {
  // Helpers
  function traverse(portfolio) {
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
        children: Object.values(portfolio.children)
          .map(portfolio => traverse(portfolio)),
      };
    }

    return result;
  }

  // Hooks
  const ref = useD3(
    (svg) => {
      svg
        .attr('viewBox', '0 0 '+ WIDTH + ' ' + HEIGHT + '');

      const data = traverse(props.data.portfolio);

      function partition(data) {
        let root =d3.hierarchy(data)
          .sum(d => d.overallAllocation)
          //.sort((a, b) => b.height - a.height || b.overallAllocation - a.overallAllocation);

        return d3.partition()
          .size([HEIGHT, (root.height + 1) * WIDTH / 3])
        (root);
      }

      const root = partition(data);

      let focus = root;

      const cell = svg
        .selectAll('g')
        .data(root.descendants())
        .join('g')
          .attr('transform', d => `translate(${d.y0},${d.x0})`);

      const rect = cell.append('rect')
          .attr('width', d => d.y1 - d.y0 - 1)
          .attr('height', d => rectHeight(d))
          .attr('fill', d => d.data.color)
          .style('cursor', 'pointer')
          .on('click', clicked);

      cell.append('title')
        .text(d => {
          return ''
            + renderBreadcrumbs(d)
            + renderNameAndSymbol(d)
            + renderValue(d)
            + renderAllocation(d)
            + renderOverallAllocation(d);
        });

      // Visualization Helpers
      function clicked(event, p) {
        if (!p.parent) {
          return;
        }

        focus = focus === p ? p = p.parent : p;

        root.each(d => d.target = {
          x0: (d.x0 - p.x0) / (p.x1 - p.x0) * HEIGHT,
          x1: (d.x1 - p.x0) / (p.x1 - p.x0) * HEIGHT,
          y0: d.y0 - p.y0,
          y1: d.y1 - p.y0
        });

        const t = cell.transition().duration(750)
          .attr('transform', d => `translate(${d.target.y0},${d.target.x0})`);

        rect.transition(t).attr('height', d => rectHeight(d.target));
      }

      function rectHeight(d) {
        return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
      }

      // Visualization Renderers
      function renderAllocation(d) {
        let result = '';

        if (d.data.allocation) {
          result += '\n'
            + 'Allocation: '
            + formatPercentage(d.data.allocation);
        }

        return result;
      }

      function renderBreadcrumbs(d) {
        let result = '';

        result += d.ancestors()
          .map(d => d.data.name)
          .reverse()
          .join(' > ');

        return result;
      }

      function renderNameAndSymbol(d) {
        let result = '';

        if (d.data.name && d.data.symbol) {
          result += '\n'
            + d.data.name
            + ' ('
            + d.data.symbol
            + ')';
        }

        return result;
      }

      function renderOverallAllocation(d) {
        let result = '';

        if (d.data.overallAllocation) {
          result += '\n'
            + 'Overall Allocation: '
            + formatPercentage(d.data.overallAllocation);
        }

        return result;
      }

      function renderValue(d) {
        let result = '';

        if (d.data.value) {
          result += '\n'
            + 'Value: '
            + formatCurrency(d.data.value);
        }

        return result;
      }
    },
    [props.data.portfolio]
  );

  return (
    <div className='ZoomableIcicle'>
      <svg ref={ref}></svg>
    </div>
  );
}

export default ZoomableIcicle;
