import { useCallback, useEffect, useMemo, useState } from "react";
import ScheduleTaskCard from "../components/ScheduleTaskCard";
import { useGroupOutlet } from "../hooks/useGroupOutlet";
import { fetchSchedule } from "../services/api";
import { flatmateFilters } from "../models/tasks";
import type { Task } from "../types";
import {
  SCHEDULE_CATEGORY_FILTERS,
  filterScheduleTasks,
  formatPlannerRange,
  groupTasksFromToday,
  type ScheduleCategoryFilter,
} from "../utils/schedule";

const flatmateFilterDotClass: Record<string, string> = {
  All: "bg-outline-variant",
  Samarth: "bg-tertiary-container",
  Ashray: "bg-secondary-container",
  Sudhanshu: "bg-primary-container",
  Arpan: "bg-error-container",
};

export default function SchedulePage() {
  const { taskRefresh } = useGroupOutlet();
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [flatmateFilter, setFlatmateFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] =
    useState<ScheduleCategoryFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekLabel, setWeekLabel] = useState(formatPlannerRange());

  const filteredTasks = useMemo(
    () => filterScheduleTasks(allTasks, flatmateFilter, categoryFilter),
    [allTasks, flatmateFilter, categoryFilter],
  );

  const scheduleDays = useMemo(
    () => groupTasksFromToday(filteredTasks),
    [filteredTasks],
  );

  const hasActiveFilters =
    flatmateFilter !== "All" || categoryFilter !== "All";

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tasks = await fetchSchedule();
      setAllTasks(tasks);
      setWeekLabel(formatPlannerRange());
    } catch {
      setError("Could not load schedule. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule, taskRefresh]);

  const clearFilters = () => {
    setFlatmateFilter("All");
    setCategoryFilter("All");
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-container-padding-mobile md:p-container-padding-desktop">
      <div className="mx-auto max-w-[1200px] space-y-6 sm:space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface sm:font-headline-lg sm:text-headline-lg">
              Weekly Planner
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {weekLabel}
            </p>
          </div>
          <div className="flex w-fit shrink-0 items-center rounded-lg border border-surface-variant bg-surface-container-low p-1">
            <button
              type="button"
              className="rounded px-3 py-1.5 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container sm:px-4 sm:py-2"
            >
              Month
            </button>
            <button
              type="button"
              className="rounded bg-surface px-3 py-1.5 font-label-sm text-label-sm text-on-surface shadow-sm sm:px-4 sm:py-2"
            >
              Week
            </button>
          </div>
        </section>

        {error && (
          <p className="rounded-xl border border-error/30 bg-error-container/30 px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-4 shadow-[0_20px_20px_rgba(92,124,250,0.02)] sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="min-w-0 flex-1">
              <h3 className="mb-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Flatmates
              </h3>
              <div className="flex flex-wrap gap-2">
                {flatmateFilters.map((item) => {
                  const selected = flatmateFilter === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFlatmateFilter(item)}
                      aria-pressed={selected}
                      className={
                        item === "All"
                          ? `rounded-full border px-3 py-1.5 font-label-sm text-label-sm transition-all sm:px-4 sm:py-2 ${
                              selected
                                ? "border-transparent bg-primary-fixed text-on-primary-fixed"
                                : "border-surface-variant bg-surface text-on-surface hover:bg-surface-container"
                            }`
                          : `flex items-center gap-2 rounded-full border px-3 py-1.5 font-label-sm text-label-sm transition-all sm:px-4 sm:py-2 ${
                              selected
                                ? "border-primary bg-primary-fixed text-on-primary-fixed"
                                : "border-surface-variant bg-surface text-on-surface hover:bg-surface-container"
                            }`
                      }
                    >
                      {item !== "All" && (
                        <div
                          className={`h-3.5 w-3.5 shrink-0 rounded-full sm:h-4 sm:w-4 ${flatmateFilterDotClass[item] ?? "bg-outline-variant"}`}
                        />
                      )}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden w-px shrink-0 bg-surface-variant md:block" />
            <div className="h-px w-full shrink-0 bg-surface-variant md:hidden" />

            <div className="min-w-0 flex-1">
              <h3 className="mb-3 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {SCHEDULE_CATEGORY_FILTERS.map((item) => {
                  const selected = categoryFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategoryFilter(item.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 font-label-sm text-label-sm transition-all sm:px-4 sm:py-2 ${
                        selected
                          ? "border-primary bg-primary-fixed text-on-primary-fixed"
                          : "border-surface-variant bg-surface text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {hasActiveFilters && !loading && (
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-surface-variant pt-4">
              <p className="text-sm text-on-surface-variant">
                Showing {filteredTasks.length} of {allTasks.length} tasks
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="font-label-sm text-label-sm text-primary transition-colors hover:text-primary-container"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-on-surface-variant">Loading weekly schedule…</p>
        ) : allTasks.length === 0 ? (
          <p className="text-on-surface-variant">
            No tasks scheduled for the next 7 days.
          </p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-on-surface-variant">
            No tasks match these filters.{" "}
            <button
              type="button"
              onClick={clearFilters}
              className="text-primary hover:text-primary-container"
            >
              Clear filters
            </button>
          </p>
        ) : (
          <div className="-mx-container-padding-mobile hide-scrollbar overflow-x-auto px-container-padding-mobile pb-4 md:mx-0 md:px-0 md:pb-6">
            <p className="mb-2 font-body-sm text-body-sm text-on-surface-variant md:hidden">
              Swipe to see the full week
            </p>
            <div className="grid min-w-[720px] grid-cols-7 gap-2 sm:min-w-[900px] sm:gap-3 lg:min-w-[1000px] lg:gap-4">
              {scheduleDays.map((day) => (
                <div
                  key={day.isoDate}
                  className="flex min-w-0 flex-col gap-3 sm:gap-4"
                >
                  <div
                    className={`border-b-2 pb-2 text-center ${
                      day.isToday
                        ? "border-primary"
                        : "border-surface-variant opacity-70"
                    }`}
                  >
                    <div
                      className={`font-title-md text-base sm:text-title-md ${
                        day.isToday ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {day.label}
                    </div>
                    <div className="text-sm text-on-surface-variant sm:font-body-md sm:text-body-md">
                      {day.date}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    {day.tasks.length > 0 ? (
                      day.tasks.map((task: Task) => (
                        <ScheduleTaskCard key={task._id} task={task} />
                      ))
                    ) : (
                      <div className="flex h-20 items-center justify-center rounded-2xl border-2 border-dashed border-surface-variant bg-surface text-on-surface-variant opacity-40 sm:h-24">
                        <span className="text-xs">No tasks</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
