export interface Artwork {
  id: string;
  imagePath: string;
  alt: string;
  width: number;
  height: number;
}

export const artworks: Artwork[] = [
  { id: "piece-01", imagePath: "/images/artworks/piece-01.png", alt: "Abstract purple composition", width: 400, height: 500 },
  { id: "piece-02", imagePath: "/images/artworks/piece-02.png", alt: "Pink landscape study", width: 500, height: 375 },
  { id: "piece-03", imagePath: "/images/artworks/piece-03.png", alt: "Green geometric pattern", width: 450, height: 450 },
  { id: "piece-04", imagePath: "/images/artworks/piece-04.png", alt: "Orange portrait illustration", width: 375, height: 525 },
  { id: "piece-05", imagePath: "/images/artworks/piece-05.png", alt: "Cyan abstract waves", width: 500, height: 400 },
  { id: "piece-06", imagePath: "/images/artworks/piece-06.png", alt: "Violet figure study", width: 400, height: 550 },
  { id: "piece-07", imagePath: "/images/artworks/piece-07.png", alt: "Amber warm tones", width: 475, height: 350 },
  { id: "piece-08", imagePath: "/images/artworks/piece-08.png", alt: "Red square composition", width: 425, height: 425 },
  { id: "piece-09", imagePath: "/images/artworks/piece-09.png", alt: "Blue portrait piece", width: 350, height: 500 },
  { id: "piece-10", imagePath: "/images/artworks/piece-10.png", alt: "Emerald panoramic scene", width: 500, height: 325 },
  { id: "piece-11", imagePath: "/images/artworks/piece-11.png", alt: "Rose-tinted portrait", width: 400, height: 475 },
  { id: "piece-12", imagePath: "/images/artworks/piece-12.png", alt: "Lime green landscape", width: 450, height: 375 },
];
