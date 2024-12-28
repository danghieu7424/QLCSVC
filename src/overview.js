import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController, // Đăng ký controller cho biểu đồ thanh
} from "chart.js";
import './assets/css/overview.css';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController // Đăng ký BarController
);

function Overview() {
    useEffect(() => {
        // Dữ liệu biểu đồ
        const data = {
            labels: ["Hoạt động", "Sửa chữa", "Hỏng", "Đã hỏng"],
            datasets: [
                {
                    label: "Số lượng",
                    data: [100, 10, 5, 6],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };

        // Tùy chọn biểu đồ
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Biểu đồ hoạt động thiết bị",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        // Lấy phần tử canvas và khởi tạo biểu đồ
        const ctx = document.getElementById('Chart').getContext('2d');
        new ChartJS(ctx, {
            type: 'bar', // Loại biểu đồ
            data: data,
            options: options,
        });
    }, []); // Chỉ chạy khi component được mount

    return (
        <div className='box_overview'>
            <div id='overview_container'>
                <div className='overview_content'>
                    <div className='item'>
                        <h4 >Số thiết bị</h4>
                        <span>2000</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị cntt</h4>
                        <span>500</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị Đ-ĐT</h4>
                        <span>800</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị KT</h4>
                        <span>700</span>
                    </div>
                </div>
                <div className='overview_chart'>
                    <canvas id='Chart'></canvas>
                </div>
            </div>
        </div>
    );
}

export { Overview };
