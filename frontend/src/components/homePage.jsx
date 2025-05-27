import React, { useEffect, useRef, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

import TransitionContext from "../context/TransitionContext";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

import API_BASE_URL from "./base/config";

import "../access/css/homePage.css";

export default function HomePage() {
  const congTruong = `${API_BASE_URL}/api/stream/public?path=cong_truong.jpg`;

  const main = useRef();
  const { completed } = useContext(TransitionContext);
  // const scrollTween = useRef();
  // const snapTriggers = useRef([]);
  // const { contextSafe } = useGSAP(
  //   () => {
  //     let panels = gsap.utils.toArray(".panel"),
  //       scrollStarts = [0],
  //       snapScroll = (value) => value;
  //     panels.forEach((panel, i) => {
  //       snapTriggers.current[i] = ScrollTrigger.create({
  //         trigger: panel,
  //         start: "top top",
  //       });
  //     });

  //     ScrollTrigger.addEventListener("refresh", () => {
  //       scrollStarts = snapTriggers.current.map((trigger) => trigger.start);
  //       snapScroll = ScrollTrigger.snapDirectional(scrollStarts);
  //     });

  //     ScrollTrigger.observe({
  //       type: "wheel,touch",
  //       onChangeY(self) {
  //         if (!scrollTween.current) {
  //           let scroll = snapScroll(
  //             self.scrollY() + self.deltaY,
  //             self.deltaY > 0 ? 1 : -1
  //           );
  //           goToSection(scrollStarts.indexOf(scroll));
  //         }
  //       },
  //     });

  //     ScrollTrigger.refresh();
  //   },
  //   {
  //     dependencies: [completed],
  //     scope: main,
  //     revertOnUpdate: true,
  //   }
  // );

  // const goToSection = contextSafe((i) => {
  //   // console.log("scroll to", i);
  //   // console.log(snapTriggers.current[i].start);
  //   scrollTween.current = gsap.to(window, {
  //     scrollTo: { y: snapTriggers.current[i].start - 65, autoKill: false },
  //     duration: 1,
  //     onComplete: () => (scrollTween.current = null),
  //     overwrite: true,
  //   });
  // });

  return (
    <main className="home-container" ref={main}>
      <div className="panel description home-introduction">
        <div className="bg-introduction">
          <div className="bg-introduction-left">
            <span></span>
          </div>
          <div className="bg-introduction-right">
            <span></span>
          </div>
        </div>
        <div className="home-introduction-title">
          <h6>Trường Đại học Thái Bình</h6>
          <h3>Website quản lý cơ sở vật</h3>
          <h3>khoa Công nghệ và Kỹ thuật</h3>
          <h5>Dễ dàng - Nhanh chóng - Tiện lợi</h5>
        </div>
        <div className="home-introduction-show">
          <div
            className="box-introduction-show"
            style={{
              background: `url("${congTruong}") no-repeat 60% / cover`,
            }}
          ></div>
        </div>
      </div>

      <section className="panel frame home-body">
        <div className="home-body-box1">
          <h2>Tính năng nổi bật</h2>
          <p>
            Phần mềm giúp bạn quản lý cơ sở vật chất một cách chuyên nghiệp,
            hiệu quả và bảo mật.
          </p>
          <div className="home-body-listNote">
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>Quản lý tài sản 24/7</h3>
                <p>Cập nhật, theo dõi và tra cứu tài sản mọi lúc, mọi nơi.</p>
              </div>
            </div>
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>Phân quyền và kiểm soát truy cập</h3>
                <p>
                  Bảo mật dữ liệu với phân quyền rõ ràng cho từng vai trò, phòng
                  xưởng.
                </p>
              </div>
            </div>
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>Báo cáo trực quan & xuất dữ liệu dễ dàng</h3>
                <p>
                  Trình bày dữ liệu dưới dạng hỗ trợ xuất tờ trình bằng word.
                </p>
              </div>
            </div>
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>Quản lý vòng đời tài sản</h3>
                <p>
                  Theo dõi quá trình sử dụng – bảo trì – thanh lý của từng tài
                  sản theo chu kỳ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel frame home-body nganh">
        <div className="home-body-box1">
          <h2>CÁC NGÀNH KHOA CÔNG NGHỆ VÀ KỸ THUẬT</h2>
          <div className="home-body-listNote">
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>NGÀNH CÔNG NGHỆ THÔNG TIN</h3>
                <ul>
                  <li>Chương trình đào tạo hiện đại, sát thực tế</li>
                  <li>Thực hành với hệ thống phòng Lab chuyên sâu</li>
                  <li>Liên kết doanh nghiệp – đảm bảo việc làm </li>
                  <li>Giảng viên trình độ cao, tâm huyết </li>
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    window.location.href = "https://tbu.edu.vn/gioi-thieu-ve-khoa-cong-nghe-thong-tin.html";
                  }}
                >
                  xem thêm
                </button>
              </div>
            </div>
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>NGÀNH CÔNG NGHỆ KỸ THUẬT CƠ KHÍ</h3>
                <ul>
                  <li>Đào tạo kỹ sư thực hành giỏi</li>
                  <li>Ứng dụng trong công nghiệp, điện tử dân dụng</li>
                  <li>Phòng thực hành với máy móc thiết bị hiện đại</li>
                  <li>Cơ hội thực tập doanh nghiệp lớn</li>
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    window.location.href = "https://tbu.edu.vn/nganh-cong-nghe-ky-thuat-co-khi.html";
                  }}
                >
                  xem thêm
                </button>
              </div>
            </div>
            <div className="listNode-child">
              <div className="box-listNode-child">
                <h3>NGÀNH CÔNG NGHỆ KỸ THUẬT ĐIỆN – ĐIỆN TỬ</h3>
                <ul>
                  <li>Đào tạo kỹ sư thực hành giỏi</li>
                  <li>Ứng dụng trong công nghiệp, điện tử dân dụng</li>
                  <li>Phòng thực hành với máy móc thiết bịbị hiện đại</li>
                  <li>Cơ hội thực tập doanh nghiệp lớn</li>
                </ul>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    window.location.href = "https://tbu.edu.vn/chuan-dau-ra-trinh-do-dai-hoc-nganh-cong-nghe-ky-thuat-dien-dien-tu.html";
                  }}
                >
                  xem thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        className="panel home-footer"
        style={{
          background: `url(${API_BASE_URL}/api/stream/public?path=bg_sky_darker.gif)`,
        }}
      >
        <div className="home-footer-head">
          <ul className="home-footer-head-item1">
            <li
              style={{
                position: "relative",
                width: "7rem",
                marginBottom: "2rem",
                aspectRatio: "1/1",
                background: `url(${`${API_BASE_URL}/api/stream/public?path=tbu1.png`})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></li>
            <li>
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "1rem",
                  aspectRatio: "1/1",
                  background:
                    "url(https://www.figma.com/file/3YlJWgXF0CG1XYEeZFveK3/image/47e94f2115569931693624e4ae43427350c0694b)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></span>
              Địa chỉ: xã Tân Bình, Thành phố Thái Bình, Tỉnh Thái Bình
            </li>
            <li>
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "1rem",
                  aspectRatio: "1/1",
                  background:
                    "url(https://www.figma.com/file/3YlJWgXF0CG1XYEeZFveK3/image/3003caba8e85b8d66985c71c7fee7b607fef5caf)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></span>
              098 969 17 56
            </li>
            <li>
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "1rem",
                  aspectRatio: "1/1",
                  background:
                    "url(https://www.figma.com/file/3YlJWgXF0CG1XYEeZFveK3/image/4172e3ca753bb3e453fe0a2ed038567132613074)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></span>
              dhtb@tbu.edu.vn
            </li>
            <li>
              <span>©</span>Bản quyền thuộc về Trường Đại học Thái Bình
            </li>
          </ul>
          <div className="home-footer-head-item2">
            <span>THỜI GIAN LÀM VIỆC</span>
            <ul>
              <li>
                Thứ Hai - Thứ Bảy: 7:00 - 17:00 (Nghỉ Chủ nhật và các ngày lễ,
                Tết theo quy định){" "}
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
