import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../access/css/loaiThietBiPage.css";
import "../access/css/thietBiPage.css";
import API_BASE_URL from "./base/config.js";
import {
  InputChange,
  InputSearchSelectShow,
  InputSelect,
} from "./base/formContainer.js";
import { LoaderPage, Loader } from "./base/LoaderForm.js";

const columns = [
  { label: "Số loại TB", key: "MaThietBi", type: "center", disable: true },
  { label: "Tên thiết bị", key: "TenLoai", type: "left", disable: true },
  { label: "Trạng thái", key: "TrangThai", type: "left", disable: false },
  {
    label: "Vị trí hiện tại",
    key: "ViTriHienTai",
    type: "left",
    disable: false,
  },
  { label: "Giải trình", key: "GiaiTrinh", type: "left", disable: false },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ThietBiTrongPhongPage() {
  const query = useQuery();

  const editorRef = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [elementLoading, setElementLoading] = useState(false);
  const [phong, setPhong] = useState([]);
  const [trangThai, setTrangThai] = useState([]);
  const [showCheck, setShowCheck] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [filterDate, setFilterDate] = useState(false);
  const [noteData, setNoteData] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);

  const fetchTable = async () => {
    const MaPhong = query.get("MaPhong");
    const TrangThai = query.get("TrangThai");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/select/thiet-bi?MaPhong=${MaPhong}&TrangThai=${TrangThai}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

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
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setFilterDate(`${yyyy}-${mm}-${dd}`);
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

  const handleBatchUpdate = async (newViTriHienTai) => {
    if (selectedRows.length === 0) return;

    setElementLoading(true);

    try {
      const payload = data
        .filter((row) =>
          selectedRows.some(
            (sel) =>
              sel.MaThietBi === row.MaThietBi && sel.MaLoai === row.MaLoai
          )
        )
        .map((row) => ({
          MaThietBi: row.MaThietBi,
          MaLoai: row.MaLoai,
          TrangThai: row.TrangThai,
          ViTriHienTai: newViTriHienTai,
          GiaiTrinh: row.GiaiTrinh || "",
        }));

      const res = await fetch(`${API_BASE_URL}/api/update/nhieu-thiet-bi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi cập nhật");

      toast.success("Cập nhật vị trí hàng loạt thành công.");
      fetchTable();
    } catch (error) {
      console.error("Lỗi cập nhật hàng loạt:", error.message);
      toast.error(error.message);
    } finally {
      setElementLoading(false);
    }
  };

  const handleGetNote = async () => {
    try {
      const MaPhong = query.get("MaPhong");
      const res = await fetch(
        `${API_BASE_URL}/api/select/note?MaPhong=${MaPhong}&Ngay=${filterDate}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi.");

      setNoteData(result.data);
    } catch (error) {
      console.error("Lỗi:", error.message);
      toast.error(error.message);
    } finally {
      setElementLoading(false);
    }
  };

  const handleNoteSave = async () => {
    const MaPhong = query.get("MaPhong");
    let newContent = editorRef.current.innerText;
    newContent = newContent === "Viết nội dung tại đây..." ? NULL : newContent;
    try {
      const res = await fetch(`${API_BASE_URL}/api/save/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ MaPhong, Ngay: filterDate, GhiChu: newContent }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi.");

      toast.success(result.message);
    } catch (error) {
      console.error("Lỗi:", error.message);
      toast.error(error.message);
    } finally {
      setElementLoading(false);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML =
        noteData?.GhiChu || "Viết nội dung tại đây...";
    }
  }, [noteData]);

  useEffect(() => {
    if (filterDate) {
      handleGetNote();
    }
  }, [filterDate]);

  useEffect(() => {
    if (showNote || showEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showNote, showEdit]);

  return (
    <div className="page-container thp-container tb-container">
      {loading && <LoaderPage />}
      {!loading && (
        <>
          <div className={`box_note ${showNote ? "active" : ""}`}>
            <div className="box_note-btn">
              <div className="btn">
                <button
                  title="Đóng"
                  className="btnCancel"
                  onClick={() => {
                    setShowNote(false);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                  </svg>
                </button>
                <button
                  title="Lưu"
                  className="btnSave"
                  onClick={() => {
                    setShowNote(false);
                    handleNoteSave();
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z"></path>
                  </svg>
                </button>
              </div>

              <div className="box_note-filter">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                  }}
                  placeholder="Chọn ngày"
                  className="input-date"
                />
              </div>
            </div>
            <div className="box_note-main">
              <div
                id="box_note-editor"
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="box_note-editor-area"
              >
                {noteData && noteData.GhiChu
                  ? noteData.GhiChu
                  : "Viết nội dung tại đây..."}
              </div>
            </div>
          </div>
          {showEdit && (
            <div className="box-show-edit">
              <div className="box-show-edit-title">
                <div className="box-show-edit-btn">
                  {/* <button
                    title="OK"
                    onClick={() => {
                      // setShowEdit(true);
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
                  </button> */}

                  <button
                    title="Hủy"
                    className="btnCancel"
                    onClick={() => {
                      setShowEdit(false);
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
                </div>
                <h2>Sửa hàng loạt</h2>
                <div className="box-show-edit-content">
                  <span>Vị trí hiện tại: </span>
                  <InputSearchSelectShow
                    keyShow="MaPhong"
                    keyList="MaPhong"
                    value={""}
                    list={phong}
                    onChange={(selected) => {
                      if (selected) {
                        handleBatchUpdate(selected.MaPhong);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div id="box_tools_container">
            <div></div>
            <div className="box_tools">
              <div className={`box_tools-style box_tools-add`}>
                {!showCheck ? (
                  <>
                    <button
                      title="Sửa nhiều dòng"
                      onClick={() => {
                        setShowCheck((prev) => !prev);
                      }}
                      className="btnAdd"
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"></path>
                        </svg>
                      )}
                    </button>
                    <button
                      title="ghi chú"
                      onClick={() => {
                        setShowNote((prev) => !prev);
                        handleGetNote();
                      }}
                      className="btnAdd"
                      disabled={elementLoading}
                    >
                      {elementLoading ? (
                        <Loader />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
                          <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
                        </svg>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      title="OK"
                      onClick={() => {
                        if (selectedRows.length === 0) {
                          alert("Vui lòng chọn ít nhất một thiết bị để sửa.");
                        } else {
                          setShowEdit(true);
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
                        setShowCheck(false);
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
          <div id="box_table_container" style={{ overflow: "visible" }}>
            <h2>
              Bảng thông tin về Loại Thiết Bị phòng {query.get("MaPhong")}
            </h2>
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
                          style={{
                            cursor: "pointer",
                          }}
                          checked={selectedRows.some(
                            (item) =>
                              item.MaThietBi === row.MaThietBi &&
                              item.MaLoai === row.MaLoai
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            setSelectedRows((prev) => {
                              if (isChecked) {
                                return [
                                  ...prev,
                                  {
                                    MaThietBi: row.MaThietBi,
                                    MaLoai: row.MaLoai,
                                  },
                                ];
                              } else {
                                return prev.filter(
                                  (item) =>
                                    item.MaThietBi !== row.MaThietBi ||
                                    item.MaLoai !== row.MaLoai
                                );
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

                        // Chỉ lấy các trạng thái theo thứ tự yêu cầu
                        const allowedTrangThai = [
                          "Kho",
                          "Đang sử dụng",
                          "Chờ bảo dưỡng",
                          "Hỏng",
                        ];
                        return (
                          <td key={colIndex} className={col.type}>
                            <InputSelect
                              value={currentTen}
                              list={allowedTrangThai}
                              onChange={(selectedTen) => {
                                const selected = allowedTrangThai.find(
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
