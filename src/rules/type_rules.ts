import { Node, SourceFile, SyntaxKind } from "typescript/unstable/ast";
import { LintIssue } from "../types";
import { getPosition, Position } from "../utils/position";

export function checkTypeRules(filePath: string, sourceFile: SourceFile): LintIssue[] {
    let issues: LintIssue[] = [];

    function visit(node: Node): void {
        if (node.kind === SyntaxKind.AnyKeyword) {
            const pos: Position = getPosition(sourceFile, node);

            issues.push({
                filePath,
                line: pos.line,
                column: pos.column,
                code: "TYPE-01",
                severity: "error",
                message: "Explicity 'any' type is forbidden"
            });
        }

        node.forEachChild(visit);
    }

    visit(sourceFile);
    return issues;
}
