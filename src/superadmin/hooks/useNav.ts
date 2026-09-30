import { useRouter } from 'expo-router';

const routes: Record<string, string> = {
  Home: '/(superadmin)',
  Audit: '/(superadmin)/audit',
  Administrators: '/(superadmin)/administrators',
  Permissions: '/(superadmin)/permissions',
  Profile: '/(superadmin)/profile',
  AddAdministrator: '/(superadmin)/add-administrator',
  AddRole: '/(superadmin)/add-role',
  Marketplace: '/(superadmin)/marketplace',
  Support: '/(superadmin)/support',
  Settings: '/(superadmin)/settings',
};

export function useNav(): any {
  const router = useRouter();

  return {
    navigate: (name: string) => {
      const path = routes[name];

      if (!path) {
        console.warn(`Unknown Super Admin route: ${name}`);
        return;
      }

      router.push(path as any);
    },
    goBack: () => router.back(),
  };
}
