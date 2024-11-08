import { ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, TriangleAlert } from 'lucide-react';

interface NotificationAlertProps {
  message: string | ReactNode;
  success: boolean;
  extraContent?: ReactNode;
  className?: string;
}

const NotificationAlert = ({ message, success, extraContent, className = '' }: NotificationAlertProps) => {
  if (!message) return null;

  return (
    <Alert className={className} variant={success ? 'success' : 'destructive'}>
      {success ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle>{success ? 'Success!' : 'Error'}</AlertTitle>
      <AlertDescription>
        {message} {extraContent}
      </AlertDescription>
    </Alert>
  );
};

export default NotificationAlert;
