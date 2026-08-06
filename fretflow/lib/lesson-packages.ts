export const lessonPackageIds = [
  "pack_4_home",
  "single_studio",
  "single_home",
  "single_online",
] as const;

export type LessonPackageId = (typeof lessonPackageIds)[number];

export type LessonPackage = {
  id: LessonPackageId;
  name: string;
  price: number;
  priceLabel: string;
  perLesson: string;
  location: string;
  note: string;
  /** Longer copy for homepage pricing cards */
  details: string;
  highlight: boolean;
  /** Lessons count for student package counter */
  totalLessons: number;
  /** Suggested booking location */
  locationType: "student_home" | "studio_forum" | "online";
};

export const lessonPackages: LessonPackage[] = [
  {
    id: "pack_4_home",
    name: "Pakiet 4 lekcji z dojazdem",
    price: 400,
    priceLabel: "400 zł",
    perLesson: "100 zł za lekcję",
    location: "Z dojazdem do Ciebie w Gdańsku",
    note: "Płacisz tylko 100 zł za lekcję i oszczędzasz aż 80 zł (ponad 16 procent) na starcie.",
    details:
      "Dojeżdżam bezpośrednio do Ciebie w Gdańsku, a spersonalizowane materiały i pełne wsparcie techniczne przy instrumencie otrzymujesz w cenie.",
    highlight: true,
    totalLessons: 4,
    locationType: "student_home",
  },
  {
    id: "single_home",
    name: "Lekcja z dojazdem",
    price: 120,
    priceLabel: "120 zł",
    perLesson: "1 lekcja",
    location: "Z dojazdem do Ciebie w Gdańsku",
    note: "Cena zawiera dojazd",
    details:
      "Jedna lekcja u Ciebie. Przy regularnej nauce taniej wypada pakiet 4 lekcji z dojazdem.",
    highlight: false,
    totalLessons: 1,
    locationType: "student_home",
  },
  {
    id: "single_studio",
    name: "Lekcja stacjonarna",
    price: 100,
    priceLabel: "100 zł",
    perLesson: "1 lekcja",
    location: "U nauczyciela · okolice Galerii Forum",
    note: "Bez dojazdu",
    details: "Jedna lekcja u mnie, w punkcie tuż obok Galerii Forum.",
    highlight: false,
    totalLessons: 1,
    locationType: "studio_forum",
  },
  {
    id: "single_online",
    name: "Lekcja online",
    price: 80,
    priceLabel: "80 zł",
    perLesson: "1 lekcja · Telegram",
    location: "Online · Telegram",
    note: "Czysty dźwięk + materiały na tablecie",
    details:
      "Łączymy się na Telegramie — jako jedyny nie zabiera rejestru dźwięku instrumentu. Na tablecie udostępniam materiały na żywo, żebyś widział nuty, chwyty i wskazówki równolegle z lekcją.",
    highlight: false,
    totalLessons: 1,
    locationType: "online",
  },
];

export const lessonPackageById = Object.fromEntries(
  lessonPackages.map((pkg) => [pkg.id, pkg]),
) as Record<LessonPackageId, LessonPackage>;

export function lessonPackageLabel(id: string | null | undefined) {
  if (!id) return null;
  const pkg = lessonPackageById[id as LessonPackageId];
  if (!pkg) return id;
  return `${pkg.name} · ${pkg.priceLabel}`;
}
