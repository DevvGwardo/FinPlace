import Image from 'next/image';
import Link from 'next/link';

const sizes = {
  sm: { img: 20, text: 'text-base' },
  md: { img: 28, text: 'text-xl' },
  lg: { img: 36, text: 'text-2xl' },
} as const;

interface LogoProps {
  size?: keyof typeof sizes;
  showText?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showText = true, href }: LogoProps) {
  const { img, text } = sizes[size];

  const content = (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/finplace_logo.svg"
        alt="FinPlace logo"
        width={img}
        height={img}
        className="shrink-0"
      />
      {showText && (
        <span className={`${text} font-bold text-text`}>
          Fin<span className="text-green">Place</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
