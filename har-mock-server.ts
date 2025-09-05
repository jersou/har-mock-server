#!/usr/bin/env -S deno run --allow-net --allow-read
import { alias, cliteRun, help, usage } from "jsr:@jersou/clite@0.7.7";

// ignore the hostname
function compareReq(request1: string, request2: string) {
  const url1 = new URL(request1.url);
  const url2 = new URL(request2.url);
  return url1.search === url2.search && url1.pathname === url2.pathname &&
    url1.hash === url2.hash && request1.method === request2.method;
}

// deno-lint-ignore no-explicit-any
function handleRequest(request: Request, harEntries: any[]) {
  const entry = harEntries.find((entry) => compareReq(entry.request, request));
  if (entry) {
    console.log(`[${entry.response.status}] ${request.method} ${request.url} `);
    const body = entry.response.content.text;
    const headers = { "access-control-allow-origin": "*" };
    return new Response(body, { status: entry.response.status, headers });
  } else {
    console.log(`[404] entry not found : ${request.method} ${request.url}`);
    return new Response("Mock not found", { status: 404 });
  }
}

async function serveHar(port, filePath) {
  const harStr = await Deno.readTextFile(filePath);
  const harEntries = JSON.parse(harStr).log.entries;
  await Deno.serve({ port }, (request) => handleRequest(request, harEntries));
}

// run `serveHar(8880, "./http1.har")` or use ce The CLI :
@help("Run a mock server based on queries from an HAR file")
@usage("har-mock-server.ts [Options] <HAR file>")
class HarMockServer {
  @help("Port of the server")
  @alias("p")
  port = 8080;

  async main(harFilePath: string) {
    if (!harFilePath) {
      throw new Error("missing input HAR file");
    }
    await serveHar(this.port, harFilePath);
  }
}

cliteRun(HarMockServer, { noCommand: true, printHelpOnError: true });
