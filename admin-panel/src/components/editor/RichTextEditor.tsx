import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FOCUS_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import type { LexicalEditor } from 'lexical';
import { HtmlPlugin } from './plugins/HtmlPlugin';
import './EditorTheme.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isRtl?: boolean;
  editorId?: string;
  onEditorReady?: (editor: LexicalEditor) => void;
  onEditorFocus?: (editor: LexicalEditor) => void;
}

// Plugin to capture editor instance and focus events
const EditorEventsPlugin = ({
  onEditorReady,
  onEditorFocus
}: {
  onEditorReady?: (editor: LexicalEditor) => void;
  onEditorFocus?: (editor: LexicalEditor) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!onEditorFocus) return;

    return editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        onEditorFocus(editor);
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onEditorFocus]);

  return null;
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  isRtl = false,
  editorId,
  onEditorReady,
  onEditorFocus
}: RichTextEditorProps) => {
  const initialConfig = {
    namespace: editorId || 'MajmuEditor',
    theme: {
      paragraph: 'editor-paragraph',
    },
    onError(error: Error) {
      console.error(error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container h-full">
        <div className="editor-content">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            }
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <HtmlPlugin onChange={onChange} initialValue={value} />
          <EditorEventsPlugin onEditorReady={onEditorReady} onEditorFocus={onEditorFocus} />
        </div>
      </div>
    </LexicalComposer>
  );
};