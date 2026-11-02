import { Bar, Connector, Segmented, Stage, Text, Window } from '../../kit'
import '../../commonplace/look.css'
import './language.css'

// Commonplace, Language: a feature-card still copied from panel-annotation.
// The settings panel straddles the workspace window's right edge over its
// second lane (filler), never over the header it changed. Language is set to
// Bilingual and the Cantonese playfulness slider sits midway; one neutral
// leader runs from the workspace title's compact Cantonese label, across the
// empty header band and the ground, then down onto the Bilingual segment
// that caused it.
//
// Real strings (7): Workspace, 工作區, the three segments, Cantonese
// playfulness, and one task title, "Pick a language", in the Done lane.
//
// Narrow, there is no clear path for the leader: the panel rises over the
// lanes as a sheet below the bilingual header, which carries the story.

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpl-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

function Card({ widths, k = 1, title }: { widths: [number, number]; k?: number; title?: string }) {
  return (
    <div className="cpl-card">
      {title ? <Text className="cpl-card-title">{title}</Text> : <Bar w={Math.round(widths[0] * k)} h={8} r={4} tone={3} />}
      <Bar w={Math.round(widths[1] * k)} h={6} r={3} tone={2} />
      <div className="cpl-card-actions">
        <Bar w={46} h={18} r={6} tone={1} />
        <Bar w={34} h={18} r={6} tone={1} />
      </div>
    </div>
  )
}

export default function CpLanguage() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} initial={{}} className="look-commonplace cpl">
      {(_s, rect, layout) => {
        const panel = rect('panel')
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
                  <span className="cpl-yue" lang="yue-Hant" data-target="label-yue">工作區</span>
                </div>
                <div className="cpl-lanes">
                  <section className="cpl-lane cpl-lane--done">
                    <div className="cpl-lane-head">
                      <Icon name="check_circle" className="cpl-icon--accent" />
                      <Bar w={44} h={8} r={4} tone={3} />
                    </div>
                    <Card widths={[118, 86]} k={k} title="Pick a language" />
                    <Card widths={[96, 110]} k={k} />
                    <Card widths={[124, 72]} k={k} />
                  </section>
                  <section className="cpl-lane cpl-lane--amber">
                    <div className="cpl-lane-head">
                      <Icon name="contrast" className="cpl-icon--amber" />
                      <Bar w={56} h={8} r={4} tone={3} />
                    </div>
                    <Card widths={[104, 80]} k={k} />
                    <Card widths={[88, 112]} k={k} />
                    <Card widths={[110, 76]} k={k} />
                  </section>
                </div>
              </div>
            </Window>

            <section className="cpl-panel" data-target="panel">
              <Segmented
                className="cpl-seg"
                value={2}
                targets={[undefined, undefined, 'seg-bi']}
                items={[
                  'English',
                  <span key="yue" lang="yue-Hant">廣東話</span>,
                  'Bilingual',
                ]}
              />
              <div className="cpl-slider">
                <div className="cpl-slider-label">
                  <Text>Cantonese playfulness</Text>
                </div>
                <div className="cpl-track">
                  <span className="cpl-track-fill" />
                  <span className="cpl-thumb" />
                </div>
              </div>
            </section>

            {layout !== 'compact' && panel.width > 0 && label.width > 0 && bi.width > 0 && (
              <Connector
                show
                route="h"
                dots="both"
                from={{ x: label.x + label.width + 8, y: label.y + label.height / 2 }}
                to={{ x: bi.x + bi.width / 2, y: bi.y + 6 }}
              />
            )}
          </>
        )
      }}
    </Stage>
  )
}
