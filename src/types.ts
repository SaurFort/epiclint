import { Node, SourceFile } from "typescript/unstable/ast";

export type Severity = "error" | "major" | "minor" | "info";

export interface LintIssue {
    filePath: string;
    line: number;
    column: number;
    code: string;
    severity: Severity;
    message: string;
}

export type NodeRule = (filePath: string, sourceFile: SourceFile, node: Node) => LintIssue | null;