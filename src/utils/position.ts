import { type Node, type SourceFile } from "typescript/unstable/ast";

export interface Position {
    line: number;
    column: number;
}

export function getPosition(sourceFile: SourceFile, node: Node): Position {
    const start = node.getStart(sourceFile);
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(start);

    return { line: line + 1, column: character + 1 };
}