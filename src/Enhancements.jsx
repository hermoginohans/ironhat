import { useEffect, useState } from 'react';
import { ArrowUpRight, Camera, Check, MessageSquare, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { siteContent } from './site-content';

export const assetUrl = path => /^https?:\/\//.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//, '');
const draft = import.meta.env.DEV;

export function useEntranceAnimations() {
  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .service-card, .about-copy, .area-panel, .process-step, .project-card, .review-card').forEach(element => {
      element.classList.add('reveal'); observer.observe(element);
    });
    return () => { observer.disconnect(); document.querySelectorAll('.reveal').forEach(element => element.classList.remove('reveal')); };
  }, []);
}

export function Process() {
  const steps = [
    [Phone, 'Get in touch', 'Call us or tell us a little about your plumbing problem. Share your suburb and what needs attention.'],
    [MessageSquare, 'Talk through the job', 'We’ll discuss the work, answer your questions and help you understand the next step.'],
    [Wrench, 'Let’s get it sorted', 'Once the job is agreed, we’ll arrange a suitable time and get to work.'],
  ];
  return <section className="section process" id="process"><div className="section-heading"><div><p className="eyebrow">STRAIGHTFORWARD FROM THE START</p><h2>Good service.<br/>Three simple steps.</h2></div><p>No guesswork. Just a conversation, a clear plan and practical plumbing help.</p></div><div className="process-grid">{steps.map(([Icon, title, text], index) => <article className="process-step" key={title}><div className="process-number"><span>0{index + 1}</span><Icon size={25} strokeWidth={1.5}/></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}

function ProjectComparison({ project }) {
  const [position, setPosition] = useState(50);
  return <article className="project-card"><div className="comparison"><img loading="lazy" src={assetUrl(project.after)} alt={project.afterAlt || `${project.title}, after the work`}/><div className="comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img loading="lazy" src={assetUrl(project.before)} alt={project.beforeAlt || `${project.title}, before the work`}/></div><span className="comparison-label before-label">Before</span><span className="comparison-label after-label">After</span><div className="comparison-divider" style={{ left: `${position}%` }} aria-hidden="true"><span>↔</span></div></div><label className="comparison-control">Compare before and after<input type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} aria-label={`Before and after comparison for ${project.title}`} aria-valuetext={`${position}% before photo visible`}/></label><div className="project-description"><span>{project.suburb}</span><h3>{project.title}</h3><p>{project.description}</p></div></article>;
}

export function Gallery() {
  if (!siteContent.projects.length && !draft) return null;
  return <section className="section gallery" id="projects"><div className="section-heading"><div><p className="eyebrow">THE WORK SPEAKS FOR ITSELF</p><h2>Real problems.<br/>Practical solutions.</h2></div><p>See the difference good plumbing makes, from the first look to the finished job.</p></div>{siteContent.projects.length ? <div className="project-grid">{siteContent.projects.map(project => <ProjectComparison key={project.title} project={project}/>)}</div> : <div className="draft-gallery"><span className="draft-badge">DRAFT · APPROVED PHOTOS NEEDED</span><div className="draft-photo-pair">{['Before the work', 'After the work'].map(label => <div key={label}><Camera size={32} strokeWidth={1.3}/><strong>{label}</strong><span>Project photo goes here</span></div>)}</div><p>Add a real project’s before and after photos to activate the comparison slider. These are layout placeholders, not completed Ironhat jobs.</p></div>}</section>;
}

export function ReviewsAndCredentials() {
  const showReviews = siteContent.reviews.length || siteContent.googleReviewsUrl || draft;
  const showCredentials = siteContent.credentials.length || draft;
  return <>{showReviews && <section className="section reviews" id="reviews"><div className="section-heading"><div><p className="eyebrow">FROM OUR CUSTOMERS</p><h2>Good work.<br/>Happy customers.</h2></div>{siteContent.googleReviewsUrl && <a className="text-link" href={siteContent.googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read our Google reviews <ArrowUpRight size={20}/></a>}</div>{siteContent.reviews.length ? <div className="review-grid">{siteContent.reviews.map(review => <figure className="review-card" key={review.name + review.quote}><MessageSquare size={25}/><blockquote>{review.quote}</blockquote><figcaption><strong>{review.name}</strong>{review.sourceUrl && <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">Read original review <ArrowUpRight size={15}/></a>}</figcaption></figure>)}</div> : draft && <div className="draft-note"><MessageSquare size={27}/><div><span className="draft-badge">DRAFT · VERIFIED REVIEWS NEEDED</span><p>Genuine customer reviews will appear here once approved. No sample ratings or testimonials are published.</p></div></div>}</section>}{showCredentials && <section className="section credentials"><div><p className="eyebrow">PEACE OF MIND</p><h2>Know who’s<br/>on the tools.</h2></div><div className="credential-list"><div className="credential-item"><ShieldCheck size={25}/><div><h3>Registered business</h3><p>Ironhat Plumbing Pty Ltd · ABN 47 680 672 100</p></div></div>{siteContent.credentials.map(item => <div className="credential-item" key={item.title}><Check size={25}/><div><h3>{item.title}</h3><p>{item.detail}</p>{item.verificationUrl && <a href={item.verificationUrl} target="_blank" rel="noopener noreferrer">View details ↗</a>}</div></div>)}{!siteContent.credentials.length && draft && <div className="draft-note"><div><span className="draft-badge">DRAFT · CREDENTIALS NEEDED</span><p>Add confirmed licence and insurance details here before publishing these claims.</p></div></div>}</div></section>}</>;
}

export function MobileContactBar() {
  return <nav className="mobile-contact-bar" aria-label="Quick contact"><a href="tel:0412629823"><Phone size={18}/> Call now</a><a href="#contact"><span>Get a quote</span><ArrowUpRight size={18}/></a></nav>;
}

export function EnquiryForm({ services, selected, setSelected }) {
  const [status, setStatus] = useState('idle');
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim();
  const direct = Boolean(endpoint && /^https:\/\//i.test(endpoint));
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return;
    if (!direct) {
      const body = `Hi Ironhat,\n\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nEmail: ${data.get('email')}\nSuburb: ${data.get('suburb')}\nService: ${data.get('service')}\n\n${data.get('message')}`;
      window.location.href = `mailto:info@ironhatplumbing.com.au?subject=${encodeURIComponent('Plumbing enquiry — ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
      setStatus('prepared'); return;
    }
    setStatus('sending');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('success'); form.reset(); setSelected('');
    } catch { setStatus('error'); } finally { clearTimeout(timeout); }
  }
  return <form onSubmit={submit} aria-busy={status === 'sending'}><fieldset disabled={status === 'sending'}><div className="form-row"><label>Your name<input name="name" placeholder="Sam Smith" autoComplete="name" maxLength="120" required/></label><label>Phone number<input name="phone" type="tel" placeholder="04XX XXX XXX" autoComplete="tel" maxLength="40" required/></label></div><div className="form-row"><label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength="254" required/></label><label>Suburb<input name="suburb" placeholder="Where’s the job?" autoComplete="address-level2" maxLength="120" required/></label></div><label>What can we help with?<select name="service" value={selected} onChange={e => setSelected(e.target.value)} required><option value="">Select a service</option>{services.map(([, title]) => <option key={title}>{title}</option>)}<option>Other plumbing stuff</option></select></label><label>A few details<textarea name="message" placeholder="Tell us a little about the job…" rows="3" maxLength="5000" required/></label><div className="honeypot" aria-hidden="true"><label>Leave this blank<input name="_gotcha" tabIndex="-1" autoComplete="off"/></label></div><p className="form-note">Your contact details are used to respond to this enquiry.</p><button className="button orange" type="submit">{status === 'sending' ? 'Sending enquiry…' : direct ? 'Send enquiry' : 'Prepare email enquiry'}<ArrowUpRight size={20}/></button></fieldset><p className={'form-note form-status ' + status} role="status" aria-live="polite">{status === 'success' ? 'Thanks — your enquiry has been submitted. For urgent jobs, please call us.' : status === 'error' ? 'We couldn’t confirm your enquiry was sent. Your details are still here. Please try again, call us, or email us directly.' : status === 'prepared' ? 'Your enquiry is ready in your email app. Send it there to contact Ironhat.' : direct ? 'Send your enquiry here. For urgent plumbing issues, call us directly.' : 'Opens your email app with your enquiry ready to send.'}</p>{status === 'error' && <a className="text-link" href="mailto:info@ironhatplumbing.com.au">Email Ironhat directly <ArrowUpRight size={18}/></a>}</form>;
}
