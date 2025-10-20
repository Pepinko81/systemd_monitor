interface HeaderProps {
  lastUpdate: string;
}

export function Header({ lastUpdate }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-orange-100 to-amber-100 backdrop-blur-lg p-5 md:p-7 rounded-3xl mb-6 shadow-2xl border border-orange-200/50">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 mb-4">
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 md:p-4 rounded-2xl shadow-lg">
          <img
            src="/logo.png"
            alt="SystemD Services Monitor"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-lg"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent tracking-tight text-center">
          SystemD Services Monitor
        </h1>
      </div>
      <div className="text-center text-sm md:text-base text-gray-600 flex flex-col sm:flex-row sm:space-x-8 gap-2 sm:gap-0 justify-center">
        <span>Last updated: <span className="text-orange-700 font-semibold">{lastUpdate}</span></span>
        <span>Auto-refresh: <span className="text-amber-600 font-semibold">5s</span></span>
      </div>
    </header>
  );
}
