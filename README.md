# String Dissect (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[GitHub](https://github.com/hugoalh/string-dissect-es)
[JSR](https://jsr.io/@hugoalh/string-dissect)
[NPM](https://www.npmjs.com/package/@hugoalh/string-dissect)

An ECMAScript module to dissect the string; Safe with the emojis, URLs, and words.

## 🎯 Targets

| **Runtime \\ Source** | **GitHub Raw** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/string-dissect-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/string-dissect[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/string-dissect[@{Tag}]
  ```

> [!NOTE]
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## ⤵️ Entrypoints

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

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
  type StringSegmentType =
    | "ansi"
    | "character"
    | "emoji"
    | "url"
    | "word";
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/string-dissect)

## ✍️ Examples

- ```ts
  const sample1 = "Vel ex sit est sit est tempor enim et voluptua consetetur gubergren gubergren ut.";

  Array.from(new StringDissector().dissect(sample1));
  //=>
  //  [
  //    { value: "Vel", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "ex", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "sit", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "est", type: "word" },
  //    { value: " ", type: "character" },
  //    ... +20
  //  ]

  Array.from(new StringDissector({ safeWords: false }).dissect(sample1));
  //=>
  //  [
  //    { value: "V", type: "character" },
  //    { value: "e", type: "character" },
  //    { value: "l", type: "character" },
  //    { value: " ", type: "character" },
  //    { value: "e", type: "character" },
  //    { value: "x", type: "character" },
  //    { value: " ", type: "character" },
  //    { value: "s", type: "character" },
  //    ... +73
  //  ]
  ```
- ```ts
  Array.from(new StringDissector().dissect("GitHub homepage is https://github.com."));
  //=>
  //  [
  //    { value: "GitHub", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "homepage", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "is", type: "word" },
  //    { value: " ", type: "character" },
  //    { value: "https://github.com", type: "url" },
  //    { value: ".", type: "character" }
  //  ]
  ```
- ```ts
  Array.from(new StringDissector().dissect("🤝💑💏👪👨‍👩‍👧‍👦👩‍👦👩‍👧‍👦🧑‍🤝‍🧑"), ({ value }) => {
    return value;
  });
  //=> [ "🤝", "💑", "💏", "👪", "👨‍👩‍👧‍👦", "👩‍👦", "👩‍👧‍👦", "🧑‍🤝‍🧑" ]
  ```
