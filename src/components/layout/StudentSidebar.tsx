import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  UserCheck,
  GraduationCap,
  Calendar,
  BookOpen,
  TrendingUp,
  ClipboardCheck,
  MessageCircle,
  FileQuestion,
  Megaphone,
  User,
  Settings,
  HelpCircle,
  LogOut,
  BookMarked,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const studentNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
  { title: 'Today Classes', icon: CalendarDays, path: '/student/today' },
  { title: 'Find Tutors', icon: Search, path: '/student/find-tutors' },
  { title: 'My Teacher', icon: UserCheck, path: '/student/my-teacher' },
  { title: 'My Classes', icon: GraduationCap, path: '/student/classes' },
  { title: 'My Schedule', icon: Calendar, path: '/student/schedule' },
  { title: 'Lessons', icon: BookOpen, path: '/student/lessons' },
  { title: 'My Progress', icon: TrendingUp, path: '/student/progress' },
  { title: 'Attendance', icon: ClipboardCheck, path: '/student/attendance' },
  { title: 'Messages', icon: MessageCircle, path: '/student/messages' },
  { title: 'Requests', icon: FileQuestion, path: '/student/requests' },
  { title: 'Announcements', icon: Megaphone, path: '/student/announcements' },
];

const settingsNavItems = [
  { title: 'Profile', icon: User, path: '/student/profile' },
  { title: 'Settings', icon: Settings, path: '/student/settings' },
  { title: 'Help', icon: HelpCircle, path: '/student/help' },
];

export function StudentSidebar() {
  const location = useLocation();
  const { profile, student, signOut, isParent, linkedChildren, activeChild, setActiveChild } = useAuth();

  const displayName = student?.full_name || profile?.full_name || 'Student';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/student/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <BookMarked className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Quran With Tahir</span>
            <span className="text-xs text-muted-foreground">Student Portal</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Parent Child Selector */}
        {isParent && linkedChildren.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Viewing As</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 space-y-1">
                {linkedChildren.map((child) => (
                  <Button
                    key={child.id}
                    variant={activeChild?.id === child.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm"
                    onClick={() => setActiveChild(child)}
                  >
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={child.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {child.full_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {child.full_name}
                  </Button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studentNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={student?.avatar_url || profile?.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {isParent ? 'Parent Account' : 'Student'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="shrink-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
