import { useRouter } from 'expo-router';

const routes = {
  Home: '/(superadmin)',
  Audit: '/(superadmin)/audit',
  Administrators: '/(superadmin)/administrators',
  Users: '/(superadmin)/users',
  Permissions: '/(superadmin)/permissions',
  Profile: '/(superadmin)/profile',
  AddAdministrator: '/(superadmin)/add-administrator',
  AddRole: '/(superadmin)/add-role',
  Marketplace: '/(superadmin)/marketplace',
  Support: '/(superadmin)/support',
  Settings: '/(superadmin)/settings',
};

export function useNav() {
  const router = useRouter();

  return {
    navigate: (name) => {
      const path = routes[name];

      if (!path) {
        console.warn(`Unknown Super Admin route: ${name}`);
        return;
      }

      router.push(path);
    },
    goBack: () => router.back(),
  };
}
