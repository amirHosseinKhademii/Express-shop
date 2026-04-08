import { createServer, IncomingMessage, ServerResponse } from "node:http";

createServer((req: IncomingMessage, res: ServerResponse): void => {
  const { url, method } = req;
  const body: Buffer[] = [];
  req.on("data", (chunk: Buffer) => body.push(chunk));
  req.on("end", () => {
    const bodyString = Buffer.concat(body).toString();
    console.log(bodyString);
  });
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}).listen(3000, () => {
  console.log("Server is running on port 3000");
});
