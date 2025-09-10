#!/usr/bin/env -S deno run -A
import { cliteRun, help, usage } from "jsr:@jersou/clite@0.7.7";
import { join, parse } from "jsr:@std/path@1.1.2";

async function simplify(filePath) {
  const harStr = await Deno.readTextFile(filePath);
  const harEntries = JSON.parse(harStr).log.entries;
  const entries = harEntries.map((entry) => ({
    request: { url: entry.request.url, method: entry.request.method },
    response: {
      content: { text: entry.response.content.text },
      status: entry.response.status,
    },
  }));
  const inputParsedPath = parse(filePath);
  await Deno.writeTextFile(
    join(
      inputParsedPath.dir,
      `${inputParsedPath.name}_simplified${inputParsedPath.ext}`,
    ),
    JSON.stringify({ log: { entries } }, null, "  "),
  );
}

// run `simplify("./http1.har")` or use ce The CLI :
@help("Simpliy the HAR file")
@usage("har-simplify.ts <HAR file>")
class HarMockServer {
  async main(harFilePath: string) {
    if (!harFilePath) {
      throw new Error("missing input HAR file");
    }
    await simplify(harFilePath);
  }
}

cliteRun(HarMockServer, { noCommand: true, printHelpOnError: true });
