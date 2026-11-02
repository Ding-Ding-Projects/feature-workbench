import { Bar, Stage, Text } from '../../kit'
import '../../commonplace/look.css'
import './canonical.css'

// Commonplace, canonical instruction deliverables: the portable editions of a
// shared agent-instructions set, gathered as a loose pile of same-size file
// cards. A still.
//
// Copied from the tilted-stack gold: three same-size cards in one cell at
// small alternating angles (-6, 4, -2), each turned about its own center and
// offset a little, so the corners fan out the way paper lands. The pile
// earns its tilt because the story is files you take with you, not a screen.
//
// - The top card is the straightest and the only one with words: the
//   single-file edition, its version and its Download action.
// - The cards under it show their file tile and short filler lines only,
//   spaced so even their turned boxes never overlap.
// - After review the pile is drawn large and runs off the right and bottom
//   edges; only the top card's padding and the lower cards' filler are cut.
//
// Real strings: the edition's name, its one-line description, its version
// and date, and Download.

export default function CpCanonical() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpc">
      {() => (
        <div className="cpc-pile">
          <section className="cpc-card cpc-card--back">
            <span className="cpc-tile cpc-tile--quiet" />
            <Bar w={100} h={9} r={4.5} tone={3} />
            <Bar w={112} h={7} r={3.5} tone={2} />
          </section>
          <section className="cpc-card cpc-card--mid">
            <span className="cpc-tile cpc-tile--quiet" />
            <Bar w={96} h={9} r={4.5} tone={3} />
            <Bar w={104} h={7} r={3.5} tone={2} />
          </section>
          <section className="cpc-card cpc-card--top">
            <span className="cpc-tile">
              <span className="material-symbols-rounded cpc-ms" aria-hidden="true">description</span>
            </span>
            <div className="cpc-who">
              <Text className="cpc-name">Single-file edition</Text>
              <Text className="cpc-desc">Every instruction in one Markdown file.</Text>
            </div>
            <Text className="cpc-version">0.4.0 · 2026-11-02</Text>
            <span className="cpc-button">
              <span className="material-symbols-rounded cpc-ms" aria-hidden="true">download</span>
              <Text className="cpc-button-label">Download</Text>
            </span>
          </section>
        </div>
      )}
    </Stage>
  )
}
