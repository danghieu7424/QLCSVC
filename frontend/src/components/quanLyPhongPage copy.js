import React, { useEffect, useState } from "react";
import { LoaderPage } from "./base/LoaderForm";
import API_BASE_URL from "./base/config";

import "../access/css/tongQuanHocPhanPage.css";

export default function QuanLyPhongPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const resRaw = await fetch(`${API_BASE_URL}/api/select/quan-ly-phong`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await resRaw.json();
      if (!resRaw.ok) throw new Error(result.message || "Lỗi lấy dữ liệu.");
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    data.forEach((khoa, KhoaIndex) => {
      const khoaKey = `${KhoaIndex}`;
      allExpanded[khoaKey] = true;
      khoa.Nganh?.forEach((nganh, NganhIndex) => {
        const nganhKey = `${KhoaIndex}-${NganhIndex}`;
        allExpanded[nganhKey] = true;
        nganh.Phong?.forEach((phong, PhongIndex) => {
          const phongKey = `${KhoaIndex}-${NganhIndex}-${PhongIndex}`;
          allExpanded[phongKey] = true;
        });
      });
    });
    setExpanded(allExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  const RenderTree = ({ data }) => (
    <ul className="tree-view">
      {data.map((khoa, KhoaIndex) => (
        <li key={KhoaIndex} className="child">
          <div className="tree-node">
            <span
              className={`toggle ${expanded[KhoaIndex] ? "expanded" : ""}`}
              onClick={() => toggleExpand(KhoaIndex)}
            ></span>
            <span className="title">{khoa.TenKhoa}</span>
          </div>

          {expanded[KhoaIndex] && (
            <ul className="tree-view">
              {khoa.Nganh.map((nganh, NganhIndex) => {
                const nganhKey = `${KhoaIndex}-${NganhIndex}`;
                return (
                  <li key={nganhKey} className="child">
                    <div className="tree-node">
                      <span
                        className={`toggle ${
                          expanded[nganhKey] ? "expanded" : ""
                        }`}
                        onClick={() => toggleExpand(nganhKey)}
                      ></span>
                      <span className="title">{nganh.TenNganh}</span>
                    </div>

                    {expanded[nganhKey] && (
                      <ul className="tree-view">
                        {nganh.Phong.map((phong, PhongIndex) => {
                          const phongKey = `${KhoaIndex}-${NganhIndex}-${PhongIndex}`;
                          return (
                            <li key={phongKey} className="child">
                              <div className="tree-node">
                                <span
                                  className={`toggle ${
                                    expanded[phongKey] ? "expanded" : ""
                                  }`}
                                  onClick={() => toggleExpand(phongKey)}
                                ></span>
                                <span className="title">{`${phong.MaPhong} - ${phong.TenPhong}`}</span>
                              </div>

                              {expanded[phongKey] && (
                                <ul className="tree-view">
                                  {phong.CanBo?.map((canbo, CanBoIndex) => (
                                    <li
                                      key={CanBoIndex}
                                      className="tree-view-child child"
                                    >
                                      <span className="member-name">
                                        {`${canbo.MaCanBo} - ${canbo.TenCanBo} (${canbo.ChucVu})`}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="QuanLyPhongPage page-container">
      {loading && <LoaderPage />}
      {!loading && (
        <div className="box-tree-view">
          <div className="box-tree-view-head">
            <span>{data[0]?.TenKhoa || "gốc"}</span>

            <div className="buttons">
              <abbr title="Mở rộng toàn bộ">
                <button onClick={expandAll}>
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path d="m12 19.24-4.95-4.95-1.41 1.42L12 22.07l6.36-6.36-1.41-1.42L12 19.24zM5.64 8.29l1.41 1.42L12 4.76l4.95 4.95 1.41-1.42L12 1.93 5.64 8.29z"></path>
                  </svg>
                </button>
              </abbr>
              <abbr title="Thu gọn toàn bộ">
                <button onClick={collapseAll}>
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M12 7.59 7.05 2.64 5.64 4.05 12 10.41l6.36-6.36-1.41-1.41L12 7.59zM5.64 19.95l1.41 1.41L12 16.41l4.95 4.95 1.41-1.41L12 13.59l-6.36 6.36z"></path>
                  </svg>
                </button>
              </abbr>
            </div>
          </div>
          <RenderTree data={data} />
        </div>
      )}
    </div>
  );
}
