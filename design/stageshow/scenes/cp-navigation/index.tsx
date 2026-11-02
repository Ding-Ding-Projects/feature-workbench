import { Bar, Collapse, Field, Popover, Stage, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './cp-navigation.css'

// Commonplace, Navigation: a short loop for the "Navigation, search and
// commands" feature card (v2, Material 3 Expressive). The workspace sits in a
// quiet browser window, pinned with a gutter on three sides and running off
// the bottom (gold: static-card's framing; the command menu borrowed from the
// linear study).
//
// The story, told by the keyboard (no cursor): Ctrl Shift F presses the
// "Find an action" pill (its corners morph on the fast spring) and the
// command palette grows out of it on the default spring while the page dims.
// "text size" is typed; the recent actions that no longer match close up and
// the Text size setting stays first, with its live slider in its row. After
// the hold, Esc closes the palette where it opened and the page comes back
// (the reset, with its cause); the query clears while it is closed.
//
// Real strings: Find an action, Ctrl Shift F, the typed "text size", Text
// size with its 110%, Appearance settings and Try the command palette.

type S = { open: boolean; pressed: boolean; typed: string }

const QUERY = 'text size'
const initial: S = { open: false, pressed: false, typed: '' }
const POSTER: S = { open: true, pressed: false, typed: QUERY }

async function script(a: Act<S>) {
  await a.wait(1000)

  // 1. The shortcut: the trigger presses, the palette grows out of it
  a.mark('open')
  const keys = a.key('ctrl+shift+f')
  await a.wait(120)
  await a.set({ pressed: true })
  await keys
  await a.set({ pressed: false, open: true })
  await a.wait(650)

  // 2. Typing: what no longer matches closes up under the first match
  a.mark('type')
  await a.type('typed', QUERY, { interval: 75 })

  // 3. The payoff holds: the setting itself, live, in the palette
  a.mark('payoff')
  await a.wait(2300)

  // 4. Esc: the palette closes where it opened, the page comes back
  a.mark('close')
  await a.key('escape')
  await a.set({ open: false })
  await a.wait(450)
  await a.snap({ typed: '' }, 'palette')
  await a.wait(700)
}

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpn-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

const LANES = [
  { tone: 'todo', name: 'To do', icon: 'radio_button_unchecked', cards: [[96, 120], [80, 104], [90, 112]] },
  { tone: 'progress', name: 'In progress', icon: 'clock_loader_40', cards: [[88, 112], [72, 100], [84, 108]] },
  { tone: 'done', name: 'Done', icon: 'check_circle', cards: [[84, 108], [94, 116], [76, 98]] },
] as const

function Card({ title, sub, text }: { title: number; sub: number; text?: string }) {
  return (
    <div className="cpn-card">
      {text ? <Text className="cpn-card__title">{text}</Text> : <Bar w={title} h={7} r={3.5} tone={3} />}
      <Bar w={sub} h={5} r={2.5} tone={2} />
    </div>
  )
}

/** A recent action shown before the query narrows the list: wordless filler */
function Recent({ open, icon, w }: { open: boolean; icon: string; w: number }) {
  return (
    <Collapse open={open}>
      <div className="cpn-item cpn-item--recent">
        <Icon name={icon} />
        <Bar w={w} h={7} r={3.5} tone={3} />
      </div>
    </Collapse>
  )
}

export default function CommonplaceNavigation() {
  return (
    <Stage<S>
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="loop"
      keys={{ wide: 'bottom-left', compact: 'top' }}
      className="look-commonplace cpn"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        // The recent actions match nothing past the first letter
        const recent = s.typed.length < 2
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpn-win">
              <div className="cpn-app">
                <header className="cpn-header">
                  <div className="cpn-header__in">
                    <Bar w={compact ? 64 : 92} h={10} r={5} tone={4} />
                    <span className="cpn-find" data-open={s.open || undefined} data-pressed={s.pressed || undefined}>
                      <Icon name="search" />
                      <Text className="cpn-find__label">Find an action</Text>
                      <kbd className="cpn-kbd">Ctrl Shift F</kbd>
                    </span>
                  </div>
                </header>
                <div className="cpn-page">
                  <div className="cpn-title">
                    <Bar w={compact ? 180 : 236} h={14} r={7} tone={4} />
                    <Bar w={compact ? 200 : 300} h={6} r={3} tone={2} />
                  </div>
                  <div className="cpn-board">
                    {(compact ? LANES.slice(0, 2) : LANES).map((lane) => (
                      <div key={lane.tone} className="cpn-lane" data-tone={lane.tone}>
                        <div className="cpn-lane__head">
                          <Icon name={lane.icon} className="cpn-lane__icon" />
                          {/* Only the lane clear of the palette is named; the ones it covers keep a quiet bar */}
                          {lane.tone === 'todo' ? <span className="cpn-lane__name">{lane.name}</span> : <Bar w={44} h={6} r={3} tone={3} />}
                        </div>
                        {lane.cards.map(([t, sub], i) => (
                          <Card key={i} title={t} sub={sub} text={!compact && lane.tone === 'progress' && i === 1 ? 'Try the command palette' : undefined} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="cpn-scrim" data-show={s.open || undefined} />
                </div>
              </div>
            </Window>

            <Popover show={s.open} origin="top right" className="cpn-palette" data-target="palette">
              <Field
                value={s.typed}
                placeholder="Find an action"
                focused={s.open}
                className="cpn-field"
                leading={<Icon name="search" />}
                trailing={<span className="cpn-regex" aria-hidden="true">.*</span>}
              />
              <div className="cpn-results">
                <div className="cpn-item" data-active>
                  <Icon name="format_size" className="cpn-icon--accent" />
                  <Text className="cpn-item__label">Text size</Text>
                  <span className="cpn-slider" aria-hidden="true">
                    <span className="cpn-slider__fill" />
                    <span className="cpn-slider__handle" />
                    <span className="cpn-slider__rest" />
                  </span>
                  <Text className="cpn-item__value">110%</Text>
                </div>
                <div className="cpn-item">
                  <Icon name="palette" />
                  <Text className="cpn-item__label">Appearance settings</Text>
                  <Icon name="arrow_forward" className="cpn-item__end" />
                </div>
                {!compact && <Recent open={recent} icon="add_task" w={92} />}
              </div>
            </Popover>
          </>
        )
      }}
    </Stage>
  )
}
