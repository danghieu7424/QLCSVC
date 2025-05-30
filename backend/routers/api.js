const express = require("express");
const { queryDatabase } = require("./modules/mySQLConfig");
const { verifyToken, checkManager } = require("./modules/verifyToken");

const router = express.Router();

//-------profile-------
router.get("/api/select/profile", verifyToken, async (req, res) => {
  const decoded = req.user;
  try {
    const [result] = await queryDatabase(
      `
        SELECT
            cb.*,
            k.TenKhoa,
            n.TenNganh
        FROM
            CANBO cb
        JOIN
            KHOA k ON k.MaKhoa = cb.MaKhoa
        JOIN
            NGANH n ON n.MaNganh = cb.MaNganh
        WHERE
            MaCanBo = ?;
      `,
      [decoded.id]
    );

    res.json({
      message: "Thành công.",
      data: result,
      Avatar: `avatar_${result.MaCanBo}.png`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

//--------------data--------------

router.get("/api/select/data", verifyToken, async (req, res) => {
  try {
    const rawResult_cb = await queryDatabase(
      `
        SELECT MaCanBo, TenCanBo FROM CANBO;
      `
    );

    const rawResult_n = await queryDatabase(
      `
        SELECT MaNganh, TenNganh FROM NGANH;
      `
    );

    const rawResult_k = await queryDatabase(
      `
        SELECT MaKhoa, TenKhoa FROM KHOA;
      `
    );

    res.json({
      CanBo: rawResult_cb,
      Nganh: rawResult_n,
      Khoa: rawResult_k,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//--------------

router.get("/api/select/quan-ly-phong", async (req, res) => {
  try {
    const rowsPHONG = await queryDatabase(
      `
            SELECT *
            FROM PHONG
        `,
      []
    );

    const rows = await queryDatabase(
      `
            SELECT 
                QLP.MaCanBo,
                QLP.MaPhong,
                P.TenPhong,
                C.MaCanBo AS MaCanBoGoc,
                C.TenCanBo,
                C.ChucVu,
                N.MaNganh,
                N.TenNganh,
                K.MaKhoa,
                K.TenKhoa
            FROM QUANLY_PHONG QLP
            LEFT JOIN PHONG P ON QLP.MaPhong = P.MaPhong
            LEFT JOIN CANBO C ON QLP.MaCanBo = C.MaCanBo
            LEFT JOIN NGANH N ON P.MaNganh = N.MaNganh
            LEFT JOIN KHOA K ON N.MaKhoa = K.MaKhoa
        `,
      []
    );

    const resultTB = await queryDatabase(`
          SELECT tb.MaThietBi, ltb.TenLoai, tb.TrangThai, tb.ViTriHienTai, tb.GiaiTrinh
          FROM THIETBI tb
          LEFT JOIN LOAI_THIETBI ltb ON tb.MaLoai = ltb.MaLoai
          ORDER BY tb.MaLoai ASC
        `);

    // Gom nhóm thành JSON theo cấu trúc mong muốn
    const result = {};

    // Tạo mảng phòng có cán bộ quản lý
    const phongWithCanBo = rows.map((row) => row.MaPhong);

    for (const row of rows) {
      const {
        MaKhoa,
        TenKhoa,
        MaNganh,
        TenNganh,
        MaPhong,
        TenPhong,
        MaCanBo,
        TenCanBo,
        ChucVu,
      } = row;

      if (!result[MaKhoa]) {
        result[MaKhoa] = {
          MaKhoa,
          TenKhoa,
          Nganh: {},
        };
      }

      const khoa = result[MaKhoa];

      if (!khoa.Nganh[MaNganh]) {
        khoa.Nganh[MaNganh] = {
          MaNganh,
          TenNganh,
          Phong: {},
        };
      }

      const nganh = khoa.Nganh[MaNganh];

      if (!nganh.Phong[MaPhong]) {
        nganh.Phong[MaPhong] = {
          MaPhong,
          TenPhong,
          CanBo: [],
        };
      }

      const phong = nganh.Phong[MaPhong];

      // Chỉ thêm cán bộ nếu có thông tin
      if (MaCanBo) {
        phong.CanBo.push({
          MaCanBo,
          TenCanBo,
          ChucVu,
        });
      }

      // Thêm thiết bị vào phòng
      const thietBi = nganh.Phong[MaPhong];
      thietBi.ThietBi = resultTB
        .filter((tb) => tb.ViTriHienTai === MaPhong)
        .map((tb) => ({
          MaThietBi: tb.MaThietBi,
          TenLoai: tb.TenLoai || "Không tên",
          TrangThai: tb.TrangThai,
          GiaiTrinh: tb.GiaiTrinh,
        }));
    }

    // Thêm phòng không có cán bộ quản lý
    rowsPHONG.forEach((phong) => {
      if (!phongWithCanBo.includes(phong.MaPhong)) {
        const { MaPhong, TenPhong, MaNganh } = phong;

        // Kiểm tra khoa và ngành trong result
        for (let khoaKey in result) {
          const khoa = result[khoaKey];
          for (let nganhKey in khoa.Nganh) {
            const nganh = khoa.Nganh[nganhKey];

            if (nganh.MaNganh === MaNganh) {
              // Nếu ngành đã tồn tại, thêm phòng không có cán bộ
              if (!nganh.Phong[MaPhong]) {
                nganh.Phong[MaPhong] = {
                  MaPhong,
                  TenPhong,
                  CanBo: [], // Phòng này không có cán bộ quản lý
                };
              }
            }
          }
        }
      }
    });

    // Convert object về mảng như yêu cầu
    const final = Object.values(result).map((k) => ({
      MaKhoa: k.MaKhoa,
      TenKhoa: k.TenKhoa,
      Nganh: Object.values(k.Nganh).map((n) => ({
        MaNganh: n.MaNganh,
        TenNganh: n.TenNganh,
        Phong: Object.values(n.Phong),
      })),
    }));

    res.json({ message: "Thành công.", data: final, phong: rowsPHONG });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/api/insert/quan-ly-phong",
  verifyToken,
  checkManager,
  async (req, res) => {
    const { MaPhong, MaCanBo } = req.body;

    try {
      // Kiểm tra xem cán bộ đã quản lý phòng này chưa
      const [existing] = await queryDatabase(
        `
            SELECT *
            FROM QUANLY_PHONG
            WHERE MaPhong = ? AND MaCanBo = ?
        `,
        [MaPhong, MaCanBo]
      );

      if (existing) {
        return res
          .status(400)
          .json({ message: "Cán bộ đã quản lý phòng này." });
      }

      // Thêm cán bộ vào phòng
      await queryDatabase(
        `
            INSERT INTO QUANLY_PHONG (MaPhong, MaCanBo)
            VALUES (?, ?)
        `,
        [MaPhong, MaCanBo]
      );

      res.json({ message: "Thêm thành công." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/api/delete/quan-ly-phong", verifyToken, async (req, res) => {
  const { MaPhong, MaCanBo } = req.body;

  try {
    // Xóa cán bộ khỏi phòng
    await queryDatabase(
      `
        SET time_zone = '+07:00';
        DELETE FROM QUANLY_PHONG
        WHERE MaPhong = ? AND MaCanBo = ?
      `,
      [MaPhong, MaCanBo]
    );

    res.json({ message: "Xóa thành công." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// =======phong======= //

router.get("/api/select/trang-thai-phong", async (req, res) => {
  try {
    const result = await queryDatabase(
      `
        SELECT COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'THIETBI'
          AND COLUMN_NAME = 'TrangThai';
      `
    );

    const enumStr = result[0]?.COLUMN_TYPE || ""; // lấy chuỗi enum

    const values = enumStr
      .replace(/^enum\(/, "")
      .replace(/\)$/, "")
      .split(/','/)
      .map((s) => s.replace(/^'/, "").replace(/'$/, ""));

    res.json({ message: "Thành công.", data: values });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// ======= loại thiết bị ======= //

router.get("/api/select/don-vi-tinh-loai-thiet-bi", async (req, res) => {
  try {
    const result = await queryDatabase(
      `
        SELECT COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'LOAI_THIETBI'
          AND COLUMN_NAME = 'DonViTinh';
      `
    );

    const enumStr = result[0]?.COLUMN_TYPE || ""; // lấy chuỗi enum

    const values = enumStr
      .replace(/^enum\(/, "")
      .replace(/\)$/, "")
      .split(/','/)
      .map((s) => s.replace(/^'/, "").replace(/'$/, ""));

    res.json({ message: "Thành công.", data: values });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/loai-thiet-bi", async (req, res) => {
  try {
    const result = await queryDatabase(
      `
        SELECT *
        FROM LOAI_THIETBI
        `
    );

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/api/insert/loai-thiet-bi",
  verifyToken,
  checkManager,
  async (req, res) => {
    const { rows } = req.body;

    console.log(rows);
    // res.json({ message: "Thành công." });

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để thêm." });
    }

    const values = [];
    for (const row of rows) {
      const {
        TenLoai,
        ThongSoKyThuat,
        DonViTinh,
        XuatXu,
        NamSanXuat,
        NgayNhapKho,
        MaCanBo,
        GiaNhap,
        SoLuong,
      } = row;

      values.push([
        TenLoai,
        ThongSoKyThuat,
        typeof DonViTinh === "object" ? DonViTinh.value : DonViTinh,
        XuatXu,
        NamSanXuat,
        NgayNhapKho,
        MaCanBo,
        GiaNhap,
        SoLuong,
      ]);
    }

    try {
      // Tạo dấu ? động theo số lượng dòng
      const placeholders = values
        .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .join(", ");

      await queryDatabase(
        `
          SET time_zone = '+07:00';
          INSERT INTO LOAI_THIETBI
          (TenLoai, ThongSoKyThuat, DonViTinh, XuatXu, NamSanXuat, NgayNhapKho, MaCanBo, GiaNhap, SoLuong)
          VALUES ${placeholders}
        `,
        values.flat()
      );

      res.json({ message: "Thêm thành công tất cả dòng." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/api/update/loai-thiet-bi",
  verifyToken,
  checkManager,
  async (req, res) => {
    const {
      MaLoai,
      TenLoai,
      ThongSoKyThuat,
      DonViTinh,
      XuatXu,
      NamSanXuat,
      NgayNhapKho,
      MaCanBo,
      GiaNhap,
      SoLuong,
    } = req.body;

    try {
      await queryDatabase(
        `
            SET time_zone = '+07:00';
            UPDATE LOAI_THIETBI
            SET
                TenLoai = ?,
                ThongSoKyThuat = ?,
                DonViTinh = ?,
                XuatXu = ?,
                NamSanXuat = ?,
                NgayNhapKho = ?,
                MaCanBo = ?,
                GiaNhap = ?,
                SoLuong = ?
            WHERE MaLoai = ?
        `,
        [
          TenLoai,
          ThongSoKyThuat,
          DonViTinh,
          XuatXu,
          NamSanXuat,
          NgayNhapKho,
          MaCanBo,
          GiaNhap,
          SoLuong,
          MaLoai,
        ]
      );

      res.json({ message: "Cập nhật thành công." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/api/delete/loai-thiet-bi",
  verifyToken,
  checkManager,
  async (req, res) => {
    const [...delRows] = req.body;

    if (!Array.isArray(delRows) || delRows.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách mã học phần không hợp lệ" });
    }

    try {
      const placeholders = delRows.map(() => "?").join(", ");
      const sql = `DELETE FROM LOAI_THIETBI WHERE MaLoai IN (${placeholders})`;

      await queryDatabase(sql, delRows);

      res.json({ message: "Xóa thành công." });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error.message);
    }
  }
);

// ======= thiết bị ======= //

router.get("/api/select/phong", async (req, res) => {
  try {
    const result = await queryDatabase(`
          SELECT MaPhong, TenPhong
          FROM PHONG
        `);

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/trang-thai-thiet-bi", async (req, res) => {
  try {
    const result = await queryDatabase(
      `
        SELECT COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'THIETBI'
          AND COLUMN_NAME = 'TrangThai';
      `
    );

    const enumStr = result[0]?.COLUMN_TYPE || ""; // lấy chuỗi enum

    const values = enumStr
      .replace(/^enum\(/, "")
      .replace(/\)$/, "")
      .split(/','/)
      .map((s) => s.replace(/^'/, "").replace(/'$/, ""));

    res.json({ message: "Thành công.", data: values });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/thiet-bi", async (req, res) => {
  const { MaPhong, TrangThai } = req.query;

  try {
    let sql = `
            SELECT tb.MaThietBi, ltb.MaLoai, ltb.TenLoai, tb.TrangThai, tb.ViTriHienTai, tb.GiaiTrinh
            FROM THIETBI tb
            LEFT JOIN LOAI_THIETBI ltb ON tb.MaLoai = ltb.MaLoai
            WHERE 1=1
        `;

    const params = [];

    if (
      TrangThai !== undefined &&
      TrangThai !== null &&
      TrangThai !== "" &&
      TrangThai !== "null"
    ) {
      sql += ` AND tb.TrangThai = ?`;
      params.push(TrangThai);
    }

    if (
      MaPhong === null ||
      MaPhong === "null" ||
      MaPhong === undefined ||
      MaPhong === ""
    ) {
      sql += ` AND tb.ViTriHienTai IS NULL`;
    } else {
      sql += ` AND tb.ViTriHienTai = ?`;
      params.push(MaPhong);
    }

    sql += ` ORDER BY tb.MaLoai ASC`;

    const resultTB = await queryDatabase(sql, params);

    res.json({ message: "Thành công.", data: resultTB });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/all-thiet-bi", async (req, res) => {
  const { MaPhong, TrangThai } = req.query;
  // console.log(">>> Query input:", { MaPhong, TrangThai });
  try {
    let sql = `
            SELECT tb.MaThietBi, ltb.MaLoai, ltb.TenLoai, tb.TrangThai, tb.ViTriHienTai, tb.GiaiTrinh
            FROM THIETBI tb
            LEFT JOIN LOAI_THIETBI ltb ON tb.MaLoai = ltb.MaLoai
            WHERE 1=1
        `;

    const params = [];

    if (
      TrangThai !== undefined &&
      TrangThai !== null &&
      TrangThai !== "" &&
      TrangThai !== "null"
    ) {
      sql += ` AND tb.TrangThai = ?`;
      params.push(TrangThai);
    }

    if (
      MaPhong !== undefined &&
      MaPhong !== null &&
      MaPhong !== "" &&
      MaPhong !== "null"
    ) {
      sql += ` AND tb.ViTriHienTai = ?`;
      params.push(MaPhong);
    }
    sql += ` ORDER BY tb.MaLoai ASC`;

    const resultTB = await queryDatabase(sql, params);

    res.json({ message: "Thành công.", data: resultTB });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put(
  "/api/update/thiet-bi",
  verifyToken,
  checkManager,
  async (req, res) => {
    const { MaThietBi, MaLoai, TrangThai, ViTriHienTai, GiaiTrinh } = req.body;

    console.log({ MaThietBi, MaLoai, TrangThai, ViTriHienTai, GiaiTrinh });

    try {
      await queryDatabase(
        `
                    SET @MaCanBo = ?;
                    SET time_zone = '+07:00';
                    UPDATE THIETBI
                    SET TrangThai = ?, ViTriHienTai = ?, GiaiTrinh = ?
                    WHERE MaThietBi = ? AND MaLoai = ?`,
        [req.user.id, TrangThai, ViTriHienTai, GiaiTrinh, MaThietBi, MaLoai]
      );

      res.json({ message: "Cập nhật thành công." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/api/update/nhieu-thiet-bi",
  verifyToken,
  checkManager,
  async (req, res) => {
    const thietBis = req.body;
    console.log(thietBis);

    if (!Array.isArray(thietBis) || thietBis.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách thiết bị không hợp lệ." });
    }

    try {
      for (const item of thietBis) {
        const { MaThietBi, MaLoai, TrangThai, ViTriHienTai, GiaiTrinh } = item;

        await queryDatabase(
          `
                    SET @MaCanBo = ?;
                    SET time_zone = '+07:00';
                    UPDATE THIETBI
                    SET TrangThai = ?, ViTriHienTai = ?, GiaiTrinh = ?
                    WHERE MaThietBi = ? AND MaLoai = ?`,
          [req.user.id, TrangThai, ViTriHienTai, GiaiTrinh, MaThietBi, MaLoai]
        );
      }

      res.json({ message: "Cập nhật danh sách thiết bị thành công." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/api/select/thiet-bi/lich-su", async (req, res) => {
  try {
    const result = await queryDatabase(
      `
                SELECT ls.*, ltb.TenLoai, cb.TenCanBo FROM LICH_SU_THAY_DOI_THIETBI ls
                LEFT JOIN LOAI_THIETBI ltb ON ltb.MaLoai = ls.MaLoai
                LEFT JOIN CANBO cb ON cb.MaCanBo = ls.MaCanBo
        `
    );

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});
router.post("/api/insert/danh-sach-thanh-ly", verifyToken, async (req, res) => {
  const rows = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.json({ message: "Danh sách rỗng", data: [] });
  }

  try {
    // 1. Tạo phiếu thanh lý và lấy MaThanhLy vừa tạo
    const insertThanhLy = await queryDatabase(
      `
        SET time_zone = '+07:00';
        INSERT INTO THANHLY_THIETBI (NgayDeXuat, MaCanBo, GiaBan) VALUES (CURDATE(), ?, 0.00)
      `,
      [req.user.id]
    );
    const maThanhLy = insertThanhLy.insertId;

    // 2. Chèn danh sách thiết bị vào bảng DANHSACH_THANHLY_THIETBI
    const placeholders = rows.map(() => `(?, ?, ?)`).join(", ");
    const values = rows.flatMap((row) => [
      maThanhLy,
      row.MaThietBi,
      row.MaLoai,
    ]);

    await queryDatabase(
      `
        SET time_zone = '+07:00';
        INSERT INTO DANHSACH_THANHLY_THIETBI (MaThanhLy, MaThietBi, MaLoai)
        VALUES ${placeholders}
      `,
      values
    );

    // 3. Trả về danh sách thiết bị đã chọn
    const whereClause = rows
      .map(() => "(MaThietBi = ? AND MaLoai = ?)")
      .join(" OR ");
    const whereValues = rows.flatMap((row) => [row.MaThietBi, row.MaLoai]);

    const result = await queryDatabase(
      `SELECT * FROM THIETBI WHERE ${whereClause}`,
      whereValues
    );

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// ------- note -------- //

router.get("/api/select/note", verifyToken, async (req, res) => {
  const { MaPhong, Ngay } = req.query;
  try {
    const [result] = await queryDatabase(
      `
            SELECT * FROM Note
            WHERE MaPhong = ?
            AND Ngay = ?;
    `,
      [MaPhong, Ngay]
    );

    res.json({ message: "Done.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/api/save/note", verifyToken, async (req, res) => {
  const { MaPhong, Ngay, GhiChu } = req.body;

  try {
    await queryDatabase(
      `
        SET time_zone = '+07:00';
        INSERT INTO Note (MaPhong, Ngay, GhiChu)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE GhiChu = VALUES(GhiChu);
      `,
      [MaPhong, Ngay, GhiChu]
    );

    res.json({ message: "Lưu ghi chú thành công." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// ------- end note -------- //
// ------- văn bản -------- //
router.get("/api/select/van-ban", verifyToken, async (req, res) => {
  try {
    const [result] = await queryDatabase(
      `
        SELECT tltb.*, cb.TenCanBo
        FROM THANHLY_THIETBI tltb
        LEFT JOIN CANBO cb ON tltb.MaCanBo = cb.MaCanBo
        WHERE tltb.MaCanBo = ?
    `,
      [req.user.id]
    );

    res.json({ message: "Done.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/danh-sach-thanh-ly", verifyToken, async (req, res) => {
  const { MaThanhLy } = req.query;
  try {
    const result = await queryDatabase(
      `
        SELECT tltb.*, cb.TenCanBo, ltb.TenLoai, dtt.MaThietBi, dtt.MaLoai, dtt.Gia
        FROM THANHLY_THIETBI tltb 
        LEFT JOIN DANHSACH_THANHLY_THIETBI dtt ON tltb.MaThanhLy = dtt.MaThanhLy
        LEFT JOIN CANBO cb ON tltb.MaCanBo = cb.MaCanBo
        LEFT JOIN LOAI_THIETBI ltb ON ltb.MaLoai = dtt.MaLoai
        WHERE tltb.MaThanhLy = ? AND tltb.MaCanBo = ? ;
            `,
      [MaThanhLy, req.user.id]
    );

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/select/danh-sach-thanh-ly-van-ban", verifyToken, async (req, res) => {
  const { MaThanhLy } = req.query;
  try {
    const result = await queryDatabase(
      `
        SELECT tltb.*, cb.TenCanBo, ltb.TenLoai, ltb.DonViTinh, dtt.MaThietBi, dtt.MaLoai, dtt.Gia
        FROM THANHLY_THIETBI tltb 
        LEFT JOIN DANHSACH_THANHLY_THIETBI dtt ON tltb.MaThanhLy = dtt.MaThanhLy
        LEFT JOIN CANBO cb ON tltb.MaCanBo = cb.MaCanBo
        LEFT JOIN LOAI_THIETBI ltb ON ltb.MaLoai = dtt.MaLoai
        WHERE tltb.MaThanhLy = ? AND tltb.MaCanBo = ? ;
            `,
      [MaThanhLy, req.user.id]
    );

    res.json({ message: "Thành công.", data: result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.put("/api/update/danh-sach-thanh-ly", verifyToken, async (req, res) => {
  const rows = req.body;

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "Danh sách cập nhật không hợp lệ." });
  }

  console.log("Cập nhật danh sách thanh lý:", rows);

  try {
    for (const row of rows) {
      const { MaThanhLy, MaThietBi, MaLoai, Gia } = row;
      if (!MaThanhLy || !MaThietBi || !MaLoai || Gia === undefined) {
        return res.status(400).json({ message: "Thiếu thông tin cập nhật." });
      }
      await queryDatabase(
        `
          UPDATE DANHSACH_THANHLY_THIETBI
          SET Gia = ?
          WHERE MaThanhLy = ? AND MaThietBi = ? AND MaLoai = ?
        `,
        [Gia, MaThanhLy, MaThietBi, MaLoai]
      );
    }

    res.json({ message: "Cập nhật thành công." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
