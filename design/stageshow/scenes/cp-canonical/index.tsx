import { Bar, Roll, Spinner, Stage, States, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './canonical.css'

// Commonplace, canonical instruction deliverables, v2 (Material 3
// Expressive): the portable editions of a shared agent-instructions set,
// downloaded inside the product.
//
// Fresh-eye review: the earlier tilted pile of file cards had no Commonplace
// UI and could have been any product, and its front card was empty under
// the button. It is now the product's own Portable editions panel in a
// quiet browser window (the static-card / pinned-bleed framing: the window
// runs off the right and bottom edges), the three editions as M3 list cards.
//
// It plays once, when it comes into view:
// 1. The pointer, resting on the panel beside the heading, travels to the
//    Full edition's Download and presses it: the outlined pill morphs to
//    12px corners on the fast spring.
// 2. It downloads: a spinner takes the icon's slot and the label fades to
//    Downloading, the pill easing to the new width.
// 3. Done: a check and Downloaded, the button turns tonal.
// The poster is the downloaded edition, the payoff.
//
// Real strings: Portable editions, the three edition names and files, Copy
// prompt, Download and its states (from the Canonical deliverables page).

type Phase = 'idle' | 'busy' | 'done'
type S = { phase: Phase }

const initial: S = { phase: 'idle' }
const POSTER: S = { phase: 'done' }

const REST = { wide: { x: 476, y: 112 }, compact: { x: 300, y: 92 } }

async function script(a: Act<S>) {
  await a.wait(1400)
  await a.move({ at: 'download', x: 0.86, y: 0.7 })
  await a.wait(180)
  a.mark('press')
  await a.click()
  await a.set({ phase: 'busy' })
  await a.wait(400)
  await a.move(a.layout === 'wide' ? REST.wide : REST.compact)
  await a.wait(1000)
  a.mark('done')
  await a.set({ phase: 'done' })
  await a.wait(2600)
}

function Ms({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cpcan-ms" aria-hidden="true">
      {name}
    </span>
  )
}

function Edition({ icon, name, file, accent, children }: { icon: string; name: string; file: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="cpcan-row">
      <span className="cpcan-tile" data-accent={accent || undefined}>
        <Ms name={icon} />
      </span>
      <span className="cpcan-who">
        <Text className="cpcan-name">{name}</Text>
        <Text className="cpcan-path">{file}</Text>
      </span>
      {children}
    </div>
  )
}

export default function CpCanonical() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      cursor={{ at: REST }}
      className="look-commonplace cpcan"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        return (
          <Window url="commonplace.example" urlShape="pill" className="cpcan-browser">
            <div className="cpcan-body">
              <span className="cp-display cpcan-title">Portable editions</span>
              <div className="cpcan-list">
                <Edition icon="chat" name="Prompt edition" file="memory/PROMPT.md">
                  <span className="cpcan-button cpcan-button--copy" aria-label="Copy prompt">
                    <span className="cpcan-face">
                      <span className="cpcan-slot">
                        <Ms name="content_copy" />
                      </span>
                      <span className="cpcan-button-label">Copy prompt</span>
                    </span>
                  </span>
                </Edition>
                <Edition icon="description" name="Full edition" file="memory/FULL.md" accent>
                  <span className="cpcan-button" data-target="download" data-state={s.phase}>
                    <span className="cpcan-face">
                      <States
                        className="cpcan-slot"
                        value={s.phase}
                        states={{
                          idle: <Ms name="download" />,
                          busy: <Spinner size={18} className="cpcan-spin" />,
                          done: <Ms name="check_circle" />,
                        }}
                      />
                      <Roll variant="fade" className="cpcan-button-label">
                        {s.phase === 'idle' ? 'Download' : s.phase === 'busy' ? 'Downloading' : 'Downloaded'}
                      </Roll>
                    </span>
                  </span>
                </Edition>
                {wide ? (
                  <Edition icon="inventory_2" name="Complete edition" file="memory/COMPLETE.md">
                    <span className="cpcan-button">
                      <span className="cpcan-face">
                        <span className="cpcan-slot">
                          <Ms name="download" />
                        </span>
                        <span className="cpcan-button-label">Download</span>
                      </span>
                    </span>
                  </Edition>
                ) : (
                  // Compact: the list goes on under the crop as one quiet row
                  <div className="cpcan-row" aria-hidden="true">
                    <Bar w={40} h={40} r={12} tone={1} />
                    <span className="cpcan-who">
                      <Bar w={110} h={8} tone={3} />
                      <Bar w={80} h={6} tone={2} />
                    </span>
                    <Bar w={40} h={40} r={20} tone={1} />
                  </div>
                )}
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
