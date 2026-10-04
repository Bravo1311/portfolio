import { skills, evidence } from '../data/cv.js'
import { useEvidence } from './EvidenceContext.jsx'

const Skills = () => {
  const { skill, pick } = useEvidence()

  return (
    <section className="section" id="skills">
      <h2 className="section-title">Skills</h2>
      <p className="skills-hint">Underlined skills link to the work on this page that shows them.</p>
      <div className="skills">
        {skills.map((group) => (
          <div className="skill-group" key={group.label}>
            <h3>{group.label}</h3>
            <ul className="skill-list">
              {group.items.map((item) => (
                <li key={item}>
                  {evidence[item] && evidence[item].length ? (
                    <button
                      type="button"
                      className={skill === item ? 'skill-chip skill-chip-on' : 'skill-chip'}
                      aria-pressed={skill === item}
                      onClick={() => pick(item)}
                    >
                      {item}
                    </button>
                  ) : (
                    <span className="skill-plain">{item}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
