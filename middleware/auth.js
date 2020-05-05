import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default (request, response, next) => {
  const authToken = request.headers.authorization;
  if (!authToken) {
    return response.status(400).json({
      status: "error",
      error: "Authorization Token Absent",
    });
  }

  const [, token] = authToken.split(" ");
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    request.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      status: "error",
      error,
    });
  }
};
