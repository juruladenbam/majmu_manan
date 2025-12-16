import type { Bacaan } from '@project/shared';

export const PreviewModal = ({ bacaan, isOpen, onClose }: { bacaan: Bacaan; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-gray-800 text-sm">Preview Public App</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 font-medium text-sm">Tutup</button>
        </div>

        {/* Mobile Viewport Simulation */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="bg-white min-h-full shadow-sm max-w-sm mx-auto border-x border-gray-100">
            {/* App Bar */}
            <div className="bg-[#1a5f4a] text-white py-4 px-4 sticky top-0 z-10 shadow-md">
              <h1 className="font-serif font-bold text-lg">Majmu' Manan</h1>
            </div>

            <div className="p-4 pb-20">
              <div className="flex flex-col gap-6">
                {/* Title */}
                <div className="text-center py-6">
                  {bacaan.judul_arab && (
                    <h1 className="text-3xl font-bold font-arabic mb-2 text-black leading-relaxed">{bacaan.judul_arab}</h1>
                  )}
                  <h2 className="text-xl font-bold text-[#1a5f4a]">{bacaan.judul}</h2>
                </div>

                {bacaan.sections?.map((section) => (
                  <div key={section.id} className="w-full">
                    <div className="p-3 bg-gray-100 border-l-4 border-[#1a5f4a] mb-4 rounded-r-lg">
                      <span className="font-bold text-gray-800 text-sm">{section.judul_section}</span>
                    </div>

                    <div className="flex flex-col gap-4 px-2">
                      {section.items?.map((item) => (
                        <div key={item.id} className="py-4 border-b border-gray-100 last:border-0">
                          {item.arabic && (
                            <div
                              className="text-2xl text-right font-arabic leading-loose mb-3 text-gray-900"
                              dangerouslySetInnerHTML={{ __html: item.arabic }}
                            />
                          )}
                          {item.latin && (
                            <p className="text-sm text-[#1a5f4a] italic mb-1 font-medium">
                              {item.latin}
                            </p>
                          )}
                          {item.terjemahan && (
                            <p className="text-sm text-gray-600">
                              {item.terjemahan}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
