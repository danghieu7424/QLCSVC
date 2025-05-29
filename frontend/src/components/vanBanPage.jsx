import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "./base/config";
import "../access/css/doc.css";

export default function VanBanPage() {
  const [data, setData] = useState([]);
  const [listData, setListData] = useState([]);
  const editorRef = useRef(null);
  const cursorToolsRef = useRef(null);
  const [formatState, setFormatState] = useState({
    fontName: "",
    fontSize: "",
    foreColor: "#000000",
    isBold: false,
    isItalic: false,
    isUnderline: false,
    align: "left", // left | center | right | justify
  });
  const location = useLocation();
  const MaThanhLy = location.state?.MaThanhLy || "";
  const [TenVanBan, setTenVanBan] = useState("");

  const fetchListData = async (MaThanhLy) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/select/van-ban`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Gửi cookie chứa token
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Fetched data:", data);
        setData(data.data);
      } else {
        console.error("Error fetching data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/select/danh-sach-thanh-ly-van-ban?MaThanhLy=${MaThanhLy}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Gửi cookie chứa token
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Fetched list data:", data.data);
        setListData(data.data);
      } else {
        console.error("Error fetching data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchListData(MaThanhLy);
  }, [MaThanhLy]);

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

  const [initialContent, setInitialContent] = useState(`
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style=" text-align: center; border: none; background: transparent;">
              TRƯỜNG ĐẠI HỌC THÁI BÌNH<br>
              KHOA CÔNG NGHỆ & KỸ THUẬT
          </th>
          <th style=" text-align: center; border: none; background: transparent;">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
              Độc lập – Tự do – Hạnh phúc
          </th>
      </tr>
    </table>
  
    <h2 style="text-align: center; margin-top: 8px; margin-bottom: 8px;">${TenVanBan.toUpperCase()}</h2>
    <h4 style="text-align: center; margin-top: 8px; margin-bottom: 24px;">
      V/v sửa chữa các phòng thực hành máy tính phục vụ cho công tác giảng dạy, học tập và<br>
      phục vụ kỳ thi đánh giá năng lực của ĐH QGHN, kỳ thi đánh giá tư duy của ĐH BKHN.
    </h4>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2.2cm;">
    <b>Kính gửi:</b> <b>Ban Giám hiệu trường Đại học Thái Bình.</b>
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Căn cứ theo tình hình kiểm tra thực tế các phòng thực hành máy tính.
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Khoa Công nghệ & Kỹ thuật xin trình lên Ban Giám hiệu dự trù sửa chữa, thay thế các thiết bị cho các phòng thực hành máy tính, cụ thể như sau:
    </p>
  
    <table id="table-request" border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    <tr>
      <th style="">STT</th>
      <th style="">Tên thiết bị - Thông số kỹ thuật</th>
      <th style="">ĐVT</th>
      <th style="">Số lượng</th>
      <th style="">Đơn giá</th>
      <th style="">Thành tiền</th>
    </tr>
    
    <tr>
      <td style=" text-align: center;">1</td>
      <td style=""></td>
      <td style=" text-align: center;"></td>
      <td style=" text-align: center;"></td>
      <td style=" text-align: center;">đ</td>
      <td style=" text-align: center;">đ</td>
    </tr>
  
    <tr>
      <td colspan="5" style=" text-align: center;"><b>Tổng cộng:</b></td>
      <td style=" text-align: center;"><b> đ</b></td>
    </tr>
    <tr>
      <td colspan="6" style=" text-align: center;"><b>Bằng chữ:</b></td>
    </tr>
  </table>
  
  
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;"><i>Ghi chú: Đơn giá trên chưa bao gồm thuế VAT.</i></p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;">Kính mong nhận được sự chấp thuận từ Ban Giám hiệu nhà trường.</p>
    <p style="text-align: right; margin-top: 8px; margin-bottom: 16px;">Ngày ... tháng ... năm 20...</p>
  
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG ĐƠN VỊ
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG NGÀNH
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              NGƯỜI ĐỀ XUẤT
          </th>
      </tr>
      <tr>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
      </tr>
    </table>
  `);
  const [initialContentThanhLy, setInitialContentThanhLy] = useState(`
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style=" text-align: center; border: none; background: transparent;">
              TRƯỜNG ĐẠI HỌC THÁI BÌNH<br>
              KHOA CÔNG NGHỆ & KỸ THUẬT
          </th>
          <th style=" text-align: center; border: none; background: transparent;">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
              Độc lập – Tự do – Hạnh phúc
          </th>
      </tr>
    </table>
  
    <h2 style="text-align: center; margin-top: 8px; margin-bottom: 8px;">${TenVanBan.replace(
      " Thanh Lý",
      ""
    ).toUpperCase()}</h2>
    <h4 style="text-align: center; margin-top: 8px; margin-bottom: 24px;">
      V/v bán cá thiết bị đã cũ, hỏng hóc để tạo ngân sách phụ cho các thiết bị mới.
    </h4>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2.2cm;">
    <b>Kính gửi:</b> <b>Ban Giám hiệu trường Đại học Thái Bình.</b>
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Căn cứ theo tình hình kiểm tra thực tế các phòng thực hành máy tính.
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Khoa Công nghệ & Kỹ thuật xin trình lên Ban Giám hiệu dự trù thanh lý các thiết bị cho các phòng thực hành máy tính, cụ thể như sau:
    </p>
  
    <table id="table-request" border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    <tr>
      <th style="">STT</th>
      <th style="">Tên thiết bị - Thông số kỹ thuật</th>
      <th style="">ĐVT</th>
      <th style="">Số lượng</th>
      <th style="">Đơn giá</th>
      <th style="">Thành tiền</th>
    </tr>
    
    <tr>
      <td style=" text-align: center;">1</td>
      <td style=""></td>
      <td style=" text-align: center;"></td>
      <td style=" text-align: center;"></td>
      <td style=" text-align: center;">đ</td>
      <td style=" text-align: center;">đ</td>
    </tr>
  
    <tr>
      <td colspan="5" style=" text-align: center;"><b>Tổng cộng:</b></td>
      <td style=" text-align: center;"><b> đ</b></td>
    </tr>
    <tr>
      <td colspan="6" style=" text-align: center;"><b>Bằng chữ:</b></td>
    </tr>
  </table>
  
  
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;"><i>Ghi chú: Đơn giá trên chưa bao gồm thuế VAT.</i></p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;">Kính mong nhận được sự chấp thuận từ Ban Giám hiệu nhà trường.</p>
    <p style="text-align: right; margin-top: 8px; margin-bottom: 16px;">Ngày ... tháng ... năm 20...</p>
  
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG ĐƠN VỊ
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG NGÀNH
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              NGƯỜI ĐỀ XUẤT
          </th>
      </tr>
      <tr>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
      </tr>
    </table>
  `);

  function getTextAlign(el) {
    const align = window.getComputedStyle(el).textAlign;
    if (["left", "right", "center", "justify"].includes(align)) return align;
    return "left";
  }

  const getSelectedFontName = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";

    let node = selection.anchorNode;
    if (!node) return "";

    if (node.nodeType === 3) {
      // Nếu là text node, lấy parent element
      node = node.parentElement;
    }
    if (!node) return "";

    // Lấy font-family từ computed style
    const fontFamily = window.getComputedStyle(node).fontFamily;

    // fontFamily có thể trả về chuỗi dạng: "Times New Roman, serif"
    // ta chỉ lấy font đầu tiên và loại bỏ dấu ""
    if (fontFamily) {
      return fontFamily.split(",")[0].replace(/["']/g, "").trim();
    }
    return "";
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      cursorToolsRef.current.style.display = "none";
      return;
    }

    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (selectedText.trim()) {
      cursorToolsRef.current.style.top = `${rect.top + window.scrollY - 40}px`;
      cursorToolsRef.current.style.left = `${rect.left + window.scrollX}px`;
      cursorToolsRef.current.style.display = "flex";
    } else {
      cursorToolsRef.current.style.display = "none";
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const parentNode = selection.getRangeAt(0).startContainer.parentNode;

      // Lấy thông tin định dạng
      const fontName = getSelectedFontName();
      const fontSize = document.queryCommandValue("fontSize");
      const foreColor = document.queryCommandValue("foreColor");
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");
      const align = getTextAlign(parentNode);

      // Cập nhật state hiển thị UI
      setFormatState({
        fontName,
        fontSize,
        foreColor,
        isBold,
        isItalic,
        isUnderline,
        align,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  const applyFormat = (command, value = null) => {
    if (command === "fontName") {
      // Tạo span với style font-family
      document.execCommand("styleWithCSS", false, true); // bật style css
      document.execCommand("fontName", false, value);
      return;
    }
    document.execCommand(command, false, value);
  };

  const handleAlign = (type) => {
    document.execCommand("justify" + type); // "justifyLeft", "justifyCenter", ...
  };

  const isAlignActive = (type) => formatState.align === type;

  // Tính tổng trị giá
  const totalTriGia = listData.reduce((sum, item) => {
    // Chuyển string thành số, bỏ phần thập phân .00 nếu có
    let gia = item.Gia;
    if (typeof gia === "string") {
      gia = gia.replace(/\.00$/, ""); // bỏ .00 cuối nếu có
      gia = gia.replace(/,/g, ""); // bỏ dấu phẩy phân tách
      gia = parseInt(gia, 10) || 0;
    }
    return sum + (typeof gia === "number" ? gia : 0);
  }, 0);
  const totalTriGiaText = numberToWords(totalTriGia);

  // Tạo nội dung bảng với tổng trị giá và bằng chữ
  // Định dạng số thành dạng 0.000.000.000
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const tableContent = `
    <table id="table-request" border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr>
        <th>STT</th>
        <th>Tên thiết bị - Thông số kỹ thuật</th>
        <th>ĐVT</th>
        <th>Thành tiền</th>
      </tr>
      ${
        listData.length > 0
          ? listData
              .map(
                (item, idx) => `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td>${item.TenLoai || ""}</td>
            <td style="text-align: center;">${item.DonViTinh || ""}</td>
            <td style="text-align: center;">${
              item.Gia ? formatNumber(Number(item.Gia)) : ""
            } đ</td>
          </tr>
        `
              )
              .join("")
          : `
          <tr>
            <td style="text-align: center;">1</td>
            <td></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
          </tr>
        `
      }
      <tr>
        <td colspan="3" style="text-align: center;"><b>Tổng cộng:</b></td>
        <td style="text-align: center;"><b>${
          totalTriGia ? formatNumber(totalTriGia) + " đ" : " đ"
        }</b></td>
      </tr>
      <tr>
        <td colspan="4" style="text-align: center;"><b>Bằng chữ: ${
          totalTriGia ? totalTriGiaText : ""
        }</b></td>
      </tr>
    </table>
  `;

  return (
    <div className="page-container editor-container">
      <div id="cursor-tools" ref={cursorToolsRef} style={{ display: "none" }}>
        <div className="font">
          <select
            name=""
            id="select-font"
            value={formatState.fontName}
            onChange={(e) => {
              applyFormat("fontName", e.target.value);
            }}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        </div>
        <div className="font-size">
          <select
            value={formatState.fontSize}
            onChange={(e) => applyFormat("fontSize", e.target.value)}
          >
            <option value="1">10px</option>
            <option value="2">13px</option>
            <option value="3">16px</option>
            <option value="4">18px</option>
            <option value="5">24px</option>
            <option value="6">32px</option>
            <option value="7">48px</option>
          </select>
        </div>
        <div className="font-color">
          <input
            type="color"
            id="font-color-input"
            value={formatState.foreColor}
            onChange={(e) => applyFormat("foreColor", e.target.value)}
          />
        </div>
        <div className="font-style">
          <button
            className={formatState.isBold ? "active" : ""}
            onClick={() => applyFormat("bold")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M17.061 11.22A4.46 4.46 0 0 0 18 8.5C18 6.019 15.981 4 13.5 4H6v15h8c2.481 0 4.5-2.019 4.5-4.5a4.48 4.48 0 0 0-1.439-3.28zM13.5 7c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5H9V7h4.5zm.5 9H9v-3h5c.827 0 1.5.673 1.5 1.5S14.827 16 14 16z"></path>
            </svg>
          </button>
          <button
            className={formatState.isItalic ? "active" : ""}
            onClick={() => applyFormat("italic")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 7V4H9v3h2.868L9.012 17H5v3h10v-3h-2.868l2.856-10z"></path>
            </svg>
          </button>
          <button
            className={formatState.isUnderline ? "active" : ""}
            onClick={() => applyFormat("underline")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M5 18h14v2H5zM6 4v6c0 3.309 2.691 6 6 6s6-2.691 6-6V4h-2v6c0 2.206-1.794 4-4 4s-4-1.794-4-4V4H6z"></path>
            </svg>
          </button>
        </div>
        <div className="font-margin">
          <button
            className={isAlignActive("left") ? "active" : ""}
            name="align-left"
            onClick={() => handleAlign("left")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm0-4h11v2H4zm0-4h16v2H4zm0-8h16v2H4zm0 4h11v2H4z"></path>
            </svg>
          </button>
          <button
            className={isAlignActive("center") ? "active" : ""}
            name="align-midder"
            onClick={() => handleAlign("center")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm3-4h10v2H7zm-3-4h16v2H4zm0-8h16v2H4zm3 4h10v2H7z"></path>
            </svg>
          </button>
          <button
            className={isAlignActive("right") ? "active" : ""}
            name="align-right"
            onClick={() => handleAlign("right")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z"></path>
            </svg>
          </button>
          <button
            className={isAlignActive("justify") ? "active" : ""}
            name="align-justify"
            onClick={() => handleAlign("justify")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 7h16v2H4zm0-4h16v2H4zm0 8h16v2H4zm0 4h16v2H4zm2 4h12v2H6z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div
        id="editor"
        contentEditable
        suppressContentEditableWarning={true}
        className="editor-area"
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        dangerouslySetInnerHTML={{
          __html: `
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style=" text-align: center; border: none; background: transparent;">
              TRƯỜNG ĐẠI HỌC THÁI BÌNH<br>
              KHOA CÔNG NGHỆ & KỸ THUẬT
          </th>
          <th style=" text-align: center; border: none; background: transparent;">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
              Độc lập – Tự do – Hạnh phúc
          </th>
      </tr>
    </table>
  
    <h2 style="text-align: center; margin-top: 8px; margin-bottom: 8px;">${TenVanBan.replace(
      " Thanh Lý",
      ""
    ).toUpperCase()}</h2>
    <h4 style="text-align: center; margin-top: 8px; margin-bottom: 24px;">
      V/v bán cá thiết bị đã cũ, hỏng hóc để tạo ngân sách phụ cho các thiết bị mới.
    </h4>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2.2cm;">
    <b>Kính gửi:</b> <b>Ban Giám hiệu trường Đại học Thái Bình.</b>
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Căn cứ theo tình hình kiểm tra thực tế các phòng thực hành máy tính.
    </p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 2cm;">
      Khoa Công nghệ & Kỹ thuật xin trình lên Ban Giám hiệu dự trù thanh lý các thiết bị cho các phòng thực hành máy tính, cụ thể như sau:
    </p>
    ${tableContent}
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;"><i>Ghi chú: Đơn giá trên chưa bao gồm thuế VAT.</i></p>
    <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;">Kính mong nhận được sự chấp thuận từ Ban Giám hiệu nhà trường.</p>
    <p style="text-align: right; margin-top: 8px; margin-bottom: 16px;">Ngày ... tháng ... năm 20...</p>
    <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
      <tr>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG ĐƠN VỊ
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              TRƯỞNG NGÀNH
          </th>
          <th style="text-align: center; border: none; background: transparent;">
              NGƯỜI ĐỀ XUẤT
          </th>
      </tr>
      <tr>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
        <td style=" text-align: center; border: none; height: 4rem"></td>
      </tr>
    </table>
    `,
        }}
      />
    </div>
  );
}
