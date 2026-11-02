import { Bar, Collapse, Count, Meter, Roll, Stage, States, Window, type Act, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './tools.css'

// Commonplace, Built-in tools, v2 (Material 3 Expressive): the offline file
// converter working through its queue. A feature card that plays once in view, no cursor (the
// system does the work). The browser window is inset top and left and runs
// off the right and the bottom; inside it the Convert files card sits on the
// app's page, as the deep-dive draws it.
//
// The queue is a conveyor. Each cycle (about 3.6s):
//   1. The converting file's wavy progress runs on to 100% (the percent rolls).
//   2. It settles: the In progress tint lets go and "Done, reopened and
//      checked" takes the progress's place.
//   3. The finished row above folds away, the list moves up on the default
//      spring, and the next waiting file starts converting: its name arrives,
//      its tint and progress come in and climb to 62%.
// Each finished file rolls the batch's done count and nudges the queue bar
// (one file of 240). Three files cycle, so the rows end as they began; the
// batch count only grows, so it plays once and ends on the poster.
//
// Rows are keyed by their position, not by file: after each cycle a snap
// shifts the files up one position while the folded row is out of sight, so
// nothing remounts and the wave keeps its phase across the seam.

const FILES = [
  { name: 'minutes-march.docx → PDF', icon: 'description' },
  { name: 'site-photo.png → JPG', icon: 'image' },
  { name: 'field-notes.pdf → TXT', icon: 'picture_as_pdf' },
]

const FILLER = [
  { name: 112, status: 44 },
  { name: 96, status: 52 },
  { name: 120, status: 40 },
]

type S = { k: number; p: number; done: boolean; next: boolean; leaving: boolean; n: number }

const initial: S = { k: 0, p: 62, done: false, next: false, leaving: false, n: 86 }
// It plays once: the batch count only goes up, so the end (three files later)
// is the poster
const POSTER: S = { ...initial, n: 89 }
const TOTAL = 240

type Geo = { win: { x: number; y: number; w: number; h: number }; pr: number; rows: number }

// Wide: 40px gutters left and top; the window runs off the right and the
// bottom, and its card ends a full gutter inside the stage. Compact: the same
// with 16px gutters; rows stack name over status.
const GEO: Record<Layout, Geo> = {
  wide: { win: { x: 40, y: 40, w: 620, h: 440 }, pr: 132, rows: 5 },
  compact: { win: { x: 16, y: 16, w: 400, h: 360 }, pr: 74, rows: 4 },
}

async function steps(a: Act<S>, values: number[], gap = 300) {
  for (const p of values) {
    await a.set({ p })
    await a.wait(gap)
  }
}

async function cycle(a: Act<S>, k: number) {
  await a.wait(400)
  // 1. The converting file runs on to the end
  await steps(a, [71, 83, 94, 100])
  // 2. It settles as done
  a.mark(`done-${k}`)
  await a.set({ done: true, n: initial.n + k + 1 })
  await a.wait(650)
  // 3. The finished row above folds away; the next file starts
  a.mark(`next-${k}`)
  await a.set({ leaving: true, next: true, p: 0 })
  await a.wait(350)
  await steps(a, [18, 37, 52, 62])
  // Shift the files up one position: the frame is unchanged
  await a.snap({ k: (k + 1) % 3, done: false, next: false, leaving: false })
}

async function script(a: Act<S>) {
  for (let k = 0; k < 3; k++) await cycle(a, k)
  // k is back at 0; the batch is three files further on
}

function Ic({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpt-ic${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

// M3 Expressive wavy linear progress: the done part a travelling sine wave,
// a gap, then the flat track and its stop dot.
function Wavy({ value }: { value: number }) {
  // One sine period every 12px, drawn past the end so the phase can travel
  const d = 'M0 5' + ' q 3 -3.2 6 0 t 6 0'.repeat(13)
  return (
    <span className="cpt-wavy" style={{ ['--p' as string]: value }} aria-hidden="true">
      <span className="cpt-wavy__on" data-crop>
        <svg className="cpt-wavy__wave" width="156" height="10" viewBox="0 0 156 10">
          <path d={d} />
        </svg>
      </span>
      <span className="cpt-wavy__off" />
      <span className="cpt-wavy__stop" />
    </span>
  )
}

type Status = 'wait' | 'live' | 'done'

export default function CommonplaceTools() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} initial={initial} poster={POSTER} script={script} play="once" className="look-commonplace cpt">
      {(s, _rect, layout) => {
        const g = GEO[layout]
        const compact = layout === 'compact'
        const status = (j: number): Status => (j === 0 ? 'done' : j === 1 ? (s.done ? 'done' : 'live') : j === 2 && s.next ? 'live' : 'wait')
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
                  <span className="cpt-queue__line">
                    <span className="cpt-queue__label">Queue · 240 files</span>
                    <span className="cpt-queue__done">
                      <Count value={s.n} duration={400} /> done
                    </span>
                  </span>
                  <span className="cpt-queue__bar" style={{ ['--q' as string]: s.n / TOTAL }}>
                    <Meter className="cpt-queue__meter" value={s.n / TOTAL} />
                    <span className="cpt-queue__track" />
                  </span>
                </div>
                <span className="cpt-pause">
                  <Ic name="pause" />
                  Pause
                </span>
              </div>

              <div className="cpt-rows">
                {Array.from({ length: g.rows }, (_, j) => {
                  const i = s.k + j
                  const file = FILES[i % 3]
                  const filler = FILLER[i % 3]
                  const st = status(j)
                  const row = (
                    <div className="cpt-row" data-status={st} data-target={st === 'live' ? 'live' : undefined}>
                      <States
                        className="cpt-lead"
                        value={st}
                        states={{
                          wait: <Ic name="schedule" className="cpt-faint" />,
                          live: <Ic name={file.icon} className="cpt-amber" />,
                          done: <Ic name={file.icon} className="cpt-accent" />,
                        }}
                      />
                      <span className="cpt-cell">
                        <States
                          className="cpt-name"
                          align="start"
                          value={st === 'wait' ? 'wait' : 'file'}
                          states={{ wait: <Bar w={filler.name} h={7} tone={3} />, file: <span className="cpt-file">{file.name}</span> }}
                        />
                        <States
                          className="cpt-result"
                          align={compact ? 'start' : 'end'}
                          value={st}
                          states={{
                            wait: <Bar w={filler.status} h={7} tone={2} />,
                            live: (
                              <span className="cpt-progress">
                                <Wavy value={st === 'wait' ? 0 : st === 'live' ? s.p / 100 : 1} />
                                <span className="cpt-pct">
                                  {/* Roll clips the changing figure to its own line, so a roll never prints over its neighbour */}
                                  <Roll align="end">{`${st === 'wait' ? 0 : st === 'live' ? s.p : 100}%`}</Roll>
                                </span>
                              </span>
                            ),
                            done: <span className="cpt-status">Done, reopened and checked</span>,
                          }}
                        />
                      </span>
                    </div>
                  )
                  return j === 0 ? (
                    <Collapse key={j} open={!s.leaving} className="cpt-fold">
                      {row}
                    </Collapse>
                  ) : (
                    <div key={j} className="cpt-slot">
                      {row}
                    </div>
                  )
                })}
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
