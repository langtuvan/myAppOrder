export function NoImageSvg() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-full w-16 border border-gray-300 bg-white text-gray-300 dark:border-white/15 dark:bg-gray-900 dark:text-white/15"
    >
      <path
        d="M0 0l200 200M0 200L200 0"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
