import React from 'react';
import { marked } from 'marked';

interface MarkdownProps {
    markdown: string;
}

const Markdown = ({ markdown }: MarkdownProps) => {
    return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} />;
};

export default Markdown;
