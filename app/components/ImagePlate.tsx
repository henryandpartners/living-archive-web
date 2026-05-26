import Image from 'next/image';

export interface ImagePlateProps {
  src: string;
  alt: string;
  plateId: string;       // e.g. "03"
  caption: string;
  aspect?: '3/2' | '16/9';
  fullBleed?: boolean;
}

export function ImagePlate({ src, alt, plateId, caption, aspect = '3/2', fullBleed }: ImagePlateProps) {
  return (
    <figure className={(fullBleed ? '-mx-6 ' : '') + 'my-10'}>
      <div className={'relative overflow-hidden rounded-sm bg-bg-elev ' + (aspect === '16/9' ? 'aspect-video' : 'aspect-[3/2]')}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 680px, 100vw" />
      </div>
      <figcaption className="mt-3 font-mono text-[11px] tracking-[0.04em] text-text-faint leading-[1.5]">
        <span className="text-accent mr-3">Plate {plateId}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
