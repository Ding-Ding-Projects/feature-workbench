import type { ReactNode } from 'react'
import { Bar, Row, Stage, Text, Toast, Window, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './records.css'

// Commonplace, Records: local history. A still for a feature card. Gold:
// static-card (one hero window, one anchored surface, real words only where
// the story is), with the toast placed the way the gmail study places it:
// bottom-left, one gutter up, over filler.
//
// The story in one frame: Local history is open from the workspace toolbar,
// three snapshots listed, the deletion selected because it has just been
// restored; the task is back at the top of To do, and the toast says so with
// Undo beside it. The history panel's left edge lands on the In progress
// column's line, so it covers whole columns of filler, never a word.
//
// Compact drops the board's real card (the panel would cover it) and keeps the
// panel and the toast, the two things the feature is about.
//
// Real strings: Local history, the three snapshots and their times, the
// restored task, the toast and Undo.

const TASK = 'Pick a language'

type Geo = { win: { x: number; y: number; w: number; h: number } }

const GEO: Record<Layout, Geo> = {
  wide: { win: { x: 24, y: 24, w: 512, h: 480 } },
  compact: { win: { x: 16, y: 16, w: 326, h: 480 } },
}

const SNAPSHOTS: { icon: string; label: string; time: string; selected?: boolean }[] = [
  { icon: 'edit', label: 'Renamed task', time: '10:42' },
  { icon: 'delete', label: 'Deleted 1 task', time: '10:40', selected: true },
  { icon: 'check_circle', label: 'Moved to Done', time: 'Yesterday' },
]

function Sym({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpr-sym${className ? ` ${className}` : ''}`} aria-hidden="true">
      {children}
    </span>
  )
}

// One board card as filler: a title line, a note line and two status chips
function Card({ title, note }: { title: number | string; note: number }) {
  return (
    <div className="cpr-card">
      {typeof title === 'string' ? <Text className="cpr-card__title" wrap>{title}</Text> : <Bar w={title} h={7} tone={4} />}
      <Bar w={note} h={6} tone={2} />
      <span className="cpr-card__chips">
        <Bar w={44} h={18} r={6} tone={1} />
        <Bar w={36} h={18} r={6} tone={1} />
      </span>
    </div>
  )
}

function Column({ icon, kind, children, target }: { icon: string; kind: 'todo' | 'doing' | 'done'; children: ReactNode; target?: string }) {
  return (
    <div className="cpr-col" data-kind={kind} data-target={target}>
      <div className="cpr-col__head">
        <Sym>{icon}</Sym>
        <Bar w={kind === 'doing' ? 52 : 34} h={7} tone={kind === 'todo' ? 4 : 3} />
      </div>
      {children}
    </div>
  )
}

export default function CommonplaceRecords() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpr">
      {(_s, rect, layout) => {
        const g = GEO[layout]
        const tools = rect('tools')
        const history = rect('history')
        const line = rect('col2')
        const right = tools.x + tools.width
        const left = layout === 'wide' ? line.x : g.win.x + 12
        const panel = { left, top: history.y + history.height + 8, width: right - left }
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpr-window" style={{ left: g.win.x, top: g.win.y, width: g.win.w, height: g.win.h }} body={{ className: 'cpr-body' }}>
              <div className="cpr-toolbar">
                <span className="cpr-title">
                  <Bar w={layout === 'wide' ? 96 : 72} h={11} r={3} tone={5} />
                </span>
                <span className="cpr-tools" data-target="tools">
                  {layout === 'wide' && (
                    <span className="cpr-filter">
                      <Sym>search</Sym>
                      <Bar w={56} h={6} tone={2} />
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
                <Column icon="radio_button_unchecked" kind="todo">
                  {layout === 'wide' ? (
                    // Back at the top of To do, lifted for a moment as restored work is
                    <div className="cpr-card" data-restored>
                      <Text className="cpr-card__title">{TASK}</Text>
                      <Bar w={84} h={6} tone={2} />
                      <span className="cpr-card__chips">
                        <Bar w={44} h={18} r={6} tone={1} />
                        <Bar w={36} h={18} r={6} tone={1} />
                      </span>
                    </div>
                  ) : (
                    <Card title={92} note={70} />
                  )}
                  <Card title={layout === 'wide' ? 'Try the command palette' : 104} note={58} />
                  <Card title={80} note={66} />
                </Column>
                {layout === 'wide' && (
                  <>
                    <Column icon="contrast" kind="doing" target="col2">
                      <Card title={98} note={64} />
                      <Card title={86} note={72} />
                      <Card title={74} note={62} />
                    </Column>
                    <Column icon="check_circle" kind="done">
                      <Card title={78} note={60} />
                      <Card title={100} note={54} />
                      <Card title={88} note={68} />
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
                {SNAPSHOTS.map((s) => (
                  <Row
                    key={s.label}
                    pad={layout === 'wide' ? 8 : 5}
                    selected={s.selected}
                    className="cpr-row"
                    lead={<Sym>{s.selected ? 'restore' : s.icon}</Sym>}
                    title={<Text className="cpr-row__label">{s.label}</Text>}
                    meta={<Text className="cpr-row__time">{s.time}</Text>}
                  />
                ))}
              </div>
            </div>

            {/* Bottom corner, where Commonplace puts its notices */}
            <Toast
              show
              className="cpr-toast"
              icon={<Sym>check_circle</Sym>}
              action={
                <span className="cpr-toast__actions">
                  <span className="cpr-toast__undo">Undo</span>
                  <Sym className="cpr-toast__x">close</Sym>
                </span>
              }
            >
              Task restored.
            </Toast>
          </>
        )
      }}
    </Stage>
  )
}
