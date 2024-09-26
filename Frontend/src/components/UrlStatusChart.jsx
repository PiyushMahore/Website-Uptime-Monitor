import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Main component
const BollingerChart = ({ aapl, N, K }) => {
    const svgRef = useRef();

    // D3 chart logic inside useEffect
    useEffect(() => {
        if (!aapl || aapl.length === 0) return;

        const width = 928;
        const height = 600;
        const marginTop = 10;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        const values = Float64Array.from(aapl, d => d.Close);

        const x = d3.scaleTime()
            .domain(d3.extent(aapl, d => d.Date))
            .rangeRound([marginLeft, width - marginRight]);

        const y = d3.scaleLog()
            .domain(d3.extent(values))
            .rangeRound([height - marginBottom - 20, marginTop]);

        const line = d3.line()
            .defined((y, i) => !isNaN(aapl[i].Date) && !isNaN(y))
            .x((d, i) => x(aapl[i].Date))
            .y(y);

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        svg.selectAll("*").remove(); // Clear previous drawings if any

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80))
            .call(g => g.select(".domain").remove());

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickValues(d3.ticks(...y.domain(), 10)).tickFormat(d => d))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("↑ Daily close ($)"));

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data([values, ...bollinger(values, N, [-K, 0, +K])])
            .join("path")
            .attr("stroke", (d, i) => ["#aaa", "green", "blue", "red"][i])
            .attr("d", line);

    }, [aapl, N, K]); // Dependencies for when the chart should re-render

    // Helper function to compute Bollinger Bands
    function bollinger(values, N, K) {
        let i = 0;
        let sum = 0;
        let sum2 = 0;
        const bands = K.map(() => new Float64Array(values.length).fill(NaN));
        for (let n = Math.min(N - 1, values.length); i < n; ++i) {
            const value = values[i];
            sum += value, sum2 += value ** 2;
        }
        for (let n = values.length, m = bands.length; i < n; ++i) {
            const value = values[i];
            sum += value, sum2 += value ** 2;
            const mean = sum / N;
            const deviation = Math.sqrt((sum2 - sum ** 2 / N) / (N - 1));
            for (let j = 0; j < K.length; ++j) {
                bands[j][i] = mean + deviation * K[j];
            }
            const value0 = values[i - N + 1];
            sum -= value0, sum2 -= value0 ** 2;
        }
        return bands;
    }

    return (
        <div className='border-l border-r border-b border-black'>
            <svg className='pt-3 w-full' ref={svgRef}></svg>
        </div>
    );
};

export default BollingerChart;
