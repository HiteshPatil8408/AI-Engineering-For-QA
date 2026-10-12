// Pinned runtime, fetched only when a learner runs Python.
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs";
self.onmessage = async ({ data }) => {
  let output = "";
  try {
    const py = await loadPyodide({
      stdout: (s) => {
        output += s + "\n";
      },
      stderr: (s) => {
        output += s + "\n";
      },
    });
    await py.loadPackagesFromImports(data.code + "\n" + (data.tests || ""));
    const globals = py.toPy({});
    try {
      await py.runPythonAsync(data.code, { globals });
      if (data.tests) await py.runPythonAsync(data.tests, { globals });
      self.postMessage({
        ok: true,
        output: output + (data.tests ? "\nAll behavior checks passed." : ""),
      });
    } finally {
      globals.destroy();
    }
  } catch (error) {
    self.postMessage({ ok: false, output: output + "\n" + String(error) });
  }
};
