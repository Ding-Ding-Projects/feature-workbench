import { Bar, Stage, Text } from '../../kit'
import '../../commonplace/look.css'
import './repository.css'

// Commonplace, repository records: the project README rendered as a page,
// its line-count table in focus, and the hand-time estimate that sits beside
// the counts as one satellite. A still.
//
// Started from the fade-crop gold (a surface over filler); after review it
// is framed like the static-card gold: the page bleeds off the top, right
// and bottom, and the satellite straddles its left edge in the lower half,
// covering only page margin and filler.
//
// - The page is a document (a ruled page with real margins), not a window.
// - The table runs the page's text column, starting on its first real row.
// - Narrow: the page fills the stage less a gutter on the left, and the
//   estimate sits over the filler under the table.
//
// Real strings: README.md, Line counts, three language rows, the hand-written
// total, and the estimate.

const ROWS = [
  { name: 'TypeScript', value: '3,100' },
  { name: 'CSS', value: '900' },
  { name: 'HTML', value: '800' },
]

export default function CpRepository() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpr">
      {() => (
        <>
          <article className="cpr-page">
            <div className="cpr-file">
              <span className="material-symbols-rounded cpr-ms" aria-hidden="true">description</span>
              <Text className="cpr-filename">README.md</Text>
            </div>
            <div className="cpr-h2"><Text>Line counts</Text></div>
            <div className="cpr-table">
              {ROWS.map((r) => (
                <div key={r.name} className="cpr-tr">
                  <Text className="cpr-lang">{r.name}</Text>
                  <Text className="cpr-num">{r.value}</Text>
                </div>
              ))}
              <div className="cpr-tr cpr-total">
                <Text className="cpr-lang">Hand-written total</Text>
                <Text className="cpr-num">4,800</Text>
              </div>
            </div>
            <div className="cpr-after">
              <Bar w={120} h={10} r={5} tone={3} />
              <Bar w={300} h={7} r={3.5} tone={2} />
              <Bar w={236} h={7} r={3.5} tone={2} />
              <Bar w={268} h={7} r={3.5} tone={2} />
            </div>
          </article>
          <aside className="cpr-estimate">
            <Text className="cpr-est-label">How long a person would take</Text>
            <Text className="cpr-est-value">96 to 144 working days</Text>
            <Bar w={132} h={7} r={3.5} tone={2} />
          </aside>
        </>
      )}
    </Stage>
  )
}
