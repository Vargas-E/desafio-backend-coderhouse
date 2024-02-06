const express = require("express");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const homeRouter = require("./routes/views.router.js");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// init server
const httpServer = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

// handlebars config
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

// static files folder
app.use(express.static("./src/public"));

// routes
// NOTA: Como se pedia que el websocket solo funcione dentro de la ruta asignada /realtimeproducts, se paso la logica
// de socket a homeRouter y se busco como pasar un argumento como parte del req.
app.use(
  "/",
  (req, res, next) => {
    req.httpServer = httpServer;
    next();
  },
  homeRouter
);
