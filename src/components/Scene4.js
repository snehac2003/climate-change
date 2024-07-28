import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import SceneHeader from './SceneHeader';

const Scene4 = ({ previousScene }) => {
  const [dataLoaded, setDataLoaded] = useState([]);

  useEffect(() => {
    d3.csv('/climate_change_dataset.csv').then(data => {
      console.log("Data loaded:", data);  // Check the raw data loaded
      const parsedData = data.map(d => ({
        year: parseInt(d['Year'], 10),
        humidity: parseFloat(d['Humidity (%)']),
        windSpeed: parseFloat(d['Wind_Speed (m/s)'])
      })).filter(d => !isNaN(d.year) && !isNaN(d.humidity) && !isNaN(d.windSpeed));
      console.log("Parsed data:", parsedData);  // Check the parsed data

      const aggregatedData = d3.rollup(parsedData, 
        v => ({
          avgHumidity: d3.mean(v, d => d.humidity),
          avgWindSpeed: d3.mean(v, d => d.windSpeed)
        }),
        d => d.year);

      const formattedData = Array.from(aggregatedData, ([year, values]) => ({
        year,
        ...values
      }));
      console.log("Aggregated data:", formattedData);  // Check the aggregated data

      setDataLoaded(formattedData);
      drawChart(formattedData);
    }).catch(error => {
      console.error('Error loading the CSV file:', error);
    });
  }, []);
      
    
    const drawChart = (data) => {
        d3.select('#chart4').selectAll('*').remove();
    
        const margin = {top: 20, right: 80, bottom: 60, left: 80};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
    
        const svg = d3.select("#chart4")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);
    
        const g = svg.append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
    
        const x = d3.scaleBand()
          .range([0, width])
          .domain(data.map(d => d.year))
          .padding(0.1);
    
        const yHumidity = d3.scaleLinear()
          .domain([0, 100])
          .range([height, 0]);
    
        const yWindSpeed = d3.scaleLinear()
          .domain([0, 50])
          .range([height, 0]);
    
        g.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));
    
        g.append("g")
          .call(d3.axisLeft(yHumidity));
    
        g.append("g")
          .attr("transform", `translate(${width}, 0)`)
          .call(d3.axisRight(yWindSpeed));
    
        const humidityBars = g.selectAll(".humidityBar")
          .data(data)
          .enter().append("rect")
          .attr("class", "humidityBar")
          .attr("x", d => x(d.year))
          .attr("y", d => yHumidity(d.avgHumidity))
          .attr("width", x.bandwidth() / 2)
          .attr("height", d => height - yHumidity(d.avgHumidity))
          .attr("fill", "#69b3a2");
    
        const windSpeedBars = g.selectAll(".windSpeedBar")
          .data(data)
          .enter().append("rect")
          .attr("class", "windSpeedBar")
          .attr("x", d => x(d.year) + x.bandwidth() / 2)
          .attr("y", d => yWindSpeed(d.avgWindSpeed))
          .attr("width", x.bandwidth() / 2)
          .attr("height", d => height - yWindSpeed(d.avgWindSpeed))
          .attr("fill", "#d88771");
    
        const zoom = d3.zoom()
          .scaleExtent([1, 5])
          .translateExtent([[0, 0], [width, height]])
          .on("zoom", (event) => {
            g.attr("transform", event.transform);
          });
    
        svg.call(zoom);
    
       
        const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(["Humidity", "Wind Speed"])
        .enter().append("g")
        .attr("transform", (d, i) => `translate(-10,${i * 20})`)
        .style("cursor", "pointer")
        .on("click", function(event, d) {
        const barClass = d === "Humidity" ? "humidityBar" : "windSpeedBar";
        const isActive = svg.selectAll(`.${barClass}`).style("opacity") === "1";
        svg.selectAll(`.${barClass}`).style("opacity", isActive ? 0 : 1);
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", d => d === "Humidity" ? "#69b3a2" : "#d88771");

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);
    
    svg.append("text")
        .attr("transform", `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 20)
        .attr("x", -(height / 2) - margin.top)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Humidity (%)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 20)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Wind Speed (m/s)");

    };
    
      
      
      console.log("Max humidity:", d3.max(dataLoaded, d => d.avgHumidity));
      console.log("Max wind speed:", d3.max(dataLoaded, d => d.avgWindSpeed));
      
  

  return (
    <section className="scene">
        
      <h2>Climate Factors: Humidity and Wind Speed</h2>
      <p>Explore how humidity and wind speed levels have changed over the years.</p>
      <div id="chart4"></div>
      <button onClick={previousScene} style={{ position: 'absolute', left: '10px', bottom: '10px' }}>
        ← Back
      </button>
      <SceneHeader sceneNumber={4}/>
    </section>
  );
};

export default Scene4;
