import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  onLogout: () => void;
}

const UserProfile = ({ onLogout }: UserProfileProps) => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setShowProfile(false);
    onLogout();
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!',
    });
  };

  if (!user) return null;

  const getAuthMethodInfo = () => {
    switch (user.authMethod) {
      case 'google':
        return { icon: 'Mail', label: 'Google', color: 'bg-red-100 text-red-700' };
      case 'phone':
        return { icon: 'Smartphone', label: 'Телефон', color: 'bg-blue-100 text-blue-700' };
      case 'email':
        return { icon: 'Mail', label: 'Email', color: 'bg-green-100 text-green-700' };
      default:
        return { icon: 'User', label: 'Профиль', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const authInfo = getAuthMethodInfo();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowProfile(true)}
        className="relative h-8 sm:h-9 px-2 sm:px-3"
      >
        <Icon name="User" size={14} className="sm:mr-2" />
        <span className="hidden sm:inline">{user.name}</span>
      </Button>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl">Профиль пользователя</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                  {user.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                      <Icon name="Mail" size={12} />
                      {user.email}
                    </p>
                  )}
                  {user.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <Icon name="Smartphone" size={12} />
                      +7 {user.phone}
                    </p>
                  )}
                  <Badge className={authInfo.color}>
                    <Icon name={authInfo.icon as any} size={12} className="mr-1" />
                    {authInfo.label}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Info" size={16} className="text-primary" />
                Информация об аккаунте
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID пользователя:</span>
                  <span className="font-medium">#{user.id}</span>
                </div>
                {user.registeredAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Дата регистрации:</span>
                    <span className="font-medium">
                      {new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Метод входа:</span>
                  <span className="font-medium">{authInfo.label}</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Редактирование профиля',
                    description: 'Функция в разработке',
                  });
                }}
              >
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Настройки',
                    description: 'Функция в разработке',
                  });
                }}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Настройки
              </Button>
            </div>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
