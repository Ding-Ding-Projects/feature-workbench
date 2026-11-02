import { Collapse, Count, Roll, Stage, Text, type Act } from '../../kit'
import '../../commonplace/look.css'
import './repository.css'

// Commonplace, repository records, v2 (Material 3 Expressive): the project
// README rendered as a page, its line-count table in focus, and the
// hand-time estimate beside the counts as one satellite.
//
// Started from the fade-crop gold; framed like the static-card gold: the
// page bleeds off the top, right and bottom, and the satellite straddles its
// left edge in the lower half, covering only page margin and filler.
//
// It plays once, when it comes into view, a system story with no cursor:
// 1. The count picks up a new language: the HTML row opens into the table,
//    tinted for a moment, and the rows below make room.
// 2. The hand-written total rolls from 4,000 to 4,800.
// 3. The method under the table follows its total: the two lines of
//    arithmetic roll (4,000 to 4,800, 80 to 96, 120 to 144), then the
//    estimate itself rolls to 96 to 144 working days and the satellite
//    pulses once.
// The poster is the finished table with its estimate, the payoff.
//
// Real strings: README.md, Line counts, three language rows, the hand-written
// total, the README's method (rate, multiplier, arithmetic) and the estimate,
// all from the Repository records page. Fresh-eye review: the lower third
// was filler bars over white, so the README's own method fills it now.

type S = { html: boolean; total: number; low: number; high: number; pulse: boolean }

const initial: S = { html: false, total: 4000, low: 80, high: 120, pulse: false }
const POSTER: S = { html: true, total: 4800, low: 96, high: 144, pulse: false }

async function script(a: Act<S>) {
  await a.wait(1000)
  a.mark('row')
  await a.set({ html: true })
  await a.wait(700)
  a.mark('total')
  await a.set({ total: 4800 })
  await a.wait(900)
  a.mark('estimate')
  await a.set({ low: 96, high: 144, pulse: true })
  await a.wait(2600)
}

const ROWS = [
  { name: 'TypeScript', value: '3,100' },
  { name: 'CSS', value: '900' },
]

export default function CpRepository() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cprepo"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        // The arithmetic is redone with the estimate, after the total lands
        const lines = s.low === 80 ? '4,000' : '4,800'
        return (
        <>
          <article className="cprepo-page">
            <div className="cprepo-file">
              <span className="material-symbols-rounded cprepo-ms" aria-hidden="true">description</span>
              <Text className="cprepo-filename">README.md</Text>
            </div>
            <div className="cprepo-h2"><Text>Line counts</Text></div>
            <div className="cprepo-table">
              {ROWS.map((r) => (
                <div key={r.name} className="cprepo-tr">
                  <Text className="cprepo-lang">{r.name}</Text>
                  <Text className="cprepo-num">{r.value}</Text>
                </div>
              ))}
              <Collapse open={s.html}>
                <div className="cprepo-tr cprepo-new" data-new={s.html || undefined}>
                  <Text className="cprepo-lang">HTML</Text>
                  <Text className="cprepo-num">800</Text>
                </div>
              </Collapse>
              <div className="cprepo-tr cprepo-total">
                <Text className="cprepo-lang">Hand-written total</Text>
                <Count className="cprepo-num" value={s.total} duration={600} />
              </div>
            </div>
            {wide && (
              <div className="cprepo-method">
                <Text className="cprepo-line">Rate: 40 to 60 lines a day</Text>
                <Text className="cprepo-line">Multiplier: 1.2 for tests and review</Text>
                <span className="cprepo-math">
                  <Roll>{lines}</Roll> / 60 × 1.2 = <Roll>{String(s.low)}</Roll>
                </span>
                <span className="cprepo-math">
                  <Roll>{lines}</Roll> / 40 × 1.2 = <Roll>{String(s.high)}</Roll>
                </span>
              </div>
            )}
          </article>
          <aside className="cprepo-estimate" data-pulse={s.pulse || undefined}>
            <Text className="cprepo-est-label">How long a person would take</Text>
            <span className="cprepo-est-value">
              <Roll delay={250}>{String(s.low)}</Roll> to <Roll delay={250}>{String(s.high)}</Roll> working days
            </span>
          </aside>
        </>
        )
      }}
    </Stage>
  )
}
