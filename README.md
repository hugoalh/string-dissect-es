# String Dissect (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/string-dissect-es](https://img.shields.io/github/v/release/hugoalh/string-dissect-es?label=hugoalh/string-dissect-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/string-dissect-es")](https://github.com/hugoalh/string-dissect-es)
[![JSR: @hugoalh/string-dissect](https://img.shields.io/jsr/v/@hugoalh/string-dissect?label=@hugoalh/string-dissect&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/string-dissect")](https://jsr.io/@hugoalh/string-dissect)
[![NPM: @hugoalh/string-dissect](https://img.shields.io/npm/v/@hugoalh/string-dissect?label=@hugoalh/string-dissect&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/string-dissect")](https://www.npmjs.com/package/@hugoalh/string-dissect)

An ECMAScript (JavaScript & TypeScript) module to dissect the string; Safe with the emojis, URLs, and words.

## 🔰 Begin

### 🎯 Targets

| **Targets** | **Remote** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/string-dissect-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/string-dissect[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/string-dissect[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Runtime Permissions

*This module does not request any runtime permission.*

## 🧩 APIs

- ```ts
  class StringDissector {
    constructor(options?: StringDissectorOptions);
    dissect(item: string): Generator<StringSegmentDescriptor>;
  }
  ```
- ```ts
  interface StringDissectorOptions {
    locales?: Intl.LocalesArgument;
    outputANSI?: boolean;
    safeURLs?: boolean;
    safeWords?: boolean;
  }
  ```
- ```ts
  interface StringSegmentDescriptor {
    indexEnd: number;
    indexStart: number;
    type: StringSegmentType;
    value: string;
  }
  ```
- ```ts
  type StringSegmentType = "ansi" | "character" | "emoji" | "url" | "word";
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/string-dissect)

## ✍️ Examples

- ```ts
  const sample1 = "Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut.";

  Array.from(new StringDissector().dissect(sample1));
  /*=>
  [
    { value: "Vel", type: "word" },
    { value: " ", type: "character" },
    { value: "ex", type: "word" },
    { value: " ", type: "character" },
    { value: "sit", type: "word" },
    { value: " ", type: "character" },
    { value: "est", type: "word" },
    { value: " ", type: "character" },
    ... +20
  ]
  */

  Array.from(new StringDissector({ safeWords: false }).dissect(sample1));
  /*=>
  [
    { value: "V", type: "character" },
    { value: "e", type: "character" },
    { value: "l", type: "character" },
    { value: " ", type: "character" },
    { value: "e", type: "character" },
    { value: "x", type: "character" },
    { value: " ", type: "character" },
    { value: "s", type: "character" },
    ... +73
  ]
  */
  ```
- ```ts
  Array.from(new StringDissector().dissect("GitHub homepage is https://github.com."));
  /*=>
  [
    { value: "GitHub", type: "word" },
    { value: " ", type: "character" },
    { value: "homepage", type: "word" },
    { value: " ", type: "character" },
    { value: "is", type: "word" },
    { value: " ", type: "character" },
    { value: "https://github.com", type: "url" },
    { value: ".", type: "character" }
  ]
  */
  ```
- ```ts
  Array.from(new StringDissector().dissect("🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑"), ({ value }) => {
    return value;
  });
  //=> [ "🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑" ]
  ```
