import Link from "next/link";
import {
  LayoutDashboard,
  UserCog,
  Users,
  CalendarCheck2,
  Scissors,
  Boxes,
  BarChart3,
  UserPlus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Updated Menu items.
export const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Barber Details",
    url: "/barbers",
    icon: UserCog,
  },
  {
    title: "Client Details",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Booking Details",
    url: "/bookings",
    icon: CalendarCheck2,
  },
  {
    title: "Manage Services",
    url: "/add-services",
    icon: Scissors,
  },
  {
    title: "Manage Inventory",
    url: "/inventory",
    icon: Boxes,
  },
  {
    title: "Add Offline User",
    url: "/offline-clients",
    icon: UserPlus,
  },
  {
    title: "Manage Report",
    url: "/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
