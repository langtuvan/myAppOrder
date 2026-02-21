import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarSection,
  SidebarHeading,
} from "@/components/sidebar";

import { usePathname } from "next/navigation";

export type NavigationItem = {
  id: string;
  label: string;
  children: {
    name: string;
    href: string;
    action: string;
    icon: React.ComponentType<any>;
  }[];
};

export function SideBarLayout({
  navigation,
  children,
  modal,
}: {
  navigation: NavigationItem[];
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathName = usePathname();
  const [, , , currentLink] = pathName.split("/");
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-y-6 gap-x-2 px-0 md:px-1">
      <div className="col-span-1 ">
        <Sidebar className="h-fit border-0 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <SidebarBody>
            {navigation.map((section) => (
              <div key={section.id}>
                <SidebarHeading className="text-lg">
                  {section.label}
                </SidebarHeading>

                <SidebarSection>
                  {section.children.map((item) => (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      current={
                        currentLink === item.href.split("/").slice(-1)[0]
                      }
                    >
                      {item.name}
                    </SidebarItem>
                  ))}
                </SidebarSection>
              </div>
            ))}
          </SidebarBody>
        </Sidebar>
      </div>

      <div className="col-span-5">{children}</div>
      {modal}
      <div id="modal-root" />
    </div>
  );
}
