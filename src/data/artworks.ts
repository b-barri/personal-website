export interface Artwork {
  id: string;
  imagePath: string;
  alt: string;
  width: number;
  height: number;
}

export const artworks: Artwork[] = [
  { id: "art-01", imagePath: "/images/artworks/art-01.jpg", alt: "Hidden beach cove framed by lush cliffs and tropical foliage", width: 1200, height: 848 },
  { id: "art-02", imagePath: "/images/artworks/art-02.jpg", alt: "Towering moss-covered cliffs with cascading waterfalls above a misty lake", width: 1200, height: 848 },
  { id: "art-03", imagePath: "/images/artworks/art-03.jpg", alt: "Glowing neon cube floating in a foggy pine forest at dusk", width: 1200, height: 848 },
  { id: "art-04", imagePath: "/images/artworks/art-04.jpg", alt: "Golden sunset over a wheat field with tall grass silhouettes", width: 1200, height: 848 },
  { id: "art-05", imagePath: "/images/artworks/art-05.jpg", alt: "Misty mountain range at sunrise with warm orange sky", width: 1200, height: 848 },
  { id: "art-06", imagePath: "/images/artworks/art-06.jpg", alt: "Northern lights dancing over snow-capped mountain peaks", width: 1200, height: 848 },
  { id: "art-07", imagePath: "/images/artworks/art-07.jpg", alt: "Alpine lake reflecting pine trees and snow-capped mountains", width: 1200, height: 848 },
  { id: "art-08", imagePath: "/images/artworks/art-08.jpg", alt: "Japanese restaurant storefront with colorful bottles and noren curtain", width: 1200, height: 1200 },
  { id: "art-09", imagePath: "/images/artworks/art-09.jpg", alt: "Portrait of a woman with blue-grey hair and botanical tattoo", width: 848, height: 1200 },
  { id: "art-10", imagePath: "/images/artworks/art-10.jpg", alt: "Profile portrait of a woman with watercolor splashes in teal and coral", width: 894, height: 1200 },
  { id: "art-11", imagePath: "/images/artworks/art-11.jpg", alt: "Mother and child embracing in a sunlit field of yellow flowers", width: 1200, height: 1131 },
  { id: "art-12", imagePath: "/images/artworks/art-12.jpg", alt: "Girl cooking in a cozy pink kitchen with morning light", width: 848, height: 1200 },
];
