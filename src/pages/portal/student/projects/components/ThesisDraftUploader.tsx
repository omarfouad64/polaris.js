import { useState } from 'react';
import { type ThesisDraft } from '../scripts/useStudentProjects';
import Button from '../../../../../components/Button';

interface ThesisDraftUploaderProps {
  drafts: ThesisDraft[];
  onDraftsChange: (drafts: ThesisDraft[]) => void;
}

/**
 * ThesisDraftUploader — Manages thesis draft uploads for Bachelor Projects.
 * Simulated upload by allowing users to add draft names.
 *
 * @param drafts - List of current thesis drafts.
 * @param onDraftsChange - Callback when the draft list is modified.
 */
export default function ThesisDraftUploader({
  drafts,
  onDraftsChange,
}: ThesisDraftUploaderProps) {
  const [newDraftName, setNewDraftName] = useState('');

  const handleAddDraft = () => {
    if (!newDraftName.trim()) return;

    const newDraft: ThesisDraft = {
      id: `draft-${Date.now()}`,
      name: newDraftName.trim(),
      uploadDate: new Date().toISOString().split('T')[0],
      isFinal: false,
    };

    onDraftsChange([...drafts, newDraft]);
    setNewDraftName('');
  };

  const handleRemoveDraft = (id: string) => {
    onDraftsChange(drafts.filter((d) => d.id !== id));
  };

  const handleSetFinal = (id: string) => {
    onDraftsChange(
      drafts.map((d) => ({
        ...d,
        isFinal: d.id === id,
      }))
    );
  };

  return (
    <div className="mb-6 p-6 bg-surface-container-low rounded-xl border border-outline-variant/40">
      <h3 className="text-lg font-jakarta font-semibold text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">description</span>
        Thesis Drafts
      </h3>
      
      <p className="text-sm font-lexend text-on-surface-variant mb-4">
        As a Bachelor Project, you can upload multiple thesis drafts. <strong>Only the Final Draft will be public</strong> and visible to others; all other drafts remain private.
      </p>

      {/* Draft List */}
      {drafts.length > 0 ? (
        <div className="space-y-3 mb-6">
          {drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  draft
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-jakarta font-semibold text-on-surface">
                      {draft.name}
                    </p>
                    {draft.isFinal && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-jakarta font-bold rounded-full border border-success/20 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        FINAL DRAFT
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-lexend text-on-surface-variant">
                    Added on {new Date(draft.uploadDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!draft.isFinal && (
                  <button
                    type="button"
                    onClick={() => handleSetFinal(draft.id)}
                    className="px-3 py-1.5 text-xs font-jakarta font-semibold text-secondary hover:bg-secondary/10 rounded-lg transition-colors border border-secondary/20"
                  >
                    Set as Final
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveDraft(draft.id)}
                  className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                  title="Remove draft"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-outline-variant/30 rounded-lg mb-6">
          <p className="text-sm font-lexend text-on-surface-variant">
            No thesis drafts uploaded yet.
          </p>
        </div>
      )}

      {/* Add Draft Section */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={newDraftName}
            onChange={(e) => setNewDraftName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDraft())}
            placeholder="Enter draft name (e.g., Draft V1, Final Draft Prototype)"
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-150"
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddDraft}
          disabled={!newDraftName.trim()}
          className="whitespace-nowrap"
        >
          Add Draft
        </Button>
      </div>
    </div>
  );
}
