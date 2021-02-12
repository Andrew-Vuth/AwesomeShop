if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejs = require("ejs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

// Passport config
require("./config/passport")(passport);

// All Routes Path

const indexRoute = require("./routes/indexRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const product_adminRoute = require("./routes/product_adminRoute");

// Setting up Views

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Body parser
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect flash
app.use(flash());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  // res.locals.error_msg = req.flash("error_msg");
  next();
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Mongoose!"));

// Use Routes

app.use("/", indexRoute);
app.use("/user", authRoute);
app.use("/admin", adminRoute);
app.use("/admin/products", product_adminRoute);

//PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
