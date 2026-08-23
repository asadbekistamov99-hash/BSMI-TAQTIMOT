import React from 'react';

interface AnatomyAtlasBackdropProps {
  diagramId: string;
  zoomLevel: number;
  highlightedPinNumber?: number | null;
}

export default function AnatomyAtlasBackdrop({
  diagramId,
  zoomLevel,
}: AnatomyAtlasBackdropProps) {
  return (
    <div 
      className="relative w-full h-full transition-transform duration-300 ease-out origin-center flex items-center justify-center p-2"
      style={{ transform: `scale(${zoomLevel})` }}
    >
      {/* 1. HUMAN SKULL - NORMA FRONTALIS (KALLA SUYAGI OLDINGI KO'RINIShI) */}
      {diagramId.includes('skull') && (
        <svg 
          viewBox="0 0 500 480" 
          className="w-full h-full max-w-[540px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="boneFrontal" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="orbitCavity" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="75%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <radialGradient id="nasalCavity" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="80%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <linearGradient id="sutureGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Atmospheric Glow */}
          <ellipse cx="250" cy="240" rx="190" ry="210" fill="url(#sutureGlow)" className="blur-xl" />

          {/* Cranial Vault (Calvaria) */}
          <path
            d="M 250 45 C 150 45, 105 110, 105 210 C 105 270, 125 310, 145 340 C 155 355, 175 425, 250 435 C 325 425, 345 355, 355 340 C 375 310, 395 270, 395 210 C 395 110, 350 45, 250 45 Z"
            fill="url(#boneFrontal)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* Sutura Coronalis & Sagittalis & Frontalis */}
          <path d="M 250 45 L 250 120" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 250 85 C 200 90, 150 120, 120 170" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />
          <path d="M 250 85 C 300 90, 350 120, 380 170" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Superciliary Arches & Glabella */}
          <path d="M 180 205 Q 215 195 250 205 Q 285 195 320 205" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

          {/* Orbits (Ko'z kosalari) */}
          <ellipse cx="185" cy="235" rx="36" ry="32" fill="url(#orbitCavity)" stroke="#475569" strokeWidth="3" />
          <ellipse cx="315" cy="235" rx="36" ry="32" fill="url(#orbitCavity)" stroke="#475569" strokeWidth="3" />
          {/* Fissura orbitalis superior & Optic canal inside orbits */}
          <path d="M 175 230 L 195 245" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 325 230 L 305 245" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />

          {/* Nasal Bone (Os nasale) */}
          <polygon points="242,205 258,205 262,238 238,238" fill="#f1f5f9" stroke="#475569" strokeWidth="1.5" />
          <line x1="250" y1="205" x2="250" y2="238" stroke="#64748b" strokeWidth="1" />

          {/* Apertura Piriformis (Noksimon teshik) & Vomer */}
          <path d="M 238 238 C 228 270, 235 300, 250 308 C 265 300, 272 270, 262 238 Z" fill="url(#nasalCavity)" stroke="#475569" strokeWidth="2.5" />
          <line x1="250" y1="240" x2="250" y2="305" stroke="#94a3b8" strokeWidth="2.5" />
          <path d="M 240 280 C 245 285, 248 290, 250 290 C 252 290, 255 285, 260 280" stroke="#64748b" strokeWidth="2" fill="none" />

          {/* Zygomatic Arches (Yonoq suyaklari) */}
          <path d="M 145 235 C 130 255, 135 285, 165 295 L 180 270" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M 355 235 C 370 255, 365 285, 335 295 L 320 270" stroke="#475569" strokeWidth="2" fill="none" />

          {/* Maxilla & Alveolar Process (Yuqori jag') */}
          <path d="M 180 270 C 180 325, 230 330, 250 330 C 270 330, 320 325, 320 270" stroke="#475569" strokeWidth="2" fill="none" />
          {/* Upper Teeth Row */}
          <path d="M 200 328 Q 250 336 300 328" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <path d="M 215 325 L 215 332 M 230 326 L 230 334 M 245 327 L 245 335 M 255 327 L 255 335 M 270 326 L 270 334 M 285 325 L 285 332" stroke="#64748b" strokeWidth="1.5" />

          {/* Mandible (Pastki jag') */}
          <path
            d="M 148 335 C 155 385, 195 425, 250 425 C 305 425, 345 385, 352 335 L 320 335 C 315 375, 285 395, 250 395 C 215 395, 185 375, 180 335 Z"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="2.5"
          />
          {/* Lower Teeth Row */}
          <path d="M 205 342 Q 250 348 295 342" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          {/* Mental Protuberance (Iyak do'mbog'i) */}
          <ellipse cx="250" cy="412" rx="20" ry="7" fill="#f8fafc" opacity="0.7" />
          <circle cx="215" cy="380" r="3" fill="#334155" />
          <circle cx="285" cy="380" r="3" fill="#334155" />
        </svg>
      )}

      {/* 2. HUMERUS (YELKA SUYAGI) */}
      {diagramId.includes('humerus') && (
        <svg 
          viewBox="0 0 340 540" 
          className="w-full h-full max-w-[340px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="boneHumerus" cx="45%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="humerusHead" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="170" cy="270" rx="90" ry="240" fill="#38bdf8" opacity="0.1" className="blur-xl" />

          {/* Full Bone Body */}
          <path
            d="M 185 30 
               C 215 30, 225 65, 195 90 
               C 185 100, 180 130, 178 180 
               C 174 240, 168 300, 172 380 
               C 174 420, 195 470, 205 500 
               C 200 520, 150 525, 135 500 
               C 130 470, 152 420, 154 380 
               C 158 300, 152 240, 155 180 
               C 158 130, 140 100, 140 70 
               C 140 40, 160 30, 185 30 Z"
            fill="url(#boneHumerus)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* 1. Caput humeri (Spherical Head) */}
          <path
            d="M 160 30 C 200 25, 220 55, 195 90 C 180 75, 165 55, 160 30 Z"
            fill="url(#humerusHead)"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Collum Anatomicum (Groove) */}
          <path d="M 160 30 C 175 60, 180 75, 195 90" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />

          {/* 3. Tuberculum majus & minus */}
          <path d="M 140 50 C 135 70, 145 90, 158 95" stroke="#475569" strokeWidth="2" />
          <path d="M 155 85 L 165 110" stroke="#64748b" strokeWidth="1.5" />

          {/* 4. Collum Chirurgicum */}
          <path d="M 140 100 Q 170 110 190 95" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />

          {/* 5. Tuberositas Deltoidea (Roughness) */}
          <path d="M 152 230 C 148 250, 148 265, 154 280" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 155 240 L 162 255 M 154 255 L 160 270" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Distal End (Trochlea & Capitulum & Epicondyles) */}
          <ellipse cx="145" cy="500" rx="16" ry="14" fill="url(#humerusHead)" stroke="#64748b" strokeWidth="2" />
          <ellipse cx="178" cy="505" rx="20" ry="15" fill="url(#humerusHead)" stroke="#64748b" strokeWidth="2" />
          <circle cx="198" cy="495" r="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          {/* Fossa coronoidea / olecrani */}
          <ellipse cx="168" cy="480" rx="10" ry="6" fill="#1e293b" opacity="0.7" />
        </svg>
      )}

      {/* 3. ULNA (TIRSAK SUYAGI) */}
      {diagramId.includes('ulna') && (
        <svg 
          viewBox="0 0 320 540" 
          className="w-full h-full max-w-[320px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="boneUlna" cx="45%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="notchUlna" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="80%" stopColor="#334155" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="160" cy="270" rx="80" ry="240" fill="#2dd4bf" opacity="0.1" className="blur-xl" />

          {/* Main Ulna Silhouette */}
          <path
            d="M 155 25 
               C 180 25, 185 50, 180 75 
               C 175 95, 185 110, 172 135 
               C 165 150, 166 220, 164 340 
               C 162 420, 160 480, 163 515 
               C 160 525, 150 525, 148 515 
               C 146 480, 148 420, 150 340 
               C 152 220, 148 150, 140 120 
               C 135 90, 135 60, 140 40 
               C 142 30, 148 25, 155 25 Z"
            fill="url(#boneUlna)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* 1. Olecranon (Massive Top Hook) */}
          <path
            d="M 142 30 C 150 22, 170 22, 178 35 C 182 55, 175 70, 168 75 C 155 75, 142 65, 142 30 Z"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* 2. Incisura Trochlearis (Deep C-Notch) */}
          <path
            d="M 148 55 C 170 55, 175 75, 155 85 C 145 92, 148 100, 170 95"
            stroke="#0284c7"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="158" cy="72" rx="14" ry="10" fill="url(#notchUlna)" opacity="0.6" />

          {/* 3. Processus Coronoideus (Beak) */}
          <path d="M 148 95 L 175 92 L 165 115 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

          {/* 4. Tuberositas Ulnae */}
          <path d="M 148 115 C 146 130, 158 135, 160 120 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

          {/* 5. Interosseous Border (Sharp Ridge) */}
          <path d="M 144 140 L 152 480" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" />

          {/* 6. Distal Head & Styloid Process */}
          <circle cx="156" cy="510" r="8" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
          <path d="M 152 516 L 150 530 L 156 524 Z" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
        </svg>
      )}

      {/* 4. FEMUR (SON SUYAGI) */}
      {diagramId.includes('femur') && (
        <svg 
          viewBox="0 0 340 540" 
          className="w-full h-full max-w-[340px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="boneFemur" cx="45%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="40%" stopColor="#e2e8f0" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="femurHead" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="170" cy="270" rx="90" ry="240" fill="#f59e0b" opacity="0.1" className="blur-xl" />

          {/* Femur Bone Body */}
          <path
            d="M 155 35 
               C 175 20, 195 50, 185 80 
               C 195 75, 205 90, 195 110 
               C 185 125, 175 140, 172 200 
               C 168 280, 168 360, 172 440 
               C 174 465, 195 485, 195 510 
               C 185 525, 140 525, 130 510 
               C 130 485, 150 465, 152 440 
               C 156 360, 156 280, 152 200 
               C 150 140, 140 120, 140 85 
               C 140 55, 145 40, 155 35 Z"
            fill="url(#boneFemur)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* 1. Caput Femoris (Large Spheroid Ball) */}
          <circle cx="160" cy="45" r="22" fill="url(#femurHead)" stroke="#64748b" strokeWidth="2" />
          {/* 2. Fovea Capitis (Pit) */}
          <ellipse cx="162" cy="38" rx="4" ry="3" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />

          {/* 3. Collum Femoris (Oblique Neck) */}
          <path d="M 160 67 L 180 88" stroke="#475569" strokeWidth="3" strokeDasharray="3 2" />

          {/* 4. Trochanter Major (Massive Lateral) */}
          <path d="M 180 75 C 205 70, 205 100, 192 115 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

          {/* 5. Trochanter Minor (Medial Spike) */}
          <path d="M 152 110 C 142 115, 145 130, 155 125 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />

          {/* Linea Intertrochanterica */}
          <path d="M 188 100 Q 170 115 155 120" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

          {/* Shaft Contour (Corpus) */}
          <line x1="162" y1="160" x2="162" y2="420" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="12 6" />

          {/* 7 & 8. Distal Condyles (Medial & Lateral) & Patellar Surface */}
          <ellipse cx="145" cy="505" rx="16" ry="14" fill="url(#femurHead)" stroke="#64748b" strokeWidth="2" />
          <ellipse cx="180" cy="505" rx="16" ry="14" fill="url(#femurHead)" stroke="#64748b" strokeWidth="2" />
          {/* Facies patellaris groove */}
          <path d="M 150 485 Q 162 498 175 485" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      )}

      {/* 5. OS COXAE (CHANOQ SUYAGI) */}
      {diagramId.includes('coxae') && !diagramId.includes('ligament') && (
        <svg 
          viewBox="0 0 440 480" 
          className="w-full h-full max-w-[440px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bonePelvis" cx="45%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="acetabulumGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="220" cy="240" rx="170" ry="190" fill="#a855f7" opacity="0.1" className="blur-xl" />

          {/* Ala Ossis Ilii (Upper Iliac Wing) */}
          <path
            d="M 130 90 
               C 180 40, 300 45, 340 120 
               C 360 160, 330 210, 300 230 
               C 270 235, 250 250, 245 280 
               C 270 330, 275 390, 245 425 
               C 215 445, 175 425, 170 395 
               C 165 365, 185 320, 205 285 
               C 180 260, 150 230, 140 180 
               C 130 140, 120 105, 130 90 Z"
            fill="url(#bonePelvis)"
            stroke="#cbd5e1"
            strokeWidth="2.5"
          />

          {/* 1. Crista Iliaca (Thick Upper Rim) */}
          <path
            d="M 130 90 C 180 40, 300 45, 340 120"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3. Spina Iliaca Anterior Superior & Inferior */}
          <circle cx="340" cy="120" r="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
          <circle cx="320" cy="165" r="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />

          {/* 4. Acetabulum (Deep Hemispherical Cup) */}
          <ellipse cx="235" cy="285" rx="34" ry="34" fill="url(#acetabulumGrad)" stroke="#475569" strokeWidth="3" />
          {/* Facies Lunata (C-shaped articular surface) */}
          <path
            d="M 215 270 C 235 255, 260 265, 260 295 C 260 315, 235 315, 220 300"
            stroke="#e2e8f0"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Fossa acetabuli & Incisura acetabuli */}
          <ellipse cx="235" cy="285" rx="12" ry="12" fill="#020617" />
          <path d="M 220 315 L 240 315" stroke="#38bdf8" strokeWidth="3" />

          {/* 8. Foramen Obturatum (Large Lower Hole) */}
          <ellipse cx="215" cy="370" rx="26" ry="32" transform="rotate(-15 215 370)" fill="#020617" stroke="#475569" strokeWidth="2.5" />

          {/* 6. Tuber Ischiadicum (Massive Posterior Tuberosity) */}
          <path d="M 235 410 C 248 415, 255 435, 240 442 C 225 445, 220 425, 235 410 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />

          {/* 7. Os Pubis (Symphysis branch) */}
          <path d="M 180 340 L 160 375 L 180 395" stroke="#475569" strokeWidth="3" fill="none" />
        </svg>
      )}

      {/* 6. KNEE JOINT LIGAMENTS (TIZZA BO'G'IMI VA BOYLAMLARI) */}
      {diagramId.includes('knee') && (
        <svg 
          viewBox="0 0 460 480" 
          className="w-full h-full max-w-[460px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ligamentGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </radialGradient>
            <radialGradient id="cartilageGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="230" cy="240" rx="160" ry="170" fill="#38bdf8" opacity="0.12" className="blur-xl" />

          {/* Distal Femur Bone (Son suyagi pastki qismi) */}
          <path
            d="M 160 30 L 160 140 C 130 150, 110 180, 140 210 C 170 215, 195 200, 205 170 C 215 170, 225 170, 235 170 C 245 200, 270 215, 300 210 C 330 180, 310 150, 280 140 L 280 30 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />
          {/* Condyli femoris smooth cartillage caps */}
          <ellipse cx="155" cy="190" rx="30" ry="18" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <ellipse cx="285" cy="190" rx="30" ry="18" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />

          {/* Proximal Tibia Bone (Katta boldir suyagi) */}
          <path
            d="M 120 280 C 150 260, 290 260, 320 280 C 310 320, 280 360, 270 450 L 170 450 C 160 360, 130 320, 120 280 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />

          {/* Fibula Head (Kichik boldir suyagi boshi) */}
          <path d="M 115 285 C 100 300, 95 350, 115 375 L 125 450 L 140 450 L 125 285 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

          {/* 3 & 4. Menisci (Meniscus Medialis & Lateralis) */}
          <path
            d="M 125 240 C 155 235, 185 242, 190 255 C 185 262, 150 260, 125 250 Z"
            fill="url(#cartilageGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <path
            d="M 315 240 C 285 235, 255 242, 250 255 C 255 262, 290 260, 315 250 Z"
            fill="url(#cartilageGrad)"
            stroke="#0284c7"
            strokeWidth="2"
          />

          {/* 2. Ligamentum Cruciatum Anterius (ACL - under PCL) */}
          <path
            d="M 185 190 L 250 265 L 235 275 L 170 200 Z"
            fill="#94a3b8"
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* 1. Ligamentum Cruciatum Posterius (PCL - thick prominent) */}
          <path
            d="M 260 180 C 255 210, 220 250, 205 275 L 225 280 C 240 250, 275 210, 280 180 Z"
            fill="url(#ligamentGrad)"
            stroke="#475569"
            strokeWidth="2.5"
          />
          {/* Fibrous Texture Lines */}
          <path d="M 266 190 L 215 272 M 272 195 L 222 276" stroke="#64748b" strokeWidth="1" />

          {/* 7. Ligamentum Collaterale Fibulare (LCL - Lateral vertical cord) */}
          <path
            d="M 120 185 C 100 230, 95 280, 115 320"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 120 185 C 100 230, 95 280, 115 320"
            stroke="#475569"
            strokeWidth="2"
            fill="none"
          />

          {/* Ligamentum Collaterale Tibiale (MCL - Medial broad band) */}
          <path
            d="M 310 180 C 330 230, 325 300, 305 340"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 310 180 C 330 230, 325 300, 305 340"
            stroke="#475569"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      )}

      {/* 7. HIP JOINT LIGAMENTS (CHANOQ-SON BO'G'IMI BOYLAMLARI) */}
      {diagramId.includes('hip_joint') && (
        <svg 
          viewBox="0 0 460 480" 
          className="w-full h-full max-w-[460px] drop-shadow-2xl select-none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bertinGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f1f5f9" />
              <stop offset="75%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
            <radialGradient id="membraneGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>

          {/* Background Glow */}
          <ellipse cx="230" cy="240" rx="170" ry="170" fill="#f59e0b" opacity="0.1" className="blur-xl" />

          {/* Upper Ilium Bone Base */}
          <path
            d="M 240 50 C 270 50, 340 80, 360 140 C 370 170, 350 200, 320 220 L 260 180 C 255 120, 240 80, 240 50 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />

          {/* Femur Shaft & Greater Trochanter */}
          <path
            d="M 120 240 C 90 280, 70 330, 95 370 C 110 390, 115 440, 120 460 L 170 460 C 160 410, 150 360, 165 320 C 185 300, 205 270, 200 240 Z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />

          {/* 3. Trochanter Major (Massive Knob) */}
          <path d="M 85 280 C 65 310, 80 340, 105 345 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2" />

          {/* 6. Membrana Obturatoria (Obturator Membrane) */}
          <ellipse cx="320" cy="310" rx="42" ry="34" fill="url(#membraneGrad)" stroke="#64748b" strokeWidth="2.5" />
          {/* Fibrous Lattice overlay on Membrane */}
          <path d="M 290 300 Q 320 320 355 305 M 295 320 Q 325 335 350 325 M 305 285 L 335 335 M 325 285 L 345 330" stroke="#94a3b8" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Lower Pubis & Ischium Rim */}
          <path d="M 260 270 C 280 260, 360 260, 380 290 C 390 330, 360 370, 310 375 L 260 330 Z" fill="none" stroke="#475569" strokeWidth="3" />

          {/* 1. LIGAMENTUM ILIOFEMORALE (BERTIN'S LIGAMENT - Y-SHAPED INVERTED) */}
          <path
            d="M 270 120 
               C 275 160, 240 220, 195 270 
               C 170 300, 120 300, 115 280 
               C 140 240, 220 160, 270 120 Z"
            fill="url(#bertinGrad)"
            stroke="#334155"
            strokeWidth="2.5"
          />
          {/* Lateral & Medial bands of Bertin's Ligament */}
          <path d="M 270 120 L 115 280" stroke="#64748b" strokeWidth="2" strokeDasharray="6 3" />
          <path d="M 270 120 L 195 270" stroke="#64748b" strokeWidth="2" strokeDasharray="6 3" />
          <path d="M 255 145 C 240 180, 200 230, 150 270" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

          {/* 2. Ligamentum Pubofemorale (Triangular band from Pubis) */}
          <path
            d="M 290 200 C 270 230, 230 270, 190 285 L 180 270 C 220 240, 260 190, 290 200 Z"
            fill="url(#bertinGrad)"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Zona Orbicularis (Circular collar fibres) */}
          <path d="M 155 255 Q 185 275 210 255" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
