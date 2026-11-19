import {
    isArrowFunction,
    isFunctionDeclaration,
    isFunctionExpression,
    isMethodDeclaration,
    isPropertyAssignment,
    Node,
    SourceFile,
    SyntaxKind
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition, Position } from "../utils/position";

const TYPE_NODE_RULES: readonly NodeRule[] = [
    checkType01,
    checkType02,
    checkType03
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

function checkType02(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (node.kind !== SyntaxKind.NonNullExpression)
        return null;
    const pos: Position = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "TYPE-02",
        severity: "error",
        message: "Forbidden non-null assertion operator"
    };
}

function checkType03(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (!isFunctionDeclaration(node) &&
        !isMethodDeclaration(node) &&
        !isArrowFunction(node) &&
        !isFunctionExpression(node)
    )
        return null;
    // This allow .map(), etc, to not having type
    if (isArrowFunction(node)) {
        if (!isPropertyAssignment(node.parent))
            return null;
    }
    if (node.type !== undefined)
        return null;
    const pos = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "TYPE-03",
        severity: "major",
        message: "A function must have an explicit return type"
    };
}