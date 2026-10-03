const GLOW = {
  top: {
    className: "pointer-events-none absolute top-0 right-0",
    filterId: "kore-ambient-glow-top",
  },
  bottom: {
    className: "pointer-events-none absolute bottom-5 left-0",
    filterId: "kore-ambient-glow-bottom",
  },
};

const GLOW_SHAPE = (
  <rect
    x="120"
    y="68"
    width="532"
    height="532"
    rx="266"
    fill="#48DCFC"
    fillOpacity="0.05"
  />
);

/**
 * Molecule: brilhos decorativos de fundo das telas.
 *
 * @param {object} props
 * @param {boolean} [props.topRight] Brilho no canto superior direito.
 * @param {boolean} [props.bottomLeft] Brilho no canto inferior esquerdo.
 */
export default function AmbientGlow({
  topRight = true,
  bottomLeft = true,
  className = "",
}) {
  const positions = [
    { key: "top", ...GLOW.top },
    { key: "bottom", ...GLOW.bottom },
  ].filter(({ key }) => (key === "top" ? topRight : bottomLeft));

  return (
    <div aria-hidden="true" className={className}>
      {positions.map(({ key, className: position, filterId }) => (
        <svg
          key={key}
          className={position}
          width="745"
          height="721"
          viewBox="0 0 745 721"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter={`url(#${filterId})`}>{GLOW_SHAPE}</g>
          <defs>
            <filter
              id={filterId}
              x="0"
              y="-52"
              width="772"
              height="773"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur stdDeviation="60" result="blur" />
            </filter>
          </defs>
        </svg>
      ))}
    </div>
  );
}