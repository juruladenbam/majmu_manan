import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useEffect, useRef } from 'react';
import { $getRoot, $insertNodes } from 'lexical';

interface OnChangeProps {
  onChange: (html: string) => void;
  initialValue?: string;
}

export const HtmlPlugin = ({ onChange, initialValue }: OnChangeProps) => {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current || !initialValue) return;
    
    editor.update(() => {
      const root = $getRoot();
      // Only set initial content if empty to avoid overwriting user input
      if (root.getTextContent() === '') {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(nodes);
      }
    });
    
    isFirstRender.current = false;
  }, [editor, initialValue]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      }}
    />
  );
};
