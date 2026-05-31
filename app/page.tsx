export default function Home() {
  return (
    <div className="grid grid-rows-[40px_1fr] h-screen bg-zinc-900">
      <TopBar />
      <div className="grid grid-cols-[280px_1fr] overflow-hidden">
        <LeftPanel />   {/* schema + presets */}
        <div className="grid grid-rows-2 overflow-hidden">
          <BuilderPanel />   {/* QueryGroup lives here */}
          <PreviewPanel />   {/* MongoDB code + results */}
        </div>
      </div>
    </div>
  )
}