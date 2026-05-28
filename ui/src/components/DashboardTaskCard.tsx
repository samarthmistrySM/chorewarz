import type { Task } from "../types";

const iconForType: Record<Task["type"], string> = {
  cleaning: "cleaning_services",
  garbage: "delete",
  water: "water_drop",
  groceries: "shopping_cart",
  bills: "receipt",
};

function formatDueText(dueAt: string) {
  const due = new Date(dueAt);
  const today = new Date();
  const offset = Math.floor(
    (due.setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24),
  );

  if (offset < 0) return "Overdue";
  if (offset === 0) return "Due Today";
  if (offset === 1) return "Due Tomorrow";
  return `Due in ${offset} days`;
}

type DashboardTaskCardProps = {
  task: Task;
  onComplete?: (taskId: string) => void;
};

export default function DashboardTaskCard({
  task,
  onComplete,
}: DashboardTaskCardProps) {
  const dueText = formatDueText(task.dueAt);
  const overdue = dueText === "Overdue";
  const isToday = dueText === "Due Today";

  return (
    <div
      className={`rounded-xl border p-4 shadow-[0_20px_25px_rgba(92,124,250,0.05)] sm:rounded-[28px] sm:p-6 ${
        overdue
          ? "border-error bg-error-container/20"
          : "border-surface-variant bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-3xl ${
              overdue
                ? "bg-error/10 text-error"
                : "bg-primary-fixed text-on-primary-fixed"
            }`}
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
              {iconForType[task.type]}
            </span>
          </div>
          <div className="min-w-0">
            <h3
              className={`truncate font-title-md text-title-md ${
                overdue ? "text-on-error" : "text-on-surface"
              }`}
            >
              {task.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant sm:mt-2 sm:gap-3 sm:text-body-sm sm:font-body-md">
              <span className="inline-flex items-center gap-1 sm:gap-2">
                <span
                  className="material-symbols-outlined text-[16px] sm:text-[18px]"
                >
                  person
                </span>
                {task.owner.displayName}
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-2">
                <span
                  className="material-symbols-outlined text-[16px] sm:text-[18px]"
                >
                  calendar_today
                </span>
                {dueText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-wrap sm:justify-end">
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:rounded-pill sm:px-3 sm:py-2 sm:uppercase sm:tracking-[0.16em] ${
              overdue
                ? "bg-error/10 text-error"
                : isToday
                  ? "bg-primary-fixed text-primary"
                  : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {overdue ? "Action Required" : isToday ? "Urgent" : "Pending"}
          </span>
          <button
            type="button"
            onClick={() => onComplete?.(task._id)}
            className="h-10 shrink-0 rounded-lg border border-surface-variant bg-surface-container px-4 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high sm:h-11 sm:rounded-full sm:px-5"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
