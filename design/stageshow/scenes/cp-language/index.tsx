import { Bar, Connector, Stage, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './language.css'

// Commonplace, Language (v2, Material 3 Expressive): a feature-card loop
// copied from panel-annotation. The settings card straddles the workspace
// window's right edge over its second lane (filler), never over the header
// it changes.
//
// Beats: the workspace opens in English. Bilingual is pressed in the
// connected button group (the selection morphs onto it), the Cantonese
// names arrive in a short stagger: 工作區 beside the title, 完成 and 進行中
// beside the lane names, 揀語言 under the task title. One neutral leader
// draws from 工作區 to just above the Bilingual segment that caused it. The payoff holds,
// then English is pressed: the leader withdraws and the label leaves, which
// is the opening frame again.
//
// Real strings: Workspace 工作區, Done 完成, In progress 進行中, Pick a
// language 揀語言, English, Cantonese, Bilingual, Cantonese playfulness.
//
// Narrow, there is no clear path for the leader: the card rises over the
// lanes as a sheet below the header, which carries the story on its own.

type Lang = 'en' | 'yue' | 'bi'
type S = { lang: Lang; label: boolean; leader: boolean }

const initial: S = { lang: 'en', label: false, leader: false }
const POSTER: S = { lang: 'bi', label: true, leader: true }

const REST = { wide: { x: 470, y: 180 }, compact: { x: 300, y: 150 } }

async function script(a: Act<S>) {
  const compact = a.layout === 'compact'
  await a.wait(900)

  // 1. Bilingual: the selection morphs over
  await a.move({ at: 'seg-bi', x: 0.82, y: 0.7 })
  await a.wait(150)
  a.mark('bi')
  await a.click()
  await a.set({ lang: 'bi' })
  await a.wait(260)

  // 2. The header answers: 工作區 arrives beside the title, then the leader draws back to its cause
  await a.set({ label: true })
  await a.wait(compact ? 300 : 520)
  a.mark('leader')
  if (!compact) await a.set({ leader: true })
  await a.move('rest')
  a.mark('payoff')
  await a.wait(2600)

  // 3. English: the leader withdraws, then the label leaves; the opening frame again
  await a.move({ at: 'seg-en', x: 0.84, y: 0.7 })
  await a.wait(150)
  a.mark('en')
  await a.click()
  await a.set({ lang: 'en', leader: false })
  await a.wait(220)
  await a.set({ label: false })
  await a.wait(500)
  await a.move('rest')
  await a.wait(700)
}

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpl-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

function Card({ widths, k = 1, title, yue, bi, sel }: { widths: [number, number]; k?: number; title?: string; yue?: string; bi?: boolean; sel: number }) {
  return (
    <div className="cpl-card">
      {title ? <Text className="cpl-card-title">{title}</Text> : <Bar w={Math.round(widths[0] * k)} h={8} r={4} tone={3} />}
      {yue ? (
        // One slot: the notes line gives way to the Cantonese title in Bilingual
        <span className="cpl-swap" data-bi={bi || undefined}>
          <Bar w={Math.round(widths[1] * k)} h={6} r={3} tone={2} className="cpl-swap__bar" />
          <span className="cpl-card-yue" lang="yue-Hant">
            {yue}
          </span>
        </span>
      ) : (
        <Bar w={Math.round(widths[1] * k)} h={6} r={3} tone={2} />
      )}
      <div className="cpl-card-actions">
        {[30, 40, 28].map((w, i) => (
          <span key={i} className="cpl-fseg" data-sel={i === sel || undefined} style={{ width: Math.round(w * (k === 1 ? 1 : 0.8)) }} />
        ))}
      </div>
    </div>
  )
}

/** A lane's name, with its Cantonese name arriving beside it in Bilingual. */
function LaneName({ en, yue, bi, delay }: { en: string; yue: string; bi: boolean; delay: number }) {
  return (
    <span className="cpl-lane-name">
      <span>{en}</span>
      <span className="cpl-lane-yue" lang="yue-Hant" data-show={bi || undefined} style={{ transitionDelay: bi ? `${delay}ms` : '0ms' }}>
        {yue}
      </span>
    </span>
  )
}

const LANGS: { id: Lang; label: React.ReactNode; target: string }[] = [
  { id: 'en', label: 'English', target: 'seg-en' },
  { id: 'yue', label: 'Cantonese', target: 'seg-yue' },
  { id: 'bi', label: 'Bilingual', target: 'seg-bi' },
]

export default function CpLanguage() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      className="look-commonplace cpl"
    >
      {(s, rect, layout) => {
        const label = rect('label-yue')
        const bi = rect('seg-bi')
        // Narrow lanes are a third slimmer, so their placeholder lines are too
        const k = layout === 'compact' ? 0.7 : 1
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpl-win">
              <div className="cpl-app">
                <div className="cpl-head">
                  <span className="cp-display cpl-title">Workspace</span>
                  <span className="cpl-yue" lang="yue-Hant" data-target="label-yue" data-show={s.label || undefined}>
                    工作區
                  </span>
                </div>
                <div className="cpl-lanes">
                  <section className="cpl-lane cpl-lane--done">
                    <div className="cpl-lane-head">
                      <Icon name="check_circle" className="cpl-icon--done" />
                      <LaneName en="Done" yue="完成" bi={s.label} delay={80} />
                    </div>
                    <Card widths={[118, 86]} k={k} title="Pick a language" yue="揀語言" bi={s.label} sel={2} />
                    <Card widths={[96, 110]} k={k} sel={2} />
                    <Card widths={[124, 72]} k={k} sel={2} />
                  </section>
                  <section className="cpl-lane cpl-lane--ip">
                    <div className="cpl-lane-head">
                      <Icon name="clock_loader_40" className="cpl-icon--ip" />
                      <LaneName en="In progress" yue="進行中" bi={s.label} delay={140} />
                    </div>
                    <Card widths={[104, 80]} k={k} sel={1} />
                    <Card widths={[88, 112]} k={k} sel={1} />
                    <Card widths={[110, 76]} k={k} sel={1} />
                  </section>
                </div>
              </div>
            </Window>

            <section className="cpl-panel" data-target="panel">
              <div className="cpl-group" role="group">
                {LANGS.map((l) => (
                  <span key={l.id} className="cpl-seg" data-sel={s.lang === l.id || undefined} data-target={l.target}>
                    {l.label}
                  </span>
                ))}
              </div>
              <div className="cpl-slider">
                <div className="cpl-slider-label">
                  <Text>Cantonese playfulness</Text>
                </div>
                <div className="cpl-track">
                  <span className="cpl-track-fill" />
                  <span className="cpl-thumb" />
                  <span className="cpl-track-rest" />
                </div>
              </div>
            </section>

            {layout !== 'compact' && label.width > 0 && bi.width > 0 && (
              <Connector
                show={s.leader}
                route="h"
                dots="both"
                from={{ x: label.x + label.width + 8, y: label.y + label.height / 2 }}
                to={{ x: bi.x + bi.width / 2, y: bi.y - 8 }}
              />
            )}

            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
