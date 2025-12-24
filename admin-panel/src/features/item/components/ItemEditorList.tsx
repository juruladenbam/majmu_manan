import { useState, useRef, useEffect } from 'react';
import type { Item } from '@project/shared';
import type { LexicalEditor } from 'lexical';
import { useCreateItem, useUpdateItem, useDeleteItem, useReorderItems } from '../hooks';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ItemEditorListProps {
  bacaanId: number;
  sectionId: number | null;
  items: Item[];
  onActiveEditorChange?: (editor: LexicalEditor | null) => void;
}

export const ItemEditorList = ({ bacaanId, sectionId, items, onActiveEditorChange }: ItemEditorListProps) => {
  const { mutate: createItem } = useCreateItem();
  const { mutate: reorderItems } = useReorderItems(bacaanId);
  const [newItemId, setNewItemId] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState<Item[]>(items);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const endOfListRef = useRef<HTMLDivElement>(null);

  // Sync local items with props
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(currentItems, oldIndex, newIndex).map((item, index) => ({
          ...item,
          urutan: index
        }));

        // Send reorder request to backend
        const reorderedPayload = newItems.map((item) => ({
          id: item.id,
          urutan: item.urutan
        }));

        reorderItems(reorderedPayload);

        return newItems;
      });
    }
  };

  const handleAddItem = () => {
    const maxUrutan = localItems.length > 0
      ? Math.max(...localItems.map(i => i.urutan))
      : 0;
    const newUrutan = maxUrutan + 1;

    createItem({
      bacaan_id: bacaanId,
      section_id: sectionId,
      arabic: '',
      terjemahan: '',
      tipe_tampilan: 'text',
      urutan: newUrutan
    }, {
      onSuccess: (data) => {
        setNewItemId(data.id);
        setEditingItemId(data.id);
      }
    });
  };

  // Auto-scroll when new item is added
  useEffect(() => {
    if (newItemId && localItems.some(item => item.id === newItemId)) {
      setTimeout(() => {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [localItems, newItemId]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localItems.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-4">
            {localItems.map((item, index) => (
              <SortableItemRow
                key={item.id}
                item={item}
                bacaanId={bacaanId}
                index={index}
                isEditing={editingItemId === item.id}
                onStartEdit={() => setEditingItemId(item.id)}
                onEndEdit={() => {
                  setEditingItemId(null);
                  if (item.id === newItemId) setNewItemId(null);
                  onActiveEditorChange?.(null);
                }}
                onActiveEditorChange={onActiveEditorChange}
              />
            ))}
            <div ref={endOfListRef} />
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleAddItem}
        className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark hover:border-primary hover:bg-surface-accent dark:hover:bg-surface-accent-dark text-text-secondary hover:text-text-main font-bold transition-all group w-full"
      >
        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
        <span>Tambah Baris / Ayat Baru</span>
      </button>
    </div>
  );
};

// Sortable wrapper for ItemRow
const SortableItemRow = (props: {
  item: Item;
  bacaanId: number;
  index: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onActiveEditorChange?: (editor: LexicalEditor | null) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ItemRow
      {...props}
      sortableRef={setNodeRef}
      sortableStyle={style}
      sortableAttributes={attributes}
      sortableListeners={listeners}
      isDragging={isDragging}
    />
  );
};

const ItemRow = ({
  item,
  bacaanId,
  index,
  isEditing,
  onStartEdit,
  onEndEdit,
  onActiveEditorChange,
  sortableRef,
  sortableStyle,
  sortableAttributes,
  sortableListeners,
  isDragging
}: {
  item: Item;
  bacaanId: number;
  index: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onActiveEditorChange?: (editor: LexicalEditor | null) => void;
  sortableRef?: (node: HTMLElement | null) => void;
  sortableStyle?: React.CSSProperties;
  sortableAttributes?: any;
  sortableListeners?: any;
  isDragging?: boolean;
}) => {
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: deleteItem } = useDeleteItem();
  const [data, setData] = useState(item);
  const [isDirty, setIsDirty] = useState(false);

  // Reset data when item changes (e.g., when edit is cancelled externally)
  useEffect(() => {
    if (!isEditing) {
      setData(item);
      setIsDirty(false);
      onActiveEditorChange?.(null);
    }
  }, [isEditing, item, onActiveEditorChange]);

  const handleChange = (field: keyof Item, value: any) => {
    setData({ ...data, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    // Exclude urutan from update - it's managed by drag reorder only
    const { urutan, ...updateData } = data;
    updateItem({ id: item.id, data: updateData });
    setIsDirty(false);
    onEndEdit();
  };

  const handleDelete = () => {
    if (confirm('Hapus baris ini?')) {
      deleteItem({ id: item.id, bacaanId });
    }
  };

  const handleCancel = () => {
    setData(item);
    setIsDirty(false);
    onEndEdit();
  };

  // Editor IDs for this item
  const arabicEditorId = `item-${item.id}-arabic`;
  const latinEditorId = `item-${item.id}-latin`;
  const terjemahanEditorId = `item-${item.id}-terjemahan`;

  if (!isEditing) {
    return (
      <div
        ref={sortableRef}
        style={sortableStyle}
        className={`group relative bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all flex gap-4 ${isDragging ? 'opacity-50 z-50 shadow-xl ring-2 ring-primary' : ''}`}
      >
        {/* Drag Handle */}
        <div
          className="flex-shrink-0 px-1 cursor-grab text-text-secondary dark:text-gray-400 group-hover:text-primary transition-colors touch-none"
          title="Drag to reorder"
          {...sortableAttributes}
          {...sortableListeners}
        >
          <span className="material-symbols-outlined">drag_indicator</span>
        </div>

        {/* Number Badge */}
        <div className="flex-shrink-0">
          <div className="size-8 rounded-lg bg-surface-accent dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-text-secondary border border-border-light dark:border-gray-700 font-mono">
            {index + 1}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {item.arabic ? (
            <div
              dangerouslySetInnerHTML={{ __html: item.arabic }}
              dir="rtl"
              className="font-arabic text-4xl text-right leading-[3.25rem] text-text-main dark:text-white"
            />
          ) : (
            <p className="text-sm text-text-secondary italic text-center py-2 opacity-50">-- Kosong --</p>
          )}

          {(item.latin || item.terjemahan) && (
            <div className="flex flex-col gap-1 border-t border-border-light dark:border-border-dark pt-3 mt-1">
              {item.latin && (
                <p className="text-base font-medium text-primary-dark/80 dark:text-primary italic">
                  {item.latin}
                </p>
              )}

              {item.terjemahan && (
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  {item.terjemahan}
                </p>
              )}
            </div>
          )}

          {item.tipe_tampilan !== 'text' && (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <span className="material-symbols-outlined text-[14px]">style</span>
                {item.tipe_tampilan}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 md:static">
          <button
            onClick={onStartEdit}
            className="size-9 rounded-full bg-surface-light dark:bg-gray-800 border border-border-light dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-text-dark flex items-center justify-center text-text-secondary transition-colors shadow-sm"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={handleDelete}
            className="size-9 rounded-full bg-surface-light dark:bg-gray-800 border border-border-light dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 hover:text-red-500 flex items-center justify-center text-text-secondary transition-colors shadow-sm"
            title="Hapus"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sortableRef}
      style={sortableStyle}
      className="bg-surface-light dark:bg-surface-dark rounded-2xl border-2 border-primary/20 shadow-lg flex flex-col animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4">
          <h4 className="font-bold text-lg text-text-main dark:text-white">Edit Item #{index + 1}</h4>
          <span className="text-xs font-mono text-text-secondary bg-surface-accent dark:bg-gray-800 px-2 py-1 rounded">ID: {item.id}</span>
        </div>

        {/* Grid Layout for Form */}
        <div className="grid grid-cols-1 gap-6">
          {/* Arabic Editor */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-text-main dark:text-white ml-1">Arabic Content</label>
            <div className="bg-surface-accent dark:bg-gray-800 border-none focus-within:ring-2 focus-within:ring-primary h-auto transition-all">
              <RichTextEditor
                value={data.arabic || ''}
                onChange={(val: string) => handleChange('arabic', val)}
                placeholder="Paste or type Arabic text here..."
                isRtl={true}
                editorId={arabicEditorId}
                onEditorFocus={onActiveEditorChange}
              />
            </div>
          </div>

          {/* Latin & Terjemahan */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-main dark:text-white ml-1">Ungkapan Latin</label>
              <div className="bg-surface-accent dark:bg-gray-800 border-none focus-within:ring-2 focus-within:ring-primary h-auto transition-all">
                <RichTextEditor
                  value={data.latin || ''}
                  onChange={(val: string) => handleChange('latin', val)}
                  placeholder="Isi teks latin untuk transliterasi..."
                  isRtl={false}
                  editorId={latinEditorId}
                  onEditorFocus={onActiveEditorChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-main dark:text-white ml-1">Terjemahan</label>
              <div className="bg-surface-accent dark:bg-gray-800 border-none focus-within:ring-2 focus-within:ring-primary h-auto transition-all">
                <RichTextEditor
                  value={data.terjemahan || ''}
                  onChange={(val: string) => handleChange('terjemahan', val)}
                  placeholder="Isi terjemahan bahasa Indonesia..."
                  isRtl={false}
                  editorId={terjemahanEditorId}
                  onEditorFocus={onActiveEditorChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-border-light dark:border-border-dark mt-2">
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-text-secondary ml-1 uppercase">Tipe Tampilan</label>
            <div className="relative">
              <select
                value={data.tipe_tampilan}
                onChange={(e) => handleChange('tipe_tampilan', e.target.value as any)}
                className="appearance-none w-full sm:w-[200px] bg-surface-accent dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-text-main dark:text-white focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="text">Teks Biasa</option>
                <option value="syiir">Syiir (Puisi)</option>
                <option value="judul_tengah">Judul Tengah</option>
                <option value="image">Gambar</option>
                <option value="keterangan">Keterangan</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-secondary">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-full font-bold text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-8 py-2.5 rounded-full bg-primary hover:brightness-95 text-text-dark font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

