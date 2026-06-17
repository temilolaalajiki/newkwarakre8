import logoUrl from "@/assets/kwara-kre8ives-logo.png";

type Props = { className?: string; alt?: string };

export function Logo({ className = "h-10 w-auto", alt = "Kwara Kre8ives" }: Props) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      className={`${className} dark:invert dark:brightness-[1.05]`}
      loading="eager"
      decoding="async"
    />
  );
}
