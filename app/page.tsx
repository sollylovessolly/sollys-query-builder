import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts"
import { TopBar } from "@/components/layout/TopBar"
import { BuilderPanel } from "@/components/panels/BuilderPanel"
import { LeftPanel } from "@/components/panels/LeftPanel"
import { PreviewPanel } from "@/components/panels/PreviewPanel"

export default function Home() {
  return (
    <main className="grid h-screen grid-rows-[58px_1fr] bg-background text-foreground">
      <KeyboardShortcuts />
      <TopBar />
      <div className="grid min-h-0 grid-cols-[316px_1fr] gap-3 overflow-hidden p-3">
        <LeftPanel />
        <div className="grid min-h-0 grid-rows-[1fr_1.15fr] gap-3 overflow-hidden">
          <BuilderPanel />
          <PreviewPanel />
        </div>
      </div>
    </main>
  )
}
