/**
 * Изометрия дома: станция на крыше, наружный блок насоса, потоки.
 * Приём Quilt и Dandelion — чертёжная графика вместо фотостока.
 * Стоит в первом экране, пока нет фотографий собственных объектов:
 * рендер из каталога и стоковый снимок запрещены правилом третьим.
 */
export function HouseScheme() {
  return (
    <figure className="house">
      <svg viewBox="0 0 520 400" role="img"
        aria-label="Схема дома: солнечные модули на крыше питают дом и тепловой насос, излишки уходят в сеть">

        {/* земля */}
        <path d="M40 330 L260 250 L480 330 L260 380 Z" fill="var(--bg-2)" stroke="var(--line)" strokeWidth="1" />

        {/* корпус дома */}
        <path d="M170 200 L260 160 L350 200 L350 300 L260 340 L170 300 Z"
              fill="#fff" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M260 160 L260 250" stroke="var(--line)" strokeWidth="1" />
        <path d="M170 200 L260 250 L350 200" fill="none" stroke="var(--ink)" strokeWidth="1.2" />

        {/* крыша */}
        <path d="M160 195 L260 148 L360 195 L260 242 Z"
              fill="#f0f2ee" stroke="var(--ink)" strokeWidth="1.6" strokeLinejoin="round" />

        {/* солнечные модули */}
        <g stroke="var(--accent)" strokeWidth="1.2" fill="var(--accent-bright)" fillOpacity="0.18">
          <path d="M196 191 L232 174 L254 185 L218 202 Z" />
          <path d="M224 178 L260 161 L282 172 L246 189 Z" />
          <path d="M234 205 L270 188 L292 199 L256 216 Z" />
          <path d="M262 192 L298 175 L320 186 L284 203 Z" />
        </g>

        {/* окна */}
        <rect x="196" y="243" width="26" height="30" fill="none" stroke="var(--ink-2)" strokeWidth="1.1" />
        <rect x="296" y="243" width="26" height="30" fill="none" stroke="var(--ink-2)" strokeWidth="1.1" />

        {/* наружный блок насоса */}
        <path d="M92 268 L128 251 L160 267 L160 297 L124 314 L92 298 Z"
              fill="#fff" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M92 268 L124 284 L160 267" fill="none" stroke="var(--ink-2)" strokeWidth="1" />
        <ellipse cx="124" cy="294" rx="16" ry="9" fill="none" stroke="var(--ink-2)" strokeWidth="1.1" />
        <path d="M112 292 q12 -8 24 0" fill="none" stroke="var(--ink-2)" strokeWidth="1.1" />

        {/* солнце: лучи к панелям */}
        <g stroke="var(--accent-bright)" strokeWidth="1.6" opacity="0.85">
          <path d="M300 60 L268 118" />
          <path d="M336 74 L300 128" />
          <path d="M262 52 L242 112" />
        </g>
        <circle cx="300" cy="42" r="15" fill="none" stroke="var(--accent-bright)" strokeWidth="1.6" />

        {/* поток тепла с улицы в насос */}
        <g stroke="var(--accent)" strokeWidth="1.8" fill="none">
          <path d="M36 240 L84 258" />
          <path d="M76 250 L84 258 L74 262" />
        </g>
        <text x="30" y="230" fontSize="12" fill="var(--ink-2)">тепло воздуха</text>

        {/* поток от насоса в дом */}
        <g stroke="var(--accent)" strokeWidth="1.8" fill="none">
          <path d="M164 272 L186 262" />
          <path d="M178 258 L186 262 L179 268" />
        </g>

        {/* излишки в сеть */}
        <g stroke="var(--ink-2)" strokeWidth="1.4" fill="none" strokeDasharray="5 4">
          <path d="M362 196 L440 214" />
        </g>
        <path d="M432 208 L441 214 L431 219" fill="none" stroke="var(--ink-2)" strokeWidth="1.4" />
        <path d="M452 200 L452 258 M440 210 L452 200 L464 210" fill="none" stroke="var(--ink-2)" strokeWidth="1.3" />
        <text x="430" y="278" fontSize="12" fill="var(--ink-2)">в сеть</text>

        <text x="124" y="336" textAnchor="middle" fontSize="12" fill="var(--ink-2)">тепловой насос</text>
        <text x="260" y="368" textAnchor="middle" fontSize="12" fill="var(--ink-2)">дом</text>
      </svg>
    </figure>
  );
}
