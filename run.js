const express = require("express");
const path = require("path");
const outDir = path.resolve("./dist/" || process.env.OUT_DIR);
const app = express();
app.use(express.static(`${outDir}`));

function runCommand() {
  app.get("/", function(req, res) {
    res.sendFile("/index.html");
  });

  app.listen(3000, function() {
    console.log("gitfolio running on port 3000");
    console.log("ctrl + c to exit");
  });
}

module.exports = {
  runCommand
};
