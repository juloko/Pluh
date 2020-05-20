const fs = require('fs');

module.exports = async function readDebugPage() {
    return await new Promise((resolve, reject) => {
        fs.readFile('./debug/output.json', 'utf8', (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = async function writeDebugPage(content) {
    return await new Promise((resolve, reject) => {
        fs.writeFile("./debug/output.json", content, 'utf8', (err) => {
            if (!err) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}