import React, { useEffect, useState } from "react";
import API_BASE_URL from "./base/config";
import { InputSearchSelect } from "./base/formContainer.js";

import "../access/css/thamGiaHocPhanPage.css";

export default function ThamGiaHocPhanPage() {
    const [data, setData] = useState([]);
    const [truongHocPhan, setTruongHocPhan] = useState("");
    const [maTruongHocPhan, setMaTruongHocPhan] = useState("");
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState({}); // để điều khiển node mở rộng
    const [activeAddIndex, setActiveAddIndex] = useState(null);
    const [canBo, setCanBo] = useState([]);
    const [selectCanBo, setSelectCanBo] = useState({
        MaHocPhan: "",
        MaCanBo: "",
    });

    const updateTreeview = () => {
        fetch(`${API_BASE_URL}/api/select/tham-gia-hoc-phan`, {
            credentials: "include", // Để gửi cookie nếu backend dùng cookie
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData.data) {
                    setData(resData.data);
                    // console.log(resData);
                    setTruongHocPhan(resData.TruongHocPhan);
                    setMaTruongHocPhan(resData.MaTruongHocPhan);
                    const initialExpanded = {};
                    resData.data.forEach((hocPhan, index) => {
                        initialExpanded[index] = false; // Mặc định mở rộng
                    });
                    setExpanded(initialExpanded);

                    const savedExpanded = localStorage.getItem("expandedNodes");
                    if (savedExpanded) {
                        setExpanded(JSON.parse(savedExpanded));
                    }
                } else {
                    setError("Không có dữ liệu.");
                }
            })
            .catch((err) => {
                setError("Lỗi khi tải dữ liệu.");
                console.error(err);
            });
    };

    useEffect(() => {
        updateTreeview();
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/select/can-bo`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((resData) => {
                const processed = resData
                    .filter(item => item.MaCanBo !== maTruongHocPhan)
                    .map(item => ({
                        ...item,
                        MaTen: `${item.MaCanBo} - ${item.TenCanBo}`
                    }));
                setCanBo(processed);
            })
            .catch((err) => {
                setError("Lỗi khi tải dữ liệu.");
                console.error(err);
            });

        const savedExpanded = localStorage.getItem("expandedNodes");
        if (savedExpanded) {
            setExpanded(JSON.parse(savedExpanded));
        }
    }, [maTruongHocPhan]);

    const toggleExpand = (index) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const toggleExpandAdd = (index) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: true,
        }));
        if (activeAddIndex) {
            setActiveAddIndex(null);
            setSelectCanBo({
                MaHocPhan: "",
                MaCanBo: "",
            });
        } else {
            setActiveAddIndex((prev) => (prev === index ? null : index));
        }
    };

    useEffect(() => {
        localStorage.setItem("expandedNodes", JSON.stringify(expanded));
    }, [expanded]);


    const expandAll = () => {
        const allExpanded = {};
        data.forEach((_, index) => {
            allExpanded[index] = true;
        });
        setExpanded(allExpanded);
    };

    const collapseAll = () => {
        const allCollapsed = {};
        data.forEach((_, index) => {
            allCollapsed[index] = false;
        });
        setExpanded(allCollapsed);
    };

    const handleAddCanBo = (index, selected) => {
        const MaCanBo = selected.split(" - ")[0]; // Tách theo dấu " - "

        setSelectCanBo({ MaHocPhan: data[index].MaHocPhan, MaCanBo });
    };

    const handleSendAddCanBo = () => {
        fetch(`${API_BASE_URL}/api/insert/tham-gia-hoc-phan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(selectCanBo),
        })
            .then((res) => res.json())
            .then((resData) => {
                setActiveAddIndex(null);
                setSelectCanBo({
                    MaHocPhan: "",
                    MaCanBo: "",
                });
                
                toast.success(resData.message);
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message);
            })
            .finally(() => {
                updateTreeview();
            });
    };

    const handleDelCanBo = (MaHocPhan, MaCanBo) => {
        const confirm = window.confirm("Xác nhận xóa.");

        if (!confirm) {
            return;
        }

        fetch(`${API_BASE_URL}/api/delete/tham-gia-hoc-phan`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ MaHocPhan, MaCanBo }),
        })
            .then((res) => res.json())
            .then((resData) => {
                setActiveAddIndex(null);
                setSelectCanBo({
                    MaHocPhan: "",
                    MaCanBo: "",
                });
                toast.success(resData.message);
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message);
            })
            .finally(() => {
                updateTreeview();
            });
    };

    return (
        <div className="page-container tghp-container">
            <div className="box-tree-view">
                <div className="box-tree-view-head">
                    <span>
                        {truongHocPhan} {"(Trưởng Học Phần)"}
                    </span>
                    <div className="buttons">
                        <abbr title="Mở rộng toàn bộ">
                            <button onClick={expandAll}>
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path d="m12 19.24-4.95-4.95-1.41 1.42L12 22.07l6.36-6.36-1.41-1.42L12 19.24zM5.64 8.29l1.41 1.42L12 4.76l4.95 4.95 1.41-1.42L12 1.93 5.64 8.29z"></path>
                                </svg>
                            </button>
                        </abbr>
                        <abbr title="Thu gọn toàn bộ">
                            <button onClick={collapseAll}>
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path d="M12 7.59 7.05 2.64 5.64 4.05 12 10.41l6.36-6.36-1.41-1.41L12 7.59zM5.64 19.95l1.41 1.41L12 16.41l4.95 4.95 1.41-1.41L12 13.59l-6.36 6.36z"></path>
                                </svg>
                            </button>
                        </abbr>
                    </div>
                </div>
                {error && <div className="error-text">{error}</div>}
                <ul className="tree-view">
                    {data.map((hocPhan, index) => (
                        <li key={index} className="child">
                            <div
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "start",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    className={`toggle ${expanded[index] ? "expanded" : ""
                                        }`}
                                    onClick={() => toggleExpand(index)}
                                ></span>
                                <span className="hocphan">
                                    {hocPhan.TenHocPhan}
                                </span>
                                <span className="tree-view-add">
                                    <abbr
                                        title="Thêm"
                                        style={{
                                            display: "flex",
                                            justifyItems: "center",
                                            alignItems: "center",
                                        }}
                                        onClick={() => toggleExpandAdd(index)}
                                    >
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                                        </svg>
                                    </abbr>
                                </span>
                            </div>

                            <ul
                                className={`tree-view ${!expanded[index] ? "hidden" : ""
                                    }`}
                            >
                                {hocPhan.ThamGia.map((cb, i) => (
                                    <li
                                        key={i}
                                        className="tree-view-child child"
                                    >
                                        <span className="canbo">
                                            {cb.MaCanBo} - {cb.TenCanBo}
                                        </span>
                                        <div
                                            className="btnDelete"
                                            onClick={() =>
                                                handleDelCanBo(
                                                    hocPhan.MaHocPhan,
                                                    cb.MaCanBo
                                                )
                                            }
                                        >
                                            <abbr title="Xóa">
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path>
                                                </svg>
                                            </abbr>
                                        </div>
                                    </li>
                                ))}
                                <li
                                    className={`child childAdd${activeAddIndex === index
                                        ? " active"
                                        : ""
                                        }`}
                                >
                                    <InputSearchSelect
                                        keyShow="MaTen"
                                        list={canBo.filter(item => !hocPhan.ThamGia.some(cb => cb.MaCanBo === item.MaCanBo))}
                                        onChange={(selected) =>
                                            handleAddCanBo(index, selected.MaCanBo)
                                        }
                                    />
                                    <div
                                        className="btnSave"
                                        onClick={handleSendAddCanBo}
                                    >
                                        <abbr title="Lưu">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                                            </svg>
                                        </abbr>
                                    </div>
                                    <div
                                        className="btnCancel"
                                        onClick={() => toggleExpandAdd(index)}
                                    >
                                        <abbr title="Đóng">
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                                            </svg>
                                        </abbr>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
