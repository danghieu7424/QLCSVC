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
            `,
      []
    );

    const rawResult_n = await queryDatabase(
      `
                SELECT MaNganh, TenNganh FROM NGANH;
            `,
      []
    );

    const rawResult_k = await queryDatabase(
      `
                SELECT MaKhoa, TenKhoa FROM KHOA;
            `,
      []
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
      const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");

      await queryDatabase(
        `
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
        return res.status(400).json({ message: "Danh sách mã học phần không hợp lệ" });
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

module.exports = router;
