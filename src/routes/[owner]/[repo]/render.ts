// Derived from: https://github.com/brussell98/discord-markdown/blob/master/index.js
// @ts-nocheck

import * as markdown from 'simple-markdown';
import highlight from 'highlight.js';

const htmlTag = (tagName: string, content: string, attributes: { [key: string]: string }, isClosed : boolean= true, state: { [key: string]: string } = { }) => {
	if (typeof isClosed === 'object') {
		state = isClosed;
		isClosed = true;
	}

	if (!attributes)
		attributes = { };

	let attributeString = '';
	for (let attr in attributes) {
		// Removes falsy attributes
		if (Object.prototype.hasOwnProperty.call(attributes, attr) && attributes[attr])
			attributeString += ` ${markdown.sanitizeText(attr)}="${markdown.sanitizeText(attributes[attr])}"`;
	}

	let unclosedTag = `<${tagName}${attributeString}>`;

	if (isClosed)
		return unclosedTag + content + `</${tagName}>`;
	return unclosedTag;
}

const rules: markdown.ParserRules = {
	blockQuote: Object.assign({ }, markdown.defaultRules.blockQuote, {
		match: function(source, state, prevSource) {
			return !/^$|\n *$/.test(prevSource) || state.inQuote ? null : /^( *>>> ([\s\S]*))|^( *> [^\n]*(\n *> [^\n]*)*\n?)/.exec(source);
		},
		parse: function(capture, parse, state) {
			const all = capture[0];
			const isBlock = Boolean(/^ *>>> ?/.exec(all));
			const removeSyntaxRegex = isBlock ? /^ *>>> ?/ : /^ *> ?/gm;
			const content = all.replace(removeSyntaxRegex, '');

			return {
				content: parse(content, Object.assign({ }, state, { inQuote: true })),
				type: 'blockQuote'
			}
		}
	}),
	codeBlock: Object.assign({ }, markdown.defaultRules.codeBlock, {
		match: markdown.inlineRegex(/^```(([a-z0-9-]+?)\n+)?\n*([^]+?)\n*```/i),
		parse: function(capture, parse, state) {
			return {
				lang: (capture[2] || '').trim(),
				content: capture[3] || '',
				inQuote: state.inQuote || false
			};
		},
		html: (node, output, state) => {
			let code;
			if (node.lang && highlight.getLanguage(node.lang))
				code = highlight.highlight(node.content, { language: node.lang, ignoreIllegals: true });

			return htmlTag('pre', htmlTag(
				'code', code ? code.value : markdown.sanitizeText(node.content), { class: `hljs${code ? ' ' + code.language : ''}` }, state
			), { class: "bg-gray-100 w-full p-2 rounded-md border border-[1px] border-gray-200" }, state);
		}
	}),
	newline: markdown.defaultRules.newline,
	escape: markdown.defaultRules.escape,
	autolink: Object.assign({ }, markdown.defaultRules.autolink, {
		parse: capture => {
			return {
				content: [{
					type: 'text',
					content: capture[1]
				}],
				target: capture[1]
			};
		},
		html: (node, output, state) => {
			return htmlTag('a', output(node.content, state), { href: markdown.sanitizeUrl(node.target) }, state);
		}
	}),
	url: Object.assign({ }, markdown.defaultRules.url, {
		parse: capture => {
			return {
				content: [{
					type: 'text',
					content: capture[1]
				}],
				target: capture[1]
			}
		},
		html: (node, output, state) => {
			return htmlTag('a', output(node.content, state), { href: markdown.sanitizeUrl(node.target) }, state);
		}
	}),
	em: Object.assign({ }, markdown.defaultRules.em, {
		parse: function(capture, parse, state) {
			const parsed = markdown.defaultRules.em.parse(capture, parse, Object.assign({ }, state, { inEmphasis: true }));
			return state.inEmphasis ? parsed.content : parsed;
		},
	}),
	strong: markdown.defaultRules.strong,
	u: markdown.defaultRules.u,
	strike: Object.assign({ }, markdown.defaultRules.del, {
		match: markdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
	}),
	inlineCode: Object.assign({ }, markdown.defaultRules.inlineCode, {
		match: source => markdown.defaultRules.inlineCode.match.regex.exec(source),
		html: function(node, output, state) {
			return htmlTag('code', markdown.sanitizeText(node.content.trim()), null, state);
		}
	}),
	text: Object.assign({ }, markdown.defaultRules.text, {
		match: source => /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff-]|\n\n|\n|\w+:\S|$)/.exec(source),
		html: function(node, output, state) {
			if (state.escapeHTML)
				return markdown.sanitizeText(node.content);

			return node.content;
		}
	}),
	emoticon: {
		order: markdown.defaultRules.text.order,
		match: source => /^(¯\\_\(ツ\)_\/¯)/.exec(source),
		parse: function(capture) {
			return {
				type: 'text',
				content: capture[1]
			};
		},
		html: function(node, output, state) {
			return output(node.content, state);
		},
	},
	br: Object.assign({ }, markdown.defaultRules.br, {
		match: markdown.anyScopeRegex(/^\n/),
	}),
    user: {
		order: markdown.defaultRules.strong.order,
		match: source => /^<@([A-Za-z0-9]*)>/.exec(source),
		parse: function(capture) {
			return {
				id: capture[1]
			};
		},
		html: function(node, output, state) {
			return htmlTag('span', state.callbacks.user(node), { class: 'r-mention r-user' }, state);
		}
	},
	// repository: {
	// 	order: markdown.defaultRules.strong.order,
	// 	match: source => /^(https?:\/\/)?github\.com\/([A-Za-z0-9])\/([A-Za-z0-9])/.exec(source),
	// 	parse: function(capture) {
	// 		return {
	// 			id: `${capture[1]}/${capture[2]}`,
    //             name: capture[1],
    //             repo: capture[2]
	// 		};
	// 	},
	// 	html: function(node, output, state) {
	// 		return htmlTag('span', state.callbacks.repository(node), { class: 'r-mention r-repo' }, state);
	// 	}
	// },
};

const callbacks = {
	user: (node) => '@' + markdown.sanitizeText(node.id),
	//repository: node => '#' + markdown.sanitizeText(node.id),
};

const parser = markdown.parserFor(rules);
const htmlOutput = markdown.outputFor(rules, 'html');

export const toHTML = (source: string) => {
	const state = {
		inline: true,
		inQuote: false,
		inEmphasis: false,
		escapeHTML: true,
		callbacks
	};

	return htmlOutput(parser(source, state), state);
}
