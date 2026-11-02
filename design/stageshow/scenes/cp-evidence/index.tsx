import { Caret, Prompt, Roll, Stage, Text, type Act } from '../../kit'
import '../../commonplace/look.css'
import './evidence.css'

// Commonplace, Completeness and evidence: the completeness inventory as a
// feature card that plays once in view. Two components of the deep-dive at
// one width, the way the product shows them: the inventory card on top
// (three real surfaces, a chip per column, one chip missing), and under it
// the check's output.
//
// Gold: stacked-cards. One width, one left edge, a 12px gap; both cards
// pinned one gutter from the left and top, running off the right edge (the
// rows' rules are what the crop takes) and the output off the bottom.
//
// Beats (a system story, no cursor):
// 1. The check has been run: FAIL lands, and the chip it names pulses.
// 2. The Cantonese file is restored: the same chip morphs Missing -> Restored.
// 3. The check is typed again.
// 4. PASS lands. The poster is this frame: FAIL, the restored chip, PASS.
//
// Real strings: the title, the three surfaces, the column names, the chip's
// two states, the command and its two results.

type Cell = 'ok' | 'missing'
const SURFACES: { name: string; cells: Cell[] }[] = [
  { name: 'Task board', cells: ['ok', 'ok', 'ok', 'ok', 'ok'] },
  { name: 'Command palette', cells: ['ok', 'ok', 'missing', 'ok', 'ok'] },
  { name: 'Undo and history', cells: ['ok', 'ok', 'ok', 'ok', 'ok'] },
]
const COLUMNS = ['Code', 'Article', 'Cantonese', 'Test', 'Screenshot']
const CMD = 'npm run check:completeness'

type S = {
  fail: boolean
  /** Which pulse the chip plays: each value is its own animation, so a change restarts it */
  pulse: number
  fixed: boolean
  again: boolean
  typed: string
  pass: boolean
}

const initial: S = { fail: false, pulse: 0, fixed: false, again: false, typed: '', pass: false }
const POSTER: S = { fail: true, pulse: 0, fixed: true, again: true, typed: CMD, pass: true }

async function script(a: Act<S>) {
  await a.wait(1200)
  // 1. The check answers: FAIL, and the chip it names pulses once
  a.mark('fail')
  await a.set({ fail: true })
  await a.wait(260)
  await a.set({ pulse: 1 })
  await a.wait(1500)

  // 2. The file comes back: the chip morphs in place
  a.mark('fixed')
  await a.set({ fixed: true, pulse: 2 })
  await a.wait(1100)

  // 3. Run the check again
  await a.set({ again: true })
  await a.wait(420)
  await a.type('typed', CMD, { interval: 34 })
  await a.wait(320)

  // 4. PASS, and the result holds
  a.mark('pass')
  await a.set({ pass: true })
  await a.wait(2400)
}

function Glyph({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cpe-icon" aria-hidden="true">
      {name}
    </span>
  )
}

export default function CpEvidence() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cpe"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        // Narrow: the columns before Article go, the crop takes those after
        // Test, so the changing chip and its neighbors stay whole
        const from = compact ? 1 : 0
        const to = compact ? 4 : COLUMNS.length
        const typing = s.again && !s.pass && s.typed.length < CMD.length
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
                {SURFACES.map((row) => (
                  <div key={row.name} className="cpe-row">
                    <Text className="cpe-name">{row.name}</Text>
                    {row.cells.slice(from, to).map((c, i) =>
                      c === 'ok' ? (
                        <span key={i} className="cpe-chip">
                          <Glyph name="check" />
                        </span>
                      ) : (
                        <span
                          key={i}
                          className="cpe-chip cpe-chip--live"
                          data-state={s.fixed ? 'fixed' : 'missing'}
                          data-pulse={s.pulse || undefined}
                          data-target="chip"
                        >
                          {/* One icon slot, its two glyphs crossfading; the label
                              rolls and its width eases to the new word */}
                          <span className="cpe-chip__glyphs">
                            <span className="cpe-chip__glyph" data-on={!s.fixed || undefined}>
                              <Glyph name="close" />
                            </span>
                            <span className="cpe-chip__glyph" data-on={s.fixed || undefined}>
                              <Glyph name="check" />
                            </span>
                          </span>
                          <Roll variant="fade" className="cpe-chip__label">
                            {s.fixed ? 'Restored' : 'Missing'}
                          </Roll>
                        </span>
                      ),
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="cpe-log">
              <div className="ss-term cpe-term">
                <Prompt path="~">{CMD}</Prompt>
                {/* Every line holds its place, as a terminal's rows do; output
                    arrives in it with a short rise, so nothing above moves */}
                <div className="cpe-out" data-show={s.fail || undefined}>
                  <span className="err">FAIL</span> Command palette: Cantonese missing
                </div>
                <Prompt path="~" className="cpe-line" data-show={s.again || undefined}
                  // The line being typed steps a character at a time, as a terminal does
                  data-snap={typing || undefined}
                >
                  <span data-typing={typing || undefined}>
                    {s.typed}
                    {/* The caret leaves with the command's return; its slot stays */}
                    <span className="cpe-caret" data-off={s.pass || undefined}>
                      <Caret still={typing} />
                    </span>
                  </span>
                </Prompt>
                <div className="cpe-out" data-show={s.pass || undefined}>
                  <span className="ok">PASS</span> 3 surfaces, 5 columns each
                </div>
                {/* The command returns: the next prompt, where the caret waits
                    (wide only: at 358 the crop would slice it) */}
                {!compact && (
                  <Prompt path="~" className="cpe-line" data-show={s.pass || undefined}>
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
