import {
	readManifest,
	transform
} from "DNT";
const manifest = await readManifest("jsr.jsonc");
await transform({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	//@ts-ignore Lazy type.
	entrypointsScript: manifest.exports,
	generateDeclarationMap: true,
	mappings: {
		"https://raw.githubusercontent.com/hugoalh/url-regexp-es/v0.2.1/mod.ts": {
			name: "@hugoalh/url-regexp",
			version: "^0.2.1"
		}
	},
	metadata: {
		//@ts-ignore Lazy type.
		name: manifest.name,
		//@ts-ignore Lazy type.
		version: manifest.version,
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
	outputDirectory: "dist/npm-github",
	outputDirectoryPreEmpty: true
});
