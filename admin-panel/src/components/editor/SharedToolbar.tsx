import type { LexicalEditor } from 'lexical';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import {
    FaBold, FaItalic, FaUnderline,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
    FaUndo, FaRedo
} from 'react-icons/fa';

interface SharedToolbarProps {
    editor: LexicalEditor | null;
}

export const SharedToolbar = ({ editor }: SharedToolbarProps) => {
    const onClick = (command: any, payload: any = undefined) => {
        if (editor) {
            editor.dispatchCommand(command, payload);
        }
    };

    const ToolbarButton = ({ onClick, icon: Icon, label, disabled }: { onClick: () => void, icon: any, label: string, disabled?: boolean }) => (
        <button
            onClick={onClick}
            title={label}
            disabled={disabled}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
        >
            <Icon />
        </button>
    );

    const isDisabled = !editor;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 p-2 bg-surface-light dark:bg-surface-dark w-full">
            {/* History Controls */}
            <ToolbarButton onClick={() => onClick(UNDO_COMMAND)} icon={FaUndo} label="Undo" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(REDO_COMMAND)} icon={FaRedo} label="Redo" disabled={isDisabled} />

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Text Formatting */}
            <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'bold')} icon={FaBold} label="Bold" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'italic')} icon={FaItalic} label="Italic" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'underline')} icon={FaUnderline} label="Underline" disabled={isDisabled} />

            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Alignment */}
            <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'right')} icon={FaAlignRight} label="Right Align" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'center')} icon={FaAlignCenter} label="Center Align" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'justify')} icon={FaAlignJustify} label="Justify Align" disabled={isDisabled} />
            <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'left')} icon={FaAlignLeft} label="Left Align" disabled={isDisabled} />

            {!editor && (
                <span className="ml-2 text-xs text-text-secondary italic">Klik editor untuk mengaktifkan</span>
            )}
        </div>
    );
};
