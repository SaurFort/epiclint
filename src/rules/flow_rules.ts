import {
    FunctionDeclaration,
    isFunctionDeclaration,
    Node,
    NodeFlags,
    SourceFile,
    SyntaxKind
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition, Position } from "../utils/position";

const FLOW_NODE_RULES: readonly NodeRule[] = [
    checkFlow03
];

export function checkFlowRules(filePath: string, sourceFile: SourceFile): LintIssue[] {
    const issues: LintIssue[] = [];

    function visit(node: Node): void {
        for (const rule of FLOW_NODE_RULES) {
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

function checkFlow03(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (node.kind !== SyntaxKind.FunctionDeclaration)
        return null;
    const func = node as FunctionDeclaration;
    const pos = getPosition(sourceFile, node);

    if (func.parameters.length <= 4)
        return null;

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "FLOW-03",
        severity: "major",
        message:
            `Function ${func.name?.text} have more than 4 parameters (${func.parameters.length})`
    };
}