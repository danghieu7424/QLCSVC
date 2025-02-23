import React, { useState, useRef, useEffect } from "react";
import '../assets/css/doc.css';
import htmlDocx from "html-docx-js/dist/html-docx.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useHistory } from "react-router-dom";
import { useAuth } from './authContext.js';

const TextEditor = ({ location }) => {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const { userData, login } = useAuth();
  const history = useHistory();
  const { status, SoVanBan, TenVanBan, tableData } = location.state || {};

  // history.push("/doc", { status: 'new' });



  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token && !userData) {
      fetch("https://api-jwgltkza6q-uc.a.run.app/protected-route", {
        method: "GET",
        headers: { Authorization: token },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) login(data.user); // Cập nhật userData
        })
        .catch(error => {
          console.error("Error during token verification: ", error);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        });
    }
  }, [userData, login]);

  const savePage = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("Ban chưa đăng nhập");
      return;
    }
    if (!TenVanBan) {
      alert('rỗng');
      return;
    }
    if (status === 'new') {
      fetch('https://api-jwgltkza6q-uc.a.run.app/api/insert/van-ban', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ MaCanBo: userData.id, TenVanBan, TextData: editorRef.current.innerHTML }),
      })
        .then(request => request.json())
        .then(data => {
          alert(data.message)
          if (TenVanBan === 'Tờ Trình') {
            history.push('/MuaThietBi/VanBan');
          }
          else {
            history.push('/ThanhLyThietBi/VanBan');
          }
        })
        .catch(err => {
          console.log(err.message, err.error);
        })
    }
    else {
      fetch('https://api-jwgltkza6q-uc.a.run.app/api/update/van-ban', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SoVanBan, MaCanBo: userData.id, TenVanBan, TextData: editorRef.current.innerHTML }),
      })
        .then(request => request.json())
        .then(data => {
          alert(data.message);
          if (TenVanBan === 'Tờ Trình') {
            history.push('/MuaThietBi/VanBan');
          }
          else {
            history.push('/ThanhLyThietBi/VanBan');
          }
        })
        .catch(err => {
          console.log(err.message, err.error);
        })
    }
  }

  const downloadAsWord = () => {
    const content = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>
          body, table, th, td {
            font-family: "Times New Roman", Times, serif !important;
            font-size: 12pt;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
          }
          /* Bắt buộc Word dùng Times New Roman */
          @page {
            size: A4;
            margin: 1in;
            mso-page-orientation: portrait;
          }
          div.WordSection1 {
            page: WordSection1;
          }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          ${editorRef.current.innerHTML}
        </div>
      </body>
    </html>
  `;
    const docx = htmlDocx.asBlob(content); // Chuyển thành file Word (.docx)
    const url = URL.createObjectURL(docx);

    // Tạo thẻ a để tải xuống file
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = () => {
    const editor = editorRef.current;
    if (!editor) return;

    html2canvas(editor, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210 - 20; // 10mm lề mỗi bên
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;


      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      pdf.save("document.pdf");
    });
  };


  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const boxEditorRect = document.querySelector(".box_editor").getBoundingClientRect();

      setToolbarPosition({
        top: rect.top - boxEditorRect.top - 50,
        left: rect.left - boxEditorRect.left,
      });

      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const insertTable = () => {
    const rows = prompt("Nhập số hàng:", 3);
    const cols = prompt("Nhập số cột:", 3);
    if (!rows || !cols) return;

    let table = "<table border='1' style='width: 100%; border-collapse: collapse;'>";
    for (let i = 0; i < rows; i++) {
      table += "<tr>";
      for (let j = 0; j < cols; j++) {
        table += "<td contenteditable='true' style='padding: 5px; border: 1px solid black;'>Ô</td>";
      }
      table += "</tr>";
    }
    table += "</table>";

    document.execCommand("insertHTML", false, table);
  };

  const addRow = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    while (node && node.nodeName !== "TABLE") {
      node = node.parentNode;
    }

    if (node && node.nodeName === "TABLE") {
      const row = node.insertRow();
      for (let i = 0; i < node.rows[0].cells.length; i++) {
        const cell = row.insertCell();
        cell.innerHTML = "Ô mới";
        cell.contentEditable = "true";
        cell.style.padding = "5px";
        cell.style.border = "1px solid black";
      }
    }
  };

  const addColumn = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    let node = selection.anchorNode;
    while (node && node.nodeName !== "TABLE") {
      node = node.parentNode;
    }

    if (node && node.nodeName === "TABLE") {
      for (let i = 0; i < node.rows.length; i++) {
        const cell = node.rows[i].insertCell();
        cell.innerHTML = "Ô mới";
        cell.contentEditable = "true";
        cell.style.padding = "5px";
        cell.style.border = "1px solid black";
      }
    }
  };

  const addNewRow = () => {
    const table = document.querySelector(".editor #table-request");
    if (!table) return;

    const newRow = table.insertRow(table.rows.length - 2);
    for (let i = 0; i < 6; i++) {
      const cell = newRow.insertCell();
      if (i === 0) {
        cell.innerText = table.rows.length - 3;
        cell.style.textAlign = "center";
      } else if (i === 2) {
        cell.contentEditable = "true";
        cell.style.textAlign = "center";
      } else if (i === 3) {
        cell.contentEditable = "true";
        cell.style.textAlign = "center";
      } else if (i === 4) {
        cell.contentEditable = "true";
        cell.style.textAlign = "center";
        cell.innerText = "đ";
      } else if (i === 5) {
        cell.innerText = "đ";
        cell.style.textAlign = "center";
        cell.contentEditable = "false";
      } else {
        cell.contentEditable = "true";
      }
      cell.style.padding = "5px";
      cell.style.border = "1px solid black";
    }
  };

  const handleExit = () => {
    if (TenVanBan === 'Tờ Trình') {
      history.push('/MuaThietBi/VanBan');
    }
    else {
      history.push('/ThanhLyThietBi/VanBan');
    }
  }

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

  <h2 style="text-align: center; margin-top: 8px; margin-bottom: 8px;">TỜ TRÌNH</h2>
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
            TRƯỞNG NGÀNH CNTT
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

  <h2 style="text-align: center; margin-top: 8px; margin-bottom: 8px;">TỜ TRÌNH</h2>
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


  // <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;"><i>Ghi chú: Đơn giá trên chưa bao gồm thuế VAT.</i></p>
  <p style="margin-top: 8px; margin-bottom: 16px; text-indent: 1cm;">Kính mong nhận được sự chấp thuận từ Ban Giám hiệu nhà trường.</p>
  <p style="text-align: right; margin-top: 8px; margin-bottom: 16px;">Ngày ... tháng ... năm 20...</p>

  <table style="width: 100%; border-collapse: collapse; border: none; margin-bottom: 16px;">
    <tr>
        <th style="text-align: center; border: none; background: transparent;">
            TRƯỞNG ĐƠN VỊ
        </th>
        <th style="text-align: center; border: none; background: transparent;">
            TRƯỞNG NGÀNH CNTT
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

  useEffect(() => {
    if (tableData) {
      let tableContent = `
    <table id="table-request" border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tr>
        <th>STT</th>
        <th>Tên thiết bị - Thông số kỹ thuật</th>
        <th>ĐVT</th>
        <th>Số lượng</th>
        <th>Đơn giá</th>
        <th>Thành tiền</th>
      </tr>`;

      tableData.forEach(row => {
        if (row.TenThietBi === "Tổng cộng") {
          // Hàng Tổng cộng
          tableContent += `
        <tr>
          <td colspan="5" style="text-align: center;"><b>${row.TenThietBi}:</b></td>
          <td style="text-align: center;"><b>${new Intl.NumberFormat("vi-VN").format(row.ThanhTien)} đ</b></td>
        </tr>`;
        } else if (row.TenThietBi.startsWith("Bằng chữ:")) {
          // Hàng Bằng chữ
          tableContent += `
        <tr>
          <td colspan="6" style="text-align: center;"><b>${row.TenThietBi}</b></td>
        </tr>`;
        } else {
          // Hàng bình thường
          tableContent += `
        <tr>
          <td style="text-align: center;">${row.STT}</td>
          <td>${row.TenThietBi}</td>
          <td style="text-align: center;">${row.DVT}</td>
          <td style="text-align: center;">${row.SoLuong}</td>
          <td style="text-align: center;">${new Intl.NumberFormat("vi-VN").format(row.DonGia)} đ</td>
          <td style="text-align: center;">${new Intl.NumberFormat("vi-VN").format(row.ThanhTien)} đ</td>
        </tr>`;
        }
      });

      tableContent += `</table>`;

      setInitialContent(prev => prev.replace(/<table id="table-request".*?<\/table>/s, tableContent));
    }
  }, [tableData]);


  useEffect(() => {
    if (userData?.id && SoVanBan) {
      fetch('https://api-jwgltkza6q-uc.a.run.app/api/select/so-van-ban', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userData.id, SoVanBan, TenVanBan }),
      })
        .then(request => request.json())
        .then(data => {
          if (TenVanBan === 'Tờ Trình') {
            setInitialContent(data.data.TextData);
          }
          else {

            setInitialContentThanhLy(data.data.TextData);
          }
        })
        .catch(err => {
          console.error("Lỗi tải dữ liệu:", err);
        });
    }
  }, [userData]);

  return (
    <div className="box_editor">
      <div className="tool">
        <div className="tool-functions">
          <button disabled={!showToolbar} onClick={() => applyFormat("bold")}><b>B</b></button>
          <button disabled={!showToolbar} onClick={() => applyFormat("italic")}><i>I</i></button>
          <button disabled={!showToolbar} onClick={() => applyFormat("underline")}><u>U</u></button>
          <input type="color" onChange={(e) => applyFormat("foreColor", e.target.value)} />
          <select onChange={(e) => applyFormat("fontSize", e.target.value)}>
            <option value="3">Bình thường</option>
            <option value="1">Nhỏ</option>
            <option value="5">Lớn</option>
            <option value="7">Rất lớn</option>
          </select>
          <button onClick={() => applyFormat("justifyLeft")}><i className='bx bx-align-left'></i></button>
          <button onClick={() => applyFormat("justifyCenter")}><i className='bx bx-align-middle' ></i></button>
          <button onClick={() => applyFormat("justifyRight")}><i className='bx bx-align-right' ></i></button>
          <button onClick={() => applyFormat("justifyFull")}><i className='bx bx-align-justify' ></i></button>
          <button onClick={insertTable}><i className='bx bx-table' ></i> Thêm bảng</button>
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
            style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
          >
            <button onClick={() => applyFormat("bold")}><b>B</b></button>
            <button onClick={() => applyFormat("italic")}><i>I</i></button>
            <button onClick={() => applyFormat("underline")}><u>U</u></button>
            <input type="color" onChange={(e) => applyFormat("foreColor", e.target.value)} />
            <select onChange={(e) => applyFormat("fontSize", e.target.value)}>
              <option value="3">Bình thường</option>
              <option value="1">Nhỏ</option>
              <option value="5">Lớn</option>
              <option value="7">Rất lớn</option>
            </select>
            <button onClick={() => applyFormat("justifyLeft")}><i className='bx bx-align-left'></i></button>
            <button onClick={() => applyFormat("justifyCenter")}><i className='bx bx-align-middle' ></i></button>
            <button onClick={() => applyFormat("justifyRight")}><i className='bx bx-align-right' ></i></button>
            <button onClick={() => applyFormat("justifyFull")}><i className='bx bx-align-justify' ></i></button>
            <button onClick={insertTable}><i className='bx bx-table' ></i> Thêm bảng</button>
            <button onClick={addRow}><i className='bx bx-plus' ></i> Hàng</button>
            <button onClick={addColumn}><i className='bx bx-plus' ></i> Cột</button>
            <button onClick={addNewRow}><i className='bx bx-plus' ></i> Thêm hàng</button>
          </div>
        )}



        <div
          ref={editorRef}
          className="editor"
          contentEditable
          onMouseUp={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          dangerouslySetInnerHTML={{
            __html: TenVanBan === 'Tờ Trình' ? initialContent : initialContentThanhLy
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default TextEditor;

