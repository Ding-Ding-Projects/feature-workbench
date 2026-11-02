import { Caret, Prompt, Stage, Text } from '../../kit'
import '../../commonplace/look.css'
import './evidence.css'

// Commonplace, Completeness and evidence: the completeness inventory as a
// feature card still. Two components of the deep-dive at one width, the way
// the product shows them: the inventory card on top (three real surfaces, a
// chip per column, one chip missing), and under it the check's output, which
// fails on that missing chip and passes once the file is restored.
//
// Gold: stacked-cards. One width, one left edge, a 12px gap; both cards
// pinned one gutter from the left and top, running off the right edge (the
// rows' rules are what the crop takes) and the output off the bottom. Both
// cards tell one event: the missing Cantonese chip is the FAIL line.
//
// Real strings: the title, the three surfaces, the column names, Missing, the
// command and its two results. Everything else is a bar.

type Cell = 'ok' | 'missing'
const SURFACES: { name: string; cells: Cell[] }[] = [
  { name: 'Task board', cells: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Command palette', cells: ['ok', 'ok', 'missing', 'ok', 'ok'] },
  { name: 'Undo and history', cells: ['ok', 'ok', 'ok', 'ok', 'ok'] },
]
const COLUMNS = ['Code', 'Article', 'Cantonese', 'Test', 'Screenshot']

function Glyph({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cpe-icon" aria-hidden="true">
      {name}
    </span>
  )
}

export default function CpEvidence() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpe">
      {(_s, _rect, layout) => {
        const compact = layout === 'compact'
        // Narrow: the columns before Article go, the crop takes those after
        // Test, so the missing chip and its neighbors stay whole
        const from = compact ? 1 : 0
        const to = compact ? 4 : COLUMNS.length
        return (
          <div className="cpe-stack">
            <section className="cpe-card">
              {!compact && (
                <div className="cpe-head">
                  <Text className="cpe-title cp-display">Completeness inventory</Text>
                </div>
              )}
              <div className="cpe-grid">
                <div className="cpe-colhead" />
                {COLUMNS.slice(from, to).map((c) => (
                  <Text key={c} className="cpe-colhead">
                    {c}
                  </Text>
                ))}
                <div className="cpe-colhead" />
                {SURFACES.map((s) => (
                  <div key={s.name} className="cpe-row">
                    <Text className="cpe-name">{s.name}</Text>
                    {s.cells.slice(from, to).map((c, i) =>
                      c === 'ok' ? (
                        <span key={i} className="cpe-chip">
                          <Glyph name="check" />
                        </span>
                      ) : (
                        <span key={i} className="cpe-chip" data-missing data-target="missing">
                          <Glyph name="close" />
                          <Text className="cpe-chip__label">Missing</Text>
                        </span>
                      ),
                    )}
                      </div>
                ))}
              </div>
            </section>

            <section className="cpe-log">
              <div className="ss-term cpe-term">
                <Prompt path="~">npm run check:completeness</Prompt>
                <div>
                  <span className="err">FAIL</span> Command palette: Cantonese missing
                </div>
                <Prompt path="~">npm run check:completeness</Prompt>
                <div>
                  <span className="ok">PASS</span> 3 surfaces, 5 columns each
                </div>
                {!compact && (
                  <Prompt path="~">
                    <Caret />
                  </Prompt>
                )}
              </div>
            </section>
          </div>
        )
      }}
    </Stage>
  )
}
