import {
	getMetadataFromConfig,
	invokeDenoNodeJSTransformer
} from "DNT";
const configJSR = await getMetadataFromConfig("jsr.jsonc");
await invokeDenoNodeJSTransformer({
	copyAssets: [
		"LICENSE.md",
		"README.md"
	],
	entrypoints: configJSR.getExports(),
	fixInjectedImports: true,
	generateDeclarationMap: true,
	mappings: {
		"https://esm.sh/ansi-regex@^6.1.0": {
			name: "ansi-regex",
			version: "^6.1.0"

		},
		"https://raw.githubusercontent.com/hugoalh/url-regexp-es/v0.1.1/mod.ts": {
			name: "@hugoalh/url-regexp",
			version: "^0.1.1"
		}
	},
	metadata: {
		name: configJSR.getName(),
		version: configJSR.getVersion(),
		description: "A module to dissect the string; Safe with the emojis, URLs, and words.",
		keywords: [
			"dissect",
			"string"
		],
		homepage: "https://github.com/hugoalh/string-dissect-es#readme",
		bugs: {
			url: "https://github.com/hugoalh/string-dissect-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://github.com/hugoalh/string-dissect-es.git"
		},
		scripts: {
		},
		engines: {
			node: ">=20.9.0"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm",
	outputDirectoryPreEmpty: true
});
