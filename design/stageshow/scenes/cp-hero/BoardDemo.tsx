import { Bar, Count, Stage, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './board.css'

// Commonplace's hero, v2 (Material 3 Expressive). The whole board is in
// frame: To do, In progress and Done. "Export a backup" is in progress. Its
// Done segment is pressed, the selection morphs onto it, and the card itself
// travels into the Done lane while the counts roll; "Saved in this
// browser." arrives (the payoff, and the poster). Then the toolbar's Undo
// is pressed, the seen cause of the reset: the card travels back to In
// progress and the counts roll back, which is the opening frame.
//
// Compact is the product's phone layout: lane tabs with counts over one
// lane's list. The card leaves the In progress list toward the Done tab,
// whose count rolls; Undo brings it back.

type Where = 'ip' | 'done'
type Lane = 'todo' | 'ip' | 'done'
type Offset = { x: number; y: number }

type S = {
  where: Where
  sel: Lane
  ipOpen: boolean
  doneOpen: boolean
  /** Where the card is drawn from, relative to its slot, while it travels */
  from: Offset | null
  travel: boolean
  /** Compact: the card slides out of the list toward the Done tab */
  out: boolean
  ip: number
  done: number
  toast: boolean
}

const TITLE = 'Export a backup'

const initial: S = { where: 'ip', sel: 'ip', ipOpen: true, doneOpen: false, from: null, travel: false, out: false, ip: 2, done: 2, toast: false }

// The payoff: the card in Done, saved in this browser
const POSTER: S = { ...initial, where: 'done', sel: 'done', ipOpen: false, doneOpen: true, ip: 1, done: 3, toast: true, out: true }

// Resting points on empty canvas in the header band, clear of every control
const REST = { wide: { x: 640, y: 108 }, compact: { x: 300, y: 64 } }

async function script(a: Act<S>) {
  const compact = a.layout === 'compact'
  await a.wait(1200)

  // 1. Done: the selection morphs onto the Done segment
  await a.move({ at: 'move-done', x: 0.7, y: 0.7 })
  await a.wait(150)
  a.mark('done')
  await a.click()
  await a.set({ sel: 'done' })
  await a.wait(420)

  // 2. The card travels into Done; In progress closes behind it, Done opens for it, both counts roll
  a.mark('travel')
  if (compact) {
    await a.set({ out: true, ipOpen: false, ip: 1, done: 3 })
    await a.wait(700)
  } else {
    const from = a.rect('card-ip')
    const to = a.rect('card-done')
    await a.snap({ where: 'done', travel: true, from: { x: from.x - to.x, y: from.y - to.y } }, 'card-done')
    await a.set({ from: null, ipOpen: false, doneOpen: true, ip: 1, done: 3 })
    await a.wait(700)
    await a.set({ travel: false })
  }

  // The payoff: saved in this browser
  a.mark('saved')
  await a.set({ toast: true })
  await a.move('rest')
  await a.wait(2200)

  // 3. Undo, the seen cause of the reset: the card travels back to In progress
  await a.move({ at: 'undo', x: 0.86, y: 0.8 })
  await a.wait(150)
  a.mark('undo')
  await a.click()
  await a.set({ toast: false })
  if (compact) {
    // The room opens first, then the card slides back into it
    await a.set({ ipOpen: true, ip: 2, done: 2 })
    await a.wait(260)
    await a.set({ out: false, sel: 'ip' })
    await a.wait(600)
  } else {
    const from = a.rect('card-done')
    const to = a.rect('card-ip')
    await a.snap({ where: 'ip', travel: true, from: { x: from.x - to.x, y: from.y - to.y } }, 'card-ip')
    await a.set({ from: null, ipOpen: true, doneOpen: false, sel: 'ip', ip: 2, done: 2 })
    await a.wait(700)
    await a.set({ travel: false })
  }
  await a.move('rest')
  await a.wait(500)
}

function Ms({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cp-ms" aria-hidden="true">
      {name}
    </span>
  )
}

const LANES: { id: Lane; label: string }[] = [
  { id: 'todo', label: 'To do' },
  { id: 'ip', label: 'In progress' },
  { id: 'done', label: 'Done' },
]

/** The v2 connected button group: the selected segment is a filled full pill, its neighbours keep small inner corners. */
function Group({ sel, targets = {} }: { sel: Lane; targets?: Partial<Record<Lane, string>> }) {
  return (
    <span className="cp-group" role="group">
      {LANES.map((l) => (
        <span key={l.id} className="cp-seg" data-sel={sel === l.id || undefined} data-target={targets[l.id]}>
          {l.label}
        </span>
      ))}
    </span>
  )
}

/** A task card with its real title, a quiet notes line and its connected group. */
function Task({ title, sel, notes, targets }: { title: string; sel: Lane; notes: number; targets?: Partial<Record<Lane, string>> }) {
  // Wide cards drop the notes line (notes 0) so the whole board, and the card that lands in Done, stay in frame
  return (
    <>
      <div className="cp-title">{title}</div>
      {notes > 0 && (
        <div className="cp-line cp-line--sub">
          <Bar w={notes} h={6} tone={2} />
        </div>
      )}
      <div className="cp-actions">
        <Group sel={sel} targets={targets} />
      </div>
    </>
  )
}

/** The story's card in one lane's slot: shown only where the card is. */
function StoryCard({ s, at }: { s: S; at: Where }) {
  const here = s.where === at
  return (
    <article
      className="cp-card cp-card--story"
      data-target={`card-${at}`}
      data-hidden={!here || undefined}
      data-travel={(here && s.travel) || undefined}
      style={here && s.from ? { transform: `translate3d(${s.from.x}px, ${s.from.y}px, 0)` } : undefined}
    >
      <Task title={TITLE} sel={s.sel} notes={0} targets={at === 'ip' ? { done: 'move-done' } : {}} />
    </article>
  )
}

/** A quiet card at the board's foot: bars only, it runs off the crop. */
function Filler({ w, n }: { w: number; n: number }) {
  return (
    <div className="cp-item">
      <div className="cp-card">
        <div className="cp-line">
          <Bar w={w} h={7} tone={3} />
        </div>
        <div className="cp-line cp-line--sub">
          <Bar w={n} h={6} tone={2} />
        </div>
      </div>
    </div>
  )
}

function Real({ title, sel, notes }: { title: string; sel: Lane; notes: number }) {
  return (
    <div className="cp-item">
      <div className="cp-card">
        <Task title={title} sel={sel} notes={notes} />
      </div>
    </div>
  )
}

function LaneBox({ kind, icon, label, count, children }: { kind: Lane; icon: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <section className="cp-lane" data-kind={kind}>
      <div className="cp-lane__head">
        <Ms name={icon} />
        <span>{label}</span>
        <span className="cp-lane__badge">
          <Count className="cp-lane__count" value={count} duration={600} />
        </span>
      </div>
      <div className="cp-lane__list">{children}</div>
    </section>
  )
}

function Wide({ s }: { s: S }) {
  return (
    <>
      <div className="cpb-head">
        <div className="cpb-toolbar">
          <div className="cpb-filter">
            <Ms name="filter_list" />
            <Bar w={64} h={6} tone={2} />
          </div>
          <span className="cp-icon-btn">
            <Ms name="history" />
          </span>
          <span className="cp-icon-btn" data-target="undo">
            <Ms name="undo" />
          </span>
        </div>
        <span className="cpb-new">
          <Ms name="add" />
          New task
        </span>
      </div>

      <div className="cpb-board">
        <LaneBox kind="todo" icon="radio_button_unchecked" label="To do" count={2}>
          <Real title="Try the command palette" sel="todo" notes={0} />
          <Filler w={110} n={140} />
        </LaneBox>

        <LaneBox kind="ip" icon="clock_loader_40" label="In progress" count={s.ip}>
          <div className="cp-slot" data-open={s.ipOpen || undefined}>
            <div className="cp-item">
              <StoryCard s={s} at="ip" />
            </div>
          </div>
          <Real title="Write the next useful step" sel="ip" notes={0} />
          <Filler w={96} n={120} />
        </LaneBox>

        <LaneBox kind="done" icon="check_circle" label="Done" count={s.done}>
          <div className="cp-slot" data-open={s.doneOpen || undefined}>
            <div className="cp-item">
              <StoryCard s={s} at="done" />
            </div>
          </div>
          <Real title="Pick a language" sel="done" notes={0} />
          <Filler w={120} n={100} />
        </LaneBox>
      </div>
    </>
  )
}

/** Compact: the phone layout, lane tabs with counts over the In progress list. */
function Compact({ s }: { s: S }) {
  return (
    <>
      <div className="cpb-head">
        <span className="cpb-new">
          <Ms name="add" />
          New task
        </span>
        <span className="cp-icon-btn cp-icon-btn--tonal" data-target="undo">
          <Ms name="undo" />
        </span>
      </div>
      <div className="cpb-tabs" role="tablist">
        <span className="cpb-tab">
          To do <span className="cpb-tab__badge">2</span>
        </span>
        <span className="cpb-tab" data-on>
          In progress
          <span className="cpb-tab__badge">
            <Count value={s.ip} duration={600} />
          </span>
        </span>
        <span className="cpb-tab" data-target="tab-done">
          Done
          <span className="cpb-tab__badge">
            <Count value={s.done} duration={600} />
          </span>
        </span>
      </div>
      <div className="cpb-list">
        <div className="cp-slot" data-open={s.ipOpen || undefined}>
          <div className="cp-item">
            <article className="cp-card cp-card--story" data-target="card-ip" data-out={s.out || undefined}>
              <Task title={TITLE} sel={s.sel} notes={140} targets={{ done: 'move-done' }} />
            </article>
          </div>
        </div>
        <Real title="Write the next useful step" sel="ip" notes={150} />
        <Filler w={120} n={160} />
      </div>
    </>
  )
}

export function BoardDemo() {
  return (
    <Stage
      width={720}
      height={380}
      compact={{ below: 560, width: 358, height: 340 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      className="look-commonplace cpb"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="commonplace.example" urlShape="pill" className="cpb-browser">
            <div className="cpb-body">{layout === 'compact' ? <Compact s={s} /> : <Wide s={s} />}</div>
          </Window>

          <div className="cpb-saved" role="status" data-show={s.toast || undefined}>
            <Ms name="check_circle" />
            <span className="cpb-saved__text">
              <span>Saved in this browser.</span>
              <span lang="yue-Hant" className="cpb-saved__yue">
                已儲存喺呢個瀏覽器。
              </span>
            </span>
          </div>

          <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  )
}
