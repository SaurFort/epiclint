#!/usr/bin/env node

import { relative, resolve } from "node:path";
import { LintIssue } from "./types";
import { existsSync, readFileSync } from "node:fs";
import { scanTarget } from "./scanner";
import { checkFmtRules } from "./rules/fmt_rules";
import { checkTypeRules } from "./rules/type_rules";
import { API } from "typescript/unstable/sync";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function formatSeverity(severity: LintIssue["severity"]): string {
    switch (severity) {
        case "error":
            return `${RED}ERROR${RESET}`;
        case "major":
            return `${YELLOW}MAJOR${RESET}`;
        case "minor":
            return `${CYAN}MINOR${RESET}`;
        default:
            return `${MAGENTA}INFO${RESET}`;
    }
}

function main(): void {
    const rawTarget = process.argv[2] ?? ".";
    const targetPath = resolve(rawTarget);

    if (!existsSync(targetPath)) {
        console.error(`${RED}Error:${RESET} Path not found: ${rawTarget}`);
        process.exitCode = 1;
        return;
    }

    const { tsFiles, issues } = scanTarget(targetPath);

    for (const filePath of tsFiles) {
        const content = readFileSync(filePath, "utf-8");

        issues.push(...checkFmtRules(filePath, content));
    }

    const api = new API({})
    const snapshot = api.updateSnapshot({ openFiles: tsFiles });

    try {
        for (const filePath of tsFiles) {
            const project = snapshot.getDefaultProjectForFile(filePath);
            const sourceFile = project?.program.getSourceFile(filePath);

            if (sourceFile === undefined)
                continue;

            issues.push(...checkTypeRules(filePath, sourceFile));
        }
    } finally {
        snapshot.dispose();
        api.close();
    }

    issues.sort((a: LintIssue, b: LintIssue): number => {
        if (a.filePath !== b.filePath)
            return a.filePath.localeCompare(b.filePath);
        return a.line - b.line || a.column - b.column;
    });

    for (const issue of issues) {
        const relPath = relative(process.cwd(), issue.filePath) || issue.filePath;

        console.log(
            `${BOLD}${relPath}:${issue.line}:${issue.column}${RESET} ` +
            `[${formatSeverity(issue.severity)}] (${issue.code}) ${issue.message}`
        );
    }

    const errorCount = issues.filter((i) => i.severity === "error").length;
    const majorCount = issues.filter((i) => i.severity === "major").length;
    const minorCount = issues.filter((i) => i.severity === "minor").length;
    const infoCount = issues.filter((i) => i.severity === "info").length;

    console.log(
        `\nChecked ${tsFiles.length} file(s) - ` +
        `${RED}${errorCount} error${RESET}, `,
        `${YELLOW}${majorCount} major${RESET}, `,
        `${CYAN}${minorCount} minor${RESET}, `,
        `${MAGENTA}${infoCount} info${RESET}`
    );

    if (issues.length > 0)
        process.exitCode = 1;
}

main();