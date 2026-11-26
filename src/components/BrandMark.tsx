interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'h-8 w-8' }: BrandMarkProps) {
  return (
    <img
      src="/assets/aistudio/image_7eff43ea.png"
      alt=""
      aria-hidden="true"
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
