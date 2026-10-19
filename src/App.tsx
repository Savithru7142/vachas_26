import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  CalendarDays, Menu, Pause, Play, Search, Sparkles, X,
} from 'lucide-react'
import {
  Link, NavLink, Route, Routes, useLocation, useParams,
} from 'react-router-dom'
import { site, vangmayaUrl } from './data/site'
import { wings } from './data/wings'
import { team } from './data/team'
import { events } from './data/events'
import { publications } from './data/publications'
import { blogs } from './data/blogs'
import { gallery } from './data/gallery'
import { achievements } from './data/achievements'
import { recruitment } from './data/recruitment'
import { contactEmail, socialLinks } from './data/socialLinks'
import type { Achievement, BlogPost, ClubEvent, GalleryImage, Publication, RecruitmentStatus, TeamMember, Wing, WingPhoto } from './data/types'

const navigation = [
  ['Home', '/'],
  ['Wings', '/wings'],
  ['Publications', '/publications'],
  ['Blogs', '/blogs'],
  ['Gallery', '/gallery'],
  ['About', '/about'],
  ['Contact', '/contact'],
]

function App() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const pathParts = location.pathname.split('/').filter(Boolean)
    const page = location.pathname === '/' ? 'Home' : pathParts[pathParts.length - 1] ?? 'Home'
    document.title = `${page.charAt(0).toUpperCase()}${page.slice(1)} — THE VACHAS`
  }, [location.pathname])

  return (
    <div className="dark-preview">
      <header className="site-header">
        <Link className="wordmark" to="/" aria-label="Vachas Literature Club home">
          <img src="/vachas-logo.png" alt="" />
          <span className="wordmark-copy"><strong>Vachas</strong><small>THE LITERATURE CLUB</small></span>
        </Link>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navigation.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>
          ))}
          <a className="nav-vangmaya" href={vangmayaUrl} target="_blank" rel="noreferrer">
            Vāṅmaya AI <Sparkles size={14} aria-hidden="true" />
          </a>
          <NavLink to="/join" className="nav-join">Join us <ArrowUpRight size={15} /></NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/wings" element={<WingsPage />} />
          <Route path="/wings/:slug" element={<WingDetail />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/publications/:slug" element={<PublicationDetail />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description: string }) {
  return (
    <section className="page-intro wrap">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function SectionHeading({ eyebrow, title, link, to }: { eyebrow: string; title: string; link?: string; to?: string }) {
  return (
    <div className="section-heading">
      <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>
      {link && to && <Link className="text-link" to={to}>{link}<ArrowUpRight size={16} /></Link>}
    </div>
  )
}

function StatusNote({ children }: { children: React.ReactNode }) {
  return <div className="status-note">{children}</div>
}

function EmptyState({ icon = 'archive', title, description }: { icon?: 'archive' | 'book' | 'calendar'; title: string; description: string }) {
  const Icon = icon === 'book' ? BookOpen : icon === 'calendar' ? CalendarDays : ArrowDown
  return <div className="empty-state"><Icon size={22} strokeWidth={1.4} /><h3>{title}</h3><p>{description}</p></div>
}

function ImageWithFallback({ src, alt, className = '', loading = 'lazy' }: { src: string; alt: string; className?: string; loading?: 'eager' | 'lazy' }) {
  const [failed, setFailed] = useState(false)
  const safeSrc = getSafeContentUrl(src)
  if (failed || !safeSrc) return <div className={`image-fallback ${className}`} role="img" aria-label={`${alt} — image unavailable`}>Image unavailable</div>
  return <img className={className} src={safeSrc} alt={alt} loading={loading} onError={() => setFailed(true)} />
}

function getSafeContentUrl(value?: string) {
  if (!value?.trim()) return undefined
  try {
    const url = new URL(value, window.location.origin)
    const isLocalPath = value.startsWith('/') && !value.startsWith('//') && url.origin === window.location.origin
    return isLocalPath || url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
}

function Home() {
  const featuredEvents = events.filter((event) => event.featured)
  const featuredPublications = publications.filter((publication) => publication.featured)
  const slides = useMemo(() => gallery.filter((item) => item.image), [])
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    if (slides.length < 2 || paused) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000)
    return () => window.clearInterval(timer)
  }, [slides.length, paused])

  const currentSlide = slides[slide]
  const changeSlide = (next: number) => {
    setSlide((next + slides.length) % slides.length)
    setPaused(true)
  }
  return (
    <>
      <section className="hero wrap">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="hero-overline">A LITERARY COMMUNITY</p>
            <h1>{site.heroTitle.split(' ').slice(0, 2).join(' ')}<br />{site.heroTitle.split(' ').slice(2).join(' ')}</h1>
            <p className="hero-intro">{site.heroIntroduction}</p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/wings">Explore <ArrowRight size={16} /></Link>
              <Link className="hero-secondary-link" to="/publications">Our publications <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className="hero-art-frame">
            <img className="hero-art" src="/assets/vachas-writing.svg" alt="Engraved-style illustration of a handwritten page, quill pen, ink bottle, and stacked books on a desk" loading="eager" />
          </div>
        </div>
        <div className="hero-side-label" aria-hidden="true">THE VACHAS LITERATURE CLUB</div>
        <a className="scroll-cue" href="#explore" aria-label="Scroll down to explore"><ArrowDown size={18} /><span>SCROLL<br />DOWN</span></a>
      </section>

      <section className="intro-band" id="explore">
        <div className="wrap intro-band-inner">
          <Eyebrow>THE CLUB</Eyebrow>
          <p>A poem gives a feeling its first words.<br /><em>A story makes room for every voice.</em></p>
          <Link className="text-link" to="/about">Discover VACHAS <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <section className="vangmaya-feature" aria-labelledby="vangmaya-title">
        <div className="wrap vangmaya-feature-inner">
          <div className="vangmaya-copy">
            <span className="vangmaya-label"><Sparkles size={14} aria-hidden="true" /> VACHAS AI WORKSPACE</span>
            <h2 id="vangmaya-title">Meet <em>Vāṅmaya.</em></h2>
            <p>Shape your writing with Vyāsa. Put your ideas to the test with Gautama. A thoughtful AI workspace built for the way VACHAS creates and thinks.</p>
          </div>
          <a className="button vangmaya-button" href={vangmayaUrl} target="_blank" rel="noreferrer">
            Explore Vāṅmaya <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="section wrap">
        <SectionHeading eyebrow="01 / THE CLUB" title="A place for words to find their voice." link="About the club" to="/about" />
        <div className="about-preview">
          <p className="large-copy">{site.mission}</p>
          <div className="about-aside"><p>{site.editorNote}</p><Link className="text-link" to="/about">Read our story <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="wrap">
          <SectionHeading eyebrow="02 / OUR WINGS" title="Different voices. Shared purpose." link="Explore all wings" to="/wings" />
          <div className="wing-grid">
            {wings.slice(0, 3).map((wing, index) => <WingCard wing={wing} index={index} key={wing.slug} />)}
          </div>
        </div>
      </section>

      <section className="section wrap">
        <SectionHeading eyebrow="03 / VACHAS IN ACTION" title="Moments from our archive." link="Visit the gallery" to="/gallery" />
        {currentSlide ? (
          <div className="feature-slide" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="VACHAS in action" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false) }} onKeyDown={(event) => { if (event.key === 'ArrowRight') changeSlide(slide + 1); if (event.key === 'ArrowLeft') changeSlide(slide - 1) }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; setPaused(true) }} onTouchEnd={(event) => { if (touchStart.current === null) return; const delta = touchStart.current - event.changedTouches[0].clientX; if (Math.abs(delta) > 45) changeSlide(slide + (delta > 0 ? 1 : -1)); touchStart.current = null }}>
            <ImageWithFallback src={currentSlide.image} alt={currentSlide.alt} loading="eager" />
            <div className="feature-caption"><span>{currentSlide.category}</span><h3>{currentSlide.caption}</h3>{currentSlide.event && <p>{currentSlide.event}</p>}</div>
            {slides.length > 1 && <div className="slide-controls"><button aria-label="Previous image" onClick={() => changeSlide(slide - 1)}><ArrowLeft /></button><span>{String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span><button aria-label="Next image" onClick={() => changeSlide(slide + 1)}><ArrowRight /></button><button aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</button></div>}
            {slides.length > 1 && <div className="slide-dots" aria-label="Choose slide">{slides.map((item, index) => <button key={item.image} className={index === slide ? 'current' : ''} aria-label={`Show slide ${index + 1}`} aria-current={index === slide ? 'true' : undefined} onClick={() => changeSlide(index)} />)}</div>}
          </div>
        ) : <EmptyState title="The archive is taking shape" description="Event photographs will appear here once the club editor adds approved images to the gallery records." />}
      </section>

      <section className="section section-paper">
        <div className="wrap">
          <SectionHeading eyebrow="04 / THE PROGRAMME" title="Gatherings, ideas, and making." link="All events" to="/events" />
          {featuredEvents.length ? <div className="event-grid">{featuredEvents.slice(0, 3).map((event) => <EventCard event={event} key={event.slug} />)}</div> : <EmptyState icon="calendar" title="Events will be announced here" description="The archive is ready for verified event details, dates, posters, and photographs." />}
        </div>
      </section>

      <section className="section wrap">
        <SectionHeading eyebrow="05 / IN PRINT" title="A shelf of our own." link="Explore publications" to="/publications" />
        {featuredPublications.length ? <div className="publication-grid">{featuredPublications.slice(0, 3).map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div> : <EmptyState icon="book" title="Publications belong here" description="Books, anthologies, magazines, and other approved works will be added as the editor confirms them." />}
      </section>

      {blogs.length > 0 && <section className="section wrap">
        <SectionHeading eyebrow="06 / FROM THE JOURNAL" title="Notes, ideas, and stories." link="Read all blogs" to="/blogs" />
        <div className="event-grid">{blogs.slice(0, 3).map((post) => <BlogCard post={post} key={post.slug} />)}</div>
      </section>}

      <section className="section section-ink">
        <div className="wrap">
          <SectionHeading eyebrow="06 / THE PEOPLE" title="Made by many voices." link="Meet the team" to="/team" />
          {team.length ? <div className="team-grid">{team.filter((member) => member.active).slice(0, 4).map((member) => <MemberCard member={member} key={member.slug} />)}</div> : <EmptyState title="The team directory is ready" description="No member profiles are published yet. Add confirmed names, public-facing roles, and approved portraits in the team data file." />}
        </div>
      </section>

      {achievements.length > 0 && <section className="section wrap"><SectionHeading eyebrow="07 / MILESTONES" title="A record of what we make together." link="Achievements" to="/achievements" /><AchievementList items={achievements.slice(0, 3)} /></section>}
      <QuoteBand />
    </>
  )
}

function About() {
  const coreTeam = team
    .filter((member) => member.active && member.category === 'Core Team')
    .sort((a, b) => a.order - b.order)

  return <>
    <PageIntro eyebrow="ABOUT THE CLUB" title={<>A literary home<br /><em>for many voices.</em></>} description={site.introduction} />
    <section className="section section-paper"><div className="wrap split-section"><div><Eyebrow>OUR PURPOSE</Eyebrow><h2>Why we gather</h2></div><div className="prose"><p>{site.mission}</p><p>{site.editorNote}</p></div></div></section>
    <section className="section wrap split-section"><div><Eyebrow>A SHARED HORIZON</Eyebrow><h2>What we hope to make</h2></div><div className="prose"><p>{site.vision}</p><div className="value-list">{site.values.map((value) => <span key={value}>{value}</span>)}</div></div></section>
    <section className="section section-paper"><div className="wrap"><SectionHeading eyebrow="WHAT WE DO" title="Ways to take part."/><div className="activity-grid">{site.activities.map((activity, i) => <div className="activity-item" key={activity}><span>0{i + 1}</span><p>{activity}</p></div>)}</div><Link className="text-link margin-top" to="/wings">Discover the wings <ArrowUpRight size={15} /></Link></div></section>
    {coreTeam.length > 0 && <section className="section section-ink"><div className="wrap"><SectionHeading eyebrow="THE PEOPLE" title="Meet the Core Team." link="View the team" to="/team" /><div className="team-grid">{coreTeam.map((member) => <MemberCard member={member} key={member.slug} />)}</div></div></section>}
    <JoinCallout />
  </>
}

function WingsPage() {
  const [category, setCategory] = useState('All')
  const categories = ['All', ...Array.from(new Set(wings.map((wing) => wing.category)))]
  const visible = category === 'All' ? wings : wings.filter((wing) => wing.category === category)
  return <>
    <PageIntro eyebrow="THE COLLECTIVE" title={<>One club.<br /><em>Many ways in.</em></>} description="Explore the language and operational wings of VACHAS. Each contributes a different perspective to the club’s shared work." />
    <section className="section section-paper"><div className="wrap">
      <div className="filter-row"><div className="filter-buttons" aria-label="Filter wings">{categories.map((item) => <button key={item} className={category === item ? 'filter-button selected' : 'filter-button'} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="result-count">{visible.length} wings</span></div>
      <div className="wing-grid">{visible.map((wing, index) => <WingCard wing={wing} index={index} key={wing.slug} />)}</div>
      <StatusNote>Wing names follow the categories in the project brief. These are starter descriptions; the club editor should confirm and refine them.</StatusNote>
    </div></section>
  </>
}

function WingCard({ wing, index }: { wing: Wing; index: number }) {
  return <Link className="wing-card" to={`/wings/${wing.slug}`}><span className="card-index">0{index + 1} <span>{wing.category}</span></span><h3>{wing.name}</h3><p>{wing.summary}</p><span className="card-arrow"><ArrowUpRight size={18} /></span></Link>
}

function WingDetail() {
  const { slug } = useParams()
  const wing = wings.find((item) => item.slug === slug)
  if (!wing) return <NotFound />
  return <>
    <PageIntro eyebrow={`${wing.category.toUpperCase()} WING`} title={<>{wing.name}<br /><em>at VACHAS.</em></>} description={wing.summary} />
    <section className="section section-paper"><div className="wrap split-section"><div><Eyebrow>THE PURPOSE</Eyebrow><h2>What this wing brings</h2></div><div className="prose"><p>{wing.purpose}</p><StatusNote>Starter description — please confirm with the club editor.</StatusNote></div></div></section>
    <section className="section wrap split-section"><div><Eyebrow>THE WORK</Eyebrow><h2>Ways to contribute</h2></div><div className="prose"><ul className="editorial-list">{wing.responsibilities.map((task) => <li key={task}>{task}</li>)}</ul><p className="muted-copy">Coordinator and team details will be added when confirmed.</p><RecruitmentText status={wing.recruitment} /></div></section>
    {wing.photos && wing.photos.length > 0 && <section className="section section-paper"><div className="wrap"><SectionHeading eyebrow={`${wing.name.toUpperCase()} / PHOTOGRAPHS`} title="Moments from the wing."/><PhotoGallery images={wing.photos} /></div></section>}
    <JoinCallout />
  </>
}

function TeamPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [wingFilter, setWingFilter] = useState('All')
  const categories = ['All', ...Array.from(new Set(team.map((member) => member.category)))]
  const memberWings = ['All', ...Array.from(new Set(team.flatMap((member) => member.wing ? [member.wing] : [])))]
  const visible = team.filter((member) => member.active && member.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || member.category === filter) && (wingFilter === 'All' || member.wing === wingFilter)).sort((a, b) => a.order - b.order)
  return <>
    <PageIntro eyebrow="THE PEOPLE" title={<>A club is made<br /><em>of its voices.</em></>} description="Meet the people who shape VACHAS. Member profiles are published only when names and public-facing details have been confirmed." />
    <section className="section section-ink"><div className="wrap">
      <div className="filter-stack filter-row"><div className="filter-buttons">{categories.map((item) => <button key={item} className={filter === item ? 'filter-button selected' : 'filter-button'} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="filter-buttons">{memberWings.map((item) => <button key={item} className={wingFilter === item ? 'filter-button selected' : 'filter-button'} onClick={() => setWingFilter(item)}>{item}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names" aria-label="Search team members" /></label></div>
      {visible.length ? <div className="team-grid">{visible.map((member) => <MemberCard member={member} key={member.slug} />)}</div> : <EmptyState title="Member profiles are not published yet" description="The editor can add confirmed names, designations, wings, biographies, and approved portraits to the team data file." />}
    </div></section>
  </>
}

function MemberCard({ member }: { member: TeamMember }) {
  return <article className="member-card">
    {member.image ? <ImageWithFallback className="member-image" src={member.image} alt={member.name} /> : <div className="member-placeholder" aria-hidden="true">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
    <div className="member-meta"><span>{member.designation}</span><h3>{member.name}</h3><p>{member.wing ?? member.category}</p></div>
  </article>
}

function EventsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [wing, setWing] = useState('All')
  const [year, setYear] = useState('All')
  const categories = ['All', ...Array.from(new Set(events.map((event) => event.category)))]
  const wings = ['All', ...Array.from(new Set(events.flatMap((event) => event.wing ? [event.wing] : [])))]
  const years = ['All', ...Array.from(new Set(events.flatMap((event) => event.date ? [event.date.slice(0, 4)] : []))).sort().reverse()]
  const filtered = events.filter((event) => event.title.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || event.category === category) && (wing === 'All' || event.wing === wing) && (year === 'All' || event.date?.slice(0, 4) === year))
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = filtered.filter((event) => event.date && event.date >= today)
  const past = filtered.filter((event) => !event.date || event.date < today)
  return <>
    <PageIntro eyebrow="THE ARCHIVE / EVENTS" title={<>Gather. Make.<br /><em>Remember.</em></>} description="A record of the events, conversations, and creative work of THE VACHAS." />
    <section className="section section-paper"><div className="wrap">
      <div className="filter-stack filter-row"><div className="filter-buttons">{categories.map((item) => <button key={item} className={category === item ? 'filter-button selected' : 'filter-button'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="filter-buttons">{wings.map((item) => <button key={item} className={wing === item ? 'filter-button selected' : 'filter-button'} onClick={() => setWing(item)}>{item}</button>)}</div><div className="filter-buttons">{years.map((item) => <button key={item} className={year === item ? 'filter-button selected' : 'filter-button'} onClick={() => setYear(item)}>{item === 'All' ? 'All years' : item}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an event" aria-label="Search events" /></label></div>
      {upcoming.length > 0 && <><h2 className="subsection-title">Coming up</h2><div className="event-grid">{upcoming.map((event) => <EventCard event={event} key={event.slug} />)}</div></>}
      <h2 className="subsection-title">From the archive</h2>
      {past.length ? <div className="event-grid">{past.map((event) => <EventCard event={event} key={event.slug} />)}</div> : <EmptyState icon="calendar" title="The event archive is ready" description="No verified events have been added yet. Add confirmed dates, descriptions, and approved event imagery to the events data file." />}
    </div></section>
  </>
}

function EventCard({ event }: { event: ClubEvent }) {
  return <Link className="event-card" to={`/events/${event.slug}`}>
    {event.poster ? <ImageWithFallback className="event-card-image" src={event.poster} alt={`Poster for ${event.title}`} /> : <div className="event-placeholder"><CalendarDays size={26} strokeWidth={1.1} /><span>{event.category}</span></div>}
    <div className="event-card-info"><div className="event-date">{event.date ? formatDate(event.date) : 'Date to be announced'}{event.wing && <span>{event.wing}</span>}</div><h3>{event.title}</h3><p>{event.description}</p><span className="text-link">Event details <ArrowUpRight size={15} /></span></div>
  </Link>
}

function EventDetail() {
  const { slug } = useParams()
  const event = events.find((item) => item.slug === slug)
  if (!event) return <NotFound />
  return <>
    <PageIntro eyebrow={`EVENT / ${event.category}`} title={<>{event.title}<br /><em>at VACHAS.</em></>} description={event.description} />
    <section className="section section-paper"><div className="wrap detail-layout">{event.poster && <ImageWithFallback className="detail-image" src={event.poster} alt={`Poster for ${event.title}`} />}<div className="prose detail-facts"><p><strong>Date</strong>{event.date ? formatDate(event.date) : 'To be announced'}{event.endDate ? ` – ${formatDate(event.endDate)}` : ''}</p>{event.venue && <p><strong>Venue</strong>{event.venue}</p>}{event.wing && <p><strong>Organized by</strong>{event.wing}</p>}{event.highlights && <><strong>Highlights</strong><ul className="editorial-list">{event.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></>}{getSafeContentUrl(event.externalUrl) && <a className="text-link" href={getSafeContentUrl(event.externalUrl)} target="_blank" rel="noreferrer">More about this event <ArrowUpRight size={15} /></a>}</div></div></section>
    {event.photos.length > 0 && <section className="section wrap"><div className="gallery-grid">{event.photos.map((photo) => <ImageWithFallback src={photo} alt={`${event.title} photograph`} key={photo} />)}</div></section>}
  </>
}

function PublicationsPage() {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('All')
  const [type, setType] = useState('All')
  const [year, setYear] = useState('All')
  const languages = ['All', ...Array.from(new Set(publications.flatMap((item) => item.language ? [item.language] : [])))]
  const types = ['All', ...Array.from(new Set(publications.map((item) => item.type)))]
  const years = ['All', ...Array.from(new Set(publications.flatMap((item) => item.year ? [String(item.year)] : []))).sort().reverse()]
  const visible = publications.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) && (language === 'All' || item.language === language) && (type === 'All' || item.type === type) && (year === 'All' || String(item.year) === year))
  return <>
    <PageIntro eyebrow="THE ARCHIVE / PUBLICATIONS" title={<>Words made<br /><em>to be kept.</em></>} description="Books, anthologies, literary magazines, and student writing produced by THE VACHAS." />
    <section className="section section-paper"><div className="wrap">
      <div className="filter-row filter-stack"><div className="filter-buttons">{languages.map((item) => <button key={item} className={language === item ? 'filter-button selected' : 'filter-button'} onClick={() => setLanguage(item)}>{item}</button>)}</div><div className="filter-buttons">{types.map((item) => <button key={item} className={type === item ? 'filter-button selected' : 'filter-button'} onClick={() => setType(item)}>{item}</button>)}</div><div className="filter-buttons">{years.map((item) => <button key={item} className={year === item ? 'filter-button selected' : 'filter-button'} onClick={() => setYear(item)}>{item === 'All' ? 'All years' : item}</button>)}</div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles" aria-label="Search publications" /></label></div>
      {visible.length ? <div className="publication-grid">{visible.map((publication) => <PublicationCard publication={publication} key={publication.slug} />)}</div> : <EmptyState icon="book" title="The library is waiting for its first title" description="Add verified publication details and authorized files to the publications data file. No download links are shown until a real file or reading link is configured." />}
    </div></section>
  </>
}

function PublicationCard({ publication }: { publication: Publication }) {
  return <Link className="publication-card" to={`/publications/${publication.slug}`}>
    <div className="book-cover">{publication.cover ? <ImageWithFallback src={publication.cover} alt={`Cover of ${publication.title}`} /> : <div><BookOpen size={23} /><span>{publication.type}</span></div>}</div>
    <span className="publication-kicker">{publication.language ?? 'Publication'}{publication.year ? ` · ${publication.year}` : ''}</span>
    <h3>{publication.title}</h3>{publication.subtitle && <p>{publication.subtitle}</p>}
  </Link>
}

function PublicationDetail() {
  const { slug } = useParams()
  const publication = publications.find((item) => item.slug === slug)
  if (!publication) return <NotFound />
  return <>
    <PageIntro eyebrow={`${publication.type.toUpperCase()}${publication.year ? ` / ${publication.year}` : ''}`} title={<>{publication.title}<br /><em>{publication.subtitle}</em></>} description={publication.description} />
    <section className="section section-paper"><div className="wrap detail-layout"><div className="book-cover detail-cover">{publication.cover ? <ImageWithFallback src={publication.cover} alt={`Cover of ${publication.title}`} /> : <div><BookOpen size={28} /><span>{publication.type}</span></div>}</div><div className="prose detail-facts">{publication.language && <p><strong>Language</strong>{publication.language}</p>}{publication.author && <p><strong>Author</strong>{publication.author}</p>}{publication.editorialTeam && <p><strong>Editorial team</strong>{publication.editorialTeam.join(', ')}</p>}{publication.wing && <p><strong>Related wing</strong>{publication.wing}</p>}{publication.tableOfContents && <><strong>Inside</strong><ul className="editorial-list">{publication.tableOfContents.map((entry) => <li key={entry}>{entry}</li>)}</ul></>}{getSafeContentUrl(publication.pdf) && <a className="button button-dark" href={getSafeContentUrl(publication.pdf)} target="_blank" rel="noreferrer">Download PDF <ArrowDown size={15} /></a>}{getSafeContentUrl(publication.readingUrl) && <a className="button button-dark" href={getSafeContentUrl(publication.readingUrl)} target="_blank" rel="noreferrer">Read online <ArrowUpRight size={15} /></a>}{(publication.pdf || publication.readingUrl) && !getSafeContentUrl(publication.pdf) && !getSafeContentUrl(publication.readingUrl) && <StatusNote>Publication links must be a local site path or a valid HTTPS URL.</StatusNote>}</div></div></section>
  </>
}

function BlogsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...Array.from(new Set(blogs.map((post) => post.category)))]
  const visible = blogs.filter((post) =>
    `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())
    && (category === 'All' || post.category === category),
  )

  return <>
    <PageIntro eyebrow="THE JOURNAL / BLOGS" title={<>Thoughts in<br /><em>the making.</em></>} description="Stories, reflections, and ideas from the VACHAS community. Each entry can link to its hosted article." />
    <section className="section section-paper"><div className="wrap">
      <div className="filter-row">
        <div className="filter-buttons">{categories.map((item) => <button key={item} className={category === item ? 'filter-button selected' : 'filter-button'} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blogs" aria-label="Search blogs" /></label>
      </div>
      {visible.length
        ? <div className="event-grid">{visible.map((post) => <BlogCard post={post} key={post.slug} />)}</div>
        : <EmptyState title="No blog posts have been added" description="Add a blog record with its hosted article URL to src/data/blogs.ts. An optional image can be a local file or a public image URL." />}
    </div></section>
  </>
}

function BlogCard({ post }: { post: BlogPost }) {
  const articleUrl = getSafeContentUrl(post.url)
  const cardContent = <>
      {post.image
        ? <ImageWithFallback className="event-card-image" src={post.image} alt={post.imageAlt || `Cover image for ${post.title}`} />
        : <div className="event-placeholder"><BookOpen size={26} strokeWidth={1.1} /><span>{post.category}</span></div>}
      <div className="event-card-info">
        <div className="event-date">{post.date ? formatDate(post.date) : post.category}{post.author && <span>{post.author}</span>}</div>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        {articleUrl
          ? <span className="text-link">Read blog <ArrowUpRight size={15} /></span>
          : <span className="muted-copy">Add a valid HTTPS article link to publish</span>}
      </div>
    </>
  return articleUrl
    ? <a className="event-card blog-card" href={articleUrl} target="_blank" rel="noopener noreferrer" aria-label={`Read ${post.title} (opens in a new tab)`}>{cardContent}</a>
    : <article className="event-card blog-card">{cardContent}</article>
}

function GalleryPage() {
  const [category, setCategory] = useState('All')
  const [eventName, setEventName] = useState('All')
  const categories = ['All', ...Array.from(new Set(gallery.map((item) => item.category)))]
  const eventNames = ['All', ...Array.from(new Set(gallery.flatMap((item) => item.event ? [item.event] : [])))]
  const images = gallery.filter((item) => item.image && (category === 'All' || item.category === category) && (eventName === 'All' || item.event === eventName))
  return <>
    <PageIntro eyebrow="THE ARCHIVE / PHOTOGRAPHS" title={<>An album of<br /><em>shared moments.</em></>} description="A visual record of literary events, workshops, conversations, celebrations, and the people who make them." />
    <section className="section section-paper"><div className="wrap"><div className="filter-stack filter-row"><div className="filter-buttons">{categories.map((item) => <button key={item} className={category === item ? 'filter-button selected' : 'filter-button'} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="filter-buttons">{eventNames.map((item) => <button key={item} className={eventName === item ? 'filter-button selected' : 'filter-button'} onClick={() => setEventName(item)}>{item === 'All' ? 'All events' : item}</button>)}</div><span className="result-count">{images.length} photographs</span></div>
      {images.length ? <PhotoGallery images={images} /> : <EmptyState title="No photographs have been added" description="Only approved club photographs should be added here. Add image paths, captions, dates, categories, and meaningful alt text in the gallery data file." />}
    </div></section>
  </>
}

function PhotoGallery({ images }: { images: readonly (GalleryImage | WingPhoto)[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selected = selectedIndex === null ? null : images[selectedIndex]

  useEffect(() => {
    if (selectedIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null)
      if (event.key === 'ArrowRight') setSelectedIndex((index) => index === null ? null : (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setSelectedIndex((index) => index === null ? null : (index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [images.length, selectedIndex])

  const moveSelection = (direction: -1 | 1) => {
    setSelectedIndex((index) => index === null ? null : (index + direction + images.length) % images.length)
  }

  return <>
    <div className="gallery-grid">{images.map((image, index) => <button className="gallery-image" key={`${image.image}-${index}`} onClick={() => setSelectedIndex(index)} aria-label={`View ${image.caption}`}><ImageWithFallback src={image.image} alt={image.alt} /><span>{image.caption}</span></button>)}</div>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.caption} onClick={() => setSelectedIndex(null)} tabIndex={-1}>
      <button className="lightbox-close" autoFocus onClick={() => setSelectedIndex(null)} aria-label="Close image"><X /></button>
      {images.length > 1 && <button className="lightbox-arrow lightbox-prev" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); moveSelection(-1) }}><ArrowLeft /></button>}
      <div className="lightbox-media" onClick={(event) => event.stopPropagation()}><ImageWithFallback className="lightbox-image" src={selected.image} alt={selected.alt} loading="eager" /></div>
      {images.length > 1 && <button className="lightbox-arrow lightbox-next" aria-label="Next image" onClick={(event) => { event.stopPropagation(); moveSelection(1) }}><ArrowRight /></button>}
      <p>{selected.caption}</p>
    </div>}
  </>
}

function AchievementsPage() {
  return <>
    <PageIntro eyebrow="THE ARCHIVE / MILESTONES" title={<>A story still<br /><em>being written.</em></>} description="A considered record of the club’s verified milestones, recognitions, collaborations, and publications." />
    <section className="section section-paper"><div className="wrap">{achievements.length ? <AchievementList items={achievements} /> : <EmptyState title="No milestones published yet" description="The archive will show verified achievements here once the editor adds their titles, dates, descriptions, and references." />}</div></section>
  </>
}

function AchievementList({ items }: { items: Achievement[] }) {
  return <div className="achievement-list">{items.map((item, index) => <article className="achievement-item" key={`${item.title}-${index}`}><span>{item.date ? formatDate(item.date) : item.category}</span><div><h3>{item.title}</h3><p>{item.description}</p>{item.referenceUrl && <a className="text-link" href={item.referenceUrl} target="_blank" rel="noreferrer">Reference <ArrowUpRight size={15} /></a>}</div></article>)}</div>
}

function JoinPage() {
  return <>
    <PageIntro eyebrow="FIND YOUR WAY IN" title={<>Bring what you love.<br /><em>Find your people.</em></>} description="Interested in language, creative work, design, or bringing people together? Explore the wings and discover how you might contribute." />
    <section className="section section-paper"><div className="wrap split-section"><div><Eyebrow>WHO CAN JOIN</Eyebrow><h2>Curiosity is a good place to start.</h2></div><div className="prose"><p>VACHAS is a student literary community associated with K L University. Explore the wings below to see the kinds of work they do and find an area that interests you.</p><p>{recruitment.message}</p><RecruitmentText status={recruitment.status} />{getSafeContentUrl(recruitment.applicationUrl) && <a className="button button-dark" href={getSafeContentUrl(recruitment.applicationUrl)} target="_blank" rel="noreferrer">Apply to join <ArrowUpRight size={15} /></a>}{!getSafeContentUrl(recruitment.applicationUrl) && !contactEmail && <p className="muted-copy">No application form or public contact address has been configured yet. Check the club’s verified channels for updates.</p>}</div></div></section>
    <section className="section wrap"><SectionHeading eyebrow="FIND YOUR INTEREST" title="A few different ways to contribute."/><div className="wing-grid">{wings.map((wing, index) => <WingCard wing={wing} index={index} key={wing.slug} />)}</div></section>
    <JoinCallout />
  </>
}

function RecruitmentText({ status }: { status: RecruitmentStatus }) {
  const labels: Record<RecruitmentStatus, string> = { open: 'Recruitment is open', closed: 'Recruitment is currently closed', announcements: 'Recruitment updates will be announced' }
  return <div className={`recruitment-status status-${status}`}><span />{labels[status]}</div>
}

function ContactPage() {
  return <>
    <PageIntro eyebrow="GET IN TOUCH" title={<>The beginning of<br /><em>a conversation.</em></>} description="For questions about the club, its work, or future collaborations, use a verified public channel." />
    <section className="section section-paper"><div className="wrap contact-layout"><div><Eyebrow>CONTACT & FOLLOW</Eyebrow><h2>Stay connected.</h2><p className="muted-copy">Club contact information appears here when it has been confirmed and approved for publication.</p></div><div className="contact-links">{contactEmail ? <a href={`mailto:${contactEmail}`}><span>Email</span><strong>{contactEmail}</strong><ArrowUpRight /></a> : <StatusNote>No public email address has been configured.</StatusNote>}{socialLinks.filter((social) => getSafeContentUrl(social.url)).length ? socialLinks.filter((social) => getSafeContentUrl(social.url)).map((social) => <a href={getSafeContentUrl(social.url)} key={social.label} target="_blank" rel="noreferrer"><span>{social.label}</span><strong>Visit channel</strong><ArrowUpRight /></a>) : <StatusNote>Verified social media links will be added here by the club editor.</StatusNote>}</div></div></section>
    <section className="section wrap"><Eyebrow>OUR HOME</Eyebrow><h2>{site.location}</h2></section>
  </>
}

function JoinCallout() {
  return <section className="join-callout"><div className="wrap join-callout-inner"><div><Eyebrow>THE NEXT CHAPTER</Eyebrow><h2>Have a voice.<br /><em>Bring it here.</em></h2></div><div><p>Explore the wings and find your way into the VACHAS community.</p><Link className="button button-light" to="/join">Find your way in <ArrowUpRight size={16} /></Link></div></div></section>
}

function QuoteBand() {
  return <section className="quote-band">
    <div className="wrap quote-band-inner">
      <div className="quote-emblem" aria-hidden="true"><img src="/vachas-logo.png" alt="" /></div>
      <blockquote><span>“</span><p>{site.closingThought}</p><cite>THE VACHAS · {site.tagline}</cite></blockquote>
      <div className="quote-book" aria-hidden="true"><BookOpen size={42} strokeWidth={1} /><span>LITERATURE &amp; ART</span></div>
    </div>
  </section>
}

function NotFound() {
  return <section className="not-found wrap"><Eyebrow>404 / NOT FOUND</Eyebrow><h1>This page is<br /><em>not in the archive.</em></h1><Link className="button button-dark" to="/">Return home <ArrowLeft size={16} /></Link></section>
}

function Footer() {
  return <footer className="site-footer"><div className="wrap">
    <div className="footer-columns">
      <div className="footer-about"><Link className="footer-wordmark" to="/"><img src="/vachas-logo.png" alt="" /><span><strong>Vachas</strong><small>THE LITERATURE CLUB</small></span></Link><p>A university literature club where words find voice across Telugu, Hindi, English, and creative expression.</p></div>
      <div className="footer-group"><h2>Our wings</h2>{wings.map((wing) => <Link to={`/wings/${wing.slug}`} key={wing.slug}>{wing.name}</Link>)}</div>
      <div className="footer-group"><h2>Explore</h2>{[['Publications', '/publications'], ['Blogs', '/blogs'], ['Gallery', '/gallery'], ['About the club', '/about'], ['Executive team', '/team'], ['Achievements', '/achievements']].map(([label, to]) => <Link to={to} key={to}>{label}</Link>)}</div>
      <div className="footer-group"><h2>Connect</h2><a href={vangmayaUrl} target="_blank" rel="noreferrer">Vāṅmaya AI workspace</a><Link to="/contact">Contact us</Link><Link to="/join">Join THE VACHAS</Link>{socialLinks.filter((social) => getSafeContentUrl(social.url)).map((social) => <a href={getSafeContentUrl(social.url)} key={social.label} target="_blank" rel="noreferrer">{social.label}</a>)}</div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Vachas — The Literature Club. All rights reserved.</span><span>WHERE WORDS FIND VOICE.</span><a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top ↑</a></div>
  </div></footer>
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed)
}

export default App
