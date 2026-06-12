import Image from 'next/image'
import Link from 'next/link'

type LogoVariant = 'header' | 'hero' | 'footer'

export const Logo = ({
  className = '',
  href = '/',
  linked = true,
  showWordmark = true,
  variant = 'header',
}: {
  className?: string
  href?: string
  linked?: boolean
  showWordmark?: boolean
  variant?: LogoVariant
}) => (
  (() => {
    const content = (
      <>
        <span className="site-logo__mark">
          <Image alt="Techo Solutions" src="/logo.svg" width={52} height={44} />
        </span>
        {showWordmark ? (
          <span className="site-logo__wordmark">
            <strong>Techo</strong>
            <em>Solutions</em>
          </span>
        ) : null}
      </>
    )

    const classes = ['site-logo', `site-logo--${variant}`, className].filter(Boolean).join(' ')

    if (!linked) {
      return <span className={classes}>{content}</span>
    }

    return (
      <Link className={classes} href={href}>
        {content}
      </Link>
    )
  })()
)
