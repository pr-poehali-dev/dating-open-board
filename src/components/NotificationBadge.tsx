import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Notification {
  id: number;
  message: string;
  type: 'message' | 'access' | 'favorite' | 'comment';
  timestamp: number;
}

interface NotificationBadgeProps {
  notifications: Notification[];
  onDismiss: (id: number) => void;
}

const NotificationBadge = ({ notifications, onDismiss }: NotificationBadgeProps) => {
  const [visible, setVisible] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    notifications.forEach(notif => {
      setVisible(prev => ({ ...prev, [notif.id]: true }));
      
      setTimeout(() => {
        setVisible(prev => ({ ...prev, [notif.id]: false }));
        setTimeout(() => onDismiss(notif.id), 300);
      }, 5000);
    });
  }, [notifications, onDismiss]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'MessageSquare';
      case 'access': return 'Unlock';
      case 'favorite': return 'Heart';
      case 'comment': return 'MessageCircle';
      default: return 'Bell';
    }
  };

  const getColor = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'bg-blue-500';
      case 'access': return 'bg-green-500';
      case 'favorite': return 'bg-red-500';
      case 'comment': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`flex items-start gap-3 p-4 bg-white border rounded-lg shadow-lg transition-all duration-300 ${
            visible[notif.id] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <Badge className={`${getColor(notif.type)} text-white p-2`}>
            <Icon name={getIcon(notif.type)} size={16} />
          </Badge>
          <div className="flex-1">
            <p className="text-sm font-medium">{notif.message}</p>
          </div>
          <button
            onClick={() => onDismiss(notif.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBadge;
