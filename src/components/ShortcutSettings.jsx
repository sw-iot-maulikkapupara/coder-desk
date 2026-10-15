import { useState, memo } from "react";
import { validateAndSanitizeUrl, generateShortcutId } from "../utils/url";

/**
 * ShortcutSettings component inside the settings panel.
 * Allows adding, editing, deleting, reordering, and resetting shortcuts.
 *
 * @param {Object} props
 * @param {Array<{id: string, label: string, url: string}>} props.shortcuts - Array of shortcuts.
 * @param {(shortcut: {id: string, label: string, url: string}) => void} props.onAdd - Callback to add a new shortcut.
 * @param {(id: string, updated: {label: string, url: string}) => void} props.onUpdate - Callback to update a shortcut.
 * @param {(id: string) => void} props.onDelete - Callback to delete a shortcut.
 * @param {(fromIndex: number, toIndex: number) => void} props.onReorder - Callback to reorder shortcuts.
 * @param {() => void} props.onReset - Callback to reset shortcuts to default.
 */
function ShortcutSettings({
  shortcuts = [],
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onReset
}) {
  // Adding state
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [addError, setAddError] = useState(null);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState(null);

  // Confirmation state
  const [deletingId, setDeletingId] = useState(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  /* ================= ADD HANDLERS ================= */
  const handleOpenAdd = () => {
    setIsAdding(true);
    setNewLabel("");
    setNewUrl("");
    setAddError(null);
    setEditingId(null);
    setDeletingId(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewLabel("");
    setNewUrl("");
    setAddError(null);
  };

  const handleSaveNew = (e) => {
    e?.preventDefault();
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) {
      setAddError("Label cannot be empty");
      return;
    }

    const { isValid, sanitizedUrl, error } = validateAndSanitizeUrl(newUrl);
    if (!isValid) {
      setAddError(error || "Invalid URL");
      return;
    }

    onAdd({
      id: generateShortcutId(),
      label: trimmedLabel,
      url: sanitizedUrl
    });

    handleCancelAdd();
  };

  /* ================= EDIT HANDLERS ================= */
  const handleStartEdit = (shortcut) => {
    setEditingId(shortcut.id);
    setEditLabel(shortcut.label);
    setEditUrl(shortcut.url);
    setEditError(null);
    setIsAdding(false);
    setDeletingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
    setEditUrl("");
    setEditError(null);
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    const trimmedLabel = editLabel.trim();
    if (!trimmedLabel) {
      setEditError("Label cannot be empty");
      return;
    }

    const { isValid, sanitizedUrl, error } = validateAndSanitizeUrl(editUrl);
    if (!isValid) {
      setEditError(error || "Invalid URL");
      return;
    }

    onUpdate(editingId, {
      label: trimmedLabel,
      url: sanitizedUrl
    });

    handleCancelEdit();
  };

  /* ================= DELETE HANDLERS ================= */
  const handleStartDelete = (id) => {
    setDeletingId(id);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleConfirmDelete = (id) => {
    onDelete(id);
    setDeletingId(null);
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  /* ================= REORDER HANDLERS ================= */
  const handleMoveUp = (index) => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const handleMoveDown = (index) => {
    if (index < shortcuts.length - 1) {
      onReorder(index, index + 1);
    }
  };

  /* ================= RESET HANDLERS ================= */
  const handleConfirmReset = () => {
    onReset();
    setIsResetConfirming(false);
    handleCancelAdd();
    handleCancelEdit();
    handleCancelDelete();
  };

  return (
    <div className="shortcut-settings">
      <div className="shortcut-settings-header">
        <h4>Shortcuts</h4>
        {!isResetConfirming && (
          <button
            type="button"
            className="shortcut-reset-btn"
            onClick={() => setIsResetConfirming(true)}
            title="Reset to default shortcuts"
            aria-label="Reset shortcuts to defaults"
          >
            Reset
          </button>
        )}
      </div>

      {/* Reset Confirmation Prompt */}
      {isResetConfirming && (
        <div className="shortcut-confirm-box" role="alert">
          <p>Reset all shortcuts to defaults?</p>
          <div className="shortcut-confirm-actions">
            <button
              type="button"
              className="shortcut-confirm-btn danger"
              onClick={handleConfirmReset}
            >
              Yes, Reset
            </button>
            <button
              type="button"
              className="shortcut-confirm-btn secondary"
              onClick={() => setIsResetConfirming(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List of Shortcuts */}
      <div className="shortcut-list" role="list">
        {shortcuts.length === 0 ? (
          <div className="shortcut-empty">
            No shortcuts configured. Click &ldquo;+ Add Shortcut&rdquo; below to create one.
          </div>
        ) : (
          shortcuts.map((shortcut, index) => {
            const isEditing = editingId === shortcut.id;
            const isDeleting = deletingId === shortcut.id;

            if (isEditing) {
              return (
                <form
                  key={shortcut.id}
                  className="shortcut-form edit-form"
                  onSubmit={handleSaveEdit}
                >
                  <div className="shortcut-form-inputs">
                    <input
                      type="text"
                      placeholder="Label (e.g. GitHub)"
                      aria-label="Edit shortcut label"
                      value={editLabel}
                      autoFocus
                      onChange={(e) => setEditLabel(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="URL (e.g. https://github.com)"
                      aria-label="Edit shortcut URL"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                    />
                  </div>

                  {editError && (
                    <div className="shortcut-error" role="alert">
                      {editError}
                    </div>
                  )}

                  <div className="shortcut-form-actions">
                    <button type="submit" className="shortcut-save-btn">
                      Save
                    </button>
                    <button
                      type="button"
                      className="shortcut-cancel-btn"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              );
            }

            if (isDeleting) {
              return (
                <div
                  key={shortcut.id}
                  className="shortcut-confirm-box"
                  role="alert"
                >
                  <p>Delete &ldquo;{shortcut.label}&rdquo;?</p>
                  <div className="shortcut-confirm-actions">
                    <button
                      type="button"
                      className="shortcut-confirm-btn danger"
                      onClick={() => handleConfirmDelete(shortcut.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="shortcut-confirm-btn secondary"
                      onClick={handleCancelDelete}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={shortcut.id}
                className="shortcut-item"
                role="listitem"
              >
                <div className="shortcut-info">
                  <span className="shortcut-name">{shortcut.label}</span>
                  <span className="shortcut-url" title={shortcut.url}>
                    {shortcut.url}
                  </span>
                </div>

                <div className="shortcut-actions">
                  <button
                    type="button"
                    className="shortcut-action-btn"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    title={`Move "${shortcut.label}" up`}
                    aria-label={`Move "${shortcut.label}" up`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="shortcut-action-btn"
                    disabled={index === shortcuts.length - 1}
                    onClick={() => handleMoveDown(index)}
                    title={`Move "${shortcut.label}" down`}
                    aria-label={`Move "${shortcut.label}" down`}
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    className="shortcut-action-btn edit"
                    onClick={() => handleStartEdit(shortcut)}
                    title={`Edit "${shortcut.label}"`}
                    aria-label={`Edit "${shortcut.label}"`}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="shortcut-action-btn delete"
                    onClick={() => handleStartDelete(shortcut.id)}
                    title={`Delete "${shortcut.label}"`}
                    aria-label={`Delete "${shortcut.label}"`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Shortcut Form or Toggle Button */}
      {isAdding ? (
        <form className="shortcut-form add-form" onSubmit={handleSaveNew}>
          <div className="shortcut-form-inputs">
            <input
              type="text"
              placeholder="Label (e.g. GitHub)"
              aria-label="New shortcut label"
              value={newLabel}
              autoFocus
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL (e.g. https://github.com)"
              aria-label="New shortcut URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>

          {addError && (
            <div className="shortcut-error" role="alert">
              {addError}
            </div>
          )}

          <div className="shortcut-form-actions">
            <button type="submit" className="shortcut-save-btn">
              Add
            </button>
            <button
              type="button"
              className="shortcut-cancel-btn"
              onClick={handleCancelAdd}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="shortcut-add-toggle-btn"
          onClick={handleOpenAdd}
        >
          + Add Shortcut
        </button>
      )}
    </div>
  );
}

export default memo(ShortcutSettings);
