import React, { useEffect, useState } from "react";
import { Loader, LoaderPage } from "./base/LoaderForm";
import API_BASE_URL from "./base/config";

import "../access/css/danhSachVanBanPage.css";

const columns = [
  { label: "Mã thanh lý", key: "MaThanhLy", type: "center", disable: true },
  { label: "Ngày đề xuất", key: "NgayDeXuat", type: "left", disable: true },
  { label: "Lý do", key: "LyDo", type: "left", disable: false },
  { label: "Ngày thanh lý", key: "NgayThanhLy", type: "left", disable: false },
  { label: "Mã cán bộ", key: "MaCanBo", type: "left", disable: false },
  { label: "Giá bán", key: "GiaBan", type: "left", disable: false },
];

export default function DanhSachVanBanPage() {
  const [vanBanList, setVanBanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/select/van-ban`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await res.json();
      let data = result.data;
      if (data && !Array.isArray(data)) {
        data = [data];
      }
      // Format NgayDeXuat to dd-MM-yyyy
      const formattedData = (Array.isArray(data) ? data : []).map((item) => ({
        ...item,
        NgayDeXuat: item.NgayDeXuat
          ? new Date(item.NgayDeXuat).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "",
      }));
      setVanBanList(formattedData);
    } catch (error) {
      setVanBanList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [openRow, setOpenRow] = useState(null);

  if (loading) return <LoaderPage />;

  const handleCheckboxChange = (row, isChecked) => {
    setSelectedRows((prev) => {
      if (isChecked) {
        return [...prev, row];
      } else {
        return prev.filter((item) => item.MaThanhLy !== row.MaThanhLy);
      }
    });
  };

  function DanhSachThietBi({ maThanhLy }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      setLoading(true);
      fetch(
        `${API_BASE_URL}/api/select/danh-sach-thanh-ly?MaThanhLy=${maThanhLy}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((result) => {
          let d = result.data;
          if (d && !Array.isArray(d)) d = [d];
          setData(Array.isArray(d) ? d : []);
        })
        .catch(() => setData([]))
        .finally(() => setLoading(false));
    }, [maThanhLy]);

    const handleGiaChange = (idx, value) => {
      setData((prev) =>
        prev.map((item, i) => (i === idx ? { ...item, Gia: value } : item))
      );
    };

    const handleSave = async () => {
      setSaving(true);
      try {
        await fetch(`${API_BASE_URL}/api/update/danh-sach-thanh-ly`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(
            data.map(tb => ({
              MaThanhLy: maThanhLy,
              MaThietBi: tb.MaThietBi,
              MaLoai: tb.MaLoai,
              Gia: tb.Gia,
            }))
          ),
        });

        await fetchData();
        toast.success("Lưu thành công!");
      } catch (err) {
        toast.error("Có lỗi khi lưu.");
      } finally {
        setSaving(false);
      }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!data.length) return <div>Không có thiết bị.</div>;

    return (
      <div className="table_more">
        <table className="thiet-bi-table">
          <thead>
            <tr>
              <th>Mã Thiết Bị</th>
              <th>Tên Loại</th>
              <th>Giá</th>
              <th>Tên Cán Bộ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tb, idx) => (
              <tr key={tb.MaThietBi || idx}>
                <td>{tb.MaThietBi}</td>
                <td>{tb.TenLoai}</td>
                <td>
                  <input
                    type="number"
                    value={tb.Gia || ""}
                    onChange={(e) => handleGiaChange(idx, e.target.value)}
                    style={{
                      width: 100,
                      border: "none",
                      padding: ".1625rem .375rem",
                      borderBottom: "1px solid #ccc",
                      background: "transparent",
                    }}
                  />
                </td>
                <td>{tb.TenCanBo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btn">
          <button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader /> : "Lưu"}
          </button>
          <button>Mở</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container danh-sach-van-ban">
      {loading ? (
        <LoaderPage />
      ) : (
        <div id="box_table_container">
          <h2>Danh Sách Văn Bản</h2>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.type}>
                    {col.label}
                  </th>
                ))}
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {vanBanList.map((vb, idx) => (
                <React.Fragment key={vb.MaThanhLy || idx}>
                  <tr>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() =>
                          setOpenRow(
                            openRow === vb.MaThanhLy ? null : vb.MaThanhLy
                          )
                        }
                      >
                        {openRow === vb.MaThanhLy ? "Đóng" : "Xem"}
                      </button>
                    </td>
                  </tr>
                  {openRow === vb.MaThanhLy && (
                    <tr>
                      <td colSpan={columns.length + 1}>
                        <DanhSachThietBi maThanhLy={vb.MaThanhLy} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
