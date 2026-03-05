import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, siteData } from "@/data/site-data";

type ServiceDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return siteData.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Pachet indisponibil | Urban Edge Barbershop",
    };
  }

  return {
    title: `${service.name} | Urban Edge Barbershop`,
    description: service.description,
  };
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
        <Link
          href="/#servicii"
          className="inline-flex rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.12em] text-muted transition hover:border-accent hover:text-accent"
        >
          INAPOI LA SERVICII
        </Link>

        <section className="mt-8 rounded-3xl border border-line bg-surface p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Pachet</p>
          <h1 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] md:text-6xl">{service.name}</h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full border border-line px-4 py-2 text-sm text-foreground/85">
              Durata: {service.duration}
            </span>
            <span className="rounded-full border border-accent bg-accent px-4 py-2 text-sm font-semibold text-black">
              Pret: {service.price}
            </span>
          </div>
          <p className="mt-6 text-base text-foreground/80">{service.longDescription}</p>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-heading text-4xl uppercase tracking-[0.05em]">Ce include</h2>
            <ul className="mt-4 space-y-3 text-sm text-foreground/85">
              {service.includes.map((item) => (
                <li key={item} className="rounded-2xl border border-line/70 bg-background/60 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-heading text-4xl uppercase tracking-[0.05em]">Recomandat pentru</h2>
            <p className="mt-4 text-sm text-foreground/85">{service.recommendedFor}</p>
            <div className="mt-6 rounded-2xl border border-line/70 bg-background/60 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Programare rapida</p>
              <a href={siteData.bookingLink} className="mt-2 block text-lg font-semibold text-accent">
                {siteData.phone}
              </a>
              <a href={siteData.whatsappLink} className="mt-2 inline-block text-sm text-foreground/80 underline">
                Scrie-ne pe WhatsApp
              </a>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
