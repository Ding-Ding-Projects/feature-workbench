import { Bar, Count, Roll, Stage, States, type Act } from '../../kit'
import '../../commonplace/look.css'
import './release.css'

// Release pipeline, as a feature card (560 × 380), v2: Material 3
// Expressive. Copied from the stacked-cards gold: two components of one
// product at one width and one left edge, 12px apart, the lower one running
// off the bottom. The column is pinned a gutter from the left and runs off
// the right, so every word sits in the left part of the cards.
//
// It plays once, when it comes into view, a system story with no cursor:
// 1. The release is publishing: Build and Package are done, Publish runs as
//    the wavy progress indicator.
// 2. Publish completes: the wave flattens into a bar, the completed time and
//    the duration land in their rows, and the chip turns from Publishing to
//    Latest with one pulse.
// 3. What the release ships arrives: the waiting line in the assets card
//    gives way to the files, which open in a short stagger as the count
//    rolls from 0 to 4.
// The poster is the finished release with its files, the payoff.
//
// Real strings: the version and code name, the three timing rows, the
// phases and the asset names. Everything else is quiet filler.

type S = { done: boolean; publish: number; assets: boolean; files: number }

const initial: S = { done: false, publish: 0.18, assets: false, files: 0 }
const POSTER: S = { done: true, publish: 1, assets: true, files: 4 }

async function script(a: Act<S>) {
  await a.wait(900)
  // 1. Publish runs to the end of its track
  a.mark('publish')
  await a.set({ publish: 1 })
  await a.wait(2300)
  // 2. Done: the wave flattens, the times land, the chip turns to Latest
  a.mark('done')
  await a.set({ done: true })
  await a.wait(900)
  // 3. The release's files arrive
  a.mark('assets')
  await a.set({ assets: true })
  // The count rolls once to the files the release ships, while the files
  // fade into their own reserved rows, one after another
  for (let n = 1; n <= 4; n++) {
    await a.wait(n === 1 ? 0 : 90)
    await a.set({ files: n })
  }
  await a.wait(2400)
}

// The installer, the update feed's index, and the full and delta packages
const ASSETS: [string, string][] = [
  ['Setup.exe', '61.4 MB'],
  ['RELEASES', '0.2 kB'],
  ['Commonplace-0.4.0-full.nupkg', '60.9 MB'],
  ['Commonplace-0.4.0-delta.nupkg', '3.1 MB'],
]

const TIMING: [string, string, string][] = [
  ['Workflow started', '2026-11-02T09:14:07Z', '2026-11-02T09:14:07Z'],
  ['Workflow completed', '', '2026-11-02T09:31:52Z'],
  ['Workflow duration', '', '00:17:45'],
]

function Glyph({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cprel-glyph" aria-hidden="true">
      {name}
    </span>
  )
}

// One wavelength is 16px; the path runs two extra waves so the phase can
// slide one wavelength left forever without showing an end.
const WAVE = (() => {
  let d = 'M0 6'
  for (let x = 0; x < 160; x += 16) d += ` q4 -4 8 0 t8 0`
  return d
})()

/** Publish: the M3 Expressive wavy indicator, flattening into a bar when it ends. */
function Wavy({ value, done }: { value: number; done: boolean }) {
  return (
    <span className="cprel-wavy" data-done={done || undefined}>
      <span className="cprel-wavy__track" />
      <span className="cprel-wavy__stop" />
      <span className="cprel-wavy__fill" data-crop style={{ width: `${value * 100}%` }}>
        <svg className="cprel-wavy__svg" viewBox="0 0 160 12" width="160" height="12" aria-hidden="true">
          <path d={WAVE} />
        </svg>
      </span>
    </span>
  )
}

export default function CpRelease() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cprel"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        // Wide shows three files whole and the fourth as a quiet row the
        // crop cuts; compact shows two and the quiet row
        const shown = wide ? 3 : 2
        // Every file has its own row from the first frame (one height, no
        // overlap); a row's content fades in only in its own slot. The
        // waiting line sits over the first slot and leaves as it fills.
        const assets = (
          <div className="cprel-list">
            <div className="cprel-wait" data-gone={s.assets || undefined}>
              <Glyph name="hourglass_top" />
              <span className="cprel-pending">Waiting for Publish</span>
            </div>
            {ASSETS.slice(0, shown).map(([file, size], i) => (
              <div key={file} className="cprel-asset" data-shown={s.files > i || undefined}>
                <span className="cprel-asset__in">
                  <Glyph name={file === 'RELEASES' ? 'description' : 'inventory_2'} />
                  <span className="cprel-file">{file}</span>
                  {wide && <span className="cprel-size">{size}</span>}
                </span>
              </div>
            ))}
            <div className="cprel-asset" aria-hidden="true" data-shown={s.files > shown || undefined}>
              <span className="cprel-asset__in">
                <Bar w={18} h={18} r={4} tone={2} />
                <Bar w={150} h={6} tone={2} />
              </span>
            </div>
          </div>
        )
        return (
          <div className="cprel-stack">
            <section className="cprel-card">
              <div className="cprel-head">
                <span className="cprel-mark">
                  <Glyph name="restaurant" />
                </span>
                <div className="cprel-name">
                  <span className="cprel-version">
                    v0.4.0
                    <span className="cprel-chip" data-done={s.done || undefined}>
                      <Roll variant="fade">{s.done ? 'Latest' : 'Publishing'}</Roll>
                    </span>
                  </span>
                  <span className="cp-display cprel-food">
                    Egg tart <span lang="zh-HK">蛋撻</span>
                  </span>
                </div>
              </div>
              <div className="cprel-timing">
                {TIMING.map(([label, before, after]) => (
                  <div key={label} className="cprel-row">
                    <span className="cprel-label">{label}</span>
                    {before === after ? (
                      <span className="cprel-value">{after}</span>
                    ) : (
                      <States
                        className="cprel-value"
                        align="start"
                        value={s.done ? 'after' : 'before'}
                        states={{
                          before: <span className="cprel-pending">Measuring</span>,
                          after: <span>{after}</span>,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="cprel-band">
                {(['Build', 'Package'] as const).map((name, i) => (
                  <span key={name} className="cprel-phase" style={{ flex: i === 0 ? 9 : 6 }}>
                    <span className="cprel-phase__bar" />
                    <span className="cprel-phase__name">{name}</span>
                  </span>
                ))}
                <span className="cprel-phase" style={{ flex: 5 }}>
                  <Wavy value={s.publish} done={s.done} />
                  <span className="cprel-phase__name">Publish</span>
                </span>
              </div>
              {!wide && <div className="cprel-assets-inline">{assets}</div>}
            </section>

            {wide ? (
              <section className="cprel-card cprel-assets">
                <div className="cprel-assets__head">
                  <span>Assets</span>
                  <span className="cprel-count">
                    <Count value={s.files > 0 ? 4 : 0} duration={450} />
                  </span>
                </div>
                {assets}
              </section>
            ) : null}
          </div>
        )
      }}
    </Stage>
  )
}
