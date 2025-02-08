import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../assets/css/muaThietBi.css";
import { useAuth } from "./authContext.js";

function MuaThietBiPage() {
    const { userData, login } = useAuth();
    const history = useHistory();
    const [dataTable, setDataTable] = useState([]); // Giá trị mặc định là []

    const [searchQuery, setSearchQuery] = useState("");
    const [tempData, setTempTempData] = useState([]);
    const handleSearch = (query) => {
        const filtered = tempData.filter((item) =>
            Object.values(item)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        );
        setChuyenThietBiList(filtered); // Lọc dữ liệu theo từ khóa
    };

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token && !userData) {
            fetch("https://api-jwgltkza6q-uc.a.run.app/protected-route", {
                method: "GET",
                headers: { Authorization: token },
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) login(data.user);
                })
                .catch(error => {
                    console.error("Error during token verification: ", error);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                });
        }
    }, [userData, login]);

    const updateTable = (id) => {
        if (!id) {
            console.warn("Không có ID, không thể gọi API.");
            return;
        }

        fetch(`https://api-jwgltkza6q-uc.a.run.app/api/select/van-ban`, {
            method: "GET",
            headers: { id },
        })
            .then(response => response.json())
            .then(data => {
                setDataTable(data.data || []);
                setTempTempData(data.data || []);
            })
            .catch(err => {
                console.error("Lỗi tải dữ liệu:", err);
            });
    };


    useEffect(() => {
        if (userData?.id) {
            updateTable(userData.id);
        }
    }, [userData]);

    const handleAdd = () => {
        history.push("/doc", { status: 'new' });
    }

    const handleEdit = (SoVanBan) => {
        history.push("/doc", { status: 'old', SoVanBan });
    }

    const handleSend = (SoVanBan) => {
        // history.push("/doc", { status: 'old', SoVanBan });
    }

    const getStateClass = (hienTrang) => {
        switch (hienTrang) {
            case 'Chỉnh sửa':
                return 'state edit';
            case 'Đã gửi':
                return 'state send';
            case 'Lỗi':
                return 'state error';
            case 'Chấp thuận':
                return 'state Acceptance';
            case 'Không chấp thuận':
                return 'state Not_Accepted';
            default:
                return 'state';
        }
    };


    return (
        <div className="container_muaTB">
            <div id="functions">
                <div id="search">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            if (value.trim() === "") {
                                updateTable();
                            } else {
                                handleSearch(value);
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
                        <li id="import_file"
                            onClick={handleAdd}
                        >
                            <abbr title="new document"><i className='bx bxs-file-plus' ></i></abbr>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="box_table">
                <table id="content_table">
                    <caption>Bảng danh sách tờ trình</caption>
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th>Số Văn Bản</th>
                            <th>Tên Văn Bản</th>
                            <th>Trạng Thái</th>
                            <th>Chức Năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(dataTable) && dataTable.length > 0 ? (
                            dataTable
                                .sort((a, b) => b.SoVanBan - a.SoVanBan)
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center' }}>
                                            <span>Số Văn Bản</span>
                                            {item.SoVanBan}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span>Tên Văn Bản</span>
                                            Tờ Trình
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span>Trạng Thái</span>
                                            <div className={getStateClass(item.Status)}>{item.Status}</div>
                                        </td>
                                        <td>
                                            <span>Chức Năng</span>
                                            <div id="table-function" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                                                <button
                                                    className="btn-edit"
                                                    disabled={!(item.Status === 'Chỉnh sửa')}
                                                    onClick={() => handleEdit(item.SoVanBan)}
                                                ><i className='bx bx-edit'></i></button>
                                                <button
                                                    className="btn-send"
                                                    disabled={!(item.Status === 'Chỉnh sửa')}
                                                    onClick={handleSend}
                                                ><i className='bx bx-send'></i></button>
                                            </div>

                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MuaThietBiPage;
