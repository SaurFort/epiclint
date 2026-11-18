import { basename, extname, join, sep } from "node:path";
import { readdirSync, statSync } from "node:fs";
import type { LintIssue } from "./types";

const IGNORED_DIRS: ReadonlySet<string> = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage"
]);

const JUNK_FILES: ReadonlySet<string> = new Set([
    ".DS_Store",
    "Thumbs.db"
]);

export interface ScanResult {
    tsFiles: string[];
    issues: LintIssue[];
}

function isJunkFile(filePath: string): boolean {
    const name = basename(filePath);
    const ext = extname(name).trim() !== "" ? extname(name) : name;
    const inSrc = filePath.split(sep).includes("src");

    if (JUNK_FILES.has(name) || name.endsWith("~") || ext === ".log")
        return true;
    if (name.startsWith("#") && name.endsWith("#"))
        return true;
    if (inSrc && (ext === ".js" || ext === ".map"))
        return true;
    return false;
}

export function scanTarget(targetPath: string): ScanResult {
    const result: ScanResult = { tsFiles: [], issues: [] };

    function walk(currentPath: string): void {
        const stats = statSync(currentPath);

        if (stats.isDirectory()) {
            if (IGNORED_DIRS.has(basename(currentPath)))
                return;
            for (const entry of readdirSync(currentPath))
                walk(join(currentPath, entry));
            return;
        }

        if (isJunkFile(currentPath)) {
            result.issues.push({
                filePath: currentPath,
                line: 1,
                column: 1,
                code: "ORG-01",
                severity: "minor",
                message: "Temporary, compiled, or unnecessary file in repository"
            });
            return;
        }

        const ext: string = extname(currentPath);
        if (ext === ".ts" || ext === ".tsx")
            result.tsFiles.push(currentPath);
    }

    walk(targetPath);
    return result;
}