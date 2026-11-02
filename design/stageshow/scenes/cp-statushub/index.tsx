import { Bar, Collapse, Field, Roll, Stage, States, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './hub.css'

// Commonplace, Status Hub, v2 (Material 3 Expressive), light theme like the
// rest of the set (the dark look stays in the canvas). A feature
// card that plays once in view, no cursor: the system tells the story. The
// browser window sits one gutter in from the top and left and runs off the
// right and bottom; depth from surface steps.
//
// It opens on a session waiting on a question: the status pill says
// "Question waiting" and the record's newest line is that question. Then:
//   1. "Answer reached session inbox" drops in at the top of the record; the
//      older lines move down on the default spring.
//   2. "Confirmed by polling" opens under it: the Hub counts an answer as sent
//      only once the inbox confirms it.
//   3. Only then the pill rolls to "In progress", crossfades to the In
//      progress tone and pulses once (scale 1 -> 1.06 -> 1).
// The end is the poster: answer confirmed, session back in progress.

type S = { answer: boolean; confirmed: boolean; running: boolean }

const initial: S = { answer: false, confirmed: false, running: false }
const POSTER: S = { answer: true, confirmed: true, running: true }

async function script(a: Act<S>) {
  await a.wait(1200)
  a.mark('answer')
  await a.set({ answer: true })
  await a.wait(800)
  a.mark('confirmed')
  await a.set({ confirmed: true })
  await a.wait(650)
  a.mark('status')
  await a.set({ running: true })
  await a.wait(1600)
}

const FILLER = [
  { w: 150, t: 34 },
  { w: 118, t: 34 },
]

function Ic({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cph-ic${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

export default function CommonplaceStatusHub() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cph"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        return (
          <Window url="commonplace.example" urlShape="pill" className="cph-win">
            <div className="cph-body">
              {wide && (
                <header className="cph-top">
                  <span className="cp-display cph-mark">Commonplace</span>
                  <span className="cph-top__end">
                    <span className="cph-find">
                      <Ic name="search" className="cph-faint" />
                      Find an action
                    </span>
                    <span className="cph-iconbtn">
                      <Ic name="tune" />
                    </span>
                  </span>
                </header>
              )}

              <div className="cph-main">
                <section className="cph-card" data-target="session">
                  <div className="cph-card__head">
                    {wide && <Ic name="monitor_heart" className="cph-accent" />}
                    <span className="cph-name">feature-workbench</span>
                    <span className="cph-pill" data-status={s.running ? 'running' : 'waiting'} data-target="status">
                      <States className="cph-pill__icon" value={s.running ? 'running' : 'waiting'} states={{ waiting: <Ic name="help" />, running: <Ic name="clock_loader_40" /> }} />
                      <span className="cph-pill__label">
                        <Roll variant="fade" align="end">
                          {s.running ? 'In progress' : 'Question waiting'}
                        </Roll>
                      </span>
                    </span>
                  </div>
                  {wide && (
                    <div className="cph-card__meta">
                      <span className="cph-chip">main</span>
                      <span className="cph-chip">stable</span>
                      <span className="cph-chip">
                        <Ic name="check_circle" className="cph-chip__ic" />
                        12 passed
                      </span>
                    </div>
                  )}
                </section>

                <Field className="cph-search" placeholder="Search record" leading={<Ic name="search" className="cph-faint" />} />

                <div className="cph-record">
                  <Collapse open={s.answer} reveal="drop" className="cph-arrive" data-target="answer">
                    <div className="cph-row cph-row--answer">
                      <Ic name="mark_email_read" className="cph-accent" />
                      <span className="cph-row__text">Answer reached session inbox</span>
                      <span className="cph-row__when">14:05</span>
                      {/* Its own height, not a nested Collapse: the drop above leaves its content unclipped */}
                      <div className="cph-sub" data-open={s.confirmed || undefined}>
                        <div className="cph-sub__inner">
                          <span className="cph-row__sub">
                            <Ic name="check_circle" className="cph-sub__ic" />
                            Confirmed by polling
                          </span>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                  <div className="cph-row">
                    <Ic name="help" className="cph-amber" />
                    <span className="cph-row__text">Question waiting</span>
                    <span className="cph-row__when">14:02</span>
                  </div>
                  {FILLER.map((f, i) => (
                    <div key={i} className="cph-row cph-row--filler">
                      <Bar w={18} h={18} r={9} tone={1} />
                      <Bar w={f.w} h={7} tone={2} />
                      <Bar w={f.t} h={7} tone={1} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
