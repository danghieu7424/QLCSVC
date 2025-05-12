import React, { useEffect, useRef, useState } from "react";
import API_BASE_URL from "./base/config";

import "../access/css/homePage.css";

export default function HomePage() {
    const imgList = [
        `${API_BASE_URL}/api/stream/public?path=277741301_403721375087452_6058591383061904889_n.jpg`,
        `${API_BASE_URL}/api/stream/public?path=315086295_574197421373179_578075313364114677_n.jpg`,
        `${API_BASE_URL}/api/stream/public?path=354062663_742263647899888_9052663520915940561_n.jpg`,
        `${API_BASE_URL}/api/stream/public?path=359815773_760353849424201_4766179409589887923_n.jpg`,
        `${API_BASE_URL}/api/stream/public?path=403710390_848096480649937_444453323054382538_n.jpg`,
        `${API_BASE_URL}/api/stream/public?path=403714219_847948653998053_355582356716653193_n.jpg`,
    ];
    const images = [
        `${API_BASE_URL}/api/stream/public?path=tbu0.png`,
        `${API_BASE_URL}/api/stream/public?path=tbu2.jpg`,
    ];

    const [index, setIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setFadeIn(false); // Bắt đầu ẩn ảnh cũ

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % images.length); // Đổi ảnh
                setFadeIn(true); // Hiện ảnh mới
            }, 300); // Delay nhỏ để tạo hiệu ứng fade-out trước khi đổi
        }, 10000);

        return () => clearInterval(timer);
    }, []);

    // -------slider-------

    const [activeIndex, setActiveIndex] = useState(0);
    const boxSliderRef = useRef(null);

    const handleClick = (index) => {
        setActiveIndex(index);
        if (boxSliderRef.current) {
            const slides = boxSliderRef.current.children; // Lấy danh sách các slides
            if (slides[index]) {
                const slideOffset = slides[index].offsetLeft; // Lấy vị trí của slide
                boxSliderRef.current.scrollTo({
                    left: slideOffset, // Cuộn đến vị trí chính xác của slide
                    behavior: "smooth",
                });
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!boxSliderRef.current) return;
            const slides = boxSliderRef.current.children;
            let closestIndex = 0;
            let minDiff = Infinity;
            const containerScrollLeft = boxSliderRef.current.scrollLeft;

            // Tìm slide gần nhất với vị trí cuộn
            for (let i = 0; i < slides.length; i++) {
                const slideLeft = slides[i].offsetLeft;
                const diff = Math.abs(containerScrollLeft - slideLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
            }

            setActiveIndex(closestIndex);
        };

        const sliderElement = boxSliderRef.current;
        if (sliderElement) {
            sliderElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (sliderElement) {
                sliderElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <>
            <div className="page-container home-container">
                <div className={`home-introduction`}>
                    <div
                        key={index}
                        className={`home-introduction-img${
                            fadeIn ? " active" : ""
                        }`}
                        style={{
                            background: `url(${images[index]}) no-repeat center center / cover`,
                        }}
                    ></div>
                    <span className="home-introduction-title">
                        <h1>quản lý cơ sở vật chất</h1>
                        <h1>trường đại học thái binh</h1>
                    </span>
                </div>
                <div className="home-show-info">
                    <div className="frame">
                        <h2>LỊCH SỬ HÌNH THÀNH</h2>
                        <p>
                            Trường Đại học Thái Bình, được thành lập từ năm
                            1960, là một trong những cơ sở giáo dục đại học có
                            uy tín tại khu vực Đồng bằng Bắc Bộ. Trải qua hơn
                            sáu thập kỷ xây dựng và phát triển, trường đã không
                            ngừng mở rộng quy mô đào tạo, nâng cao chất lượng
                            giảng dạy và nghiên cứu khoa học.
                        </p>
                        <p>
                            {" "}
                            Hiện nay, trường có nhiều khoa chuyên ngành, trong
                            đó nổi bật là Khoa Công nghệ và Kỹ thuật với thế
                            mạnh về đào tạo kỹ sư công nghệ, Khoa Kinh tế đào
                            tạo nguồn nhân lực chất lượng cao trong các lĩnh vực
                            tài chính, quản trị và kinh doanh, Khoa Luật cung
                            cấp nền tảng kiến thức vững chắc về pháp luật, và
                            Khoa Khoa học đóng vai trò quan trọng trong việc
                            phát triển các lĩnh vực khoa học cơ bản và ứng dụng.
                            Với đội ngũ giảng viên giàu kinh nghiệm, cơ sở vật
                            chất hiện đại và môi trường học tập năng động,
                            Trường Đại học Thái Bình là điểm đến lý tưởng cho
                            sinh viên trong và ngoài tỉnh.
                        </p>
                    </div>
                </div>
                <div className="home-show-khoa">
                    <div
                        className="box-khoa"
                        style={{
                            animation: "right-to-left 0.5s 0.3s linear",
                            animationTimeline: "view()",
                            animationFillMode: "both",
                            animationRange: "entry 0% cover 40%",
                        }}
                    >
                        <div className="box-khoa-info">
                            <div
                                className="box-khoa-logo"
                                style={{
                                    background: `url('${API_BASE_URL}/api/stream/public?path=kcnkt.png') no-repeat center center / cover`,
                                }}
                            ></div>
                            <div
                                onClick={() =>
                                    window.open(
                                        "https://tbu.edu.vn/khoa-cong-nghe-va-ky-thuat.html",
                                        "_blank"
                                    )
                                }
                                className="box-khoa-more"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Xem thêm
                            </div>
                        </div>
                        <div className="box-khoa-description0">
                            <h2>Khoa Công nghệ và Kỹ thuật</h2>
                            <p>
                                Khoa Công nghệ và Kỹ thuật – Trường Đại học Thái
                                Bình là một trong những khoa đào tạo chủ lực của
                                nhà trường, với sứ mệnh cung cấp nguồn nhân lực
                                chất lượng cao trong các lĩnh vực công nghệ, kỹ
                                thuật và ứng dụng thực tiễn.
                            </p>
                        </div>
                    </div>
                    <div
                        className="box-khoa"
                        style={{
                            animation: "left-to-right 0.5s 0.3s linear",
                            animationTimeline: "view()",
                            animationFillMode: "both",
                            animationRange: "entry 0% cover 40%",
                        }}
                    >
                        <div className="box-khoa-description1">
                            <h2>Khoa Luật</h2>
                            <p>
                                Khoa Luật của Trường Đại học Thái Bình là một
                                trong những đơn vị đào tạo trọng điểm, chuyên
                                cung cấp nguồn nhân lực chất lượng cao trong
                                lĩnh vực pháp luật. Khoa hiện đào tạo ngành Luật
                                với chương trình học được thiết kế bài bản, cung
                                cấp cho sinh viên kiến thức chuyên sâu về các
                                lĩnh vực như Luật Hiến pháp, Luật Hành chính,
                                Luật Dân sự, Luật Hình sự, Luật Hôn nhân & Gia
                                đình, Luật Lao động, Luật Đất đai và nhiều lĩnh
                                vực khác.
                            </p>
                        </div>
                        <div className="box-khoa-info">
                            <div
                                className="box-khoa-logo"
                                style={{
                                    background: `url('${API_BASE_URL}/api/stream/public?path=kl.png') no-repeat center center / cover`,
                                }}
                            ></div>
                            <div
                                onClick={() =>
                                    window.open(
                                        "https://tbu.edu.vn/khoa-luat-chinh-tri-hoc-va-quan-he-quoc-te.html",
                                        "_blank"
                                    )
                                }
                                className="box-khoa-more"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Xem thêm
                            </div>
                        </div>
                    </div>
                    <div
                        className="box-khoa"
                        style={{
                            animation: "right-to-left 0.5s 0.3s linear",
                            animationTimeline: "view()",
                            animationFillMode: "both",
                            animationRange: "entry 0% cover 40%",
                        }}
                    >
                        <div className="box-khoa-info">
                            <div
                                className="box-khoa-logo"
                                style={{
                                    background: `url('${API_BASE_URL}/api/stream/public?path=kkh.png') no-repeat center center / cover`,
                                }}
                            ></div>
                            <div
                                onClick={() =>
                                    window.open(
                                        "https://tbu.edu.vn/khoa-khoa-hoc-co-ban.html",
                                        "_blank"
                                    )
                                }
                                className="box-khoa-more"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Xem thêm
                            </div>
                        </div>
                        <div className="box-khoa-description0">
                            <h2>Khoa Khoa học cơ bản</h2>
                            <p>
                                Khoa Khoa học Cơ bản của Trường Đại học Thái
                                Bình là đơn vị đào tạo và nghiên cứu chuyên sâu
                                về các lĩnh vực khoa học cơ bản, đóng vai trò
                                quan trọng trong việc cung cấp kiến thức nền
                                tảng cho sinh viên toàn trường.
                            </p>
                        </div>
                    </div>
                    <div
                        className="box-khoa"
                        style={{
                            animation: "left-to-right 0.5s 0.3s linear",
                            animationTimeline: "view()",
                            animationFillMode: "both",
                            animationRange: "entry 0% cover 40%",
                        }}
                    >
                        <div className="box-khoa-description1">
                            <h2>Khoa Kinh tế và Quản trị</h2>
                            <p>
                                Khoa Kinh tế và Quản trị của Trường Đại học Thái
                                Bình là một trong những đơn vị đào tạo trọng
                                điểm, chuyên cung cấp nguồn nhân lực chất lượng
                                cao trong các lĩnh vực kinh tế và quản trị kinh
                                doanh. Khoa hiện đào tạo các chuyên ngành như
                                Quản trị kinh doanh, Tài chính – Ngân hàng, Kế
                                toán và Marketing.
                            </p>
                        </div>
                        <div className="box-khoa-info">
                            <div
                                className="box-khoa-logo"
                                style={{
                                    background: `url('${API_BASE_URL}/api/stream/public?path=kkt.png') no-repeat center center / cover`,
                                }}
                            ></div>
                            <div
                                onClick={() =>
                                    window.open(
                                        "https://tbu.edu.vn/khoa-kinh-te-va-quan-tri.html",
                                        "_blank"
                                    )
                                }
                                className="box-khoa-more"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Xem thêm
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-show-slider">
                    <div className="box-slider" ref={boxSliderRef}>
                        {imgList.map((data, index) => (
                            <div
                                key={index}
                                className={`slider slider${
                                    index + 1
                                } f${index} ${
                                    activeIndex === index ? "active" : ""
                                }`}
                                style={{
                                    background: `url(${data})`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                }}
                            ></div>
                        ))}
                    </div>
                    <ul className="box-dots">
                        {imgList.map((data, index) => (
                            <li
                                key={index}
                                className={
                                    activeIndex === index ? "active" : ""
                                }
                                onClick={() => handleClick(index)}
                            >
                                <span></span>
                            </li>
                        ))}
                    </ul>
                </div>
                <footer
                    className="home-footer"
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
                                Địa chỉ: Thôn Dinh, Xã Tân Bình, Thành phố Thái
                                Bình, Tỉnh Thái Bình
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
                                <span>©</span>Bản quyền thuộc về Trường Đại học
                                Thái Bình
                            </li>
                        </ul>
                        <div className="home-footer-head-item2">
                            <span>THÔNG TIN TRƯỜNG</span>
                            <ul>
                                <li>Giới thiệu</li>
                                <li>Lịch sử hình thành</li>
                                <li>Tin tức & sự kiện</li>
                                <li>Liên hệ</li>
                            </ul>
                        </div>
                    </div>
                    <div className="home-footer-mid">
                        <div className="home-footer-mid-item">
                            <span>CHÍNH SÁCH</span>
                            <ul>
                                <li>Tìm kiếm</li>
                                <li>Giới thiệu</li>
                                <li>Điều khoản dịch vụ</li>
                                <li>Chính sách bảo mật</li>
                                <li>Liên hệ</li>
                            </ul>
                        </div>
                        <div className="home-footer-mid-item">
                            <span>THỜI GIAN LÀM VIỆC</span>
                            <ul>
                                <li>
                                    Thứ Hai - Thứ Bảy: 7:00 - 17:00 (Nghỉ Chủ
                                    nhật và các ngày lễ, Tết theo quy định){" "}
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
