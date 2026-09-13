export function SectionDepth() {
  return <div className="section-depth" aria-hidden="true">
    <div className="section-depth-halo" /><div className="section-depth-line" />
    {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${7 + (i * 29) % 88}%`, top: `${12 + (i * 17) % 78}%`, animationDelay: `${-i * 1.7}s` }} />)}
  </div>;
}
