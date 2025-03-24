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

function ZoomableSunburst(props) {
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

      const radius = Math.min(WIDTH, HEIGHT) / 8;

      const data = traverse(props.data.portfolio);

      const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

      function partition(data) {
        const root = d3.hierarchy(data)
          .sum(d => {
            let result;

            if (!d.children) {
              result = d.overallAllocation;
            }

            return result;
          })
          .sort((a, b) => b.overallAllocation - a.overallAllocation);

        return d3.partition()
          .size([2 * Math.PI, root.height + 1])
          (root);
      }

      const root = partition(data);

      root.each(d => d.current = d);

      const g = svg.append('g')
        .attr('transform', 'translate(' + (WIDTH / 2) + ', ' + (HEIGHT / 2) + ')');

      const path = g.append('g')
        .selectAll('path')
        .data(root.descendants().slice(1))
        .join('path')
          .attr('fill', d => d.data.color)
          .attr('fill-opacity', d => arcVisible(d.current) ? (d.children ? 1 : 1) : 0)
          .attr('d', d => arc(d.current));

      path.filter(d => d.children)
        .style('cursor', 'pointer')
        .on('click', clicked);

      path.append('title')
        .text(d => {
          return ''
            + renderBreadcrumbs(d)
            + renderNameAndSymbol(d)
            + renderValue(d)
            + renderAllocation(d)
            + renderOverallAllocation(d);
        });

      const parent = g.append('circle')
        .datum(root)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('click', clicked);

      // Visualization Helpers
      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function clicked(event, p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
          .tween('data', d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
          .filter(function(d) {
            return +this.getAttribute('fill-opacity') || arcVisible(d.target);
          })
          .attr('fill-opacity', d => arcVisible(d.target) ? (d.children ? 1 : 1) : 0)
          .attrTween('d', d => () => {
            return arc(d.current)
          });
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
    <div className='ZoomableSunburst'>
      <svg ref={ref}></svg>
    </div>
  );
}

export default ZoomableSunburst;
