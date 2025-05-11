import React, { useEffect, useState } from "react";
import API_BASE_URL from "./base/config";

import "../access/css/tongQuanHocPhanPage.css";

export default function TongQuanHocPhanPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});

    const updateTreeview = () => {
        fetch(`${API_BASE_URL}/api/get/tong-quan-hoc-phan`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData.Data) {
                    setData(resData.Data);

                    const initialExpanded = {};
                    resData.Data.forEach((_, index) => {
                        initialExpanded[index] = false;
                    });

                    const savedExpanded = localStorage.getItem("expandedNodes");
                    if (savedExpanded) {
                        setExpanded(JSON.parse(savedExpanded));
                    } else {
                        setExpanded(initialExpanded);
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

    const toggleExpand = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const expandAll = () => {
        const allExpanded = {};

        data.forEach((khoa, KhoaIndex) => {
            allExpanded[KhoaIndex] = true;

            khoa.Nganh.forEach((nganh, NganhIndex) => {
                const nganhKey = `${KhoaIndex}-${NganhIndex}`;
                allExpanded[nganhKey] = true;

                nganh.HocPhan.forEach((hocPhan, HocPhanIndex) => {
                    const hocPhanKey = `${KhoaIndex}-${NganhIndex}-${HocPhanIndex}`;
                    allExpanded[hocPhanKey] = true;
                });
            });
        });

        setExpanded(allExpanded);
    };

    const collapseAll = () => {
        const allCollapsed = {};

        data.forEach((khoa, KhoaIndex) => {
            allCollapsed[KhoaIndex] = false;

            khoa.Nganh.forEach((nganh, NganhIndex) => {
                const nganhKey = `${KhoaIndex}-${NganhIndex}`;
                allCollapsed[nganhKey] = false;

                nganh.HocPhan.forEach((hocPhan, HocPhanIndex) => {
                    const hocPhanKey = `${KhoaIndex}-${NganhIndex}-${HocPhanIndex}`;
                    allCollapsed[hocPhanKey] = false;
                });
            });
        });

        setExpanded(allCollapsed);
    };

    return (
        <div className="page-container tqhp-container">
            <div className="box-tree-view">
                <div className="box-tree-view-head">
                    <span>gốc</span>
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
                    {data.map((khoa, KhoaIndex) => (
                        <li key={KhoaIndex} className="child">
                            <div className="tree-node">
                                <span
                                    className={`toggle ${expanded[KhoaIndex] ? "expanded" : ""}`}
                                    onClick={() => toggleExpand(KhoaIndex)}
                                ></span>
                                <span className="hocphan">{khoa.TenKhoa}</span>
                            </div>

                            {expanded[KhoaIndex] && (
                                <ul className="tree-view">
                                    {khoa.Nganh.map((nganh, NganhIndex) => {
                                        const nganhKey = `${KhoaIndex}-${NganhIndex}`;
                                        return (
                                            <li key={nganhKey} className="child">
                                                <div className="tree-node">
                                                    <span
                                                        className={`toggle ${expanded[nganhKey] ? "expanded" : ""}`}
                                                        onClick={() => toggleExpand(nganhKey)}
                                                    ></span>
                                                    <span className="hocphan">{nganh.TenNganh}</span>
                                                </div>

                                                {expanded[nganhKey] && (
                                                    <ul className="tree-view">
                                                        {nganh.HocPhan.map((hocPhan, HocPhanIndex) => {
                                                            const hocPhanKey = `${KhoaIndex}-${NganhIndex}-${HocPhanIndex}`;
                                                            return (
                                                                <li key={hocPhanKey} className="child">
                                                                    <div className="tree-node">
                                                                        <span
                                                                            className={`toggle ${expanded[hocPhanKey] ? "expanded" : ""}`}
                                                                            onClick={() => toggleExpand(hocPhanKey)}
                                                                        ></span>
                                                                        <span className="hocphan">{hocPhan.TenHocPhan}</span>
                                                                    </div>

                                                                    {expanded[hocPhanKey] && (
                                                                        <ul className="tree-view">
                                                                            <li className="tree-view-child child">
                                                                                <span className="head-of-department">Trưởng học phần: </span>
                                                                                <span className="head-of-department">{hocPhan.TenTruongHocPhan || "Chưa có"}</span>
                                                                            </li>
                                                                            <li className="child">
                                                                                <div className="tree-node">
                                                                                    <span
                                                                                        className={`toggle ${expanded[nganhKey] ? "expanded" : ""}`}
                                                                                        onClick={() => toggleExpand(nganhKey)}
                                                                                    ></span>
                                                                                    <span className="hocphan">Thành viên:</span>
                                                                                </div>
                                                                                <ul className="tree-view">
                                                                                    {hocPhan.ThanhVien.map((tv, index) => (
                                                                                        <li key={index} className="tree-view-child child">
                                                                                            <span className="member-name">{`${tv.MaCanBo} - ${tv.TenCanBo}`}</span>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </li>
                                                                        </ul>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
