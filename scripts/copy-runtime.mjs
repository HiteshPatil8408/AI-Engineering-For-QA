import { mkdirSync, copyFileSync } from "node:fs";
mkdirSync("public/runtimes", { recursive: true });
for (const name of [
  "duckdb-mvp.wasm",
  "duckdb-eh.wasm",
  "duckdb-browser-mvp.worker.js",
  "duckdb-browser-eh.worker.js",
]) {
  copyFileSync(
    `node_modules/@duckdb/duckdb-wasm/dist/${name}`,
    `public/runtimes/${name}`,
  );
}
