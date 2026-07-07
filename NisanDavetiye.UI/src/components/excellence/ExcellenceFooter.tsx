import { excellenceAssets } from '../../excellence/assets'
import { FadeIn } from './FadeIn'

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export function ExcellenceFooter({
  names,
  dateStr,
}: {
  names: string
  dateStr: string
}) {
  return (
    <footer className="ex-footer">
      <FadeIn>
        <img
          src={excellenceAssets.monogram}
          alt=""
          className="ex-footer__monogram ornament-img"
          draggable={false}
          onError={hideOnError}
        />
        <p className="ex-footer__names">{names}</p>
        <p className="ex-footer__date">{dateStr}</p>
      </FadeIn>
    </footer>
  )
}
