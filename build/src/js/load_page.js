document.addEventListener("DOMContentLoaded", () => {
    startLoader();
    endLoader();
});

function startLoader() {
    document.querySelector(".overLoader").classList.add("active");
}
function endLoader() {
    const loadingScreen = document.querySelector(".overLoader");
    setTimeout(() => {
        loadingScreen.classList.remove("active");
        setTimeout(() => {
            loadingScreen.classList.remove("active");
        }, 500);
    }, 500);
}

// // Import các hàm encode và decode
// const { encode, decode } = Cryptage;

// // Sử dụng hàm encode và decode
// const input = "Hello, world!";
// const shiftAmount = 5;

// const encoded = encode(input, shiftAmount);
// console.log("Encoded:", encoded);

// const decoded = decode(encoded, shiftAmount);
// console.log("Decoded:", decoded);
