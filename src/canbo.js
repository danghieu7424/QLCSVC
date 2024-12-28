import React, { useEffect, useState } from "react";

function CanBo() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gọi API
        fetch("http://localhost:3000/api/can-bo")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData[0]); // Lưu dữ liệu vào state
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
                            <th>Mã Cán Bộ</th>
                            <th>Tên Cán Bộ</th>
                            <th>Số Điện Thoại</th>
                            <th>Phòng Xưởng</th>
                            <th>Vai Trò Quản Lý</th>
                            <th>Ngành</th>
                            <th>Chức Năng</th>
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
                                    <td><span>Mã Cán Bộ</span>{item.MaCanBo}</td>
                                    <td><span>Tên Cán Bộ</span>{item.TenCanBo || ''}</td>
                                    <td><span>Số Điện Thoại</span>{item.SoDienThoai || ''}</td>
                                    <td><span>Phòng Xưởng</span>{item.MaPhongXuong || ''}</td>
                                    <td><span>Vai Trò Quản Lý</span>{item.VaiTroQL || ''}</td>
                                    <td><span>Ngành</span>{item.TenNganh || ''}</td>
                                    <td id="table-function">
                                        <abbr title="Edit"><button id="btnEdit"><i class='bx bx-edit'></i></button></abbr>
                                        <abbr title="Save"><button id="btnSave"><i class='bx bxs-save' ></i></button></abbr>
                                        <abbr title="Delete"><button id="btnDel"><i class='bx bxs-x-square' ></i></button></abbr>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}



export { CanBo };
