
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import SceneHeader from './SceneHeader';

const Scene3 = ({ previousScene, nextScene }) => {
  const [dataLoaded, setDataLoaded] = useState([]);

  useEffect(() => {
    d3.csv('/climate_change_dataset.csv').then(data => {
      const parsedData = data.map(d => ({
        year: parseInt(d['Year'], 10),
        precipitation: parseFloat(d['Precipitation (mm)'])
      })).filter(d => !isNaN(d.year) && !isNaN(d.precipitation) && d.precipitation < 10000);

      const aggregatedData = d3.rollup(parsedData,
        v => d3.sum(v, leaf => leaf.precipitation),
        d => d.year);

      const formattedData = Array.from(aggregatedData, ([year, total]) => ({
        year,
        total
      }));

      setDataLoaded(formattedData);
      drawChart(formattedData);
    }).catch(error => {
      console.error('Error loading the CSV file:', error);
    });
  }, []);

  const drawChart = (data) => {
    d3.select('#chart3').selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart3').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.year))
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.total)]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format('d')))
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
      .text('Precipitation (mm)');

    const tooltip = d3.select('#chart3').append('div')
      .attr('class', 'tooltip');

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.year))
      .attr("y", d => y(d.total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.total))
      .attr("fill", "steelblue")
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1)
          .html(`Year: ${d.year}<br>Precipitation: ${d.total.toFixed(2)} mm`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
  };

  return (
    <section className="scene">
        
      <h2>Yearly Precipitation Trends</h2>
      <p>Explore precipitation changes over the years.</p>
      <div id="chart3"></div>
      <button onClick={previousScene} style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
        ← Back
      </button>
      <button onClick={nextScene} style={{ position: 'absolute', right: '10px', bottom: '10px' }}>
        Next →
      </button>
      <SceneHeader sceneNumber={3}/>
    </section>
  );
};

export default Scene3;
