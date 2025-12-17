import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useBacaanDetail, useUpdateBacaan } from '@/features/bacaan/hooks';
import { useCreateSection, useDeleteSection, useReorderSections } from '@/features/section/hooks';
import { BacaanMetadataForm } from '@/features/bacaan/components/BacaanMetadataForm';
import { SectionListItem } from '@/features/section/components/SectionListItem';
import { PreviewModal } from '@/features/bacaan/components/preview/PreviewModal';
import { CreateSectionModal } from '@/features/section/components/CreateSectionModal';
import { SimpleItemsTab } from '@/features/bacaan/components/SimpleItemsTab';
import { FaEye } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
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

const SortableSectionItem = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SectionListItem
      {...props}
      sortableRef={setNodeRef}
      sortableStyle={style}
      sortableAttributes={attributes}
      sortableListeners={listeners}
      isDragging={isDragging}
    />
  );
};

export const BacaanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const bacaanId = parseInt(id!);
  const { data: bacaan, isLoading } = useBacaanDetail(bacaanId);
  const { mutate: updateBacaan } = useUpdateBacaan();
  const { mutate: createSection } = useCreateSection();
  const { mutate: deleteSection } = useDeleteSection();
  const { mutate: reorderSections } = useReorderSections();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [sections, setSections] = useState<any[]>([]);

  // Sync sections when data loads
  useEffect(() => {
    if (bacaan?.sections) {
      setSections(bacaan.sections);
    }
  }, [bacaan?.sections]);

  // derived state from hash
  const activeTab = (location.hash === '#sections' || location.hash.startsWith('#section-')) ? 'sections' : 'info';

  const isMultiSection = bacaan?.is_multi_section ?? false;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          urutan: index + 1
        }));

        // Calculate new urutan for payload
        const reorderedItems = newItems.map((item) => ({
          id: item.id,
          urutan: item.urutan
        }));

        reorderSections(reorderedItems);

        return newItems;
      });
    }
  };

  const handleUpdate = (data: any) => {
    updateBacaan({ id: bacaanId, data });
  };

  const handleToggleMulti = () => {
    const newValue = !isMultiSection;
    updateBacaan({ id: bacaanId, data: { is_multi_section: newValue } });
  };

  const handleCreateSection = (title: string) => {
    createSection({
      bacaan_id: bacaanId,
      judul_section: title,
      urutan: (sections.length || 0) + 1
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bacaan) return <div className="text-center p-10 text-text-secondary">Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
      {/* Header Actions & Title */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link
            to="/bacaan"
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-surface-light dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-gray-800 border border-border-light dark:border-border-dark shadow-sm transition-all text-sm font-bold text-text-main dark:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2 px-4 h-10 rounded-full bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 transition-all text-sm font-bold"
            >
              <FaEye /> Preview
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary text-text-dark">ID: {bacaan.id}</span>
              {bacaan.slug && <span className="text-xs font-mono text-text-secondary">{bacaan.slug}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white tracking-tight">{bacaan.judul}</h1>
            {bacaan.judul_arab && <h2 className="text-2xl font-arabic text-text-secondary mt-1">{bacaan.judul_arab}</h2>}
          </div>

          {/* Toggle Multi Section */}
          <div className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark p-2 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Mode Multi Section</span>
            <button
              onClick={handleToggleMulti}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${isMultiSection ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
              title={isMultiSection ? "Nonaktifkan Multi Section" : "Aktifkan Multi Section"}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isMultiSection ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-1 pt-2 overflow-x-auto">
        <button
          onClick={() => navigate('#info')}
          className={clsx(
            "px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-colors whitespace-nowrap",
            activeTab === 'info'
              ? "bg-primary text-text-dark"
              : "bg-transparent text-text-secondary hover:bg-surface-accent dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white"
          )}
        >
          Info Dasar
        </button>
        <button
          onClick={() => navigate('#sections')}
          className={clsx(
            "px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-colors whitespace-nowrap",
            activeTab === 'sections'
              ? "bg-primary text-text-dark"
              : "bg-transparent text-text-secondary hover:bg-surface-accent dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white"
          )}
        >
          {isMultiSection ? 'Bab/Section' : 'Konten / Isi'}
          <span className="ml-2 opacity-60 text-xs bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
            {isMultiSection ? (sections?.length || 0) : (sections?.[0]?.items?.length || 0)}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'info' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <BacaanMetadataForm
              initialData={bacaan}
              onUpdate={handleUpdate}
            />
          </div>
        )}

        {activeTab === 'sections' && (
          <>
            {!isMultiSection ? (
              <SimpleItemsTab bacaan={bacaan} />
            ) : (
              <div className="flex flex-col gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-surface-accent/30 dark:bg-surface-accent-dark/30 rounded-xl border border-dashed border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    <p>Atur urutan dan isi konten per bagian.</p>
                  </div>
                  <button
                    onClick={() => setIsCreateSectionOpen(true)}
                    className="flex items-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-black/5"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Tambah Bab</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sections.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sections.map(section => (
                        <SortableSectionItem
                          key={section.id}
                          section={section}
                          bacaanId={bacaanId}
                          onDelete={(id: number) => deleteSection({ id, bacaanId })}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>

                  {(!sections || sections.length === 0) && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border-light dark:border-border-dark rounded-2xl text-text-secondary bg-surface-light/50 dark:bg-surface-dark/50">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">post_add</span>
                      <p className="font-medium">Belum ada bagian.</p>
                      <p className="text-sm opacity-70">Klik "Tambah Bab" untuk mulai mengisi konten.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateSectionModal
        isOpen={isCreateSectionOpen}
        onClose={() => setIsCreateSectionOpen(false)}
        onSubmit={handleCreateSection}
      />

      <PreviewModal
        bacaan={bacaan}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
