import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../access/css/loaiThietBiPage.css";
import "../access/css/thietBiPage.css";
import API_BASE_URL from "./base/config.js";
import {
    InputChange,
    InputSearchSelected,
    InputSearchSelectShow,
    InputSelect,
} from "./base/formContainer.js";
import { Loader, LoaderPage } from "./base/LoaderForm.js";

const columns = [
    { label: "Số loại TB", key: "MaThietBi", type: "center", disable: true },
    { label: "Tên thiết bị", key: "TenLoai", type: "left", disable: true },
    { label: "Trạng thái", key: "TrangThai", type: "left", disable: false },
    {
        label: "Vị trí hiện tại",
        key: "ViTriHienTai",
        type: "left",
        disable: false,
    },
    { label: "Giải trình", key: "GiaiTrinh", type: "left", disable: false },
];

export default function ThietBiPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const [filterDate, setFilterDate] = useState("");

    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [elementLoading, setElementLoading] = useState(false);
    const [phong, setPhong] = useState([]);
    const [trangThai, setTrangThai] = useState([]);
    const [showCheck, setShowCheck] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showText, setShowText] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const [history, setHistory] = useState([]);
    const [selectedTrangThai, setSelectedTrangThai] = useState("");
    const [selectedMaPhong, setSelectedMaPhong] = useState("");

    const [selectedRows, setSelectedRows] = useState([]);

    const fetchTable = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/select/all-thiet-bi`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await res.json();

            if (Array.isArray(result.data)) {
                setData(result.data);
            } else {
                throw new Error("unauthorized");
            }
        } catch (error) {
            if (error.message === "unauthorized") {
                // window.location.href = "/login";
                console.log(error.message);
                // Chuyển hướng đến trang đăng nhập
            } else {
                console.error("Lỗi tải dữ liệu:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/select/phong`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await res.json();

            if (Array.isArray(result.data)) {
                setPhong(result.data);
            } else {
                throw new Error("unauthorized");
            }
        } catch (error) {
            if (error.message === "unauthorized") {
            } else {
                console.error("Lỗi tải dữ liệu:", error.message);
            }
        }
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/select/trang-thai-thiet-bi`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (Array.isArray(result.data)) {
                setTrangThai(result.data);
            } else {
                throw new Error("unauthorized");
            }
        } catch (error) {
            if (error.message === "unauthorized") {
                window.location.href = "/login";
            } else {
                console.error("Lỗi tải dữ liệu:", error.message);
            }
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/select/thiet-bi/lich-su`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (Array.isArray(result.data)) {
                setHistory(result.data);
            } else {
                throw new Error("unauthorized");
            }
        } catch (error) {
            if (error.message === "unauthorized") {
                // window.location.href = "/login";
                console.log(error.message);
                // Chuyển hướng đến trang đăng nhập
            } else {
                console.error("Lỗi tải dữ liệu:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchTable();
        fetchHistory();
    }, []);

    useEffect(() => {
        const savedTrangThai = localStorage.getItem("TrangThai") || "";
        const savedMaPhong = localStorage.getItem("MaPhong") || "";

        setSelectedTrangThai(savedTrangThai);
        setSelectedMaPhong(savedMaPhong);
    }, []);

    useEffect(() => {
        let filtered = [...data];

        if (selectedTrangThai) {
            filtered = filtered.filter(
                (item) => item.TrangThai === selectedTrangThai
            );
        }

        if (selectedMaPhong) {
            filtered = filtered.filter(
                (item) => item.ViTriHienTai === selectedMaPhong
            );
        }

        setShowData(filtered);
    }, [data, selectedTrangThai, selectedMaPhong]);

    const handleUpdate = async (rowIndex, keys, newValues) => {
        setElementLoading(true);
        const row = data[rowIndex];

        // Cập nhật đồng thời nhiều giá trị
        const updatedRow = { ...row };

        keys.forEach((key, index) => {
            updatedRow[key] = newValues[index];
        });

        // Gửi API cập nhật
        try {
            const res = await fetch(`${API_BASE_URL}/api/update/thiet-bi`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ ...updatedRow }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");

            toast.success(result.message);
            const newData = [...data];
            newData[rowIndex] = updatedRow;
            setData(newData);
        } catch (error) {
            console.error("Lỗi cập nhật:", error.message);
            setLoading(true);
            toast.error(error.message);
        } finally {
            fetchTable();
            setElementLoading(false);
        }
    };

    const handleBatchUpdate = async (newViTriHienTai) => {
        if (selectedRows.length === 0) return;

        setElementLoading(true);

        try {
            const payload = data
                .filter((row) =>
                    selectedRows.some(
                        (sel) =>
                            sel.MaThietBi === row.MaThietBi &&
                            sel.MaLoai === row.MaLoai
                    )
                )
                .map((row) => ({
                    MaThietBi: row.MaThietBi,
                    MaLoai: row.MaLoai,
                    TrangThai: row.TrangThai,
                    ViTriHienTai: newViTriHienTai,
                    GiaiTrinh: row.GiaiTrinh || "",
                }));

            const res = await fetch(
                `${API_BASE_URL}/api/update/nhieu-thiet-bi`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Lỗi cập nhật");

            toast.success("Cập nhật vị trí hàng loạt thành công.");
            fetchTable();
        } catch (error) {
            console.error("Lỗi cập nhật hàng loạt:", error.message);
            toast.error(error.message);
        } finally {
            setElementLoading(false);
        }
    };

    const handleGetListThanhLy = async () => {
        const confirm = window.confirm(
            "Bạn có chắc chắn muốn thanh lý những thiết bị này không?"
        );
        if (!confirm) return;
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/select/danh-sach-thanh-ly`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify([...selectedRows]),
                }
            );

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Lỗi.");

            console.log(result.data);

            toast.success(result.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        } finally {
            setElementLoading(false);
        }
    };

    const filteredHistory = history.filter((row) => {
        if (!filterDate) return true; // không lọc nếu chưa chọn ngày
        return row.ThoiGian.startsWith(filterDate); // so sánh phần ngày
    });

    return (
        <div className="page-container thp-container tb-container">
            {loading && <LoaderPage />}
            {!loading && (
                <>
                    {true && (
                        <div
                            className={`box_history ${
                                showHistory ? "active" : ""
                            }`}
                        >
                            <div className="box_history-btn">
                                <button
                                    title="Đóng"
                                    className="btnCancel"
                                    onClick={() => {
                                        setShowHistory(false);
                                    }}
                                >
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                                    </svg>
                                </button>
                                <div className="box_history-filter">
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) =>
                                            setFilterDate(e.target.value)
                                        }
                                        placeholder="Chọn ngày"
                                        className="input-date"
                                    />
                                </div>
                            </div>
                            <div className="box_history-main">
                                <table>
                                    <caption>
                                        <h2>Lịch sử sửa đổi</h2>
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th>Số loại TB</th>
                                            <th>Tên thiết bị</th>
                                            <th>Trường thay đổi</th>
                                            <th>Giá trị đổi</th>
                                            <th>Thời gian</th>
                                            <th>Cán Bộ thực hiện</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHistory.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>{row.MaThietBi}</td>
                                                <td>{row.TenLoai}</td>
                                                <td>{row.TruongThayDoi}</td>
                                                <td>{`${row.GiaTriCu} >>> ${row.GiaTriMoi}`}</td>
                                                <td>{row.ThoiGian}</td>
                                                <td>{row.TenCanBo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {showEdit && (
                        <div className="box-show-edit">
                            <div className="box-show-edit-title">
                                <div className="box-show-edit-btn">
                                    <button
                                        title="OK"
                                        onClick={() => {
                                            // setShowEdit(true);
                                        }}
                                        className="btnOK"
                                        disabled={elementLoading}
                                    >
                                        {elementLoading ? (
                                            <Loader
                                                width="20px"
                                                height="20px"
                                                color="#fff"
                                            />
                                        ) : (
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                                            </svg>
                                        )}
                                    </button>

                                    <button
                                        title="Hủy"
                                        className="btnCancel"
                                        onClick={() => {
                                            setShowEdit(false);
                                        }}
                                        disabled={elementLoading}
                                    >
                                        {elementLoading ? (
                                            <Loader
                                                width="20px"
                                                height="20px"
                                                color="#fff"
                                            />
                                        ) : (
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <h2>Sửa hàng loạt</h2>
                                <div className="box-show-edit-content">
                                    <span>Vị trí hiện tại: </span>
                                    <InputSearchSelectShow
                                        keyShow="MaPhong"
                                        keyList="MaPhong"
                                        value={""}
                                        list={phong}
                                        onChange={(selected) => {
                                            if (selected) {
                                                handleBatchUpdate(
                                                    selected.MaPhong
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div id="box_tools_container">
                        <div className="box_filter">
                            <div className="box_filter-item">
                                <span>Trạng thái:</span>
                                <InputSearchSelected
                                    keyShow="label"
                                    keyList=""
                                    value={selectedTrangThai}
                                    list={trangThai.map((dvt) => ({
                                        label: dvt,
                                    }))}
                                    onChange={(selected) => {
                                        if (selected) {
                                            localStorage.setItem(
                                                "TrangThai",
                                                selected.label
                                            );
                                            setSelectedTrangThai(
                                                selected.label
                                            );
                                        }
                                    }}
                                    inputStyle={{ width: "10rem" }}
                                />
                            </div>
                            <div className="box_filter-item">
                                <span>Vị trí hiện tại:</span>
                                <InputSearchSelected
                                    keyShow="MaPhong"
                                    keyList="MaPhong"
                                    value={selectedMaPhong}
                                    list={phong}
                                    onChange={(selected) => {
                                        if (selected) {
                                            localStorage.setItem(
                                                "TrangThai",
                                                selected.MaPhong
                                            );
                                            setSelectedMaPhong(
                                                selected.MaPhong
                                            );
                                        }
                                    }}
                                    inputStyle={{ width: "10rem" }}
                                />
                            </div>
                        </div>
                        <div className="box_tools">
                            <div className={`box_tools-style box_tools-add`}>
                                {!(showCheck || showText) ? (
                                    <>
                                        <button
                                            title="Sửa nhiều dòng"
                                            onClick={() => {
                                                setShowCheck((prev) => !prev);
                                            }}
                                            className="btnAdd"
                                            disabled={elementLoading}
                                        >
                                            {elementLoading ? (
                                                <Loader />
                                            ) : (
                                                <svg
                                                    viewBox="0 0 24.00 24.00"
                                                    fill="none"
                                                >
                                                    <g
                                                        id="SVGRepo_bgCarrier"
                                                        strokeWidth="0"
                                                    ></g>
                                                    <g
                                                        id="SVGRepo_tracerCarrier"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        stroke="#CCCCCC"
                                                        strokeWidth="0.144"
                                                    ></g>
                                                    <g id="SVGRepo_iconCarrier">
                                                        <path
                                                            d="M15.4998 5.50067L18.3282 8.3291M13 21H21M3 21.0004L3.04745 20.6683C3.21536 19.4929 3.29932 18.9052 3.49029 18.3565C3.65975 17.8697 3.89124 17.4067 4.17906 16.979C4.50341 16.497 4.92319 16.0772 5.76274 15.2377L17.4107 3.58969C18.1918 2.80865 19.4581 2.80864 20.2392 3.58969C21.0202 4.37074 21.0202 5.63707 20.2392 6.41812L8.37744 18.2798C7.61579 19.0415 7.23497 19.4223 6.8012 19.7252C6.41618 19.994 6.00093 20.2167 5.56398 20.3887C5.07171 20.5824 4.54375 20.6889 3.48793 20.902L3 21.0004Z"
                                                            stroke="#000000"
                                                            strokeWidth="0.72"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            title="Lịch sử sửa đổi"
                                            onClick={() => {
                                                setShowHistory(true);
                                                fetchHistory();
                                            }}
                                            className="btnAdd"
                                            disabled={elementLoading}
                                        >
                                            {elementLoading ? (
                                                <Loader />
                                            ) : (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                                                    <path d="M13 7h-2v6h6v-2h-4z"></path>
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            title="Văn bản"
                                            onClick={() => {
                                                setShowCheck(true);
                                                setShowText(true);
                                            }}
                                            className="btnAdd"
                                            disabled={elementLoading}
                                        >
                                            {elementLoading ? (
                                                <Loader />
                                            ) : (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"></path>
                                                    <path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            title="OK"
                                            onClick={() => {
                                                if (showEdit) {
                                                    setShowEdit(true);
                                                }
                                                if (showText) {
                                                    handleGetListThanhLy();
                                                    // console.log(selectedRows);
                                                }
                                            }}
                                            className="btnOK"
                                            disabled={elementLoading}
                                        >
                                            {elementLoading ? (
                                                <Loader
                                                    width="20px"
                                                    height="20px"
                                                    color="#fff"
                                                />
                                            ) : (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                                                </svg>
                                            )}
                                        </button>

                                        <button
                                            title="Hủy"
                                            className="btnCancel"
                                            onClick={() => {
                                                setShowCheck(false);
                                                setShowText(false);
                                                setSelectedRows([]);
                                            }}
                                            disabled={elementLoading}
                                        >
                                            {elementLoading ? (
                                                <Loader
                                                    width="20px"
                                                    height="20px"
                                                    color="#fff"
                                                />
                                            ) : (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        id="box_table_container"
                        style={{ overflow: "visible" }}
                    >
                        <h2>Bảng thông tin về Thiết Bị</h2>
                        <table>
                            <thead>
                                <tr>
                                    {showCheck && <th></th>}
                                    {columns.map((col, idx) => (
                                        <th key={idx} className={col.type}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {showData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {showCheck && (
                                            <td
                                                style={{
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    checked={selectedRows.some(
                                                        (item) =>
                                                            item.MaThietBi ===
                                                                row.MaThietBi &&
                                                            item.MaLoai ===
                                                                row.MaLoai
                                                    )}
                                                    onChange={(e) => {
                                                        const isChecked =
                                                            e.target.checked;

                                                        setSelectedRows(
                                                            (prev) => {
                                                                if (isChecked) {
                                                                    return [
                                                                        ...prev,
                                                                        {
                                                                            MaThietBi:
                                                                                row.MaThietBi,
                                                                            MaLoai: row.MaLoai,
                                                                        },
                                                                    ];
                                                                } else {
                                                                    return prev.filter(
                                                                        (
                                                                            item
                                                                        ) =>
                                                                            item.MaThietBi !==
                                                                                row.MaThietBi ||
                                                                            item.MaLoai !==
                                                                                row.MaLoai
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                />
                                            </td>
                                        )}
                                        {columns.map((col, colIndex) => {
                                            // Render riêng cho TenCanBo (từ MaCanBoTruong)
                                            if (col.key === "ViTriHienTai") {
                                                // Tìm TenCanBo từ MaCanBoTruong
                                                const current = phong.find(
                                                    (p) =>
                                                        p.MaPhong ===
                                                        row.ViTriHienTai
                                                );
                                                const currentTen =
                                                    current?.MaPhong || "";

                                                return (
                                                    <td
                                                        key={colIndex}
                                                        className={col.type}
                                                    >
                                                        <InputSearchSelectShow
                                                            keyShow="MaPhong"
                                                            keyList="MaPhong"
                                                            value={currentTen}
                                                            list={phong}
                                                            onChange={(
                                                                selected
                                                            ) => {
                                                                if (selected) {
                                                                    handleUpdate(
                                                                        rowIndex,
                                                                        [
                                                                            "ViTriHienTai",
                                                                        ],
                                                                        [
                                                                            selected.MaPhong,
                                                                        ]
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                );
                                            }

                                            if (col.key === "TrangThai") {
                                                const current = trangThai.find(
                                                    (dvt) =>
                                                        dvt === row.TrangThai
                                                );
                                                const currentTen =
                                                    current || "";

                                                return (
                                                    <td
                                                        key={colIndex}
                                                        className={col.type}
                                                    >
                                                        <InputSelect
                                                            value={currentTen}
                                                            list={trangThai.map(
                                                                (dvt) => dvt
                                                            )}
                                                            onChange={(
                                                                selectedTen
                                                            ) => {
                                                                const selected =
                                                                    trangThai.find(
                                                                        (dvt) =>
                                                                            dvt ===
                                                                            selectedTen
                                                                    );
                                                                if (selected) {
                                                                    handleUpdate(
                                                                        rowIndex,
                                                                        [
                                                                            "TrangThai",
                                                                        ],
                                                                        [
                                                                            selected,
                                                                        ]
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                );
                                            }

                                            // Các cột còn lại vẫn là InputChange
                                            return (
                                                <td
                                                    key={colIndex}
                                                    className={col.type}
                                                >
                                                    <InputChange
                                                        value={row[col.key]}
                                                        disabled={col.disable}
                                                        onChange={(newVal) =>
                                                            handleUpdate(
                                                                rowIndex,
                                                                [col.key],
                                                                [newVal]
                                                            )
                                                        }
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
