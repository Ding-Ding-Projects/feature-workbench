import { Bar, Prompt, Stage, Window } from '../../kit'
import '../../commonplace/look.css'
import './build.css'

// Build and install, as a feature card (560 × 380). Copied from the
// static-card gold: one hero pinned top-left that runs off the right and the
// bottom, and one satellite straddling its left edge, about half outside.
//
// The hero is the terminal running the build: a short real log whose one
// bright result is "Built version 0.4.0 from a1b2c3d". The satellite is the
// app that build produced, cropped to what proves it: the wordmark, its
// three board columns as filler, and the footer's provenance line, which
// repeats the same version and source commit time the log printed.
//
// Real strings: the command, the files written with their sizes, the build
// line, the commit time, the wordmark and the provenance line.

const COMMIT_TIME = '2026-11-02 09:14'

// What the build wrote, the way the bundler lists it: path, then size
const DIST: [string, string][] = [
  ['dist/index.html', '1.24 kB'],
  ['dist/assets/index-4f2a91.css', '18.62 kB'],
  ['dist/assets/index-9c1e07.js', '142.30 kB'],
]

export default function CpBuild() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpb">
      {(_s, _rect, layout) => {
        const wide = layout === 'wide'
        return (
          <>
            <Window chrome="terminal" lights="grey" title={wide ? 'commonplace — build' : undefined} className="cpb-term">
              <Prompt path="~/commonplace">npm run build</Prompt>
              {wide &&
                DIST.map(([file, size]) => (
                  <div key={file} className="cpb-dist">
                    <span className="dim">{file}</span>
                    <span>{size}</span>
                  </div>
                ))}
              <div>
                <span className="ok">✓</span> <span className="cpb-bright">Built version 0.4.0 from a1b2c3d</span>
              </div>
              <div className="dim">  source commit {COMMIT_TIME}</div>
            </Window>

            <Window url="commonplace.example" urlShape="pill" className="cpb-app">
              <div className="cpb-app__body">
                <div className="cpb-app__head">
                  <span className="cp-display cpb-word">Commonplace</span>
                  <Bar w={44} h={14} r={7} tone={2} />
                </div>
                <div className="cpb-cols">
                  <div className="cpb-col" data-kind="todo"><Bar w={30} h={5} tone={3} /></div>
                  <div className="cpb-col" data-kind="doing"><Bar w={36} h={5} tone={3} /></div>
                  <div className="cpb-col" data-kind="done"><Bar w={26} h={5} tone={3} /></div>
                </div>
                <div className="cpb-foot">
                  Running version <span className="cpb-mono">0.4.0</span> · <span className="cpb-mono">{COMMIT_TIME}</span>
                </div>
              </div>
            </Window>
          </>
        )
      }}
    </Stage>
  )
}
