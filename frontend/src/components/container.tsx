import clsx from "clsx";
import { Main } from "next/document";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        //'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', // Constrained with padded content
        //"mx-auto max-w-7xl sm:px-6 lg:px-8", // Full-width on mobile, constrained with padded content above
        //"mx-auto max-w-7xl px-4 sm:px-2 lg:max-w-screen-xl lg:px-4",
        "p-4 space-y-6",
        className
      )}
      {...props}
    />
  );
}

export function MainContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <main
      className={clsx(
        "flex flex-1 flex-col w-full pb-2 lg:px-2 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function MainContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex-1 overflow-auto  w-full flex lg:rounded-lg lg:bg-white  lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
      <div
        className={clsx(
          "flex-1 flex flex-col  h-full overflow-hidden w-full",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function MainFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "flex-none w-full p-1 rounded-b-md bg-zinc-100 border-t-2 border-zinc-100",
        className
      )}
      {...props}
    />
  );
}
