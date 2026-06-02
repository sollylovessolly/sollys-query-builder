"use client"

import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels"

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

      <Group
        orientation="horizontal"
        resizeTargetMinimumSize={{ fine: 28, coarse: 36 }}
        className="min-h-0 gap-3 p-3"
      >
        <Panel defaultSize="316px" minSize="280px" maxSize="460px" className="min-h-0 overflow-hidden">
          <LeftPanel />
        </Panel>

        <Separator className="app-animate-soft grid w-2 shrink-0 place-items-center rounded-full border border-transparent bg-transparent hover:border-rose-900/70 hover:bg-rose-950/40 data-[resize-handle-active]:border-rose-800 data-[resize-handle-active]:bg-rose-950/60">
          <span className="h-10 w-px rounded-full bg-gray-500/70" />
        </Separator>

        <Panel minSize="520px" className="min-h-0 overflow-hidden">
          <Group
            orientation="vertical"
            resizeTargetMinimumSize={{ fine: 28, coarse: 36 }}
            className="min-h-0 gap-3"
          >
            <Panel defaultSize="46" minSize="28" className="min-h-0 overflow-hidden">
              <BuilderPanel />
            </Panel>

            <Separator className="app-animate-soft grid h-2 shrink-0 place-items-center rounded-full border border-transparent bg-transparent hover:border-rose-900/70 hover:bg-rose-950/40 data-[resize-handle-active]:border-rose-800 data-[resize-handle-active]:bg-rose-950/60">
              <span className="h-px w-10 rounded-full bg-gray-500/70" />
            </Separator>

            <Panel minSize="25" className="min-h-0 overflow-hidden">
              <PreviewPanel />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </main>
  )
}
