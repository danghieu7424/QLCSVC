const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, "/build"), // Thư mục chứa file được build ra
        filename: "bundle.js", // Tên file được build ra
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Sẽ sử dụng babel-loader cho những file .js
                exclude: /node_modules/, // Loại trừ thư mục node_modules
                use: ["babel-loader"]
            },
            {
                test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    // Chứa các plugins sẽ cài đặt trong tương lai
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
            inject: true,
        })
    ],
    devServer: {
        static: path.resolve(__dirname, "public"), // Thư mục tĩnh
        port: 8080, // Cổng chạy server
        open: true, // Mở trình duyệt khi chạy
        hot: true, // Bật chế độ hot-reload
        historyApiFallback: true, // Điều hướng tất cả các route về index.html
    },
};
