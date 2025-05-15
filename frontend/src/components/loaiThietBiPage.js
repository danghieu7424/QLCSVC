import React, { useEffect, useState } from "react";
import "../access/css/loaiThietBiPage.css";
import API_BASE_URL from "./base/config.js";
import {
  InputChange,
  InputSearchSelect,
  InputSearchSelectShow,
  InputSelect,
} from "./base/formContainer.js";
import { LoaderPage, Loader } from "./base/LoaderForm";

const columns = [
  { label: "Mã Loại", key: "MaLoai", type: "center" },
  { label: "Tên Loại", key: "TenLoai", type: "left" },
  { label: "Thông số kỹ thuật", key: "ThongSoKyThuat", type: "left" },
  { label: "Đơn vị tính", key: "DonViTinh", type: "center" },
  { label: "Xuất Xứ", key: "XuatXu", type: "left" },
  { label: "Năm sản xuất", key: "NamSanXuat", type: "center" },
  { label: "Ngày nhập kho", key: "NgayNhapKho", type: "left" },
  { label: "Cán bộ mua", key: "TenCanBo", type: "left" },
  { label: "Giá nhập", key: "GiaNhap", type: "right" },
  { label: "Số lượng", key: "SoLuong", type: "right" },
];

export default function LoaiThietBiPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elementLoading, setElementLoading] = useState(false);
  const [canBo, setCanBo] = useState([]);
  const [nganh, setNganh] = useState([]);
  const [donViTinh, setDonViTinh] = useState([]);
  const [addShow, setAddShow] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [addRow, setAddRow] = useState({
    MaLoai: "",
    TenLoai: "",
    ThongSoKyThuat: "",
    DonViTinh: "",
    XuatXu: "",
    NamSanXuat: "",
    NgayNhapKho: "",
    MaCanBo: "",
    GiaNhap: "",
    SoLuong: "",
  });
  const [addRows, setAddRows] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  const fetchTable = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/select/loai-thiet-bi`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setData(result.data);
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
      const res = await fetch(`${API_BASE_URL}/api/select/data`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await res.json();

      if (Array.isArray(result.CanBo) && Array.isArray(result.Nganh)) {
        setCanBo(result.CanBo);
        setNganh(result.Nganh);
        // console.log(result)
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
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/select/don-vi-tinh-loai-thiet-bi`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (Array.isArray(result.data)) {
        setDonViTinh(result.data);
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
      const res = await fetch(`${API_BASE_URL}/api/update/loai-thiet-bi`, {
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

  const resetUpdate = () => {
    setAddRows([]);
  };

  const handleAdd = async () => {
    setElementLoading(true);
    try {
      const filteredRows = addRows.filter((row) =>
        Object.values(row).some((v) => v)
      );

      if (filteredRows.length === 0) {
        toast.warning("Không có dòng nào để lưu.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/insert/loai-thiet-bi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rows: filteredRows }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Lưu không thành công.");

      resetUpdate(); // reset input
      toast.success(result.message || "Đã thêm tất cả dòng.");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      fetchTable();
      setElementLoading(false);
    }
  };

  const handleAddRows = () => {
    setAddRows((prev) => [...prev, {}]); // thêm dòng rỗng
  };

  useEffect(() => {}, [addRow]);

  const handleDel = async () => {
    setElementLoading(true);
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa các dòng đã chọn không?"
    );
    if (!confirmed) {
      setElementLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/delete/loai-thiet-bi`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify([...selectedRows]),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Xóa không thành công.");

      toast.success(result.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      fetchTable();
      setElementLoading(false);
    }
  };

  const classNameElement = () => {
    if (addShow) return " box_tools-add";
    if (showCheck) return " box_tools-del";
    return "";
  };

  return (
    <div className="page-container thp-container">
      {loading && <LoaderPage />}
      {!loading && (
        <>
          <div id="box_tools_container">
            <div></div>
            <div className="box_tools">
              <div className={`box_tools-style${classNameElement()}`}>
                {!(addShow || showCheck) ? (
                  <>
                    <button
                      title="Thêm"
                      onClick={() => {
                        setAddShow(true);
                        handleAddRows();
                      }}
                      className="btnAdd"
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                        </svg>
                      )}
                    </button>
                    <button
                      title="Xóa"
                      onClick={() => setShowCheck(true)}
                      className="btnDel"
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader width="20px" height="20px" color="#fff" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="M7 11h10v2H7z"></path>
                          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                        </svg>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {addShow && (
                      <button
                        title="Thêm dòng"
                        onClick={() => {
                          handleAddRows();
                        }}
                        className="btnAdd"
                        disabled={elementLoading}
                      >
                        {elementLoading ? (
                          <Loader width="20px" height="20px" color="#fff" />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      title="OK"
                      onClick={() => {
                        if (addShow) {
                          handleAdd();
                          setAddShow(false);
                        }
                        if (showCheck) {
                          handleDel();
                        }
                      }}
                      className="btnOK"
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader width="20px" height="20px" color="#fff" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                        </svg>
                      )}
                    </button>

                    <button
                      title="Hủy"
                      className="btnCancel"
                      onClick={() => {
                        if (addShow) {
                          resetUpdate();
                          setAddShow(false);
                        }
                        if (showCheck) {
                          setShowCheck(false);
                          setSelectedRows([]);
                        }
                      }}
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader width="20px" height="20px" color="#fff" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                        </svg>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div id="box_table_container">
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
                {addShow &&
                  addRows.map((row, rowIndex) => (
                    <tr key={`addRow-${rowIndex}`}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {col.key === "TenCanBo" ? (
                            <InputSearchSelect
                              keyShow="TenCanBo"
                              list={canBo}
                              onChange={(selected) =>
                                setAddRows((prev) =>
                                  prev.map((r, i) =>
                                    i === rowIndex
                                      ? { ...r, MaCanBo: selected.MaCanBo }
                                      : r
                                  )
                                )
                              }
                              inputStyle={{ minWidth: "10rem" }}
                            />
                          ) : col.key === "DonViTinh" ? (
                            <InputSearchSelect
                              keyShow="value"
                              list={donViTinh.map((item) => ({ value: item }))}
                              onChange={(selected) =>
                                setAddRows((prev) =>
                                  prev.map((r, i) =>
                                    i === rowIndex
                                      ? { ...r, DonViTinh: selected }
                                      : r
                                  )
                                )
                              }
                              inputStyle={{ minWidth: "7rem" }}
                            />
                          ) : (
                            <input
                              className="inputAdd"
                              value={row[col.key] || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setAddRows((prev) =>
                                  prev.map((r, i) =>
                                    i === rowIndex
                                      ? { ...r, [col.key]: value }
                                      : r
                                  )
                                );
                              }}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

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
                      if (col.key === "TenCanBo") {
                        // Tìm TenCanBo từ MaCanBoTruong
                        const currentCanBo = canBo.find(
                          (cb) => cb.MaCanBo === row.MaCanBo
                        );
                        const currentTenCanBo = currentCanBo?.TenCanBo || "";

                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSearchSelectShow
                              keyShow="TenCanBo"
                              keyList="MaTen"
                              value={currentTenCanBo}
                              list={canBo.map((cb) => ({
                                ...cb,
                                MaTen: `${cb.MaCanBo} - ${cb.TenCanBo}`,
                              }))}
                              onChange={(selected) => {
                                if (selected) {
                                  handleUpdate(
                                    rowIndex,
                                    ["MaCanBoTruong"],
                                    [selected.MaCanBo]
                                  );
                                }
                              }}
                            />
                          </td>
                        );
                      }
                      if (col.key === "TenNganh") {
                        const current = nganh.find(
                          (cb) => cb.MaNganh === row.MaNganh
                        );
                        const currentTen = current?.TenNganh || "";

                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSelect
                              value={currentTen}
                              list={nganh.map((n) => n.TenNganh)}
                              onChange={(selectedTen) => {
                                const selected = nganh.find(
                                  (n) => n.TenNganh === selectedTen
                                );
                                if (selected) {
                                  handleUpdate(
                                    rowIndex,
                                    ["MaNganh", "TenNganh"],
                                    [selected.MaNganh, selected.TenNganh]
                                  );
                                }
                              }}
                            />
                          </td>
                        );
                      }
                      if (col.key === "DonViTinh") {
                        const current = donViTinh.find(
                          (dvt) => dvt === row.DonViTinh
                        );
                        const currentTen = current || "";

                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSelect
                              value={currentTen}
                              list={donViTinh.map((dvt) => dvt)}
                              onChange={(selectedTen) => {
                                const selected = donViTinh.find(
                                  (dvt) => dvt === selectedTen
                                );
                                if (selected) {
                                  handleUpdate(
                                    rowIndex,
                                    ["DonViTinh"],
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
