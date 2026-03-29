export function Logo({ className = "", size = 24 }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="6" ry="6" />
      <path d="M10 15H8a3 3 0 1 1 0-6h2" />
      <path d="M14 9h2a3 3 0 1 1 0 6h-2" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}
