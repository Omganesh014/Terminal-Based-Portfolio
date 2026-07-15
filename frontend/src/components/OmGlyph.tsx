const omGlyph = `  ██████╗ ███╗   ███╗
 ██╔═══██╗████╗ ████║
 ██║   ██║██╔████╔██║
 ██║   ██║██║╚██╔╝██║
 ╚██████╔╝██║ ╚═╝ ██║
  ╚═════╝ ╚═╝     ╚═╝`;

type OmGlyphProps = { className?: string; label?: string };

export function OmGlyph({ className = '', label = 'OM' }: OmGlyphProps) {
  return <pre className={`om-glyph ${className}`.trim()} aria-label={label}>{omGlyph}</pre>;
}
