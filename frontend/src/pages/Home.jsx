import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, ArrowRight, Users, Globe2, ShieldCheck, Star, ChevronRight, Award, CalendarDays, Zap } from 'lucide-react';
import api from '../api/client.js';
import { SectionHeading, Loading, ErrorState } from '../components/ui.jsx';
import { formatINR } from '../utils/format.js';

const DEST_COPY = {
  moon: { quip: 'Only 3 days away, depending on traffic. No traffic signals yet.' },
  mars: { quip: 'Red sand, beautiful views and absolutely no nearby grocery stores.' },
  'earth-orbit': { quip: 'See your house from space. Finding your parked vehicle is not guaranteed.' },
  'space-hotel-chandrika': { quip: 'Room with a view. Literally, half the universe.' },
};

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/destinations'), api.get('/companies'), api.get('/packages')])
      .then(([d, c, p]) => { setDestinations(d.data.destinations); setCompanies(c.data.companies); setPackages(p.data.packages); })
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const features = destinations.filter((d) => d.featured).slice(0, 6);
  const popular = [...packages].sort((a, b) => b.basePrice - a.basePrice).slice(0, 3);

  return (
    <div>
      {/* HERO — dark, cinematic */}
      {/* HERO — clean, cinematic */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-black">
        {/* Background */}
        <div className="absolute inset-0 bg-black" />

        {/* Animated stars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="stars-layer absolute inset-0 opacity-70" />
          <div className="stars-layer-delayed absolute inset-0 opacity-40" />
        </div>

        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-900/30 to-navy-900/90" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
          {/* Small Label */}
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[#B3BECE]">
            India's fictional gateway to space
          </p>

          {/* Main Heading */}
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-white md:text-7xl">
            Earth is getting crowded.
            <br />
            Let's find you some{" "}
            <span className="text-brand-saffron">space.</span>
          </h1>

          {/* Short Description */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#B3BECE] md:text-lg">
            Your journey beyond Earth starts here.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/destinations"
              className="btn-saffron !px-8 !py-4 text-base font-bold tracking-wider"
            >
              START YOUR JOURNEY
              <ArrowRight className="h-5 w-5" />
            </Link>

            <div className="relative">
              <img
                src="/visa.png"
                alt=""
                className="pointer-events-none absolute -right-64 -top-40 z-20 w-72"
              />

              <Link
                to="/assessment"
                className="btn-outline-light !px-7 !py-3 text-base"
              >
                Are you astronaut material?
                <Rocket className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* FEATURED DESTINATIONS */}
          <section className="bg-black">
            <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-20 md:px-8">
              <SectionHeading
                eyebrow="Destinations"
                title="Where in the universe, exactly?"
                sub="Distances are approximate. Excitement is guaranteed."
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((d, i) => (
                  <Link
                    key={d._id}
                    to={`/destinations/${d.slug}`}
                    className="card card-hover group block overflow-hidden"
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3">
                        <span className="badge-sky">{d.type}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white">{d.name}</h3>
                      <p className="mt-1 font-mono text-xs text-[#8492A6]">
                        {d.distanceFromEarth}
                      </p>
                      <p className="mt-2 text-sm text-[#8492A6]">
                        {DEST_COPY[d.slug]?.quip || d.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-navy-600 pt-3">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-saffron">
                          Explore <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="bg-black">
            <div className="mx-auto max-w-7xl px-4 py-20">
              <SectionHeading
                center
                eyebrow="The journey"
                title="How it works"
                sub="Four steps to get you off this rock."
              />
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Users,
                    title: "Create an account",
                    desc: "Tell us your name. Space doesn\u2019t need your resume.",
                  },
                  {
                    icon: Award,
                    title: "Pass the assessment",
                    desc: 'Prove you won\u2019t panic at "Houston, we have a problem."',
                  },
                  {
                    icon: ShieldCheck,
                    title: "Get your visa",
                    desc: "A fictional 6-month Space Travel Visa. Zero embassy queues.",
                  },
                  {
                    icon: Rocket,
                    title: "Book & blast off",
                    desc: "Pick a company, package and class. Reconsider your life choices.",
                  },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-black/10">
                      <s.icon className="h-7 w-7 text-brand-sky" />
                    </div>
                    <h3 className="mt-4 font-bold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-[#8492A6]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ASSESSMENT PROMO */}
          <section className="bg-black">
            <div className="mx-auto max-w-7xl px-4 py-20">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <p className="eyebrow text-brand-saffron">
                    <Award className="h-4 w-4" /> Astronaut recruitment
                  </p>
                  <h2 className="section-title-light">
                    Think you've got what it takes to leave Earth?
                  </h2>
                  <p className="mt-4 text-[#B3BECE]">
                    We're looking for brave explorers, quick thinkers and people
                    who don't panic when someone says "Houston, we have a
                    problem." Score 70%+ to earn your fictional Space Travel
                    Visa — valid for six months of pure potential.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link to="/assessment" className="btn-saffron">
                      Test My Space IQ{" "}
                    </Link>
                    {/* <Link to="/assessment" className="btn-outline-light">
                      Begin Astronaut Training
                    </Link> */}
                  </div>
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      icon: Zap,
                      t: "Randomised questions",
                      d: "Every attempt is shuffled. No cheating the universe.",
                    },
                    {
                      icon: ShieldCheck,
                      t: "7-day cooldown on failure",
                      d: "Time to reconsider your life choices.",
                    },
                    {
                      icon: CalendarDays,
                      t: "Visa valid 6 months",
                      d: "Plenty of time to stop procrastinating.",
                    },
                  ].map((f) => (
                    <div
                      key={f.t}
                      className="panel-dark flex items-center gap-4 p-5"
                    >
                      <f.icon className="h-6 w-6 shrink-0 text-brand-teal" />
                      <div>
                        <p className="font-semibold text-white">{f.t}</p>
                        <p className="text-sm text-[#8492A6]">{f.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="bg-black">
            <div className="mx-auto max-w-7xl px-4 py-20">
              <SectionHeading
                center
                eyebrow="Testimonials"
                title="Stories from future travellers"
                sub="Fictional, illustrative and slightly envious of people who'll actually go."
              />
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    n: "Priya Nair",
                    role: "Moon Escape",
                    q: "Walking on the Moon sounded insane. It was. 10/10 would leave Earth again.",
                  },
                  {
                    n: "Rohan Mehta",
                    role: "Orbital Stay",
                    q: "The zero-g sleep pods are great until you have to find your shoes. Worth it.",
                  },
                  {
                    n: "Ananya Iyer",
                    role: "Mars Expedition",
                    q: "Nine months to Mars. My mom still thinks I joined a startup abroad.",
                  },
                ].map((t, i) => (
                  <div key={i} className="card card-hover p-6">
                    <div className="flex gap-1 text-brand-saffron">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mt-3 text-white">"{t.q}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-navy-800 font-display font-bold text-brand-saffron">
                        {t.n[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{t.n}</p>
                        <p className="text-xs text-[#8492A6]">
                          {t.role} (fictional)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
