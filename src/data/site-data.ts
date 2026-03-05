export type Service = {
  name: string;
  duration: string;
  price: string;
  description: string;
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
      name: "Tuns Classic",
      duration: "35 min",
      price: "80 RON",
      description: "Consultanta rapida, tuns precis si styling de final.",
    },
    {
      name: "Skin Fade",
      duration: "45 min",
      price: "95 RON",
      description: "Degradare curata cu tranzitii fine si simetrie perfecta.",
    },
    {
      name: "Tuns + Barba",
      duration: "60 min",
      price: "130 RON",
      description: "Pachet complet pentru look fresh si contur definit.",
    },
    {
      name: "Aranjat Barba",
      duration: "30 min",
      price: "65 RON",
      description: "Contur, uniformizare, prosop cald si finisare premium.",
    },
    {
      name: "Contur Rapid",
      duration: "20 min",
      price: "45 RON",
      description: "Retus rapid pentru pastrarea formei intre tunsori.",
    },
    {
      name: "Pachet VIP",
      duration: "80 min",
      price: "170 RON",
      description: "Tuns, barba, spalare, masaj scalp si styling dedicat.",
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
