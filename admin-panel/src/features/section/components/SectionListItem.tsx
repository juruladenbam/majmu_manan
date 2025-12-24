import type { Section } from '@project/shared';
import type { LexicalEditor } from 'lexical';
import { ItemEditorList } from '@/features/item/components/ItemEditorList';
import { SharedToolbar } from '@/components/editor/SharedToolbar';
import { useState, useEffect } from 'react';
import { useUpdateSection } from '../hooks';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

interface SectionListItemProps {
  section: Section;
  bacaanId: number;
  onDelete: (id: number) => void;
  // Sortable props
  sortableRef?: (node: HTMLElement | null) => void;
  sortableStyle?: React.CSSProperties;
  sortableAttributes?: any;
  sortableListeners?: any;
  isDragging?: boolean;
}

export const SectionListItem = ({
  section,
  bacaanId,
  onDelete,
  sortableRef,
  sortableStyle,
  sortableAttributes,
  sortableListeners,
  isDragging
}: SectionListItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(section.judul_section);
  const [activeEditor, setActiveEditor] = useState<LexicalEditor | null>(null);
  const { mutate: updateSection } = useUpdateSection();

  useEffect(() => {
    if (location.hash === `#section-${section.id}`) {
      setIsOpen(true);
      // Optional: scroll into view logic could go here
    }
  }, [location.hash, section.id]);

  const handleToggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      navigate('#sections', { replace: true });
    } else {
      setIsOpen(true);
      navigate(`#section-${section.id}`, { replace: true });
    }
  };

  const handleSaveTitle = () => {
    if (title.trim() !== section.judul_section) {
      updateSection({ id: section.id, data: { judul_section: title } });
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setTitle(section.judul_section);
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={sortableRef}
      style={sortableStyle}
      className={`group relative bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm hover:shadow-md transition-all ${isDragging ? 'opacity-50 z-50 shadow-xl ring-2 ring-primary' : ''}`}
      id={`section-${section.id}`}
    >
      <div className={`p-5 flex flex-wrap items-center gap-4 bg-surface-light dark:bg-surface-dark z-10 relative ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}>

        {/* Drag Handle & Number (Visual) */}
        <div className="flex items-center gap-4">
          <div
            className="px-1 cursor-grab text-text-secondary dark:text-gray-400 group-hover:text-primary transition-colors touch-none"
            title="Drag to reorder"
            {...sortableAttributes}
            {...sortableListeners}
          >
            <span className="material-symbols-outlined">drag_indicator</span>
          </div>
          <div className="flex flex-shrink-0 items-center justify-center size-10 rounded-xl bg-surface-accent dark:bg-gray-800 border border-border-light dark:border-border-dark text-text-main dark:text-gray-300 font-bold font-mono text-sm">
            {/* Placeholder for order - ideally passed from parent index */}
            {section.urutan || '#'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-primary bg-white dark:bg-gray-800 text-sm font-bold text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <button onClick={handleSaveTitle} className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200">
                <FaCheck size={14} />
              </button>
              <button onClick={handleCancelEdit} className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200">
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/title">
              <h3
                className="text-lg font-bold text-text-main dark:text-white leading-tight cursor-pointer hover:text-primary transition-colors"
                onClick={() => setIsEditingTitle(true)}
              >
                {section.judul_section}
              </h3>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover/title:opacity-100 p-1 text-text-secondary hover:text-primary transition-opacity"
              >
                <FaEdit size={12} />
              </button>
            </div>
          )}
          <p className="text-xs text-text-secondary dark:text-gray-400 font-mono mt-1 flex items-center gap-2">
            <span>ID: {section.id}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>{section.items?.length || 0} Items</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleOpen}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${isOpen
              ? 'bg-primary text-text-dark shadow-md shadow-primary/20'
              : 'bg-surface-accent dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">{isOpen ? 'expand_less' : 'expand_more'}</span>
            <span>{isOpen ? 'Tutup' : 'Isi Konten'}</span>
          </button>

          <div className="w-px h-6 bg-border-light dark:border-border-dark mx-1"></div>

          <button
            onClick={() => {
              if (confirm('Hapus section ini?')) onDelete(section.id);
            }}
            className="size-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-text-secondary hover:text-red-500 transition-colors"
            title="Hapus Section"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border-light dark:border-border-dark">
          {/* Sticky Toolbar for this section */}
          <div className="sticky top-0 z-40 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
            <SharedToolbar editor={activeEditor} />
          </div>

          <div className="p-4 md:p-6 bg-surface-accent/30 dark:bg-black/20 animate-in slide-in-from-top-2 duration-200 rounded-b-xl">
            <ItemEditorList
              bacaanId={bacaanId}
              sectionId={section.id}
              items={[...(section.items || [])].sort((a, b) => a.urutan - b.urutan)}
              onActiveEditorChange={setActiveEditor}
            />
          </div>
        </div>
      )}
    </div>
  );
};
