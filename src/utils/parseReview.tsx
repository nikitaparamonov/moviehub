import React, { ReactElement } from 'react'

/**
 * Parse inline markdown formatting in a single line.
 * - **bold** -> <strong>bold</strong>
 * - _italic_ or *italic* or <em>italic</em> -> <em>italic</em>
 */
export function parseInlineFormatting(line: string): React.ReactNode[] {
	const nodes: React.ReactNode[] = []
	// Order matters: ** must be matched before * or _
	const re = /\*\*(.+?)\*\*|_([^_]+)_|\*([^*]+)\*|<em>(.+?)<\/em>/g
	let lastIndex = 0

	// Use matchAll for cleaner iteration over all matches
	for (const m of line.matchAll(re)) {
		const index = m.index ?? 0

		// Push plain text before current match
		if (index > lastIndex) nodes.push(line.slice(lastIndex, index))

		// m[1] = bold, m[2] = _italic_, m[3] = *italic*, m[4] = <em>italic</em>
		if (m[1]) nodes.push(<strong key={nodes.length}>{m[1]}</strong>)
		else if (m[2]) nodes.push(<em key={nodes.length}>{m[2]}</em>)
		else if (m[3]) nodes.push(<em key={nodes.length}>{m[3]}</em>)
		else if (m[4]) nodes.push(<em key={nodes.length}>{m[4]}</em>)

		lastIndex = index + m[0].length
	}

	// Append remaining plain text
	if (lastIndex < line.length) nodes.push(line.slice(lastIndex))

	return nodes
}

/**
 * Parse full markdown content into an array of <p> nodes.
 * - Paragraphs separated by blank lines (\r\n\r\n)
 * - Single newlines become <br/>
 */
export function parseReview(content: string): React.ReactNode[] {
	const paragraphs = content.split(/\r?\n\r?\n/)

	return paragraphs.map((paragraph, pIndex) => {
		const lines = paragraph.split(/\r?\n/)

		// Use flatMap for cleaner array building and automatic flattening
		const children = lines.flatMap((line, lIndex) => {
			const parsed = parseInlineFormatting(line)
			return lIndex < lines.length - 1 ? [...parsed, <br key={`br-${pIndex}-${lIndex}`} />] : parsed
		})

		return <p key={pIndex}>{children}</p>
	})
}

/**
 * Safely slice markdown text to a maximum length without cutting open * or ** tags.
 */
export function safeSliceMarkdown(text: string, limit: number): string {
	// Slice text first
	const sliced = text.slice(0, limit)

	// List of markdown markers to protect
	const MARKERS = ['**', '*', '_'] as const

	// Reduce over markers to trim incomplete tags
	return MARKERS.reduce((current, mark) => {
		const open = current.lastIndexOf(mark)
		if (open === -1) return current
		const close = current.indexOf(mark, open + mark.length)
		return close === -1 ? current.slice(0, open) : current
	}, sliced)
}

/**
 * Create a safe preview of markdown text up to a maximum character count.
 *
 * This function:
 * - Slices the text paragraph by paragraph to preserve markdown structure.
 * - Uses `safeSliceMarkdown` to avoid cutting inside unclosed `*` or `**` markers.
 * - Converts the sliced text into React nodes using `parseReview`.
 * - Optionally appends a "Read the rest" link inline after the last paragraph.
 */
export function createPreviewNodes(
	fullText: string,
	maxChars: number,
	readMoreLink?: React.ReactNode,
): React.ReactNode[] {
	const paragraphs = fullText.split(/\r?\n\r?\n/)
	let charsLeft = maxChars
	const previewParagraphs: string[] = []

	for (const p of paragraphs) {
		if (charsLeft <= 0) break

		if (p.length <= charsLeft) {
			previewParagraphs.push(p)
			charsLeft -= p.length + 2
		} else {
			previewParagraphs.push(safeSliceMarkdown(p, charsLeft))
			charsLeft = 0
		}
	}

	// Parse preview paragraphs
	const nodes = parseReview(previewParagraphs.join('\n\n'))

	// Append "Read the rest" link inline after last paragraph
	if (readMoreLink && nodes.length > 0) {
		// assert that the last node is a <p> element with React.ReactNode children
		const last = nodes[nodes.length - 1] as ReactElement<{ children: React.ReactNode }>
		nodes[nodes.length - 1] = React.cloneElement(last, {}, [
			...React.Children.toArray(last.props.children),
			'...',           // append ellipsis
    		readMoreLink,    // append link inline
		])
	}

	return nodes
}
