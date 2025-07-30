import regexpANSI from "npm:ansi-regex@^6.1.0";
import { urlRegExp as regexpURL } from "https://raw.githubusercontent.com/hugoalh/url-regexp-es/v0.2.0/mod.ts";
const regexpEmojiExact = /^\p{Emoji}+$/v;
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
interface StringDissectorRegExpMeta {
	regexp: RegExp;
	type: StringSegmentType;
}
function* dissectorWithRegExp(matchers: StringDissectorRegExpMeta[], item: string): Generator<string | Pick<StringSegmentDescriptor, "type" | "value">> {
	const [
		matcher,
		...matchersRemain
	]: StringDissectorRegExpMeta[] = matchers;
	let cursor: number = 0;
	for (const match of item.matchAll(matcher.regexp)) {
		const segmentMatch: string = match[0];
		const indexStart: number = match.index;
		if (cursor < indexStart) {
			const segmentNotMatch: string = item.slice(cursor, indexStart);
			if (matchersRemain.length > 0) {
				yield* dissectorWithRegExp(matchersRemain, segmentNotMatch);
			} else {
				yield segmentNotMatch;
			}
		}
		yield {
			type: matcher.type,
			value: segmentMatch
		};
		cursor = indexStart + segmentMatch.length;
	}
	if (cursor < item.length) {
		const segmentNotMatch: string = item.slice(cursor, item.length);
		if (matchersRemain.length > 0) {
			yield* dissectorWithRegExp(matchersRemain, segmentNotMatch);
		} else {
			yield segmentNotMatch;
		}
	}
}
/**
 * String dissector to dissect the string; Safe with the emojis, URLs, and words.
 */
export class StringDissector {
	#outputANSI: boolean;
	#regexpMatchers: StringDissectorRegExpMeta[] = [{
		regexp: regexpANSI(),
		type: "ansi"
	}];
	#segmenter: Intl.Segmenter;
	/**
	 * Initialize.
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
		if (safeURLs) {
			this.#regexpMatchers.push({
				regexp: regexpURL({
					auth: true
				}),
				type: "url"
			});
		}
		this.#segmenter = new Intl.Segmenter(locales, { granularity: safeWords ? "word" : "grapheme" });
	}
	/**
	 * Dissect the string.
	 * @param {string} item String that need to dissect.
	 * @returns {Generator<StringSegmentDescriptor>} An iterable descriptors from the dissected string.
	 */
	*dissect(item: string): Generator<StringSegmentDescriptor> {
		let cursor: number = 0;
		for (const segmentThroughRegExp of dissectorWithRegExp(this.#regexpMatchers, item)) {
			if (typeof segmentThroughRegExp !== "string") {
				const {
					type,
					value
				}: Pick<StringSegmentDescriptor, "type" | "value"> = segmentThroughRegExp;
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
				isWordLike = false,
				segment
			} of this.#segmenter.segment(segmentThroughRegExp)) {
				yield {
					indexEnd: cursor + segment.length,
					indexStart: cursor,
					type: regexpEmojiExact.test(segment) ? "emoji" : (
						isWordLike ? "word" : "character"
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
 * @returns {Generator<StringSegmentDescriptor>} An iterable descriptors from the dissected string.
 */
export function dissectString(item: string, options: StringDissectorOptions = {}): Generator<StringSegmentDescriptor> {
	return new StringDissector(options).dissect(item);
}
