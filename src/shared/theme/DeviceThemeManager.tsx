import useUserAgent from '@/hooks/useUserAgent';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}
const DeviceThemeManager = ({ children }: Props) => {
  const { isIOS } = useUserAgent();
  const { theme } = useTheme();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const lightMeta = document.querySelector('#status-bar-light');
    const darkMeta = document.querySelector('#status-bar-dark');

    //Detect if the theme is dark
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    //Set the theme on Android
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1c1717' : '#ffffff');
    }

    //Handle the theme on IOS
    if (isIOS) {
      if (isDark) {
        lightMeta?.setAttribute('disabled', 'true');
        darkMeta?.removeAttribute('disabled');
      } else {
        darkMeta?.setAttribute('disabled', 'true');
        lightMeta?.removeAttribute('disabled');
      }
    }
  }, [theme, isIOS]);

  return children;
};

export default DeviceThemeManager;
