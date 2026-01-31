import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  CalendarDays,
  GraduationCap,
  Calendar,
  Users,
  BookOpen,
  ClipboardCheck,
  Bell,
  ListTodo,
  MessageSquareWarning,
  Lightbulb,
  MessageCircle,
  DollarSign,
  MinusCircle,
  TrendingUp,
  FileText,
  HelpCircle,
  Megaphone,
  ChevronDown,
  PlusCircle,
  History,
  UserCheck,
  LogOut,
  BookMarked,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Today Classes', href: '/today-classes', icon: CalendarDays },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Class Schedule', href: '/schedule', icon: Calendar },
  { name: 'My Students', href: '/students', icon: Users },
  {
    name: 'Lessons',
    icon: BookOpen,
    children: [
      { name: 'Add Lesson', href: '/lessons/add', icon: PlusCircle },
      { name: 'Lesson History', href: '/lessons/history', icon: History },
      { name: 'Examiner Remarks', href: '/lessons/examiner', icon: UserCheck },
    ],
  },
  { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { name: 'Reminder', href: '/reminder', icon: Bell },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Complaints', href: '/complaints', icon: MessageSquareWarning },
  { name: 'Suggestions', href: '/suggestions', icon: Lightbulb },
  { name: 'Feedback', href: '/feedback', icon: MessageCircle },
  { name: 'Salary', href: '/salary', icon: DollarSign },
  { name: 'Deduction List', href: '/deductions', icon: MinusCircle },
  { name: 'Improvement', href: '/improvement', icon: TrendingUp },
  { name: 'Rules', href: '/rules', icon: FileText },
  { name: 'Instruction', href: '/instruction', icon: HelpCircle },
  { name: 'Announcements', href: '/announcements', icon: Megaphone },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { state, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const isCollapsed = state === 'collapsed';

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children: { href: string }[]) =>
    children.some(child => location.pathname === child.href);

  // Auto-close mobile sidebar on navigation
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <BookMarked className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">Quran Academy</span>
              <span className="text-xs text-sidebar-foreground/60">Teacher Portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <SidebarMenu>
            {navigationItems.map((item) => {
              if (item.children) {
                return (
                  <Collapsible
                    key={item.name}
                    defaultOpen={isParentActive(item.children)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            'w-full',
                            isParentActive(item.children) && 'bg-sidebar-accent text-sidebar-accent-foreground'
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.name}</span>
                              <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(child.href)}
                              >
                                <NavLink 
                                  to={child.href} 
                                  className="flex items-center gap-2"
                                  onClick={handleNavClick}
                                >
                                  <child.icon className="h-3.5 w-3.5" />
                                  <span>{child.name}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href!)}
                    tooltip={isCollapsed ? item.name : undefined}
                  >
                    <NavLink 
                      to={item.href!} 
                      className="flex items-center gap-2"
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          {isCollapsed ? (
            // Collapsed state: Avatar acts as sign out button
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={signOut}
                  className="focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-full"
                >
                  <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name} />
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {profile?.full_name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            // Expanded state: Show full user info
            <>
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {profile?.full_name?.charAt(0) || 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {profile?.full_name || 'Teacher'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {profile?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
