import { invokeDenoNodeJSTransformer } from "DNT";
import { parse as parseJSONC } from "STD_JSONC";
const jsrManifest = parseJSONC(await Deno.readTextFile("./jsr.jsonc"));
await invokeDenoNodeJSTransformer({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	//@ts-ignore Lazy type.
	entrypointsScript: jsrManifest.exports,
	generateDeclarationMap: true,
	mappings: {
		"https://raw.githubusercontent.com/hugoalh/url-regexp-es/v0.2.0/mod.ts": {
			name: "@hugoalh/url-regexp",
			version: "^0.2.0"
		}
	},
	metadata: {
		//@ts-ignore Lazy type.
		name: jsrManifest.name,
		//@ts-ignore Lazy type.
		version: jsrManifest.version,
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
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm",
	outputDirectoryPreEmpty: true
});
