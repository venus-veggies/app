/**
 * Venus PWA – Build Manifest (Professional)
 *
 * Generates a rich, AI‑ready JSON manifest of the entire codebase,
 * including resolved dependencies, component hierarchy, context usage,
 * and configuration references. No code content is exposed.
 *
 * Usage:
 *   node scripts/build-manifest.js                 → full project map
 *   node scripts/build-manifest.js components      → only src/components
 *
 * Output: venus-manifest.json (project root)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, "..", "src");
const OUTPUT = path.join(__dirname, "..", "extracts", "venus-manifest.json");

// ---------------------------------------------------------------------------
// 1. FILE COLLECTION
// ---------------------------------------------------------------------------
function getAllFiles(dir, exts = [".js", ".jsx"]) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", "assets"].includes(entry.name)
    ) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// 2. PARSING HELPERS
// ---------------------------------------------------------------------------

// Extract all import sources (e.g., '../../hooks/useCart')
function extractImportSources(content) {
  const sources = [];
  const regex = /import\s+.*?\s+from\s+['"](.+)['"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    sources.push(m[1]);
  }
  return sources;
}

// Extract all exported identifiers (e.g., 'export function Button', 'export default function Login')
function extractExports(content) {
  const exports = [];

  // 1. All declarative exports (named & default with declaration)
  const declRegex =
    /export\s+(default\s+)?(function|class|const|let|var)\s+(\w+)/g;
  let m;
  while ((m = declRegex.exec(content)) !== null) {
    exports.push({
      type: m[1] ? "default" : "named",
      name: m[3],
    });
  }

  // 2. `export default <expression>;` (e.g., export default api; export default function() {})
  const defaultExprRegex = /export\s+default\s+(?!function|class)(\w+)/g;
  while ((m = defaultExprRegex.exec(content)) !== null) {
    exports.push({ type: "default", name: m[1] });
  }

  // 3. Named export lists: export { foo, bar };
  const namedListRegex = /export\s*\{([^}]+)\}/g;
  while ((m = namedListRegex.exec(content)) !== null) {
    const names = m[1]
      .split(",")
      .map((s) => s.trim().replace(/\s+as\s+.*/, ""));
    names.forEach((name) => exports.push({ type: "named", name }));
  }

  return exports;
}

// Detect all JSX component usages (<ComponentName ...)
function detectJSXComponents(content, knownComponents) {
  const used = new Set();
  const regex = /<([A-Z][A-Za-z0-9_]*)[\s\/>]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    if (knownComponents.has(m[1])) {
      used.add(m[1]);
    }
  }
  return Array.from(used);
}

// Detect context hook calls (useAuth, useCart, etc.)
function detectContextUsage(content) {
  const hooks = [];
  const regex =
    /(useAuth|useCart|useProduct|useProducts|useAddToCart|useDocumentTitle|useDebouncedValue|usePrevious)\(\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    hooks.push(m[1]);
  }
  return [...new Set(hooks)];
}

// ---------------------------------------------------------------------------
// 3. IMPORT RESOLUTION
// ---------------------------------------------------------------------------

// Try to resolve a relative import path to an actual source file inside src/
function resolveImport(importPath, currentFile) {
  if (importPath.startsWith(".")) {
    const dir = path.dirname(currentFile);
    let resolved = path.resolve(dir, importPath);
    // try common extensions if missing
    const exts = [".js", ".jsx", "/index.js", "/index.jsx"];
    for (const ext of exts) {
      const candidate = resolved + ext;
      if (fs.existsSync(candidate)) return candidate;
    }
    // if no extension and not found, try as directory
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      for (const ext of [".js", ".jsx"]) {
        const idx = path.join(resolved, "index" + ext);
        if (fs.existsSync(idx)) return idx;
      }
    }
    return null; // external or not resolvable
  }
  // non-relative (like 'react', 'lucide-react') – ignore for project graph
  return null;
}

// ---------------------------------------------------------------------------
// 4. BUILD MANIFEST
// ---------------------------------------------------------------------------
function buildManifest(filter) {
  const allFiles = getAllFiles(SRC);
  const relativeFiles = allFiles.map((f) =>
    path.relative(SRC, f).replace(/\\/g, "/"),
  );
  const absoluteFiles = allFiles.map((f) => f);

  // Build a lookup: export name -> source file (for JSX resolution)
  const componentMap = new Map(); // name -> relative file
  const fileExportsMap = new Map(); // relative file -> [export names]
  const fileContentCache = new Map(); // relative file -> content

  for (let i = 0; i < allFiles.length; i++) {
    const abs = allFiles[i];
    const rel = relativeFiles[i];
    const content = fs.readFileSync(abs, "utf8");
    fileContentCache.set(rel, content);

    const exports = extractExports(content);
    fileExportsMap.set(
      rel,
      exports.map((e) => e.name),
    );

    for (const exp of exports) {
      // only components typically start uppercase
      if (/^[A-Z]/.test(exp.name)) {
        componentMap.set(exp.name, rel);
      }
    }
  }

  // Filter files if a folder prefix is given
  const filteredRels = filter
    ? relativeFiles.filter((r) => r.startsWith(filter))
    : relativeFiles;

  const entries = [];

  for (const rel of filteredRels) {
    const abs = path.join(SRC, rel);
    const content = fileContentCache.get(rel);
    const rawImports = extractImportSources(content);

    // Resolve project imports
    const dependencies = [];
    for (const imp of rawImports) {
      const resolved = resolveImport(imp, abs);
      if (resolved) {
        const depRel = path.relative(SRC, resolved).replace(/\\/g, "/");
        dependencies.push(depRel);
      }
    }

    // Detect rendered components (JSX)
    const knownComponents = new Set(componentMap.keys());
    const renderedComponents = detectJSXComponents(content, knownComponents)
      .map((name) => componentMap.get(name))
      .filter(Boolean);

    // Context usage
    const contexts = detectContextUsage(content);

    // Configuration / content / data usage (for quick reference)
    const configImports = rawImports.filter(
      (i) =>
        i.startsWith("../config") ||
        i.startsWith("../../config") ||
        i.startsWith("../content") ||
        i.startsWith("../../content") ||
        i.startsWith("../data") ||
        i.startsWith("../../data"),
    );

    entries.push({
      file: `src/${rel}`,
      exports: fileExportsMap.get(rel) || [],
      dependencies, // other project files this file directly imports
      renders: renderedComponents, // components used in JSX (by file path)
      contextHooks: contexts, // contexts consumed
      configRefs: configImports, // config/content/data imports (raw strings)
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
const filter = process.argv[2] || null;
const manifest = buildManifest(filter);

const outputJSON = {
  project: "Venus PWA",
  generated: new Date().toISOString(),
  totalFiles: manifest.length,
  files: manifest,
};

fs.writeFileSync(OUTPUT, JSON.stringify(outputJSON, null, 2), "utf8");
console.log(
  `✅ Professional manifest written to ${OUTPUT} (${manifest.length} files)`,
);
