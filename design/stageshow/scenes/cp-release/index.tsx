import { Bar, Stage } from '../../kit'
import '../../commonplace/look.css'
import './release.css'

// Release pipeline, as a feature card (560 × 380). Copied from the
// stacked-cards gold: two components of one product at one width and one
// left edge, 12px apart, the lower one running off the bottom. Unlike the
// gold the column is pinned a gutter from the left and runs off the right,
// so every word sits in the left part of the cards and only card bleeds.
//
// The top card is the release itself, whole: its version with the food code
// name in English and Cantonese, then the three measured timing rows on one
// grid (label track, value track) over the build, package and publish band.
// The lower card is what the release ships: its assets, the installer first.
// No dish photograph: the code name is said in words.
//
// Real strings: the version and code name, the three timing rows, and the
// two asset names. Everything else is quiet filler.

// The installer, the update feed's index, and the full and delta packages
const ASSETS: [string, string][] = [
  ['Setup.exe', '61.4 MB'],
  ['RELEASES', '0.2 kB'],
  ['Commonplace-0.4.0-full.nupkg', '60.9 MB'],
  ['Commonplace-0.4.0-delta.nupkg', '3.1 MB'],
]

const TIMING: [string, string][] = [
  ['Workflow started', '2026-11-02T09:14:07Z'],
  ['Workflow completed', '2026-11-02T09:31:52Z'],
  ['Workflow duration', '00:17:45'],
]

function Glyph({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cpr-glyph" aria-hidden="true">
      {name}
    </span>
  )
}

export default function CpRelease() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpr">
      {(_s, _rect, layout) => {
        const wide = layout === 'wide'
        // The release ships these. Wide: their own card, stacked under the
        // release. Compact: the stack would leave the release card floating,
        // so the assets join it and the one card runs off the bottom.
        const assets = ASSETS.map(([file, size]) => (
          <div key={file} className="cpr-asset">
            <Glyph name={file === 'RELEASES' ? 'description' : 'inventory_2'} />
            <span className="cpr-file">{file}</span>
            {wide && <span className="cpr-size">{size}</span>}
          </div>
        )).concat(
          // The list goes on past the crop: one quiet row the stage edge cuts
          <div key="more" className="cpr-asset" aria-hidden="true">
            <Bar w={18} h={18} r={4} tone={2} />
            <Bar w={150} h={6} tone={2} />
          </div>,
        )
        return (
          <div className="cpr-stack">
            <section className="cpr-card">
              <div className="cpr-head">
                <span className="cpr-mark">
                  <Glyph name="restaurant" />
                </span>
                <div className="cpr-name">
                  <span className="cpr-version">
                    v0.4.0 <span className="cpr-latest">Latest</span>
                  </span>
                  <span className="cp-display cpr-food">
                    Egg tart <span lang="zh-HK">蛋撻</span>
                  </span>
                </div>
              </div>
              <div className="cpr-timing">
                {TIMING.map(([label, value]) => (
                  <div key={label} className="cpr-row">
                    <span className="cpr-label">{label}</span>
                    <span className="cpr-value">{value}</span>
                  </div>
                ))}
              </div>
              {wide && (
                <div className="cpr-band">
                  {([['Build', 9], ['Package', 6], ['Publish', 3]] as const).map(([name, flex]) => (
                    <span key={name} className="cpr-phase" style={{ flex }}>
                      <span className="cpr-phase__bar" />
                      <span className="cpr-phase__name">{name}</span>
                    </span>
                  ))}
                </div>
              )}
              {!wide && <div className="cpr-assets-inline">{assets}</div>}
            </section>

            {wide ? <section className="cpr-card cpr-assets">{assets}</section> : null}
          </div>
        )
      }}
    </Stage>
  )
}
