import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/productsRouter.js";
import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import sessionRouter from "./routes/sessionRouter.js";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import session from "express-session";
import mongoStore from "connect-mongo";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 14 * 24 * 60 * 60,
        }),
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/session", sessionRouter);

// MongoDB connection
connectDB()
    .then(
        app.listen(process.env.PORT || 8080, () => {
            console.log(`Server running on port ${process.env.PORT || 8080}`);
        }),
    )
    .catch((error) => {
        console.log(`Error al conectar a MongoDB: ${error.message}`);
        process.exit(1);
    });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor",
    });
});
