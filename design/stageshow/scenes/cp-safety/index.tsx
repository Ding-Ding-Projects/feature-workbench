import type { ReactNode } from 'react'
import { Bar, Stage, Text, Window, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './safety.css'

// Commonplace, Safety: the two-key destructive confirmation. A still for a
// feature card. Layout: satellite focus (copied from the share gold). The
// workspace window is cropped hard and is mostly context; the confirmation is
// anchored under the Delete control it guards, right-aligned to it, and its
// left edge lands on the In progress column's line so it covers whole columns
// of filler cards, never a word.
//
// The story in one frame: key 1 is turned, key 2 waits, so the slider is still
// asleep and Emergency exit is always there. The task is named inside the
// dialog, once.
//
// Real strings: Delete, the question, the task, the two keys, the slider and
// Emergency exit. Everything behind is placeholder.

const TASK = 'Pick a language'

type Geo = { win: { x: number; y: number; w: number; h: number } }

// Wide: one 24px gutter above and either side; the window runs off the bottom.
// Compact: a 16px gutter, one column of the board shows beside nothing; the
// dialog spans the window's content width.
const GEO: Record<Layout, Geo> = {
  wide: { win: { x: 24, y: 24, w: 512, h: 480 } },
  compact: { win: { x: 16, y: 16, w: 326, h: 480 } },
}

function Sym({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cps-sym${className ? ` ${className}` : ''}`} aria-hidden="true">
      {children}
    </span>
  )
}

// One board card: a title line, a note line and two status chips, as bars
function Card({ title, note, selected }: { title: number | string; note: number; selected?: boolean }) {
  return (
    <div className="cps-card" data-selected={selected || undefined}>
      {typeof title === 'string' ? <Text className="cps-card__title" wrap>{title}</Text> : <Bar w={title} h={7} tone={4} />}
      <Bar w={note} h={6} tone={2} />
      <span className="cps-card__chips">
        <Bar w={44} h={18} r={6} tone={1} />
        <Bar w={36} h={18} r={6} tone={1} />
      </span>
    </div>
  )
}

function Column({ icon, kind, children, target }: { icon: string; kind: 'todo' | 'doing' | 'done'; children: ReactNode; target?: string }) {
  return (
    <div className="cps-col" data-kind={kind} data-target={target}>
      <div className="cps-col__head">
        <Sym>{icon}</Sym>
        <Bar w={kind === 'doing' ? 52 : 34} h={7} tone={kind === 'todo' ? 4 : 3} />
      </div>
      {children}
    </div>
  )
}

export default function CommonplaceSafety() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cps">
      {(_s, rect, layout) => {
        const g = GEO[layout]
        const del = rect('delete')
        const line = rect(layout === 'wide' ? 'col2' : 'board')
        const left = layout === 'wide' ? line.x : g.win.x + 12
        const right = del.x + del.width
        const dialog = { left, top: del.y + del.height + 8, width: right - left }
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cps-window" style={{ left: g.win.x, top: g.win.y, width: g.win.w, height: g.win.h }} body={{ className: 'cps-body' }}>
              <div className="cps-toolbar">
                <span className="cps-title">
                  <Bar w={layout === 'wide' ? 96 : 72} h={11} r={3} tone={5} />
                </span>
                <span className="cps-tools">
                  {layout === 'wide' && (
                    <span className="cps-filter">
                      <Sym>search</Sym>
                      <Bar w={64} h={6} tone={2} />
                    </span>
                  )}
                  <span className="cps-delete" data-target="delete" data-on>
                    <Sym>delete</Sym>
                    <span>Delete</span>
                  </span>
                </span>
              </div>
              <div className="cps-board" data-target="board">
                <Column icon="radio_button_unchecked" kind="todo">
                  <Card title={TASK} note={70} selected />
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

            {/* Anchored under Delete, the control it guards */}
            <div className="cps-dialog" style={dialog}>
              <Text className="cps-dialog__title">{`Delete “${TASK}”?`}</Text>
              <div className="cps-keys">
                <span className="cps-key" data-turned>
                  <Sym>key</Sym>
                  <span>Key 1 turned</span>
                </span>
                <span className="cps-key">
                  <Sym>key</Sym>
                  <span>Turn key 2</span>
                </span>
              </div>
              <div className="cps-slide">
                <span className="cps-slide__knob">
                  <Sym>delete</Sym>
                </span>
                <span className="cps-slide__label">Slide to delete</span>
              </div>
              <div className="cps-foot">
                <span className="cps-exit">
                  <Sym>logout</Sym>
                  <span>Emergency exit</span>
                </span>
                {layout === 'wide' && <Bar w={118} h={6} tone={2} />}
              </div>
            </div>
          </>
        )
      }}
    </Stage>
  )
}
