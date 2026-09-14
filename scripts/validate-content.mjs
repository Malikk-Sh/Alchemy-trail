import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import ts from "typescript";

const dataRoot = new URL("../src/data/", import.meta.url);
const dataPath = dataRoot.pathname;

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function propertyName(node) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : null;
}

const files = walk(dataPath).filter((path) => extname(path) === ".ts");
const errors = [];
let objectCount = 0;

for (const file of files) {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const ids = new Set();

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      objectCount += 1;
      const properties = new Map();
      for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const name = propertyName(property.name);
        if (name) properties.set(name, property.initializer);
      }

      const id = properties.get("id");
      if (id && ts.isStringLiteral(id)) {
        if (ids.has(id.text)) errors.push(`${file}: duplicate id '${id.text}'`);
        ids.add(id.text);
      }

      const baseValue = properties.get("baseValue");
      if (baseValue && ts.isNumericLiteral(baseValue) && Number(baseValue.text) < 0) {
        errors.push(`${file}: baseValue cannot be negative`);
      }

      const path = properties.get("path");
      if (path && ts.isArrayLiteralExpression(path) && path.elements.length < 2) {
        errors.push(`${file}: ingredient path must contain at least two points`);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Content validation passed (${files.length} data files, ${objectCount} object literals inspected).`);
}
