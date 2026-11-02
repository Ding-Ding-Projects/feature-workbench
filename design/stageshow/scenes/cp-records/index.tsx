import type { ReactNode } from 'react'
import { Bar, Collapse, Count, Row, Stage, States, Text, Toast, Window, type Act, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './records.css'

// Commonplace, Records: local history, v2 (Material 3 Expressive). A feature
// card loop. Gold: static-card (one hero window, one anchored surface, real
// words only where the story is), with the toast placed the way the gmail
// study places it: bottom-left, one gutter up, over filler.
//
// It opens on the payoff: Local history open from the floating toolbar, the
// deletion selected and marked Restored, the task back at the top of To do
// and "Task restored." with Undo. The loop:
//   1. Undo in the toast: the toast drops away, the task leaves To do (the
//      cards below close the gap), the count rolls 3 -> 2, the row lets go.
//   2. The deleted snapshot is picked again: it fills, its time gives way to
//      Restore.
//   3. Restore: the task drops back into To do, the count rolls 2 -> 3, the
//      toast rises on the fast spring. The frame is the opening one again.
//
// Compact drops the board's real card (the panel would cover it) and keeps
// the panel (its two newest snapshots, so the toast clears it) and the toast.

const TASK = 'Pick a language'

const LABEL = { todo: 'To do', doing: 'In progress', done: 'Done' } as const

type S = { selected: boolean; restored: boolean; toast: boolean; count: number }

const initial: S = { selected: true, restored: true, toast: true, count: 3 }

type Geo = { win: { x: number; y: number; w: number; h: number }; pr: number }

const GEO: Record<Layout, Geo> = {
  // The window runs off the right and the bottom; its content column ends a
  // gutter inside the stage, so only the window's empty margin is cut
  wide: { win: { x: 28, y: 28, w: 600, h: 480 }, pr: 80 },
  compact: { win: { x: 16, y: 16, w: 380, h: 480 }, pr: 42 },
}

// Where the cursor waits: on the board's filler, clear of the panel and toast
const REST = { wide: { x: 470, y: 352 }, compact: { x: 312, y: 206 } }

const SNAPSHOTS: { icon: string; label: string; time: string; story?: boolean }[] = [
  { icon: 'edit', label: 'Renamed task', time: '10:42' },
  { icon: 'delete', label: 'Deleted 1 task', time: '10:40', story: true },
  { icon: 'check_circle', label: 'Moved to Done', time: 'Yesterday' },
]

async function script(a: Act<S>) {
  // The payoff holds as the loop's first and last frame
  await a.wait(900)

  // 1. Undo the restore: the toast's own action is the cause
  await a.move({ at: 'undo', x: 0.78, y: 0.72 })
  await a.wait(140)
  a.mark('undo')
  await a.click()
  await a.set({ toast: false })
  await a.wait(120)
  await a.set({ restored: false, selected: false, count: 2 })
  await a.wait(880)

  // 2. Pick the deleted snapshot again: Restore takes the time's place
  await a.move({ at: 'snap', x: 0.6, y: 0.62 })
  await a.wait(160)
  a.mark('pick')
  await a.click()
  await a.set({ selected: true })
  await a.wait(650)

  // 3. Restore: the button becomes Restored, the task drops back, the count
  //    rolls, the toast arrives
  await a.move({ at: 'restore', x: 0.8, y: 0.72 })
  await a.wait(140)
  a.mark('restore')
  await a.click()
  await a.set({ restored: true, count: 3 })
  await a.wait(380)
  await a.set({ toast: true })
  a.mark('restored')
  await a.move('rest')
  await a.wait(1400)
}

function Sym({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpr-sym${className ? ` ${className}` : ''}`} aria-hidden="true">
      {children}
    </span>
  )
}

// The v2 card's connected button group (To do | In progress | Done), drawn
// quiet: the lane's own segment is the filled one, with its check
function Group({ at }: { at: 0 | 1 | 2 }) {
  const widths = [34, 44, 33]
  return (
    <span className="cpr-group" aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} className="cpr-seg" data-on={i === at || undefined} style={{ width: w }}>
          {i === at && <Sym>check</Sym>}
        </span>
      ))}
    </span>
  )
}

// One board card as filler: a title line, a note line and the button group
function Card({ title, note, at }: { title: number; note: number; at: 0 | 1 | 2 }) {
  return (
    <div className="cpr-card">
      <Bar w={title} h={7} tone={4} />
      <Bar w={note} h={6} tone={2} />
      <Group at={at} />
    </div>
  )
}

function Column({ icon, kind, count, children, target }: { icon: string; kind: 'todo' | 'doing' | 'done'; count: ReactNode; children: ReactNode; target?: string }) {
  return (
    <div className="cpr-col" data-kind={kind} data-target={target}>
      <div className="cpr-col__head">
        <Sym>{icon}</Sym>
        <span className="cpr-col__label">{LABEL[kind]}</span>
        <span className="cpr-col__count">{count}</span>
      </div>
      {children}
    </div>
  )
}

export default function CommonplaceRecords() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={initial}
      script={script}
      cursor={{ at: REST }}
      className="look-commonplace cpr"
    >
      {(s, rect, layout) => {
        const g = GEO[layout]
        const wide = layout === 'wide'
        const tools = rect('tools')
        const history = rect('history')
        const line = rect('col2')
        const right = tools.x + tools.width
        const left = wide ? line.x : g.win.x + 12
        const panel = { left, top: history.y + history.height + 10, width: right - left }
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpr-window" style={{ left: g.win.x, top: g.win.y, width: g.win.w, height: g.win.h }} body={{ className: 'cpr-body', style: { paddingRight: g.pr } }}>
              <div className="cpr-toolbar">
                <span className="cpr-title">
                  <span className="cp-display cpr-heading">Workspace</span>
                  <span className="cpr-badge">
                    <Count value={wide ? s.count + 4 : 7} duration={500} />
                  </span>
                </span>
                {/* The v2 floating toolbar: a pill holding the filter and the icon buttons */}
                <span className="cpr-tools" data-target="tools">
                  {wide && (
                    <span className="cpr-filter">
                      <Sym>filter_list</Sym>
                      <Bar w={52} h={6} tone={2} />
                    </span>
                  )}
                  <span className="cpr-icon" data-target="history" data-on>
                    <Sym>history</Sym>
                  </span>
                  <span className="cpr-icon">
                    <Sym>undo</Sym>
                  </span>
                </span>
              </div>
              <div className="cpr-board">
                <Column icon="radio_button_unchecked" kind="todo" count={<Count value={wide ? s.count : 3} duration={500} />}>
                  {wide ? (
                    // The restored task: it leaves on Undo and drops back on Restore
                    <Collapse open={s.restored} reveal="drop" className="cpr-slot" data-target="restored">
                      <div className="cpr-card" data-restored>
                        <Text className="cpr-card__title">{TASK}</Text>
                        <Bar w={84} h={6} tone={2} />
                        <Group at={0} />
                      </div>
                    </Collapse>
                  ) : (
                    <Card title={92} note={70} at={0} />
                  )}
                  <Card title={104} note={58} at={0} />
                  <Card title={80} note={66} at={0} />
                </Column>
                {wide && (
                  <>
                    <Column icon="contrast" kind="doing" count={2} target="col2">
                      <Card title={98} note={64} at={1} />
                      <Card title={86} note={72} at={1} />
                      <Card title={74} note={62} at={1} />
                    </Column>
                    <Column icon="check_circle" kind="done" count={2}>
                      <Card title={78} note={60} at={2} />
                      <Card title={100} note={54} at={2} />
                      <Card title={88} note={68} at={2} />
                    </Column>
                  </>
                )}
              </div>
            </Window>

            {/* Anchored under the toolbar's history button */}
            <div className="cpr-panel" style={panel}>
              <div className="cpr-panel__head">
                <Text className="cpr-panel__title">Local history</Text>
              </div>
              <div className="cpr-list">
                {(wide ? SNAPSHOTS : SNAPSHOTS.slice(0, 2)).map((r) => {
                  const on = !!r.story && s.selected
                  return (
                    <Row
                      key={r.label}
                      pad={8}
                      selected={on}
                      className="cpr-row"
                      data-target={r.story ? 'snap' : undefined}
                      lead={
                        r.story ? (
                          <States className="cpr-lead" value={on ? 'on' : 'off'} states={{ off: <Sym>{r.icon}</Sym>, on: <Sym>restore</Sym> }} />
                        ) : (
                          <Sym>{r.icon}</Sym>
                        )
                      }
                      title={<Text className="cpr-row__label">{r.label}</Text>}
                      meta={
                        r.story ? (
                          <States
                            className="cpr-trail"
                            align="end"
                            value={on ? (s.restored ? 'restored' : 'restore') : 'time'}
                            states={{
                              time: <Text className="cpr-row__time">{r.time}</Text>,
                              restored: (
                                <span className="cpr-restored">
                                  <Sym>check</Sym>
                                  Restored
                                </span>
                              ),
                              restore: (
                                <span className="cpr-restore" data-target="restore">
                                  Restore
                                </span>
                              ),
                            }}
                          />
                        ) : (
                          <Text className="cpr-row__time">{r.time}</Text>
                        )
                      }
                    />
                  )
                })}
              </div>
            </div>

            {/* Bottom corner, where Commonplace puts its notices */}
            <Toast
              show={s.toast}
              className="cpr-toast"
              icon={<Sym>check_circle</Sym>}
              action={
                <span className="cpr-toast__actions">
                  <span className="cpr-toast__undo" data-target="undo">
                    Undo
                  </span>
                  <Sym className="cpr-toast__x">close</Sym>
                </span>
              }
            >
              Task restored.
            </Toast>

            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
