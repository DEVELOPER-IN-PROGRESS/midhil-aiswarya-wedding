import { useEffect, useRef, useState } from "react";

/* ───────────── EDIT THESE ───────────── */
const W = {
  groom: "Midhil",
  bride: "Aiswarya",
  groomFamily: "S/o Mary KX & late Stnislavus Joseph, Mulavana",
  brideFamily: "D/o Mr. PK Jayaraj & Mrs. Mary Jayaraj, Marattiparambil",
  hosts: "Gibil & Nayana",
  // Replace with the link behind the QR code on your card:
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=St+Mathews+Church+Vennala+Kochi",
  whatsapp: "919447338882", // country code + number, no + or spaces
  music: "/music.mp3", // file lives in public/music.mp3
  countdownTo: "2026-11-14T15:30:00+05:30",
};

const EVENTS = [
  {
    key: "wedding",
    title: "Wedding Ceremony",
    day: "Saturday",
    date: "14 Nov 2026",
    time: "3:30 PM",
    place: "St. Mathews Church",
    area: "Vennala, Kochi",
    icon: "church",
    // 3:30 PM IST = 10:00 UTC
    cal: ["20261114T100000Z", "20261114T120000Z"],
  },
  {
    key: "reception",
    title: "Reception",
    day: "Saturday",
    date: "14 Nov 2026",
    time: "6:30 PM onwards",
    place: "Church Parish Hall",
    area: "St. Mathews Church, Vennala",
    icon: "rings",
    // 6:30 PM IST = 13:00 UTC
    cal: ["20261114T130000Z", "20261114T160000Z"],
  },
];

const IMG = {
  hero: "/images/stairs.jpg",
  laugh: "/images/pottery-laugh.jpg",
  heart: "/images/pottery-heart.jpg",
};
/* ─────────────────────────────────────── */

/* ───────────── Carousel photos ─────────────
   Every image in the /gallery folder is picked up automatically — no code changes.
   • Order: by filename, so prefix with numbers (01-…, 02-…) to control it.
   • Caption: taken from the filename, e.g. "02-made-by-hand.jpg" → "Made by hand".
     Camera-style names (IMG_1234, DSC0001, …) get no caption. */
const galleryFiles = import.meta.glob(
  "/gallery/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}",
  { eager: true, import: "default" }
);

const toCaption = (path) => {
  const base = path.split("/").pop().replace(/\.[^.]+$/, "");
  if (/^(img|dsc|dscn|dscf|pxl|photo|image|whatsapp|screenshot|wa|vid)[\s_-]?\d/i.test(base)) return "";
  const text = base.replace(/^\d+[\s._-]*/, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return /^[\d\s]*$/.test(text) ? "" : text.charAt(0).toUpperCase() + text.slice(1);
};

const PHOTOS = Object.entries(galleryFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
  .map(([path, src]) => ({ src, caption: toCaption(path) }));

const TILTS = [-2, 1.5, -1, 2, -1.5, 1];
const mod = (a, n) => ((a % n) + n) % n;

const calUrl = (e) =>
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${e.title} – ${W.groom} & ${W.bride}`)}` +
  `&dates=${e.cal[0]}/${e.cal[1]}` +
  `&details=${encodeURIComponent(`${e.place}, ${e.area}`)}` +
  `&location=${encodeURIComponent(`${e.place}, ${e.area}`)}`;

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff % 864e5) / 36e5),
    m: Math.floor((diff % 36e5) / 6e4),
    s: Math.floor((diff % 6e4) / 1e3),
    done: diff === 0,
  };
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ───────────── Postal pieces ───────────── */
function Postmark({ className = "", waves = false }) {
  return (
    <svg
      className={`postmark ${waves ? "waves" : ""} ${className}`}
      viewBox={waves ? "0 0 215 120" : "0 0 120 120"}
      aria-hidden="true"
    >
      <defs>
        <path id="pm-ring" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fontSize="8.5" letterSpacing="1.6" fill="currentColor" fontFamily="Special Elite">
        <textPath href="#pm-ring">WEDDING POST · KOCHI · KERALA ·</textPath>
      </text>
      <text x="60" y="57" textAnchor="middle" fontSize="11.5" fill="currentColor" fontFamily="Special Elite">14 NOV</text>
      <text x="60" y="72" textAnchor="middle" fontSize="11.5" fill="currentColor" fontFamily="Special Elite">2026</text>
      {waves &&
        [36, 48, 60, 72, 84].map((y) => (
          <path
            key={y}
            d={`M112 ${y} q12 -7 24 0 t24 0 t24 0 t24 0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
        ))}
    </svg>
  );
}

function Stamp({ src, caption, tilt = 0, onClick, children, className = "", meta = false, lazy = true }) {
  return (
    <figure
      className={`stamp-wrap ${onClick ? "clickable" : ""} ${className}`}
      style={{ "--tilt": `${tilt}deg` }}
      onClick={onClick}
    >
      <div className="stamp">
        {src && <img src={src} alt={caption || ""} loading={lazy ? "lazy" : "eager"} draggable="false" />}
        {children}
        {meta && (
          <div className="stamp-meta">
            <span>Wedding post</span>
            <span>♥ 14·XI</span>
          </div>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      {name === "church" ? (
        <path d="M12 2v4M10 4h4M5 12l7-6 7 6M6 11v10h12V11M10 21v-4a2 2 0 0 1 4 0v4M3 21h18" />
      ) : (
        <>
          <circle cx="9" cy="14.5" r="5" />
          <circle cx="15" cy="14.5" r="5" />
          <path d="M15 9.5l-1.6-2.2 1.6-1.6 1.6 1.6z" />
        </>
      )}
    </svg>
  );
}

/* ───────────── Cover (airmail envelope + wax seal) ───────────── */
function Cover({ guest, onOpen, leaving }) {
  return (
    <div className={`cover ${leaving ? "leaving" : ""}`}>
      <Stamp className="cover-deco deco-s1" src={IMG.laugh} tilt={-12} meta lazy={false} />
      <Stamp className="cover-deco deco-s2" src={IMG.heart} tilt={9} meta lazy={false} />
      <Postmark className="cover-deco deco-pm" waves />

      <div className="cover-inner">
        <p className="dear">{guest ? `Dear ${guest},` : "Dear friends & family,"}</p>
        <p className="cover-from">a letter has arrived from</p>
        <h1 className="cover-title">
          {W.groom}
          <span>&</span>
          {W.bride}
        </h1>

        <div className="envelope">
          <div className="env-back" />
          <div className="env-letter">
            <span className="type-sm">Wedding post</span>
            <span className="env-letter-hand">You're invited!</span>
            <span className="type-sm">14 · 11 · 2026</span>
          </div>
          <div className="env-front">
            <span className="par-avion env-avion">Par avion</span>
            <div className="env-to">
              <span>To,</span>
              <b>{guest || "Our dearest"}</b>
              <i />
            </div>
          </div>
          <div className="env-frame" />
          <div className="env-flap" />
          <button className="seal" onClick={onOpen} aria-label="Open invitation">
            <span>
              {W.groom[0]}
              <i>&</i>
              {W.bride[0]}
            </span>
          </button>
        </div>

        <p className="tap">tap the seal to open</p>
      </div>
    </div>
  );
}

/* ───────────── Sections ───────────── */
function Hero() {
  return (
    <header className="hero" id="home">
      <Reveal>
        <p className="eyebrow">Special delivery</p>
        <h2 className="invited">
          You’re
          <br />
          Invited
        </h2>
        <p className="hand hero-sub">
          to the wedding of {W.groom} & {W.bride}
        </p>
      </Reveal>
      <Reveal delay={150} className="hero-photo">
        <Stamp src={IMG.hero} tilt={-1.5} lazy={false} />
        <Postmark className="hero-postmark" waves />
        <div className="date-stamp">
          <div className="stamp">
            <small>Date</small>
            <b>
              14<sup>th</sup>
            </b>
            <b>Nov</b>
          </div>
        </div>
        <span className="par-avion hero-avion">Par avion</span>
      </Reveal>
      <Reveal delay={300}>
        <p className="rubber">Saturday · 14 Nov 2026</p>
        <p className="hand hero-place">3:30 PM · St. Mathews Church, Vennala</p>
        <a href="#invite" className="scroll">↓ read the letter</a>
      </Reveal>
    </header>
  );
}

function Invite() {
  return (
    <section className="section" id="invite">
      <Reveal>
        <article className="letter">
          <span className="tape" aria-hidden="true" />
          <p className="letter-date">Kochi, November 2026</p>
          <p className="hand letter-dear">Dear friends & family,</p>
          <p className="typed">
            With immense joy and happiness, we invite you to celebrate the wedding of our beloved brother
          </p>
          <h3 className="name">{W.groom}</h3>
          <p className="family">{W.groomFamily}</p>
          <p className="with">with</p>
          <h3 className="name">{W.bride}</h3>
          <p className="family">{W.brideFamily}</p>
          <p className="typed">as they begin their beautiful journey together.</p>
          <p className="hand letter-sign">
            With love,
            <br />
            {W.hosts}
          </p>
          <Postmark className="letter-pm" />
        </article>
      </Reveal>
    </section>
  );
}

function Countdown() {
  const { d, h, m, s, done } = useCountdown(W.countdownTo);
  const items = [["Days", d], ["Hrs", h], ["Mins", m], ["Secs", s]];
  return (
    <section className="countdown" style={{ backgroundImage: `url(${IMG.heart})` }}>
      <div className="veil" />
      <Reveal className="countdown-inner">
        <div className="telegram">
          <div className="tg-head">
            <b>Telegram</b>
            <small>
              Wedding post
              <br />& telegraph
            </small>
          </div>
          <div className="tg-meta">
            <span>To: all our loved ones</span>
            <span>
              From: {W.groom} & {W.bride}
            </span>
          </div>
          <p className="strip">Save the date stop 14 November 2026 stop</p>
          {done ? (
            <p className="strip">Today is the day stop see you there stop</p>
          ) : (
            <>
              <p className="strip">Arriving in stop</p>
              <div className="tg-clock">
                {items.map(([label, v]) => (
                  <div key={label}>
                    <b>{String(v).padStart(2, "0")}</b>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="strip">Cannot wait to celebrate with you stop</p>
        </div>
      </Reveal>
    </section>
  );
}

function Events() {
  return (
    <section className="section" id="events">
      <Reveal>
        <p className="eyebrow">The celebration</p>
        <h3 className="h2">Where & When</h3>
      </Reveal>
      <div className="events">
        {EVENTS.map((e, i) => (
          <Reveal key={e.key} delay={i * 150}>
            <article className={`postcard ${i % 2 ? "tilt-r" : "tilt-l"}`}>
              <div className="pc-top">
                <span className="pc-label">Post card</span>
                <div className="pc-stamp">
                  <Postmark className="pc-pm" waves />
                  <Stamp tilt={4} className={`mini ${e.icon}`}>
                    <div className="icon-panel">
                      <Icon name={e.icon} />
                    </div>
                  </Stamp>
                </div>
              </div>
              <div className="pc-body">
                <div className="pc-msg">
                  <p className="pc-when">
                    {e.day} · {e.date}
                  </p>
                  <h4>{e.title}</h4>
                  <p className="pc-time">{e.time}</p>
                </div>
                <div className="pc-rule" />
                <div className="pc-addr">
                  <p>{e.place}</p>
                  <p>{e.area}</p>
                </div>
              </div>
              <div className="btns">
                <a className="btn" href={W.mapUrl} target="_blank" rel="noreferrer">Open map</a>
                <a className="btn ghost" href={calUrl(e)} target="_blank" rel="noreferrer">Add to calendar</a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Infinite carousel ─────────────
   The list is padded with copies at both ends. After a move lands on a copy,
   the track jumps (without animation) to the matching real slide, so it loops forever. */
function Carousel({ photos, onOpen, paused }) {
  const n = photos.length;
  const loop = n > 1;
  const k = loop ? Math.min(n, 3) : 0;
  const slides = loop ? [...photos.slice(-k), ...photos, ...photos.slice(0, k)] : photos;

  const [pos, setPos] = useState(k);
  const [anim, setAnim] = useState(true);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const posRef = useRef(k);
  const busy = useRef(false);
  const settleTimer = useRef(null);
  const held = useRef(false);
  const holdTimer = useRef(null);
  const dragRef = useRef(null);
  const suppressClick = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const active = loop ? mod(pos - k, n) : 0;

  const settle = () => {
    clearTimeout(settleTimer.current);
    busy.current = false;
    const p = posRef.current;
    if (p < k || p >= k + n) {
      const q = p < k ? p + n : p - n;
      posRef.current = q;
      setAnim(false);
      setPos(q);
    }
  };

  // Turn animation back on two frames after a silent jump.
  useEffect(() => {
    if (anim) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setAnim(true));
    });
    return () => cancelAnimationFrame(id);
  }, [anim]);

  const move = (delta) => {
    if (!loop || delta === 0 || busy.current) return;
    const p = posRef.current + delta;
    posRef.current = p;
    if (reduce) {
      settle();
      setPos(posRef.current);
      return;
    }
    busy.current = true;
    setAnim(true);
    setPos(p);
    settleTimer.current = setTimeout(settle, 900); // fallback if transitionend is missed
  };

  const hold = () => {
    held.current = true;
    clearTimeout(holdTimer.current);
    holdTimer.current = setTimeout(() => (held.current = false), 6000);
  };

  const nudge = (delta) => {
    hold();
    move(delta);
  };

  // Jump to a dot, taking the shorter way round.
  const goToDot = (j) => {
    let d = j - active;
    if (d > n / 2 && posRef.current + d - n >= 0) d -= n;
    else if (d < -n / 2 && posRef.current + d + n <= n + 2 * k - 1) d += n;
    nudge(d);
  };

  // Auto-advance.
  useEffect(() => {
    if (!loop || reduce) return;
    const id = setInterval(() => {
      if (!held.current && !pausedRef.current && !dragRef.current && document.visibilityState === "visible") move(1);
    }, 4000);
    return () => clearInterval(id);
  }, [loop]);

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current);
      clearTimeout(settleTimer.current);
    },
    []
  );

  // Swipe / drag.
  const onPointerDown = (e) => {
    if (!loop || e.button > 0) return;
    hold();
    dragRef.current = { x: e.clientX, y: e.clientY, dx: 0, on: false };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    d.dx = e.clientX - d.x;
    if (!d.on) {
      if (Math.abs(d.dx) < 8) return;
      if (Math.abs(e.clientY - d.y) > Math.abs(d.dx) || busy.current) {
        dragRef.current = null;
        return;
      }
      d.on = true;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    setDrag(d.dx);
  };
  const endDrag = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d?.on) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    setDragging(false);
    setDrag(0);
    if (d.dx < -50) move(1);
    else if (d.dx > 50) move(-1);
  };

  return (
    <div className="carousel">
      <div
        className="car-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-roledescription="carousel"
      >
        <div
          className={`car-track${anim ? "" : " jump"}${dragging ? " dragging" : ""}`}
          style={{ "--pos": pos, "--drag": `${drag}px` }}
          onTransitionEnd={(e) => e.target === e.currentTarget && e.propertyName === "transform" && settle()}
        >
          {slides.map((p, i) => (
            <div
              key={i}
              className={`car-slide${i === pos ? " on" : ""}`}
              aria-hidden={i !== pos}
              aria-roledescription="slide"
            >
              <Stamp
                src={p.src}
                caption={p.caption}
                tilt={TILTS[mod(i - k, n) % TILTS.length]}
                meta
                onClick={() => {
                  if (suppressClick.current) return;
                  if (i === pos) onOpen(mod(i - k, n));
                  else nudge(i - pos);
                }}
              />
            </div>
          ))}
        </div>
        {loop && (
          <>
            <button className="car-arrow prev" onClick={() => nudge(-1)} aria-label="Previous photo">‹</button>
            <button className="car-arrow next" onClick={() => nudge(1)} aria-label="Next photo">›</button>
          </>
        )}
      </div>
      {loop && (
        <div className="dots">
          {photos.map((p, j) => (
            <button
              key={j}
              className={j === active ? "on" : ""}
              onClick={() => goToDot(j)}
              aria-label={`Show photo ${j + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Lightbox({ photos, index, onClose, onStep }) {
  const touchX = useRef(null);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, onStep]);
  const p = photos[index];
  const many = photos.length > 1;
  return (
    <div
      className="lightbox"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={p.src} alt={p.caption} />
        {p.caption && <figcaption>{p.caption}</figcaption>}
      </figure>
      <button className="lb-close" aria-label="Close" onClick={onClose}>×</button>
      {many && (
        <>
          <button className="lb-nav prev" aria-label="Previous photo" onClick={(e) => (e.stopPropagation(), onStep(-1))}>‹</button>
          <button className="lb-nav next" aria-label="Next photo" onClick={(e) => (e.stopPropagation(), onStep(1))}>›</button>
        </>
      )}
    </div>
  );
}

function Gallery() {
  const [openIdx, setOpenIdx] = useState(null);
  if (!PHOTOS.length) return null;
  const step = (d) => setOpenIdx((i) => mod(i + d, PHOTOS.length));
  return (
    <section className="section" id="moments">
      <Reveal>
        <p className="eyebrow">Moments</p>
        <h3 className="h2">Postcards from us</h3>
      </Reveal>
      <Reveal delay={120}>
        <Carousel photos={PHOTOS} onOpen={setOpenIdx} paused={openIdx !== null} />
      </Reveal>
      {openIdx !== null && (
        <Lightbox photos={PHOTOS} index={openIdx} onClose={() => setOpenIdx(null)} onStep={step} />
      )}
    </section>
  );
}

function Rsvp() {
  const [name, setName] = useState("");
  const [attend, setAttend] = useState("yes");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");

  const send = (e) => {
    e.preventDefault();
    const who = name.trim() || "A guest";
    const msg =
      attend === "yes"
        ? `Hi! ${who} here. We'll be joining ${W.groom} & ${W.bride}'s wedding on 14 Nov 🎉 Guests: ${guests}.`
        : `Hi! ${who} here. Sorry, we won't be able to make it to ${W.groom} & ${W.bride}'s wedding, but we're sending our love ♥`;
    const full = note.trim() ? `${msg}\n\n${note.trim()}` : msg;
    window.open(`https://wa.me/${W.whatsapp}?text=${encodeURIComponent(full)}`, "_blank");
  };

  return (
    <section className="section" id="rsvp">
      <Reveal>
        <p className="eyebrow">R.S.V.P.</p>
        <h3 className="h2">Will you join us?</h3>
      </Reveal>
      <Reveal delay={120}>
        <form className="reply" onSubmit={send}>
          <div className="reply-head">
            <span>Reply card</span>
            <span className="reply-paid">
              Reply
              <br />
              paid
            </span>
          </div>
          <label>
            Your name
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </label>
          <div className="choices">
            {[["yes", "Joyfully accept"], ["no", "Regretfully decline"]].map(([v, l]) => (
              <button type="button" key={v} className={attend === v ? "on" : ""} onClick={() => setAttend(v)}>
                {l}
              </button>
            ))}
          </div>
          {attend === "yes" && (
            <div className="counter">
              <span>Number of guests</span>
              <div>
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                <b>{guests}</b>
                <button type="button" onClick={() => setGuests(Math.min(10, guests + 1))}>+</button>
              </div>
            </div>
          )}
          <label>
            A little note (optional)
            <textarea rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Wishes for the couple…" />
          </label>
          <button className="btn full" type="submit">Post your reply via WhatsApp</button>
        </form>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="airmail-band" />
      <Reveal>
        <p className="hand footer-love">With love & blessings,</p>
        <p className="sign">{W.hosts}</p>
        <Postmark className="footer-pm" waves />
        <p className="tiny">
          {W.groom} & {W.bride} · 14.11.2026
        </p>
      </Reveal>
    </footer>
  );
}

/* ───────────── Music ─────────────
   Tries to play as soon as the page loads. Most phones block sound until the
   guest touches the screen, so it also starts on the very first tap anywhere
   (including on the envelope cover, before the seal is opened). */
function Music() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const mutedByGuest = useRef(false);

  useEffect(() => {
    const a = ref.current;
    const events = ["pointerdown", "pointerup", "touchend", "click", "keydown"];
    const tryPlay = (e) => {
      if (e?.target?.closest?.(".music")) return; // the toggle handles itself
      if (mutedByGuest.current || !a.paused) return;
      a.play().catch(() => {});
    };
    window.__startMusic = tryPlay;
    tryPlay();
    events.forEach((ev) => document.addEventListener(ev, tryPlay, true));
    return () => events.forEach((ev) => document.removeEventListener(ev, tryPlay, true));
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (a.paused) {
      mutedByGuest.current = false;
      a.play().catch(() => {});
    } else {
      mutedByGuest.current = true;
      a.pause();
    }
  };

  return (
    <>
      <audio ref={ref} src={W.music} loop preload="auto" onPlay={() => setOn(true)} onPause={() => setOn(false)} />
      <button
        className={`music ${on ? "on" : ""}`}
        onClick={toggle}
        aria-label={on ? "Pause music" : "Play music"}
        aria-pressed={on}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="spk" d="M3.5 9.5v5H7l4.5 4v-13L7 9.5z" />
          {on ? (
            <path className="wave" d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" />
          ) : (
            <path className="wave" d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
          )}
        </svg>
      </button>
    </>
  );
}

/* ───────────── App ───────────── */
export default function App() {
  const guest = new URLSearchParams(window.location.search).get("to");
  const [stage, setStage] = useState("closed"); // closed → leaving → open

  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
  }, [stage]);

  const open = () => {
    if (stage !== "closed") return;
    setStage("leaving");
    window.__startMusic?.();
    window.scrollTo(0, 0);
    setTimeout(() => setStage("open"), 1800);
  };

  return (
    <>
      <Music />
      {stage !== "open" && <Cover guest={guest} onOpen={open} leaving={stage === "leaving"} />}
      <main>
        <div className="airmail-band" />
        <Hero />
        <Invite />
        <Countdown />
        <Events />
        <Gallery />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
