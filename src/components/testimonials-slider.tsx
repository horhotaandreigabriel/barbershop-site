"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/site-data";

type TestimonialsSliderProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsSlider({ testimonials }: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <div className="mt-8">
      <article className="rounded-3xl border border-line bg-surface p-6 md:p-8">
        <p className="text-base text-foreground/85 md:text-lg">&quot;{current.text}&quot;</p>
        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="font-semibold text-accent">{current.name}</p>
          <p className="text-muted">{current.rating}</p>
        </div>
      </article>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          Review {currentIndex + 1} / {testimonials.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevious}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold tracking-[0.12em] transition hover:border-accent"
          >
            Inapoi
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-full border border-accent bg-accent px-4 py-2 text-xs font-bold tracking-[0.12em] text-black transition hover:bg-transparent hover:text-accent"
          >
            Inainte
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={`${testimonial.name}-${index}`}
            type="button"
            aria-label={`Mergi la review ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 w-7 rounded-full transition ${
              index === currentIndex ? "bg-accent" : "bg-line hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
