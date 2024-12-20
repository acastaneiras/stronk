/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import useUserAgent from '@/hooks/useUserAgent';
import React, { useEffect, useState } from 'react';
import { MdAddToHomeScreen } from 'react-icons/md';

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { isIOS, isStandalone } = useUserAgent();


  useEffect(() => {
    const handleBeforeInstallPrompt = (event: { preventDefault: () => void; }) => {
      //Save the event to show the install prompt
      event.preventDefault();
      setDeferredPrompt(event);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-4 right-4">
        <Card className='bg-secondary'>
          <CardHeader>
          </CardHeader>
          <CardContent>
            In order to install the app on iOS, open the Safari menu and select <strong>"Add to Home Screen"</strong>.
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    );
  }

  //If the user doesn't have the app already installed, show the install button
  if (!isVisible || isStandalone) {
    return null;
  }

  return (
    <Button onClick={handleInstallClick} variant={`outline`} className="my-4 border-primary">
      <MdAddToHomeScreen className="mr-2" />
      Add to Home Screen
    </Button>
  );
};

export default InstallPWAButton;
