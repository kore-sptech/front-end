import koreLogo from "../../assets/kore-logo.png";

/**
 * Atom: logotipo da KORE.
 *
 * @param {object} props
 * @param {string} [props.className] Classes de dimensionamento (padrão `h-25`).
 */
export default function Logo({ className = "" }) {
  return (
    <img
      src={koreLogo}
      alt="Kore"
      className={`w-auto object-contain ${className || "h-25"}`}
    />
  );
}