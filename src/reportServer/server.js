const express = require("express");
const opn = require("opn");
const path = require("path");
var mustacheExpress = require("mustache-express");

function server(data, baseDir) {
  let serverListener;
  const PORT = 5976; // in scripts we use it to make api calls

  const app = express();
  app.engine("mustache", mustacheExpress());

  app.set("view engine", "mustache");
  app.set("views", __dirname + "/views");
  app.use("/", express.static(path.join(__dirname, "scripts")));

  // respond with "hello world" when a GET request is made to the homepage
  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/api/data", (req, res) => {
    res.json({ ...data, baseDir });
    // close server after it gets data
    setTimeout(() => serverListener.close(), 100);
  });

  serverListener = app.listen(PORT, () => {
    opn(`http://localhost:${PORT}`);
  });
}

module.exports = server;
