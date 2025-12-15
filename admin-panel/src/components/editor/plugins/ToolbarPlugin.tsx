import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconButton, HStack } from '@chakra-ui/react';
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

  return (
    <div className="editor-toolbar">
      <HStack gap={1}>
        {/* History Controls */}
        <IconButton 
          size="xs" 
          aria-label="Undo" 
          variant="ghost" 
          onClick={() => onClick(UNDO_COMMAND)}
        >
          <FaUndo />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Redo" 
          variant="ghost" 
          onClick={() => onClick(REDO_COMMAND)}
        >
          <FaRedo />
        </IconButton>

        <div style={{ width: 1, height: 20, backgroundColor: '#E2E8F0', margin: '0 4px' }} />

        {/* Text Formatting */}
        <IconButton 
          size="xs" 
          aria-label="Bold" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_TEXT_COMMAND, 'bold')}
        >
          <FaBold />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Italic" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_TEXT_COMMAND, 'italic')}
        >
          <FaItalic />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Underline" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_TEXT_COMMAND, 'underline')}
        >
          <FaUnderline />
        </IconButton>
        
        <div style={{ width: 1, height: 20, backgroundColor: '#E2E8F0', margin: '0 4px' }} />

        {/* Alignment */}
        <IconButton 
          size="xs" 
          aria-label="Right Align" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'right')}
        >
          <FaAlignRight />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Center Align" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'center')}
        >
          <FaAlignCenter />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Justify Align" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'justify')}
        >
          <FaAlignJustify />
        </IconButton>
        <IconButton 
          size="xs" 
          aria-label="Left Align" 
          variant="ghost" 
          onClick={() => onClick(FORMAT_ELEMENT_COMMAND, 'left')}
        >
          <FaAlignLeft />
        </IconButton>
      </HStack>
    </div>
  );
};
