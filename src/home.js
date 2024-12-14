import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Switch, Link, useLocation, useHistory } from 'react-router-dom';
import Cryptage from './assets/modules/Cryptage.js';

function Home() {
    const location = useLocation();
    const history = useHistory();
    const pageRefs = {
        page1: useRef(null),
        page2: useRef(null),
        page3: useRef(null),
        page4: useRef(null),
        page5: useRef(null),
        page6: useRef(null),
    };
    const rollUpButtonRef = useRef(null);

    const images = [
        "./src/img/img/tbu0.png",
        "./src/img/img/277741301_403721375087452_6058591383061904889_n.jpg",
        "./src/img/img/315086295_574197421373179_578075313364114677_n.jpg",
        "./src/img/img/354062663_742263647899888_9052663520915940561_n.jpg",
        "./src/img/img/359815773_760353849424201_4766179409589887923_n.jpg",
        "./src/img/img/403710390_848096480649937_444453323054382538_n.jpg",
        "./src/img/img/403714219_847948653998053_355582356716653193_n.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const slideImages = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const targetPosition = section.offsetTop;

            if (sectionId === "page1") {
                window.scrollTo({
                    top: targetPosition - 4 * 16,
                    behavior: "smooth",
                });
            } else {
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                });
            }
        }
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const targetSection = queryParams.get("p");

        if (targetSection) {
            scrollToSection(Cryptage.decode(targetSection));
        }
    }, [location.search]);

    useEffect(() => {
        const interval = setInterval(slideImages, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const rollUpButton = rollUpButtonRef.current;

        const handleScroll = () => {
            if (window.scrollY > 0) {
                rollUpButton.classList.add("active");
            } else {
                rollUpButton.classList.remove("active");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleClick = () => {
        history.push({
            state: { targetSection: "page1" },
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <section id="section__introduce">
            <header
                className="page box_home_header"
                ref={pageRefs.page1}
                id="page1"
            >
                <div className="box_home_text">
                    <h1>Quản lý cơ sở vật chất khoa</h1>
                    <h1>Công nghệ và Kỹ thuật</h1>
                    <p>
                        Đem lại sự tiện ích, đồng bộ hóa dữ liệu cập nhật thông
                        tin nhanh chóng, tiết kiệm thời gian và mang lại hiệu
                        quả khi sử dụng.
                    </p>
                </div>
                <div className="box_home_img">
                    <div className="image">
                        {images.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Slide ${index}`}
                                style={{
                                    zIndex: index === currentIndex ? 1 : 0,
                                    transform:
                                        index === currentIndex
                                            ? "translateX(0)"
                                            : index < currentIndex
                                                ? "translateX(-100%)"
                                                : "translateX(100%)",
                                    transition: "transform 1s ease",
                                }}
                            />
                        ))}
                    </div>
                </div>
            </header>
            <div className="page gt_kcn-kt" ref={pageRefs.page2} id="page2">
                <h1>Giới thiệu về khoa Công nghệ và Kỹ thuật</h1>
                <div>
                    <p>
                        Khoa Công nghệ và kỹ thuật trường Đại học Thái Bình được
                        thành lập theo quyết định số 912/QĐ-ĐHTB ngày 28/12/2023
                        của Hiệu trưởng Trường Đại học Thái Bình. Khoa được
                        thành lập trên cơ sở sát nhập ba đơn vị: khoa Công nghệ,
                        khoa Điện – Điện tử và khoa Công nghệ thông tin. Lĩnh
                        vực Công nghệ và kỹ thuật mà Khoa đảm nhiệm đào tạo gắn
                        liền với lịch sử hình thành và sự phát triển lớn mạnh
                        của Trường Đại học Thái Bình.
                    </p>
                    <p>
                        Hiện nay khoa Công nghệ và kỹ thuật đang đào tạo nguồn
                        nhân lực chất lượng cao về lĩnh vực Công nghệ kỹ thuật
                        cơ khí, công nghệ Cơ điện tử, Công nghệ chế tạo máy,
                        công nghệ Ô tô, công nghệ Điện lạnh, Điện công nghiệp,
                        Điện tử công nghiệp, Cung cấp điện, Điện tử viễn thông,
                        Công nghệ thông tin, Khoa học máy tính, An toàn thông
                        tin. Cán bộ và sinh viên Khoa Công nghệ và Kỹ thuật luôn
                        đóng vai trò lòng cốt trong đào tạo, nghiên cứu khoa học
                        và chuyển giao công nghệ nhằm đáp ứng nhu cầu công
                        nghiệp hóa và hiện đại hóa của đất nước.
                    </p>
                </div>
            </div>
            <div className="page nganh" ref={pageRefs.page3} id="page3">
                <div className="page--title">
                    <h1>Ngành</h1>
                    <h1>Công nghệ Thông Tin</h1>
                </div>
                <div className="page--document">
                    <p>
                        Trong khoa Công nghệ và kỹ thuật của Đại học Thái Bình
                        ngành công nghệ thông tin là 1 trong những chuyên ngành
                        được quan tâm và chú trọng nhất hiện nay. Với trang
                        thiết bị hiện đại cùng đội ngũ giảng viên giàu kinh
                        nghiệm tạo lên môi trường chuyên nghiệp với ngành công
                        nghệ thông tin. Trong thị trường công nghệ tiếp cận 5.0
                        hiện nay chúng tôi cam kết đào tạo ra nguồn nhân lực đảm
                        bảo chất lượng trong thị trường hiện nay và trong tương
                        lai gần phát triển và đấy mạnh chuyên ngành phát triển
                        vượt bậc cùng môi trường học tập và làm việc ngày càng
                        hiện đại với Khoa công nghệ kỹ thuật nói chung và Ngành
                        Công nghệ thông tin nói riêng ngày càng phát triển.
                    </p>
                </div>
            </div>
            <div className="page nganh" ref={pageRefs.page4} id="page4">
                <div className="page--title">
                    <h1>Ngành</h1>
                    <h1>Điện-Điện tử</h1>
                </div>
                <div className="page--document">
                    <p>
                        Ngành Điện-Điện tử hiện nay của khoa công nghệ và kỹ
                        thuật hiện nay của trường đại học thái bình là ngành
                        được các doanh nghiệp để ý và quan tâm nhiều nhất. Do
                        nhu cầu đặt hàng và hoạt động của công ty và doanh
                        nghiệp ngày càng gia tăng các chuyên môn ngành Điện -
                        Điện tử càng cấp thiết về chất lượng và số lượng càng
                        tăng cao. Vì vậy ngành Điện-Điện tử của khoa Công nghệ
                        kỹ thuật đã dành được sự chú ý và quan tâm của các doanh
                        nghiệp, cùng với đội ngũ giảng viên nhiều chuyên môn
                        cùng các trang thiết bị đào tạo hiện đại nhà trường sẽ
                        đáp ứng cho doanh nghiệp nguồn lực đảm bảo chất lượng về
                        chuyên môn cho các doanh nghiệp trong và ngoài tính của
                        các doanh nghiệp và đảm bảo đầu ra cho các sinh viên sau
                        khi tốt nghiệp.
                    </p>
                </div>
            </div>
            <div
                className="page nganh nganhEnd"
                ref={pageRefs.page5}
                id="page5"
            >
                <div className="page--title">
                    <h1>Ngành</h1>
                    <h1>Kỹ thuật cơ khí</h1>
                </div>
                <div className="page--document">
                    <p>
                        Ngành kỹ thuật cơ khí của khoa Công nghệ - thuật hiện
                        nay là 1 trong những ngành đang được sinh viên quan tâm
                        và tìm hiểu. Trong thời đại hướng đến công nghệ hiện nay
                        ngành cơ khi đang được hướng đến. Cùng với đó việc yêu
                        cầu về trình độ và kỹ năng ngày càng được chú trọng. Để
                        đáp ứng những yêu cầu của thị trường hiện nay ngành cơ
                        khí của khoa công nghệ kỹ thuật sẽ đáp ứng được những
                        yêu cầu đó với nhiều trang thiết bị hiện đại và giảng
                        viên với nhiều năm kinh nghiệm. Nhà trường sẽ đảm bảo
                        đầu ra của sinh viên trong ngành sẽ có đủ những yêu cầu
                        về kỹ thuật và chuyên môn để đáp ứng được như cầu của
                        thị trường việc làm hiện nay.
                    </p>
                </div>
            </div>
            <footer
                className="page box_home_footer"
                ref={pageRefs.page6}
                id="page6"
            >
                <div className="box_home_text_footer">
                    <h1>Liên hệ với khoa Công nghệ và Kỹ thuật</h1>
                    <p>
                        Chào mừng bạn đến với khoa Công nghệ và Kỹ thuật -
                        Trường Đại học Thái Bình! Chúng tôi sẵn sàng giải đáp
                        mọi thắc mắc và đồng hành cùng bạn trong quá trình sử
                        dụng trang web. Hãy liên hệ với chúng tôi bất kỳ lúc nào
                        bạn cần!
                    </p>
                    <p>
                        Khoa Công nghệ và Kỹ thuật luôn chào đón bạn và cam kết
                        hỗ trợ hết mình.
                    </p>
                </div>
                <div className="box_home_info_footer">
                    <div className="box_home_info-left">
                        <h2>Liên hệ với chúng tôi:</h2>
                        <div>
                            <i className="bx bx-map"></i>
                            <i>
                                thôn Dinh, xã Tân Bình, thành phố Thái Bình,
                                Thái Bình
                            </i>
                        </div>
                        <div>
                            <i className="bx bx-phone"></i>
                            <i>098 969 17 56</i>
                        </div>
                        <div>
                            <i className="bx bx-envelope"></i>
                            <i>dhtb@gmail.com</i>
                        </div>
                    </div>
                    <div className="box_home_info-right">
                        <h2>Thời gian làm việc:</h2>
                        <i>Thứ Hai - Thứ Bảy: 7:00 - 17:00</i>
                        <i>
                            (Nghỉ ngày Chủ Nhật và các ngày lễ, Tết theo quy
                            định)
                        </i>
                    </div>
                </div>
                <div className="box_home_end">
                    <i className="bx bx-copyright"></i>
                    <i>
                        Bản quyền thuộc về khoa Công nghệ và Kỹ thuật | Trường
                        Đại Học Thái Bình
                    </i>
                </div>
            </footer>
            <div
                id="roll_up"
                ref={rollUpButtonRef}
                onClick={handleClick}
                className="roll-up-button"
            >
                <i className="bx bx-first-page bx-rotate-90"></i>
            </div>
        </section>
    );
}

function List({ url = "", className, page, title, onClick = () => { } }) {
    const queryParamUrl = `${url || "/"}?p=${encodeURIComponent(page)}`;
    return (
        <li>
            <Link
                to={queryParamUrl}
                className={className}
                onClick={onClick}
            >
                {title}
            </Link>
        </li>
    );
}

function ListURL({ url = "", className, title, onClick = () => { } }) {
    return (
        <li>
            <Link
                to={url}
                className={className}
                onClick={onClick}
            >
                {title}
            </Link>
        </li>
    );
}

const listHome = [
    {
        page: "cGFnZTE",
        title: "Trang chủ",
    },
    {
        page: "cGFnZTI",
        title: "Giới thiệu khoa",
    },
    {
        page: "cGFnZTM",
        title: "Ngành CNTT",
    },
    {
        page: "cGFnZTQ",
        title: "Ngành Đ-ĐT",
    },
    {
        page: "cGFnZTU",
        title: "Ngành KTCK",
    },
    {
        page: "cGFnZTY",
        title: "Liên hệ",
    },
];

const listCNTT = [
    {
        page: "/CNTT/phong",
        title: "Phòng",
    },
    {
        page: "/CNTT/tai_san",
        title: "Tài Sản",
    },
    {
        page: "/CNTT/thanh_ly_tai_san",
        title: "Thanh Lý Tài Sản",
    },
];
const listDDTU = [
    {
        page: "/D_DT/phong",
        title: "Phòng",
    },
    {
        page: "/CNTT/tai_san",
        title: "Tài Sản",
    },
    {
        page: "/CNTT/thanh_ly_tai_san",
        title: "Thanh Lý Tài Sản",
    },
];
const listKTCK = [
    {
        page: "/KTCK/phong",
        title: "Phòng",
    },
    {
        page: "/CNTT/tai_san",
        title: "Tài Sản",
    },
    {
        page: "/CNTT/thanh_ly_tai_san",
        title: "Thanh Lý Tài Sản",
    },
];

function Header({ toggleMenu, isMenuActive }) {
    const img_logo = '/src/img/Logo-Truong-Dai-hoc-Thai-Binh.png';

    return (
        <header className="box__header">
            <div className="box__header__embrace">
                <div
                    className={`menu-btn ${isMenuActive ? "active" : ""}`}
                    onClick={toggleMenu}
                >
                    <div className="menu__line--btn1"></div>
                    <div className="menu__line--btn2"></div>
                    <div className="menu__line--btn3"></div>
                </div>
                <ul className="box__header__logo">
                    <li>
                        <a href="/" id="box__logo">
                            <img
                                src={img_logo}
                                alt="logo"
                            />
                        </a>
                    </li>
                </ul>
                <ul className="box__header__title">
                    <li>
                        <span className="box__header__title--hover">
                            <abbr title="Giới thiệu"> Giới thiệu </abbr>
                            <i className="bx bx-chevron-down"></i>
                        </span>
                        <div className="more">
                            <ul>
                                {listHome.map((cos) => {
                                    return (
                                        <List
                                            key={cos.page}
                                            url="/"
                                            className="option"
                                            page={cos.page}
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span href="" className="box__header__title--hover">
                            <abbr title="Công nghệ Thông tin"> CNTT </abbr>
                            <i className="bx bx-chevron-down"></i>
                        </span>
                        <div className="more">
                            <ul>
                                {listCNTT.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>

                        <span href="" className="box__header__title--hover">
                            <abbr title="Điện - Điện tử"> Đ-ĐT </abbr>
                            <i className="bx bx-chevron-down"></i>
                        </span>
                        <div className="more">
                            <ul>
                                {listDDTU.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>

                        <span href="" className="box__header__title--hover">
                            <abbr title="Kỹ thuật Cơ khí"> KTCK </abbr>
                            <i className="bx bx-chevron-down"></i>
                        </span>
                        <div className="more">
                            <ul>
                                {listKTCK.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="box__header__login">
                <ul>
                    <li>
                        <a href=""> login </a>
                    </li>
                </ul>
            </div>
        </header>
    );
}

function Navigation() {
    const [isMenuActive, setIsMenuActive] = useState(false);

    const toggleMenu = () => {
        setIsMenuActive((prevState) => !prevState);
    };

    const closeMenu = () => {
        setIsMenuActive(false);
    };

    return (
        <>
            <Header toggleMenu={toggleMenu} isMenuActive={isMenuActive} />
            <nav className={`navigation ${isMenuActive ? "active" : ""}`}>
                <ul className="box__nav__title">
                    <li>
                        <span className="box__nav__title--hover">
                            <i className="bx bx-chevron-down"></i>
                            <abbr title="Giới thiệu"> Giới thiệu </abbr>
                        </span>
                        <div className="more">
                            <ul>
                                {listHome.map((cos) => {
                                    return (
                                        <List
                                            key={cos.page}
                                            url="/"
                                            className="nav__option"
                                            page={cos.page}
                                            title={cos.title}
                                            onClick={closeMenu}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span className="box__nav__title--hover">
                            <i className="bx bx-chevron-down"></i>
                            <abbr title="Công nghệ Thông tin"> CNTT </abbr>
                        </span>
                        <div className="more">
                            <ul>
                                {listCNTT.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="nav__option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span className="box__nav__title--hover">
                            <i className="bx bx-chevron-down"></i>
                            <abbr title="Điện - Điện tử"> Đ-ĐT </abbr>
                        </span>
                        <div className="more">
                            <ul>
                                {listDDTU.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="nav__option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    <li>
                        <span className="box__nav__title--hover">
                            <i className="bx bx-chevron-down"></i>
                            <abbr title="Kỹ thuật Cơ khí"> KTCK </abbr>
                        </span>
                        <div className="more">
                            <ul>
                                {listKTCK.map((cos, index) => {
                                    return (
                                        <ListURL
                                            key={index}
                                            url={cos.page}
                                            className="nav__option"
                                            title={cos.title}
                                        />
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export { Navigation, Home, Header }