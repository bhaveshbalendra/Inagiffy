import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application, json, urlencoded } from "express";
import helmet from "helmet";
import hpp from "hpp";
import corsOptions from "./config/cors.config";
import { Env } from "./config/env.config";
import { handleError } from "./middlewares/error.middleware";
import mapRoutes from "./routes/mapRoutes";

// Express application
const app: Application = express();

app.use(helmet());
app.use(hpp());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
// app.set("trust proxy", 1);

// Rate limiting middleware (global)
// app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));

//Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global Rate Limiter (e.g., 100 requests per minute per IP)
// app.use(createRateLimiter({ windowMs: 60 * 1000, max: 100 }));

// Enable CORS with appropriate configuration
app.use(cors(corsOptions));

//Health Check Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//API Routes
app.use(`${Env.BASE_PATH}/map`, mapRoutes);

app.use(handleError);

// Export the app
export default app;
