npm init
npm install webpack webpack-cli --save-dev
npm install react@17.0.2 react-dom@17.0.2 --save
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react-router-dom@5.3.0
npm install css-loader style-loader --save-dev


Tạo file webpack.config.js tại thư mục gốc của dự án với nội dung sau:
```
const path = require("path");

module.exports = {
  entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
  output: {
    path: path.join(__dirname, "/build"), // Thư mục chứa file được build ra
    filename: "bundle.js" // Tên file được build ra
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
  ]
};
```
Tại thư mục gốc dự án tạo file .babelrc và thêm nội dung sau:
```
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}
```
Tại package.json thêm nội dung sau:
```
"scripts": {
    ...
    "start": "webpack --mode development --watch",
    "build": "webpack --mode production"
}
```

npm install html-webpack-plugin --save-dev
```
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js", // Dẫn tới file index.js ta đã tạo
    output: {
        path: path.join(__dirname, "/build/src/js/"), // Thư mục chứa file được build ra
        filename: "bundle.js" // Tên file được build ra
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
            template: "./public/index.html"
        })
    ]
};
```

npm install webpack-dev-server --save-dev


git add build public src .babelrc package-lock.json package.json readme.md webpack.config.js Readme.md qlcsvc.sql

git branch -M main
git remote add origin https://github.com/danghieu7424/QLCSVC.git
git push -u origin main

git push origin main
git pull origin main
