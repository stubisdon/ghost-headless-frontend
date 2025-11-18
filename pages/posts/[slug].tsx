import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { getPost, getPosts, getSiteSettings, GhostPost, GhostSettings } from '@/lib/ghost-api'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PostProps {
  post: GhostPost
  settings: GhostSettings
}

export default function Post({ post, settings }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | {settings.title}</title>
        <meta name="description" content={post.excerpt || post.custom_excerpt || settings.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={settings.icon || '/favicon.ico'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || settings.description} />
        {post.feature_image && (
          <meta property="og:image" content={post.feature_image} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || settings.description} />
        {post.feature_image && (
          <meta name="twitter:image" content={post.feature_image} />
        )}
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header settings={settings} />
        
        <main className="flex-1">
          <article className="post">
            <div className="container">
              <header className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {post.primary_author && (
                    <span className="post-author">by {post.primary_author.name}</span>
                  )}
                </div>
              </header>

              {post.feature_image && (
                <figure className="post-image">
                  <Image
                    src={post.feature_image}
                    alt={post.title}
                    width={1200}
                    height={600}
                    className="post-image-img"
                  />
                </figure>
              )}

              <div 
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {post.tags && post.tags.length > 0 && (
                <footer className="post-footer">
                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="post-tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </footer>
              )}
            </div>
          </article>
        </main>

        <Footer settings={settings} />
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts(100) // Get more posts for paths
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: 'blocking', // Generate on-demand if not found
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPost(slug)
  const settings = await getSiteSettings()

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
      settings,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}

