import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type BarChartProps = {
    data: any[];
    decimal: number;
    width?: number;
    height?: number;
};

export default function App(props: BarChartProps) {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };

    const labels = props?.data?.map((i) => i.label);
    const values = props?.data?.map((i) => i.value.toFixed(props.decimal));

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: "rgba(200, 99, 132, 0.5)",
            },
        ],
    };
    return <Bar options={options} data={data} height={9} width={16} />;
}
