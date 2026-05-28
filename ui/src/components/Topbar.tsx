type TopbarProps = {
  title: string;
  mobileTitle?: string;
  onMenuClick: () => void;
};

export default function Topbar({
  title,
  mobileTitle,
  onMenuClick,
}: TopbarProps) {
  const compactTitle = mobileTitle ?? title;

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 bg-surface shadow-sm">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 px-container-padding-mobile sm:h-16 sm:gap-3 md:h-20 md:px-container-padding-desktop">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onMenuClick}
            className="-ml-1 shrink-0 rounded-lg p-2 text-on-surface hover:bg-surface-variant md:hidden"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="min-w-0 truncate font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary md:font-headline-lg md:text-headline-lg">
            <span className="md:hidden">{compactTitle}</span>
            <span className="hidden md:inline">{title}</span>
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-4">
          <div className="hidden items-center rounded-full bg-surface-container-high px-3 py-1.5 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary md:flex lg:px-4 lg:py-2">
            <span
              className="material-symbols-outlined mr-2"
              style={{ fontSize: 20 }}
            >
              search
            </span>
            <input
              className="w-32 border-none bg-transparent font-body-md text-body-md outline-none placeholder:text-outline lg:w-48"
              placeholder="Search tasks..."
              type="text"
            />
          </div>
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container sm:h-10 sm:w-10"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error sm:top-2 sm:right-2" />
          </button>
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container md:flex"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="ml-0.5 h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-full bg-secondary-container ring-2 ring-transparent transition-all hover:ring-primary-container sm:ml-1 sm:h-10 sm:w-10">
            <img
              alt="Profile"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
