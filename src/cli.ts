#!/usr/bin/env node

import { relative, resolve } from "node:path";
import { CliOptions, LintIssue } from "./types";
import { existsSync, readFileSync } from "node:fs";
import { scanTarget } from "./scanner";
import { checkFmtRules } from "./rules/fmt_rules";
import { checkTypeRules } from "./rules/type_rules";
import { API } from "typescript/unstable/sync";
import { checkVarRules } from "./rules/var_rules";
import { checkFlowRules } from "./rules/flow_rules";
import { checkNameRules } from "./rules/name_rules";
import { BOLD, CYAN, MAGENTA, RED, RESET, YELLOW } from "./utils/colors";
import { handleMetaFlags, parseCliArgs } from "./args";

function formatSeverity(severity: LintIssue["severity"]): string {
    switch (severity) {
        case "error":
            return `${RED}ERROR${RESET}`;
        case "major":
            return `${MAGENTA}MAJOR${RESET}`;
        case "minor":
            return `${YELLOW}MINOR${RESET}`;
        default:
            return `${CYAN}INFO${RESET}`;
    }
}

function main(): void {
    const options: CliOptions | null = parseCliArgs(process.argv.slice(2));

    if (options === null) {
        process.exitCode = -1;
        return;
    }

    if (handleMetaFlags(options))
        return;

    const targetPath = resolve(options.target);

    if (!existsSync(targetPath)) {
        console.error(`${RED}Error:${RESET} Path not found: ${options.target}`);
        process.exitCode = 1;
        return;
    }

    const { tsFiles, issues } = scanTarget(targetPath);
    const api = new API({})
    const snapshot = api.updateSnapshot({ openFiles: tsFiles });

    try {
        for (const filePath of tsFiles) {
            const content = readFileSync(filePath, "utf-8");
            const project = snapshot.getDefaultProjectForFile(filePath);
            const sourceFile = project?.program.getSourceFile(filePath);

            if (sourceFile === undefined)
                continue;

            issues.push(...checkFmtRules(filePath, content, sourceFile));
            issues.push(...checkTypeRules(filePath, sourceFile));
            issues.push(...checkVarRules(filePath, sourceFile));
            issues.push(...checkFlowRules(filePath, sourceFile));
            issues.push(...checkNameRules(filePath, sourceFile));
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
        if (issue.severity === "info" && !options.showInfo)
            continue;

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
        `${MAGENTA}${majorCount} major${RESET}, `,
        `${YELLOW}${minorCount} minor${RESET}, `,
        `${CYAN}${infoCount} info${RESET}`
    );

    if (issues.length > 0)
        process.exitCode = 1;
}

main();