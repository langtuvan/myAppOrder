export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white  dark:bg-zinc-900 dark:lg:bg-zinc-900 text-base/6 text-zinc-500 sm:text-sm/6 dark:text-white ">
      {children}
    </div>
  );
}
