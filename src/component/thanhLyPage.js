import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./authContext.js";

function ThanhLyPage() {
    const { userData, login } = useAuth();
    const [data, setData] = useState([]);
    const [tempData, setTempTempData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tempList, setTempList] = useState([]);
    const [tempList1, setTempList1] = useState([]);
    const [paramPage, setParamPage] = useState("");

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

    useEffect(() => {
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && !userData) {
            fetch("https://api-jwgltkza6q-uc.a.run.app/protected-route", {
                method: "GET",
                headers: { Authorization: token },
            })
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data) login(data.user);
                })
                .catch((error) => {
                    console.error("Error during token verification: ", error);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                });
        }
    }, [userData, login]);

    //API

    const location = useLocation();
    const getQueryParam = (param) => {
        const params = new URLSearchParams(location.search);
        return params.get(param);
    };

    const updateTable = async () => {
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/thanh-ly", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
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
                "https://api-jwgltkza6q-uc.a.run.app/api/insert/thanh-ly",
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
            alert(error);
        }
    };

    const fetchAPI = async () => {
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/can-bo")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                setTempList(jsonData[0]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/thiet-bi-all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((jsonData) => {
                console.log(jsonData);
                setTempList1(jsonData);
                setLoading(false);
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
        TenThietBi: "",
        MaCanBo: userData?.id,
        NgayThanhLy: "",
        ThanhTien: 0,
    });

    useEffect(() => {
        if (userData?.id) {
            setNewRow((prev) => ({
                ...prev,
                MaCanBo: userData.id,
            }));
        }
    }, [userData]);

    const handleAddRow = () => {
        setIsAdding(true);
    };

    const handleSaveRow = async () => {
        if (!userData?.id) {
            alert("chưa đăng nhập");
            return;
        }
        if (
            !newRow.TenThietBi.trim() ||
            !newRow.NgayThanhLy ||
            !newRow.ThanhTien
        ) {
            alert("Vui lòng điền đầy đủ các thông tin.");
            return;
        }
        // Kiểm tra ngày thanh lý phải nhỏ hơn ngày hiện tại
        const ngayThanhLy = new Date(newRow.NgayThanhLy);
        const ngayHienTai = new Date();
        ngayHienTai.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chính xác

        if (ngayThanhLy >= ngayHienTai) {
            alert("Ngày thanh lý phải nhỏ hơn ngày hiện tại.");
            return;
        }

        try {
            setIsAdding(false);
            console.log(newRow);
            await insertTable(newRow); // Gửi dữ liệu lên server
            setNewRow({
                TenThietBi: "",
                MaCanBo: userData?.id,
                NgayThanhLy: "",
                ThanhTien: 0,
            }); // Reset dữ liệu mới
        } catch (error) {
            console.error("Error saving row:", error);
        }
    };

    const handleCancelRow = () => {
        setNewRow({}); // Reset dữ liệu mới
        setIsAdding(false); // Ẩn dòng nhập liệu
    };

    //edit
    const [editingRowId, setEditingRowId] = useState([null]);
    const [newEditRow, setNewEditRow] = useState({});

    const handleEdit = (item) => {
        setEditingRowId({ MaMua: item.MaMua }); // Đặt dòng đang chỉnh sửa
        setNewEditRow({ ...item }); // Copy dữ liệu dòng vào newRow
    };

    const handleSave = async () => {
        console.log(newEditRow);
        try {
            const response = await fetch(
                "https://api-jwgltkza6q-uc.a.run.app/api/update/kho",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newEditRow),
                }
            );

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
    };

    const [filteredList, setFilteredList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setNewRow((prev) => ({ ...prev, TenThietBi: inputValue }));

        // Lọc theo cả TenThietBi, ViTri và MaPhongXuong
        if (inputValue.trim() === "") {
            setFilteredList([]);
            setShowDropdown(false);
        } else {
            const filtered = tempList1.filter((item) =>
                `${item.TenThietBi} ${item.ViTri} ${item.MaPhongXuong}`
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            );
            setFilteredList(filtered);
            setShowDropdown(true);
        }
    };

    const handleSelectItem = (selectedItem) => {
        setNewRow((prev) => ({
            ...prev,
            MaThietBi: selectedItem.MaThietBi,
            MaThietBi: selectedItem.MaThietBi,
        }));
        setShowDropdown(false);
    };

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
                            <abbr title="Add">
                                <i className="bx bxs-plus-square"></i>
                            </abbr>
                        </li>
                        {/* <li id="import_file">
                            <abbr title="Import"><i className="bx bxs-file-plus"></i></abbr>
                        </li> */}
                    </ul>
                </div>
            </div>
            <div id="box_table">
                <table id="content_table">
                    <caption>
                        Bảng Thông Tin Thiết Bị Chi Tiết Thanh Lý Thiết Bị
                    </caption>
                    <thead>
                        <tr>
                            <th>Mã Thanh Lý</th>
                            <th>Tên Thiết Bị</th>
                            <th>Cán Bộ</th>
                            <th>Ngày Thanh Lý</th>
                            <th>Thành Tiền</th>
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
                                            <span>Mã Thanh Lý</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.MaThanhLy}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaThanhLy:
                                                            e.target.value,
                                                    }))
                                                }
                                                disabled
                                            />
                                        </td>
                                        <td style={{ position: "relative" }}>
                                            <span>Tên Thiết Bị</span>
                                            <input
                                                type="text"
                                                className="input_row_value"
                                                value={newRow.TenThietBi || ""}
                                                onChange={handleInputChange}
                                                onFocus={() =>
                                                    setShowDropdown(true)
                                                }
                                                onBlur={() =>
                                                    setTimeout(
                                                        () =>
                                                            setShowDropdown(
                                                                false
                                                            ),
                                                        200
                                                    )
                                                }
                                                placeholder="Nhập tên thiết bị..."
                                            />
                                            {showDropdown &&
                                                filteredList.length > 0 && (
                                                    <ul
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "100%",
                                                            left: 0,
                                                            width: "100%",
                                                            background: "white",
                                                            border: "1px solid #ccc",
                                                            listStyle: "none",
                                                            padding: "5px",
                                                            margin: 0,
                                                            maxHeight: "150px",
                                                            overflowY: "auto",
                                                            zIndex: 10,
                                                        }}
                                                    >
                                                        {filteredList.map(
                                                            (item) => (
                                                                <li
                                                                    key={
                                                                        item.MaThietBi
                                                                    }
                                                                    onMouseDown={() =>
                                                                        handleSelectItem(
                                                                            item
                                                                        )
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            "5px",
                                                                        cursor: "pointer",
                                                                        borderBottom:
                                                                            "1px solid #ddd",
                                                                    }}
                                                                >
                                                                    {`${item.TenThietBi} - ${item.ViTri} - ${item.MaPhongXuong}`}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                        </td>
                                        <td>
                                            <span>Cán Bộ</span>
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
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <span>Ngày Thanh Lý</span>
                                            <input
                                                className="input_row_value"
                                                type="date"
                                                value={newRow.NgayThanhLy || ""}
                                                onChange={(e) => {
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        NgayThanhLy:
                                                            e.target.value,
                                                    }));
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <span>Thành Tiền</span>
                                            <input
                                                className="input_row_value"
                                                type="number"
                                                value={newRow.ThanhTien || ""}
                                                onChange={(e) => {
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        ThanhTien:
                                                            e.target.value,
                                                    }));
                                                }}
                                            />
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
                                    <tr key={index} data-id={item.MaThanhLy}>
                                        {editingRowId.MaThanhLy ===
                                        item.MaThanhLy ? (
                                            <>
                                                <td>
                                                    <span>Mã Thanh Lý</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={
                                                            newEditRow.MaThanhLy ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewEditRow(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    MaThanhLy:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <span>Tên Thiết Bị</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={
                                                            newEditRow.MaThietBi ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewEditRow(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    MaThietBi:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <span>Cán Bộ</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={
                                                            newEditRow.MaCanBo ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewEditRow(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    MaCanBo:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <span>Ngày Thanh Lý</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={
                                                            newEditRow.NgayThanhLy ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewEditRow(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    NgayThanhLy:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                                <td>
                                                    <span>Thành Tiền</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={
                                                            newEditRow.ThanhTien ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setNewEditRow(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    ThanhTien:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                </td>

                                                <td
                                                    id="table-function"
                                                    style={{ display: "flex" }}
                                                >
                                                    <abbr title="Save">
                                                        <button
                                                            id="btnSave"
                                                            onClick={handleSave}
                                                        >
                                                            <i className="bx bxs-save"></i>
                                                        </button>
                                                    </abbr>
                                                    <abbr title="Cancel">
                                                        <button
                                                            id="btn_cancel"
                                                            onClick={
                                                                handleCancelSave
                                                            }
                                                        >
                                                            <i className="bx bx-x"></i>
                                                        </button>
                                                    </abbr>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="textAlignStyle">
                                                    <span>Mã Thanh Lý</span>
                                                    {item.MaThanhLy}
                                                </td>
                                                <td>
                                                    <span>Tên Thiết Bị</span>
                                                    {tempList1.find(
                                                        (temp) =>
                                                            temp.MaThietBi ===
                                                            item.MaThietBi
                                                    )?.TenThietBi ||
                                                        "Không xác định"}
                                                </td>
                                                <td>
                                                    <span>Cán Bộ</span>
                                                    {tempList.find(
                                                        (temp) =>
                                                            temp.MaCanBo ===
                                                            item.MaCanBo
                                                    )?.TenCanBo ||
                                                        "Không xác định"}
                                                </td>
                                                <td className="textAlignStyle">
                                                    <span>Ngày Thanh Lý</span>
                                                    {new Date(
                                                        item.NgayThanhLy
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )}
                                                </td>
                                                <td>
                                                    <span>Thành Tiền</span>
                                                    {`${Number(
                                                        item.ThanhTien
                                                    ).toLocaleString("vi-VN", {
                                                        maximumFractionDigits: 0,
                                                    })} đ`}
                                                </td>

                                                <td
                                                    id="table-function"
                                                    style={{ display: "flex" }}
                                                >
                                                    {/* <abbr title="Edit">
                                                        <button
                                                            id="btnEdit"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="bx bx-edit"></i>
                                                        </button>
                                                    </abbr> */}
                                                    {/* <abbr title="Delete">
                                                        <button
                                                            id="btnDel"
                                                            onClick={() => handleDelete(item.MaThietBi)}
                                                        >
                                                            <i className="bx bxs-x-square"></i>
                                                        </button>
                                                    </abbr> */}
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

export default ThanhLyPage;
