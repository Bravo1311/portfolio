import Header from './components/Header.jsx'
import Nav from './components/Nav.jsx'
import DepthHint from './components/DepthControl.jsx'
import Track from './components/Track.jsx'
import Direction from './components/Direction.jsx'
import Plain from './components/Plain.jsx'
import Skills from './components/Skills.jsx'
import Footer from './components/Footer.jsx'
import { DepthProvider } from './components/DepthContext.jsx'
import { EvidenceProvider } from './components/EvidenceContext.jsx'
import EvidenceBar from './components/EvidenceBar.jsx'
import { tracks, experience, education } from './data/cv.js'

const App = () => (
  <DepthProvider>
    <EvidenceProvider>
    <Header />
    <Nav />

    <div className="wrap">
      <DepthHint />
    </div>

    <main className="spine">
      {tracks.map((track, i) => (
        <Track key={track.id} track={track} index={i + 1} />
      ))}
    </main>

    <Direction />

    <div className="wrap">
      <Plain id="experience" title="Experience" entries={experience} variant="timeline" />
      <Plain id="education" title="Education" entries={education} variant="pair" />
      <Skills />
      <Footer />
    </div>
    <EvidenceBar />
    </EvidenceProvider>
  </DepthProvider>
)

export default App
