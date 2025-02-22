import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PhongKTCK() {
    const [data, setData] = useState([]);
    const [tempData, setTempTempData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nganhList, setNganhList] = useState([]);
    const [phongXuongList, setPhongXuongList] = useState([]);

    // lọc
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        const filtered = tempData.filter((item) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        );
        setData(filtered); // Lọc dữ liệu theo từ khóa
    };

    const handleDelete = async (MaPhongXuong) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;

        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/delete/phong", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ MaPhongXuong }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Lỗi: ${error.error}`);
                return;
            }

            updateTable();
            alert("Xóa thành công");
        } catch (error) {
            console.error("Lỗi khi gọi API xóa:", error);
            alert("Đã xảy ra lỗi khi xóa");
        }
    };


    //API

    const updateTable = async () => {
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/phong-ktck")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData); // Lưu dữ liệu vào state
                setTempTempData(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    const insertTable = async (data) => {
        try {
            const response = await fetch(
                "https://api-jwgltkza6q-uc.a.run.app/api/insert/phong",
                {
                    method: "POST", // Sử dụng POST
                    headers: {
                        "Content-Type": "application/json", // Đặt kiểu dữ liệu là JSON
                    },
                    body: JSON.stringify(data), // Chuyển đổi dữ liệu thành JSON
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            updateTable();
        } catch (error) {
            console.error("Error inserting data:", error);
            alert(error)
        }
    };

    const fetchAPI = async () => {
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/nganh")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setNganhList(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });

        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/phong-xuong")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setPhongXuongList(jsonData); // Lưu dữ liệu vào state
                setLoading(false); // Dừng trạng thái loading
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    useEffect(() => {
        const createWebSocket = () => {
            const socket = new WebSocket(
                "wss://api-jwgltkza6q-uc.a.run.app/ws"
            );

            socket.onopen = () => {
                // console.log("Đã kết nối WebSocket!");
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (
                    data.action === "INSERT" ||
                    data.action === "UPDATE" ||
                    data.action === "DELETE"
                ) {
                    updateTable();
                }
            };

            socket.onclose = () => {
                // console.log("WebSocket đã bị đóng!");
                // console.log("Đang thử kết nối lại...");
                setTimeout(() => {
                    createWebSocket();
                }, 1000);
            };

            socket.onerror = (error) => {
                console.error("Lỗi WebSocket:", error);
            };
        };
        createWebSocket();
        updateTable();
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

    // add row
    const [isAdding, setIsAdding] = useState(false);
    const [newRow, setNewRow] = useState({});

    const handleAddRow = () => {
        setIsAdding(true); // Hiển thị dòng nhập liệu
    };

    const handleSaveRow = async () => {
        if (
            !newRow.MaPhongXuong.trim() || 
            !newRow.TenPhongXuong.trim() ||
            !newRow.ViTri.trim() ||
            !newRow.MaNganh.trim()
        ) {
            alert("Vui lòng điền đầy đủ các thông tin.");
            return;
        }
        newRow.MaPhongXuong = newRow.MaPhongXuong.toUpperCase();
        const regex = /^[A-Z][0-9]{3}$/; // Regex kiểm tra ký tự đầu là a-z và 3 ký số
        if (!regex.test(newRow.MaPhongXuong)) {
            alert('ký tự đầu là a-z và 3 ký số!')
            return;
        }
        try {
            setIsAdding(false);
            await insertTable(newRow); // Gửi dữ liệu lên server
            setNewRow({}); // Reset dữ liệu mới
        } catch (error) {
            console.error("Error saving row:", error);
        }
    };


    const handleCancelRow = () => {
        setNewRow({
            TenPhongXuong: "",
            ViTri: "",
        }); // Reset dữ liệu mới
        setIsAdding(false); // Ẩn dòng nhập liệu
    };

    //edit
    const [editingRowId, setEditingRowId] = useState([null]);
    const [newEditRow, setNewEditRow] = useState({});

    const handleEdit = (item) => {
        setEditingRowId({ MaPhongXuong: item.MaPhongXuong }); // Đặt dòng đang chỉnh sửa
        setNewEditRow({ ...item }); // Copy dữ liệu dòng vào newRow
    };

    const handleSave = async () => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/update/phong", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEditRow),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Lỗi: ${error.error}`);
                return;
            }

            alert("Cập nhật thành công");
            updateTable(); // Tải lại dữ liệu từ server
            setEditingRowId([null]);
            setNewEditRow({});
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            console.log(newEditRow);
            alert("Đã xảy ra lỗi khi cập nhật");
        }
    };

    const handleCancelSave = () => {
        setEditingRowId([null]);
        setNewEditRow({});
    }


    return (
        <section id="section__introduce">
            <div id="functions">
                <div id="search">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            if (value.trim() === "") {
                                updateTable(); // Hiển thị toàn bộ dữ liệu nếu input trống
                            } else {
                                handleSearch(value); // Gọi tìm kiếm ngay khi input thay đổi
                            }
                        }}
                        placeholder="Tìm kiếm..."
                    />
                    <label>
                        <i className="bx bx-search"></i>
                    </label>
                </div>
                <div className="box_functions">
                    <ul>
                        <li id="add_info" onClick={handleAddRow}>
                            <abbr title="Add"><i className="bx bxs-plus-square"></i></abbr>
                        </li>
                        {/* <li id="import_file">
                            <abbr title="Import"><i className="bx bxs-file-plus"></i></abbr>
                        </li> */}
                    </ul>
                </div>
            </div>
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng Thông Tin Phòng KTCK</caption>
                    <thead>
                        <tr>
                            <th>Mã Phòng Xưởng</th>
                            <th>Tên Phòng Xưởng</th>
                            <th>Vị Trí</th>
                            {/* <th>Mã Ngành</th> */}
                            <th>Chức Năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="1">Loading...</td>
                            </tr>
                        ) : (
                            <>
                                {isAdding && (
                                    <tr>
                                        <td>
                                            <span>Mã Phòng Xưởng</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.MaPhongXuong}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaPhongXuong: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Tên Phòng Xưởng</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.TenPhongXuong}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        TenPhongXuong:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Vị Trí</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.ViTri}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        ViTri:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>

                                        {/* <td>
                                            <span>Mã Nghành</span>
                                            <select
                                                className="input_row_value"
                                                value={newRow.MaNganh}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaNganh: e.target.value, // Lưu mã ngành được chọn
                                                    }))
                                                }
                                                disabled
                                            >
                                                <option value="7510201">7510201</option>
                                            </select>
                                        </td> */}

                                        <td
                                            id="table-function"
                                            style={{ display: "flex" }}
                                        >
                                            <abbr title="OK">
                                                <button
                                                    id="btn_done"
                                                    onClick={handleSaveRow}
                                                >
                                                    <i className="bx bx-check"></i>
                                                </button>
                                            </abbr>
                                            <abbr title="Cancel">
                                                <button
                                                    id="btn_cancel"
                                                    onClick={handleCancelRow}
                                                >
                                                    <i className="bx bx-x"></i>
                                                </button>
                                            </abbr>

                                        </td>
                                    </tr>
                                )}
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        {(editingRowId.MaPhongXuong === item.MaPhongXuong) ? (
                                            <>
                                                <td>
                                                    <span>Mã Phòng Xưởng</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.MaPhongXuong || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaPhongXuong: e.target.value,
                                                            }))
                                                        }
                                                        disabled // Không cho phép sửa mã cán bộ
                                                    />
                                                </td>
                                                <td>
                                                    <span>Tên Phòng Xưởng</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.TenPhongXuong || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                TenPhongXuong: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Vị Trí</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.ViTri || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                ViTri:
                                                                    e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>

                                                {/* <td>
                                                    <span>Mã Ngành</span>
                                                    <select
                                                        className="input_row_value"
                                                        value={newEditRow.MaNganh || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaNganh: e.target.value, // Lưu mã ngành được chọn
                                                            }))
                                                        }
                                                        disabled
                                                    >
                                                        <option value="7510201">7510201</option>
                                                    </select>
                                                </td> */}
                                                <td
                                                    id="table-function"
                                                    style={{ display: "flex" }}
                                                >
                                                    <abbr title="Save">
                                                        <button id="btnSave" onClick={handleSave}>
                                                            <i className="bx bxs-save"></i>
                                                        </button>
                                                    </abbr>
                                                    <abbr title="Cancel">
                                                        <button
                                                            id="btn_cancel"
                                                            onClick={handleCancelSave}
                                                        >
                                                            <i className="bx bx-x"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>
                                                    <span>Mã Phòng Xưởng</span>
                                                    <Link to={`/thiet-bi?p=${item.MaPhongXuong}`}>{item.MaPhongXuong}</Link>
                                                </td>
                                                <td>
                                                    <span>Tên Phòng Xưởng</span>
                                                    {item.TenPhongXuong || ""}
                                                </td>
                                                <td>
                                                    <span>Vị Trí</span>
                                                    {item.ViTri || ""}
                                                </td>
                                                {/* <td>
                                                    <span>Mã Ngành</span>
                                                    {item.MaNganh || ""}
                                                </td> */}
                                                <td
                                                    id="table-function"
                                                    style={{ display: "flex" }}
                                                >
                                                    <abbr title="Edit">
                                                        <button
                                                            id="btnEdit"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="bx bx-edit"></i>
                                                        </button>
                                                    </abbr>
                                                    <abbr title="Delete">
                                                        <button
                                                            id="btnDel"
                                                            onClick={() => handleDelete(item.MaPhongXuong)}
                                                        >
                                                            <i className="bx bxs-x-square"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export { PhongKTCK };
