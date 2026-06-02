"use client"

import { useState } from "react"
import {
  Group,
  Panel,
  Separator,
} from "react-resizable-panels"
import { Star } from "lucide-react"

import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts"
import { TopBar } from "@/components/layout/TopBar"
import { BuilderPanel } from "@/components/panels/BuilderPanel"
import { LeftPanel } from "@/components/panels/LeftPanel"
import { PreviewPanel } from "@/components/panels/PreviewPanel"

function BuilderWorkspace() {
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

function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-black p-3 text-white">
      <section
        className="relative min-h-[calc(100vh-24px)] overflow-hidden border border-gray-800 bg-cover bg-center"
        style={{ backgroundImage: "url('/landing-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#111315]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,10,10,0.42),#000_82%),radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.10),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-[58%] bg-[url('/landing-bg.jpg')] bg-cover bg-center opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:160px_160px] opacity-25" />

        <div className="relative mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-7xl flex-col px-7 py-6">
          <header className="landing-fade-in grid grid-cols-3 items-center text-xs text-gray-300">
            <nav className="hidden items-center gap-8 md:flex">
              <span>Featured</span>
              <span>Sources</span>
              <span>Resources</span>
            </nav>

            <div className="col-start-1 flex items-center gap-2 md:col-start-2 md:justify-center">
              <Star size={18} fill="currentColor" className="text-white" />
              <span className="font-semibold tracking-wide text-white">SOLLY</span>
            </div>

           
            
          </header>

          <div className="flex flex-1 flex-col items-center pt-16 text-center">
            <div className="landing-fade-up inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs text-gray-100">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Turn raw filters into visual query logic
            </div>

            <h1 className="landing-fade-up mt-6 max-w-3xl text-5xl leading-[1.02] tracking-tight text-white [animation-delay:90ms] md:text-7xl">
              Take Full Control of Your Query Workflows
            </h1>

            <p className="landing-fade-up mt-4 max-w-2xl text-sm leading-6 text-gray-200 [animation-delay:160ms]">
              Build nested filters, switch schemas, preview generated MongoDB queries, and inspect
              simulated results from one visual workspace.
            </p>

            <div className="landing-fade-up mt-7 flex items-center gap-3 [animation-delay:230ms]">
              <button
                onClick={onLaunch}
                className="rounded bg-black/45 px-4 py-2 text-xs font-semibold text-white hover:bg-black/70"
              >
                Learn More
              </button>
              <button
                onClick={onLaunch}
                className="rounded bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-gray-200"
              >
                Get Started
              </button>
            </div>

            <div className="landing-fade-up mt-20 w-full max-w-6xl [animation-delay:320ms]">
              <div className="landing-float rounded-2xl border border-gray-700 bg-[#080a0f] p-4 text-left shadow-2xl shadow-black/70">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={18} fill="currentColor" className="text-white" />
                    <span className="font-semibold tracking-wide text-white">SOLLY</span>
                  </div>
                  <div className="hidden items-center gap-5 text-[11px] text-gray-500 md:flex">
                    <span className="rounded bg-white px-2 py-1 font-semibold text-black">Builder</span>
                    <span>Schema</span>
                    <span>Preview</span>
                    <span>Results</span>
                  </div>
                  <button
                    onClick={onLaunch}
                    className="rounded border border-gray-700 bg-white px-3 py-1.5 text-[11px] font-semibold text-black"
                  >
                    Export
                  </button>
                </div>

                <div className="mb-5">
                  <h2 className="text-2xl text-white">Welcome Back, Builder</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Track schemas, create nested filters, and preview generated queries in real time.
                  </p>
                </div>

                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-xl border border-gray-800 bg-[#101216] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold text-white">Query performance overview</p>
                      <span className="rounded border border-gray-800 px-2 py-1 text-[10px] text-gray-500">Live</span>
                    </div>
                    <div className="mb-3 flex items-end gap-2">
                      <span className="text-2xl font-semibold text-white">3 schemas</span>
                      <span className="text-xs text-emerald-300">+ visual filters</span>
                    </div>
                    <div className="relative h-44 overflow-hidden rounded-lg border border-gray-800 bg-black/45">
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(135deg,transparent_0_8%,rgba(16,185,129,0.18)_8%_9%,transparent_9%_18%,rgba(16,185,129,0.15)_18%_19%,transparent_19%_32%,rgba(16,185,129,0.22)_32%_33%,transparent_33%_100%)]" />
                      <div className="landing-glow absolute bottom-12 left-[64%] size-2 rounded-full bg-emerald-300" />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#101216] to-transparent" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Nested Groups", "AND / OR logic", "text-emerald-300"],
                      ["Live Preview", "MongoDB output", "text-rose-300"],
                      ["Validation", "Schema-aware checks", "text-yellow-300"],
                      ["Results", "Filtered mock rows", "text-sky-300"],
                    ].map(([title, value, color]) => (
                      <div key={title} className="rounded-xl border border-gray-800 bg-[#101216] p-4">
                        <p className="text-xs text-gray-500">{title}</p>
                        <p className={`mt-3 text-lg font-semibold ${color}`}>{value}</p>
                        <div className="mt-4 h-10 rounded bg-black/35" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="landing-fade-up mt-10 w-full max-w-6xl pb-8 [animation-delay:420ms]">
              <p className="text-center text-[11px] text-gray-500">
                Trusted by query builders, dashboard makers, and frontend engineers
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold text-gray-500 opacity-80">
                <span>lorem</span>
                <span>ipsum</span> 
                <span>dolor </span>
                <span>sit amet</span>
                <span>consectetur </span>
                <span>adipisicing </span>
                <span>assumenda </span>
                <span> molestiae </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function Home() {
  const [showBuilder, setShowBuilder] = useState(false)

  if (showBuilder) {
    return <BuilderWorkspace />
  }

  return <LandingPage onLaunch={() => setShowBuilder(true)} />
}
