import koreLogo from "../assets/kore-logo.png";

export function Logo({ className }) {
  return (
    <>
      <img
        src={koreLogo}
        alt="Kore"
        className={`w-auto object-contain ${className || "h-25 "}`}
      />
    </>
  );
}
