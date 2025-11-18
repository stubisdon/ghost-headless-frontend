import Link from 'next/link'
import { GhostSettings } from '@/lib/ghost-api'

interface FooterProps {
  settings: GhostSettings
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-content">
          <section className="copyright">
            <Link href="/">{settings.title}</Link> &copy; {currentYear}
          </section>
          {settings.secondary_navigation && settings.secondary_navigation.length > 0 && (
            <nav className="site-footer-nav">
              {settings.secondary_navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className="footer-link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}

