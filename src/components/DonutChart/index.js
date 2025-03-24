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

function DonutChart(props) {
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
      result = Object.keys(portfolio.children)
        .reduce((result, id) => {
          return [
            ...result,
            traverse(portfolio.children[id]),
          ];
        }, [])
        .flat();
    }

    return result;
  }

  const data = traverse(props.data.portfolio)
    .filter(asset => {
      return asset.value
        && asset.allocation
        && asset.overallAllocation;
    });

  // Hooks
  const ref = useD3(
    (svg) => {
      svg
        .attr('viewBox', '0 0 '+ WIDTH + ' ' + HEIGHT + '');

      const radius = Math.min(WIDTH, HEIGHT) / 2;

      const pie = d3
        .pie()
        .value(d => {
          let result;

          if (d.overallAllocation && !isNaN(d.overallAllocation)) {
            result = d.overallAllocation;
          }
          else {
            result = 0;
          }

          return result;
        })
        .sort(null);

      const arc = d3
        .arc()
        .innerRadius(radius / 2)
        .outerRadius(radius * 0.75);

      const hoverArc = d3
        .arc()
        .outerRadius(radius * 0.80)
        .innerRadius(radius / 2);

      const g = svg
        .selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr(
          'transform',
          'translate(' + (WIDTH / 2) + ', ' + (HEIGHT / 2) + ')'
        )
        .attr('class', 'arc');

      const labels = g.append('g')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none')
        .selectAll('text')
        .data(pie(data))
        .join('text')
        .attr('fill-opacity', 1)
        .attr('transform', d => 'translate(' + arc.centroid(d) + ')')
        .text(d => renderNameAndOverallAllocation(d))
        .style('font-size', 16)
        .style('visibility', 'hidden');

      g
        .append('path')
        .attr('d', arc)
        .attr('class', 'arc')
        .style('fill', (d, i) => d.data.color)
        .style('stroke', '#ffffff')
        .style('stroke-width', 1)
        .on('mouseover', d => {
          d3
            .select(d.target)
            .style('fill-opacity', 1)
            .transition()
            .duration(500)
            .attr('d', hoverArc);

          const targetId = d.target.__data__.data.id;

          labels
            .style('visibility', d => {
              let result;

              if (d.data.id === targetId) {
                result = null;
              }
              else {
                result = 'hidden';
              }

              return result;
            });
        })
        .on('mouseout', d => {
          d3
            .select(d.target)
            .style('fill-opacity', 0.8)
            .transition()
            .duration(500)
            .attr('d', arc);

          labels
            .style('visibility', 'hidden');
        });

      g
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 10)
        .text(formatCurrency(props.data.portfolio.value))
        .style('font-size', 24)
        .style('font-weight', 800)
        .style ('fill', '#000000')
        .style('text-anchor', 'middle');

      // Visualization Renderers
      function renderNameAndOverallAllocation(d) {
        let result = '';

        if (d.data.name && d.data.overallAllocation) {
          result += d.data.name
            + ' ('
            + formatPercentage(d.data.overallAllocation)
            + ')';
        }
        else if (d.data.name) {
          result += d.data.name;
        }

        return result;
      }
    },
    [props.data.portfolio]
  );

  return (
    <div className='DonutChart'>
      <svg ref={ref}></svg>
    </div>
  );
}

export default DonutChart;
