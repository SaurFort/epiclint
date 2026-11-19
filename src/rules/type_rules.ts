import { Node, SourceFile, SyntaxKind } from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition, Position } from "../utils/position";

const TYPE_NODE_RULES: readonly NodeRule[] = [
    checkType01
];

export function checkTypeRules(filePath: string, sourceFile: SourceFile): LintIssue[] {
    const issues: LintIssue[] = [];

    function visit(node: Node): void {
        for (const rule of TYPE_NODE_RULES) {
            const issue: LintIssue | null = rule(filePath, sourceFile, node);

            if (issue !== null)
                issues.push(issue);
        }

        node.forEachChild(visit);
    }

    visit(sourceFile);
    return issues;
}

function checkType01(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (node.kind !== SyntaxKind.AnyKeyword)
        return null;
    const pos: Position = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "TYPE-01",
        severity: "error",
        message: "Explicit 'any' type is forbidden"
    };
}