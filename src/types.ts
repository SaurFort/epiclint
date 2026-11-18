export type Severity = "error" | "major" | "minor" | "info";

export interface LintIssue {
    filePath: string;
    line: number;
    column: number;
    code: string;
    severity: Severity;
    message: string;
}