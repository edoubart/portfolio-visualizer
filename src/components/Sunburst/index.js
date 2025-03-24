// NPM Packages
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

function Sunburst(props) {
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

      const radius = (Math.min(WIDTH, HEIGHT) / 2) * 0.8;

      const data = traverse(props.data.portfolio);

      const arc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(1 / radius)
        .padRadius(radius)
        .innerRadius(d => Math.sqrt(d.y0))
        .outerRadius(d => Math.sqrt(d.y1) - 1);

      const mousearc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .innerRadius(d => Math.sqrt(d.y0))
        .outerRadius(radius);

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
          .size([2 * Math.PI, radius * radius])
          (root);
      }

      const root = partition(data);

      // Breadcrumb
      const breadcrumbWidth = 100;
      const breadcrumbHeight = 25;

      function breadcrumbPoints(d, i) {
        const tipWidth = 10;
        const points = [];
        points.push('0,0');
        points.push(`${breadcrumbWidth},0`);
        points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
        points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
        points.push(`0,${breadcrumbHeight}`);
        if (i > 0) {
          // Leftmost breadcrumb; don't include 6th vertex.
          points.push(`${tipWidth},${breadcrumbHeight / 2}`);
        }
        return points.join(' ');
      }

      function updateBreadcrumb(sunburst) {
        svg.selectAll('.breadcrumb').remove()

        const breadcrumb = svg.append('g')
          .attr(
            'transform',
            'translate(' + (-WIDTH / 2 + 50) + ', ' + (-HEIGHT / 2 +50) + ')'
          )
          .attr('viewBox', `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
          .attr('class', 'breadcrumb')
          .style('font', '12px sans-serif')
          .style('margin', '5px')
          .style('fill', '#000000');

        const g = breadcrumb
          .selectAll('g')
          .data(sunburst.sequence)
          .join('g')
          .attr('transform', (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

        g.append('polygon')
          .attr('points', breadcrumbPoints)
          .attr('fill', d => d.data.color)
          .attr('stroke', 'white');

        g.append('text')
          .attr('x', (breadcrumbWidth + 10) / 2)
          .attr('y', 15)
          .attr('dy', '0.1em')
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(d => d.data.name);

        breadcrumb
          .append('text')
          .text(sunburst.percentage > 0 ? formatPercentage(sunburst.percentage) : '')
          .attr('x', (sunburst.sequence.length + 0.5) * breadcrumbWidth)
          .attr('y', breadcrumbHeight / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle');
      }

      // Sunburst
      const element = svg.node();
      element.value = { sequence: [], percentage: 0.0 };

      updateBreadcrumb(element.value);

      const label = svg
        .append('text')
        .attr(
          'transform',
          'translate(' + 50 + ', ' + 50 + ')'
        )
        .attr('text-anchor', 'middle')
        .style('visibility', 'hidden');

      label
        .append('tspan')
        .attr('class', 'nameAndSymbol')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '-1.5em')
        .attr('font-size', '14px')
        .text('');

      label
        .append('tspan')
        .attr('class', 'value')
        .attr('x', 0)
        .attr('y', 15)
        .attr('dy', '-1.5em')
        .attr('font-size', '14px')
        .text('');

      label
        .append('tspan')
        .attr('class', 'allocation')
        .attr('x', 0)
        .attr('y', 30)
        .attr('dy', '-1.5em')
        .attr('font-size', '14px')
        .text('');

      label
        .append('tspan')
        .attr('class', 'overallAllocation')
        .attr('x', 0)
        .attr('y', 45)
        .attr('dy', '-1.5em')
        .attr('font-size', '14px')
        .text('');

      svg
        .attr('viewBox', `${-radius} ${-radius} ${WIDTH} ${WIDTH}`)
        .style('max-width', `${WIDTH}px`)
        .style('font', '12px sans-serif');

      const path = svg.append('g')
        .attr(
          'transform',
          'translate(' + 50 + ', ' + 50 + ')'
        )
        .selectAll('path')
        .data(
          root.descendants().filter(d => {
            // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
            return d.depth && d.x1 - d.x0 > 0.001;
          })
        )
        .join('path')
          .attr('fill', d => d.data.color)
          .attr('d', arc);

      // Intermediate Renderers
      function renderAllocation(d) {
        let result = '';

        if (d.data.allocation) {
          result += 'Allocation: '
            + formatPercentage(d.data.allocation);
        }

        return result;
      }

      function renderNameAndSymbol(d) {
        let result = '';

        if (d.data.name && d.data.symbol) {
          result += d.data.name
            + ' ('
            + d.data.symbol
            + ')';
        }
        else if (d.data.name) {
          result += d.data.name;
        }

        return result;
      }

      function renderOverallAllocation(d) {
        let result = '';

        if (d.data.overallAllocation) {
          result += 'Overall Allocation: '
            + formatPercentage(d.data.overallAllocation);
        }

        return result;
      }

      function renderValue(d) {
        let result = '';

        if (d.data.value) {
          result += 'Value: '
            + formatCurrency(d.data.value);
        }

        return result;
      }

      svg
        .append('g')
        .attr(
          'transform',
          'translate(' + ((WIDTH / 8) - 25) + ', ' + (HEIGHT / 8) + ')'
        )
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseleave', () => {
          path.attr('fill-opacity', 1);
          label.style('visibility', 'hidden');
          // Update the value of this view
          element.value = { sequence: [], percentage: 0.0 };

          updateBreadcrumb(element.value);
        })
        .selectAll('path')
        .data(
          root.descendants().filter(d => {
            // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
            return d.depth && d.x1 - d.x0 > 0.001;
          })
        )
        .join('path')
        .attr('d', mousearc)
        .on('mouseenter', (event, d) => {
          // Get the ancestors of the current segment, minus the root
          const sequence = d
            .ancestors()
            .reverse()
            .slice(1);
          // Highlight the ancestors
          path.attr('fill-opacity', node =>
            sequence.indexOf(node) >= 0 ? 1.0 : 0.3
          );
          const percentage = d.data.allocation.toPrecision(3);

          label
            .style('visibility', null)
            .select('.nameAndSymbol')
            .text(renderNameAndSymbol(d));

          label
            .style('visibility', null)
            .select('.value')
            .text(renderValue(d));

          label
            .style('visibility', null)
            .select('.allocation')
            .text(renderAllocation(d));

          label
            .style('visibility', null)
            .select('.overallAllocation')
            .text(renderOverallAllocation(d));

          // Update the value of this view with the currently hovered sequence and percentage
          element.value = { sequence, percentage };

          updateBreadcrumb(element.value);
        });
    },
    [props.data.portfolio]
  );

  return (
    <div className='Sunburst'>
      <svg ref={ref}></svg>
    </div>
  );
}

export default Sunburst;
