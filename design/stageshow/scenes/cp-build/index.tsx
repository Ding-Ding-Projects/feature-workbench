import { Bar, Caret, Prompt, Roll, Stage, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './build.css'

// Build and install, as a feature card (560 × 380) that plays once in view.
//
// Layout (v2 fresh-eye round): stacked, after the stacked-cards gold. Two
// windows at one left edge and a 12px gap, both running off the right edge:
// the terminal on top, whole in height, sized to its log so it holds no
// empty black; under it the app that build produced, running off the
// bottom. The first version (static-card: the app straddling the
// terminal's left edge) left a black void beside the app and, at 390, the
// terminal's foot peeking out behind it.
//
// The app shows its real header, where the v2 site prints its provenance at
// the top right: "Running version 0.4.0 · 2026-11-02 09:14", the same
// version and commit time the log printed. Under it the board's three lanes,
// named, run off the bottom.
//
// Beats (no cursor; the keys are the terminal's): the command is typed; the
// files the build wrote list in, one after another; the build line lands;
// then the open app picks up the new build, and its version and commit time
// roll from the old build to this one, with one pulse. The poster is that
// last frame: the same version in both places.
//
// Real strings: the command, the files written with their sizes, the build
// line, the commit time, the wordmark, the lane names and the provenance.

const COMMIT_TIME = '2026-11-02 09:14'
const CMD = 'npm run build'
const BEFORE = '0.3.2 · 2026-10-28 16:40'
const AFTER = `0.4.0 · ${COMMIT_TIME}`

type S = { typed: string; files: number; built: boolean; app: boolean }
const initial: S = { typed: '', files: 0, built: false, app: false }
const POSTER: S = { typed: CMD, files: 3, built: true, app: true }

async function script(a: Act<S>) {
  await a.wait(1000)
  // 1. The build is asked for
  a.mark('type')
  await a.type('typed', CMD, { interval: 60 })
  await a.wait(500)
  // 2. What it wrote, one file after another
  a.mark('files')
  for (const n of [1, 2, 3]) {
    await a.set({ files: n })
    await a.wait(n === 3 ? 380 : 180)
  }
  // 3. The result
  a.mark('built')
  await a.set({ built: true })
  await a.wait(1100)
  // 4. The open app runs the new build: its provenance rolls to match
  a.mark('app')
  await a.set({ app: true })
  await a.wait(2600)
}

// What the build wrote, the way the bundler lists it: path, then size
const DIST: [string, string][] = [
  ['dist/index.html', '1.24 kB'],
  ['dist/assets/index-4f2a91.css', '18.62 kB'],
  ['dist/assets/index-9c1e07.js', '142.30 kB'],
]

const LANES = [
  { kind: 'todo', label: 'To do' },
  { kind: 'doing', label: 'In progress' },
  { kind: 'done', label: 'Done' },
]

export default function CpBuild() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cpb"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        const typing = s.typed.length < CMD.length
        return (
          <div className="cpb-stack">
            <Window chrome="terminal" lights="grey" title={wide ? 'commonplace — build' : undefined} className="cpb-term">
              <Prompt path="~/commonplace">
                {/* The typed line steps a character at a time, as a terminal does */}
                <span data-typing={typing || undefined} data-snap={typing || undefined}>
                  {s.typed}
                  <span className="cpb-caret" data-off={!typing || undefined}>
                    <Caret still={s.typed.length > 0 && typing} />
                  </span>
                </span>
              </Prompt>
              {/* Every output row keeps its place, as a terminal's rows do;
                  each arrives in it with a short rise */}
              {wide &&
                DIST.map(([file, size], i) => (
                  <div key={file} className="cpb-dist cpb-out" data-show={s.files > i || undefined}>
                    <span className="dim">{file}</span>
                    <span>{size}</span>
                  </div>
                ))}
              <div className="cpb-out" data-show={s.built || undefined}>
                <span className="ok">✓</span> <span className="cpb-bright">Built version 0.4.0 from a1b2c3d</span>
              </div>
              <div className="dim cpb-out" data-show={s.built || undefined}>
                {'  '}source commit {COMMIT_TIME}
              </div>
              {/* The command returns: the next prompt, where the caret waits */}
              <Prompt path="~/commonplace" className="cpb-out" data-show={s.built || undefined}>
                <Caret />
              </Prompt>
            </Window>

            <Window url="commonplace.example" urlShape="pill" className="cpb-app">
              <div className="cpb-app__body">
                <div className="cpb-app__head">
                  {/* Narrow: the address bar names the app; the wordmark goes so the lanes' names stay in frame */}
                  {wide && <span className="cp-display cpb-word">Commonplace</span>}
                  {wide && <Bar w={96} h={24} r={12} tone={1} className="cpb-search" />}
                  <span className="cpb-prov">
                    <span>Running version</span>
                    <span className="cpb-mono" data-pulse={s.app || undefined} data-target="version">
                      <Roll>{s.app ? AFTER : BEFORE}</Roll>
                    </span>
                  </span>
                </div>
                <div className="cpb-cols">
                  {LANES.map((lane, i) => (
                    <div key={lane.kind} className="cpb-col" data-kind={lane.kind}>
                      <span className="cpb-col__label">{lane.label}</span>
                      <span className="cpb-card">
                        <Bar w={[70, 84, 62][i]} h={6} tone={3} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Window>
          </div>
        )
      }}
    </Stage>
  )
}
