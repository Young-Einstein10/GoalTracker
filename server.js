import http from "http";
import app from "./app";

app.set("port", process.env.PORT || 5000);

const server = http.createServer(app);
const port = process.env.PORT || 5000;
server.listen(port);
console.log(`Server running on port ${port}`);

module.exports = server;
