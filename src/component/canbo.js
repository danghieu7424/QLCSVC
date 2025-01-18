import React, { useEffect, useState } from "react";

function CanBo() {
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

    const handleDelete = async (MaCanBo, MaPhongXuong) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa cán bộ này?")) return;

        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/delete/can-bo", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ MaCanBo, MaPhongXuong }),
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
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/can-bo")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                // console.log("API Response:", jsonData); // Log dữ liệu từ API
                setData(jsonData[0]); // Lưu dữ liệu vào state
                setTempTempData(jsonData[0]); // Lưu dữ liệu vào state
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
                "https://api-jwgltkza6q-uc.a.run.app/api/insert/can-bo",
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
    const [newRow, setNewRow] = useState({
        MaCanBo: "",
        TenCanBo: "",
        SoDienThoai: "",
        MaPhongXuong: "",
        VaiTroQL: "",
    });

    const handleAddRow = () => {
        setIsAdding(true); // Hiển thị dòng nhập liệu
    };

    const handleSaveRow = async () => {
        if (
            !newRow.MaCanBo.trim() ||
            !newRow.TenCanBo.trim() ||
            !newRow.MaPhongXuong.trim() ||
            !newRow.MaNganh.trim()
        ) {
            alert("Vui lòng điền đầy đủ các thông tin: Mã Cán Bộ, Tên Cán Bộ, Phòng Xưởng, Ngành.");
            return;
        }
        try {
            setIsAdding(false);
            await insertTable(newRow); // Gửi dữ liệu lên server
            setNewRow({
                MaCanBo: "",
                TenCanBo: "",
                SoDienThoai: "",
                MaPhongXuong: "",
                VaiTroQL: "",
            }); // Reset dữ liệu mới
        } catch (error) {
            console.error("Error saving row:", error);
        }
    };


    const handleCancelRow = () => {
        setNewRow({
            MaCanBo: "",
            TenCanBo: "",
            SoDienThoai: "",
            MaPhongXuong: "",
            VaiTroQL: "",
        }); // Reset dữ liệu mới
        setIsAdding(false); // Ẩn dòng nhập liệu
    };

    //edit
    const [editingRowId, setEditingRowId] = useState([null, null]);
    const [newEditRow, setNewEditRow] = useState({});

    const handleEdit = (item) => {
        setEditingRowId({ MaCanBo: item.MaCanBo, MaPhongXuong: item.MaPhongXuong }); // Đặt dòng đang chỉnh sửa
        setNewEditRow({ ...item }); // Copy dữ liệu dòng vào newRow
    };

    const handleSave = async () => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/update/can-bo", {
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
            setEditingRowId([null, null]);
            setNewEditRow({});
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            alert("Đã xảy ra lỗi khi cập nhật");
        }
    };

    const handleCancelSave = () => {
        setEditingRowId([null, null]);
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
                        <li id="import_file">
                            <abbr title="Import"><i className="bx bxs-file-plus"></i></abbr>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="box_table">
                <table id="content_table">
                    <caption>Bảng Thông Tin Cán Bộ</caption>
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
                            <>
                                {isAdding && (
                                    <tr>
                                        <td>
                                            <span>Mã Cán Bộ</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.MaCanBo}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaCanBo: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Tên Cán Bộ</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.TenCanBo}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        TenCanBo:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Số Điện Thoại</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.SoDienThoai}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        SoDienThoai:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Phòng Xưởng</span>
                                            <select
                                                className="input_row_value"
                                                value={newRow.MaPhongXuong}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaPhongXuong: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">Chọn phòng</option>
                                                {phongXuongList.map((phong) => (
                                                    <option key={phong.MaPhongXuong} value={phong.MaPhongXuong}>
                                                        {phong.MaPhongXuong}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <span>Vai Trò Quản Lý</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.VaiTroQL}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        VaiTroQL:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>

                                        <td>
                                            <span>Ngành</span>
                                            <select
                                                className="input_row_value"
                                                value={newRow.MaNganh}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaNganh: e.target.value, // Lưu mã ngành được chọn
                                                    }))
                                                }
                                            >
                                                <option value="">Chọn ngành</option>
                                                {nganhList.map((nganh) => (
                                                    <option key={nganh.MaNganh} value={nganh.MaNganh}>
                                                        {nganh.TenNganh}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

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
                                        {(editingRowId.MaCanBo === item.MaCanBo && editingRowId.MaPhongXuong ===  item.MaPhongXuong) ? (
                                            <>
                                                <td>
                                                    <span>Mã Cán Bộ</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.MaCanBo || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaCanBo: e.target.value,
                                                            }))
                                                        }
                                                        disabled // Không cho phép sửa mã cán bộ
                                                    />
                                                </td>
                                                <td>
                                                    <span>Tên Cán Bộ</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.TenCanBo || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                TenCanBo: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Số Điện Thoại</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.SoDienThoai || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                SoDienThoai:
                                                                    e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Phòng Xưởng</span>
                                                    <select
                                                        className="input_row_value"
                                                        value={newEditRow.MaPhongXuong || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaPhongXuong: e.target.value,
                                                            }))
                                                        }
                                                        disabled
                                                    >
                                                        <option value="">Chọn phòng</option>
                                                        {phongXuongList.map((phong) => (
                                                            <option key={phong.MaPhongXuong} value={phong.MaPhongXuong}>
                                                                {phong.MaPhongXuong}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <span>Vai Trò Quản Lý</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.VaiTroQL || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                VaiTroQL:
                                                                    e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <span>Ngành</span>
                                                    <select
                                                        className="input_row_value"
                                                        value={newEditRow.MaNganh || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaNganh: e.target.value, // Lưu mã ngành được chọn
                                                            }))
                                                        }
                                                    >
                                                        <option value="">Chọn ngành</option>
                                                        {nganhList.map((nganh) => (
                                                            <option key={nganh.MaNganh} value={nganh.MaNganh}>
                                                                {nganh.TenNganh}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
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
                                                    <span>Mã Cán Bộ</span>
                                                    {item.MaCanBo}
                                                </td>
                                                <td>
                                                    <span>Tên Cán Bộ</span>
                                                    {item.TenCanBo || ""}
                                                </td>
                                                <td>
                                                    <span>Số Điện Thoại</span>
                                                    {item.SoDienThoai || ""}
                                                </td>
                                                <td>
                                                    <span>Phòng Xưởng</span>
                                                    {item.MaPhongXuong || ""}
                                                </td>
                                                <td>
                                                    <span>Vai Trò Quản Lý</span>
                                                    {item.VaiTroQL || ""}
                                                </td>
                                                <td>
                                                    <span>Ngành</span>
                                                    {item.TenNganh || ""}
                                                </td>
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
                                                            onClick={() => handleDelete(item.MaCanBo, item.MaPhongXuong)}
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

export { CanBo };
