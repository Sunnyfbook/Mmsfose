import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Video, 
  Search, 
  Home,
  Type,
  Globe,
  Megaphone,
  Settings
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Videos',
    url: '/admin/videos',
    icon: Video,
  },
  {
    title: 'Ads',
    url: '/admin/ads',
    icon: Megaphone,
  },
  {
    title: 'Content',
    url: '/admin/content',
    icon: Type,
  },
  {
    title: 'SEO Settings',
    url: '/admin/seo',
    icon: Search,
  },
  {
    title: 'Search Console',
    url: '/admin/search-console',
    icon: Globe,
  },
  {
    title: 'API Configuration',
    url: '/admin/api-config',
    icon: Settings,
  },
  {
    title: 'Back to Site',
    url: '/',
    icon: Home,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const isActiveRoute = isActive(path);
    return isActiveRoute 
      ? 'bg-primary text-primary-foreground font-medium' 
      : 'hover:bg-accent hover:text-accent-foreground';
  };

  return (
    <Sidebar
      className={state === 'collapsed' ? 'w-14' : 'w-64'}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      end={item.url === '/admin'}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== 'collapsed' && <span>{item.title}</span>}
                    </NavLink>
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