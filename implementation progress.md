## Implementation Progress

### 1. Repository Organization (`ORG`)

- [x] `ORG-01` (`MINOR`) - Repository cleanliness

### 2. Formatting and Layout (`FMT`)

- [x] `FMT-01` (`MINOR`) - UNIX line endings _(in progress)_
- [x] `FMT-02` (`MINOR`) - Trailing whitespace _(in progress)_
- [x] `FMT-03` (`MINOR`) - Leading and trailing empty lines _(in progress)_
- [x] `FMT-04` (`MINOR`) - Maximum line length _(in progress)_
- [x] `FMT-05` (`MINOR`) - Indentation _(in progress)_
- [x] `FMT-06` (`MINOR`) - Consecutive blank lines _(in progress)_
- [ ] `FMT-07` (`MINOR`) - Separation of top-level declarations _(in progress)_
- [ ] `FMT-08` (`MINOR`) - Spacing around operators and separators _(in progress)_

### 3. Control Flow and Signatures (`FLOW`)

- [ ] `FLOW-01` (`MAJOR`) - One statement per line _(in progress)_
- [x] `FLOW-02` (`MAJOR`) - Ternary operators
- [x] `FLOW-03` (`MAJOR`) - Maximum number of parameters

### 4. Variables and Scope (`VAR`)

- [x] `VAR-01` (`ERROR`) - Prohibition of `var`
- [x] `VAR-02` (`MAJOR`) - Prohibition of mutable global variables
- [ ] `VAR-03` (`MINOR`) - Mandatory `const` when never reassigned
- [x] `VAR-04` (`MAJOR`) - Explicit type annotation on `let`

### 5. Strict TypeScript Typing (`TYPE`)

- [x] `TYPE-01` (`ERROR`) - Prohibition of `any`
- [x] `TYPE-02` (`ERROR`) - Prohibition of non-null assertions (`!`)
- [x] `TYPE-03` (`MAJOR`) - Explicit return type on functions

### 6. Naming Conventions (`NAME`)

- [ ] `NAME-01` (`MINOR`) - Variables and functions (`camelCase`)
- [ ] `NAME-02` (`MINOR`) - Type structures (`PascalCase`)
- [ ] `NAME-03` (`MINOR`) - Global constants and enum members (`UPPER_SNAKE_CASE`)
- [ ] `NAME-04` (`MINOR`) - Interface and object type properties
