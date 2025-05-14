import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../access/css/loaiThietBiPage.css";
import API_BASE_URL from "./base/config.js";
import {
  InputChange,
  InputSearchSelectShow,
  InputSelect
} from "./base/formContainer.js";
import { LoaderPage } from "./base/LoaderForm.js";

const columns = [
  { label: "Số loại TB", key: "MaThietBi", type: "center", disable: true },
  { label: "Tên thiết bị", key: "TenLoai", type: "left", disable: true },
  { label: "Trạng thái", key: "TrangThai", type: "left", disable: false },
  { label: "Vị trí hiện tại", key: "ViTriHienTai", type: "left", disable: false },
  { label: "Giải trình", key: "GiaiTrinh", type: "left", disable: false },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ThietBiPage() {
  const query = useQuery();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elementLoading, setElementLoading] = useState(false);
  const [phong, setPhong] = useState([]);
  const [trangThai, setTrangThai] = useState([]);
  const [showCheck, setShowCheck] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const fetchTable = async () => {
    const MaPhong = query.get("MaPhong");
    const TrangThai = query.get("TrangThai");
    try {
      const res = await fetch(`${API_BASE_URL}/api/select/thiet-bi?MaPhong=${MaPhong}&TrangThai=${TrangThai}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setData(result.data);
        console.log(result.data);
      } else {
        throw new Error("unauthorized");
      }
    } catch (error) {
      if (error.message === "unauthorized") {
        // window.location.href = "/login";
        console.log(error.message);
        // Chuyển hướng đến trang đăng nhập
      } else {
        console.error("Lỗi tải dữ liệu:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/select/phong`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setPhong(result.data);
      } else {
        throw new Error("unauthorized");
      }
    } catch (error) {
      if (error.message === "unauthorized") {
      } else {
        console.error("Lỗi tải dữ liệu:", error.message);
      }
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/select/trang-thai-thiet-bi`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setTrangThai(result.data);
      } else {
        throw new Error("unauthorized");
      }
    } catch (error) {
      if (error.message === "unauthorized") {
        window.location.href = "/login";
      } else {
        console.error("Lỗi tải dữ liệu:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchTable();
  }, []);

  const handleUpdate = async (rowIndex, keys, newValues) => {
    setElementLoading(true);
    const row = data[rowIndex];

    // Cập nhật đồng thời nhiều giá trị
    const updatedRow = { ...row };

    keys.forEach((key, index) => {
      updatedRow[key] = newValues[index];
    });

    // Gửi API cập nhật
    try {
      const res = await fetch(`${API_BASE_URL}/api/update/thiet-bi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...updatedRow }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Cập nhật thất bại");

      toast.success(result.message);
      const newData = [...data];
      newData[rowIndex] = updatedRow;
      setData(newData);
    } catch (error) {
      console.error("Lỗi cập nhật:", error.message);
      setLoading(true);
      toast.error(error.message);
    } finally {
      fetchTable();
      setElementLoading(false);
    }
  };

  return (
    <div className="page-container thp-container">
      {loading && <LoaderPage />}
      {!loading && (
        <>
          <div id="box_tools_container">
            <div></div>
            <div className="box_tools">
              
            </div>
          </div>
          <div id="box_table_container" 
          style={{ overflow: "visible" }}
            >
            <h2>Bảng thông tin về Loại Thiết Bị</h2>
            <table>
              <thead>
                <tr>
                  {showCheck && <th></th>}
                  {columns.map((col, idx) => (
                    <th key={idx} className={col.type}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {showCheck && (
                      <td
                        style={{
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{ cursor: "pointer" }}
                          checked={selectedRows.includes(row.MaLoai)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedRows((prev) => {
                              if (isChecked) {
                                return [...prev, row.MaLoai];
                              } else {
                                return prev.filter((id) => id !== row.MaLoai);
                              }
                            });
                          }}
                        />
                      </td>
                    )}
                    {columns.map((col, colIndex) => {
                      // Render riêng cho TenCanBo (từ MaCanBoTruong)
                      if (col.key === "ViTriHienTai") {
                        // Tìm TenCanBo từ MaCanBoTruong
                        const current = phong.find(
                          (p) => p.MaPhong === row.ViTriHienTai
                        );
                        const currentTen = current?.MaPhong || "";

                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSearchSelectShow
                              keyShow="MaPhong"
                              keyList="MaPhong"
                              value={currentTen}
                              list={phong}
                              onChange={(selected) => {
                                if (selected) {
                                  handleUpdate(
                                    rowIndex,
                                    ["ViTriHienTai"],
                                    [selected.MaPhong]
                                  );
                                }
                              }}
                            />
                          </td>
                        );
                      }

                      if (col.key === "TrangThai") {
                        const current = trangThai.find(
                          (dvt) => dvt === row.TrangThai
                        );
                        const currentTen = current || "";

                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSelect
                              value={currentTen}
                              list={trangThai.map((dvt) => dvt)}
                              onChange={(selectedTen) => {
                                const selected = trangThai.find(
                                  (dvt) => dvt === selectedTen
                                );
                                if (selected) {
                                  handleUpdate(
                                    rowIndex,
                                    ["TrangThai"],
                                    [selected]
                                  );
                                }
                              }}
                            />
                          </td>
                        );
                      }

                      // Các cột còn lại vẫn là InputChange
                      return (
                        <td key={colIndex} className={col.type}>
                          <InputChange
                            value={row[col.key]}
                            disabled={col.disable}
                            onChange={(newVal) =>
                              handleUpdate(rowIndex, [col.key], [newVal])
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
