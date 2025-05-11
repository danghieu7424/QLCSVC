const fs = require('fs');
const path = require('path');

function writeLog(...message) {
  const logPath = path.join(__dirname, 'log.txt');
  const logMessage = `[${new Date().toISOString()}] ${message.join(' ')}\n`;

  fs.appendFile(logPath, logMessage, (err) => {
    if (err) console.error('Lỗi ghi log:', err);
  });
}

module.exports = writeLog;
