import type { ReactNode } from 'react'
import { Bar, Stage, States, Text, Window, type Act, type Layout } from '../../kit'
import '../../commonplace/look.css'
import './safety.css'

// Commonplace, Safety: the two-key destructive confirmation, as a short loop
// for a feature card (v2, Material 3 Expressive). Layout: satellite focus
// (copied from the share gold). The workspace window is cropped hard and is
// mostly context; the confirmation is anchored under the Delete control it
// guards, right-aligned to it, and its left edge lands on the In progress
// column's line so it covers whole columns of filler cards, never a word.
//
// The story: Delete is pressed (its corners morph) and the confirmation grows
// out of it on the default spring. Key 1 turns, key 2 turns, and only then
// does the slider wake. The hand does not slide: it takes Emergency exit, the
// dialog closes back into Delete and nothing was deleted, which is where the
// loop began. The keys reset while the dialog is closed.
//
// Real strings: Delete, the question, the task, the two keys, the slider and
// Emergency exit. Everything behind is placeholder.

const TASK = 'Pick a language'

type S = { open: boolean; key1: boolean; key2: boolean }

const initial: S = { open: false, key1: false, key2: false }
// The payoff: both keys turned, the slider awake, the exit still there
const POSTER: S = { open: true, key1: true, key2: true }

const REST = { wide: { x: 246, y: 96 }, compact: { x: 150, y: 120 } }

async function script(a: Act<S>) {
  await a.wait(900)

  // 1. Delete: the confirmation grows out of the control it guards
  await a.move({ at: 'delete', x: 0.92, y: 0.8 })
  await a.wait(120)
  a.mark('delete')
  await a.click()
  await a.set({ open: true })
  await a.wait(700)

  // 2. Key 1, then key 2: each turns where it is pressed
  await a.move({ at: 'key1', x: 0.94, y: 0.78 })
  await a.wait(120)
  a.mark('key1')
  await a.click()
  await a.set({ key1: true })
  await a.wait(500)
  await a.move({ at: 'key2', x: 0.94, y: 0.78 })
  await a.wait(120)
  a.mark('key2')
  await a.click()
  await a.set({ key2: true })

  // 3. Only now is the slider awake; hold the armed dialog
  a.mark('armed')
  await a.move({ at: 'dialog', x: 0.8, y: 0.88 })
  await a.wait(1500)

  // 4. Emergency exit: the dialog closes into Delete, nothing was deleted
  await a.move({ at: 'exit', x: 0.93, y: 0.78 })
  await a.wait(140)
  a.mark('exit')
  await a.click()
  await a.set({ open: false })
  await a.move(REST)
  await a.snap({ key1: false, key2: false }, 'dialog')
  await a.wait(500)
}

type Geo = { win: { x: number; y: number; w: number; h: number } }

// Wide: a 24px gutter above and on the left; the window runs off the right
// and the bottom, the Done lane cut by the stage. Compact: a 16px gutter, one
// column of the board shows; the dialog spans that column's width.
const GEO: Record<Layout, Geo> = {
  wide: { win: { x: 24, y: 24, w: 640, h: 480 } },
  compact: { win: { x: 16, y: 16, w: 400, h: 480 } },
}

function Sym({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cps-sym${className ? ` ${className}` : ''}`} aria-hidden="true">
      {children}
    </span>
  )
}

// One board card: a title line, a note line and its status group, as bars
function Card({ title, note, selected }: { title: number | string; note: number; selected?: boolean }) {
  return (
    <div className="cps-card" data-selected={selected || undefined}>
      {typeof title === 'string' ? <Text className="cps-card__title" wrap>{title}</Text> : <Bar w={title} h={7} tone={4} />}
      <Bar w={note} h={6} tone={2} />
      <span className="cps-card__chips">
        <Bar w={44} h={18} r={9} tone={1} />
        <Bar w={36} h={18} r={9} tone={1} />
      </span>
    </div>
  )
}

const LANE_NAME = { todo: 'To do', doing: 'In progress', done: 'Done' } as const

function Column({ icon, kind, children, target }: { icon: string; kind: 'todo' | 'doing' | 'done'; children: ReactNode; target?: string }) {
  return (
    <div className="cps-col" data-kind={kind} data-target={target}>
      <div className="cps-col__head">
        <Sym>{icon}</Sym>
        <span className="cps-col__name">{LANE_NAME[kind]}</span>
      </div>
      {children}
    </div>
  )
}

function Key({ n, turned }: { n: 1 | 2; turned: boolean }) {
  return (
    <span className="cps-key" data-target={`key${n}`} data-turned={turned || undefined}>
      <States
        align="center"
        value={turned ? 'turned' : 'turn'}
        states={{
          turn: (
            <span className="cps-key__in">
              <Sym className="cps-key__icon">key</Sym>
              <span>{`Turn key ${n}`}</span>
            </span>
          ),
          turned: (
            <span className="cps-key__in">
              <Sym className="cps-key__icon">key</Sym>
              <span>{`Key ${n} turned`}</span>
            </span>
          ),
        }}
      />
    </span>
  )
}

export default function CommonplaceSafety() {
  return (
    <Stage<S>
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="loop"
      cursor={{ at: REST, style: 'arrow' }}
      className="look-commonplace cps"
    >
      {(s, rect, layout) => {
        const g = GEO[layout]
        const del = rect('delete')
        const line = rect(layout === 'wide' ? 'col2' : 'board')
        const left = layout === 'wide' ? line.x : g.win.x + 12
        const right = del.x + del.width
        const dialog = { left, top: del.y + del.height + 8, width: right - left }
        const armed = s.key1 && s.key2
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cps-window" style={{ left: g.win.x, top: g.win.y, width: g.win.w, height: g.win.h }} body={{ className: 'cps-body' }}>
              <div className="cps-toolbar" style={{ width: layout === 'wide' ? 512 : 326 }}>
                <span className="cps-title">
                  <Bar w={layout === 'wide' ? 96 : 72} h={11} r={5.5} tone={5} />
                </span>
                <span className="cps-tools">
                  {layout === 'wide' && (
                    <span className="cps-filter">
                      <Sym>filter_list</Sym>
                      <Bar w={64} h={6} tone={2} />
                    </span>
                  )}
                  <span className="cps-delete" data-target="delete" data-on={s.open || undefined}>
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
                    <Column icon="clock_loader_40" kind="doing" target="col2">
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

            {/* Anchored under Delete, the control it guards; it grows from there */}
            <div className="cps-dialog" data-target="dialog" data-show={s.open || undefined} style={dialog}>
              <Text className="cps-dialog__title">{`Delete “${TASK}”?`}</Text>
              <div className="cps-keys">
                <Key n={1} turned={s.key1} />
                <Key n={2} turned={s.key2} />
              </div>
              <div className="cps-slide" data-armed={armed || undefined}>
                <span className="cps-slide__knob">
                  <Sym>delete</Sym>
                </span>
                <span className="cps-slide__label">Slide to delete</span>
              </div>
              <div className="cps-foot">
                <span className="cps-exit" data-target="exit">
                  <Sym>logout</Sym>
                  <span>Emergency exit</span>
                </span>
              </div>
            </div>
          </>
        )
      }}
    </Stage>
  )
}
