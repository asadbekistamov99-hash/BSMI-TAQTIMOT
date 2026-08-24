import { useSettings, normalizeTelegram } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';

export default function Footer() {
  const { settings } = useSettings();
  const { t, getLocalized } = useLanguage();

  const telegramBot = normalizeTelegram(settings.telegramBotUsername || '@Medai_support_bot');
  
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 text-white mb-6">
              <div className="w-10 h-10 flex items-center justify-center p-1 overflow-hidden rounded-full border border-white/20 bg-white">
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteName} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://api.iconify.design/healthicons:anatomy-outline.svg?color=38bdf8";
                  }}
                />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">{settings.siteName}</span>
            </div>
            <p className="text-[13px] leading-relaxed font-medium">
              {settings.tagline ? `${settings.tagline}. ` : ''}{getLocalized(settings.footerAboutDesc) || t('footer.about')}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{getLocalized(settings.footerSectionsTitle) || t('footer.sections_title')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/semester/1" className="hover:text-indigo-400 transition-colors">{t('footer.semester1')}</a></li>
              <li><a href="/semester/2" className="hover:text-indigo-400 transition-colors">{t('footer.semester2')}</a></li>
              <li><a href="/semester/3" className="hover:text-indigo-400 transition-colors">{t('footer.semester3')}</a></li>
              <li><a href="/atlas" className="hover:text-indigo-400 transition-colors">{t('footer.3d_atlas')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{getLocalized(settings.footerContactTitle) || t('footer.contact')}</h3>
            {settings.footerAddress && <p className="text-sm mb-1">{getLocalized(settings.footerAddress) || t('footer.address')}</p>}
            
            {settings.contactEmail && (
              <p className="text-sm mt-1">
                {settings.contactEmail.includes('@') && !settings.contactEmail.startsWith('@') && !settings.contactEmail.toLowerCase().includes('medai_support') ? (
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-indigo-400 transition-colors">
                    {settings.contactEmail}
                  </a>
                ) : (settings.contactEmail.toLowerCase().includes('medai_support') || settings.contactEmail.startsWith('@')) ? (
                  <span className="flex items-center gap-1.5">
                    Telegram: 
                    <a 
                      href={`https://t.me/${normalizeTelegram(settings.contactEmail).replace('@', '').trim()}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sky-400 hover:text-indigo-400 transition-colors underline font-bold"
                    >
                      {normalizeTelegram(settings.contactEmail)}
                    </a>
                  </span>
                ) : (
                  <span>{settings.contactEmail}</span>
                )}
              </p>
            )}

            {settings.contactPhone && (
              <p className="text-sm mt-1">
                {(settings.contactPhone.toLowerCase().includes('medai_support') || settings.contactPhone.startsWith('@')) ? (
                  <span className="flex items-center gap-1.5">
                    Telegram: 
                    <a 
                      href={`https://t.me/${normalizeTelegram(settings.contactPhone).replace('@', '').trim()}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-sky-400 hover:text-indigo-400 transition-colors underline font-bold"
                    >
                      {normalizeTelegram(settings.contactPhone)}
                    </a>
                  </span>
                ) : (
                  <a href={`tel:${settings.contactPhone.replace(/\s+/g, '')}`} className="hover:text-indigo-400 transition-colors">
                    {settings.contactPhone}
                  </a>
                )}
              </p>
            )}

            {telegramBot && 
             !settings.contactEmail?.toLowerCase().includes('medai_support') && 
             !settings.contactPhone?.toLowerCase().includes('medai_support') && (
              <p className="text-sm mt-1 flex items-center gap-1.5">
                Telegram: 
                <a 
                  href={`https://t.me/${telegramBot.replace('@', '').trim()}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sky-400 hover:text-indigo-400 transition-colors underline font-bold"
                >
                  {telegramBot}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-xs">{getLocalized(settings.footerText) || `© ${new Date().getFullYear()} ${settings.siteName || 'BSMI ANATOMY'}. ${t('footer.rights')}`}</p>
        </div>
      </div>
    </footer>
  );
}
