import Link from 'next/link'
import Image from 'next/image'
import { GhostSettings } from '@/lib/ghost-api'

interface HeaderProps {
  settings: GhostSettings
}

export default function Header({ settings }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container">
        <nav className="site-nav">
          <div className="site-nav-left">
            <Link href="/" className="site-logo">
              {settings.logo ? (
                <Image
                  src={settings.logo}
                  alt={settings.title}
                  width={120}
                  height={40}
                  className="site-logo-img"
                />
              ) : (
                <span className="site-logo-text">{settings.title}</span>
              )}
            </Link>
          </div>
          <div className="site-nav-right">
            {settings.navigation && settings.navigation.length > 0 && (
              <>
                {settings.navigation.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    className="nav-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

