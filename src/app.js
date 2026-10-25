require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const session = require("express-session");
const sessionStore = require("./config/sessionStore");
const app = express();
app.set("trust proxy", 1);
const servicesRoutes = require("./routes/servicesRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "API de Agenda de Turnos funcionando correctamente.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use(errorHandler);

module.exports = app;