const fs = require('fs');
const {updateHTML} = require('./populate');

fs.readFile("config.json", function (err , data) {
    if (err) throw err;
    data = JSON.parse(data);
    var username = data[0].username;
    if(!username || username == null){
        console.log("username not found in config.json, please run build command before using update");
        return;
    }
    updateHTML(username);
});