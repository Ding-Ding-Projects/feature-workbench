import { Bar, Field, Stage, Window } from '../../kit'
import '../../commonplace/look.css'
import './hub.css'

// Commonplace, Status Hub: the app's own live status page in the dark theme.
// A feature card still. The browser window sits one gutter in from the top
// and left and runs off the right and bottom, as in the dark hero: depth from
// surface steps, not shadow. The hero is one session card whose status sits
// on its own amber pill (In progress), and under it the session record,
// searchable, newest first: the answer that reached the session inbox, the
// question it answered, then quiet filler running off the foot.
//
// Real strings: the wordmark (only in the wide crop, where the app's header
// shows), the session's project name, its status, the search placeholder,
// two record lines and their times. Everything else is bars.

const RECORD = [
  { icon: 'mark_email_read', tone: 'accent', text: 'Answer reached session inbox', when: '14:05' },
  { icon: 'help', tone: 'amber', text: 'Question waiting', when: '14:02' },
] as const

const FILLER = [
  { w: 150, t: 34 },
  { w: 118, t: 34 },
]

function Ic({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cph-ic${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

export default function CommonplaceStatusHub() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} theme="dark" className="look-commonplace cph">
      {(_s, _rect, layout) => {
        const wide = layout === 'wide'
        return (
          <Window url="commonplace.example" urlShape="pill" className="cph-win">
            <div className="cph-body">
              {wide && (
                <header className="cph-top">
                  <span className="cp-display cph-mark">Commonplace</span>
                  <span className="cph-top__end">
                    <Bar w={132} h={28} r={14} tone={1} />
                    <Bar w={28} h={28} r={8} tone={1} />
                  </span>
                </header>
              )}

              <div className="cph-main">
                <section className="cph-card" data-target="session">
                  <div className="cph-card__head">
                    <Ic name="monitor_heart" className="cph-accent" />
                    <span className="cph-name">feature-workbench</span>
                    <span className="cph-pill">
                      <Ic name="clock_loader_40" />
                      <span className="cph-pill__label">In progress</span>
                    </span>
                  </div>
                  {wide && (
                    <div className="cph-card__meta">
                      <Bar w={64} h={6} tone={2} />
                      <Bar w={44} h={6} tone={2} />
                      <Bar w={56} h={6} tone={2} />
                    </div>
                  )}
                </section>

                <Field className="cph-search" placeholder="Search record" leading={<Ic name="search" className="cph-faint" />} />

                <div className="cph-record">
                  {RECORD.map((r) => (
                    <div key={r.text} className="cph-row">
                      <Ic name={r.icon} className={r.tone === 'accent' ? 'cph-accent' : 'cph-amber'} />
                      <span className="cph-row__text">{r.text}</span>
                      <span className="cph-row__when">{r.when}</span>
                    </div>
                  ))}
                  {FILLER.map((f, i) => (
                    <div key={i} className="cph-row cph-row--filler">
                      <Bar w={18} h={18} r={9} tone={1} />
                      <Bar w={f.w} h={7} tone={2} />
                      <Bar w={f.t} h={7} tone={1} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Window>
        )
      }}
    </Stage>
  )
}
