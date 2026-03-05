export type Service = {
  slug: string;
  name: string;
  duration: string;
  price: string;
  description: string;
  longDescription: string;
  includes: string[];
  recommendedFor: string;
};

export type Barber = {
  name: string;
  role: string;
  experience: string;
  specialty: string;
};

export type Testimonial = {
  name: string;
  text: string;
  rating: string;
};

export type GalleryItem = {
  title: string;
  gradient: string;
};

export const siteData = {
  brand: "Urban Edge Barbershop",
  tagline: "Precizie, stil si ritual urban pentru fiecare client",
  phone: "+40 721 555 888",
  whatsappLink: "https://wa.me/40721555888",
  bookingLink: "tel:+40721555888",
  address: "Strada Aviatorilor 27, Bucuresti",
  schedule: {
    weekdays: "Luni - Vineri: 09:00 - 20:00",
    saturday: "Sambata: 10:00 - 18:00",
    sunday: "Duminica: Inchis",
  },
  services: [
    {
      slug: "tuns-classic",
      name: "Tuns Classic",
      duration: "35 min",
      price: "80 RON",
      description: "Consultanta rapida, tuns precis si styling de final.",
      longDescription:
        "Pachetul ideal pentru un look curat si echilibrat. Incepem cu o consultanta rapida, continuam cu tunsul adaptat formei fetei si terminam cu styling pentru rezultat natural.",
      includes: [
        "Consultanta scurta de stil",
        "Tuns personalizat pe forma fetei",
        "Finisare si styling cu produse premium",
      ],
      recommendedFor: "Clienti care vor un refresh rapid si elegant.",
    },
    {
      slug: "skin-fade",
      name: "Skin Fade",
      duration: "45 min",
      price: "95 RON",
      description: "Degradare curata cu tranzitii fine si simetrie perfecta.",
      longDescription:
        "Pentru cei care vor un look modern si precis, acest pachet pune accent pe tranzitii curate si contur perfect. Este executat cu atentie pe fiecare zona pentru simetrie impecabila.",
      includes: [
        "Analiza liniei naturale a parului",
        "Skin fade in trepte fine",
        "Contur detaliat in jurul tamplelor si cefei",
      ],
      recommendedFor: "Clienti care prefera stil urban modern si linii clare.",
    },
    {
      slug: "tuns-barba",
      name: "Tuns + Barba",
      duration: "60 min",
      price: "130 RON",
      description: "Pachet complet pentru look fresh si contur definit.",
      longDescription:
        "Un pachet complet pentru imagine impecabila. Combinam tunsul personalizat cu aranjarea barbii, astfel incat proportiile fetei sa fie echilibrate si aspectul sa fie premium.",
      includes: [
        "Tuns personalizat complet",
        "Contur si uniformizare barba",
        "Styling final pentru par si barba",
      ],
      recommendedFor: "Clienti care vor transformare completa intr-o singura sesiune.",
    },
    {
      slug: "aranjat-barba",
      name: "Aranjat Barba",
      duration: "30 min",
      price: "65 RON",
      description: "Contur, uniformizare, prosop cald si finisare premium.",
      longDescription:
        "Un serviciu dedicat exclusiv barbii, cu focus pe forma, simetrie si textura. Include tehnici de grooming pentru un look matur, curat si usor de intretinut acasa.",
      includes: [
        "Definire contur barba",
        "Uniformizare lungime",
        "Prosop cald si finisare cu balsam/ulei",
      ],
      recommendedFor: "Clienti care tin la o barba ingrijita si definita.",
    },
    {
      slug: "contur-rapid",
      name: "Contur Rapid",
      duration: "20 min",
      price: "45 RON",
      description: "Retus rapid pentru pastrarea formei intre tunsori.",
      longDescription:
        "Un serviciu express intre tunsorile complete. Refacem liniile principale si curatam zonele-cheie pentru ca look-ul sa ramana fresh pana la urmatoarea programare.",
      includes: [
        "Retus zona tample si ceafa",
        "Curatare contur frontal",
        "Finisare rapida pentru aspect curat",
      ],
      recommendedFor: "Clienti care vor sa mentina forma impecabila saptamanal.",
    },
    {
      slug: "pachet-vip",
      name: "Pachet VIP",
      duration: "80 min",
      price: "170 RON",
      description: "Tuns, barba, spalare, masaj scalp si styling dedicat.",
      longDescription:
        "Experienta completa Urban Edge. Este pachetul premium in care combinam tehnica de barbering cu elemente de relaxare pentru un rezultat impecabil si o experienta de top.",
      includes: [
        "Tuns personalizat premium",
        "Aranjat barba cu prosop cald",
        "Spalare + masaj scalp + styling dedicat",
      ],
      recommendedFor: "Clienti care vor servicii complete si experienta premium.",
    },
  ] as Service[],
  barbers: [
    {
      name: "Alex V.",
      role: "Senior Barber",
      experience: "9 ani experienta",
      specialty: "Skin fade, crop texturat, styling modern.",
    },
    {
      name: "Mihai R.",
      role: "Barber",
      experience: "6 ani experienta",
      specialty: "Barba premium, contur clasic, grooming business.",
    },
    {
      name: "David C.",
      role: "Style Specialist",
      experience: "4 ani experienta",
      specialty: "Look urban, consultanta de forma si volum.",
    },
  ] as Barber[],
  gallery: [
    { title: "Low Fade Texture", gradient: "linear-gradient(135deg, #57534e, #09090b)" },
    { title: "Beard Precision", gradient: "linear-gradient(135deg, #92400e, #09090b)" },
    { title: "Classic Side Part", gradient: "linear-gradient(135deg, #27272a, #525252)" },
    { title: "Modern Crop", gradient: "linear-gradient(135deg, #1f2937, #3f3f46)" },
    { title: "Taper Clean", gradient: "linear-gradient(135deg, #404040, #0c0a09)" },
    { title: "Sharp Line Up", gradient: "linear-gradient(135deg, #3f3f46, #09090b)" },
    { title: "Buzz + Beard", gradient: "linear-gradient(135deg, #57534e, #18181b)" },
    { title: "Wave Styling", gradient: "linear-gradient(135deg, #262626, #020617)" },
  ] as GalleryItem[],
  testimonials: [
    {
      name: "Andrei M.",
      text: "Programare rapida, atmosfera super buna si un fade impecabil.",
      rating: "5/5",
    },
    {
      name: "Radu T.",
      text: "Servicii foarte curate, oameni punctuali si atenti la detalii.",
      rating: "5/5",
    },
    {
      name: "Cosmin P.",
      text: "Cel mai bun combo tuns + barba pe care l-am incercat in zona.",
      rating: "5/5",
    },
    {
      name: "Bogdan L.",
      text: "Mi-au recomandat un stil care chiar mi se potriveste. Revin lunar.",
      rating: "5/5",
    },
    {
      name: "Stefan D.",
      text: "Salon curat, muzica buna si tuns executat exact cum am cerut.",
      rating: "5/5",
    },
    {
      name: "Vlad N.",
      text: "Am venit pentru barba si am plecat cu un look complet nou.",
      rating: "5/5",
    },
    {
      name: "Ciprian A.",
      text: "Foarte profesionisti, punctuali si consecventi la fiecare vizita.",
      rating: "5/5",
    },
    {
      name: "Paul S.",
      text: "Fade-ul a iesit impecabil, iar consultanta de stil chiar m-a ajutat.",
      rating: "5/5",
    },
    {
      name: "Ionut B.",
      text: "Programarea pe telefon a fost simpla si am intrat fix la ora stabilita.",
      rating: "5/5",
    },
    {
      name: "Marius C.",
      text: "Super experienta de la inceput pana la final, recomand fara ezitare.",
      rating: "5/5",
    },
  ] as Testimonial[],
};

export const getServiceBySlug = (slug: string) =>
  siteData.services.find((service) => service.slug === slug);
