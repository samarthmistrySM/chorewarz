import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createTask, fetchMembers, fetchMyMember } from "../services/api";
import type { Member, TaskCategory } from "../types";

const CRIB_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDNexOwi4Gny55kEC-1wx2BhPUuFCHMFEgrJuyYgGRJ6GG5ZTMTmLUzAPvD68UHPZzY_0gP-fGsBixKVPz-5JlAnyrCyj7z0ncs20Hz1ESGMkhtoslyK50vIEif_Y4ACrZX4w5y6YkA3Rsj9xzjZBLwjO8cxffnxIhWXosgHUNPPra-Sac_7rVfgaSp84xODBhVlSdLx-7IkCfEuHd4hDD71DoiLp_I7IC658dHPR9Y0KwjHiDU-bo1iuG89Hvk4TEYwi6z67fXcSCI";

const CATEGORIES: {
  id: TaskCategory;
  label: string;
  icon: string;
}[] = [
  { id: "groceries", label: "Groceries", icon: "shopping_cart" },
  { id: "cleaning", label: "Cleaning", icon: "auto_awesome" },
  { id: "bills", label: "Bills", icon: "receipt" },
  { id: "trash", label: "Trash", icon: "delete" },
  { id: "water_motor", label: "Water", icon: "water_drop" },
];

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

function todayInputValue() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AddTaskModal({
  open,
  onClose,
  onCreated,
}: AddTaskModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [title, setTitle] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [dueAt, setDueAt] = useState(todayInputValue());
  const [category, setCategory] = useState<TaskCategory>("groceries");
  const [submitting, setSubmitting] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    setError(null);
    try {
      const [list, me] = await Promise.all([
        fetchMembers(),
        fetchMyMember().catch(() => null),
      ]);
      setMembers(list);
      if (list.length === 0) {
        setOwnerId("");
        setError(
          "No flatmates in this group yet. Ask roommates to join, or run npm run seed:members for demo data.",
        );
      } else {
        const myId = me?._id;
        const preferred =
          myId && list.some((m) => m._id === myId) ? myId : list[0]._id;
        setOwnerId((current) =>
          list.some((m) => m._id === current) ? current : preferred,
        );
      }
    } catch {
      setMembers([]);
      setOwnerId("");
      setError("Could not load flatmates. Check that the server is running.");
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    setTitle("");
    setDueAt(todayInputValue());
    setCategory("groceries");
    loadMembers();
  }, [open, loadMembers]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const hasAssignees = members.length > 0;
  const canSubmit = hasAssignees && !loadingMembers && !submitting;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!hasAssignees) {
      setError(
        "No flatmates in this group. Join the group or invite others first.",
      );
      return;
    }
    if (!title.trim() || !ownerId || !dueAt) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createTask({
        title: title.trim(),
        ownerId,
        dueAt,
        category,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-container-padding-mobile"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#191c1e]/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative flex max-h-[min(92vh,900px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[24px] border border-outline-variant bg-surface-container-lowest shadow-[0_20px_20px_rgba(92,124,250,0.05)]">
        <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
          <h2
            id="add-task-title"
            className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg"
          >
            Create New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="task-title"
                className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant"
              >
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep clean the kitchen counters"
                className="h-14 w-full rounded-xl border-none bg-surface-container-low px-4 font-body-md text-body-md text-on-surface transition-all outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="task-assignee"
                  className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant"
                >
                  Assignee
                </label>
                {loadingMembers ? (
                  <div className="flex h-14 items-center rounded-xl bg-surface-container-low px-4 text-body-md text-on-surface-variant">
                    Loading flatmates…
                  </div>
                ) : hasAssignees ? (
                  <div className="relative">
                    <select
                      id="task-assignee"
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      className="h-14 w-full appearance-none rounded-xl border-none bg-surface-container-low px-4 font-body-md text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
                    >
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.displayName}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute top-4 right-4 text-on-surface-variant">
                      expand_more
                    </span>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-4 py-3">
                    <p className="text-sm text-on-surface-variant">
                      No flatmates in the database yet.
                    </p>
                    <button
                      type="button"
                      onClick={loadMembers}
                      className="mt-2 font-label-sm text-label-sm text-primary transition-colors hover:text-primary-container"
                    >
                      Retry loading
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="task-due-date"
                  className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant"
                >
                  Due Date
                </label>
                <div className="relative">
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className="h-14 w-full rounded-xl border-none bg-surface-container-low px-4 font-body-md text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
                  />
                  <span className="material-symbols-outlined pointer-events-none absolute top-4 right-4 text-on-surface-variant">
                    calendar_today
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Category
              </span>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
                role="radiogroup"
                aria-label="Task category"
              >
                {CATEGORIES.map((item) => {
                  const selected = category === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setCategory(item.id)}
                      className={`flex min-h-[5.5rem] flex-col items-center justify-center rounded-xl border-2 px-3 py-5 text-center transition-all sm:min-h-0 sm:p-4 ${
                        selected
                          ? "border-primary bg-primary-fixed shadow-[0_0_0_1px_var(--primary)]"
                          : "border-transparent bg-surface-container-low hover:bg-surface-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined mb-2 text-[26px] sm:text-[24px] ${
                          selected ? "text-on-primary-fixed" : "text-primary"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm leading-tight ${
                          selected
                            ? "text-on-primary-fixed"
                            : "text-on-surface"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative mt-2 h-32 overflow-hidden rounded-xl">
              <img
                src={CRIB_IMAGE}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-4">
                <span className="flex items-center gap-2 font-label-sm text-label-sm text-white">
                  <span className="material-symbols-outlined text-[16px]">
                    info
                  </span>
                  Adding to &apos;The Crib&apos; collective list
                </span>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-error">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex shrink-0 flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex min-h-16 flex-1 items-center justify-center rounded-full border-2 border-outline-variant font-title-md text-title-md text-on-surface transition-all hover:bg-surface-variant active:translate-y-px disabled:opacity-60 sm:min-h-0 sm:h-14"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex min-h-16 flex-[2] items-center justify-center gap-2 rounded-full bg-primary font-title-md text-title-md text-on-primary shadow-[0_20px_20px_rgba(92,124,250,0.05)] transition-all hover:bg-primary-container active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:h-14"
            >
              <span className="material-symbols-outlined">add_task</span>
              {submitting ? "Adding…" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
