import { LintIssue } from "../types";

type LineRule = (filePath: string, lines: string[], index: number) => LintIssue | null;
type FileTextRule = (filePath: string, lines: string[]) => LintIssue[];

const FMT_FILE_RULES: readonly FileTextRule[] = [
    checkFmt03
];

const FMT_LINE_RULES: readonly LineRule[] = [
    checkFmt01,
    checkFmt02,
    checkFmt04,
    checkFmt05,
    checkFmt06
];

export function checkFmtRules(filePath: string, content: string): LintIssue[] {
    const issues: LintIssue[] = [];

    if (content.length === 0)
        return issues;

    const rawLines: string[] = content.split("\n");
    const lines: string[] = content.endsWith("\n") ? rawLines.slice(0, -1) : rawLines;

    for (const rule of FMT_FILE_RULES)
        issues.push(...rule(filePath, lines));

    for (let i: number = 0; i < lines.length; i++) {
        for (const rule of FMT_LINE_RULES) {
            const issue: LintIssue | null = rule(filePath, lines, i);

            if (issue !== null)
                issues.push(issue);
        }
    }

    return issues;
}

function checkFmt01(filePath: string, lines: string[], index: number): LintIssue | null {
    const rawLine: string = lines[index];

    if (!rawLine.endsWith("\r"))
        return null;

    return {
        filePath,
        line: index + 1,
        column: rawLine.length,
        code: "FMT-01",
        severity: "major",
        message: "CRLF (\\r\\n) line ending detected; use UNIX LF (\\n)"
    };
}

function checkFmt02(filePath: string, lines: string[], index: number): LintIssue | null {
    const line: string = lines[index].replace(/\r$/, "");

    if (!/[ \t]+$/.test(line))
        return null;

    return {
        filePath,
        line: index + 1,
        column: line.length,
        code: "FMT-02",
        severity: "minor",
        message: "Trailing spaces at end of line"
    };
}

function checkFmt03(filePath: string, lines: string[]): LintIssue[] {
    const issues: LintIssue[] = [];

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

    return issues;
}

function checkFmt04(filePath: string, lines: string[], index: number): LintIssue | null {
    const line: string = lines[index].replace(/\r$/, "");

    if (line.length <= 100)
        return null;

    return {
        filePath,
        line: index + 1,
        column: 101,
        code: "FMT-04",
        severity: "minor",
        message: `Line exceeds 100 columns (${line.length}/100)`
    };
}

function checkFmt05(filePath: string, lines: string[], index: number): LintIssue | null {
    const line: string = lines[index].replace(/\r$/, "");
    const indentMatch: RegExpMatchArray | null = line.match(/^[ \t]+/);

    if (indentMatch === null)
        return null;

    const indent: string = indentMatch[0];
    const trimmed: string = line.trimStart();

    if (indent.includes("\t")) {
        return {
            filePath,
            line: index + 1,
            column: 1,
            code: "FMT-05",
            severity: "minor",
            message: "Tabulation used for indentation (use 4 spaces)"
        };
    }

    if (indent.length % 4 !== 0 && !trimmed.startsWith("*")) {
        return {
            filePath,
            line: index + 1,
            column: 1,
            code: "FMT-05",
            severity: "minor",
            message: `Indentation must be a multiple of 4 spaces (got ${indent.length})`
        };
    }

    return null;
}

function checkFmt06(filePath: string, lines: string[], index: number): LintIssue | null {
    if (index === 0)
        return null;

    const currentLine: string = lines[index].replace(/\r$/, "");
    const previousLine: string = lines[index - 1].replace(/\r$/, "");

    if (currentLine.trim() !== "" || previousLine.trim() !== "")
        return null;

    return {
        filePath,
        line: index + 1,
        column: 1,
        code: "FMT-06",
        severity: "minor",
        message: "Multiple consecutive blank lines"
    };
}