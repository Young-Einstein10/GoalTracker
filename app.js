import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/users";
import goalRoutes from "./routes/goals";

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 150 requests,
});

app.use(limiter);

app.use(helmet());
app.use(compression());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

// User Routes
app.use("/api/v1/users", userRoutes);

// Goals
app.use("/api/v1/goals", goalRoutes);

export default app;
