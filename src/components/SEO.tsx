import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'book' | 'profile';
  canonicalUrl?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const DEFAULT_TITLE = "BSMI Anatomy - Odam Anatomiyasi Bo'yicha Interaktiv Ta'lim Portali";
const DEFAULT_DESCRIPTION = "Buxoro Davlat Tibbiyot Instituti Odam anatomiyasi kafedrasi elektron ta'lim platformasi. 1, 2, 3-semestr to'liq nazariy darsliklari, 1200+ interaktiv testlar, 3D modellar va lotincha anatomik lug'at.";
const DEFAULT_KEYWORDS = "anatomiya, odam anatomiyasi, tibbiyot, BSMI, anatomiya testlari, 3D anatomiya, osteologiya, miologiya, splanxnologiya, nevrologiya, lotincha terminlar, tibbiyot instituti";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&h=630&q=80";
const SITE_NAME = "BSMI Medical Anatomy";

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  publishedTime,
  modifiedTime,
  author = "BSMI Odam Anatomiyasi Kafedrasi"
}: SEOProps) {
  const location = useLocation();
  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : '';
  const finalCanonical = canonicalUrl || currentUrl;

  const fullTitle = title 
    ? (title.includes('BSMI') ? title : `${title} | BSMI Anatomy`)
    : DEFAULT_TITLE;

  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": ogType === 'article' ? "MedicalWebPage" : "EducationalOrganization",
    "name": fullTitle,
    "description": description,
    "url": finalCanonical,
    "image": ogImage,
    "provider": {
      "@type": "CollegeOrUniversity",
      "name": "Buxoro Davlat Tibbiyot Instituti",
      "alternateName": "BSMI"
    },
    ...(ogType === 'article' && {
      "author": {
        "@type": "Organization",
        "name": author
      },
      ...(publishedTime && { "datePublished": publishedTime }),
      ...(modifiedTime && { "dateModified": modifiedTime })
    })
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={finalCanonical} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook / Telegram / WhatsApp */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="uz_UZ" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific metadata */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  );
}

export default SEO;
