import React, { useEffect, useRef } from "react";

const LoaderPage = () => {
  return (
    <div className="showbox">
      <div className="loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
};

const Loader = () => {
  const loaderRef = useRef(null); // Dùng ref để tham chiếu đến loader
  const wrapperRef = useRef(null); // Dùng ref để tham chiếu đến wrapper

  useEffect(() => {
    function adjustLoaderSize() {
      const { offsetWidth: w, offsetHeight: h } = wrapperRef.current;
      if (w > h) {
        loaderRef.current.style.height = "40%";
        loaderRef.current.style.width = "auto";
      } else {
        loaderRef.current.style.width = "80%";
        loaderRef.current.style.height = "auto";
      }
    }

    adjustLoaderSize();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: "100%", height: "100%" }}>
      <div
        ref={loaderRef}
        id="Loader"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          height: "40%",
          aspectRatio: "2 / 1",
          backgroundRepeat: "no-repeat",
          backgroundImage: `
    radial-gradient(circle closest-side, #858585 80%, #ffffff00),
    radial-gradient(circle closest-side, #858585 80%, #ffffff00),
    radial-gradient(circle closest-side, #858585 80%, #ffffff00)
  `,
          backgroundPosition: "0% 50%, 50% 50%, 100% 50%",
          backgroundSize: "calc(100% / 3) 50%",
          animation: "loader-animate 1s infinite linear !important",
        }}
      ></div>
    </div>
  );
};

export { LoaderPage, Loader };
