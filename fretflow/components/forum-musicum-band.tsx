import Image from "next/image";

export function ForumMusicumBand() {
  return (
    <section aria-label="Ciekawostka koncertowa" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl bg-sky-50 md:mx-0 md:max-w-none">
            <Image
              src="/images/forum-musicum.png"
              alt="Występ na Narodowym Forum Muzyki, Forum Musicum"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-[center_30%]"
            />
          </div>

          <div className="space-y-3 text-center md:space-y-4 md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 sm:text-sm sm:tracking-wider">
              Ciekawostka
            </p>
            <h2 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.015em] text-slate-900 sm:text-2xl lg:text-3xl">
              Uczysz się od muzyka ze sceny, nie tylko z sali lekcyjnej
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-muted sm:text-base lg:text-lg">
              Z zespołem The Medievals gram po całej Polsce – w pałacach,
              zamkach, muzeach oraz na mniejszych i większych scenach. Ostatnio
              mogłem też zagrać koncert w prestiżowym Narodowym Forum Muzyki.
              Przekazuję realny warsztat estradowy, a nie suchą teorię z
              podręcznika.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
