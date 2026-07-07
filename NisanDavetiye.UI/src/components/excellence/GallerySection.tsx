import { excellenceAssets } from '../../excellence/assets'
import { GalleryUpload } from '../GalleryUpload'
import { FadeIn } from './FadeIn'
import { FloatingOrnament } from './FloatingOrnament'
import { ExcellenceSectionHeader } from './SectionHeader'

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export function GallerySection() {
  return (
    <section className="ex-section ex-gallery">
      <div className="ex-gallery__inner">
        <FloatingOrnament
          src={excellenceAssets.rosesTopLeft}
          className="ex-gallery__rose ex-gallery__rose--tl ornament-img"
          motion="roses-tl"
          onError={hideOnError}
        />
        <FloatingOrnament
          src={excellenceAssets.rosesBottomRight}
          className="ex-gallery__rose ex-gallery__rose--br ornament-img"
          motion="roses-br"
          onError={hideOnError}
        />

        <FadeIn>
          <ExcellenceSectionHeader
            title="Galeri"
            titleScript
            subtitle="Anılarınız"
            description="Törende çektiğiniz fotoğrafları bizimle paylaşın."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <GalleryUpload />
        </FadeIn>
      </div>
    </section>
  )
}
