import http from "http";
import app from "./index";
import * as dotenv from "dotenv";
dotenv.config();
const port = 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `server is running on port ${port}\nwaiting for mongoose connection...`
  );
});