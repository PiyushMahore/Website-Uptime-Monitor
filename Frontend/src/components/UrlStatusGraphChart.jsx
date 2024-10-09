import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimingLineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        // Define dimensions
        const width = 1260;
        const height = 500;
        const margin = { top: 20, right: 0, bottom: 40, left: 50 };

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("style", "max-width: 100%; height: auto;");

        // Set up the scales
        const x = d3.scaleBand()
            .domain(data.map((_, i) => `Request ${i + 1}`)) // Each request is labeled
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max([d.nameLookupTime, d.connectionTime, d.tlsHandshakeTime, d.dataTransferTime, d.totalTime]))]).nice()
            .range([height - margin.bottom, margin.top]);

        // Area generator function
        const areaGenerator = d3.area()
            .x((d, i) => x(`Request ${i + 1}`) + x.bandwidth() / 2)
            .y0(y(0))
            .y1((d) => y(d.value));

        // Line generator function
        const lineGenerator = d3.line()
            .x((d, i) => x(`Request ${i + 1}`) + x.bandwidth() / 2)
            .y((d) => y(d.value));

        // Color scale for lines and areas
        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["nameLookupTime", "connectionTime", "tlsHandshakeTime", "dataTransferTime", "totalTime"]);

        // Prepare data for each metric
        const metrics = ["nameLookupTime", "connectionTime", "tlsHandshakeTime", "dataTransferTime", "totalTime"];
        const lineData = metrics.map(metric => ({
            metric,
            values: data.map((d, i) => ({ index: `Request ${i + 1}`, value: d[metric] }))
        }));

        // Create the areas and lines
        lineData.forEach(d => {
            svg.append("path")
                .datum(d.values)
                .attr("fill", color(d.metric))
                .attr("opacity", 0.2)
                .attr("d", areaGenerator(d.values));

            svg.append("path")
                .datum(d.values)
                .attr("fill", "none")
                .attr("stroke", color(d.metric))
                .attr("stroke-width", 2)
                .attr("d", lineGenerator(d.values));
        });

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(10, "s"));

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "10px")
            .style("font-size", "12px");

        // Tooltip interaction
        svg.selectAll("path")
            .on("mousemove", function (event, d) {
                const [x, y] = d3.pointer(event);
                const index = Math.floor((x - margin.left) / x.bandwidth()); // Approximate index

                if (index >= 0 && index < data.length) {
                    tooltip.transition().duration(200).style("opacity", 1);
                    tooltip.html(`
                        <strong>Request ${index + 1}</strong><br>
                        Name Lookup: ${data[index].nameLookupTime}ms<br>
                        Connection: ${data[index].connectionTime}ms<br>
                        TLS Handshake: ${data[index].tlsHandshakeTime}ms<br>
                        Data Transfer: ${data[index].dataTransferTime}ms<br>
                        Total Time: ${data[index].totalTime}ms
                    `)
                        .style("left", `${event.pageX + 15}px`)
                        .style("top", `${event.pageY - 28}px`);
                }
            })
            .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0));

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 120},${margin.top})`);

        metrics.forEach((metric, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", color(metric));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * 20 + 12)
                .text(metric)
                .style("font-size", "12px");
        });

    }, [data]);

    return (
        <div className='border-l border-r border-b dark:border-gray-600 border-black'>
            <svg ref={svgRef}></svg>
        </div>
    )
};

export default TimingLineChart;
