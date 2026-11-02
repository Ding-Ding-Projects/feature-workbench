import { Avatar, Bar, Collapse, Stage, States, Text, Window, type Act } from '../../kit'
import '../../commonplace/look.css'
import './sites.css'

// Commonplace, Landing site and shared links: someone pastes the landing
// site's link into a chat and it unfolds into a large picture of the real
// product. A feature card that plays once in view.
//
// Beats (a system story, no cursor): the link has just been sent; the chat
// opens room for its preview, which arrives as a skeleton at its own
// geometry; the share picture resolves lane by lane (To do, In progress,
// Done); then its site and title replace their placeholder lines. The
// poster is the finished preview.
//
// Gold: share (satellite focus). The hero context is the landing site in a
// quiet browser, pinned top-left and off the bottom; the satellite that
// carries the story is a generic chat panel straddling the window's right
// edge, over the page's empty right side, never over its heading. The
// preview's picture is the board itself (three lanes, In progress in amber),
// so the card and the page behind tell one thing: this link is that site.
//
// Narrow: the chat alone, pinned top and off the bottom, the preview whole;
// the site behind would only show as a sliver under it.
//
// Real strings: the wordmark and heading behind, the sender, the link, the
// preview's site and title. Everything else is a bar.

const LINK = 'commonplace.example'

type S = { open: boolean; lanes: number; words: boolean }
const initial: S = { open: false, lanes: 0, words: false }
const POSTER: S = { open: true, lanes: 3, words: true }

async function script(a: Act<S>) {
  await a.wait(1200)
  // 1. The chat makes room and the preview arrives whole, still loading
  a.mark('open')
  await a.set({ open: true })
  await a.wait(700)
  // 2. The share picture resolves lane by lane, in reading order
  a.mark('picture')
  for (const n of [1, 2, 3]) {
    await a.set({ lanes: n })
    await a.wait(120)
  }
  await a.wait(420)
  // 3. Its site and title arrive in place of their lines; the result holds
  a.mark('words')
  await a.set({ words: true })
  // Plays once: the payoff holds 2s and the scene stops on it
  await a.wait(2000)
}

function Glyph({ name }: { name: string }) {
  return (
    <span className="material-symbols-rounded cps-icon" aria-hidden="true">
      {name}
    </span>
  )
}

/** The share image: the board as it really looks, at 1200 x 630 proportions */
function Shot({ lanes }: { lanes: number }) {
  return (
    <div className="cps-shot" role="img" aria-label="The Commonplace board" data-ready={lanes > 0 || undefined}>
      <div className="cps-shot__bar">
        <Bar w={34} h={4} tone={4} />
        <span className="cps-shot__new" />
      </div>
      <div className="cps-shot__lanes">
        {[0, 1, 2].map((lane) => (
          <div key={lane} className="cps-lane" data-lane={lane} data-show={lanes > lane || undefined}>
            <Bar w={lane === 1 ? 26 : 18} h={3} tone={3} className="cps-lane__head" />
            <span className="cps-task" />
            {lane !== 2 && <span className="cps-task" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CpSites() {
  return (
    <Stage
      width={560}
      height={380}
      compact={{ below: 560, width: 358, height: 300 }}
      initial={initial}
      poster={POSTER}
      script={script}
      play="once"
      className="look-commonplace cps"
    >
      {(s, _rect, layout) => (
        <>
          {layout === 'wide' && (
          <Window url={LINK} urlShape="pill" className="cps-window">
            <div className="cps-site">
              <div className="cps-nav">
                <Text className="cps-wordmark cp-display">Commonplace</Text>
              </div>
              <div className="cps-hero">
                <Text className="cps-heading cp-display">{'Plan one useful\nnext step.'}</Text>
                <Bar w={150} h={7} tone={2} />
                <Bar w={112} h={7} tone={2} />
              </div>
              <div className="cps-tiles">
                {['add_task', 'translate', 'backup'].map((icon, i) => (
                  <div key={icon} className="cps-tile">
                    <span className="cps-tile__mark">
                      <Glyph name={icon} />
                    </span>
                    <Bar w={[58, 66, 52][i]} h={6} tone={3} />
                    <Bar w={[40, 48, 36][i]} h={5} tone={2} />
                  </div>
                ))}
              </div>
            </div>
          </Window>
          )}

          <section className="cps-chat" data-layout={layout}>
            <div className="cps-chat__head">
              <Glyph name="forum" />
              <Bar w={72} h={7} tone={3} />
            </div>
            <div className="cps-msg">
              <Avatar name="You" tone="accent" size={26} className="cps-avatar" />
              <div className="cps-msg__body">
                <div className="cps-msg__who">
                  <Text className="cps-sender">You</Text>
                  <Bar w={34} h={5} tone={2} />
                </div>
                <Text className="cps-link">{`https://${LINK}`}</Text>
                <Collapse open={s.open} reveal="drop">
                  <div className="cps-preview" data-target="preview">
                    <Shot lanes={s.lanes} />
                    <div className="cps-preview__text">
                      <States
                        align="start"
                        value={s.words ? 'words' : 'lines'}
                        states={{
                          lines: <Bar w={64} h={6} tone={2} />,
                          words: <Text className="cps-preview__site">Commonplace</Text>,
                        }}
                      />
                      <States
                        align="start"
                        value={s.words ? 'words' : 'lines'}
                        states={{
                          lines: <Bar w={150} h={8} tone={3} />,
                          words: <Text className="cps-preview__title">A calm local task workspace</Text>,
                        }}
                      />
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          </section>
        </>
      )}
    </Stage>
  )
}
