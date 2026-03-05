import { siteData } from "@/data/site-data";
import TestimonialsSlider from "@/components/testimonials-slider";
import Link from "next/link";

const navItems = [
  { label: "Servicii", href: "#servicii" },
  { label: "Echipa", href: "#echipa" },
  { label: "Galerie", href: "#galerie" },
  { label: "Recenzii", href: "#recenzii" },
  { label: "Contact", href: "#contact" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#" className="font-heading text-2xl uppercase tracking-[0.08em] text-accent">
            Urban Edge
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm tracking-wide text-foreground/85 transition hover:text-accent">
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={siteData.bookingLink}
            className="rounded-full border border-accent bg-accent px-4 py-2 text-xs font-bold tracking-wider text-black transition hover:bg-transparent hover:text-accent"
          >
            PROGRAMEAZA-TE
          </a>
        </nav>
      </header>

      <main>
        <section className="grid-glow grain-overlay border-b border-line/80">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24 md:px-6">
            <div className="reveal-up">
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-muted">Barbershop in Bucuresti</p>
              <h1 className="font-heading text-6xl leading-[0.95] tracking-[0.04em] text-foreground md:text-8xl">
                {siteData.brand}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-foreground/80">{siteData.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={siteData.bookingLink}
                  className="rounded-full border border-accent bg-accent px-6 py-3 text-sm font-extrabold tracking-[0.14em] text-black transition hover:bg-transparent hover:text-accent"
                >
                  SUNA ACUM
                </a>
                <a
                  href={siteData.whatsappLink}
                  className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold tracking-[0.12em] text-foreground transition hover:border-accent"
                >
                  WHATSAPP
                </a>
              </div>
            </div>
            <div className="reveal-up rounded-3xl border border-line bg-surface/75 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Program</p>
              <p className="mt-3 text-sm text-foreground/85">{siteData.schedule.weekdays}</p>
              <p className="mt-1 text-sm text-foreground/85">{siteData.schedule.saturday}</p>
              <p className="mt-1 text-sm text-foreground/85">{siteData.schedule.sunday}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">Contact</p>
              <p className="mt-3 text-lg font-semibold text-accent">{siteData.phone}</p>
              <p className="mt-2 text-sm text-foreground/80">{siteData.address}</p>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Clienti", value: "2.4K+" },
                  { label: "Rating", value: "4.9" },
                  { label: "Ani", value: "7+" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line px-3 py-3">
                    <p className="font-heading text-3xl text-accent">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="servicii" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Servicii si preturi</p>
          <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">Alege pachetul potrivit</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siteData.services.map((service) => (
              <article key={service.name} className="rounded-3xl border border-line bg-surface p-5 transition hover:border-accent">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-3xl uppercase tracking-wide">{service.name}</h3>
                  <span className="text-sm font-semibold text-accent">{service.price}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{service.duration}</p>
                <p className="mt-3 text-sm text-foreground/80">{service.description}</p>
                <Link
                  href={`/pachete/${service.slug}`}
                  className="mt-5 inline-flex rounded-full border border-accent px-4 py-2 text-xs font-bold tracking-[0.12em] text-accent transition hover:bg-accent hover:text-black"
                >
                  VEZI DETALII
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section id="echipa" className="border-y border-line/80 bg-[#0d0d0d]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Echipa</p>
            <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">Barberi specializati</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {siteData.barbers.map((barber) => (
                <article key={barber.name} className="rounded-3xl border border-line bg-surface/85 p-6">
                  <p className="font-heading text-4xl tracking-[0.05em] text-accent">{barber.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{barber.role}</p>
                  <p className="mt-4 text-sm font-semibold text-foreground/90">{barber.experience}</p>
                  <p className="mt-2 text-sm text-foreground/75">{barber.specialty}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="galerie" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Galerie dummy</p>
          <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">Lookbook urban</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siteData.gallery.map((item) => (
              <article
                key={item.title}
                className="h-48 rounded-3xl border border-line p-4"
                style={{ backgroundImage: item.gradient }}
              >
                <div className="flex h-full items-end">
                  <p className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white">{item.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="recenzii" className="border-y border-line/80 bg-[#0f0d0a]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Recenzii</p>
            <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">Ce spun clientii</h2>
            <TestimonialsSlider testimonials={siteData.testimonials} />
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Contact</p>
          <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">Hai la scaun</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-sm text-foreground/80">Ne gasesti aici:</p>
              <p className="mt-2 text-lg font-semibold text-accent">{siteData.address}</p>
              <p className="mt-6 text-sm text-foreground/80">{siteData.schedule.weekdays}</p>
              <p className="mt-1 text-sm text-foreground/80">{siteData.schedule.saturday}</p>
              <p className="mt-1 text-sm text-foreground/80">{siteData.schedule.sunday}</p>
              <div className="mt-6 rounded-2xl border border-dashed border-line bg-black/20 p-4 text-sm text-muted">
                Placeholder harta Google Maps (se inlocuieste cu embed real la livrarea finala).
              </div>
            </article>
            <form className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-sm text-foreground/80">Trimite un mesaj rapid:</p>
              <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="name">
                Nume
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nume complet"
                className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
              <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="phone">
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="07xx xxx xxx"
                className="mt-2 w-full rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
              <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-muted" htmlFor="message">
                Mesaj
              </label>
              <textarea
                id="message"
                placeholder="Spune-ne ce serviciu doresti."
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-line bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
              <button
                type="button"
                className="mt-5 w-full rounded-full border border-accent bg-accent px-6 py-3 text-sm font-extrabold tracking-[0.14em] text-black transition hover:bg-transparent hover:text-accent"
              >
                TRIMITE
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-line/80 bg-surface/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <p>{siteData.brand}</p>
          <p>Dummy content pentru validare design. Datele reale se inlocuiesc rapid. Test schimbare locala.</p>
        </div>
      </footer>
    </div>
  );
}
