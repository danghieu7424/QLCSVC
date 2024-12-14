import React, { useEffect, useState } from "react";

function RenderTabletd() {
    retrun(
        <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
            <td>Row 1, Col 3</td>
            <td>Row 1, Col 4</td>
        </tr>
    )
}
function PhongDDTU() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/phong_ddtu")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã phòng</th>
                            <th>Tên phòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="2">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.MAPH}</td>
                                    <td>{item.TENP}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function TaiSanDDTU() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/ts_ddtu")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã phòng</th>
                            <th>Tên phòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="2">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.MAPH}</td>
                                    <td>{item.TENP}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function TLTaiSanDDTU() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/tlst_ddtu")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã phòng</th>
                            <th>Tên phòng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="2">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.MAPH}</td>
                                    <td>{item.TENP}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}


export { PhongDDTU, TaiSanDDTU, TLTaiSanDDTU };