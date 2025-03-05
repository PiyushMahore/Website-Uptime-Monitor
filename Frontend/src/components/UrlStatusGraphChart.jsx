import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TimingLineChart = ({ data }) => {
    const theme = localStorage.getItem('theme')
    const svgRef = useRef();

    console.log(theme);

    useEffect(() => {
        let width = window.innerWidth > 768 ? 1260 : window.innerWidth + 450; // Reduce width on mobile
        let height = window.innerWidth > 768 ? 500 : 650; // Increase height on mobile
        const margin = { top: 40, right: 35, bottom: 70, left: 80 };

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Create the SVG container
        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("style", "width: 100%; height: auto;");

        const x = d3.scaleBand()
            .domain(data.map((_, i) => `Request ${i + 1}`))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d3.max([d.nameLookupTime, d.connectionTime, d.tlsHandshakeTime, d.dataTransferTime, d.totalTime]))]).nice()
            .range([height - margin.bottom, margin.top]);

        const areaGenerator = d3.area()
            .x((d, i) => x(`Request ${i + 1}`) + x.bandwidth() / 2)
            .y0(y(0))
            .y1((d) => y(d.value));

        const lineGenerator = d3.line()
            .x((d, i) => x(`Request ${i + 1}`) + x.bandwidth() / 2)
            .y((d) => y(d.value));

        const color = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(["nameLookupTime", "connectionTime", "tlsHandshakeTime", "dataTransferTime", "totalTime"]);

        const metrics = ["nameLookupTime", "connectionTime", "tlsHandshakeTime", "dataTransferTime", "totalTime"];
        const metricLabels = ["Name lookup", "Connection", "TLS handshake", "Data transfer", "Total time"];
        const lineData = metrics.map(metric => ({
            metric,
            values: data.map((d, i) => ({ index: `Request ${i + 1}`, value: d[metric] }))
        }));

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

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(10, "s").tickFormat(d => `${d} ms`))
            .style("font-size", "14px");

        const legend = svg.append("g")
            .attr("transform", `translate(${margin.left},${height - margin.bottom + 30})`);

        const legendItemSpacing = 150;

        metricLabels.forEach((label, i) => {
            legend.append("rect")
                .attr("x", i * legendItemSpacing)
                .attr("y", 0)
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", color(metrics[i]));

            legend.append("text")
                .attr("x", i * legendItemSpacing + 15)
                .attr("y", 10)
                .attr("fill", `${theme == "dark" ? "white" : "black"}`)
                .text(label)
                .style("font-size", "16px");
        });

        // Create hover box only once
        let hoverBox = d3.select(".hover-box");
        if (hoverBox.empty()) {
            hoverBox = d3.select("body").append("div")
                .attr("class", "hover-box")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", `${theme == "dark" ? "black" : "white"}`)
                .style("color", `${theme == "dark" ? "white" : "black"}`)
                .style("border", "1px solid #ddd")
                .style("padding", "10px")
                .style("font-size", "12px");
        }

        // Create the vertical hover line with white color and wider stroke
        let hoverLine = svg.append("line")
            .attr("class", "hover-line")
            .style("stroke", `${theme == "dark" ? "white" : "gray"}`)  // Set the line color to white
            .style("stroke-width", "2px")  // Make the line a bit wider
            .style("opacity", 0); // Initially hidden

        // Function to show hover line
        const showHoverLine = (index) => {
            hoverLine.attr("x1", x(`Request ${index + 1}`) + x.bandwidth() / 2)
                .attr("x2", x(`Request ${index + 1}`) + x.bandwidth() / 2)
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom)
                .style("opacity", 1);  // Always visible
        };

        // Set up event listeners on the SVG container to manage hover interactions
        svg.on("mousemove", function (event) {
            const [xPos] = d3.pointer(event, this);
            const index = Math.floor((xPos - margin.left) / x.bandwidth());

            if (index >= 0 && index < data.length) {
                const hoveredData = data[index];

                hoverBox.transition().duration(0).style("opacity", 1);
                hoverBox.html(`
                    Name Lookup: ${hoveredData.nameLookupTime} ms<br>
                    Connection: ${hoveredData.connectionTime} ms<br>
                    TLS Handshake: ${hoveredData.tlsHandshakeTime} ms<br>
                    Data Transfer: ${hoveredData.dataTransferTime} ms<br>
                    Total Time: ${hoveredData.totalTime} ms
                `)
                    .style("left", `${event.pageX + 15}px`)
                    .style("top", `${event.pageY - 28}px`);
            }
            showHoverLine(index);
        })
            .on("mouseleave", function () {
                // Hide both hover box and hover line when mouse leaves the chart area
                hoverBox.transition().duration(0).style("opacity", 0);
                hoverLine.style("opacity", 0);
            });

    }, [data, theme]);

    return (
        <div className='border-l border-r border-b dark:border-gray-600 border-black'>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default TimingLineChart;
