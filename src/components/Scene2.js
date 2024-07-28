import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import SceneHeader from './SceneHeader';

const Scene2 = ({ previousScene, nextScene }) => {
  const [tempType, setTempType] = useState('avgTempC'); // State to keep track of which temperature type to display

  useEffect(() => {
    d3.csv('/climate_change_dataset.csv').then(data => {
      const parsedData = data.map(d => ({
        year: parseInt(d['Year'], 10),
        avgTempC: d['Avg_Temp (°C)'] ? parseFloat(d['Avg_Temp (°C)']) : null,
        minTempC: d['Min_Temp (°C)'] ? parseFloat(d['Min_Temp (°C)']) : null,
        maxTempC: d['Max_Temp (°C)'] ? parseFloat(d['Max_Temp (°C)']) : null
      })).filter(d => !isNaN(d.year));

      const aggregatedData = Array.from(d3.group(parsedData, d => d.year), ([key, value]) => ({
        year: key,
        avgTempC: d3.mean(value, v => v.avgTempC),
        minTempC: d3.min(value, v => v.minTempC),
        maxTempC: d3.max(value, v => v.maxTempC)
      }));

      const margin = { top: 20, right: 30, bottom: 50, left: 70 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      d3.select('#chart2').selectAll('*').remove();

      const svg = d3.select('#chart2')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(aggregatedData, d => new Date(d.year, 0, 1)))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([d3.min(aggregatedData, d => d[tempType]), d3.max(aggregatedData, d => d[tempType])])
        .range([height, 0]);

      const line = d3.line()
        .x(d => x(new Date(d.year, 0, 1)))
        .y(d => y(d[tempType]));

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
        .text('Temperature (°C)');

      svg.append('path')
        .datum(aggregatedData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);
    }).catch(error => {
      console.error('Error loading the CSV file:', error);
    });
  }, [tempType]);

  return (
    <section className="scene">
        
      <h2>Temperature Details by Year</h2>
      <p>Select the type of temperature to display:</p>
      <button onClick={() => setTempType('avgTempC')}>Average Temp</button>
      <button onClick={() => setTempType('minTempC')}>Minimum Temp</button>
      <button onClick={() => setTempType('maxTempC')}>Maximum Temp</button>
      <div id="chart2"></div>
      <button onClick={previousScene} style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
        ← Back
      </button>
      <button onClick={nextScene} style={{ position: 'absolute', right: '10px', bottom: '10px' }}>
        Next →
      </button>
      <SceneHeader sceneNumber={2} />
    </section>
  );
};

export default Scene2;