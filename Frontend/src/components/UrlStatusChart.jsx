import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BollingerChart = ({ initialData = [], initialLabels = [] }) => {
    const [chartData, setChartData] = useState({
        labels: initialLabels,
        datasets: [
            {
                data: initialData,
            },
        ],
    });

    useEffect(() => {
        setChartData({
            labels: initialLabels,
            datasets: [{ data: initialData }],
        });
    }, [initialData, initialLabels]);

    const colorize = (opaque) => {
        return (ctx) => {
            const v = ctx.parsed.y;
            const c =
                v < 500 ? '#44DE28' : '#D60000';

            return opaque ? c : transparentize(c, 1 - Math.abs(v / 150));
        };
    };

    const transparentize = (color, opacity) => {
        const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
        return `${color}${alpha}`;
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            plugins: {
                legend: false,
            },
            elements: {
                bar: {
                    backgroundColor: colorize(false),
                    borderColor: colorize(true),
                    borderWidth: 2,
                },
            },
        },
    };

    return (
        <div className='border-l border-r border-b border-gray-500 p-4'>
            <Bar data={chartData} options={config.options} />
        </div>
    );
};

export default BollingerChart;
