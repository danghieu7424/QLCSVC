CREATE TABLE NGANH (
    MaNganh CHAR(7) PRIMARY KEY NOT NULL,
    TenNganh VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE PHONG_XUONG (
    MaPhongXuong CHAR(10) PRIMARY KEY NOT NULL,
    TenPhongXuong VARCHAR(150) NOT NULL,
    ViTri VARCHAR(20),
    MaNganh CHAR(7) NOT NULL,
    FOREIGN KEY (MaNganh) REFERENCES NGANH(MaNganh)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE CANBO (
    MaCanBo VARCHAR(16) NOT NULL,
    TenCanBo VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    MaPhongXuong CHAR(10) NOT NULL,
    VaiTroQL VARCHAR(100),
    MaNganh CHAR(7) NOT NULL,
    PRIMARY KEY (MaCanBo, MaPhongXuong),
    FOREIGN KEY (MaNganh) REFERENCES NGANH(MaNganh),
    FOREIGN KEY (MaPhongXuong) REFERENCES PHONG_XUONG(MaPhongXuong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE THIETBI (
    MaThietBi INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    TenThietBi VARCHAR(150) NOT NULL,
    ThongSoKyThuat VARCHAR(1000),
    NamSanXuat YEAR,
    NgayNhap DATETIME NOT NULL,
    SoLuong INT NOT NULL,
    DonViTinh VARCHAR(20),
    NuocSanXuat VARCHAR(20),
    HienTrang VARCHAR(20),
    GhiChu VARCHAR(200),
    MaPhongXuong CHAR(10),
    FOREIGN KEY (MaPhongXuong) REFERENCES PHONG_XUONG(MaPhongXuong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE CHUYENTHIETBI (
    MaChuyen INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    MaThietBi INT NOT NULL,
    NgayChuyen DATETIME NOT NULL,
    MaPhongChuyen CHAR(10) NOT NULL,
    MaPhongNhan CHAR(10) NOT NULL,
    MaCanBo VARCHAR(16) NOT NULL,
    SoLuongChuyen INT NOT NULL,
    FOREIGN KEY (MaCanBo) REFERENCES CANBO(MaCanBo),
    FOREIGN KEY (MaThietBi) REFERENCES THIETBI(MaThietBi),
    FOREIGN KEY (MaPhongChuyen) REFERENCES PHONG_XUONG(MaPhongXuong),
    FOREIGN KEY (MaPhongNhan) REFERENCES PHONG_XUONG(MaPhongXuong),
    CHECK (MaPhongNhan <> MaPhongChuyen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE THANHLYTHIETBI (
    MaThanhLy INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    MaThietBi INT NOT NULL,
    MaCanBo VARCHAR(16) NOT NULL,
    NgayThanhLy DATETIME NOT NULL,
    SoLuong INT NOT NULL,
    ThanhTien DECIMAL(19, 4) NOT NULL,
    FOREIGN KEY (MaCanBo) REFERENCES CANBO(MaCanBo),
    FOREIGN KEY (MaThietBi) REFERENCES THIETBI(MaThietBi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE MUATHIETBI (
    MaMua INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    MaThietBi INT NOT NULL,
    MaCanBo VARCHAR(16) NOT NULL,
    NgayMua DATETIME NOT NULL,
    SoLuongMua INT NOT NULL,
    GiaMua DECIMAL(19,4) NOT NULL,
    TongTien DECIMAL(19,4),
    NhaCungCap VARCHAR(200),
    FOREIGN KEY (MaCanBo) REFERENCES CANBO(MaCanBo),
    FOREIGN KEY (MaThietBi) REFERENCES THIETBI(MaThietBi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DELIMITER //

CREATE TRIGGER trg_muathietbi_before_insert
BEFORE INSERT ON MUATHIETBI
FOR EACH ROW
BEGIN
    SET NEW.TongTien = NEW.SoLuongMua * NEW.GiaMua;
END;
//

CREATE TRIGGER trg_muathietbi_before_update
BEFORE UPDATE ON MUATHIETBI
FOR EACH ROW
BEGIN
    SET NEW.TongTien = NEW.SoLuongMua * NEW.GiaMua;
END;
//

DELIMITER ;

INSERT INTO NGANH (TenNganh, MaNganh) VALUES
('Ngành Công Nghệ Thông Tin', '7480201'),
('Ngành Cơ Khí', '7510201'),
('Ngành Điện-Điện Tử', '7510301');


INSERT INTO CANBO (MaCanBo , TenCanBo, MaPhongXuong, VaiTroQL, MaNganh) VALUES
('01010093', 'Trần Hữu Anh', 'F303', 'Trưởng Khoa-Người quản lý thiết bị phòng F303', '7480201'),
('01010094', 'Nguyễn Tiến Cương', 'F205', 'Giảng viên-Người quản lý thiết bị phòng F205', '7480201'),
('01010097', 'Đào T Phương Thuý', 'F213', 'Giảng viên-Người quản lý thiết bị phòng F213', '7480201'),
('01010098', 'Trần Thu Hà', 'F205', 'Giảng viên-Người quản lý thiết bị phòng F205', '7480201'),
('01010099', 'Nguyễn Thị Thu Hiền', 'F207', 'Giảng viên-Người quản lý thiết bị phòng F207', '7480201'),
('01010100', 'Lê Thanh Hùng', 'F211', 'Giảng viên-Người quản lý thiết bị phòng F211', '7480201'),
('01010101', 'Trần Thị Thúy Nga', 'F213', 'Giảng viên-Người quản lý thiết bị phòng F213', '7480201'),
('01010104', 'Trần Thị Thu Hường', 'F211', 'Giảng viên-Người quản lý thiết bị phòng F211', '7480201'),
('01010105', 'Nguyễn Thị Sinh', 'F303', 'Giảng viên-Người quản lý thiết bị phòng F303', '7480201'),
('01010094', 'Nguyễn Tiến Cương', 'F207', 'Giảng viên-Người quản lý thiết bị phòng F207', '7480201'),
('01010100', 'Lê Thanh Hùng', 'F213', 'Giảng viên-Người quản lý thiết bị phòng F213', '7480201'),
('01010115', 'Trần Công Thức', 'G1.01', 'Giảng viên-Người quản lý thiết bị phòng G101', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', 'G1.02', 'Giảng viên-Người quản lý thiết bị phòng G102', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', 'G1.03', 'Giảng viên-Người quản lý thiết bị phòng G103', '7510201'),
('01010134', 'Trần Chí Quang', 'G1.04', 'Giảng viên-Người quản lý thiết bị phòng G104', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', 'G1.05', 'Giảng viên-Người quản lý thiết bị phòng  G105', '7510201'),
('01010118', 'Đoàn Văn Đô', 'G1.06', 'Giảng viên-Người quản lý thiết bị phòng G106', '7510201'),
('01010115', 'Trần Công Thức', 'H1.01', 'Giảng viên-Người quản lý thiết bị phòng H101', '7510201'),
('01010121', 'Lại Hồng Hùng', 'H1.02', 'Giảng viên-Người quản lý thiết bị phòng H102', '7510201'),
('01010121', 'Lại Hồng Hùng', 'G2.06', 'Giảng viên-Người quản lý thiết bị phòng G206', '7510201'),
('01010118', 'Đoàn Văn Đô', 'G2.10', 'Giảng viên-Người quản lý thiết bị phòng G210', '7510201'),
('01010135', 'Đỗ Anh Tuấn', 'G2.02', 'Giảng viên-Người quản lý thiết bị phòng G202', '7510201'),
('01010135', 'Đỗ Anh Tuấn', 'G2.03', 'Giảng viên-Người quản lý thiết bị phòng G203', '7510201'),
('01010135', 'Đỗ Anh Tuấn', 'G2.05', 'Giảng viên-Người quản lý thiết bị phòng G205', '7510201'),
('01010135', 'Đỗ Anh Tuấn', 'G2.07', 'Giảng viên-Người quản lý thiết bị phòng G207', '7510201'),
('01010144', 'Đặng Gia Dũng', 'G2.08', 'Giảng viên-Người quản lý thiết bị phòng G208', '7510201'),
('01010160', 'Đào Thị Mơ', 'd1.06', 'Giảng viên-Người quản lý thiết bị phòng D106', '7510301'),
('01010147', 'Tống Thị Lan', 'd1.07', 'Giảng viên-Người quản lý thiết bị phòng D107', '7510301'),
('01010149', 'Đàm Đức Cường', 'd2.1', 'Giảng viên-Người quản lý thiết bị phòng D201', '7510301'),
('01010163', 'Nguyễn Thị Bảo Thư', 'd2.2', 'Giảng viên-Người quản lý thiết bị phòng D202', '7510301'),
('01010161', 'Nguyễn Thị Nga', 'd2.3', 'Giảng viên-Người quản lý thiết bị phòng D203', '7510301'),
('01010160', 'Đào Thị Mơ', 'd2.4', 'Giảng viên-Người quản lý thiết bị phòng D204', '7510301'),
('01010166', 'Nguyễn Thanh Phong', 'd2.5', 'Giảng viên-Người quản lý thiết bị phòng D205', '7510301'),
('01010147', 'Tống Thị Lan', 'd2.6', 'Giảng viên-Người quản lý thiết bị phòng D206', '7510301'),
('01010152', 'Nguyễn Thị Thu Hà', 'd2.7', 'Giảng viên-Người quản lý thiết bị phòng D207', '7510301'),
('01010163', 'Nguyễn Thị Bảo Thư', 'd2.8', 'Giảng viên-Người quản lý thiết bị phòng D208', '7510301'),
('01010152', 'Nguyễn Thị Thu Hà', 'd2.9', 'Giảng viên-Người quản lý thiết bị phòng D209', '7510301'),
('01010149', 'Đàm Đức Cường', 'd2.10', 'Giảng viên-Người quản lý thiết bị phòng D210', '7510301'),
('01010158', 'Dương Thị Loan', 'g4.1', 'Giảng viên-Người quản lý thiết bị phòng G401', '7510301'),
('01010155', 'Đặng Văn Hữu', 'g4.2', 'Giảng viên-Người quản lý thiết bị phòng G402', '7510301'),
('01010162', 'Nguyễn Văn Nhương', 'g4.3', 'Giảng viên-Người quản lý thiết bị phòng G403', '7510301'),
('01010154', 'Vũ Quang Hòa', 'g4.4', 'Giảng viên-Người quản lý thiết bị phòng G404', '7510301'),
('01010148', 'Tô Đức Anh', 'g4.5', 'Giảng viên-Người quản lý thiết bị phòng G405', '7510301'),
('01010150', 'Lê Tiến Dũng', 'g4.6', 'Giảng viên-Người quản lý thiết bị phòng G406', '7510301'),
('01010145', 'Vũ Đức Nhật', 'g4.7', 'Giảng viên-Người quản lý thiết bị phòng G407', '7510301'),
('01010165', 'Đinh Duy Phương', 'g4.8', 'Giảng viên-Người quản lý thiết bị phòng G408', '7510301'),
('01010150', 'Lê Tiến Dũng', 'g4.9', 'Giảng viên-Người quản lý thiết bị phòng G409', '7510301'),
('01010153', 'Trần Minh Hải', 'g4.10', 'Giảng viên-Người quản lý thiết bị phòng G410', '7510301'),
('01010145', 'Vũ Đức Nhật', 'g5.1', 'Giảng viên-Người quản lý thiết bị phòng G501', '7510301'),
('01010164', 'Trần Văn Yên', 'g5.2', 'Giảng viên-Người quản lý thiết bị phòng G502', '7510301'),
('01010158', 'Dương Thị Loan', 'g5.3', 'Giảng viên-Người quản lý thiết bị phòng 503', '7510301'),
('01010153', 'Trần Minh Hải', 'g5.5', 'Giảng viên-Người quản lý thiết bị phòng G505', '7510301'),
('01010144', 'Đặng Gia Dũng', 'g5.4', 'Giảng viên-Người quản lý thiết bị phòng G504', '7510301'),
('01010146', 'Ngô Thị Ánh Hằng', 'g5.7', 'Giảng viên-Người quản lý thiết bị phòng G507', '7510301'),
('1010156', 'Vũ Thị Thuỳ Lan', 'd1.04', 'Giảng viên-Người quản lý thiết bị phòng D104', '7510301'),
('1010159', 'Nguyễn Thuý May', 'd1.05', 'Giảng viên-Người quản lý thiết bị phòng D105', '7510301');


INSERT INTO PHONG_XUONG ( MaPhongXuong, TenPhongXuong, ViTri, MaNganh) VALUES
('G1.01', 'Thực hành CNC, CAD/CAM', 'Tòa nhà G', '7510201'),
('G1.02', 'Thực hành Tiện', 'Tòa nhà G', '7510201'),
('G1.03', 'Phòng sản phẩm ngành Cơ khí', 'Tòa nhà G', '7510201'),
('G1.04', 'Thực hành sửa chữa cơ khí', 'Tòa nhà G', '7510201'),
('G1.05', 'Thực hành Phay - Bào', 'Tòa nhà G', '7510201'),
('G1.06', 'Thực hành gò - gia công áp lực', 'Tòa nhà G', '7510201'),
('H1.01', 'Thực hành hàn 1', 'Tòa nhà H', '7510201'),
('H1.02', 'Thực hành hàn', 'Tòa nhà H', '7510201'),
('G2.06', 'Thực hành nguội', 'Tòa nhà G', '7510201'),
('G2.10', 'Thực hành khí nén tủy lực', 'Tòa nhà G', '7510201'),
('G2.02', 'Thực hành điện lạnh cơ bản', 'Tòa nhà G', '7510301'),
('G2.03', 'Thực hành điện lạnh dân dụng 1', 'Tòa nhà G', '7510301'),
('G2.05', 'Thực hành điện lạnh dân dụng 2', 'Tòa nhà G', '7510301'),
('G02.07', 'Thực hành điện lạnh công nghiệp 1', 'Tòa nhà G', '7510301'),
('G2.08', 'Thực hành điện lạnh công nghệp 2', 'Tòa nhà G', '7510301'),
('F303', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F205', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F211', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F207', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F213', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('d1.04', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d1.05', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d1.06', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d1.07', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.1', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.2', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.3', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.4', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.5', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.6', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.7', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.8', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.9', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('d2.10', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('g4.1', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.2', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.3', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.4', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.5', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.6', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.7', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.8', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.9', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g4.10', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.1', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.2', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.3', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.5', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.4', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('g5.7', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301');


INSERT INTO THIETBI (TenThietBi, ThongSoKyThuat, SoLuong, DonViTinh, NuocSanXuat, HienTrang, GhiChu, MaPhongXuong) VALUES
('Máy tính bàn+B4:B10A1B4:B9B4:B4:B10', 'Bộ vi sử lý: Intel® Core i3-7100  Processor (3.90GHz/3MB),  Bộ nhớ trong: 4GB RAM  DDR4 bus 2400; Ổ cứng/HDD 500GB 7200RPM SA TA 3.5",;Bo mạch chủ Intel® H 110 Express Chipset; Case và nguồn: Case m-ATX front USB PSU 450w; màn hình máy tính LED 19.5''; bàn phím Standard Keyboard; chuột 2-button Mouse Optical', 10, 'Bộ', 'VN', 'Đang sử dụng', 'A2.09
- TG: 2
- FPT: 1', 'G01.01'),
('Máy tính bàn FPT', 'Bộ vi sử lý: Intel® Core i3-7100  Processor (3.90GHz/3MB),  Bộ nhớ trong: 4GB RAM  DDR4 bus 2400; Ổ cứng/HDD 500GB 7200RPM SA TA 3.5",;Bo mạch chủ Intel® H 110 Express Chipset; Case và nguồn: Case m-ATX front USB PSU 450w; màn hình máy tính LED 19.5''; bàn phím Standard Keyboard; chuột 2-button Mouse Optical', 1, 'Bộ', 'VN', 'Đang sử dụng', '', 'A02.08'),
('Máy tính bàn FPT', 'Bộ vi sử lý: Intel® Core i3-7100  Processor (3.90GHz/3MB),  Bộ nhớ trong: 4GB RAM  DDR4 bus 2400; Ổ cứng/HDD 500GB 7200RPM SA TA 3.5",;Bo mạch chủ Intel® H 110 Express Chipset; Case và nguồn: Case m-ATX front USB PSU 450w; màn hình máy tính LED 19.5''; bàn phím Standard Keyboard; chuột 2-button Mouse Optical', 1, 'Bộ', 'VN', 'Đang sử dụng', '', 'A02.09'),
('Máy tính để bàn FPT', 'Bộ vi sử lý: Intel® Core i3-7100  Processor (3.90GHz/3MB),  Bộ nhớ trong: 4GB RAM  DDR4 bus 2400; Ổ cứng/HDD 500GB 7200RPM SA TA 3.5",;Bo mạch chủ Intel® H 110 Express Chipset; Case và nguồn: Case m-ATX front USB PSU 450w; màn hình máy tính LED 19.5''; bàn phím Standard Keyboard; chuột 2-button Mouse Optical', 10, 'Bộ', 'VN', 'Đang sử dụng', 'A2.09
- TG: 2
- FPT: 1', ''),
('Êtô phay + tay quay', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Êtô phay + tay quay', ' - TS NSS 2007', 1, 'bộ', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Máy nén khí HITACHI 1.5 KW', 0, 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.01'),
('Dây truyền DNC', ' - TS NSS 2007', 1, 'Sợi', 'VN', 'Đang sử dụng', '', '4G01.01'),
('đầu phay BT 30', ' - TS NSS 2007', 3, 'bộ', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Mô hình máy phay', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Biến áp tự ngẫu LIOA 25KVA', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Biến áp tự ngẫu LIOA 25 KVA', 0, 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Pame 0-500', ' - TS NSS 2007', 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Pame 0-200', ' - TS NSS 2007', 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Panen điều khiển máy phay CNC', 0, 1, 'Bộ', 0, 'Đang sử dụng', '', '4G01.01'),
('Quạt đảo trần', ' - TS NSS 2007', 10, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('HUB', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Van điện từ 4/2 MS-167082', '', 1, 'cái', 'Đức', 'Đang sử dụng', '', '4G01.02'),
('Mô hình bổ dọc của máy trục vít SA-2/3', '', 1, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Mô hình bổ dọc của máy piston TA-80', '', 1, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Đầu nén trục vít SA-2/3 (Cho học viên thực hành)', '', 2, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Đầu nén TA-65A (Cho học viên thực hành)', '', 2, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Lọc gió 3 μ (T10P)', '', 1, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Mâm cặp 4 chấu cho máy tiện T18', '', 2, 'bộ', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy cưa sắt', '', 1, 'cái', 'VN', 'Đang sử dụng', 'ĐA TN lớp CĐCK 13', '4G01.02'),
('Máy mài hai đá F200', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy mài hai đá f200', '', 1, 'cái', 'TQ', 'Đang sử dụng', '', '4G01.02'),
('Máy mài hai đá f400', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy nén khí TA-80 (Tự động)', '', 1, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Máy nén khí SA-15A', '', 1, 'cái', 'DL', 'Đang sử dụng', '', '4G01.02'),
('Máy phay giải phóng P90', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy phay ngang ENSHU', 'Kích thước bàn: 260x900.', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay đứng ENSHU', 'Kích thước bàn: 260x900.', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay ENSHU', 'Kích thước bàn: 1100x260.
Hành trình: 650x250x250
Có thước quang', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay HITACHI MS-P', 'Kích thước bàn: 1100x180.
hành trình: 650x250x350', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay ngang ENSHU P3', 'Hiệu: ENSHU /máy ngang
Kích thước bàn máy :
260x1100 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay đứng ENSHU P5', 'Hiệu : ENSHU / máy đứng', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy phay ENSHU P4', 0, 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('MÁY TIỆN WASHINO Model: LE-19J / Mã số: AN087-07', 'Chiều dài chống tâm: 800 mm
Chiều cao tâm: 240 mm
Đường kính vật tiện: 260 mm
Công suất: 5.5Kw / Điện áp 380V 3P', 1, 'máy', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('MÁY TIỆN WASHINO Model: 7KC520 / Mã số: CT003-08', 'Chiều dài chống tâm: 1500 mm
Chiều cao tâm: 240 mm
Đường kính vật tiện: 260 mm
Công suất: 5.5Kw / Điện áp 380V 3P', 1, 'máy', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('MÁY TIỆN WASHINO Model: LE-150J / Mã số : CT020-04', 'Chiều dài chống tâm: 1500 mm
Chiều cao tâm: 240 mm
Đường kính vật tiện: 260 mm
Công suất: 5.5Kw / Điện áp 380V 3P', 1, 'máy', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng Ø450mm
Chiều dài gia công L = 700 mm', 1, 'máy', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng Ø450mm
Chiều dài gia công L = 700 mm', 1, 'máy', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện T18 A', 0, 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng 450 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 700 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng 450 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 700 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO (Có hầu)', 'Đường kính gia công trên băng 650 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 800 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO (Có hầu)', 'Đường kính gia công trên băng 650 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 800 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng 450 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 700 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO', 'Đường kính gia công trên băng 450 mm
Đường kính gia công trên bàn dao 340 mm
Đường kính lỗ trục chính 50 mm
Chiều dài gia công 700 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO LE-19J', 'Chiều dài chống tâm: 860 mm
Chiều cao tâm: 240 mm
Đường kính vật tiện: 250 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO LE-19J', 'Chiều dài chống tâm: 860 mm
Chiều cao tâm: 240 mm
Đường kính vật tiện: 250 mm', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO M10', ' ', 1, 'cái', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO M09', ' ', 1, 'cái', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO M08', ' ', 1, 'cái', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO M07', ' ', 1, 'cái', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Máy tiện WASHINO LEO M11', ' ', 1, 'cái', 'nhật', 'Đang sử dụng', '', '4G01.02'),
('Pan me 0-50', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Pan me 0-25', '', 2, 'cái ', 'VN', 'Đang sử dụng', 'Thiếu 1 thiết bị', '4G01.02'),
('Pan me 0-50', '', 1, 'Cái', 'TQ', 'Đang sử dụng', '', '4G01.02'),
('Pan me 0-25', '', 1, 'Cái', 'TQ', 'Đang sử dụng', '', '4G01.02'),
('Trục dao thay thế của máy phay P90', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Ổ kẹp dao  trụ thẳng(Sen ga)mới', '', 7, 'Cái', 'TQ', 'Đang sử dụng', '', '4G01.02'),
('Ổ kẹp dao  trụ thẳng(Sen ga)cũ', '', 8, 'Cái', 'Nhật', 'Đang sử dụng', 'ĐNTL 3', '4G01.02'),
('Ổ gá dao ụ phay lớn', '', 1, 'Cái', 'Nhật ', 'Đang sử dụng', '', '4G01.02'),
('Ổ gá dao đuôi trụ thẳng(Sen ga)', '', 1, 'Cái', 'Nhật', 'Đang sử dụng', '', '4G01.02'),
('Trục dao ngang NT40', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Đầu dao NT40 + kẹp rút C32', '', 1, 'bộ', 'DL', 'Đang sử dụng', '', '4G01.02'),
('bộ trục kiểm côn(2) + calíp trục (1)', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Khớp nối bi li hợp', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ mẫu bài tập tiện cắt rãnh lỗ', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ gá kẹp tháo lắp nhanh', ' - TS NSS 2007', 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ mẫu hai trục lệch tâm + 1 bạc', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Đồ gá cắt ren tự động trên máy tiện+ 10 đầu cắtren', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ trục vít đai ốc cắt ¼', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('trục + đai ốc ren hai đầu mối', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ mẫu trục vít đai ốc hai nửa', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Mũi nhọn cố định', ' - TS NSS 2007', 4, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Mũi nhọn quay', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Má kẹp', ' - TS NSS 2007', 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Bộ phiến tì phẳng', ' - TS NSS 2007', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.03'),
('Ê tô máy bào B650', '', 2, 'bộ', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Êtô', '', 7, 'cái ', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Máy bào ngang B 650', '', 2, 'cái', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Máy khoan cần GP 121 AC', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Máy khoan cần GP K525 + ê tô', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Máy tiện T14 B', '', 3, 'cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.04'),
('Máy tiện WASHINO LEG-125', 'Chiều dài chống tâm: 1250 mm
Chiều cao tâm: 250 mm
Đường kính vật tiện: 300 mm
Có hầu 200x170', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G01.04'),
('Xe nâng', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4G01.04'),
('Swicth D – Link 16 Ports', '10/100Mbqs', 1, 'cái', 'TQ', 'Đang sử dụng', '', '4G02.01'),
('Swicth D – Link 16 Ports', '10/100Mbqs', 1, 'cái', 'TQ', 'Đang sử dụng', '', '4G02.01'),
('Ê tô (L=200)', '', 3, 'cái ', 'VN', 'Đang sử dụng', '', '4G02.02'),
('Động cơ điện-Blok rời (12)1/2HP, (4)1/8HP, (4)1HP', '', 20, 'cái', 'VN', 'Đang sử dụng', '9 động cơ điện, 11 block', '4G02.02'),
('Giá hàn', 'Bộ hàn hơi (4 mỏ hàn + 2 giá hàn)', 2, 'cái', 'VN', 'Đang sử dụng', 'ĐNTL 4 mỏ hàn', '4G02.02'),
('Máy thu hồi và tái chế CFC 12 Robinair - Model: 347112-K', ' ', 1, 'cái', ' ', 'Đang sử dụng', '', '4G02.02'),
('Bình nạp môi chất lạnh Robinair - Model: 43220', ' ', 1, 'cái', ' ', 'Đang sử dụng', '', '4G02.03'),
('Mô hình dàn trải máy lạnh 2 cục 2 chiều.', ' ', 1, 'MH', 'VN', 'Đang sử dụng', '', '4G02.03'),
('Mồ hình dàn trải máy lạnh 1 cục 1 chiều.', ' ', 1, 'MH', 'VN', 'Đang sử dụng', '', '4G02.03'),
('Bộ long loe ống ', 'TS 4KDI', 1, 'bộ', 'VN', 'Đang sử dụng', '', '4G02.03'),
('Bộ nguồn cung cấp điện 24VDC (power supply unit)', ' ', 1, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ khí nén – điện khí nén cơ bản (set of basic Electro-Pneumatic TP201, supplementary equipment set from pneumatic basic level TP101 to Electro pneumatic basic level TP201)', ' ', 2, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Equipment tray', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', '', '4G02.04'),
('Cụm manifold cắm nhanh tự làm kín', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Van cân bằng áp suất', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Van điều khiển lưu lượng 1 chiều', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Mô hình máy thủy lực', ' ', 1, 'cái', 'VN', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ bàn thí nghiệm thủy lực có 2 mặt làm việc MS-167277', ' ', 1, 'Bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Giá treo giữ ống thủy lực MS-159412', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('BỘ NGUỒN THỦY LỰC MS-152962', ' ', 1, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10                   - Tách tài sản', '4G02.04'),
('Rơle, 3 chiều MS-162241', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Van giới hạn, điện từ (R) MS-183345', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ phân phối MS-162244', ' ', 1, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ thiết bị điện thủy lực nâng cấp từ bộ thiết bị TP501và TP502 lên thành TP601 MS-167105', ' ', 1, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10                   - Tách tài sản', '4G02.04'),
('Tải trọng thí nghiệm                                MS-152972', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bình tích áp MS-152859', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Motor thuỷ lực MS-152858', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Xy lanh tác động kép  MS-152857', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Van giảm áp/Van điều áp MS-152848', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Áp kế MS-152841', ' ', 3, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('BỘ THỦY LỰC CƠ BẢN(Set of basic hydraulics) -TP501D:S-TP501-CP MS-80246', ' ', 1, 'bộ', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Ống có gắn đầu nối tháo nhanh 600 MM NG4 MS-152960', ' ', 13, 'sợi', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10                   - Tách tài sản', '4G02.04'),
('Bộ giá đỡ bộ nguồn thủy lực MS-158325', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ lắp bảng thí nghiệm,  nghiêng 85%  MS-158327', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ bảng nhôm lắp đặt thiết bị (1100X700) MS-159411', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ thanh gá ngang MS-158332', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Khung ER gá lắp các bộ thí nghiệm điện MS-152948', ' ', 2, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Bộ tủ chứa thiết bị thí nghiệm 3 ngăn kéo MS-158286', ' ', 1, 'cái', 'Đức', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Hộp rơ le Three-fold', ' ', 2, 'cái ', 'VN', 'Đang sử dụng', 'Chuyển sang G2.10', '4G02.04'),
('Swicth D – Link 16 Ports', '10/100Mbqs', 1, 'cái', 'TQ', 'Đang sử dụng', '', '4G02.04'),
('Etô 175', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Ê tô', '', 1, 'cái', 'LX', 'Đang sử dụng', '', '4G02.06'),
('Ê tô song hành mộng mang cá', '', 40, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Bàn máp', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Khung cưa tay', '', 20, 'cái', 'Đức', 'Đang sử dụng', 'ĐNTL 10', '4G02.06'),
('Đài vạch', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Máy khoan phay KF70', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Máy khoan bàn', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Máy khoan bàn', '', 1, 'Cái', 'D.Loan', 'Đang sử dụng', '', '4G02.06'),
('Máy mài hai đá F400', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Tay quay bàn ren các loại ', '', 30, 'cái', 'Đức', 'Đang sử dụng', 'ĐNTL 20', '4G02.06'),
('Tay quay Tarô 1No3 ', '', 10, 'cái', 'Đức', 'Đang sử dụng', 'ĐNTL 5', '4G02.06'),
('Tay quay tarô 5No1 ', '', 10, 'cái', 'Đức', 'Đang sử dụng', 'ĐNTL 5', '4G02.06'),
('Block máy lạnh 5.0HP', '', 2, 'cái', 'Nhật', 'Đang sử dụng', '', '4G02.07'),
('Block máy lạnh 4.0HP', '', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G02.07'),
('Mô hình tủ cấp đông, công suất 7.5 HP', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.07'),
('Mô hình kho lạnh, công suất 3.5 HP', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.07'),
('Thiết bị rời 7.5HP', '', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G02.08'),
('Thiết bị rời 5.0HP', '', 1, 'cái', 'Nhật', 'Đang sử dụng', '', '4G02.08'),
('Mô hình tủ trữ lạnh 3 ngăn (3HP)', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.08'),
('Mô hình điều hòa không khí (5HP)', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.08'),
('Mô hình đá tinh khiết (5HP)', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4G02.08'),
('Mô hình panel điều khiển', '', 4, 'cái', 'VN', 'Đang sử dụng', 'HS tự làm', '4G02.08'),
('Đồng hồ Axetylen', '', 4, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Đồng hồ Ôxy', '', 4, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Đồng hồ C2H2', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Đồng hồ O2', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Đồng hồ khí Co2', '', 3, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy cắt con rùa 1 mỏ YK 150', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn VIM Model: AC300A', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn VIM Model: AC300A', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn HERO Model: DS315 S/N: D45581003', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn HERO Model: DS315 S/N: D45581001', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn BUFALO-500DC', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn TRISTAS - 420-RCB', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn TRISTAS -340-RCB', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn xoay chiều điện thông 300A', '', 5, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn MIGWELD TA350', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn công nghệ MIC', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn TIG TG300P', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn OTC TIG AC/DC Model: ACCUTIG-300P
S/N: C0025MP1162009', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn công nghệ TIC', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy cắt sắt bằng đá cắt', '', 2, 'cái', 'VN', 'Đang sử dụng', 'ĐNTL 1', '4H01.01'),
('Bộ mỏ cắt hơi ', '', 4, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Bộ mỏ hàn hơi', '', 4, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Bộ mỏ hàn cắt ', '', 1, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Bộ trợ TIG của máy hàn BUFFALO', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn CO2 Junior 203', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn CO2 Junior 283', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn CO2 Junior 403 S', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Máy hàn CO2-SAFOR-MR200', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Bộ hàn khí  (ga + ôxy)', '', 1, 'bộ', 'VN', 'Đang sử dụng', '', '4H01.01'),
('ống sấy que hàn', '', 2, 'cái', 'VN', 'Đang sử dụng', '', '4H01.01'),
('Etô 175', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Êtô', '', 6, 'cái ', 'VN', 'Đang sử dụng', 'Chuyển xưởng Nhiệt lạnh G2.07 - 02 cái', '4H01.02'),
('Bàn hàn (Việt Đức)', '', 3, 'cái', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Máy Hàn một chiều Safor M340', '', 1, 'cái ', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Máy Hàn một chiều Safor M340', '', 1, 'cái', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Máy hàn xoay chiều điện thông 300A', '', 2, 'cái', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Máy mài hai đá Φ 200 Việt Nam', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Đầu phân độ', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Mâm cặp 4 chấu', '', 1, 'Bộ', 'VN', 'Đang sử dụng', '', '4G01.01'),
('Máy tiện T14L', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Máy tiện Trung Quốc C1340; C1330', '', 3, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Máy phay đứng vạn năng Nhật bản', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Máy khoan cần K525 Việt Nam', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy khoan Trung Quốc Z5030', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Máy bàoTrung Quốc B6050', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Máy nén khí ITALIA', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Ê tô khoan', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Ê tô Nhật máy phay', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4G01.02'),
('Đài vạch vạn năng', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Bầu khoan + Côn mooc 4', '', 2, 'Bộ', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Gá đồng hồ so', '', 2, 'Bộ', 'VN', 'Đang sử dụng', 'ĐNTL 1', '4G01.02'),
('Pan me 25x50', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Khối V', '', 2, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Đe rèn', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4G01.02'),
('Bánh răng thay thế', '', 8, 'Cái', 'VN', 'Đang sử dụng', '(8 cỡ khác nhau)', '4G01.02'),
('Tay quay ta rô M8 ', '', 14, 'Cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Tay quay ta rô M12', '', 5, 'Cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Tay quay bàn ren M8', '', 5, 'Cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Tay quay bàn ren M12', '', 4, 'Cái', 'VN', 'Đang sử dụng', '', '4G02.06'),
('Máy hàn bán tự động KEMPOMAT + 1bơm nước làm mát (thiếu dây dẫn)', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4H01.02'),
('Máy mài hai đá Φ 200 Việt Nam', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'Chuyển G1.02', '4H01.02'),
('Máy hàn điểm ZT – P16', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4H01.02'),
('Máy bơm nước', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'G1. 04', '4H01.02'),
('Êtô', '', 22, 'Cái', 'VN', 'Đang sử dụng', 'H1', '4H01.02'),
('Vam 3 chạc', '', 1, 'Cái', 'VN', 'Đang sử dụng', 'G1. 04', '4H01.02'),
('Hộp giảm tốc (3 + 1nắp tay gạt số)', '', 4, 'Cái', 'VN', 'Đang sử dụng', 'G1. 04', '4H01.02'),
('Bơm 3 pha', '', 2, 'Cái', 'VN', 'Đang sử dụng', 'G1. 04', '4H01.02'),
('Máy cắt tôn 3 x 1300', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4H01.03'),
('Máy đột dập 63T Việt Nam', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4H01.03'),
('Máy đột dập 17T Nhật Bản', '', 1, 'Cái', 'VN', 'Đang sử dụng', '', '4H01.03'),
('Máy mài hai đá Φ 400 Việt Nam', '', 2, 'Cái', 'VN', 'Đang sử dụng', 'Quản trị', '4H01.03');


DROP TABLE CANBO;
DROP TABLE CHUYENTHIETBI;
DROP TABLE NGANH;
DROP TABLE PHONG_XUONG;
DROP TABLE MUATHIETBI;
DROP TABLE THIETBI;
DROP TABLE THANHLYTHIETBI;

DELIMITER $$
CREATE TRIGGER `after_delete_CANBO` AFTER DELETE ON `CANBO` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CANBO', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_CANBO` AFTER INSERT ON `CANBO` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CANBO','INSERT');

END
$$
CREATE TRIGGER `after_update_CANBO` AFTER UPDATE ON `CANBO` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CANBO', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_CHUYENTHIETBI` AFTER DELETE ON `CHUYENTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CHUYENTHIETBI', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_CHUYENTHIETBI` AFTER INSERT ON `CHUYENTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CHUYENTHIETBI','INSERT');

END
$$
CREATE TRIGGER `after_update_CHUYENTHIETBI` AFTER UPDATE ON `CHUYENTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('CHUYENTHIETBI', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_MUATHIETBI` AFTER DELETE ON `MUATHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('MUATHIETBI', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_MUATHIETBI` AFTER INSERT ON `MUATHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('MUATHIETBI','INSERT');

END
$$
CREATE TRIGGER `after_update_MUATHIETBI` AFTER UPDATE ON `MUATHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('MUATHIETBI', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_NGANH` AFTER DELETE ON `NGANH` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('NGANH', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_NGANH` AFTER INSERT ON `NGANH` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('NGANH','INSERT');
END
$$
CREATE TRIGGER `after_update_NGANH` AFTER UPDATE ON `NGANH` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('NGANH', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_PHONG_XUONG` AFTER DELETE ON `PHONG_XUONG` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('PHONG_XUONG', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_PHONG_XUONG` AFTER INSERT ON `PHONG_XUONG` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('PHONG_XUONG','INSERT');

END
$$
CREATE TRIGGER `after_update_PHONG_XUONG` AFTER UPDATE ON `PHONG_XUONG` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('PHONG_XUONG', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_THANHLYTHIETBI` AFTER DELETE ON `THANHLYTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THANHLYTHIETBI', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_THANHLYTHIETBI` AFTER INSERT ON `THANHLYTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THANHLYTHIETBI','INSERT');

END
$$
CREATE TRIGGER `after_update_THANHLYTHIETBI` AFTER UPDATE ON `THANHLYTHIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THANHLYTHIETBI', 'UPDATE');
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `after_delete_THIETBI` AFTER DELETE ON `THIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THIETBI', 'DELETE');
END
$$
CREATE TRIGGER `after_insert_THIETBI` AFTER INSERT ON `THIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THIETBI','INSERT');

END
$$
CREATE TRIGGER `after_update_THIETBI` AFTER UPDATE ON `THIETBI` FOR EACH ROW BEGIN
    INSERT INTO change_log (table_name, action)
    VALUES ('THIETBI', 'UPDATE');
END
$$
DELIMITER ;


CALL UpdateTwoTables('G1.01', 'G101');
CALL UpdateTwoTables('H1.01', 'H101');
CALL UpdateTwoTables('G1.06', 'G106');
CALL UpdateTwoTables('G2.10', 'G210');
CALL UpdateTwoTables('G2.06', 'G206');
CALL UpdateTwoTables('H1.02', 'H102');
CALL UpdateTwoTables('G1.02', 'G102');
CALL UpdateTwoTables('G1.03', 'G103');
CALL UpdateTwoTables('G1.05', 'G105');
CALL UpdateTwoTables('G1.04', 'G104');
CALL UpdateTwoTables('G2.02', 'G202');
CALL UpdateTwoTables('G2.03', 'G203');
CALL UpdateTwoTables('G2.05', 'G205');
CALL UpdateTwoTables('G2.07', 'G207');
CALL UpdateTwoTables('G2.08', 'G208');
CALL UpdateTwoTables('g5.4', 'G504');
CALL UpdateTwoTables('g4.7', 'G407');
CALL UpdateTwoTables('g5.1', 'G501');
CALL UpdateTwoTables('g5.7', 'G507');
CALL UpdateTwoTables('d1.07', 'D107');
CALL UpdateTwoTables('d2.6', 'D206');
CALL UpdateTwoTables('g4.5', 'G405');
CALL UpdateTwoTables('d2.1', 'D201');
CALL UpdateTwoTables('d2.10', 'D210');
CALL UpdateTwoTables('g4.6', 'G406');
CALL UpdateTwoTables('g4.9', 'G409');
CALL UpdateTwoTables('d2.7', 'D207');
CALL UpdateTwoTables('d2.9', 'D209');
CALL UpdateTwoTables('g4.10', 'G410');
CALL UpdateTwoTables('g5.5', 'G505');
CALL UpdateTwoTables('g4.4', 'G404');
CALL UpdateTwoTables('g4.2', 'G402');
CALL UpdateTwoTables('g4.1', 'G401');