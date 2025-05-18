import React, { useState, useRef, useEffect } from "react";
import "../access/css/doc.css";

export default function VanBanPage() {
  const [listData, setListData] = useState([]);

  const fetchListData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/select/danh-sach-thanh-ly`
      );

      const data = await response.json();
      if (response.ok) {
        setListData(data);
      } else {
        console.error("Error fetching data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const numberToWords = (num) => {
    const units = [
      "",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];
    const teens = [
      "mười",
      "mười một",
      "mười hai",
      "mười ba",
      "mười bốn",
      "mười lăm",
      "mười sáu",
      "mười bảy",
      "mười tám",
      "mười chín",
    ];
    const tens = [
      "",
      "",
      "hai mươi",
      "ba mươi",
      "bốn mươi",
      "năm mươi",
      "sáu mươi",
      "bảy mươi",
      "tám mươi",
      "chín mươi",
    ];
    const thousands = ["", "nghìn", "triệu", "tỷ"];

    if (num === 0) return "không";

    const chunkNumber = (n) => {
      let result = "";
      if (n >= 100) {
        result += units[Math.floor(n / 100)] + " trăm ";
        n %= 100;
      }
      if (n >= 10 && n < 20) {
        result += teens[n - 10] + " ";
      } else {
        if (n >= 20) {
          result += tens[Math.floor(n / 10)] + " ";
        }
        if (n % 10 > 0) {
          result += units[n % 10] + " ";
        }
      }
      return result.trim();
    };

    let parts = [];
    let unitIndex = 0;

    while (num > 0) {
      let chunk = num % 1000;
      if (chunk > 0) {
        parts.unshift(chunkNumber(chunk) + " " + thousands[unitIndex]);
      }
      num = Math.floor(num / 1000);
      unitIndex++;
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
  };

  return (
    <div className="page-container ">
      <div id="cursor-tools">
        <div className="font">
          <select name="" id="select-font">
            <option>Area</option>
            <option>Time New Roman</option>
          </select>
        </div>
        <div className="font-size">
          <input type="number" min="1"/>
        </div>
        <div className="font-color">
          <input type="color" id="font-color-input" />
          <label for="font-color-input"></label>
        </div>
        <div className="font-style">
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>
            </svg>
          </button>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>
            </svg>
          </button>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>
            </svg>
          </button>
        </div>
        <div className="font-margin">
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm0-4h11v2H4zm0-4h16v2H4zm0-8h16v2H4zm0 4h11v2H4z"></path>
            </svg>
          </button>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm3-4h10v2H7zm-3-4h16v2H4zm0-8h16v2H4zm3 4h10v2H7z"></path>
            </svg>
          </button>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z"></path>
            </svg>
          </button>
          <button>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 7h16v2H4zm0-4h16v2H4zm0 8h16v2H4zm0 4h16v2H4zm2 4h12v2H6z"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* <div className="tool">
                <div className="tool-functions">
                    <button
                        disabled={!showToolbar}
                        onClick={() => applyFormat("bold")}
                    >
                        <b>B</b>
                    </button>
                    <button
                        disabled={!showToolbar}
                        onClick={() => applyFormat("italic")}
                    >
                        <i>I</i>
                    </button>
                    <button
                        disabled={!showToolbar}
                        onClick={() => applyFormat("underline")}
                    >
                        <u>U</u>
                    </button>
                    <input
                        type="color"
                        onChange={(e) =>
                            applyFormat("foreColor", e.target.value)
                        }
                    />
                    <select
                        onChange={(e) =>
                            applyFormat("fontSize", e.target.value)
                        }
                    >
                        <option value="3">Bình thường</option>
                        <option value="1">Nhỏ</option>
                        <option value="5">Lớn</option>
                        <option value="7">Rất lớn</option>
                    </select>
                    <button onClick={() => applyFormat("justifyLeft")}>
                        <i className="bx bx-align-left"></i>
                    </button>
                    <button onClick={() => applyFormat("justifyCenter")}>
                        <i className="bx bx-align-middle"></i>
                    </button>
                    <button onClick={() => applyFormat("justifyRight")}>
                        <i className="bx bx-align-right"></i>
                    </button>
                    <button onClick={() => applyFormat("justifyFull")}>
                        <i className="bx bx-align-justify"></i>
                    </button>
                    <button onClick={insertTable}>
                        <i className="bx bx-table"></i> Thêm bảng
                    </button>
                </div>
                <div>
                    <button onClick={downloadAsWord}>📥 Tải xuống Word</button>
                    <button onClick={downloadAsPDF}>📄 Tải xuống PDF</button>
                    <button onClick={savePage}>Lưu trang</button>
                    <button onClick={handleExit}>Thoát</button>
                </div>
            </div>

            <div className="editor-container">
                {showToolbar && (
                    <div
                        ref={toolbarRef}
                        className="toolbar"
                        style={{
                            top: `${toolbarPosition.top}px`,
                            left: `${toolbarPosition.left}px`,
                        }}
                    >
                        <button onClick={() => applyFormat("bold")}>
                            <b>B</b>
                        </button>
                        <button onClick={() => applyFormat("italic")}>
                            <i>I</i>
                        </button>
                        <button onClick={() => applyFormat("underline")}>
                            <u>U</u>
                        </button>
                        <input
                            type="color"
                            onChange={(e) =>
                                applyFormat("foreColor", e.target.value)
                            }
                        />
                        <select
                            onChange={(e) =>
                                applyFormat("fontSize", e.target.value)
                            }
                        >
                            <option value="3">Bình thường</option>
                            <option value="1">Nhỏ</option>
                            <option value="5">Lớn</option>
                            <option value="7">Rất lớn</option>
                        </select>
                        <button onClick={() => applyFormat("justifyLeft")}>
                            <i className="bx bx-align-left"></i>
                        </button>
                        <button onClick={() => applyFormat("justifyCenter")}>
                            <i className="bx bx-align-middle"></i>
                        </button>
                        <button onClick={() => applyFormat("justifyRight")}>
                            <i className="bx bx-align-right"></i>
                        </button>
                        <button onClick={() => applyFormat("justifyFull")}>
                            <i className="bx bx-align-justify"></i>
                        </button>
                        <button onClick={insertTable}>
                            <i className="bx bx-table"></i> Thêm bảng
                        </button>
                        <button onClick={addRow}>
                            <i className="bx bx-plus"></i> Hàng
                        </button>
                        <button onClick={addColumn}>
                            <i className="bx bx-plus"></i> Cột
                        </button>
                        <button onClick={addNewRow}>
                            <i className="bx bx-plus"></i> Thêm hàng
                        </button>
                    </div>
                )}

                <div
                    ref={editorRef}
                    className="editor"
                    contentEditable
                    onMouseUp={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                    dangerouslySetInnerHTML={{
                        __html:
                            TenVanBan === "Tờ Trình" || TenVanBan === "Báo Cáo"
                                ? initialContent
                                : initialContentThanhLy,
                    }}
                ></div>
            </div> */}
    </div>
  );
}
