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

CREATE TABLE `USERS` (
  `MaCanBo` VARCHAR(16) NOT NULL,
  `Role` VARCHAR(20) NOT NULL DEFAULT 'user',
  `Password` VARCHAR(512) NOT NULL,
  `Email` VARCHAR(128),
  PRIMARY KEY (`MaCanBo`),
  FOREIGN KEY (`MaCanBo`) REFERENCES CANBO(`MaCanBo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE THIETBI (
    MaThietBi INT AUTO_INCREMENT NOT NULL,
    TenThietBi VARCHAR(150) NOT NULL,
    ThongSoKyThuat VARCHAR(1000),
    NamSanXuat YEAR,
    DonViTinh VARCHAR(20),
    NuocSanXuat VARCHAR(20),
    HienTrang VARCHAR(20),
    GhiChu VARCHAR(200),
    ViTri varchar(20) not null,
    MaPhongXuong CHAR(10) not null,
    PRIMARY KEY(MaThietBi, ViTri, MaPhongXuong),
    FOREIGN KEY (MaPhongXuong) REFERENCES PHONG_XUONG(MaPhongXuong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE CHUYENTHIETBI (
    MaChuyen INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    MaThietBi INT NOT NULL,
    NgayChuyen DATETIME NOT NULL,
    MaPhongChuyen CHAR(10) NOT NULL,
    MaPhongNhan CHAR(10) NOT NULL,
    MaCanBo VARCHAR(16) NOT NULL,
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

CREATE TABLE `change_log` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `table_name` varchar(128) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
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

INSERT INTO `CANBO` (`MaCanBo`, `TenCanBo`, `SoDienThoai`, `MaPhongXuong`, `VaiTroQL`, `MaNganh`) VALUES
('01010093', 'Trần Hữu Anh', NULL, 'F303', 'Phó Trưởng khoa-Quản lý phòng F303', '7480201'),
('01010094', 'Nguyễn Tiến Cương', NULL, 'F205', 'Giảng viên-Quản lý phòng F205', '7480201'),
('01010094', 'Nguyễn Tiến Cương', NULL, 'F207', 'Giảng viên-Quản lý phòng F207', '7480201'),
('01010097', 'Đào Thị Phương Thuý', NULL, 'F213', 'Giảng viên-Quản lý phòng F213', '7480201'),
('01010098', 'Trần Thu Hà', NULL, 'F205', 'Giảng viên-Quản lý phòng F205', '7480201'),
('01010099', 'Nguyễn Thị Thu Hiền', NULL, 'F207', 'Giảng viên-Quản lý phòng F207', '7480201'),
('01010100', 'Lê Thanh Hùng', NULL, 'F211', 'Giảng viên-Quản lý phòng F211', '7480201'),
('01010100', 'Lê Thanh Hùng', NULL, 'F213', 'Giảng viên-Quản lý phòng F213', '7480201'),
('01010101', 'Trần Thị Thúy Nga', NULL, 'F213', 'Giảng viên-Quản lý phòng F213', '7480201'),
('01010104', 'Trần Thị Thu Hường', NULL, 'F211', 'Giảng viên-Quản lý phòng F211', '7480201'),
('01010105', 'Nguyễn Thị Sinh', NULL, 'F303', 'Giảng viên-Quản lý phòng F303', '7480201'),
('01010115', 'Trần Công Thức', NULL, 'G101', 'Giảng viên-Quản lý phòng G101', '7510201'),
('01010115', 'Trần Công Thức', NULL, 'H101', 'Giảng viên-Quản lý phòng H101', '7510201'),
('01010118', 'Đoàn Văn Đô', NULL, 'G106', 'Giảng viên-Quản lý phòng G106', '7510201'),
('01010118', 'Đoàn Văn Đô', NULL, 'G210', 'Giảng viên-Quản lý phòng G210', '7510201'),
('01010121', 'Lại Hồng Hùng', NULL, 'G206', 'Giảng viên-Quản lý phòng G206', '7510201'),
('01010121', 'Lại Hồng Hùng', NULL, 'H102', 'Giảng viên-Quản lý phòng H102', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', NULL, 'G102', 'Giảng viên-Quản lý phòng G102', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', NULL, 'G103', 'Giảng viên-Quản lý phòng G103', '7510201'),
('01010128', 'Nguyễn Hùng Tráng', NULL, 'G105', 'Giảng viên-Quản lý phòng G105', '7510201'),
('01010134', 'Trần Chí Quang', NULL, 'G104', 'Giảng viên-Quản lý phòng G104', '7510201'),
('01010135', 'Đỗ Anh Tuấn', NULL, 'G202', 'Giảng viên-Quản lý phòng G202', '7510201'),
('01010135', 'Đỗ Anh Tuấn', NULL, 'G203', 'Giảng viên-Quản lý phòng G203', '7510201'),
('01010135', 'Đỗ Anh Tuấn', NULL, 'G205', 'Giảng viên-Quản lý phòng G205', '7510201'),
('01010135', 'Đỗ Anh Tuấn', NULL, 'G207', 'Giảng viên-Quản lý phòng G207', '7510201'),
('01010144', 'Đặng Gia Dũng', NULL, 'G208', 'Giảng viên-Quản lý phòng G208', '7510201'),
('01010144', 'Đặng Gia Dũng', NULL, 'G504', 'Giảng viên-Quản lý phòng G504', '7510301'),
('01010145', 'Vũ Đức Nhật', NULL, 'G407', 'Giảng viên-Quản lý phòng G407', '7510301'),
('01010145', 'Vũ Đức Nhật', NULL, 'G501', 'Giảng viên-Quản lý phòng G501', '7510301'),
('01010146', 'Ngô Thị Ánh Hằng', NULL, 'G507', 'Giảng viên-Quản lý phòng G507', '7510301'),
('01010147', 'Tống Thị Lan', NULL, 'D107', 'Giảng viên-Quản lý phòng D107', '7510301'),
('01010147', 'Tống Thị Lan', NULL, 'D206', 'Giảng viên-Quản lý phòng D206', '7510301'),
('01010148', 'Tô Đức Anh', NULL, 'G405', 'Giảng viên-Quản lý phòng G405', '7510301'),
('01010149', 'Đàm Đức Cường', NULL, 'D201', 'Giảng viên-Quản lý phòng D201', '7510301'),
('01010149', 'Đàm Đức Cường', NULL, 'D210', 'Giảng viên-Quản lý phòng D210', '7510301'),
('01010150', 'Lê Tiến Dũng', NULL, 'G406', 'Giảng viên-Quản lý phòng G406', '7510301'),
('01010150', 'Lê Tiến Dũng', NULL, 'G409', 'Giảng viên-Quản lý phòng G409', '7510301'),
('01010152', 'Nguyễn Thị Thu Hà', NULL, 'D207', 'Giảng viên-Quản lý phòng D207', '7510301'),
('01010152', 'Nguyễn Thị Thu Hà', NULL, 'D209', 'Giảng viên-Quản lý phòng D209', '7510301'),
('01010153', 'Trần Minh Hải', NULL, 'G410', 'Giảng viên-Quản lý phòng G410', '7510301'),
('01010153', 'Trần Minh Hải', NULL, 'G505', 'Giảng viên-Quản lý phòng G505', '7510301'),
('01010154', 'Vũ Quang Hòa', NULL, 'G404', 'Giảng viên-Quản lý phòng G404', '7510301'),
('01010155', 'Đặng Văn Hữu', NULL, 'G402', 'Giảng viên-Quản lý phòng G402', '7510301'),
('01010158', 'Dương Thị Loan', NULL, 'G401', 'Giảng viên-Quản lý phòng G401', '7510301'),
('01010158', 'Dương Thị Loan', NULL, 'G503', 'Giảng viên-Quản lý phòng G503', '7510301'),
('01010160', 'Đào Thị Mơ', NULL, 'D106', 'Giảng viên-Quản lý phòng D106', '7510301'),
('01010160', 'Đào Thị Mơ', NULL, 'D204', 'Giảng viên-Quản lý phòng D204', '7510301'),
('01010161', 'Nguyễn Thị Nga', NULL, 'D203', 'Giảng viên-Quản lý phòng D203', '7510301'),
('01010162', 'Nguyễn Văn Nhương', NULL, 'G403', 'Giảng viên-Quản lý phòng G403', '7510301'),
('01010163', 'Nguyễn Thị Bảo Thư', NULL, 'D202', 'Giảng viên-Quản lý phòng D202', '7510301'),
('01010163', 'Nguyễn Thị Bảo Thư', NULL, 'D208', 'Giảng viên-Quản lý phòng D208', '7510301'),
('01010164', 'Trần Văn Yên', NULL, 'G502', 'Giảng viên-Quản lý phòng G502', '7510301'),
('01010165', 'Đinh Duy Phương', NULL, 'G408', 'Giảng viên-Quản lý phòng G408', '7510301'),
('01010166', 'Nguyễn Thanh Phong', NULL, 'D205', 'Giảng viên-Quản lý phòng D205', '7510301'),
('1010156', 'Vũ Thị Thuỳ Lan', NULL, 'D104', 'Giảng viên-Quản lý phòng D104', '7510301'),
('1010159', 'Nguyễn Thuý May', NULL, 'D105', 'Giảng viên-Quản lý phòng D105', '7510301');


INSERT INTO `USERS` (`MaCanBo`, `Password`, `Role`) VALUES
('01010093', '123456', 'admin'),
('01010094', '123456', 'user'),
('01010097', '123456', 'user'),
('01010098', '123456', 'user'),
('01010099', '123456', 'user'),
('01010100', '123456', 'user'),
('01010101', '123456', 'user'),
('01010104', '123456', 'user'),
('01010105', '123456', 'user'),
('01010115', '123456', 'user'),
('01010118', '123456', 'user'),
('01010121', '123456', 'user'),
('01010128', '123456', 'user'),
('01010134', '123456', 'user'),
('01010135', '123456', 'user'),
('01010144', '123456', 'user'),
('01010145', '123456', 'user'),
('01010146', '123456', 'user'),
('01010147', '123456', 'user'),
('01010148', '123456', 'user'),
('01010149', '123456', 'user'),
('01010150', '123456', 'user'),
('01010152', '123456', 'user'),
('01010153', '123456', 'user'),
('01010154', '123456', 'user'),
('01010155', '123456', 'user'),
('01010158', '123456', 'user'),
('01010160', '123456', 'user'),
('01010161', '123456', 'user'),
('01010162', '123456', 'user'),
('01010163', '123456', 'user'),
('01010164', '123456', 'user'),
('01010165', '123456', 'user'),
('01010166', '123456', 'user'),
('1010156',  '123456', 'user'),
('1010159',  '123456', 'user');


INSERT INTO `PHONG_XUONG` (`MaPhongXuong`, `TenPhongXuong`, `ViTri`, `MaNganh`) VALUES
('D104', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D105', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D106', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D107', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D201', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D202', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D203', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D204', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D205', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D206', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D207', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D208', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D209', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('D210', 'Thực hành Điện-Điện Tử', 'Tòa nhà D', '7510301'),
('F205', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F207', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F211', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F213', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('F217', '	Phòng máy tính', '	Tòa nhà F', '7480201'),
('F303', 'Phòng máy tính ', 'Tòa nhà F', '7480201'),
('G101', 'Thực hành CNC, CAD/CAM', 'Tòa nhà G', '7510201'),
('G102', 'Thực hành Tiện', 'Tòa nhà G', '7510201'),
('G103', 'Phòng sản phẩm ngành Cơ khí', 'Tòa nhà G', '7510201'),
('G104', 'Thực hành sửa chữa cơ khí', 'Tòa nhà G', '7510201'),
('G105', 'Thực hành Phay - Bào', 'Tòa nhà G', '7510201'),
('G106', 'Thực hành gò - gia công áp lực', 'Tòa nhà G', '7510201'),
('G202', 'Thực hành điện lạnh cơ bản', 'Tòa nhà G', '7510301'),
('G203', 'Thực hành điện lạnh dân dụng 1', 'Tòa nhà G', '7510301'),
('G205', 'Thực hành điện lạnh dân dụng 2', 'Tòa nhà G', '7510301'),
('G206', 'Thực hành nguội', 'Tòa nhà G', '7510201'),
('G207', 'Thực hành điện lạnh công nghiệp 1', 'Tòa nhà G', '7510301'),
('G208', 'Thực hành điện lạnh công nghệp 2', 'Tòa nhà G', '7510301'),
('G210', 'Thực hành khí nén tủy lực', 'Tòa nhà G', '7510201'),
('G401', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G402', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G403', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G404', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G405', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G406', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G407', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G408', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G409', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G410', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G501', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G502', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G503', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G504', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G505', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('G507', 'Thực hành Điện-Điện Tử', 'Tòa nhà G', '7510301'),
('H101', 'Thực hành hàn 1', 'Tòa nhà H', '7510201'),
('H102', 'Thực hành hàn', 'Tòa nhà H', '7510201');

INSERT INTO `THIETBI` (`MaThietBi`, `TenThietBi`, `ThongSoKyThuat`, `NamSanXuat`, `DonViTinh`, `NuocSanXuat`, `HienTrang`, `GhiChu`, `ViTri`, `MaPhongXuong`) VALUES
(1, 'Tụ điện', '1uf, 22uf, 50uf, 220uf', NULL, NULL, NULL, 'Đang sử dụng', NULL, 'Thiết bị 1', 'D104'),
(2, 'Hộp rơ le Three-fold', NULL, NULL, NULL, NULL, 'Đang sử dụng', NULL, 'Thiết bị 2', 'D105'),
(3, 'Máy đo dao động ký', 'Dải đo: 0-100MHz, 2 kênh', 2020, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 3', 'D104'),
(4, 'Máy phát sóng tín hiệu', 'Tần số: 1Hz-20MHz', 2019, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 4', 'D105'),
(5, 'Bộ nguồn DC', 'Điện áp: 0-30V, Dòng: 0-5A', 2021, 'Cái', 'Đài Loan', 'Đang sử dụng', NULL, 'Thiết bị 5', 'D106'),
(6, 'Máy đo LCR', 'Đo điện cảm, điện dung, điện trở', 2020, 'Cái', 'Hàn Quốc', 'Đang sử dụng', NULL, 'Thiết bị 6', 'D107'),
(7, 'Máy hàn linh kiện SMD', 'Công suất: 50W', 2018, 'Cái', 'Trung Quốc', 'Đang sử dụng', NULL, 'Thiết bị 7', 'D201'),
(8, 'Máy đo logic', '8 kênh, tốc độ 100MHz', 2019, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 8', 'D202'),
(9, 'Máy in 3D', 'Độ phân giải: 0.1mm', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 9', 'D203'),
(10, 'Máy cắt laser', 'Công suất: 40W', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 10', 'D204'),
(11, 'Máy đo nhiệt độ không tiếp xúc', 'Dải đo: -50°C đến 1000°C', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 11', 'D205'),
(12, 'Máy đo độ ẩm không khí', 'Dải đo: 0% đến 100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 12', 'D206'),
(13, 'Máy đo áp suất chân không', 'Dải đo: 0-1000 mbar', 2018, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 13', 'D207'),
(14, 'Máy đo độ rung', 'Dải đo: 0-200Hz', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 14', 'D208'),
(15, 'Máy đo độ ồn', 'Dải đo: 30-130dB', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 15', 'D209'),
(16, 'Máy đo độ dẫn điện', 'Dải đo: 0-2000 µS/cm', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 16', 'D210'),
(17, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 1', 'F205'),
(18, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 2', 'F207'),
(19, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 3', 'F211'),
(20, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 4', 'F213'),
(21, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 5', 'F217'),
(22, 'Máy tính để bàn', 'CPU: i5, RAM: 8GB, SSD: 256GB', 2022, 'Cái', 'Việt Nam', 'Đang sử dụng', NULL, 'Bàn 6', 'F303'),
(23, 'Máy tiện CNC', 'Model: XYZ-123, Công suất: 5.5kW', 2021, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 1', 'G101'),
(24, 'Máy phay CNC', 'Model: ABC-456, Công suất: 7.5kW', 2021, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 2', 'G101'),
(25, 'Máy hàn điện tử', 'Model: HAN-001, Công suất: 10kW', 2020, 'Cái', 'Hàn Quốc', 'Đang sử dụng', NULL, 'Thiết bị 1', 'H101'),
(26, 'Máy hàn MIG/MAG', 'Model: HAN-002, Công suất: 15kW', 2020, 'Cái', 'Hàn Quốc', 'Đang sử dụng', NULL, 'Thiết bị 2', 'H102'),
(27, 'Máy nén khí', 'Model: NK-100, Công suất: 3kW', 2019, 'Cái', 'Trung Quốc', 'Đang sử dụng', NULL, 'Thiết bị 3', 'G210'),
(28, 'Máy khoan bàn', 'Model: KB-200, Công suất: 1.5kW', 2018, 'Cái', 'Đài Loan', 'Đang sử dụng', NULL, 'Thiết bị 4', 'G102'),
(29, 'Máy cắt plasma', 'Model: CP-300, Công suất: 20kW', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 5', 'G104'),
(30, 'Máy đo nhiệt độ', 'Model: DT-400, Dải đo: -50°C đến 300°C', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 6', 'G202'),
(31, 'Máy đo độ ẩm', 'Model: DH-500, Dải đo: 0% đến 100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 7', 'G203'),
(32, 'Máy đo áp suất', 'Model: AP-600, Dải đo: 0-1000 bar', 2019, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 8', 'G205'),
(33, 'Máy đo dòng điện', 'Model: DI-700, Dải đo: 0-100A', 2021, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 9', 'G401'),
(34, 'Máy đo điện áp', 'Model: DV-800, Dải đo: 0-1000V', 2021, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 10', 'G402'),
(35, 'Máy đo công suất', 'Model: DP-900, Dải đo: 0-1000W', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 11', 'G403'),
(36, 'Máy đo tần số', 'Model: DF-1000, Dải đo: 0-100MHz', 2019, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 12', 'G404'),
(37, 'Máy đo điện trở đất', 'Model: DE-1100, Dải đo: 0-2000Ω', 2018, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 13', 'G405'),
(38, 'Máy đo độ rọi', 'Model: DL-1200, Dải đo: 0-20000 lux', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 14', 'G406'),
(39, 'Máy đo độ ẩm đất', 'Model: DS-1300, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 15', 'G407'),
(40, 'Máy đo độ dày', 'Model: DT-1400, Dải đo: 0-100mm', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 16', 'G408'),
(41, 'Máy đo độ cứng', 'Model: DH-1500, Dải đo: 0-100HRC', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 17', 'G409'),
(42, 'Máy đo độ nhám', 'Model: DR-1600, Dải đo: 0-100µm', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 18', 'G410'),
(43, 'Máy đo độ dẫn nhiệt', 'Model: DC-1700, Dải đo: 0-100W/mK', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 19', 'G501'),
(44, 'Máy đo độ nhớt', 'Model: DV-1800, Dải đo: 0-1000cP', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 20', 'G502'),
(45, 'Máy đo độ pH', 'Model: DP-1900, Dải đo: 0-14pH', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 21', 'G503'),
(46, 'Máy đo độ dẫn điện', 'Model: DC-2000, Dải đo: 0-2000µS/cm', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 22', 'G504'),
(47, 'Máy đo độ đục', 'Model: DT-2100, Dải đo: 0-1000NTU', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 23', 'G505'),
(48, 'Máy đo độ màu', 'Model: DC-2200, Dải đo: 0-1000TCU', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 24', 'G507'),
(49, 'Máy đo độ ẩm gỗ', 'Model: DW-2300, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 25', 'H101'),
(50, 'Máy đo độ ẩm giấy', 'Model: DP-2400, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 26', 'H102'),
(51, 'Máy đo độ ẩm vải', 'Model: DF-2500, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 27', 'D104'),
(52, 'Máy đo độ ẩm thực phẩm', 'Model: DF-2600, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 28', 'D105'),
(53, 'Máy đo độ ẩm đất', 'Model: DS-2700, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 29', 'D106'),
(54, 'Máy đo độ ẩm không khí', 'Model: DA-2800, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 30', 'D107'),
(55, 'Máy đo độ ẩm bê tông', 'Model: DC-2900, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 31', 'D201'),
(56, 'Máy đo độ ẩm gạch', 'Model: DB-3000, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 32', 'D202'),
(57, 'Máy đo độ ẩm xi măng', 'Model: DC-3100, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 33', 'D203'),
(58, 'Máy đo độ ẩm sơn', 'Model: DP-3200, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 34', 'D204'),
(59, 'Máy đo độ ẩm nhựa', 'Model: DP-3300, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 35', 'D205'),
(60, 'Máy đo độ ẩm gỗ', 'Model: DW-3400, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 36', 'D206'),
(61, 'Máy đo độ ẩm giấy', 'Model: DP-3500, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 37', 'D207'),
(62, 'Máy đo độ ẩm vải', 'Model: DF-3600, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 38', 'D208'),
(63, 'Máy đo độ ẩm thực phẩm', 'Model: DF-3700, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 39', 'D209'),
(64, 'Máy đo độ ẩm đất', 'Model: DS-3800, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 40', 'D210'),
(65, 'Máy đo độ ẩm không khí', 'Model: DA-3900, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 41', 'F205'),
(66, 'Máy đo độ ẩm bê tông', 'Model: DC-4000, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 42', 'F207'),
(67, 'Máy đo độ ẩm gạch', 'Model: DB-4100, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 43', 'F211'),
(68, 'Máy đo độ ẩm xi măng', 'Model: DC-4200, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 44', 'F213'),
(69, 'Máy đo độ ẩm sơn', 'Model: DP-4300, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 45', 'F217'),
(70, 'Máy đo độ ẩm nhựa', 'Model: DP-4400, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 46', 'F303'),
(71, 'Máy đo độ ẩm gỗ', 'Model: DW-4500, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 47', 'G101'),
(72, 'Máy đo độ ẩm giấy', 'Model: DP-4600, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 48', 'G102'),
(73, 'Máy đo độ ẩm vải', 'Model: DF-4700, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 49', 'G103'),
(74, 'Máy đo độ ẩm thực phẩm', 'Model: DF-4800, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 50', 'G104'),
(75, 'Máy đo độ ẩm đất', 'Model: DS-4900, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 51', 'G105'),
(76, 'Máy đo độ ẩm không khí', 'Model: DA-5000, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 52', 'G106'),
(77, 'Máy đo độ ẩm bê tông', 'Model: DC-5100, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 53', 'G202'),
(78, 'Máy đo độ ẩm gạch', 'Model: DB-5200, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 54', 'G203'),
(79, 'Máy đo độ ẩm xi măng', 'Model: DC-5300, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 55', 'G205'),
(80, 'Máy đo độ ẩm sơn', 'Model: DP-5400, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 56', 'G206'),
(81, 'Máy đo độ ẩm nhựa', 'Model: DP-5500, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 57', 'G207'),
(82, 'Máy đo độ ẩm gỗ', 'Model: DW-5600, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 58', 'G208'),
(83, 'Máy đo độ ẩm giấy', 'Model: DP-5700, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 59', 'G210'),
(84, 'Máy đo độ ẩm vải', 'Model: DF-5800, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 60', 'G401'),
(85, 'Máy đo độ ẩm thực phẩm', 'Model: DF-5900, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 61', 'G402'),
(86, 'Máy đo độ ẩm đất', 'Model: DS-6000, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 62', 'G403'),
(87, 'Máy đo độ ẩm không khí', 'Model: DA-6100, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 63', 'G404'),
(88, 'Máy đo độ ẩm bê tông', 'Model: DC-6200, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 64', 'G405'),
(89, 'Máy đo độ ẩm gạch', 'Model: DB-6300, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 65', 'G406'),
(90, 'Máy đo độ ẩm xi măng', 'Model: DC-6400, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 66', 'G407'),
(91, 'Máy đo độ ẩm sơn', 'Model: DP-6500, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 67', 'G408'),
(92, 'Máy đo độ ẩm nhựa', 'Model: DP-6600, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 68', 'G409'),
(93, 'Máy đo độ ẩm gỗ', 'Model: DW-6700, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 69', 'G410'),
(94, 'Máy đo độ ẩm giấy', 'Model: DP-6800, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 70', 'G501'),
(95, 'Máy đo độ ẩm vải', 'Model: DF-6900, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 71', 'G502'),
(96, 'Máy đo độ ẩm thực phẩm', 'Model: DF-7000, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 72', 'G503'),
(97, 'Máy đo độ ẩm đất', 'Model: DS-7100, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 73', 'G504'),
(98, 'Máy đo độ ẩm không khí', 'Model: DA-7200, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 74', 'G505'),
(99, 'Máy đo độ ẩm bê tông', 'Model: DC-7300, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 75', 'G507'),
(100, 'Máy đo độ ẩm gạch', 'Model: DB-7400, Dải đo: 0-100%', 2019, 'Cái', 'Nhật Bản', 'Đang sử dụng', NULL, 'Thiết bị 76', 'H101'),
(101, 'Máy đo độ ẩm xi măng', 'Model: DC-7500, Dải đo: 0-100%', 2020, 'Cái', 'Đức', 'Đang sử dụng', NULL, 'Thiết bị 77', 'H102'),
(102, 'Máy đo độ ẩm sơn', 'Model: DP-7600, Dải đo: 0-100%', 2021, 'Cái', 'Mỹ', 'Đang sử dụng', NULL, 'Thiết bị 78', 'D104');

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

drop TABLE THIETBI;
DROP TABLE CHUYENTHIETBI;
drop TABLE THANHLYTHIETBI;