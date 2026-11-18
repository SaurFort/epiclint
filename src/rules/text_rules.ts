import { LintIssue } from "../types";

export function checkTextRules(filePath: string, content: string): LintIssue[] {
    const issues: LintIssue[] = [];

    if (content.length === 0)
        return issues;

    const rawLines: string[] = content.split("\n");
    const lines: string[] = content.endsWith("\n") ? rawLines.slice(0, -1) : rawLines;

    if (lines.length > 0 && lines[0].replace(/\r$/, "") === "") {
        issues.push({
            filePath,
            line: 1,
            column: 1,
            code: "FMT-03",
            severity: "minor",
            message: "Leading empty lines are forbidden"
        });
    }

    if (lines.length >= 2 && lines[lines.length - 1].replace(/\r$/, "") === "") {
        issues.push({
            filePath,
            line: lines.length,
            column: 1,
            code: "FMT-03",
            severity: "minor",
            message: "Too many trailing empty lines (max 1)"
        });
    }

    let previousWasBlank: boolean = false;

    for (let i: number = 0; i < lines.length; i++) {
        const lineNumber = i + 1;
        const rawLine = lines[i];

        if (rawLine.endsWith("\r")) {
            issues.push({
                filePath,
                line: lineNumber,
                column: rawLine.length,
                code: "FMT-01",
                severity: "minor",
                message: "CRLF (\\r\\n) line ending detected; use UNIX LF (\\n)"
            });
        }

        const line = rawLine.replace(/\r$/, "");

        if (/[ \t]+$/.test(line)) {
            issues.push({
                filePath,
                line: lineNumber,
                column: line.length,
                code: "FMT-02",
                severity: "minor",
                message: "Trailing spaces at end of line"
            });
        }

        if (line.length > 100) {
            issues.push({
                filePath,
                line: lineNumber,
                column: 101,
                code: "FMT-04",
                severity: "minor",
                message: `Line exceeds 100 columns (${line.length}/100)`
            });
        }

        const indentMatch: RegExpMatchArray | null = line.match(/^[ \t]+/);

        if (indentMatch !== null) {
            const indent = indentMatch[0];
            const trimmed = line.trimStart();

            if (indent.includes("\t")) {
                issues.push({
                    filePath,
                    line: lineNumber,
                    column: 1,
                    code: "FMT-05",
                    severity: "minor",
                    message: "Tabulation used for indentation (use 4 spaces)"
                });
            } else if (indent.length % 4 !== 0 && !trimmed.startsWith("*")) {
                issues.push({
                    filePath,
                    line: lineNumber,
                    column: 1,
                    code: "FMT-05",
                    severity: "minor",
                    message: `Indentation must be a multiple of 4 spaces (got ${indent.length})`
                });
            }
        }

        const isBlank = line.trim() === "";

        if (isBlank && previousWasBlank) {
            issues.push({
                filePath,
                line: lineNumber,
                column: 1,
                code: "FMT-06",
                severity: "minor",
                message: "Multiple consecutive blank lines"
            });
        }
        previousWasBlank = isBlank;
    }

    return issues;
}