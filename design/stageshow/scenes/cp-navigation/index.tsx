import { Bar, Field, Popover, Stage, Text, Window } from '../../kit'
import '../../commonplace/look.css'
import './cp-navigation.css'

// Commonplace, Navigation: a still for the "Navigation, search and commands"
// feature card. The workspace sits in a quiet browser window, pinned with a
// gutter on three sides and running off the bottom (gold: static-card's
// framing). The header's "Find an action" trigger, with its Ctrl Shift F
// keycap, is pressed, and the command palette hangs from it (the interaction
// borrowed from the linear study's command menu): "text size" is typed, and
// the first result is the Text size setting itself, a live slider in its row,
// highlighted. The board under the palette is quiet filler.
//
// Narrow: the same window, closer, still off the right; the palette keeps its
// two matching results.
//
// Real strings: Find an action, Ctrl Shift F, the typed "text size", Text
// size with its 110%, Appearance settings and Try the command palette.

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpn-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

const LANES = [
  { tone: 'todo', icon: 'radio_button_unchecked', cards: [[96, 120], [80, 104], [90, 112]] },
  { tone: 'progress', icon: 'clock_loader_40', cards: [[88, 112], [72, 100], [84, 108]] },
  { tone: 'done', icon: 'check_circle', cards: [[84, 108], [94, 116], [76, 98]] },
] as const

function Card({ title, sub, text }: { title: number; sub: number; text?: string }) {
  return (
    <div className="cpn-card">
      {text ? <Text className="cpn-card__title">{text}</Text> : <Bar w={title} h={7} r={3.5} tone={3} />}
      <Bar w={sub} h={5} r={2.5} tone={2} />
    </div>
  )
}

export default function CommonplaceNavigation() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpn">
      {(_s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpn-win">
              <div className="cpn-app">
                <header className="cpn-header">
                  <div className="cpn-header__in">
                    <Bar w={compact ? 64 : 92} h={10} r={5} tone={4} />
                    {!compact && (
                      <span className="cpn-switch" aria-hidden="true">
                        <Bar w={44} h={6} r={3} tone={3} />
                        <Bar w={44} h={6} r={3} tone={2} />
                      </span>
                    )}
                    <span className="cpn-find" data-open>
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
                          <Bar w={44} h={6} r={3} tone={3} />
                        </div>
                        {lane.cards.map(([t, s], i) => (
                          <Card key={i} title={t} sub={s} text={!compact && lane.tone === 'progress' && i === 1 ? 'Try the command palette' : undefined} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="cpn-scrim" />
                </div>
              </div>
            </Window>

            <Popover show origin="top right" className="cpn-palette">
              <Field
                value="text size"
                focused
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
                    <span className="cpn-slider__thumb" />
                  </span>
                  <Text className="cpn-item__value">110%</Text>
                </div>
                <div className="cpn-item">
                  <Icon name="palette" />
                  <Text className="cpn-item__label">Appearance settings</Text>
                  <Icon name="arrow_forward" className="cpn-item__end" />
                </div>
              </div>
            </Popover>
          </>
        )
      }}
    </Stage>
  )
}
