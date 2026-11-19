import { Node, NodeFlags, SourceFile, SyntaxKind } from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition, Position } from "../utils/position";

const VAR_NODE_RULES: readonly NodeRule[] = [
    checkVar01
];

export function checkVarRules(filePath: string, sourceFile: SourceFile): LintIssue[] {
    const issues: LintIssue[] = [];

    function visit(node: Node): void {
        for (const rule of VAR_NODE_RULES) {
            const issue: LintIssue | null = rule(filePath, sourceFile, node);

            if (issue !== null)
                issues.push(issue);
        }

        node.forEachChild(visit)
    }

    visit(sourceFile);
    return issues;
}

function checkVar01(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (node.kind !== SyntaxKind.VariableDeclarationList)
        return null;
    if ((node.flags & NodeFlags.BlockScoped) !== 0)
        return null;
    const pos: Position = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "VAR-01",
        severity: "error",
        message: "'var' keyword is strictly forbidden"
    };
}