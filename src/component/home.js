import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import '../assets/css/home.css';

function Home() {

    const navRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (event) => {
        setIsDragging(false);
        navRef.current.startX = event.clientX;
    };

    const handleMouseMove = (event) => {
        if (!isDragging && Math.abs(event.clientX - navRef.current.startX) > 5) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = (event) => {
        if (!isDragging) {
            return;
        }
        event.preventDefault();
        setIsDragging(false);
    };


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

    useEffect(() => {
        const interval = setInterval(slideImages, 4000);
        return () => clearInterval(interval);
    }, []);



    const Layout = () => {
        const location = useLocation();

        const renderContent = () => {
            switch (location.pathname) {
                case "/":
                    return (
                        <div className="home_container">
                            <div className="home_page1">
                                <div className="box_home_text">
                                    <h1>Website quản lý cơ sở vật chất</h1>
                                    <h1>Khoa Công nghệ và Kỹ thuật</h1>
                                    <p>
                                        Đem lại tiện ích, đồng bộ hóa dữ liệu, cập nhật thông tin nhanh chóng, chính xác,
                                        tiết kiệm thời gian, chi phí mang lại hiệu quả khi sử dụng.
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
                            </div>
                        </div>
                    );
                case "/lich-su":
                    return (
                        <div className="home_container">
                            <div className="page gt_kcn-kt" id="page2">
                                <h1>Giới thiệu về khoa Công nghệ và Kỹ thuật</h1>
                                <div>
                                    <p>
                                        Khoa Công nghệ và kỹ thuật trường Đại học Thái Bình được thành lập theo quyết định
                                        số 912/QĐ-ĐHTB ngày 28/12/2023 của Hiệu trưởng Trường Đại học Thái Bình. Khoa được
                                        thành lập trên cơ sở sát nhập ba đơn vị: khoa Công nghệ, khoa Điện – Điện tử và khoa
                                        Công nghệ thông tin. Lĩnh vực Công nghệ và kỹ thuật mà Khoa đảm nhiệm đào tạo gắn
                                        liền với lịch sử hình thành và sự phát triển lớn mạnh của Trường Đại học Thái Bình.
                                    </p>
                                    <p>
                                        Hiện nay khoa Công nghệ và kỹ thuật đang đào tạo nguồn nhân lực chất lượng cao về
                                        lĩnh vực Công nghệ kỹ thuật cơ khí, công nghệ Cơ điện tử, Công nghệ chế tạo máy,
                                        công nghệ Ô tô, công nghệ Điện lạnh, Điện công nghiệp, Điện tử công nghiệp, Cung cấp
                                        điện, Điện tử viễn thông, Công nghệ thông tin, Khoa học máy tính, An toàn thông tin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                case "/nganh-cntt":
                    return (
                        <div className="home_container">
                            <div className="page nganh" id="page3">
                                <div className="page--title">
                                    <h1>Ngành</h1>
                                    <h1>Công nghệ Thông Tin</h1>
                                </div>
                                <div className="page--document">
                                    <p>
                                        Ngành Công nghệ Thông tin tập trung vào việc đào tạo các kỹ sư chuyên về phát triển phần mềm, hệ thống mạng, an ninh mạng và trí tuệ nhân tạo. Sinh viên sẽ được trang bị kiến thức cơ bản và chuyên sâu về lập trình, cơ sở dữ liệu, phát triển ứng dụng và quản trị hệ thống, giúp họ tự tin bước vào thị trường lao động năng động và đầy thử thách.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                case "/nganh-ddt":
                    return (
                        <div className="home_container">

                            <div className="page nganh" id="page4">
                                <div className="page--title">
                                    <h1>Ngành</h1>
                                    <h1>Điện-Điện tử</h1>
                                </div>
                                <div className="page--document">
                                    <p>
                                        Ngành Kỹ thuật Điện - Điện tử cung cấp cho sinh viên các kiến thức về mạch điện, hệ thống điều khiển tự động, điện tử công suất và truyền thông. Sinh viên sẽ được học cách thiết kế, lắp đặt và bảo trì các hệ thống điện - điện tử trong các ngành công nghiệp, dịch vụ và dân dụng, góp phần đáp ứng nhu cầu nhân lực kỹ thuật cao trong xã hội hiện đại.
                                    </p>
                                </div>
                            </div>

                        </div>
                    );
                case "/nganh-kt":
                    return (
                        <div className="home_container">

                            <div
                                className="page nganh nganhEnd"

                                id="page5"
                            >
                                <div className="page--title">
                                    <h1>Ngành</h1>
                                    <h1>Kỹ thuật cơ khí</h1>
                                </div>
                                <div className="page--document">
                                    <p>
                                        Ngành Kỹ thuật Cơ khí đào tạo các kỹ sư có khả năng thiết kế, chế tạo và vận hành các thiết bị cơ khí, máy móc công nghiệp. Sinh viên sẽ được học về cơ học, vật liệu, công nghệ chế tạo và kỹ thuật gia công, giúp họ nắm vững các quy trình sản xuất và ứng dụng công nghệ mới vào thực tiễn sản xuất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="home_container">
                            <h1>404 - Không tìm thấy nội dung</h1>
                        </div>
                    );
            }
        };

        return (
            <>
                {/* Header */}
                <header
                    className="mini_nav"
                    ref={navRef}
                >
                    <ul
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <li className={location.pathname === "/" ? "selected" : ""}>
                            <Link to="/">Thông Tin</Link>
                        </li>
                        <li className={location.pathname === "/lich-su" ? "selected" : ""}>
                            <Link to="/lich-su">Lịch Sử</Link>
                        </li>
                        <li className={location.pathname === "/nganh-cntt" ? "selected" : ""}>
                            <Link to="/nganh-cntt">Ngành Công Nghệ Thông Tin</Link>
                        </li>
                        <li className={location.pathname === "/nganh-ddt" ? "selected" : ""}>
                            <Link to="/nganh-ddt">Ngành Công Nghệ Kỹ Thuật Điện Điện Tử</Link>
                        </li>
                        <li className={location.pathname === "/nganh-kt" ? "selected" : ""}>
                            <Link to="/nganh-kt">Ngành Công Nghệ Kỹ Thuật Cơ Khí</Link>
                        </li>
                    </ul>
                </header>


                {/* Nội dung */}
                {renderContent()}
            </>
        );
    };



    return (
        <div className='box_home_page'>
            <div id="Home_page">
                <div className='box_home'>
                    <Layout />
                </div>

                <div className="home_connection">
                    <ul>
                        <li><a href="https://tbu.edu.vn/" target="_blank" rel="noopener noreferrer">
                            Trường Đại học Thái Bình
                        </a></li>
                    </ul>
                </div>

            </div>
            <footer
                className="box_home_footer"
            >

                <div className="box_home_info_footer">
                    <div className="box_home_info-left">
                        <h2>Liên hệ với chúng tôi:</h2>
                        <div>
                            <i className="bx bx-map"></i>
                            <i>
                                xã Tân Bình, thành phố Thái Bình,
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
                            Nghỉ ngày Chủ Nhật và các ngày lễ, Tết theo quy
                            định
                        </i>
                    </div>
                </div>
                <div className="box_home_end">
                    <i className="bx bx-copyright"></i>
                    <i>
                        Bản quyền thuộc về Khoa Công nghệ và Kỹ thuật | Trường
                        Đại Học Thái Bình
                    </i>
                </div>
            </footer>
        </div>

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



const listNganh = [
    {
        page: "/CNTT/phong",
        title: "Phòng Máy CNTT",
    },
    {
        page: "/D_DT/phong",
        title: "Xưởng CNKT Điện Điện Tử",
    },
    {
        page: "/KTCK/phong",
        title: "Xưởng CNKT Cơ Khí",
    },
];
const listTB = [
    {
        page: "/ChuyenThietBi",
        title: "Chuyển Thiết Bị",
    },
    {
        title: "Mua Thiết Bị",
        subItems: [
            { page: "/MuaThietBi/Kho", title: "Kho" },
            { page: "/MuaThietBi/VanBan", title: "Văn bản" },
        ],
    },
    {
        title: "Thanh Lý Thiết Bị",
        subItems: [
            { page: "/ThanhLyThietBi/ThongKe", title: "Thống kê" },
            { page: "/ThanhLyThietBi/VanBan", title: "Văn bản" },
        ],
    },
];


import { useAuth } from './authContext.js';

function Header({ toggleMenu, isMenuActive }) {
    const img_logo = '/src/img/Logo-Truong-Dai-hoc-Thai-Binh.png';
    const avatar = "/src/img/avatar/avatar.jpg"
    const { userData, login, logout } = useAuth();
    const [isActive, setIsActive] = useState(false);
    const history = useHistory();

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



    const handleAvatarClick = () => {
        setIsActive(prevState => !prevState);
    };

    const handleSignOut = () => {
        logout();
        window.location.reload();
    };

    const handleChangePassword = () => {
        history.push("/change-password");
    }

    const handleInfoClick = () => {
        history.push("/info");
        setIsActive(prevState => !prevState);
    }

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
                            <Link to="/" >
                                <abbr title="Giới thiệu"> Giới thiệu </abbr>
                            </Link>
                        </span>
                    </li>
                    <li>
                        <span className="box__header__title--hover">
                            <Link to="/tong-quan" >
                                <abbr title="Tổng quan"> Tổng quan </abbr>
                            </Link>
                        </span>
                    </li>
                    {userData?.role &&
                        (
                            <>
                                {userData.role === 'admin' && (
                                    <li>
                                        <span className="box__header__title--hover">
                                            <Link to="/can-bo">
                                                <abbr title="Cán bộ"> Cán bộ </abbr>
                                            </Link>
                                        </span>
                                    </li>
                                )}
                                <li>
                                    <span className="box__header__title--hover">
                                        <abbr title="Phòng Xưởng"> Phòng Xưởng </abbr>
                                        <i className="bx bx-chevron-down"></i>
                                    </span>
                                    <div className="more">
                                        <ul>
                                            {listNganh.map((cos, index) => {
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
                                    <span className="box__header__title--hover">
                                        <abbr title="Thiết Bị"> Thiết Bị </abbr>
                                        <i className="bx bx-chevron-down"></i>
                                    </span>
                                    <div className="more">
                                        <ul>
                                            {listTB.map((cos, index) => (
                                                <li key={index}>
                                                    {cos.page ? (
                                                        <Link to={cos.page} className="option">{cos.title}</Link>
                                                    ) : (
                                                        <>
                                                            <span className="has-submenu option" >{cos.title}</span>
                                                            {cos.subItems && (
                                                                <ul className="sub-menu">
                                                                    {cos.subItems.map((sub, subIndex) => (
                                                                        <ListURL
                                                                        key={subIndex}
                                                                        url={sub.page}
                                                                        className="option"
                                                                        title={sub.title}
                                                                    />
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </>
                        )
                    }
                    
                </ul>
            </div>
            <div className="box__header__login">
                {userData ?
                    <>
                        <ul>
                            <li className="box__avatar" onClick={handleAvatarClick}>
                                <img src={avatar} alt="avatar" />
                            </li>
                        </ul>
                        <div id="box_info_user" className={isActive ? 'active' : ''}>
                            <svg className="item-cursor" height="12" viewBox="0 0 21 12" width="21"
                                fill="var(--color-black-pure-alpha-10)" style={{ transform: 'scale(-1, -1) translate(0px, 0px)' }}>
                                <path d="M21 0c-2.229.424-4.593 2.034-6.496 3.523L5.4 10.94c-2.026 2.291-5.434.62-5.4-2.648V0h21Z">
                                </path>
                            </svg>
                            <div className="info_user">
                                <div className="box_img"
                                    onClick={handleInfoClick}
                                >
                                    <img src={avatar} alt="avatar" />
                                </div>
                                <div className="box_text_user">
                                    <span id="ID_user">{userData?.name}</span>
                                    <span className="role_user">{userData?.role}</span>
                                </div>
                            </div>
                            <div className='sign_out'>
                                <button onClick={handleChangePassword}>
                                    <i className='bx bx-edit-alt' ></i>
                                    Change password
                                </button>
                                <button onClick={handleSignOut}>
                                    <i className='bx bx-log-out'></i>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </>
                    :
                    <ul>
                        <li>
                            <Link to="/login"> login </Link>
                        </li>
                    </ul>
                }
            </div>
        </header>
    );
}

function Navigation() {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const { userData, login } = useAuth();
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

    const toggleMenu = () => {
        setIsMenuActive((prevState) => !prevState);
    };

    return (
        <>
            <Header toggleMenu={toggleMenu} isMenuActive={isMenuActive} />
            <nav className={`navigation ${isMenuActive ? "active" : ""}`}>
                <ul className="box__nav__title">
                    <li>
                        <span className="box__nav__title--hover" style={{ borderBottom: '1px solid' }}>
                            <Link to="/" className='source_home' onClick={toggleMenu} style={{ color: '#111' }}>
                                <abbr title="Giới thiệu"> Giới thiệu </abbr>
                            </Link>
                        </span>

                    </li>
                    <li>
                        <span className="box__nav__title--hover" style={{ borderBottom: '1px solid' }}>
                            <Link to="/tong-quan" className='source_home' onClick={toggleMenu} style={{ color: '#111' }}>
                                <abbr title="Tổng quan"> Tổng quan </abbr>
                            </Link>
                        </span>

                    </li>
                    
                    {userData?.role &&
                        (
                            <>
                                {userData.role === 'admin' && (
                                    <li>
                                        <span className="box__nav__title--hover" style={{ borderBottom: '1px solid' }}>
                                            <Link to="/can-bo" className='source_home' onClick={toggleMenu} style={{ color: '#111' }}>
                                                <abbr title="Cán bộ"> Cán bộ </abbr>
                                            </Link>
                                        </span>

                                    </li>
                                )}
                                <li>
                                    <span className="box__nav__title--hover">
                                        <i className="bx bx-chevron-down"></i>
                                        <abbr title="Phòng Xưởng"> Phòng Xưởng </abbr>
                                    </span>
                                    <div className="more">
                                        <ul>
                                            {listNganh.map((cos, index) => {
                                                return (
                                                    <ListURL
                                                        key={index}
                                                        url={cos.page}
                                                        className="nav__option"
                                                        title={cos.title}
                                                        onClick={toggleMenu}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <span className="box__nav__title--hover">
                                        <i className="bx bx-chevron-down"></i>
                                        <abbr title="Thiết Bị"> Thiết Bị </abbr>
                                        
                                    </span>
                                    <div className="more">
                                        <ul>
                                            {listTB.map((cos, index) => (
                                                <li key={index}>
                                                    {cos.page ? (
                                                        <Link to={cos.page} className="nav__option" style={{zIndex: '100'}}>{cos.title}</Link>
                                                    ) : (
                                                        <>
                                                            <span className="has-submenu nav__option" >{cos.title}</span>
                                                            {cos.subItems && (
                                                                <ul className="sub-menu">
                                                                    {cos.subItems.map((sub, subIndex) => (
                                                                        <ListURL
                                                                        key={subIndex}
                                                                        url={sub.page}
                                                                        className="nav__option"
                                                                        title={sub.title}
                                                                        onClick={toggleMenu}
                                                                    />
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            </>
                        )
                    }
                </ul>
            </nav>
        </>
    );
}

export { Header, Home, Navigation };
