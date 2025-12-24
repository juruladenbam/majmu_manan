import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FOCUS_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';

interface OnFocusPluginProps {
    onFocus: () => void;
}

export const OnFocusPlugin = ({ onFocus }: OnFocusPluginProps) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            FOCUS_COMMAND,
            () => {
                onFocus();
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, onFocus]);

    return null;
};
