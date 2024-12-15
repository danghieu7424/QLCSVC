import React, { useEffect, useState } from "react";

function RenderTabletd() {
    retrun(
        <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
            <td>Row 1, Col 3</td>
            <td>Row 1, Col 4</td>
        </tr>
    );
}
function PhongKTCK() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/phong_ktck")
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

    useEffect(() => {
        /*
         * @param {HTMLTableElement}
         * @param {number}
         * @param {boolean}
         */
        function sortTableByColumn(table, column, asc = true) {
            const dirModifier = asc ? 1 : -1;
            const tBody = table.tBodies[0];
            const rows = Array.from(tBody.querySelectorAll("tr"));

            const sortedRows = rows.sort((a, b) => {
                const aColText = a
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();
                const bColText = b
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();

                return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
            });

            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }

            tBody.append(...sortedRows);

            table
                .querySelectorAll("th")
                .forEach((th) =>
                    th.classList.remove("th-sort-asc", "th-sort-desc")
                );
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-asc", asc);
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-desc", !asc);
        }

        document.querySelectorAll("#content_table th").forEach((headerCell) => {
            headerCell.addEventListener("click", () => {
                const tableElement =
                    headerCell.parentElement.parentElement.parentElement;
                const headerIndex = Array.prototype.indexOf.call(
                    headerCell.parentElement.children,
                    headerCell
                );
                const currentIsAscending =
                    headerCell.classList.contains("th-sort-asc");

                sortTableByColumn(
                    tableElement,
                    headerIndex,
                    !currentIsAscending
                );
            });
        });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã Phòng</th>
                            <th>Tên Phòng</th>
                            <th>Mã Ngành</th>
                            <th>Mã Cán Bộ</th>
                            <th>Giai Đoạn QL</th>
                            <th>Số Tuần</th>
                            <th>Giờ Quy Đổi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="1">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td><span>Mã Phòng</span>{item.MAPX}</td>
                                    <td><span>Tên Phòng</span>{item.TENPX || ''}</td>
                                    <td><span>Mã Ngành</span>{item.MANG || ''}</td>
                                    <td><span>Mã Cán Bộ</span>{item.MACB || ''}</td>
                                    <td><span>Giai Đoạn QL</span>{item.GiaiDoanQL || ''}</td>
                                    <td><span>Số Tuần</span>{item.Sotu || ''}</td>
                                    <td><span>Giờ Quy Đổi</span>{item.GioQD || ''}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function TaiSanKTCK() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/ts_ktck")
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

    useEffect(() => {
        /*
         * @param {HTMLTableElement}
         * @param {number}
         * @param {boolean}
         */
        function sortTableByColumn(table, column, asc = true) {
            const dirModifier = asc ? 1 : -1;
            const tBody = table.tBodies[0];
            const rows = Array.from(tBody.querySelectorAll("tr"));

            const sortedRows = rows.sort((a, b) => {
                const aColText = a
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();
                const bColText = b
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();

                return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
            });

            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }

            tBody.append(...sortedRows);

            table
                .querySelectorAll("th")
                .forEach((th) =>
                    th.classList.remove("th-sort-asc", "th-sort-desc")
                );
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-asc", asc);
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-desc", !asc);
        }

        document.querySelectorAll("#content_table th").forEach((headerCell) => {
            headerCell.addEventListener("click", () => {
                const tableElement =
                    headerCell.parentElement.parentElement.parentElement;
                const headerIndex = Array.prototype.indexOf.call(
                    headerCell.parentElement.children,
                    headerCell
                );
                const currentIsAscending =
                    headerCell.classList.contains("th-sort-asc");

                sortTableByColumn(
                    tableElement,
                    headerIndex,
                    !currentIsAscending
                );
            });
        });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã Đồ</th>
                            <th>Tên Đồ</th>
                            <th>Thông Số KT</th>
                            <th>Mã Phòng</th>
                            <th>Nơi SX</th>
                            <th>ĐVT</th>
                            <th>GLGSS</th>
                            <th>GLGTT</th>
                            <th>SL Thừa</th>
                            <th>SL Thiếu</th>
                            <th>SLSD</th>
                            <th>Giải Trình</th>
                            <th>Ghi Chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="1">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td><span>Mã Đồ</span>{item.MADO || ''}</td>
                                    <td><span>Tên Đồ</span>{item.TENDO || ''}</td>
                                    <td><span>Thông Số KT</span>{item.THONGSOKT || 'N/A'}</td>
                                    <td><span>Mã Phòng</span>{item.MAPX || 'N/A'}</td>
                                    <td><span>Nơi SX</span>{item.NOISX || ''}</td>
                                    <td><span>ĐVT</span>{item.DVT || 'N/A'}</td>
                                    <td><span>GLGSS</span>{item.GLGSS || '0'}</td>
                                    <td><span>GLGTT</span>{item.GLGTT || '0'}</td>
                                    <td><span>SL Thừa</span>{item.SLTHUA || '0'}</td>
                                    <td><span>SL Thiếu</span>{item.SLTHIEU || '0'}</td>
                                    <td><span>SLSD</span>{item.SLSD || '0'}</td>
                                    <td><span>Giải Trình</span>{item.GIAITRINH || ''}</td>
                                    <td><span>Ghi Chú</span>{item.GHICHU || ''}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}


function TLTaiSanKTCK() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/tlts_ktck")
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

    useEffect(() => {
        /*
         * @param {HTMLTableElement}
         * @param {number}
         * @param {boolean}
         */
        function sortTableByColumn(table, column, asc = true) {
            const dirModifier = asc ? 1 : -1;
            const tBody = table.tBodies[0];
            const rows = Array.from(tBody.querySelectorAll("tr"));

            const sortedRows = rows.sort((a, b) => {
                const aColText = a
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();
                const bColText = b
                    .querySelector(`td:nth-child(${column + 1})`)
                    .textContent.trim();

                return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
            });

            while (tBody.firstChild) {
                tBody.removeChild(tBody.firstChild);
            }

            tBody.append(...sortedRows);

            table
                .querySelectorAll("th")
                .forEach((th) =>
                    th.classList.remove("th-sort-asc", "th-sort-desc")
                );
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-asc", asc);
            table
                .querySelector(`th:nth-child(${column + 1})`)
                .classList.toggle("th-sort-desc", !asc);
        }

        document.querySelectorAll("#content_table th").forEach((headerCell) => {
            headerCell.addEventListener("click", () => {
                const tableElement =
                    headerCell.parentElement.parentElement.parentElement;
                const headerIndex = Array.prototype.indexOf.call(
                    headerCell.parentElement.children,
                    headerCell
                );
                const currentIsAscending =
                    headerCell.classList.contains("th-sort-asc");

                sortTableByColumn(
                    tableElement,
                    headerIndex,
                    !currentIsAscending
                );
            });
        });
    }, []);

    return (
        <section id="section__introduce">
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng</caption>
                    <thead>
                        <tr>
                            <th>Mã Đồ</th>
                            <th>Tên Đồ</th>
                            <th>Mã Phòng</th>
                            <th>Thông Số KT</th>
                            <th>Nơi SX</th>
                            <th>ĐVT</th>
                            <th>DNTL</th>
                            <th>Giải Trình</th>
                            <th>Giải TS</th>
                            <th>Thành Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="1">Loading...</td>
                            </tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td><span>Mã Đồ</span>{item.MADO || 'N/A'}</td>
                                    <td><span>Tên Đồ</span>{item.TENDO || 'N/A'}</td>
                                    <td><span>Mã Phòng</span>{item.MAPX || 'N/A'}</td>
                                    <td><span>Thông Số KT</span>{item.TSKT || 'N/A'}</td>
                                    <td><span>Nơi SX</span>{item.NOISX || 'N/A'}</td>
                                    <td><span>ĐVT</span>{item.DVI || 'N/A'}</td>
                                    <td><span>DNTL</span>{item.DNTL || 'N/A'}</td>
                                    <td><span>Giải Trình</span>{item.GIAITRINH || 'N/A'}</td>
                                    <td><span>Giải TS</span>{item.GIAITS || 'N/A'}</td>
                                    <td><span>Thành Tiền</span>{item.THANHTIEN ? item.THANHTIEN.toLocaleString() : '0'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}


export { PhongKTCK, TaiSanKTCK, TLTaiSanKTCK };
