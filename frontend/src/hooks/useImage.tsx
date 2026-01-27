import clsx from "clsx";
import Image, { type ImageProps } from "next/image";
import { HOST_API } from "@/config-global";

export default function UseImage({ className, ...props }: ImageProps) {
  if (!props.src) {
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

  const imageSrc = HOST_API + props?.src;

  return (
    <Image
      {...props}
      width={props?.width || 100}
      height={props?.height || 100}
      alt={props.alt || ""}
      src={imageSrc}
      //src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      //unoptimized // Use unoptimized for external images
      className={clsx(
        "mx-auto aspect-square rounded-lg object-cover group-hover:opacity-75 ",
        className,
      )}
    />
  );
}
