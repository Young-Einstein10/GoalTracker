import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
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

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

// User Routes
app.use("/api/v1/users", userRoutes);

// Goals
app.use("/api/v1/goals", goalRoutes);

export default app;
