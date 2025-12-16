import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import {
  FaBold, FaItalic, FaUnderline,
  FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaUndo, FaRedo
} from 'react-icons/fa';

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const onClick = (command: any, payload: any = undefined) => {
    editor.dispatchCommand(command, payload);
  };

  const ToolbarButton = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) => (
    <button
      onClick={onClick}
      title={label}
      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
      type="button"
    >
      <Icon />
    </button>
  );

  return (
    <div className="editor-toolbar flex items-center justify-center">
      {/* History Controls */}
      <ToolbarButton onClick={() => onClick(UNDO_COMMAND)} icon={FaUndo} label="Undo" />
      <ToolbarButton onClick={() => onClick(REDO_COMMAND)} icon={FaRedo} label="Redo" />

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Text Formatting */}
      <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'bold')} icon={FaBold} label="Bold" />
      <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'italic')} icon={FaItalic} label="Italic" />
      <ToolbarButton onClick={() => onClick(FORMAT_TEXT_COMMAND, 'underline')} icon={FaUnderline} label="Underline" />

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Alignment */}
      <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'right')} icon={FaAlignRight} label="Right Align" />
      <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'center')} icon={FaAlignCenter} label="Center Align" />
      <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'justify')} icon={FaAlignJustify} label="Justify Align" />
      <ToolbarButton onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'left')} icon={FaAlignLeft} label="Left Align" />
    </div>
  );
};
