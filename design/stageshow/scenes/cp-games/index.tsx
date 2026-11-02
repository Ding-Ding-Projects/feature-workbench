import { Bar, Row, Stage, Text, Window } from '../../kit'
import '../../commonplace/look.css'
import './games.css'

// Commonplace, Games: a feature-card still copied from overlap. The shared
// model integration ledger sits in front as a chromeless card; behind it, a
// quiet game editor shows where each shared model was placed on the world
// map. The card crosses the editor's left edge and stops short of its
// sidebar line, covering only the explorer tree (filler), never the map.
//
// The two surfaces tell one fact: the Ferris wheel is placed and used (its
// map tile is the one lit in the accent), the harbour crane is not placed
// yet (its map slot is an empty dashed amber outline) and the ledger keeps
// it listed as pending, not counted.
//
// Real strings: the ledger's title and count, two model names and their
// evidence states. No game company's name or mark anywhere.

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
    <Stage width={560} height={380} compact={{ below: 560, width: 358, height: 300 }} initial={{}} className="look-commonplace cpg">
      {(_s, _rect, layout) => {
        const compact = layout === 'compact'
        return (
          <>
            <Window
              className="cpg-win"
              sidebarWidth={compact ? 96 : 150}
              sidebar={
                <div className="cpg-tree">
                  {TREE.map((t, i) => (
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
                <span className="cpg-tile cpg-tile--on cpg-t1">
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
                <span className="cpg-tile cpg-tile--pending cpg-t5">
                  <Icon name="precision_manufacturing" className="cpg-icon--amber" />
                </span>
                <span className="cpg-road cpg-road--h" />
                <span className="cpg-road cpg-road--v" />
              </div>
            </Window>

            <section className="cpg-card">
              <div className="cpg-head">
                <Text className="cpg-title">Model integration ledger</Text>
                <Text className="cpg-count">5 of 6 models in use</Text>
              </div>
              <Row
                pad={0}
                className="cpg-row"
                lead={<Icon name="verified" className="cpg-icon--accent" />}
                title={<Text className="cpg-name">Ferris wheel</Text>}
                subtitle={<Text className="cpg-evidence">Ride screenshot</Text>}
              />
              <Row
                pad={0}
                className="cpg-row"
                lead={<Icon name="verified" className="cpg-icon--accent" />}
                title={<Bar w={compact ? 60 : 78} h={8} r={4} tone={3} />}
                subtitle={<Bar w={compact ? 76 : 104} h={6} r={3} tone={2} />}
              />
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
