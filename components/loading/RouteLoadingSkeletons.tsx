import type { CSSProperties, ReactNode } from "react";

const skeletonBase =
  "shimmer-surface rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100";

const SkeletonBlock = ({
  className,
  style,
}: {
  className: string;
  style?: CSSProperties;
}) => (
  <div className={`${skeletonBase} ${className}`} style={style} />
);

const LoadingPanel = ({ children }: { children: ReactNode }) => (
  <div className="surface-panel p-5">
    {children}
  </div>
);

export const DashboardLoadingSkeleton = () => (
  <div className="page-shell">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-36" />
      <SkeletonBlock className="mt-4 h-10 w-80 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
    </LoadingPanel>

    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <LoadingPanel key={index}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="mt-3 h-10 w-16" />
            </div>
            <SkeletonBlock className="h-12 w-12" />
          </div>
          <SkeletonBlock className="mt-6 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-4/5" />
        </LoadingPanel>
      ))}
    </div>

    <div className="mt-5">
      <LoadingPanel>
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="mt-3 h-4 w-72 max-w-full" />
        <div className="mt-8 flex h-64 items-end gap-4">
          {[65, 46, 78, 38].map((height, index) => (
            <SkeletonBlock
              key={index}
              className="w-full"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </LoadingPanel>
    </div>
  </div>
);

export const WorkspacesLoadingSkeleton = () => (
  <div className="page-shell">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="mt-4 h-9 w-72 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-lg" />
    </LoadingPanel>
    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <LoadingPanel key={index}>
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-14 w-14" />
            <div className="flex-1">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="mt-3 h-4 w-28" />
            </div>
          </div>
          <SkeletonBlock className="mt-6 h-10 w-full" />
        </LoadingPanel>
      ))}
    </div>
  </div>
);

export const WorkspaceOverviewLoadingSkeleton = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <LoadingPanel>
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="mt-4 h-8 w-72 max-w-full" />
        <SkeletonBlock className="mt-3 h-4 w-full max-w-2xl" />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white bg-white/80 p-4"
            >
              <SkeletonBlock className="h-9 w-9" />
              <SkeletonBlock className="mt-4 h-7 w-12" />
              <SkeletonBlock className="mt-2 h-4 w-20" />
            </div>
          ))}
        </div>
      </LoadingPanel>

      <LoadingPanel>
        <SkeletonBlock className="h-5 w-28" />
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-10 w-full" />
          ))}
        </div>
      </LoadingPanel>
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <LoadingList rows={4} />
      <LoadingList rows={4} />
    </div>
  </div>
);

export const TasksLoadingSkeleton = () => (
  <div className="space-y-4">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-44" />
      <SkeletonBlock className="mt-4 h-8 w-80 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-2xl" />
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-14 w-full" />
        ))}
      </div>
    </LoadingPanel>

    <LoadingPanel>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-16 w-full" />
        ))}
      </div>
    </LoadingPanel>
  </div>
);

export const BoardLoadingSkeleton = () => (
  <div className="space-y-4">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-36" />
      <SkeletonBlock className="mt-4 h-8 w-72 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
    </LoadingPanel>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, columnIndex) => (
        <LoadingPanel key={columnIndex}>
          <div className="mb-4 flex items-center justify-between">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-7 w-9 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <SkeletonBlock key={cardIndex} className="h-32 w-full" />
            ))}
          </div>
        </LoadingPanel>
      ))}
    </div>
  </div>
);

export const TaskDetailsLoadingSkeleton = () => (
  <div className="space-y-5">
    <div className="flex items-center justify-between gap-3">
      <SkeletonBlock className="h-5 w-28" />
      <SkeletonBlock className="h-9 w-24" />
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <LoadingPanel>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="mt-4 h-9 w-full max-w-xl" />
            <SkeletonBlock className="mt-3 h-4 w-48" />
          </div>
          <SkeletonBlock className="h-12 w-12" />
        </div>
        <SkeletonBlock className="mt-8 h-28 w-full" />
        <SkeletonBlock className="mt-6 h-24 w-full" />
      </LoadingPanel>

      <div className="space-y-4">
        <LoadingList rows={2} />
        <LoadingList rows={3} />
        <LoadingList rows={1} />
      </div>
    </div>
  </div>
);

export const ActivityLoadingSkeleton = () => (
  <div className="space-y-4">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-36" />
      <SkeletonBlock className="mt-4 h-8 w-72 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
    </LoadingPanel>
    <LoadingList rows={6} />
  </div>
);

export const MembersLoadingSkeleton = () => (
  <LoadingPanel>
    <div className="space-y-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-16 w-full" />
      ))}
    </div>
  </LoadingPanel>
);

export const NotificationsLoadingSkeleton = () => (
  <div className="page-shell">
    <LoadingPanel>
      <SkeletonBlock className="h-3 w-36" />
      <SkeletonBlock className="mt-4 h-9 w-72 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
    </LoadingPanel>
    <div className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <LoadingPanel>
        <SkeletonBlock className="h-20 w-full" />
        <SkeletonBlock className="mt-3 h-20 w-full" />
      </LoadingPanel>
      <LoadingList rows={6} />
    </div>
  </div>
);

export const FormLoadingSkeleton = () => (
  <div className="page-shell">
    <LoadingPanel>
      <SkeletonBlock className="h-8 w-64 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full max-w-lg" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full" />
        ))}
      </div>
      <SkeletonBlock className="mt-4 h-28 w-full" />
      <SkeletonBlock className="mt-6 h-12 w-40" />
    </LoadingPanel>
  </div>
);

const LoadingList = ({ rows }: { rows: number }) => (
  <LoadingPanel>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <SkeletonBlock className="h-10 w-10" />
          <div className="flex-1">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </LoadingPanel>
);
