export function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="hidden w-64 border-r border-gray-800/50 bg-black/80 md:block" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="h-16 border-b border-gray-800/50 bg-black/60" />

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="col-span-1 h-[250px] animate-pulse rounded-lg bg-gray-800/20 md:col-span-2" />
              <div className="h-[250px] animate-pulse rounded-lg bg-gray-800/20" />
            </div>

            <div className="h-[400px] animate-pulse rounded-lg bg-gray-800/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

