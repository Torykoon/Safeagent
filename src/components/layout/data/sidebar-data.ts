import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileText,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  Command,
  GalleryVerticalEnd,
  TestTube,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData, type NavGroup } from '../types'

// Admin용 네비게이션 그룹
export const adminNavGroups: NavGroup[] = [
  {
    title: 'Menu',
    items: [
      {
        title: '대시보드',
        url: '/',
        icon: LayoutDashboard,
      },
      {
        title: 'TBM작성',
        url: '/tasks',
        icon: ListTodo,
      },
      {
        title: 'TBM문서관리',
        url: '/apps',
        icon: Package,
      },
      {
        title: 'Agent 채팅',
        url: '/chats',
        icon: MessagesSquare,
      },
      {
        title: '사고사례',
        url: '/cases',
        icon: Users,
      },
      {
        title: 'Secured by Clerk',
        icon: ClerkLogo,
        items: [
          {
            title: 'Sign In',
            url: '/clerk/sign-in',
          },
          {
            title: 'Sign Up',
            url: '/clerk/sign-up',
          },
          {
            title: 'User Management',
            url: '/clerk/user-management',
          },
        ],
      },
    ],
  },
  {
    title: 'Pages',
    items: [
      {
        title: 'Auth',
        icon: ShieldCheck,
        items: [
          {
            title: 'Sign In',
            url: '/sign-in',
          },
          {
            title: 'Sign In (2 Col)',
            url: '/sign-in-2',
          },
          {
            title: 'Sign Up',
            url: '/sign-up',
          },
          {
            title: 'Forgot Password',
            url: '/forgot-password',
          },
          {
            title: 'OTP',
            url: '/otp',
          },
        ],
      },
      {
        title: 'Errors',
        icon: Bug,
        items: [
          {
            title: 'Unauthorized',
            url: '/errors/unauthorized',
            icon: Lock,
          },
          {
            title: 'Forbidden',
            url: '/errors/forbidden',
            icon: UserX,
          },
          {
            title: 'Not Found',
            url: '/errors/not-found',
            icon: FileX,
          },
          {
            title: 'Internal Server Error',
            url: '/errors/internal-server-error',
            icon: ServerOff,
          },
          {
            title: 'Maintenance Error',
            url: '/errors/maintenance-error',
            icon: Construction,
          },
        ],
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        title: 'Settings',
        icon: Settings,
        items: [
          {
            title: 'Profile',
            url: '/settings',
            icon: UserCog,
          },
          {
            title: 'Account',
            url: '/settings/account',
            icon: Wrench,
          },
          {
            title: 'Appearance',
            url: '/settings/appearance',
            icon: Palette,
          },
          {
            title: 'Notifications',
            url: '/settings/notifications',
            icon: Bell,
          },
          {
            title: 'Display',
            url: '/settings/display',
            icon: Monitor,
          },
        ],
      },
      // {
      //   title: 'Help Center',
      //   url: '/help-center',
      //   icon: HelpCircle,
      // },
    ],
  },
]

// Worker용 네비게이션 그룹
export const workerNavGroups: NavGroup[] = [
  {
    title: 'Worker Menu',
    items: [
      {
        title: '대시보드',
        url: '/worker/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'TBM문서 확인',
        url: '/worker/tbm-documents',
        icon: FileText,
      },
      {
        title: 'Test1',
        url: '/worker/test1',
        icon: TestTube,
      },
      {
        title: 'Test2',
        url: '/worker/test2',
        icon: TestTube,
      },
    ],
  },
]

// 팀별 네비게이션 매핑
export const teamNavGroups: Record<string, NavGroup[]> = {
  Admin: adminNavGroups,
  worker: workerNavGroups,
}

export const sidebarData: SidebarData = {
  user: {
    name: 'Developer',
    email: 'developer@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Admin',
      logo: Command,
      plan: 'Developer',
    },
    {
      name: 'worker',
      logo: GalleryVerticalEnd,
      plan: 'Developer',
    },
  ],
  navGroups: adminNavGroups,
}

