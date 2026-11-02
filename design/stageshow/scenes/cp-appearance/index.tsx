import { Bar, Stage, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './cp-appearance.css'

// Commonplace, Appearance: a short loop for the "Appearance and layout"
// feature card (v2, Material 3 Expressive). The workspace is the product,
// pinned a gutter from the top and left in a quiet browser window and running
// off the right and bottom. The Appearance panel hangs under the workspace's
// own Settings control, inside the page and clear of the browser chrome, over
// the In progress lane; the To do lane with the card the setting changes
// stays in the open.
//
// The story: the cursor drags the Text size slider from 110% to 130%. The
// handle widens while held, the value beside the label reads live, and the
// task titles grow with it on the default spring. After a hold, the same hand
// drags it back to 110%, which is where the loop began (the reset is the drag).
//
// Layout: panel over product (gold: panel-annotation). Narrow, the same
// window runs off the right; the panel keeps only the Text size control under
// Settings, and the To do lane sits below it with the focal card.
//
// Real strings: Settings, Appearance, Light, Dark, Text size, the value, the
// lane names, the two task titles and their status labels.

type S = {
  /** The live value while the handle is held */
  size: number
  dragging: boolean
  /** Where the handle sits, 0 to 1, following the pointer while held */
  pos: number
}

const MIN = 85
const MAX = 150
const pctOf = (v: number) => (v - MIN) / (MAX - MIN)
const initial: S = { size: 110, dragging: false, pos: pctOf(110) }
const POSTER: S = initial
const REST = { wide: { x: 200, y: 112 }, compact: { x: 150, y: 80 } }

async function script(a: Act<S>) {
  await a.wait(1100)

  const slide = async (to: number, mark: string) => {
    const track = a.rect('track')
    const thumb = a.rect('thumb')
    const y = thumb.y + thumb.height * 0.62
    await a.move({ x: thumb.x + thumb.width / 2, y })
    await a.wait(120)
    a.mark(mark)
    // The press: the handle widens before any travel
    await a.set({ dragging: true })
    await a.wait(260)
    await a.drag(
      { x: track.x + track.width * pctOf(to), y },
      (at) => {
        const pos = Math.max(0, Math.min(1, (at.x - track.x) / track.width))
        const size = Math.round((MIN + pos * (MAX - MIN)) / 5) * 5
        a.put({ size, pos })
      },
      { duration: 1100 },
    )
    // Release: the handle springs to the step and narrows again
    await a.set({ size: to, pos: pctOf(to), dragging: false })
  }

  // 1. Larger: the titles grow with the value
  await slide(130, 'grow')
  // 2. Hold the larger board long enough to read it
  await a.wait(1700)
  // 3. Back to the comfortable size the loop opened on
  await slide(110, 'back')
  await a.move(REST)
  await a.wait(900)
}

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpa-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

const STATUS = ['To do', 'In progress', 'Done'] as const

/** The card's connected status group, the current lane's segment selected */
function Group({ on }: { on: 0 | 1 | 2 }) {
  return (
    <span className="cpa-group">
      {STATUS.map((label, i) => (
        <span key={label} className="cpa-group__seg" data-on={i === on || undefined}>
          {label}
        </span>
      ))}
    </span>
  )
}

function Card({ title, sub, on, focal, group = true }: { title?: string; sub: number; on: 0 | 1 | 2; focal?: boolean; group?: boolean }) {
  return (
    <div className="cpa-card" data-target={focal ? 'card' : undefined}>
      {title ? <Text className="cpa-card__title">{title}</Text> : <Bar w={124} h={8} r={4} tone={3} />}
      <Bar w={sub} h={6} r={3} tone={2} />
      {title ? group && <Group on={on} /> : (
        <span className="cpa-card__filler">
          <Bar w={150} h={24} r={12} tone={1} />
        </span>
      )}
    </div>
  )
}

function Lane({ tone, icon, label, children }: { tone: 'todo' | 'progress'; icon: string; label?: string; children: React.ReactNode }) {
  return (
    <div className="cpa-lane" data-tone={tone}>
      <div className="cpa-lane__head">
        <Icon name={icon} className={`cpa-icon--${tone}`} />
        {label ? <span className="cpa-lane__name">{label}</span> : <Bar w={64} h={7} r={3.5} tone={3} />}
      </div>
      {children}
    </div>
  )
}

export default function CommonplaceAppearance() {
  return (
    <Stage<S>
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="loop"
      cursor={{ at: REST, style: 'arrow' }}
      className="look-commonplace cpa"
    >
      {(s, rect, layout) => {
        const compact = layout === 'compact'
        const pct = s.pos * 100
        // The panel hangs 8px under the Settings control, right edges aligned
        const ctl = rect('settings')
        const panel = ctl.width > 0 ? { top: ctl.y + ctl.height + 8, right: compact ? 16 : 560 - (ctl.x + ctl.width), left: compact ? 16 : undefined } : undefined
        return (
          <div className="cpa-scene" style={{ ['--cpa-scale' as string]: s.size / 100, ['--cpa-pct' as string]: `${pct}%` }}>
            <Window url="commonplace.example" urlShape="pill" className="cpa-win">
              <div className="cpa-page">
                <div className="cpa-head">
                  <span className="cpa-head__title">
                    <Bar w={compact ? 96 : 150} h={12} r={6} tone={4} />
                  </span>
                  <span className="cpa-settings" data-target="settings" data-open>
                    <Icon name="settings" />
                    <span>Settings</span>
                  </span>
                </div>
                {compact && (
                  <div className="cpa-under" aria-hidden="true">
                    <Bar w={220} h={7} r={3.5} tone={2} />
                    <Bar w={160} h={7} r={3.5} tone={2} />
                  </div>
                )}
                <div className="cpa-board">
                  <Lane tone="todo" icon="radio_button_unchecked" label="To do">
                    <Card focal title="Choose a comfortable text size" sub={132} on={0} />
                    {!compact && <Card title="Export a backup before experimenting" sub={150} on={0} group={false} />}
                    <Card sub={120} on={0} />
                  </Lane>
                  {!compact && (
                    <Lane tone="progress" icon="clock_loader_40">
                      <Card sub={150} on={1} />
                      <Card sub={130} on={1} />
                      <Card sub={140} on={1} />
                    </Lane>
                  )}
                </div>
              </div>
            </Window>

            <section
              className="cpa-panel"
              data-target="panel"
              style={panel}
            >
              <div className="cpa-panel__title cp-display">Appearance</div>
              <div className="cpa-panel__body">
                <div className="cpa-themes">
                  <div className="cpa-theme" data-on>
                    <span className="cpa-theme__preview">
                      <span style={{ background: '#DEE1F9' }} />
                      <span style={{ background: '#FFDCBE' }} />
                      <span style={{ background: '#DDE1FF' }} />
                    </span>
                    <span className="cpa-theme__label">
                      <span className="cpa-radio" data-on aria-hidden="true" />
                      <Text>Light</Text>
                    </span>
                  </div>
                  <div className="cpa-theme">
                    <span className="cpa-theme__preview" data-dark>
                      <span style={{ background: '#45464F' }} />
                      <span style={{ background: '#6A3C00' }} />
                      <span style={{ background: '#0035C2' }} />
                    </span>
                    <span className="cpa-theme__label">
                      <span className="cpa-radio" aria-hidden="true" />
                      <Text>Dark</Text>
                    </span>
                  </div>
                </div>
                <div className="cpa-size">
                  <div className="cpa-size__row">
                    <Text className="cpa-size__label">Text size</Text>
                    {/* The value reads live as the handle steps, the way the product's does */}
                    <span className="cpa-size__value">
                      <span data-snap>{`${s.size}%`}</span>
                    </span>
                  </div>
                  <div className="cpa-slider" data-target="track" data-dragging={s.dragging || undefined} aria-hidden="true">
                    <span className="cpa-slider__active" />
                    <span className="cpa-slider__rest" />
                    <span className="cpa-slider__rider">
                      <span className="cpa-slider__handle" data-target="thumb" />
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )
      }}
    </Stage>
  )
}
