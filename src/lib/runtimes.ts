export interface RunResult {
  ok: boolean;
  output: string;
  rows?: Record<string, unknown>[];
}
export function runPython(
  code: string,
  tests?: string,
): { result: Promise<RunResult>; cancel: () => void } {
  const worker = new Worker(`${import.meta.env.BASE_URL}python-worker.mjs`, {
    type: "module",
  });
  let finish: (result: RunResult) => void = () => {};
  const result = new Promise<RunResult>((resolve) => {
    finish = resolve;
  });
  const timeout = setTimeout(() => {
    worker.terminate();
    finish({
      ok: false,
      output:
        "Execution timed out after 90 seconds. Check for an infinite loop or retry the runtime download.",
    });
  }, 90000);
  const cleanup = () => {
    clearTimeout(timeout);
    worker.terminate();
  };
  worker.onmessage = (event) => {
    cleanup();
    finish(event.data as RunResult);
  };
  worker.onerror = (event) => {
    cleanup();
    finish({
      ok: false,
      output:
        event.message ||
        "Python runtime could not load. Check internet access to cdn.jsdelivr.net.",
    });
  };
  worker.postMessage({ code, tests });
  return {
    result,
    cancel: () => {
      cleanup();
      finish({ ok: false, output: "Execution stopped." });
    },
  };
}
export async function runSQL(query: string): Promise<RunResult> {
  const duckdb = await import("@duckdb/duckdb-wasm");
  const base = new URL(
    `${import.meta.env.BASE_URL}runtimes/`,
    window.location.href,
  ).href;
  const bundle = await duckdb.selectBundle({
    mvp: {
      mainModule: base + "duckdb-mvp.wasm",
      mainWorker: base + "duckdb-browser-mvp.worker.js",
    },
    eh: {
      mainModule: base + "duckdb-eh.wasm",
      mainWorker: base + "duckdb-browser-eh.worker.js",
    },
  });
  const worker = new Worker(bundle.mainWorker!);
  const db = new duckdb.AsyncDuckDB(
    new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING),
    worker,
  );
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      (async () => {
        await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
        const conn = await db.connect();
        try {
          await conn.query(`CREATE TABLE builds(build_id INTEGER, branch VARCHAR); INSERT INTO builds VALUES (1,'main'),(2,'main'),(3,'main');
      CREATE TABLE test_cases(test_id INTEGER, name VARCHAR, module VARCHAR); INSERT INTO test_cases VALUES (1,'login','auth'),(2,'search','catalog'),(3,'checkout','payment');
      CREATE TABLE test_runs(run_id INTEGER, test_id INTEGER, build_id INTEGER, status VARCHAR, duration DOUBLE); INSERT INTO test_runs VALUES (1,1,1,'failed',4.5),(2,2,1,'passed',1.2),(3,3,1,'failed',8.1),(4,1,2,'failed',4.2),(5,2,2,'failed',3.1),(6,3,2,'failed',9.2),(7,1,3,'passed',2.0),(8,2,3,'passed',1.1),(9,3,3,'failed',10.1);
      CREATE TABLE defects(defect_id INTEGER, module VARCHAR, title VARCHAR); INSERT INTO defects VALUES (1,'payment','Synthetic payment timeout');
      CREATE TABLE failures(run_id INTEGER, category VARCHAR, defect_id INTEGER); INSERT INTO failures VALUES (3,'product',1),(6,'product',1),(9,'product',1),(1,'environment',NULL);`);
          const table = await conn.query(query);
          const rows = table
            .toArray()
            .map(
              (row) =>
                JSON.parse(
                  JSON.stringify(row.toJSON(), (_key, v) =>
                    typeof v === "bigint" ? Number(v) : v,
                  ),
                ) as Record<string, unknown>,
            );
          return { ok: true, output: JSON.stringify(rows, null, 2), rows };
        } finally {
          await conn.close();
        }
      })(),
      new Promise<RunResult>((resolve) => {
        timeout = setTimeout(() => {
          worker.terminate();
          resolve({
            ok: false,
            output: "SQL execution timed out after 30 seconds.",
          });
        }, 30000);
      }),
    ]);
  } catch (error) {
    return { ok: false, output: String(error) };
  } finally {
    clearTimeout(timeout);
    worker.terminate();
  }
}
export function compareRows(
  actual: Record<string, unknown>[],
  expected: Record<string, unknown>[],
) {
  const normalize = (rows: Record<string, unknown>[]) =>
    rows.map((row) =>
      Object.fromEntries(
        Object.entries(row).sort(([a], [b]) => a.localeCompare(b)),
      ),
    );
  return (
    JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected))
  );
}
