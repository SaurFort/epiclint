import {
    isSourceFile,
    isVariableDeclarationList,
    isVariableStatement,
    Node,
    NodeFlags,
    SourceFile,
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition } from "../utils/position";

const VAR_NODE_RULES: readonly NodeRule[] = [
    checkVar01,
    checkVar02
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
    if (!isVariableDeclarationList(node))
        return null;
    if ((node.flags & NodeFlags.BlockScoped) !== 0)
        return null;
    const pos = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "VAR-01",
        severity: "error",
        message: "'var' keyword is strictly forbidden"
    };
}

function checkVar02(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (!isVariableStatement(node) || !isSourceFile(node.parent))
        return null;
    if ((node.declarationList.flags & NodeFlags.Let) === 0)
        return null;
    const pos = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "VAR-02",
        severity: "major",
        message: "A 'let' should not be at the top-level module"
    };
}