var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("express-flash");
var session = require("express-session");
const MemoryStore = require("session-memory-store")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var pemeilikRouter = require("./routes/pemilik");
var dpiRouter = require("./routes/dpi");
var alatRouter = require("./routes/alat");
var kapalRouter = require("./routes/kapal");
var superusersRouter = require("./routes/superusers");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    cookie: {
      maxAge: 60000000000,
      secure: false,
      httpOnly: true,
      sameSite: "strict",
      // domain: 'domainkkitananti.com',
    },
    store: new MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "secret",
  })
);

app.use(flash());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/pemilik", pemeilikRouter);
app.use("/dpi", dpiRouter);
app.use("/alat", alatRouter);
app.use("/kapal", kapalRouter);
app.use("/superusers", superusersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
