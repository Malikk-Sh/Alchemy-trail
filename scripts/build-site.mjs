import { cp, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist-site");

await rm(outDir, { recursive: true, force: true });
await run("npm", ["run", "build", "--silent"]);
await mkdir(outDir, { recursive: true });

await cp(path.join(root, "index.html"), path.join(outDir, "index.html"));
await cp(path.join(root, "styles"), path.join(outDir, "styles"), { recursive: true });
await cp(path.join(root, "assets"), path.join(outDir, "assets"), { recursive: true });
await cp(path.join(root, "dist", "js"), path.join(outDir, "dist", "js"), { recursive: true });

console.log("Static site assembled in dist-site/.");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}.`));
    });
  });
}
