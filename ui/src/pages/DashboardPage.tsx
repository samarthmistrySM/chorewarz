import { useCallback, useEffect, useState } from "react";
import DashboardTaskCard from "../components/DashboardTaskCard";
import { useGroupOutlet } from "../hooks/useGroupOutlet";
import { completeTask, fetchTasks } from "../services/api";
import type { Task } from "../types";
import { splitDashboardTasks } from "../utils/schedule";

export default function DashboardPage() {
  const { taskRefresh } = useGroupOutlet();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data.tasks);
      setProgress(data.progress);
    } catch {
      setError("Could not load tasks. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, taskRefresh]);

  const handleComplete = async (taskId: string) => {
    try {
      await completeTask(taskId);
      await loadTasks();
    } catch {
      setError("Could not mark task as complete.");
    }
  };

  const { active, upcoming } = splitDashboardTasks(tasks);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-container-padding-mobile md:p-container-padding-desktop">
      <div className="mx-auto max-w-[1200px]">
        <section className="mb-gutter">
          <h2 className="mb-2 font-title-md text-title-md text-on-surface">
            Weekly Flat Progress
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(progress, 8)}%` }}
              />
            </div>
            <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant">
              {loading ? "…" : `${progress}% Done`}
            </span>
          </div>
        </section>

        {error && (
          <p className="mb-4 rounded-xl border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
          <section className="flex flex-col gap-card-gap lg:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-title-md text-title-md text-on-surface">
                Active Chores
              </h3>
              <button
                type="button"
                className="shrink-0 font-label-sm text-label-sm text-primary transition-colors hover:text-primary-container"
              >
                Filter
              </button>
            </div>

            {loading ? (
              <p className="text-on-surface-variant">Loading chores…</p>
            ) : active.length === 0 ? (
              <p className="text-on-surface-variant">No active chores right now.</p>
            ) : (
              <div className="flex flex-col gap-card-gap">
                {active.map((task) => (
                  <DashboardTaskCard
                    key={task._id}
                    task={task}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            )}
          </section>

          <aside className="flex flex-col rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-sm sm:p-gutter lg:col-span-1">
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
              <h3 className="font-title-md text-title-md text-on-surface">
                Up Next This Week
              </h3>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container"
                aria-label="More options"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 20 }}
                >
                  more_horiz
                </span>
              </button>
            </div>

            <div className="relative flex flex-col">
              <div className="absolute top-2 bottom-4 left-4 w-px bg-surface-variant" />
              {loading ? (
                <p className="py-4 text-sm text-on-surface-variant">Loading…</p>
              ) : upcoming.length === 0 ? (
                <p className="py-4 text-sm text-on-surface-variant">
                  Nothing else scheduled this week.
                </p>
              ) : (
                upcoming.slice(0, 5).map((task, index) => (
                  <div
                    key={task._id}
                    className="relative flex gap-3 py-3 sm:gap-4"
                  >
                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest ${
                        index === 0
                          ? "border-2 border-primary"
                          : "border-2 border-surface-variant"
                      }`}
                    >
                      {index === 0 && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 rounded-lg border border-transparent bg-surface p-3">
                      <p
                        className={`mb-1 font-label-sm text-label-sm ${index === 0 ? "text-primary" : "text-on-surface-variant"}`}
                      >
                        {new Date(task.dueAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <h4 className="truncate font-body-md text-body-md font-medium text-on-surface">
                        {task.title}
                      </h4>
                      <p className="mt-1 truncate text-sm text-on-surface-variant">
                        {task.owner.displayName}
                        {task.description ? ` · ${task.description}` : ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              className="mt-4 w-full pt-4 text-center font-label-sm text-label-sm text-primary transition-colors hover:text-primary-container sm:mt-auto sm:pt-6"
            >
              View Full Calendar
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
