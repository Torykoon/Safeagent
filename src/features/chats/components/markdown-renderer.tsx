import { Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
    content: string
    className?: string
}

/**
 * Enhanced markdown renderer for chat messages
 * Supports: bold, italic, headers, lists, code blocks, inline code, links, line breaks
 */
export function MarkdownRenderer({
    content,
    className,
}: MarkdownRendererProps) {
    const renderInlineFormatting = (text: string): ReactNode => {
        const parts: ReactNode[] = []
        let remaining = text
        let keyIndex = 0

        // Process the text for inline formatting
        while (remaining.length > 0) {
            // Check for inline code (`code`)
            const codeMatch = remaining.match(/^`([^`]+)`/)
            if (codeMatch) {
                parts.push(
                    <code
                        key={`code-${keyIndex++}`}
                        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-primary"
                    >
                        {codeMatch[1]}
                    </code>
                )
                remaining = remaining.slice(codeMatch[0].length)
                continue
            }

            // Check for bold (**text** or __text__)
            const boldMatch = remaining.match(/^\*\*(.+?)\*\*|^__(.+?)__/)
            if (boldMatch) {
                parts.push(
                    <strong key={`bold-${keyIndex++}`} className="font-semibold">
                        {boldMatch[1] || boldMatch[2]}
                    </strong>
                )
                remaining = remaining.slice(boldMatch[0].length)
                continue
            }

            // Check for italic (*text* or _text_) - but not ** or __
            const italicMatch = remaining.match(/^\*([^*]+)\*|^_([^_]+)_/)
            if (italicMatch) {
                parts.push(
                    <em key={`italic-${keyIndex++}`} className="italic">
                        {italicMatch[1] || italicMatch[2]}
                    </em>
                )
                remaining = remaining.slice(italicMatch[0].length)
                continue
            }

            // Check for links [text](url)
            const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
            if (linkMatch) {
                parts.push(
                    <a
                        key={`link-${keyIndex++}`}
                        href={linkMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                    >
                        {linkMatch[1]}
                    </a>
                )
                remaining = remaining.slice(linkMatch[0].length)
                continue
            }

            // No match, take the next character
            const nextSpecial = remaining.search(/[`*_\[]/)
            if (nextSpecial === -1) {
                parts.push(remaining)
                break
            } else if (nextSpecial === 0) {
                // Special char that didn't match any pattern, just add it
                parts.push(remaining[0])
                remaining = remaining.slice(1)
            } else {
                parts.push(remaining.slice(0, nextSpecial))
                remaining = remaining.slice(nextSpecial)
            }
        }

        return parts.length > 0 ? <>{parts}</> : text
    }

    const renderLine = (line: string, index: number): ReactNode => {
        // Handle headers
        if (line.startsWith('### ')) {
            return (
                <h4
                    key={index}
                    className="mt-4 mb-2 text-sm font-bold text-foreground/90 flex items-center gap-2"
                >
                    <span className="h-0.5 w-3 bg-primary/60 rounded-full" />
                    {renderInlineFormatting(line.slice(4))}
                </h4>
            )
        }
        if (line.startsWith('## ')) {
            return (
                <h3
                    key={index}
                    className="mt-5 mb-2.5 text-base font-bold text-foreground flex items-center gap-2"
                >
                    <span className="h-1 w-4 bg-primary rounded-full" />
                    {renderInlineFormatting(line.slice(3))}
                </h3>
            )
        }
        if (line.startsWith('# ')) {
            return (
                <h2
                    key={index}
                    className="mt-6 mb-3 text-lg font-bold text-foreground flex items-center gap-2"
                >
                    <span className="h-1.5 w-5 bg-primary rounded-full" />
                    {renderInlineFormatting(line.slice(2))}
                </h2>
            )
        }

        // Handle horizontal rule
        if (line === '---' || line === '***' || line === '___') {
            return (
                <hr
                    key={index}
                    className="my-4 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
                />
            )
        }

        // Handle code blocks (``` ... ```) - multi-line handled separately
        if (line.startsWith('```')) {
            return null // Skip code block markers, they're handled in parent
        }

        // Handle blockquotes (> text)
        if (line.startsWith('> ')) {
            return (
                <blockquote
                    key={index}
                    className="border-l-3 border-primary/50 pl-4 my-2 italic text-muted-foreground bg-muted/30 py-2 rounded-r-lg"
                >
                    {renderInlineFormatting(line.slice(2))}
                </blockquote>
            )
        }

        // Handle unordered list items
        if (line.match(/^[-*]\s/)) {
            return (
                <li
                    key={index}
                    className="flex items-start gap-2 ml-2 my-1 text-[0.95em]"
                >
                    <span className="mt-2 size-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span>{renderInlineFormatting(line.slice(2))}</span>
                </li>
            )
        }

        // Handle ordered list items
        const orderedMatch = line.match(/^(\d+)\.\s(.*)/)
        if (orderedMatch) {
            return (
                <li
                    key={index}
                    className="flex items-start gap-2.5 ml-2 my-1 text-[0.95em]"
                >
                    <span className="font-semibold text-primary min-w-[1.25rem]">
                        {orderedMatch[1]}.
                    </span>
                    <span>{renderInlineFormatting(orderedMatch[2])}</span>
                </li>
            )
        }

        // Handle indented list items (sub-lists with 2+ spaces or tab)
        const subListMatch = line.match(/^(\s{2,}|\t)[-*]\s(.*)/)
        if (subListMatch) {
            return (
                <li
                    key={index}
                    className="flex items-start gap-2 ml-6 my-0.5 text-[0.9em] text-muted-foreground"
                >
                    <span className="mt-1.5 size-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    <span>{renderInlineFormatting(subListMatch[2])}</span>
                </li>
            )
        }

        // Handle empty lines
        if (line.trim() === '') {
            return <div key={index} className="h-3" />
        }

        // Regular paragraph
        return (
            <p key={index} className="leading-relaxed my-1">
                {renderInlineFormatting(line)}
            </p>
        )
    }

    // Pre-process content to handle code blocks
    const processContent = (text: string): ReactNode[] => {
        const elements: ReactNode[] = []
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
        let lastIndex = 0
        let match
        let keyIndex = 0

        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Process lines before this code block
            const beforeText = text.slice(lastIndex, match.index)
            if (beforeText.trim()) {
                const lines = beforeText.split('\n')
                lines.forEach((line, i) => {
                    const rendered = renderLine(line, keyIndex++)
                    if (rendered) elements.push(rendered)
                })
            }

            // Add code block
            const lang = match[1] || 'text'
            elements.push(
                <div key={`codeblock-${keyIndex++}`} className="my-3 group">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/80 rounded-t-lg border border-b-0 border-border/50">
                        <span className="text-xs text-muted-foreground font-mono">
                            {lang}
                        </span>
                    </div>
                    <pre className="bg-muted/50 p-4 rounded-b-lg overflow-x-auto border border-border/50">
                        <code className="text-xs font-mono text-foreground/90 whitespace-pre-wrap">
                            {match[2].trim()}
                        </code>
                    </pre>
                </div>
            )

            lastIndex = match.index + match[0].length
        }

        // Process remaining lines after last code block
        const remainingText = text.slice(lastIndex)
        if (remainingText.trim()) {
            const lines = remainingText.split('\n')
            lines.forEach((line, i) => {
                const rendered = renderLine(line, keyIndex++)
                if (rendered) elements.push(rendered)
            })
        }

        return elements
    }

    return (
        <div
            className={cn(
                'text-sm prose-sm prose-neutral dark:prose-invert max-w-none',
                'prose-headings:m-0 prose-p:m-0',
                className
            )}
        >
            {processContent(content)}
        </div>
    )
}
