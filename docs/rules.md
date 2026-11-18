# Rules

Here you will find all the rules of `epiclint`, inspired by the Epitech Coding Style and adapted for TypeScript.

## Table of Contents <!-- omit in toc -->

- [Rules](#rules)
  - [Severity level](#severity-level)
  - [1. Repository Organization (`ORG`)](#1-repository-organization-org)
    - [`ORG-01` (`INFO`) - Repository cleanliness](#org-01-info---repository-cleanliness)
  - [2. Formatting and Layout (`FMT`)](#2-formatting-and-layout-fmt)
    - [`FMT-01` (`MINOR`) - UNIX line endings](#fmt-01-minor---unix-line-endings)
    - [`FMT-02` (`MINOR`) - Trailing whitespace](#fmt-02-minor---trailing-whitespace)
    - [`FMT-03` (`MINOR`) - Leading and trailing empty lines](#fmt-03-minor---leading-and-trailing-empty-lines)
    - [`FMT-04` (`MINOR`) - Maximum line length](#fmt-04-minor---maximum-line-length)
    - [`FMT-05` (`MINOR`) - Indentation](#fmt-05-minor---indentation)
    - [`FMT-06` (`MINOR`) - Consecutive blank lines](#fmt-06-minor---consecutive-blank-lines)
    - [`FMT-07` (`MINOR`) - Separation of top-level declarations](#fmt-07-minor---separation-of-top-level-declarations)
    - [`FMT-08` (`MINOR`) - Spacing around operators and separators](#fmt-08-minor---spacing-around-operators-and-separators)
  - [3. Control Flow and Signatures (`FLOW`)](#3-control-flow-and-signatures-flow)
    - [`FLOW-01` (`MAJOR`) - One statement per line](#flow-01-major---one-statement-per-line)
    - [`FLOW-02` (`MAJOR`) - Ternary operators](#flow-02-major---ternary-operators)
    - [`FLOW-03` (`MAJOR`) - Maximum number of parameters](#flow-03-major---maximum-number-of-parameters)
  - [4. Variables and Scope (`VAR`)](#4-variables-and-scope-var)
    - [`VAR-01` (`ERROR`) - Prohibition of `var`](#var-01-error---prohibition-of-var)
    - [`VAR-02` (`MAJOR`) - Prohibition of mutable global variables](#var-02-major---prohibition-of-mutable-global-variables)
    - [`VAR-03` (`MINOR`) - Mandatory `const` when never reassigned](#var-03-minor---mandatory-const-when-never-reassigned)
    - [`VAR-04` (`MAJOR`) - Explicit type annotation on `let`](#var-04-major---explicit-type-annotation-on-let)
  - [5. Strict TypeScript Typing (`TYPE`)](#5-strict-typescript-typing-type)
    - [`TYPE-01` (`ERROR`) - Prohibition of `any`](#type-01-error---prohibition-of-any)
    - [`TYPE-02` (`ERROR`) - Prohibition of non-null assertions (`!`)](#type-02-error---prohibition-of-non-null-assertions-)
    - [`TYPE-03` (`ERROR`) - Explicit return type on functions](#type-03-error---explicit-return-type-on-functions)
  - [6. Naming Conventions (`NAME`)](#6-naming-conventions-name)
    - [`NAME-01` (`INFO`) - Variables and functions (`camelCase`)](#name-01-info---variables-and-functions-camelcase)
    - [`NAME-02` (`INFO`) - Type structures (`PascalCase`)](#name-02-info---type-structures-pascalcase)
    - [`NAME-03` (`INFO`) - Global constants and enum members (`UPPER_SNAKE_CASE`)](#name-03-info---global-constants-and-enum-members-upper_snake_case)
    - [`NAME-04` (`INFO`) - Interface and object type properties](#name-04-info---interface-and-object-type-properties)

## Severity level

| Level   | Meaning                                                            |
| ------- | ------------------------------------------------------------------ |
| `ERROR` | Forbidden usage that could be flagged as an infraction by mar.vin. |
| `MAJOR` | Structural issue or lack of rigor.                                 |
| `MINOR` | Violation of a visual, spacing, or naming convention.              |
| `INFO`  | Best-practice recommendation.                                      |

## 1. Repository Organization (`ORG`)

### `ORG-01` (`INFO`) - Repository cleanliness

The repository must not contain any temporary files, log files, or build artifacts (`.DS_Store`, `*.db`, `*~`, `#*#`, `*.log`, ...), nor any compiled or generated files (`.js`, `.map`, ...).

> [!NOTE]\
> Git has a [wonderful way](https://www.w3schools.com/git/git_ignore.asp) to help you keep your repository clean.

## 2. Formatting and Layout (`FMT`)

### `FMT-01` (`MINOR`) - UNIX line endings

All files must strictly use UNIX line endings (`\n`). Windows carriage returns (`\r\n`) are forbidden.

### `FMT-02` (`MINOR`) - Trailing whitespace

No trailing spaces or tabulations may remain at the end of any line.

### `FMT-03` (`MINOR`) - Leading and trailing empty lines

- No leading empty lines are allowed at the beginning of a file.
- At most one trailing empty line is tolerated at the end of a file.

### `FMT-04` (`MINOR`) - Maximum line length

No line may exceed **100 columns**.

### `FMT-05` (`MINOR`) - Indentation

- Indentation must strictly use spaces in multiples of **4**.
- Tabulations (`\t`) are forbidden.
- _Exception:_ asterisk (`*`) alignment inside JSDoc block comments (`/** ... */`) is tolerated.

### `FMT-06` (`MINOR`) - Consecutive blank lines

Multiple consecutive blank lines are forbidden (at most one blank line in a row).

### `FMT-07` (`MINOR`) - Separation of top-level declarations

Function declarations, classes, and top-level blocks must be separated by one and only one blank line.

### `FMT-08` (`MINOR`) - Spacing around operators and separators

- A single space must surround binary operators (`=`, `+`, `===`, `&&`, etc.) and ternary operators (`?`, `:`).
- A single space must follow every comma `,` and control-flow keyword (`if`, `else`, `for`, `while`, `switch`, `return`).
- No space is allowed before `;` or `,`, or between a function name and its opening parenthesis `(`.
- _Exception:_ generic angle brackets (`Promise<User>`, `Array<string>`) and JSX tags are written without spaces.

## 3. Control Flow and Signatures (`FLOW`)

### `FLOW-01` (`MAJOR`) - One statement per line

- Each line must contain at most one statement.
- Assignments inside conditions (`if (user = getUser())`) and statements placed on the same line as an `if`/`while` header are forbidden.

### `FLOW-02` (`MAJOR`) - Ternary operators

- Nested or chained ternary operators (`a ? b : c ? d : e`) are forbidden.
- The value produced by a ternary expression must always be used (assigned, returned, or passed as an argument).

### `FLOW-03` (`MAJOR`) - Maximum number of parameters

A function or method must not declare more than **4 parameters**. Beyond 4, group parameters into a typed object.

## 4. Variables and Scope (`VAR`)

### `VAR-01` (`ERROR`) - Prohibition of `var`

The `var` keyword is strictly forbidden. Use `const` by default, or `let` when reassignment is required.

### `VAR-02` (`MAJOR`) - Prohibition of mutable global variables

Any `let` declaration at the top-level module scope is forbidden. Only constants (`const`) are allowed at the top level.

### `VAR-03` (`MINOR`) - Mandatory `const` when never reassigned

Any variable declared with `let` that is never reassigned within its scope must be declared using `const`.

### `VAR-04` (`MAJOR`) - Explicit type annotation on `let`

Every variable declared with `let` must specify an explicit type (`let count: number = 0;`). Explicit typing is optional on `const` because TypeScript can infer the appropriate type.

## 5. Strict TypeScript Typing (`TYPE`)

### `TYPE-01` (`ERROR`) - Prohibition of `any`

Explicit `: any` annotations (as well as `as any` casts) are strictly forbidden. Use a generic type or a dedicated interface instead.

> [!NOTE]\
> Maybe TypeScript has a cleaner and more appropriate type that lets you do the same thing safely.

### `TYPE-02` (`ERROR`) - Prohibition of non-null assertions (`!`)

The postfix non-null assertion operator `!` (e.g., `req.user!.id`) is forbidden. You should explicitly check for nullability.

### `TYPE-03` (`ERROR`) - Explicit return type on functions

Every named function, class method, or arrow function assigned to a variable must explicitly declare its return type (e.g., `: void`, `: number`, ...).

> [!NOTE]\
> A function typed as `: void` does not require a trailing `return;` statement.

> [!IMPORTANT]\
> Exception: anonymous inline callbacks passed directly as arguments (`.map()`, `.filter()`, inline handlers) are exempt.

## 6. Naming Conventions (`NAME`)

### `NAME-01` (`INFO`) - Variables and functions (`camelCase`)

Local variables, parameters, and functions/methods must be named using `camelCase`.

### `NAME-02` (`INFO`) - Type structures (`PascalCase`)

`class`, `interface`, `type`, and `enum` declarations must be named using `PascalCase`.

### `NAME-03` (`INFO`) - Global constants and enum members (`UPPER_SNAKE_CASE`)

Top-level value constants (excluding functions and components) as well as `enum` members must be named using `UPPER_SNAKE_CASE`.

### `NAME-04` (`INFO`) - Interface and object type properties

Fields defined inside an `interface` or object `type` may use either `camelCase` or `snake_case` (to facilitate mapping with SQL columns and external API payloads).
