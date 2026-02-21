import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import { Heading } from "./heading";

export function Header({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full rounded-lg mb-4  items-center justify-between gap-4  ">
      <Heading>{title}</Heading>
      {action && <div className="flex gap-4">{action}</div>}
    </div>
  );
}

export function AddBtn({ href }: { href: string }) {
  return (
    <Button
      href={href}
      plain
    >
      <PlusIcon />
    </Button>
  );
}
