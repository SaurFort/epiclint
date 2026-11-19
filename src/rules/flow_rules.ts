import {
    FunctionDeclaration,
    isConditionalExpression,
    isExpressionStatement,
    Node,
    SourceFile,
    SyntaxKind
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition, Position } from "../utils/position";

const FLOW_NODE_RULES: readonly NodeRule[] = [
    checkFlow02,
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

function checkFlow02(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (!isConditionalExpression(node))
        return null;
    if (isExpressionStatement(node.parent)) {
        const pos = getPosition(sourceFile, node.parent);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "FLOW-02",
            severity: "major",
            message: "Value produced by ternary operator must be used"
        };
    }

    if (
        isConditionalExpression(node.condition) ||
        isConditionalExpression(node.whenTrue) ||
        isConditionalExpression(node.whenFalse)
    ) {
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "FLOW-02",
            severity: "major",
            message: "Chained and nested ternary operators are forbidden"
        };
    }

    return null;
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