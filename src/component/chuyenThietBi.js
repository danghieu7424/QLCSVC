import React, { useEffect, useState } from "react";
import "../assets/css/chuyenThietBi.css";

function ChuyenThietBiPage() {
    const [chuyenThietBiList, setChuyenThietBiList] = useState([]);
    const [phongList, setPhongList] = useState([]);
    const [thietBiList, setThietBiList] = useState([]);
    const [filteredPhongList, setFilteredPhongList] = useState([]);
    const [filteredThietBiList, setFilteredThietBiList] = useState([]);
    const [phongChuyen, setPhongChuyen] = useState(""); // Trạng thái cho phòng chuyển
    const [phongNhan, setPhongNhan] = useState("");    // Trạng thái cho phòng nhận
    const [thietBi, setThietBi] = useState("");    // Trạng thái cho thiết bị
    const [viTriCu, setViTriCu] = useState("");
    const [viTriMoi, setViTriMoi] = useState("");
    const [MaThietBi, setMaThietBi] = useState("");

    const [showPhongChuyenSuggestions, setShowPhongChuyenSuggestions] = useState(false);
    const [showPhongNhanSuggestions, setShowPhongNhanSuggestions] = useState(false);
    const [showThietBiSuggestions, setShowThietBiSuggestions] = useState(false);

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

    const updateTable = async () => {
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/chuyen-thiet-bi')
            .then(req => req.json())
            .then(data => {
                setChuyenThietBiList(data);
                setTempTempData(data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/phong-xuong')
            .then(req => req.json())
            .then(data => {
                setPhongList(data);
                setFilteredPhongList(data);
            })
            .catch(err => {
                console.log(err);
            });
        fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/thiet-bi')
            .then(req => req.json())
            .then(data => {
                setThietBiList(data);
                setFilteredThietBiList(data);
            })
            .catch(err => {
                console.log(err);
            });
        updateTable();
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


    const handlePhongChuyenSearch = (e) => {
        const searchTerm = e.target.value;
        setPhongChuyen(searchTerm);

        if (searchTerm === "") {
            setFilteredPhongList(phongList);
            setViTriCu("");
            setThietBi("");
            setMaThietBi(null);
        } else {
            setFilteredPhongList(
                phongList.filter((phong) =>
                    phong.MaPhongXuong.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    };

    const handlePhongNhanSearch = (e) => {
        const searchTerm = e.target.value;
        setPhongNhan(searchTerm);

        if (searchTerm === "") {
            setFilteredPhongList(phongList);
        } else {
            setFilteredPhongList(
                phongList.filter((phong) =>
                    phong.MaPhongXuong.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    };

    const handleThietBiSearch = (e) => {
        const searchTerm = e.target.value;
        setThietBi(searchTerm);

        if (searchTerm === "") {
            setFilteredThietBiList(thietBiList);
        } else {
            setFilteredThietBiList(
                thietBiList.filter((tb) =>
                    tb.TenThietBi.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    };

    const handleAccept = async () => {
        const conf = confirm("Xác Nhận chuyển");
        if (!conf) {
            return;
        }

        if (!MaThietBi || !phongChuyen || !phongNhan || !viTriMoi) {
            alert("Vui lòng điền đây đủ thông tin");
            return;
        }

        const data = {
            MaThietBi: MaThietBi,
            MaPhongChuyen: phongChuyen,
            MaPhongNhan: phongNhan,
            ViTri: viTriMoi,
            MaCanBo: "01010093"
        }

        try {
            const response = await fetch("https://api-jwgltkza6q-uc.a.run.app/api/insert/chuyen-thiet-bi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Lỗi: ${error.error}`);
                return;
            }

            alert("Chuyển thành công");
            updateTable();
            setPhongChuyen("");
            setPhongNhan("");
            setThietBi("");
            setViTriCu("");
            setViTriMoi("");
            setMaThietBi("");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            console.log(newEditRow);
            alert("Đã xảy ra lỗi khi cập nhật");
        }
    }

    return (
        <div className="container_chuyenTB">
            <div className="box_chuyenTB-function">
                {/* Box Chuyển */}
                <div className="box_chuyen">
                    <span>Phòng Chuyển Thiết Bị</span>
                    <div>
                        <span>Phòng:</span>
                        <div className="search-container">
                            <input
                                type="search"
                                placeholder="Chọn phòng"
                                value={phongChuyen}
                                onChange={handlePhongChuyenSearch}
                                onFocus={() => setShowPhongChuyenSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowPhongChuyenSuggestions(false), 200)}
                                className="phongInput"
                            />
                            {showPhongChuyenSuggestions && (
                                <ul className="suggestions">
                                    {filteredPhongList
                                        .filter((phong) => phong.MaPhongXuong !== phongNhan)
                                        .map((phong) => (
                                            <li
                                                key={phong.MaPhongXuong}
                                                onClick={() => {
                                                    setPhongChuyen(phong.MaPhongXuong);
                                                    setThietBi("");
                                                    setViTriCu("");
                                                    setMaThietBi("");
                                                    setShowPhongChuyenSuggestions(false);
                                                }}
                                            >
                                                {phong.MaPhongXuong}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <span>Thiết Bị:</span>
                        <div className="search-container">
                            <input
                                type="search"
                                placeholder="Chọn thiết bị"
                                value={thietBi} // Hiển thị tên thiết bị
                                onChange={handleThietBiSearch}
                                onFocus={() => setShowThietBiSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowThietBiSuggestions(false), 200)}
                                className="thietBiInput"
                            />
                            {showThietBiSuggestions && (
                                <ul className="suggestions">
                                    {filteredThietBiList.filter(
                                        (tb) => tb.MaPhongXuong === phongChuyen
                                    ).map((tb) => (
                                        <li
                                            key={tb.MaThietBi}
                                            onClick={() => {
                                                setThietBi(tb.TenThietBi); // Lưu tên thiết bị vào trạng thái
                                                setMaThietBi(tb.MaThietBi);
                                                setViTriCu(tb.ViTri);
                                                setShowThietBiSuggestions(false);
                                            }}
                                        >
                                            {tb.TenThietBi}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <span>Vị Trí Cũ:</span>
                        <input className="viTri" value={viTriCu} disabled></input>
                    </div>
                </div>

                {/* Box Nhận */}
                <div className="box_nhan">
                    <span>Phòng Nhận Thiết Bị</span>
                    <div>
                        <span>Phòng:</span>
                        <div className="search-container">
                            <input
                                type="search"
                                placeholder="Chọn phòng"
                                value={phongNhan}
                                onChange={handlePhongNhanSearch}
                                onFocus={() => setShowPhongNhanSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowPhongNhanSuggestions(false), 200)}
                                className="phongInput"
                            />
                            {showPhongNhanSuggestions && (
                                <ul className="suggestions">
                                    {filteredPhongList
                                        .filter((phong) => phong.MaPhongXuong !== phongChuyen)
                                        .map((phong) => (
                                            <li
                                                key={phong.MaPhongXuong}
                                                onClick={() => {
                                                    setPhongNhan(phong.MaPhongXuong);
                                                    setShowPhongNhanSuggestions(false);
                                                }}
                                            >
                                                {phong.MaPhongXuong}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div>
                        <span>Vị Trí Mới:</span>
                        <input
                            className="viTri"
                            placeholder="Nhập vị trí"
                            value={viTriMoi} // Liên kết với state
                            onChange={(e) => setViTriMoi(e.target.value)} // Cập nhật state khi nhập
                        />

                    </div>
                    <div>
                        <button
                            className="btnAccept"
                            onClick={handleAccept}
                        >Xong</button>
                    </div>
                </div>
            </div>

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
                        <li id="import_file">
                            <abbr title="Import"><i className="bx bxs-file-plus"></i></abbr>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="box_table">
                <table id="content_table">
                    <caption>Bảng Thông Tin Chuyển Thiết Bị</caption>
                    <thead>
                        <tr>
                            <th>Mã Chuyển</th>
                            <th>Tên Thiết Bị</th>
                            <th>Ngày Chuyển</th>
                            <th>Phòng Chuyển</th>
                            <th></th>
                            <th>Phòng Nhận</th>
                            <th>Cán Bộ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            chuyenThietBiList
                            .sort((a, b) => b.MaChuyen - a.MaChuyen)
                            .map((item, index) => {
                                // Tìm thiết bị trong thietBiList dựa trên MaThietBi
                                const thietBiItem = thietBiList.find(tb => tb.MaThietBi === item.MaThietBi);
                                return (
                                    <tr key={index}>
                                        <td>
                                            <span>Mã Chuyển</span>
                                            {item.MaChuyen}
                                        </td>
                                        <td>
                                            <span>Tên Thiết Bị</span>
                                            {thietBiItem ? thietBiItem.TenThietBi : "Không tìm thấy tên thiết bị"}
                                        </td>
                                        <td>
                                            <span>Ngày Chuyển</span>
                                            {item.NgayChuyen}
                                        </td>
                                        <td>
                                            <span>Phòng Chuyển</span>
                                            {item.MaPhongChuyen}
                                        </td>
                                        <td>
                                            <span></span>
                                            {'=>'}
                                        </td>
                                        <td>
                                            <span>Phòng Nhận</span>
                                            {item.MaPhongNhan}
                                        </td>
                                        <td>
                                            <span>Cán Bộ</span>
                                            {item.TenCanBo}
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ChuyenThietBiPage;
