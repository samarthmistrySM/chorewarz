import type { Task } from "../types";

const iconForType: Record<Task["type"], string> = {
  cleaning: "mop",
  garbage: "delete",
  water: "water_drop",
  groceries: "shopping_cart",
  bills: "receipt",
};

const flatmateBadgeClass: Record<string, string> = {
  Samarth: "bg-tertiary-container text-on-tertiary-container",
  Ashray: "bg-secondary-container text-on-secondary-container",
  Sudhanshu: "bg-primary-container text-on-primary-container",
  Arpan: "bg-error-container text-on-error-container",
};

export default function ScheduleTaskCard({ task }: { task: Task }) {
  const isDone = Boolean(task.completedAt);

  const nameParts = task.owner.displayName.split(" ").filter(Boolean);
  const initials =
    nameParts.length > 1
      ? nameParts
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : task.owner.displayName.slice(0, 2).toUpperCase();

  const dueLabel = isDone
    ? "Done"
    : task.description
      ? task.description
      : task.dueAt
        ? `Due: ${new Date(task.dueAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "Anytime";

  const badgeClass =
    flatmateBadgeClass[task.owner.displayName] ??
    "bg-surface-container text-on-surface-variant";

  return (
    <div
      className={`group w-full min-w-0 rounded-2xl border p-3 shadow-[0_20px_20px_rgba(92,124,250,0.02)] transition-all sm:p-4 ${
        isDone
          ? "cursor-default border-surface-variant bg-surface-container opacity-70"
          : "cursor-pointer border-surface-variant bg-surface-container-lowest hover:-translate-y-0.5 hover:shadow-[0_20px_20px_rgba(92,124,250,0.06)]"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div
          className={`rounded-lg p-1.5 transition-colors ${
            isDone
              ? "bg-primary-fixed text-on-primary-fixed"
              : "bg-surface-container text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-on-primary-fixed"
          }`}
        >
          <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
            {isDone ? "check_circle" : iconForType[task.type]}
          </span>
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${badgeClass}`}
          title={task.owner.displayName}
        >
          {initials}
        </div>
      </div>
      <h4
        className={`line-clamp-2 text-sm font-semibold leading-tight sm:text-base ${
          isDone
            ? "text-on-surface-variant line-through decoration-on-surface-variant"
            : "text-on-surface"
        }`}
      >
        {task.title}
      </h4>
      <p
        className={`mt-1 truncate text-[11px] sm:text-xs ${
          isDone
            ? "text-on-surface-variant line-through decoration-on-surface-variant"
            : "text-on-surface-variant"
        }`}
      >
        {dueLabel}
      </p>
    </div>
  );
}
