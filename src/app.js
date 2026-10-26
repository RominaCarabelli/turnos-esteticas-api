require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const session = require("express-session");
const sessionStore = require("./config/sessionStore");
const cors = require("cors");
const app = express();
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "https://rominacarabelli.github.io",
  "https://turnos-esteticas-frontend.onrender.com",
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.set("trust proxy", 1);
const servicesRoutes = require("./routes/servicesRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
const activitiesRoutes = require("./routes/activitiesRoutes");

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
app.use("/api/activities", activitiesRoutes);
app.use(errorHandler);

module.exports = app;