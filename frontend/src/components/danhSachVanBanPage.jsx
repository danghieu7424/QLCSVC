import React, { useEffect, useState } from "react";
import { LoaderPage } from "./base/LoaderForm";
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

  useEffect(() => {
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
    fetchData();
  }, []);

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
                <>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.type}>
                        {vb[col.key]}
                      </td>
                    ))}
                    <td>
                      <button
                        onClick={() => alert(`Xem văn bản ${vb.MaThanhLy}`)}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
