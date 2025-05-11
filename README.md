library
```
cd backend
npm init -y
npm install --save-dev express multer cors fs-extra path node-cron nodemon jsonwebtoken bcryptjs

cd frontend
npm init -y
npm install --save-dev webpack webpack-cli react@17.0.2 react-dom@17.0.2
npm install @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm install --save-dev react-router-dom@5.3.0 css-loader style-loader html-webpack-plugin webpack-dev-server
npm install --save-dev axios lucide-react
```
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"

tìm lỗi không có trong sql
```
SELECT DISTINCT t.MaHocPhan 
FROM (
    SELECT '003190' AS MaHocPhan UNION ALL
    SELECT '003364' UNION ALL
    SELECT '001928' UNION ALL
    SELECT '000509' UNION ALL
    SELECT '003034' UNION ALL
    SELECT '001904' UNION ALL
    SELECT '003424' UNION ALL
    SELECT '001925' UNION ALL
    SELECT '003447' UNION ALL
    SELECT '001934' UNION ALL
    SELECT '001905' UNION ALL
    SELECT '001907' UNION ALL
    SELECT '000192' UNION ALL
    SELECT '003174' UNION ALL
    SELECT '003194' UNION ALL
    SELECT '001930' UNION ALL
    SELECT '003175' UNION ALL
    SELECT '000640'
) AS t
LEFT JOIN HOCPHAN h ON t.MaHocPhan = h.MaHocPhan
WHERE h.MaHocPhan IS NULL;
```

```
px	    rem
1px	    0.0625rem
2px	    0.125rem
3px	    0.1875rem
4px	    0.25rem
5px	    0.3125rem
6px	    0.375rem
7px	    0.4375rem
8px	    0.5rem
9px	    0.5625rem
10px	0.625rem
11px	0.6875rem
12px	0.75rem
13px	0.8125rem
14px	0.875rem
15px	0.9375rem
16px	1rem
```