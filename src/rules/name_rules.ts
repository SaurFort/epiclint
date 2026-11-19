import {
    isClassDeclaration,
    isEnumDeclaration,
    isInterfaceDeclaration,
    isTypeAliasDeclaration,
    Node,
    SourceFile
} from "typescript/unstable/ast";
import { LintIssue, NodeRule } from "../types";
import { getPosition } from "../utils/position";

const NAME_NODE_RULES: readonly NodeRule[] = [
    checkName02
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