import React, { useEffect, useState, useRef } from 'react';
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
import '../assets/css/overview.css';

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
    const [totalQuantity , setTotalQuantity] = useState(0);
    const [numberOfDevices , setNNumberOfDevices] = useState([]);
    const [currentStatus , setCurrentStatus] = useState([]);
    const chartInstanceRef = useRef(null); // Dùng useRef để lưu trữ instance của biểu đồ

    useEffect(() => {
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/so-luong-thiet-bi')
        .then(res => res.json())
        .then(data => {
            setTotalQuantity(data[0].SL);
            console.log(data[0])
        })
        .catch((err) => {
            console.log(err);
        });
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/so-luong-thiet-bi-nganh')
        .then(res => res.json())
        .then(data => {
            setNNumberOfDevices(data);
            console.log(data)
        })
        .catch((err) => {
            console.log(err);
        });
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/hien-trang')
        .then(res => res.json())
        .then(data => {
            setCurrentStatus(data);
            console.log(data)
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        const dataStatus = currentStatus.map(item => item.SL);
        const labelsStatus = currentStatus.map(item => item.HienTrang);

        // Dữ liệu biểu đồ
        const data = {
            labels: labelsStatus,
            datasets: [
                {
                    label: "Số lượng",
                    data: dataStatus,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
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

        // Hủy biểu đồ cũ nếu tồn tại
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Tạo biểu đồ mới và lưu trữ instance
        const ctx = document.getElementById('Chart').getContext('2d');
        chartInstanceRef.current = new ChartJS(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });
    }, [currentStatus]); // Chỉ chạy khi currentStatus thay đổi

    return (
        <div className='box_overview'>
            <div id='overview_container'>
                <div className='overview_content'>
                    <div className='item'>
                        <h4 >Số thiết bị</h4>
                        <span>{totalQuantity}</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị cntt</h4>
                        <span>{numberOfDevices.find(item => item.MaNganh === "7480201")?.SL || "N/A"}</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị Đ-ĐT</h4>
                        <span>{numberOfDevices.find(item => item.MaNganh === "7510301")?.SL || "N/A"}</span>
                    </div>
                    <div className='item'>
                        <h4 >Số thiết bị KT</h4>
                        <span>{numberOfDevices.find(item => item.MaNganh === "7510201")?.SL || "N/A"}</span>
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
