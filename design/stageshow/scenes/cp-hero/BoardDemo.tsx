import { Bar, Collapse, Count, Roll, Stage, States, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './board.css'

// Commonplace's hero. It opens on the payoff: "Export a backup" in progress,
// saved in this browser. The card's Done press sends it on (the reset, with
// its cause), then the same task is written again into To do, saved, and
// moved to In progress, which is where the loop began.

type Look = 'todo' | 'ip'
type Offset = { x: number; y: number }

type S = {
  draft: boolean
  /** The To do card is laid out only while its slot is open or closing */
  todoShown: boolean
  editing: boolean
  typed: string
  ipShown: boolean
  ipOpen: boolean
  ipLook: Look
  leaving: boolean
  /** Where the In progress card is drawn from, relative to its slot, while it travels in */
  from: Offset | null
  travel: boolean
  /** Its first frames over the To do card it replaces: it fades in as that one dims */
  arriving: boolean
  todo: number
  ip: number
  toast: boolean
}

const TITLE = 'Export a backup'

// The opening frame is the payoff, so the poster and the first frame agree
const initial: S = {
  draft: false,
  todoShown: false,
  editing: false,
  typed: '',
  ipShown: true,
  ipOpen: true,
  ipLook: 'ip',
  leaving: false,
  from: null,
  travel: false,
  arriving: false,
  todo: 2,
  ip: 2,
  toast: true,
}

const POSTER: S = initial

const REST = { wide: { x: 432, y: 106 }, compact: { x: 230, y: 84 } }

async function script(a: Act<S>) {
  // The payoff, as the loop's first and last frame
  await a.wait(1300)

  // 1. Done: the status has closed itself; the card leaves toward the Done lane
  await a.set({ toast: false })
  await a.move({ at: 'move-done', x: 0.86, y: 0.72 })
  await a.wait(150)
  a.mark('done')
  await a.click()
  await a.set({ leaving: true, ip: 1 })
  await a.wait(140)
  await a.set({ ipOpen: false })
  await a.wait(520)
  await a.snap({ ipShown: false })

  // 2. New task: an empty card drops into To do with its title field focused
  await a.move({ at: 'new', x: 0.86, y: 0.7 })
  await a.wait(150)
  a.mark('new')
  await a.click()
  await a.snap({ todoShown: true }, 'todo-slot')
  await a.set({ draft: true, editing: true })

  // 3. Type the title and save it
  await a.move({ at: 'card-todo', x: 0.62, y: 0.78 })
  await a.wait(250)
  await a.type('typed', TITLE, { interval: 55 })
  await a.wait(350)
  await a.move({ at: 'save', x: 0.86, y: 0.72 })
  await a.wait(120)
  a.mark('save')
  await a.click()
  await a.set({ editing: false, todo: 3 })
  await a.wait(900)

  // 4. In progress: the card itself travels, To do closes behind it, the lane opens, both counts roll
  await a.move({ at: 'move-ip', x: 0.9, y: 0.72 })
  await a.wait(150)
  a.mark('move')
  await a.click()
  const from = a.rect('card-todo')
  const to = a.rect('card-ip')
  await a.snap({ ipShown: true, leaving: false, ipLook: 'todo', travel: true, arriving: true, from: { x: from.x - to.x, y: from.y - to.y } }, 'card-ip')
  await a.set({ from: null, arriving: false, draft: false, ipOpen: true, todo: 2, ip: 2 })
  await a.wait(380)
  await a.set({ ipLook: 'ip' })
  await a.wait(480)
  await a.set({ travel: false })
  await a.snap({ typed: '', todoShown: false }, 'todo-slot')

  // The payoff: saved in this browser
  a.mark('saved')
  await a.set({ toast: true })
  await a.move('rest')
  await a.wait(1600)
}

function Ms({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cp-ms" aria-hidden="true">
      {name}
    </span>
  )
}

/** The story's card: a title field while editing, then its move buttons. */
function TaskCard({ s, look, live, compact, target }: { s: S; look: Look; live: boolean; compact: boolean; target: string }) {
  const editing = live && s.editing
  const text = live ? s.typed : TITLE
  // Wide cards carry both moves; the compact card keeps one, as the phone layout does
  const first = look === 'todo' ? 'In progress' : compact ? 'Done' : 'To do'
  const moves = (
    <span className="cp-row">
      <span className="cp-btn" {...(look === 'todo' ? { 'data-target': live ? 'move-ip' : undefined } : compact ? { 'data-target': 'move-done' } : {})}>
        <Roll variant="fade">{first}</Roll>
      </span>
      {!compact && (
        <span className="cp-btn" {...(look === 'ip' ? { 'data-target': 'move-done' } : {})}>
          Done
        </span>
      )}
    </span>
  )
  return (
    <article
      className="cp-card cp-card--new"
      data-look={look}
      data-target={target}
      data-leaving={(!live && s.leaving) || undefined}
      data-hidden={(!live && !s.ipShown) || undefined}
      data-travel={(!live && s.travel) || undefined}
      data-arriving={(!live && s.arriving) || undefined}
      style={!live && s.from ? { transform: `translate3d(${s.from.x}px, ${s.from.y}px, 0)` } : undefined}
    >
      <div className="cp-title" data-editing={editing || undefined} data-cursor={editing ? 'ibeam' : undefined}>
        <span className="cp-title__text" data-typing={editing || undefined}>
          {text || '\u200b'}
        </span>
        <span className="cp-caret" data-show={editing || undefined} data-typing={editing && s.typed.length > 0 && s.typed.length < TITLE.length ? true : undefined} />
      </div>
      {live ? (
        <States
          className="cp-actions"
          align="start"
          value={editing ? 'edit' : 'moves'}
          states={{
            edit: (
              <span className="cp-row">
                <span className="cp-btn cp-btn--primary" data-target="save">
                  Save
                </span>
                <span className="cp-icon-btn" aria-hidden="true">
                  <Ms name="close" />
                </span>
              </span>
            ),
            moves,
          }}
        />
      ) : (
        <div className="cp-actions">{moves}</div>
      )}
    </article>
  )
}

/** A task beside the story: a real title where the eye lands nearby, quiet lines for the rest. */
function Filler({ title, w, n, target }: { title?: string; w: number; n: number; target?: string }) {
  return (
    <div className="cp-item" {...(target ? { 'data-target': target } : {})}>
      <div className="cp-card">
        {title ? (
          <div className="cp-seed">{title}</div>
        ) : (
          <div className="cp-line">
            <Bar w={w} h={7} tone={3} />
          </div>
        )}
        <div className="cp-line cp-line--sub">
          <Bar w={n} h={6} tone={2} />
        </div>
        <div className="cp-row cp-row--filler">
          <Bar w={62} h={28} r={8} tone={1} />
          <Bar w={44} h={28} r={8} tone={1} className="cp-btn--second" />
        </div>
      </div>
    </div>
  )
}

function Lane({ kind, icon, label, count, children }: { kind: string; icon: string; label: string; count: number; children: React.ReactNode }) {
  return (
    <section className="cp-lane" data-kind={kind}>
      <div className="cp-lane__head">
        <Ms name={icon} />
        <span>{label}</span>
        <Count className="cp-lane__count" value={count} duration={600} />
      </div>
      <div className="cp-lane__list">{children}</div>
    </section>
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
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpb-browser">
              <div className="cpb-body">
                <div className="cpb-head">
                  {!compact && (
                    <div className="cpb-filter">
                      <Ms name="search" />
                      <Bar w={78} h={6} tone={2} />
                    </div>
                  )}
                  <span className="cpb-new" data-target="new">
                    <Ms name="add" />
                    New task
                  </span>
                  {!compact && (
                    <span className="cpb-tools">
                      <span className="cp-icon-btn cp-icon-btn--framed">
                        <Ms name="history" />
                      </span>
                      <span className="cp-icon-btn cp-icon-btn--framed">
                        <Ms name="undo" />
                      </span>
                    </span>
                  )}
                </div>

                <div className="cpb-board">
                  <Lane kind="todo" icon="radio_button_unchecked" label="To do" count={s.todo}>
                    <Collapse open={s.draft} reveal="drop" data-target="todo-slot">
                      <div className="cp-item" data-hidden={!s.todoShown || undefined}>
                        <TaskCard s={s} look="todo" live compact={compact} target="card-todo" />
                      </div>
                    </Collapse>
                    <Filler title={compact ? 'Pick a language' : 'Try the command palette'} w={128} n={compact ? 118 : 184} />
                    <Filler w={compact ? 80 : 104} n={compact ? 88 : 120} />
                  </Lane>

                  <Lane kind="ip" icon="clock_loader_40" label="In progress" count={s.ip}>
                    {/* The room the card travels into: a plain height, so the card can arrive from outside it */}
                    <div className="cp-slot" data-open={s.ipOpen || undefined}>
                      <div className="cp-item">
                        <TaskCard s={s} look={s.ipLook} live={false} compact={compact} target="card-ip" />
                      </div>
                    </div>
                    <Filler title={compact ? undefined : 'Write the next useful step'} w={compact ? 92 : 136} n={compact ? 64 : 184} />
                    <Filler w={compact ? 84 : 98} n={compact ? 72 : 112} />
                  </Lane>

                  {!compact && (
                    <Lane kind="done" icon="check_circle" label="Done" count={2}>
                      <Filler w={112} n={92} />
                      <Filler w={130} n={80} />
                    </Lane>
                  )}
                </div>
              </div>
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
        )
      }}
    </Stage>
  )
}
