import { Bar, Meter, Stage, Window, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './tools.css'

// Commonplace, Built-in tools: the offline file converter mid-queue. A feature
// card still. The browser window is inset top and left and runs off the right
// and the bottom; inside it the Convert files panel sits on the app's gray page,
// as the real deep-dive draws it. The queue bar says how far the whole batch
// has come, and the story row is the one file converting right now: tinted,
// its own bar part filled, settling in under the row that just finished
// ("Done, reopened and checked"). The rows below wait as quiet filler.
//
// Real strings: Convert files, Queue · 240 files, Pause, the finished file and
// its result, the converting file and its percent. Everything else is bars.

type Geo = { win: { x: number; y: number; w: number; h: number }; pr: number; filler: number }

// Wide: 40px gutters left and top; the window runs off the right and the
// bottom, and its panel ends a full gutter inside the stage, so only the
// window's empty margin is cut. Compact: the same with 16px gutters; rows
// stack name over status so every word stays whole.
const GEO: Record<Layout, Geo> = {
  wide: { win: { x: 40, y: 40, w: 620, h: 440 }, pr: 140, filler: 2 },
  compact: { win: { x: 16, y: 16, w: 400, h: 360 }, pr: 74, filler: 1 },
}

const FILLER = [
  { name: 112, status: 44 },
  { name: 96, status: 52 },
]

function Ic({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpt-ic${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

export default function CommonplaceTools() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpt">
      {(_s, _rect, layout) => {
        const g = GEO[layout]
        const compact = layout === 'compact'
        return (
          <Window
            url="commonplace.example"
            urlShape="pill"
            className="cpt-window"
            style={{ left: g.win.x, top: g.win.y, width: g.win.w, height: g.win.h }}
            body={{ className: 'cpt-body', 'data-crop': true, style: { paddingRight: g.pr } }}
          >
            <div className="cpt-panel" data-compact={compact || undefined}>
              <div className="cpt-head">
                <Ic name="swap_horiz" className="cpt-accent" />
                <span className="cpt-title">Convert files</span>
              </div>

              <div className="cpt-queue">
                <div className="cpt-queue__text">
                  <span className="cpt-queue__label">Queue · 240 files</span>
                  <Meter className="cpt-queue__meter" value={0.36} />
                </div>
                <span className="cpt-pause">
                  <Ic name="pause" />
                  Pause
                </span>
              </div>

              <div className="cpt-rows">
                <div className="cpt-row">
                  <Ic name="description" className="cpt-accent" />
                  <span className="cpt-cell">
                    <span className="cpt-file">minutes-march.docx → PDF</span>
                    <span className="cpt-status">Done, reopened and checked</span>
                  </span>
                </div>

                <div className="cpt-row cpt-row--live" data-target="live">
                  <Ic name="image" className="cpt-amber" />
                  <span className="cpt-cell">
                    <span className="cpt-file">site-photo.png → JPG</span>
                    <span className="cpt-progress">
                      <Meter className="cpt-row__meter" value={0.62} />
                      <span className="cpt-pct">62%</span>
                    </span>
                  </span>
                </div>

                {FILLER.slice(0, g.filler).map((f, i) => (
                  <div key={i} className="cpt-row">
                    <Ic name="schedule" className="cpt-faint" />
                    <span className="cpt-cell cpt-cell--filler">
                      <Bar w={f.name} h={7} tone={3} />
                      <Bar w={f.status} h={7} tone={2} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
