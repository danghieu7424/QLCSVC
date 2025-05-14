import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "./base/config";
import { InputSearchSelect } from "./base/formContainer.js";
import { Loader, LoaderPage } from "./base/LoaderForm";

import "../access/css/quanLyPhongPage.css";

export default function QuanLyPhongPage() {
    const [loading, setLoading] = useState(true);
    const [elementLoading, setElementLoading] = useState(false);
    const [data, setData] = useState([]);
    const [canBo, setCanBo] = useState([]);
    const [selectCanBo, setSelectCanBo] = useState({
        MaPhong: "",
        MaCanBo: "",
    });
    const [activeAddIndex, setActiveAddIndex] = useState(null);
    const [expanded, setExpanded] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const resRaw = await fetch(
                `${API_BASE_URL}/api/select/quan-ly-phong`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            const result = await resRaw.json();
            if (!resRaw.ok)
                throw new Error(result.message || "Lỗi lấy dữ liệu.");
            setData(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataNoLoad = async () => {
        try {
            const resRaw = await fetch(
                `${API_BASE_URL}/api/select/quan-ly-phong`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            const result = await resRaw.json();
            if (!resRaw.ok)
                throw new Error(result.message || "Lỗi lấy dữ liệu.");
            setData(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCanBo = async () => {
        try {
            const resRaw = await fetch(`${API_BASE_URL}/api/select/data`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const result = await resRaw.json();
            if (!resRaw.ok)
                throw new Error(result.message || "Lỗi lấy dữ liệu.");

            const processed = result.CanBo.map((item) => ({
                ...item,
                MaTen: `${item.MaCanBo} - ${item.TenCanBo}`,
            }));
            setCanBo(processed);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchCanBo();
    }, []);

    // ----expandCollapse----- //

    const toggleExpandAdd = (index) => {
        setExpanded((prev) => ({
            ...prev,
            [index]: true,
        }));
        console.log("activeAddIndex", activeAddIndex);
        if (activeAddIndex) {
            setActiveAddIndex(index);
            setSelectCanBo({
                MaPhong: "",
                MaCanBo: "",
            });
        } else {
            setActiveAddIndex(index);
        }
    };

    const toggleExpand = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const expandAll = () => {
        const allExpanded = {};
        const firstKhoa = data[0];
        if (!firstKhoa) return;

        firstKhoa.Nganh?.forEach((nganh, NganhIndex) => {
            const nganhKey = `${NganhIndex}`;
            allExpanded[nganhKey] = true;
            nganh.Phong?.forEach((phong, PhongIndex) => {
                const phongKey = `${NganhIndex}-${PhongIndex}`;
                const phongKeyCb = `${phongKey}-cb`;
                const phongKeyTb = `${phongKey}-tb`;
                allExpanded[phongKey] = true;
                allExpanded[phongKeyCb] = true;
                allExpanded[phongKeyTb] = true;
            });
        });
        setExpanded(allExpanded);
    };

    const collapseAll = () => {
        setExpanded({});
    };

    // ----function----- //

    const handleAddCanBo = (MaPhong, MaCanBo) => {
        setSelectCanBo({
            MaPhong: MaPhong,
            MaCanBo: MaCanBo,
        });
    };

    const handleSendAddCanBo = () => {
        setElementLoading(true);
        fetch(`${API_BASE_URL}/api/insert/quan-ly-phong`, {
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
                    MaPhong: "",
                    MaCanBo: "",
                });

                toast.success(resData.message);
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message);
            })
            .finally(() => {
                fetchDataNoLoad();
                setElementLoading(false);
            });
    };

    const handleDelCanBo = (MaPhong, MaCanBo) => {
        const confirm = window.confirm("Xác nhận xóa.");

        if (!confirm) {
            return;
        }

        setElementLoading(true);
        fetch(`${API_BASE_URL}/api/delete/quan-ly-phong`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ MaPhong, MaCanBo }),
        })
            .then((res) => res.json())
            .then((resData) => {
                setActiveAddIndex(null);
                setSelectCanBo({
                    MaPhong: "",
                    MaCanBo: "",
                });
                toast.success(resData.message);
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message);
            })
            .finally(() => {
                fetchDataNoLoad();
                setElementLoading(false);
            });
    };

    return (
        <div className="QuanLyPhongPage page-container">
            {loading && <LoaderPage />}
            {!loading && (
                <div className="box-tree-view">
                    <div className="box-tree-view-head">
                        <span>{data[0]?.TenKhoa || "gốc"}</span>

                        <div className="buttons">
                            <abbr title="Mở rộng toàn bộ">
                                <button onClick={expandAll}>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="m12 19.24-4.95-4.95-1.41 1.42L12 22.07l6.36-6.36-1.41-1.42L12 19.24zM5.64 8.29l1.41 1.42L12 4.76l4.95 4.95 1.41-1.42L12 1.93 5.64 8.29z"></path>
                                    </svg>
                                </button>
                            </abbr>
                            <abbr title="Thu gọn toàn bộ">
                                <button onClick={collapseAll}>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 7.59 7.05 2.64 5.64 4.05 12 10.41l6.36-6.36-1.41-1.41L12 7.59zM5.64 19.95l1.41 1.41L12 16.41l4.95 4.95 1.41-1.41L12 13.59l-6.36 6.36z"></path>
                                    </svg>
                                </button>
                            </abbr>
                        </div>
                    </div>
                    <ul className="tree-view">
                        {data[0]?.Nganh.map((nganh, NganhIndex) => {
                            const nganhKey = `${NganhIndex}`;
                            return (
                                <li key={nganhKey} className="child">
                                    <div className="tree-node">
                                        <span
                                            className={`toggle ${
                                                expanded[nganhKey]
                                                    ? "expanded"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                toggleExpand(nganhKey)
                                            }
                                        ></span>
                                        <span className="title">
                                            {nganh.TenNganh}
                                        </span>
                                    </div>

                                    {expanded[nganhKey] && (
                                        <ul className="tree-view">
                                            {nganh.Phong.map(
                                                (phong, PhongIndex) => {
                                                    const phongKey = `${NganhIndex}-${PhongIndex}`;
                                                    return (
                                                        <li
                                                            key={phongKey}
                                                            className="child"
                                                        >
                                                            <div className="tree-node">
                                                                <span
                                                                    className={`toggle ${
                                                                        expanded[
                                                                            phongKey
                                                                        ]
                                                                            ? "expanded"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            phongKey
                                                                        )
                                                                    }
                                                                ></span>
                                                                <span className="title">
                                                                    <Link
                                                                        to={`/thiet-bi?MaPhong=${phong.MaPhong}`}
                                                                    >
                                                                        {`${phong.MaPhong} - ${phong.TenPhong}`}
                                                                    </Link>
                                                                </span>
                                                            </div>

                                                            {expanded[
                                                                phongKey
                                                            ] && (
                                                                <ul className="tree-view">
                                                                    <li className="child">
                                                                        <div className="tree-node">
                                                                            <span
                                                                                className={`toggle ${
                                                                                    expanded[
                                                                                        `${phongKey}-cb`
                                                                                    ]
                                                                                        ? "expanded"
                                                                                        : ""
                                                                                }`}
                                                                                onClick={() =>
                                                                                    toggleExpand(
                                                                                        `${phongKey}-cb`
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                            <span className="title">{`Cán Bộ`}</span>
                                                                            <span className="tree-view-add">
                                                                                <abbr
                                                                                    title="Thêm"
                                                                                    style={{
                                                                                        display:
                                                                                            "flex",
                                                                                        justifyItems:
                                                                                            "center",
                                                                                        alignItems:
                                                                                            "center",
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        toggleExpandAdd(
                                                                                            `${phongKey}-cb`
                                                                                        )
                                                                                    }
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
                                                                        {expanded[
                                                                            `${phongKey}-cb`
                                                                        ] && (
                                                                            <ul className="tree-view">
                                                                                <li
                                                                                    className={`child childAdd${
                                                                                        activeAddIndex ===
                                                                                        `${phongKey}-cb`
                                                                                            ? " active"
                                                                                            : ""
                                                                                    }`}
                                                                                >
                                                                                    <InputSearchSelect
                                                                                        keyShow="MaTen"
                                                                                        list={canBo.filter(
                                                                                            (
                                                                                                item
                                                                                            ) =>
                                                                                                !phong.CanBo.some(
                                                                                                    (
                                                                                                        cb
                                                                                                    ) =>
                                                                                                        cb.MaCanBo ===
                                                                                                        item.MaCanBo
                                                                                                )
                                                                                        )}
                                                                                        onChange={(
                                                                                            selected
                                                                                        ) =>
                                                                                            handleAddCanBo(
                                                                                                phong.MaPhong,
                                                                                                selected.MaCanBo
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <button
                                                                                        className="btnSave"
                                                                                        onClick={
                                                                                            handleSendAddCanBo
                                                                                        }
                                                                                        title="Lưu"
                                                                                        disabled={
                                                                                            elementLoading
                                                                                        }
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
                                                                                        className="btnCancel"
                                                                                        onClick={() =>
                                                                                            toggleExpandAdd(
                                                                                                phongKey
                                                                                            )
                                                                                        }
                                                                                        title="Đóng"
                                                                                        disabled={
                                                                                            elementLoading
                                                                                        }
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
                                                                                </li>
                                                                                {phong.CanBo?.map(
                                                                                    (
                                                                                        canbo,
                                                                                        CanBoIndex
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                CanBoIndex
                                                                                            }
                                                                                            className="tree-view-child child"
                                                                                        >
                                                                                            <span className="member-name">
                                                                                                {`${canbo.MaCanBo} - ${canbo.TenCanBo} (${canbo.ChucVu})`}
                                                                                            </span>
                                                                                            <button
                                                                                                className="btnDelete"
                                                                                                onClick={() =>
                                                                                                    handleDelCanBo(
                                                                                                        phong.MaPhong,
                                                                                                        canbo.MaCanBo
                                                                                                    )
                                                                                                }
                                                                                                title="Xóa"
                                                                                                disabled={
                                                                                                    elementLoading
                                                                                                }
                                                                                            >
                                                                                                {elementLoading ? (
                                                                                                    <Loader
                                                                                                        width="20px"
                                                                                                        height="20px"
                                                                                                        color="#fff"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <svg
                                                                                                        width="20"
                                                                                                        height="20"
                                                                                                        viewBox="0 0 24 24"
                                                                                                    >
                                                                                                        <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path>
                                                                                                    </svg>
                                                                                                )}
                                                                                            </button>
                                                                                        </li>
                                                                                    )
                                                                                )}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                    <li className="child">
                                                                        <div className="tree-node">
                                                                            <span
                                                                                className={`toggle ${
                                                                                    expanded[
                                                                                        `${phongKey}-tb`
                                                                                    ]
                                                                                        ? "expanded"
                                                                                        : ""
                                                                                }`}
                                                                                onClick={() =>
                                                                                    toggleExpand(
                                                                                        `${phongKey}-tb`
                                                                                    )
                                                                                }
                                                                            ></span>
                                                                            <span className="title">{`${phong.MaPhong} - ${phong.TenPhong}`}</span>
                                                                        </div>
                                                                        {expanded[
                                                                            `${phongKey}-tb`
                                                                        ] && (
                                                                            <ul className="tree-view">
                                                                                {phong.ThietBi?.map(
                                                                                    (
                                                                                        thietbi,
                                                                                        ThietBiIndex
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                ThietBiIndex
                                                                                            }
                                                                                            className="tree-view-child child"
                                                                                        >
                                                                                            <span
                                                                                                className="member-name"
                                                                                                style={{
                                                                                                    padding:
                                                                                                        ".375rem 0",
                                                                                                }}
                                                                                            >
                                                                                                {`${thietbi.MaThietBi} - ${thietbi.TenLoai}`}
                                                                                            </span>
                                                                                        </li>
                                                                                    )
                                                                                )}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
