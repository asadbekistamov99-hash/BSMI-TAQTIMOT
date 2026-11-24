import type { ReactElement } from 'react';
import { BONES, BoneRegion } from '../lib/boneTypingEngine';

// Oddiy, original chizma: old ko'rinish, ikki tomoni. Suyaklar to'liq anatomik emas, o'quv uchun sxematik.
// Har bir element bitta suyak id'siga bog'langan (BONES dagi id bilan bir xil).

type Props = {
  highlight?: string | null;
  // Mavzu rejimida faqat shu mintaqalar ajratiladi, qolganlari xira ko'rinadi.
  focusRegions?: BoneRegion[] | 'all';
};

const regionOf: Record<string, BoneRegion> = Object.fromEntries(BONES.map((b) => [b.id, b.region]));

export default function BoneFigure({ highlight, focusRegions = 'all' }: Props) {
  const isFocus = (id: string) => focusRegions === 'all' || focusRegions.includes(regionOf[id]);

  const fillOf = (id: string) => {
    if (highlight === id) return '#CC0F0F';
    return isFocus(id) ? '#E2E8F0' : '#F1F5F9';
  };
  const strokeOf = (id: string) => {
    if (highlight === id) return '#7F1D1D';
    return isFocus(id) ? '#94A3B8' : '#CBD5E1';
  };
  const lineOf = (id: string) => (highlight === id ? '#CC0F0F' : isFocus(id) ? '#CBD5E1' : '#E2E8F0');

  // Juft suyaklar: o'ng tomon chap tomonning oynali nusxasi.
  const Both = ({ children }: { children: (side: 'L' | 'R') => ReactElement }) => (
    <>
      {children('L')}
      <g transform="translate(200 0) scale(-1 1)">{children('R')}</g>
    </>
  );

  return (
    <svg viewBox="0 0 200 620" role="img" aria-label="Suyak sxemasi" className="h-full w-auto max-w-full">
      {/* Bosh suyagi */}
      <g>
        <ellipse cx="100" cy="98" rx="26" ry="12" fill={fillOf('occipital')} stroke={strokeOf('occipital')} />
        <ellipse cx="100" cy="42" rx="30" ry="20" fill={fillOf('frontal')} stroke={strokeOf('frontal')} />
        <ellipse cx="100" cy="72" rx="36" ry="20" fill={fillOf('parietal')} stroke={strokeOf('parietal')} />
        <Both>{() => <ellipse cx="66" cy="80" rx="11" ry="16" fill={fillOf('temporal')} stroke={strokeOf('temporal')} />}</Both>
        <ellipse cx="100" cy="84" rx="14" ry="6" fill={fillOf('sphenoid')} stroke={strokeOf('sphenoid')} />
        <rect x="97" y="88" width="6" height="8" rx="2" fill={fillOf('ethmoid')} stroke={strokeOf('ethmoid')} />
        <ellipse cx="100" cy="106" rx="24" ry="10" fill={fillOf('maxilla')} stroke={strokeOf('maxilla')} />
        <path d="M 72 110 Q 100 142 128 110 L 124 118 Q 100 134 76 118 Z" fill={fillOf('mandible')} stroke={strokeOf('mandible')} />
      </g>

      {/* Bo'yin umurtqalari */}
      <g>
        {[150, 162, 174].map((y) => (
          <circle key={y} cx="100" cy={y} r="7" fill={fillOf('cervical')} stroke={strokeOf('cervical')} />
        ))}
      </g>

      {/* Ko'krak qafasi */}
      <Both>{() => <line x1="100" y1="186" x2="68" y2="182" stroke={lineOf('clavicle')} strokeWidth="5" strokeLinecap="round" />}</Both>
      <Both>{() => <path d="M 72 190 L 52 214 L 66 236 L 80 210 Z" fill={fillOf('scapula')} stroke={strokeOf('scapula')} />}</Both>
      <g>
        {[200, 222, 244].map((y) => (
          <path key={y} d={`M 98 ${y} Q 70 ${y - 6} 62 ${y + 24}`} fill="none" stroke={lineOf('rib')} strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
      <g>
        <rect x="96" y="190" width="8" height="52" rx="3" fill={fillOf('sternum')} stroke={strokeOf('sternum')} />
      </g>
      <g>
        {[190, 208, 226, 244, 262, 280].map((y) => (
          <rect key={y} x="93" y={y} width="14" height="10" rx="3" fill={fillOf('thoracic')} stroke={strokeOf('thoracic')} />
        ))}
      </g>

      {/* Bel va dumg'aza */}
      <g>
        {[300, 316, 332, 348].map((y) => (
          <rect key={y} x="91" y={y} width="18" height="12" rx="3" fill={fillOf('lumbar')} stroke={strokeOf('lumbar')} />
        ))}
      </g>
      <path d="M 92 364 L 108 364 L 102 392 L 98 392 Z" fill={fillOf('sacrum')} stroke={strokeOf('sacrum')} />
      <ellipse cx="100" cy="402" rx="5" ry="7" fill={fillOf('coccyx')} stroke={strokeOf('coccyx')} />

      {/* Yuqori oyoq-qo'l */}
      <Both>{() => <line x1="68" y1="190" x2="50" y2="262" stroke={lineOf('humerus')} strokeWidth="11" strokeLinecap="round" />}</Both>
      <Both>{() => <line x1="50" y1="266" x2="36" y2="334" stroke={lineOf('radius')} strokeWidth="7" strokeLinecap="round" />}</Both>
      <Both>{() => <line x1="58" y1="266" x2="46" y2="334" stroke={lineOf('ulna')} strokeWidth="6" strokeLinecap="round" />}</Both>
      <Both>{() => <ellipse cx="40" cy="342" rx="5" ry="4" fill={fillOf('scaphoid')} stroke={strokeOf('scaphoid')} />}</Both>
      <Both>{() => <ellipse cx="47" cy="342" rx="4" ry="4" fill={fillOf('lunate')} stroke={strokeOf('lunate')} />}</Both>
      <Both>{() => (
        <g>
          <line x1="40" y1="352" x2="36" y2="382" stroke={lineOf('metacarpal')} strokeWidth="4" strokeLinecap="round" />
          <line x1="46" y1="352" x2="43" y2="384" stroke={lineOf('metacarpal')} strokeWidth="4" strokeLinecap="round" />
          <line x1="52" y1="352" x2="50" y2="382" stroke={lineOf('metacarpal')} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}</Both>

      {/* Chanoq va pastki oyoq-qo'l */}
      <Both>{() => <path d="M 100 352 Q 70 330 62 350 Q 60 378 92 384 L 100 368 Z" fill={fillOf('hip-bone')} stroke={strokeOf('hip-bone')} />}</Both>
      <Both>{() => <line x1="80" y1="382" x2="82" y2="470" stroke={lineOf('femur')} strokeWidth="13" strokeLinecap="round" />}</Both>
      <Both>{() => <circle cx="82" cy="478" r="7" fill={fillOf('patella')} stroke={strokeOf('patella')} />}</Both>
      <Both>{() => <line x1="84" y1="488" x2="80" y2="572" stroke={lineOf('tibia')} strokeWidth="10" strokeLinecap="round" />}</Both>
      <Both>{() => <line x1="92" y1="488" x2="90" y2="570" stroke={lineOf('fibula')} strokeWidth="5" strokeLinecap="round" />}</Both>
      <Both>{() => <ellipse cx="80" cy="580" rx="8" ry="5" fill={fillOf('talus')} stroke={strokeOf('talus')} />}</Both>
      <Both>{() => <ellipse cx="78" cy="592" rx="7" ry="5" fill={fillOf('calcaneus')} stroke={strokeOf('calcaneus')} />}</Both>
      <Both>{() => (
        <g>
          <line x1="70" y1="602" x2="86" y2="600" stroke={lineOf('metatarsal')} strokeWidth="4" strokeLinecap="round" />
          <line x1="72" y1="608" x2="90" y2="606" stroke={lineOf('metatarsal')} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}</Both>
    </svg>
  );
}
