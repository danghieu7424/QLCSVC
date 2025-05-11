function toast(title, msg, type) {
    const $ = document.querySelector.bind(document);
    const duration = 3000;

    const main = $("#toast");

    if (main) {
        const toast = document.createElement("div");
        toast.classList.add("toast", `toast--${type}`);

        const removeID = setTimeout(() => {
            main.removeChild(toast);
        }, duration + 1000);

        toast.onclick = (e) => {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(removeID);
            }
        };

        const icons = {
            success: "bx bx-check-circle",
            info: "bx bx-info-circle",
            warning: "bx bx-error-circle",
            error: "bx bx-error",
        };

        const icon = icons[type];

        toast.innerHTML = `
            <div class="toast__icon">
                <i class='${icon}' ></i>
            </div>
            <div class="toast__body">
                <div class="toast__title">${title}</div>
                <div class="toast__msg">${msg}</div>
            </div>
            <div class="toast__close">
                <i class='bx bx-x-circle'></i>
            </div>
        `;

        main.appendChild(toast);
    }
}

const images = document.querySelectorAll(".imgsrc img");
let currentIndex = 0;

function showImage(index) {
    const totalImages = images.length;

    images.forEach((img) => {
        img.style.transform = "translateX(100%)";
        img.style.zIndex = "0";
    });

    images[index].style.transform = "translateX(0)";
    images[index].style.zIndex = "1";

    if (index - 1 >= 0) {
        images[index - 1].style.transform = "translateX(-100%)";
        images[index - 1].style.zIndex = "0";
    }

    if (index + 1 < totalImages) {
        images[index + 1].style.transform = "translateX(100%)";
        images[index + 1].style.zIndex = "0";
    }
}

setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}, 3000);

document.querySelector(".backward").addEventListener("click", () => {
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(previousIndex);
    currentIndex = previousIndex;
});

document.querySelector(".forward").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
});

showImage(currentIndex);

const lable = document.querySelectorAll(".box_login lable").forEach((lable) => {
    lable.innerHTML = lable.innerText
        .split("")
        .map(
            (letters, i) =>
                `<span style="transition-delay: ${i * 50}ms">${letters}</span>`
        )
        .join("");
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("table th").forEach((th) => {
        th.addEventListener("click", () => {
            if (th.classList.contains("active")) {
                th.classList.remove("active");
            } else {
                document.querySelectorAll("table th").forEach((otherTh) => {
                    otherTh.classList.remove("active");
                });
                th.classList.add("active");
            }
        });
    });
});
