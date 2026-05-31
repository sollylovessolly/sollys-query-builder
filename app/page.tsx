import { TopBar } from "@/components/layout/TopBar"
import { BuilderPanel } from "@/components/panels/BuilderPanel"
import { LeftPanel } from "@/components/panels/LeftPanel"
import { PreviewPanel } from "@/components/panels/PreviewPanel"

export default function Home() {
  return (
    <main className="grid h-screen grid-rows-[48px_1fr] bg-zinc-950 text-zinc-100">
      <TopBar />
      <div className="grid min-h-0 grid-cols-[280px_1fr] overflow-hidden">
        <LeftPanel />
        <div className="grid min-h-0 grid-rows-2 overflow-hidden">
          <BuilderPanel />
          <PreviewPanel />
        </div>
      </div>
    </main>
  )
}
