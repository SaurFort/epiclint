import {
    EnumMember,
    isArrowFunction,
    isClassDeclaration,
    isEnumDeclaration,
    isEnumMember,
    isFunctionDeclaration,
    isFunctionExpression,
    isIdentifier,
    isInterfaceDeclaration,
    isMethodDeclaration,
    isParameterDeclaration,
    isPropertySignatureDeclaration,
    isSourceFile,
    isTypeAliasDeclaration,
    isVariableDeclaration,
    isVariableStatement,
    Node,
    SourceFile,
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition } from "../utils/position";

const NAME_NODE_RULES: readonly NodeRule[] = [
    checkName01,
    checkName02,
    checkName03,
    checkName04
];

export function checkNameRules(filePath: string, sourceFile: SourceFile): LintIssue[] {
    const issues: LintIssue[] = [];

    function visit(node: Node): void {
        for (const rule of NAME_NODE_RULES) {
            const issue: LintIssue | null = rule(filePath, sourceFile, node);

            if (issue !== null)
                issues.push(issue);
        }

        node.forEachChild(visit);
    }

    visit(sourceFile);
    return issues;
}

function checkName01(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    const regex = /^[a-z][a-zA-Z0-9]*$/;

    if (isFunctionDeclaration(node)) {
        if (!node.name?.text)
            return null;
        if (regex.test(node.name.text))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-01",
            severity: "info",
            message: "Bad naming practice for function's name, you should use 'camelCase'"
        };
    }

    if (isMethodDeclaration(node)) {
        if (regex.test(node.name.getText()))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-01",
            severity: "info",
            message: "Bad naming practice for method's name, you should use 'camelCase'"
        }
    }

    if (isParameterDeclaration(node)) {
        if (regex.test(node.name.getText()))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-01",
            severity: "info",
            message: "Bad naming practice for parameter's name, you should use 'camelCase'"
        };
    }

    if (isVariableDeclaration(node) && isSourceFile(node.parent.parent.parent)) {
        if (node.initializer === undefined)
            return null;
        if (!isArrowFunction(node.initializer) && !isFunctionExpression(node.initializer))
            return null;
        if (regex.test(node.name.getText()))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-01",
            severity: "info",
            message: "Bad naming practice for function's name, you should use 'camelCase'"
        }
    }

    return null;
}

function checkName02(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (
        !isClassDeclaration(node) &&
        !isInterfaceDeclaration(node) &&
        !isTypeAliasDeclaration(node) &&
        !isEnumDeclaration(node)
    )
        return null;
    if (!node.name?.text)
        return null;
    if (/^[A-Z][a-zA-Z0-9]*$/.test(node.name.text))
        return null;
    const pos = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "NAME-02",
        severity: "info",
        message: "Bad naming practice on type structure's name, you should use 'camelCase'"
    };
}

function checkName03(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    const regex = /^[A-Z][A-Z0-9_]*$/;

    if (isEnumMember(node)) {
        if (regex.test(node.name.getText()))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-03",
            severity: "info",
            message: "Bad naming practice on enum members, you should use 'UPPER_SNAKE_CASE'"
        };
    }

    if (isVariableDeclaration(node) && isSourceFile(node.parent.parent.parent)) {
        if (node.initializer === undefined)
            return null;
        if (isArrowFunction(node.initializer) || isFunctionExpression(node.initializer))
            return null;
        if (regex.test(node.name.getText()))
            return null;
        const pos = getPosition(sourceFile, node);

        return {
            filePath,
            line: pos.line,
            column: pos.column,
            code: "NAME-03",
            severity: "info",
            message: "Bad naming practice on global const, you should use 'UPPER_SNAKE_CASE'"
        }
    }
    return null;
}

function checkName04(filePath: string, sourceFile: SourceFile, node: Node): LintIssue | null {
    if (!isPropertySignatureDeclaration(node))
        return null;
    if (/^[a-z][a-zA-Z0-9]*$/.test(node.name.getText()))
        return null;
    if (/^[a-z][a-z0-9_]*$/.test(node.name.getText()))
        return null;
    const pos = getPosition(sourceFile, node);

    return {
        filePath,
        line: pos.line,
        column: pos.column,
        code: "NAME-04",
        severity: "info",
        message: "Bad naming practice on properties, you should use 'camelCase' or 'snake_case'"
    };
}