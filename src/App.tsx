import type { ReactNode } from 'react'
import { CLUB } from './content'
import { Hero } from './Hero'
import './App.css'

function Tbd({ value, label }: { value: string; label: string }) {
  return value ? <>{value}</> : <span className="tbd">{label} TBD</span>
}

function MailButton({ className, children }: { className: string; children: ReactNode }) {
  if (!CLUB.email) return <span className={`${className} button--tbd`}>{children}: address TBD</span>
  return <a className={className} href={`mailto:${CLUB.email}`}>{children}</a>
}

const ICON = { width: 32, height: 32, viewBox: '0 0 32 32', 'aria-hidden': true } as const

const DOING = [
  {
    verb: 'Design',
    text: 'Sketch a mechanism, measure it, and work out how the parts fit before anything gets bolted together.',
    icon: <svg {...ICON}><path d="M4 22h24M4 18v8M28 18v8" /><path className="fill" d="M4 22l5-2v4zM28 22l-5-2v4z" /><path d="M8 6h16v8H8z" /></svg>,
  },
  {
    verb: 'Build',
    text: 'Assemble it from VEX metal, motors, wheels and screws, then rebuild it when the first version does not work.',
    icon: <svg {...ICON}><path d="M3 11h26v10H3z" /><path d="M3 13.5h26M3 18.5h26" /><path className="fill" d="M6 15h2v2H6zM12 15h2v2h-2zM18 15h2v2h-2zM24 15h2v2h-2z" /></svg>,
  },
  {
    verb: 'Program',
    text: 'Write the code that turns controller input and sensor readings into motion.',
    icon: <svg {...ICON}><rect x="4" y="5" width="24" height="22" rx="3" /><path d="M13 12l-4 4 4 4M19 12l4 4-4 4" /></svg>,
  },
  {
    verb: 'Drive',
    text: 'Take the controls, test it, find what breaks, and fix it.',
    icon: <svg {...ICON}><circle cx="16" cy="16" r="12" /><circle cx="16" cy="16" r="3" /><path className="center" d="M16 1v30M1 16h30" /></svg>,
  },
]

function Nav() {
  return (
    <nav className="nav" aria-label="Main">
      <a className="wordmark" href="#top">Bearden<span> Robotics</span></a>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#sponsors">Sponsors</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a className="nav-join" href="#join">Join</a></li>
      </ul>
    </nav>
  )
}

function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <h2 id="about-title">Design it. Build it.<br /> Program it. Drive it.</h2>
      <p className="about-lede">
        We are a club at {CLUB.school} that builds robots with VEX hardware. Every robot starts as a sketch and ends on the floor, driving.
      </p>
      <dl className="spec">
        {DOING.map((row) => (
          <div key={row.verb} className="spec-row">
            <dt>{row.icon}<span>{row.verb}</span></dt>
            <dd>{row.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Join() {
  return (
    <section id="join" className="join" aria-labelledby="join-title">
      <div className="section">
        <h2 id="join-title">Join the club.</h2>
        <ol className="join-steps">
          <li>
            <h3>Come to a meeting</h3>
            <p>
              <Tbd value={CLUB.meetingDay} label="Day" />, <Tbd value={CLUB.meetingTime} label="time" />,{' '}
              <Tbd value={CLUB.meetingRoom} label="room" />.
            </p>
          </li>
          <li>
            <h3>Meet the advisor</h3>
            <p><Tbd value={CLUB.advisor} label="Advisor name" /></p>
          </li>
          <li>
            <h3>Tell us you are coming</h3>
            <p>Send a quick email so we can save you a spot at the bench.</p>
          </li>
        </ol>
        <MailButton className="button button--light">Email the club</MailButton>
      </div>
    </section>
  )
}

function Sponsors() {
  return (
    <section id="sponsors" className="section sponsors" aria-labelledby="sponsors-title">
      <h2 id="sponsors-title">Sponsor the build.</h2>
      <p className="about-lede">We do not have any sponsors yet. Your name could be the first one on this sheet.</p>
      <table className="bom slots">
        <caption>Sponsor list</caption>
        <thead>
          <tr><th scope="col">Item</th><th scope="col">Part no.</th><th scope="col">Sponsor</th></tr>
        </thead>
        <tbody>
          {['S01', 'S02', 'S03'].map((s, i) => (
            <tr key={s}><td className="mono">{i + 1}</td><td className="mono">BHR-{s}</td><td>Open</td></tr>
          ))}
        </tbody>
      </table>
      <div className="sponsor-funds">
        <h3>Sponsorship helps pay for</h3>
        <ul>
          <li>VEX parts and replacement motors</li>
          <li>Batteries and chargers</li>
          <li>Tools and hardware</li>
          <li>Field tiles for practice</li>
        </ul>
      </div>
      <MailButton className="button">Ask about sponsoring</MailButton>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <h2 id="contact-title">Contact.</h2>
      <dl className="contact-list">
        <div><dt>Email</dt><dd>{CLUB.email ? <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a> : <Tbd value="" label="Club email" />}</dd></div>
        <div><dt>Advisor</dt><dd><Tbd value={CLUB.advisor} label="Advisor name" /></dd></div>
        <div><dt>Where</dt><dd>{CLUB.school}, {CLUB.city}</dd></div>
        <div><dt>When</dt><dd><Tbd value={CLUB.meetingDay} label="Meeting day" /></dd></div>
      </dl>
    </section>
  )
}

function TitleBlock() {
  const cells = [
    ['Title', 'Bearden High Robotics Club'],
    ['Drawn by', 'Bearden Robotics'],
    ['Location', `${CLUB.school}, ${CLUB.city}`],
    ['Scale', 'NTS'],
    ['Rev', 'A'],
    ['Sheet', '1 of 1'],
  ]
  return (
    <footer className="titleblock">
      <dl>
        {cells.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Join />
        <Sponsors />
        <Contact />
      </main>
      <TitleBlock />
    </>
  )
}
