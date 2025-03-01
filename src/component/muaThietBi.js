import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "../assets/css/muaThietBi.css";
import { useAuth } from "./authContext.js";

function MuaThietBiPage() {
    const { userData, login } = useAuth();
    const history = useHistory();
    const [dataTable, setDataTable] = useState([]); // Giá trị mặc định là []
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [devices, setDevices] = useState([]);
    const [loaiVanBan, setLoaiVanBan] = useState('');
    const [newDevice, setNewDevice] = useState({ name: "", quantity: "", price: "" });

    const formatCurrency = (value) => {
        return value.replace(/\D/g, "") // Loại bỏ ký tự không phải số
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm phân cách hàng nghìn
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewDevice((prev) => ({
            ...prev,
            [name]: name === "price" ? formatCurrency(value) : value, // Chỉ format giá tiền
        }));
    };


    const handleAddDevice = () => {
        if (!newDevice.name || !newDevice.quantity || !newDevice.price) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const newEntry = {
            id: devices.length + 1,
            name: newDevice.name,
            quantity: parseInt(newDevice.quantity),
            price: parseInt(newDevice.price.replace(/\./g, "")), // Chuyển lại về số nguyên
        };

        setDevices([...devices, newEntry]);

        setNewDevice({ name: "", quantity: "", price: "" });
    };

    const numberToWords = (num) => {
        const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
        const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        const thousands = ["", "nghìn", "triệu", "tỷ"];

        if (num === 0) return "không";

        const chunkNumber = (n) => {
            let result = "";
            if (n >= 100) {
                result += units[Math.floor(n / 100)] + " trăm ";
                n %= 100;
            }
            if (n >= 10 && n < 20) {
                result += teens[n - 10] + " ";
            } else {
                if (n >= 20) {
                    result += tens[Math.floor(n / 10)] + " ";
                }
                if (n % 10 > 0) {
                    result += units[n % 10] + " ";
                }
            }
            return result.trim();
        };

        let parts = [];
        let unitIndex = 0;

        while (num > 0) {
            let chunk = num % 1000;
            if (chunk > 0) {
                parts.unshift(chunkNumber(chunk) + " " + thousands[unitIndex]);
            }
            num = Math.floor(num / 1000);
            unitIndex++;
        }

        return parts.join(" ").replace(/\s+/g, " ").trim();
    };

    const totalPrice = devices.reduce((sum, device) => sum + device.quantity * device.price, 0);

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
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, TenVanBan: ['Tờ Trình', 'Báo Cáo'] }),
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

    const dsThietBi = () => {
        return (
            <div className="box_add-tb">
                <h2>Danh sách thiết bị</h2>
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Tên thiết bị</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device, index) => (
                            <tr key={device.id}>
                                <td>{device.name}</td>
                                <td style={{ textAlign: "center" }}>{device.quantity}</td>
                                <td style={{ textAlign: "center" }}>{device.price} đ</td>
                                <td style={{ textAlign: "center" }}>
                                    <button onClick={() => handleDelete(device.id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <input type="text" name="name" value={newDevice.name} onChange={handleInputChange} />
                            </td>
                            <td>
                                <input type="text" name="quantity" value={newDevice.quantity} onChange={handleInputChange} />
                            </td>
                            <td>
                                <input type="text" name="price" value={newDevice.price} onChange={handleInputChange} />
                            </td>
                            <td>
                                <button onClick={handleAddDevice}>Thêm</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h2>Bảng yêu cầu</h2>
                <table id="table-request" border="1" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px" }}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên thiết bị - Thông số kỹ thuật</th>
                            <th>ĐVT</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device, index) => (
                            <tr key={device.id}>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>{device.name}</td>
                                <td style={{ textAlign: "center" }}>Cái</td>
                                <td style={{ textAlign: "center" }}>{device.quantity}</td>
                                <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("vi-VN").format(device.price)} đ</td>
                                <td style={{ textAlign: "center" }}>{new Intl.NumberFormat("vi-VN").format(device.quantity * device.price)} đ</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                <b>Tổng cộng:</b>
                            </td>
                            <td style={{ textAlign: "center" }}>
                                <b>{new Intl.NumberFormat("vi-VN").format(devices.reduce((sum, device) => sum + device.quantity * device.price, 0))} đ</b>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                <b>{`Bằng chữ: ${numberToWords(totalPrice).charAt(0).toUpperCase() + numberToWords(totalPrice).slice(1)} đồng`}</b>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h2>Loại văn bản</h2>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="loaiVanBan"
                            value="Tờ Trình"
                            checked={loaiVanBan === "Tờ Trình"}
                            onChange={(e) => setLoaiVanBan(e.target.value)}
                        />
                        Tờ Trình
                    </label>
                    <label style={{ marginLeft: "20px" }}>
                        <input
                            type="radio"
                            name="loaiVanBan"
                            value="Báo Cáo"
                            checked={loaiVanBan === "Báo Cáo"}
                            onChange={(e) => setLoaiVanBan(e.target.value)}
                        />
                        Báo Cáo
                    </label>
                </div>
                <div className="btn-function-set-table">
                    <button onClick={handleDone}>Xong</button>
                    <button onClick={handleCancel}>Hủy</button>
                </div>
            </div>
        );
    };


    const handleAdd = () => {
        setShowAddDevice(true);
    }

    const handleDone = () => {
        if(!loaiVanBan) {
            alert('Vui lòng chọn lại văn bản.');
            return;
        }
        const tableData = devices.map((device, index) => ({
            STT: index + 1,
            TenThietBi: device.name,
            DVT: "Cái",
            SoLuong: device.quantity,
            DonGia: device.price,
            ThanhTien: device.quantity * device.price
        }));

        const totalPrice = devices.reduce((sum, device) => sum + device.quantity * device.price, 0);

        const totalRow = {
            STT: "",
            TenThietBi: "Tổng cộng",
            DVT: "",
            SoLuong: "",
            DonGia: "",
            ThanhTien: totalPrice
        };

        const textRow = {
            STT: "",
            TenThietBi: `Bằng chữ: ${numberToWords(totalPrice).charAt(0).toUpperCase() + numberToWords(totalPrice).slice(1)} đồng`,
            DVT: "",
            SoLuong: "",
            DonGia: "",
            ThanhTien: ""
        };

        history.push("/doc", {
            status: "new",
            TenVanBan: loaiVanBan,
            tableData: [...tableData, totalRow, textRow] // Gửi cả tổng cộng và dòng bằng chữ
        });

        setShowAddDevice(false);
    };

    const handleCancel = () => {
        setShowAddDevice(false);
        setDevices([]);
    };


    const handleEdit = (SoVanBan, TenVanBan) => {
        history.push("/doc", { status: 'old', SoVanBan, TenVanBan });
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
                    <caption>Bảng danh sách Văn Bản</caption>
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th>Số Văn Bản</th>
                            <th>Tên Văn Bản</th>
                            <th>Ngày Tạo</th>
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
                                            {item.TenVanBan}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span>Tên Văn Bản</span>
                                            {new Date(item.NgayTao).toLocaleDateString("vi-VN")}
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
                                                    onClick={() => handleEdit(item.SoVanBan, item.TenVanBan)}
                                                ><i className='bx bx-edit'></i></button>
                                                {/* <button
                                                    className="btn-send"
                                                    disabled={!(item.Status === 'Chỉnh sửa')}
                                                    onClick={handleSend}
                                                ><i className='bx bx-send'></i></button> */}
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
            {showAddDevice && dsThietBi()}

        </div>
    );
}

export default MuaThietBiPage;
