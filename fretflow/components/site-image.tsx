import Image, { type ImageProps } from "next/image";

import { SITE_IMAGES, type SiteImageKey } from "@/lib/media";

type SiteImageProps = Omit<ImageProps, "src"> & {
  asset: SiteImageKey;
};

/** Optimized image from the shared registry — one file, many sections. */
export function SiteImage({
  asset,
  alt,
  quality = 70,
  ...rest
}: SiteImageProps) {
  return (
    <Image src={SITE_IMAGES[asset]} alt={alt} quality={quality} {...rest} />
  );
}
