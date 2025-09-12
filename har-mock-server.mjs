#!/usr/bin/env -S node
import { cliteRun } from "clite-parser";
import { readFile } from "fs/promises";
import { createServer } from "http";
import { URL } from "node:url";

// ignore the hostname
function compareReq(request1, request2) {
  const url1 = new URL(request1.url);
  const url2 = new URL("http://localhost" + request2.url);
  return url1.search === url2.search && url1.pathname === url2.pathname &&
    url1.hash === url2.hash && request1.method === request2.method;
}

function handleRequest(request, response, harEntries) {
  const entry = harEntries.find((entry) => compareReq(entry.request, request));
  if (entry) {
    console.log(`[${entry.response.status}] ${request.method} ${request.url} `);
    response.writeHead(entry.response.status, {
      "access-control-allow-origin": "*",
    });
    response.end(entry.response.content.text);
  } else {
    console.log(`[404] entry not found : ${request.method} ${request.url}`);
    response.writeHead(404);
    response.end("Mock not found");
  }
}

async function serveHar(port, filePath) {
  const harStr = await readFile(filePath, "utf8");
  const harEntries = JSON.parse(harStr).log.entries;
  const server = createServer((request, response) =>
    handleRequest(request, response, harEntries)
  );
  server.listen(port, () => console.log(`Server started on port ${port}`));
}

// run `serveHar(8880, "./http1.har")` or use ce The CLI :
class HarMockServer {
  _help = "Run a mock server based on queries from an HAR file";
  _usage = "har-mock-server.js [Options] <HAR file>";
  _port_help = "Port of the server";
  _port_alias = "p";
  port = 8080;

  async main(harFilePath) {
    if (!harFilePath) {
      throw new Error("missing input HAR file");
    }
    await serveHar(this.port, harFilePath);
  }
}

cliteRun(HarMockServer, { noCommand: true, printHelpOnError: true });
