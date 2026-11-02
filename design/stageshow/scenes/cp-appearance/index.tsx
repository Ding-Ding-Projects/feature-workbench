import { Bar, Connector, Stage, Text, Window } from '../../kit'
import '../../commonplace/look.css'
import './cp-appearance.css'

// Commonplace, Appearance: a still for the "Appearance and layout" feature
// card. The workspace is the product, pinned a gutter from the top and left
// in a quiet browser window and running off the right and bottom; the
// Appearance panel is the tool, in front of the window's top right, over the
// page header's filler and the address bar.
// Light is chosen, Text size sits at 110%, and one short leader drops from
// the slider to the card right under the panel, whose title now reads larger.
//
// Layout: panel over product (gold: panel-annotation). Narrow, the same
// window runs off the right, the focal card at its top, and the panel lies
// across the window's foot in one row (theme tiles beside the slider), the
// larger title carrying the effect without a leader.
//
// Real strings: Appearance, Light, Dark, Text size, 110%, the card the
// setting changes, and its To do neighbor. Everything else is placeholder.

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpa-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

function Card({ focal, text, title = 0, sub, actions = true }: { focal?: boolean; text?: string; title?: number; sub: number; actions?: boolean }) {
  return (
    <div className="cpa-card" data-target={focal ? 'card' : undefined}>
      {focal ? (
        <Text className="cpa-card__title" data-target="card-title">Choose a comfortable text size</Text>
      ) : text ? (
        <Text className="cpa-card__name">{text}</Text>
      ) : (
        <Bar w={title} h={8} r={4} tone={3} />
      )}
      <Bar w={sub} h={6} r={3} tone={2} />
      {actions && (
        <div className="cpa-card__actions">
          <Bar w={58} h={20} r={6} tone={1} />
          <Bar w={40} h={20} r={6} tone={1} />
        </div>
      )}
    </div>
  )
}

function LaneHead({ icon, tone, w }: { icon: string; tone: string; w: number }) {
  return (
    <div className="cpa-lane__head">
      <Icon name={icon} className={`cpa-icon--${tone}`} />
      <Bar w={w} h={7} r={3.5} tone={3} />
      <Bar w={8} h={7} r={3.5} tone={2} className="cpa-lane__count" />
    </div>
  )
}

export default function CommonplaceAppearance() {
  return (
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} className="look-commonplace cpa">
      {(_s, rect, layout) => {
        const compact = layout === 'compact'
        const panel = rect('panel')
        const thumb = rect('thumb')
        const card = rect('card')
        return (
          <>
            <Window url="commonplace.example" urlShape="pill" className="cpa-win">
              <div className="cpa-page">
                {!compact && (
                  <div className="cpa-head">
                    <Bar w={120} h={12} r={6} tone={4} />
                    <Bar w={196} h={7} r={3.5} tone={2} />
                    <div className="cpa-setup">
                      <span className="cpa-setup__steps">
                        <Bar w={16} h={4} r={2} tone={4} />
                        <Bar w={16} h={4} r={2} tone={4} />
                        <Bar w={16} h={4} r={2} tone={2} />
                      </span>
                      <Bar w={150} h={6} r={3} tone={2} />
                    </div>
                  </div>
                )}
                <div className="cpa-board">
                  {!compact && (
                    <div className="cpa-lane" data-tone="todo">
                      <LaneHead icon="radio_button_unchecked" tone="todo" w={40} />
                      <Card text="Export a backup before experimenting" sub={150} />
                      <Card title={124} sub={170} />
                      <Card title={140} sub={160} />
                    </div>
                  )}
                  <div className="cpa-lane" data-tone="progress">
                    <LaneHead icon="clock_loader_40" tone="progress" w={56} />
                    <Card focal sub={132} />
                    <Card title={124} sub={170} />
                  </div>
                </div>
              </div>
            </Window>

            <section className="cpa-panel" data-target="panel">
              <div className="cpa-panel__title cp-display">Appearance</div>
              <div className="cpa-panel__body">
                <div className="cpa-themes">
                  <div className="cpa-theme" data-on>
                    <span className="cpa-theme__preview">
                      <span style={{ background: '#FFFFFF' }} />
                      <span style={{ background: '#FFEEDD' }} />
                      <span style={{ background: '#E8EDFF' }} />
                    </span>
                    <span className="cpa-theme__label">
                      <Icon name="check_circle" className="cpa-icon--accent" />
                      <Text>Light</Text>
                    </span>
                  </div>
                  <div className="cpa-theme">
                    <span className="cpa-theme__preview" data-dark>
                      <span style={{ background: '#172238' }} />
                      <span style={{ background: '#3A2412' }} />
                      <span style={{ background: '#1B2A5C' }} />
                    </span>
                    <span className="cpa-theme__label">
                      <Text>Dark</Text>
                    </span>
                  </div>
                </div>
                <div className="cpa-size">
                  <div className="cpa-size__row">
                    <Text className="cpa-size__label">Text size</Text>
                    <Text className="cpa-size__value">110%</Text>
                  </div>
                  <div className="cpa-slider" aria-hidden="true">
                    <span className="cpa-slider__fill" />
                    <span className="cpa-slider__thumb" data-target="thumb" />
                  </div>
                </div>
              </div>
            </section>

            {!compact && panel.width > 0 && card.width > 0 && (
              <Connector
                show
                from={{ x: thumb.x + thumb.width / 2, y: panel.y + panel.height + 6 }}
                to={{ x: thumb.x + thumb.width / 2, y: card.y - 6 }}
                route="v"
              />
            )}
          </>
        )
      }}
    </Stage>
  )
}
