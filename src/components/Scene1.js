import React, { useEffect } from 'react';
import * as d3 from 'd3';
import SceneHeader from './SceneHeader';

const Scene1 = ({ nextScene }) => {
  useEffect(() => {
    d3.csv('/climate_change_dataset.csv').then(data => {
      const parsedData = data.map(d => ({
        year: parseInt(d['Year'], 10),
        avgTempC: d['Avg_Temp (°C)'] ? parseFloat(d['Avg_Temp (°C)']) : null
      })).filter(d => !isNaN(d.year) && d.avgTempC !== null);

      const aggregatedData = Array.from(d3.group(parsedData, d => d.year), ([key, value]) => ({
        year: key,
        avgTempC: d3.mean(value, d => d.avgTempC)
      }));

      const margin = { top: 20, right: 30, bottom: 50, left: 70 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      d3.select('#chart1').selectAll('*').remove();

      const svg = d3.select('#chart1')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(aggregatedData, d => new Date(d.year, 0, 1)))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d.avgTempC)])
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(new Date(d.year, 0, 1)))
        .y(d => y(d.avgTempC));

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y')))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Year');

      svg.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Average Temperature (°C)');

      svg.append('path')
        .datum(aggregatedData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      const tooltip = d3.select('#chart1').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'white')
        .style('border', '1px solid #ccc')
        .style('padding', '10px')
        .style('pointer-events', 'none');

      svg.selectAll('dot')
        .data(aggregatedData)
        .enter().append('circle')
        .attr('r', 5)
        .attr('cx', d => x(new Date(d.year, 0, 1)))
        .attr('cy', d => y(d.avgTempC))
        .attr('fill', 'steelblue')
        .on('mouseover', (event, d) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`Year: ${d.year}<br>Avg Temp: ${d.avgTempC.toFixed(2)}°C`)
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        });
    }).catch(error => {
      console.error('Error loading the CSV file:', error);
    });

    return () => {
      d3.select('#chart1').selectAll('*').remove();
    };
  }, []);

  return (
    <section className="scene">
        
      <h2>Introduction</h2>
      <p>Overview of global temperature trends.</p>
      <div id="chart1"></div>
      <button onClick={nextScene} style={{ position: 'absolute', right: '10px', bottom: '10px' }}>
        Next →
      </button>
      <SceneHeader sceneNumber={1}/>
    </section>
  );
};

export default Scene1;
