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
                                    <td>{item.MAPX}</td>
                                    <td>{item.TENPX || ''}</td>
                                    <td>{item.MANG || ''}</td>
                                    <td>{item.MACB || ''}</td>
                                    <td>{item.GiaiDoanQL || ''}</td>
                                    <td>{item.Sotu || ''}</td>
                                    <td>{item.GioQD || ''}</td>
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
                                    <td>{item.MADO || ''}</td>
                                    <td>{item.TENDO || ''}</td>
                                    <td>{item.THONGSOKT || 'N/A'}</td>
                                    <td>{item.MAPH || 'N/A'}</td>
                                    <td>{item.NOISX || ''}</td>
                                    <td>{item.DVT || 'N/A'}</td>
                                    <td>{item.GLGSS || '0'}</td>
                                    <td>{item.GLGTT || '0'}</td>
                                    <td>{item.SLTHUA || '0'}</td>
                                    <td>{item.SLTHIEU || '0'}</td>
                                    <td>{item.SLSD || '0'}</td>
                                    <td>{item.GIAITRINH || ''}</td>
                                    <td>{item.GHICHU || ''}</td>
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
                                    <td>{item.MADO || 'N/A'}</td>
                                    <td>{item.TENDO || 'N/A'}</td>
                                    <td>{item.MAPX || 'N/A'}</td>
                                    <td>{item.TSKT || 'N/A'}</td>
                                    <td>{item.NOISX || 'N/A'}</td>
                                    <td>{item.DVI || 'N/A'}</td>
                                    <td>{item.DNTL || 'N/A'}</td>
                                    <td>{item.GIAITRINH || 'N/A'}</td>
                                    <td>{item.GIAITS || 'N/A'}</td>
                                    <td>{item.THANHTIEN ? item.THANHTIEN.toLocaleString() : '0'}</td>
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
