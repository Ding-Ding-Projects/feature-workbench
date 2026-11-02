import { Bar, Count, Roll, Row, Stage, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './games.css'

// Commonplace, Games (v2, Material 3 Expressive): a feature-card scene
// copied from overlap, looping. The shared model
// integration ledger sits in front as a chromeless card; behind it, a quiet
// game editor shows where each shared model is placed on the world map. The
// card crosses the editor's left edge and stops short of its sidebar line,
// covering only the explorer tree (filler), never the map.
//
// What the system does, three beats, no cursor: the Ferris wheel is placed
// into its waiting slot on the map; its ledger row turns from pending to
// verified with its evidence, a ride screenshot; the count rolls from 4 to
// 5 of 6. The payoff holds, then Undo (its keycaps shown) takes the
// placement back and the ledger follows, which is the opening frame. The harbour crane is still not placed, so its slot stays a dashed
// outline and the ledger keeps it listed as pending, not counted. The payoff
// is the poster.

type S = { placed: boolean; verified: boolean; used: number }

const initial: S = { placed: false, verified: false, used: 4 }
const POSTER: S = { placed: true, verified: true, used: 5 }

async function script(a: Act<S>) {
  await a.wait(900)
  // 1. The Ferris wheel lands in its slot on the map
  a.mark('place')
  await a.set({ placed: true })
  await a.wait(560)
  // 2. The ledger answers: the row is verified, with its evidence
  a.mark('verify')
  await a.set({ verified: true })
  await a.wait(380)
  // 3. And counted
  a.mark('count')
  await a.set({ used: 5 })
  await a.wait(2200)

  // The reset, with its seen cause: Undo takes the placement back, and the
  // ledger follows it (the tile lifts out, the row is pending again, 5 to 4)
  a.mark('undo')
  await a.key('ctrl+z')
  await a.set({ placed: false })
  await a.wait(300)
  await a.set({ verified: false })
  await a.wait(300)
  await a.set({ used: 4 })
  await a.wait(1100)
}

function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-rounded cpg-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      {name}
    </span>
  )
}

const TREE: { indent: boolean; w: number; icon: string }[] = [
  { indent: false, w: 54, icon: 'public' },
  { indent: true, w: 62, icon: 'deployed_code' },
  { indent: true, w: 46, icon: 'deployed_code' },
  { indent: true, w: 70, icon: 'deployed_code' },
  { indent: true, w: 52, icon: 'deployed_code' },
  { indent: false, w: 48, icon: 'folder' },
  { indent: true, w: 58, icon: 'deployed_code' },
  { indent: true, w: 44, icon: 'deployed_code' },
  { indent: false, w: 60, icon: 'folder' },
  { indent: true, w: 50, icon: 'deployed_code' },
  { indent: true, w: 66, icon: 'deployed_code' },
]

export default function CpGames() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      keys={{ wide: 'bottom-right', compact: 'bottom-right' }}
      className="look-commonplace cpg"
    >
      {(s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window
              className="cpg-win"
              sidebarWidth={compact ? 96 : 150}
              sidebar={
                <div className="cpg-tree">
                  {/* Only as many rows as the ledger card covers, so no glyph peeks half cut below it */}
                  {TREE.slice(0, compact ? 7 : 8).map((t, i) => (
                    <div key={i} className="cpg-tree-row" data-indent={t.indent || undefined}>
                      <Icon name={t.icon} className="cpg-icon--faint" />
                      <Bar w={compact ? Math.round(t.w * 0.6) : t.w} h={7} r={4} tone={i === 1 ? 4 : 2} />
                    </div>
                  ))}
                </div>
              }
              lead={<Bar w={compact ? 48 : 72} h={8} r={4} tone={3} />}
            >
              <div className="cpg-map">
                {/* The Ferris wheel's slot waits as a dashed outline, then the tile lands in it */}
                <span className="cpg-tile cpg-tile--slot cpg-t1" data-gone={s.placed || undefined}>
                  <Icon name="attractions" className="cpg-icon--amber" />
                </span>
                <span className="cpg-tile cpg-tile--on cpg-t1" data-placed={s.placed || undefined}>
                  <Icon name="attractions" />
                </span>
                <span className="cpg-tile cpg-t2">
                  <Icon name="bakery_dining" className="cpg-icon--faint" />
                </span>
                <span className="cpg-tile cpg-t3">
                  <Icon name="local_shipping" className="cpg-icon--faint" />
                </span>
                <span className="cpg-tile cpg-t4">
                  <Icon name="storefront" className="cpg-icon--faint" />
                </span>
                <span className="cpg-tile cpg-tile--slot cpg-t5">
                  <Icon name="precision_manufacturing" className="cpg-icon--amber" />
                </span>
                <span className="cpg-road cpg-road--h" />
                <span className="cpg-road cpg-road--v" />
              </div>
            </Window>

            <section className="cpg-card">
              <div className="cpg-head">
                <Text className="cpg-title">Model integration ledger</Text>
                <span className="cpg-count">
                  <Count value={s.used} duration={600} />
                  <span className="cpg-count__rest">of 6 models in use</span>
                </span>
              </div>
              <Row
                pad={0}
                className="cpg-row cpg-row--story"
                data-verified={s.verified || undefined}
                lead={
                  <span className="cpg-status" data-verified={s.verified || undefined}>
                    <Icon name="pending" className="cpg-icon--amber cpg-status__pending" />
                    <Icon name="verified" className="cpg-icon--accent cpg-status__verified" />
                  </span>
                }
                title={<Text className="cpg-name">Ferris wheel</Text>}
                subtitle={
                  <span className="cpg-evidence" data-verified={s.verified || undefined}>
                    <Roll variant="fade">{s.verified ? 'Ride screenshot' : 'Not counted'}</Roll>
                  </span>
                }
              />
              {/* Narrow, the card drops this filler row so its top clears the window's lights */}
              {!compact && <Row
                pad={0}
                className="cpg-row"
                lead={<Icon name="verified" className="cpg-icon--accent" />}
                title={<Bar w={compact ? 60 : 78} h={8} r={4} tone={3} />}
                subtitle={<Bar w={compact ? 76 : 104} h={6} r={3} tone={2} />}
              />}
              <Row
                pad={0}
                className="cpg-row cpg-row--pending"
                lead={<Icon name="pending" className="cpg-icon--amber" />}
                title={<Text className="cpg-name">Harbour crane</Text>}
                subtitle={<Text className="cpg-evidence cpg-evidence--pending">Not counted</Text>}
              />
            </section>
          </>
        )
      }}
    </Stage>
  )
}
