import React, { useEffect, useState } from "react";
import "../access/css/truongHocPhanPage.css";
import API_BASE_URL from "./base/config";
import {
    InputChange,
    InputSearchSelect,
    InputSearchSelectShow,
    InputSelect,
} from "./base/formContainer.js";

const columns = [
    { label: "Mã Học Phần", key: "MaHocPhan", type: "center" },
    { label: "Tên Học Phần", key: "TenHocPhan", type: "left" },
    { label: "Số Tín Chỉ", key: "SoTinChi", type: "center" },
    { label: "Cán Bộ Trưởng", key: "TenCanBo", type: "left" },
    { label: "Ngành", key: "TenNganh", type: "left" },
];

export default function TruongHocPhanPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canBo, setCanBo] = useState([]);
    const [nganh, setNganh] = useState([]);
    const [addShow, setAddShow] = useState(false);
    const [showCheck, setShowCheck] = useState(false);
    const [addRow, setAddRow] = useState({
        MaHocPhan: "",
        TenHocPhan: "",
        SoTinChi: "",
        MaCanBoTruong: "",
        MaNganh: "",
    });
    const [selectedRows, setSelectedRows] = useState([]);

    const fetchTable = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/select/truong-hoc-phan`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (Array.isArray(result)) {
                setData(result);
            } else {
                throw new Error("unauthorized");
            }
        } catch (error) {
            if (error.message === "unauthorized") {
                window.location.href = "/login";
            } else {
                console.error("Lỗi tải dữ liệu:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/select/data`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const result = await res.json();

            if (Array.isArray(result.CanBo) && Array.isArray(result.Nganh)) {
                setCanBo(result.CanBo);
                setNganh(result.Nganh);
                // console.log(result)
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

    useEffect(() => {
        fetchData();
        fetchTable();
    }, []);

    const handleUpdate = async (rowIndex, keys, newValues) => {
        const row = data[rowIndex];
        const id = row.MaHocPhan; // Khóa chính

        // Cập nhật đồng thời nhiều giá trị
        const updatedRow = { ...row };

        keys.forEach((key, index) => {
            updatedRow[key] = newValues[index];
        });

        // Gửi API cập nhật
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/update/truong-hoc-phan`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ ...updatedRow }),
                }
            );

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
            setLoading(false);
        }
    };

    const resetUpdate = () => {
        setAddRow({
            MaHocPhan: "",
            TenHocPhan: "",
            SoTinChi: "",
            MaCanBoTruong: "",
            MaNganh: "",
        });
    };

    const handleAddHocPhan = async () => {
        console.log(addRow);
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/insert/truong-hoc-phan`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ ...addRow }),
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message || "Lưu không thành công.");

            resetUpdate();
            toast.success(result.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        } finally {
            fetchTable();
            setLoading(false);
        }
    };

    useEffect(() => {}, [addRow]);

    const handleDel = async () => {
        const confirmed = window.confirm(
            "Bạn có chắc chắn muốn xóa các học phần đã chọn không?"
        );
        if (!confirmed) return;

        try {
            const res = await fetch(
                `${API_BASE_URL}/api/delete/truong-hoc-phan`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify([...selectedRows]),
                }
            );

            const result = await res.json();

            if (!res.ok)
                throw new Error(result.message || "Xóa không thành công.");

            toast.success(result.message);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        } finally {
            fetchTable();
            setLoading(false);
        }
    };

    const classNameElement = () => {
        if (addShow) return " box_tools-add";
        if (showCheck) return " box_tools-del";
        return "";
    };

    if (loading)
        return (
            <div className="page-container thp-container">
                <p>Đang tải dữ liệu...</p>
            </div>
        );

    return (
        <div className="page-container thp-container">
            <div id="box_tools_container">
                <div></div>
                <div className="box_tools">
                    <div className={`box_tools-style${classNameElement()}`}>
                        {!(addShow || showCheck) ? (
                            <>
                                <abbr title="Thêm">
                                    <button
                                        onClick={() => setAddShow(true)}
                                        className="btnAdd"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                                        </svg>
                                    </button>
                                </abbr>
                                <abbr title="Xóa">
                                    <button
                                        onClick={() => setShowCheck(true)}
                                        className="btnDel"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M7 11h10v2H7z"></path>
                                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                                        </svg>
                                    </button>
                                </abbr>
                            </>
                        ) : (
                            <>
                                <abbr title="OK">
                                    <button
                                        onClick={() => {
                                            if (addShow) {
                                                handleAddHocPhan();
                                            }
                                            if (showCheck) {
                                                handleDel();
                                            }
                                        }}
                                        className="btnOK"
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                                        </svg>
                                    </button>
                                </abbr>
                                <abbr title="Cancel">
                                    <button
                                        className="btnCancel"
                                        onClick={() => {
                                            if (addShow) {
                                                resetUpdate();
                                                setAddShow(false);
                                            }
                                            if (showCheck) {
                                                setShowCheck(false);
                                                setSelectedRows([]);
                                            }
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
                                </abbr>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div id="box_table_container">
                <h2>Bảng thông tin về Học Phần</h2>
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
                        {addShow && (
                            <tr>
                                {columns.map((col, index) => (
                                    <td key={index}>
                                        {col.key === "TenCanBo" ? (
                                            <InputSearchSelect
                                                keyShow="TenCanBo"
                                                list={canBo}
                                                onChange={(selected) =>
                                                    setAddRow((prev) => ({
                                                        ...prev,
                                                        MaCanBoTruong:
                                                            selected.MaCanBo,
                                                    }))
                                                }
                                            />
                                        ) : col.key === "TenNganh" ? (
                                            <InputSearchSelect
                                                keyShow="TenNganh"
                                                list={nganh}
                                                onChange={(selected) =>
                                                    setAddRow((prev) => ({
                                                        ...prev,
                                                        MaNganh:
                                                            selected.MaNganh,
                                                    }))
                                                }
                                            />
                                        ) : (
                                            <input
                                                className="inputAdd"
                                                onChange={(e) => {
                                                    setAddRow((prev) => ({
                                                        ...prev,
                                                        [col.key]:
                                                            e.target.value,
                                                    }));
                                                }}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        )}
                        {data.map((row, rowIndex) => (
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
                                            style={{ cursor: "pointer" }}
                                            checked={selectedRows.includes(
                                                row.MaHocPhan
                                            )}
                                            onChange={(e) => {
                                                const isChecked =
                                                    e.target.checked;
                                                setSelectedRows((prev) => {
                                                    if (isChecked) {
                                                        return [
                                                            ...prev,
                                                            row.MaHocPhan,
                                                        ];
                                                    } else {
                                                        return prev.filter(
                                                            (id) =>
                                                                id !==
                                                                row.MaHocPhan
                                                        );
                                                    }
                                                });
                                            }}
                                        />
                                    </td>
                                )}
                                {columns.map((col, colIndex) => {
                                    // Render riêng cho TenCanBo (từ MaCanBoTruong)
                                    if (col.key === "TenCanBo") {
                                        // Tìm TenCanBo từ MaCanBoTruong
                                        const currentCanBo = canBo.find(
                                            (cb) =>
                                                cb.MaCanBo === row.MaCanBoTruong
                                        );
                                        const currentTenCanBo =
                                            currentCanBo?.TenCanBo || "";

                                        return (
                                            <td
                                                key={colIndex}
                                                className={col.type}
                                            >
                                                <InputSearchSelectShow
                                                    keyShow="TenCanBo"
                                                    keyList="MaTen"
                                                    value={currentTenCanBo}
                                                    list={canBo.map((cb) => ({
                                                        ...cb,
                                                        MaTen: `${cb.MaCanBo} - ${cb.TenCanBo}`,
                                                    }))}
                                                    onChange={(selected) => {
                                                        if (selected) {
                                                            handleUpdate(
                                                                rowIndex,
                                                                [
                                                                    "MaCanBoTruong",
                                                                ],
                                                                [
                                                                    selected.MaCanBo,
                                                                ]
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                        );
                                    }
                                    if (col.key === "TenNganh") {
                                        const current = nganh.find(
                                            (cb) => cb.MaNganh === row.MaNganh
                                        );
                                        const currentTen =
                                            current?.TenNganh || "";

                                        return (
                                            <td
                                                key={colIndex}
                                                className={col.type}
                                            >
                                                <InputSelect
                                                    value={currentTen}
                                                    list={nganh.map(
                                                        (n) => n.TenNganh
                                                    )}
                                                    onChange={(selectedTen) => {
                                                        const selected =
                                                            nganh.find(
                                                                (n) =>
                                                                    n.TenNganh ===
                                                                    selectedTen
                                                            );
                                                        if (selected) {
                                                            handleUpdate(
                                                                rowIndex,
                                                                [
                                                                    "MaNganh",
                                                                    "TenNganh",
                                                                ],
                                                                [
                                                                    selected.MaNganh,
                                                                    selected.TenNganh,
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
                                        <td key={colIndex} className={col.type}>
                                            <InputChange
                                                value={row[col.key]}
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
        </div>
    );
}
