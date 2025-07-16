import regexpANSIOriginal from "npm:ansi-regex@^6.1.0";
import regexpURLOriginal from "https://raw.githubusercontent.com/hugoalh/url-regexp-es/v0.1.1/mod.ts";
const regexpANSIGlobal = new RegExp(regexpANSIOriginal().source, "gu");
const regexpEmojiExact = /^\p{Emoji}+$/v;
const regexpURLGlobal = new RegExp(regexpURLOriginal({
	auth: true,
	returnString: true
}), "giu");
export interface StringDissectorOptions {
	/**
	 * The locales to use in the operation. The JavaScript implementation examines locales, and then computes a locale it understands that comes closest to satisfying the expressed preference. By default, the implementation's default locale will be used.
	 * 
	 * For more information, please visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument.
	 */
	locales?: Intl.LocalesArgument;
	/**
	 * Whether to output string segments of ANSI escape codes.
	 * @default {true}
	 */
	outputANSI?: boolean;
	/**
	 * Whether to prevent URLs get splitted.
	 * @default {true}
	 */
	safeURLs?: boolean;
	/**
	 * Whether to prevent words get splitted.
	 * @default {true}
	 */
	safeWords?: boolean;
}
export type StringSegmentType =
	| "ansi"
	| "character"
	| "emoji"
	| "url"
	| "word";
export interface StringSegmentDescriptor {
	/**
	 * String segment end index of the input string.
	 */
	indexEnd: number;
	/**
	 * String segment start index of the input string.
	 */
	indexStart: number;
	/**
	 * Type of the string segment.
	 */
	type: StringSegmentType;
	/**
	 * Value of the string segment.
	 */
	value: string;
}
interface DissectorRegExpEntry {
	matcher: RegExp;
	matcherType: StringSegmentType;
}
function* dissectorWithRegExp(item: string, matchersEntry: DissectorRegExpEntry[]): Generator<string | Pick<StringSegmentDescriptor, "type" | "value">> {
	const [{
		matcher,
		matcherType
	}, ...matchersEntryRemain] = matchersEntry;
	let cursor: number = 0;
	for (const match of item.matchAll(matcher)) {
		const value: string = match[0];
		const indexStart: number = match.index;
		if (cursor < indexStart) {
			const segment: string = item.slice(cursor, indexStart);
			if (matchersEntryRemain.length > 0) {
				yield* dissectorWithRegExp(segment, matchersEntryRemain);
			} else {
				yield segment;
			}
		}
		yield {
			type: matcherType,
			value
		};
		cursor = indexStart + value.length;
	}
	if (cursor < item.length) {
		const segment: string = item.slice(cursor, item.length);
		if (matchersEntryRemain.length > 0) {
			yield* dissectorWithRegExp(segment, matchersEntryRemain);
		} else {
			yield segment;
		}
	}
}
/**
 * String dissector to dissect the string; Safe with the emojis, URLs, and words.
 */
export class StringDissector {
	#outputANSI: boolean;
	#regexpMatchers: DissectorRegExpEntry[];
	#segmenter: Intl.Segmenter;
	/**
	 * Initialize the string dissector.
	 * @param {StringDissectorOptions} [options={}] Options.
	 */
	constructor(options: StringDissectorOptions = {}) {
		const {
			locales,
			outputANSI = true,
			safeURLs = true,
			safeWords = true
		}: StringDissectorOptions = options;
		this.#outputANSI = outputANSI;
		const regexpMatchers: DissectorRegExpEntry[] = [{
			matcher: regexpANSIGlobal,
			matcherType: "ansi"
		}];
		if (safeURLs) {
			regexpMatchers.push({
				matcher: regexpURLGlobal,
				matcherType: "url"
			});
		}
		this.#regexpMatchers = regexpMatchers;
		this.#segmenter = new Intl.Segmenter(locales, { granularity: safeWords ? "word" : "grapheme" });
	}
	/**
	 * Dissect the string.
	 * @param {string} item String that need to dissect.
	 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
	 */
	*dissect(item: string): Generator<StringSegmentDescriptor> {
		let cursor: number = 0;
		for (const segmentWithRegExp of dissectorWithRegExp(item, this.#regexpMatchers)) {
			if (typeof segmentWithRegExp !== "string") {
				const {
					type,
					value
				}: Pick<StringSegmentDescriptor, "type" | "value"> = segmentWithRegExp;
				if (!(!this.#outputANSI && type === "ansi")) {
					yield {
						indexEnd: cursor + value.length,
						indexStart: cursor,
						type,
						value
					};
				}
				cursor += value.length;
				continue;
			}
			for (const {
				isWordLike,
				segment
			} of this.#segmenter.segment(segmentWithRegExp)) {
				yield {
					indexEnd: cursor + segment.length,
					indexStart: cursor,
					type: regexpEmojiExact.test(segment)
						? "emoji"
						: (isWordLike
							? "word"
							: "character"
						),
					value: segment
				};
				cursor += segment.length;
			}
		}
	}
}
export default StringDissector;
/**
 * Dissect the string; Safe with the emojis, URLs, and words.
 * @param {string} item String that need to dissect.
 * @param {StringDissectorOptions} [options={}] Options.
 * @returns {Generator<StringSegmentDescriptor>} A dissected string with descriptor.
 */
export function dissectString(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor> {
	return new StringDissector(options).dissect(item);
}
