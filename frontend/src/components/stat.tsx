export default function Stat({
  icon,
  name,
  number = '',
}: {
  icon?: React.ReactNode;
  name: string;
  number?: string | number;
}) {
  return (
    <div className="p-4 rounded-lg border border-slate-300 ">
      <div className="flex items-center">
        <div className="shrink-0">
          {icon ? (
            icon
          ) : (
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {name}
            </dt>
            <dd className="text-lg font-medium text-gray-900">{number}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
