import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { HtmlPlugin } from './plugins/HtmlPlugin';
import './EditorTheme.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isRtl?: boolean;
}

export const RichTextEditor = ({ value, onChange, placeholder, isRtl = false }: RichTextEditorProps) => {
  const initialConfig = {
    namespace: 'MajmuEditor',
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
        {/* Toolbar is internal to Editor container now, or we can externalize if needed. 
            For now, keeping it here but styled via CSS/Tailwind */}
        <ToolbarPlugin />
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
        </div>
      </div>
    </LexicalComposer>
  );
};