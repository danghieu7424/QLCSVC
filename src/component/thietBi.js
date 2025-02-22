import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function thietBi() {
    const [data, setData] = useState([]);
    const [tempData, setTempTempData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nganhList, setNganhList] = useState([]);
    const [phongXuongList, setPhongXuongList] = useState([]);
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

    const handleDelete = async (ID) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;

        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/delete/thiet-bi", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ID }),
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

    const location = useLocation();
    const getQueryParam = (param) => {
        const params = new URLSearchParams(location.search);
        return params.get(param);
    };


    const updateTable = async () => {
        const p = getQueryParam("p");
        setParamPage(p);
        fetch("https://api-jwgltkza6q-uc.a.run.app/api/select/thiet-bi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phong: p }),
        })
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
                "https://api-jwgltkza6q-uc.a.run.app/api/insert/thiet-bi",
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
    const [newRow, setNewRow] = useState({
        TenThietBi: "",
        ViTri: "",
        MaPhongXuong: ""
    });

    const handleAddRow = () => {
        setIsAdding(true);
    };

    useEffect(() => {
        if (newRow.MaPhongXuong !== paramPage) {
            setNewRow((prev) => ({
                ...prev,
                MaPhongXuong: paramPage,
            }));
        }
    }, [newRow]);

    const handleSaveRow = async () => {
        if (
            !newRow.MaPhongXuong.trim() ||
            !newRow.TenThietBi ||
            !newRow.ViTri
        ) {
            alert("Vui lòng điền đầy đủ các thông tin Tên thiết bi, Vị trí.");
            return;
        }
        if (
            !newRow.HienTrang
        ) {
            alert("Vui lòng Chọn hiện trạng.");
            return;
        }
        try {
            setIsAdding(false);
            console.log(newRow)
            await insertTable(newRow); // Gửi dữ liệu lên server
            setNewRow({}); // Reset dữ liệu mới
        } catch (error) {
            console.error("Error saving row:", error);
        }
    };


    const handleCancelRow = () => {
        setNewRow({
            TenThietBi: "",
            ViTri: "",
            MaPhongXuong: paramPage
        }); // Reset dữ liệu mới
        setIsAdding(false); // Ẩn dòng nhập liệu
    };

    //edit
    const [editingRowId, setEditingRowId] = useState([null]);
    const [newEditRow, setNewEditRow] = useState({});

    const handleEdit = (item) => {
        setEditingRowId({ MaThietBi: item.MaThietBi, MaPhongXuong: paramPage }); // Đặt dòng đang chỉnh sửa
        setNewEditRow({ ...item }); // Copy dữ liệu dòng vào newRow
    };

    const handleSave = async () => {
        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/update/thiet-bi", {
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

    const getStateClass = (hienTrang) => {
        switch (hienTrang) {
            case 'Đang sử dụng':
                return 'state in_use';
            case 'Sửa chữa':
                return 'state repair';
            case 'Lỗi':
                return 'state error';
            case 'Hỏng':
                return 'state broken';
            default:
                return 'state';
        }
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
                    <caption>Bảng Thông Tin Thiết Bị Chi Tiết Phòng {paramPage}</caption>
                    <thead>
                        <tr>
                            {/* <th>Mã Thiết Bị</th> */}
                            <th>Tên Thiết Bị</th>
                            <th>Thông Số Kỹ Thuật</th>
                            <th>Năm Sản Xuất</th>
                            <th>Đơn Vị Tính</th>
                            <th>Nước Sản Xuất</th>
                            <th>Hiện Trạng</th>
                            <th>Ghi Chú</th>
                            <th>Vi Trí</th>
                            {/* <th>Mã Phòng</th> */}
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
                                            <span>Mã Thiết Bị</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.MaThietBi}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaThietBi: e.target.value,
                                                    }))
                                                }
                                                disabled
                                            />
                                        </td>
                                        <td>
                                            <span>Tên Thiết Bị</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.TenThietBi}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        TenThietBi: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Thông Số Kỹ Thuật</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.ThongSoKyThuat}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        ThongSoKyThuat: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Năm Sản Xuất</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.NamSanXuat}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        NamSanXuat: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Đơn Vị Tính</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.DonViTinh}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        DonViTinh: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Nước Sản Xuất</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.NuocSanXuat}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        NuocSanXuat: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <span>Hiện Trạng</span>
                                            <select
                                                className="input_row_value"
                                                value={newRow.HienTrang}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        HienTrang: e.target.value,
                                                    }))
                                                }
                                            >
                                                <option value="">Trạng thái</option>
                                                <option value="Đang sử dụng">Đang sử dụng</option>
                                                <option value="Sửa chữa">Sửa chữa</option>
                                                <option value="Lỗi">Lỗi</option>
                                                <option value="Hỏng">Hỏng</option>
                                            </select>
                                        </td>
                                        <td>
                                            <span>Ghi Chú</span>
                                            <input
                                                className="input_row_value"
                                                type="text"
                                                value={newRow.GhiChu}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        GhiChu: e.target.value,
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
                                                        ViTri: e.target.value,
                                                    }))
                                                }
                                            />
                                        </td>
                                        {/* <td>
                                            <span>Mã Phòng</span>
                                            <select
                                                className="input_row_value"
                                                value={newRow.MaPhongXuong}
                                                onChange={(e) =>
                                                    setNewRow((prev) => ({
                                                        ...prev,
                                                        MaPhongXuong: e.target.value, // Lưu mã ngành được chọn
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
                                    <tr key={index} data-id={item.MaThietBi}>
                                        {(editingRowId.MaThietBi === item.MaThietBi) ? (
                                            <>
                                                {/* <td>
                                                    <span>Mã Thiết Bị</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.MaThietBi || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaThietBi: e.target.value,
                                                            }))
                                                        }
                                                        disabled // Không cho phép sửa mã cán bộ
                                                    />
                                                </td> */}
                                                <td>
                                                    <span>Tên Thiết Bị</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.TenThietBi || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                TenThietBi: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Thông Số Kỹ Thuật</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.ThongSoKyThuat || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                ThongSoKyThuat: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Năm Sản Xuất</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.NamSanXuat || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                NamSanXuat: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Đơn Vị Tính</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.DonViTinh || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                DonViTinh: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Nước Sản Xuất</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.NuocSanXuat || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                NuocSanXuat: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <span>Hiện Trạng</span>
                                                    <select
                                                        className="input_row_value"
                                                        value={newEditRow.HienTrang || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                HienTrang: e.target.value,
                                                            }))
                                                        }
                                                    >
                                                        <option value="Đang sử dụng">Đang sử dụng</option>
                                                        <option value="Sửa chữa">Sửa chữa</option>
                                                        <option value="Lỗi">Lỗi</option>
                                                        <option value="Hỏng">Hỏng</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <span>Ghi Chú</span>
                                                    <input
                                                        className="input_row_value"
                                                        type="text"
                                                        value={newEditRow.GhiChu || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                GhiChu: e.target.value,
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
                                                                ViTri: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </td>
                                                {/* <td>
                                                    <span>Mã Phòng</span>
                                                    <select
                                                        className="input_row_value"
                                                        value={newEditRow.MaPhongXuong || ""}
                                                        onChange={(e) =>
                                                            setNewEditRow((prev) => ({
                                                                ...prev,
                                                                MaPhongXuong: e.target.value, // Lưu mã ngành được chọn
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
                                                {/* <td className="textAlignStyle">
                                                    <span>Mã Thiết Bị</span>
                                                    {item.MaThietBi}
                                                </td> */}
                                                <td>
                                                    <span>Tên Thiết Bị</span>
                                                    {item.TenThietBi}
                                                </td>
                                                <td>
                                                    <span>Thông Số Kỹ Thuật</span>
                                                    {item.ThongSoKyThuat}
                                                </td>
                                                <td className="textAlignStyle">
                                                    <span>Năm Sản Xuất</span>
                                                    {item.NamSanXuat}
                                                </td>
                                                <td>
                                                    <span>Đơn Vị Tính</span>
                                                    {item.DonViTinh}
                                                </td>
                                                <td>
                                                    <span>Nước Sản Xuất</span>
                                                    {item.NuocSanXuat}
                                                </td>
                                                <td>
                                                    <span>Hiện Trạng</span>
                                                    <div className={getStateClass(item.HienTrang)}>{item.HienTrang}</div>
                                                </td>
                                                <td>
                                                    <span>Ghi Chú</span>
                                                    {item.GhiChu}
                                                </td>
                                                <td>
                                                    <span>Ghi Chú</span>
                                                    {item.ViTri}
                                                </td>
                                                {/* <td>
                                                    <span>Mã Phòng</span>
                                                    {item.MaPhongXuong}
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
                                                            onClick={() => handleDelete(item.MaThietBi)}
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

export default thietBi;
