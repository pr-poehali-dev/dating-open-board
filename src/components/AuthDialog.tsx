import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (userData: any) => void;
}

const AuthDialog = ({ open, onOpenChange, onSuccess }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register' | 'phone'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = () => {
    if (mode === 'register') {
      if (!email || !password || !confirmPassword || !name) {
        toast({
          title: 'Ошибка',
          description: 'Заполните все поля',
          variant: 'destructive',
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: 'Ошибка',
          description: 'Пароли не совпадают',
          variant: 'destructive',
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: 'Ошибка',
          description: 'Пароль должен содержать минимум 6 символов',
          variant: 'destructive',
        });
        return;
      }

      const userData = {
        id: Date.now(),
        name,
        email,
        authMethod: 'email',
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      toast({
        title: 'Успешная регистрация!',
        description: 'Добро пожаловать в МойДосуг',
      });

      onSuccess(userData);
      onOpenChange(false);
      resetForm();
    } else {
      if (!email || !password) {
        toast({
          title: 'Ошибка',
          description: 'Введите email и пароль',
          variant: 'destructive',
        });
        return;
      }

      const userData = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        authMethod: 'email',
      };

      localStorage.setItem('currentUser', JSON.stringify(userData));

      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать!',
      });

      onSuccess(userData);
      onOpenChange(false);
      resetForm();
    }
  };

  const handlePhoneAuth = () => {
    if (!phone) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер телефона',
        variant: 'destructive',
      });
      return;
    }

    if (phone.length < 10) {
      toast({
        title: 'Ошибка',
        description: 'Неверный формат номера телефона',
        variant: 'destructive',
      });
      return;
    }

    if (!isCodeSent) {
      setIsCodeSent(true);
      toast({
        title: 'Код отправлен',
        description: `SMS с кодом отправлен на ${phone}`,
      });
      return;
    }

    if (!verificationCode || verificationCode.length !== 4) {
      toast({
        title: 'Ошибка',
        description: 'Введите 4-значный код',
        variant: 'destructive',
      });
      return;
    }

    const userData = {
      id: Date.now(),
      name: name || `Пользователь ${phone.slice(-4)}`,
      phone,
      authMethod: 'phone',
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));

    toast({
      title: 'Успешный вход!',
      description: 'Добро пожаловать в МойДосуг',
    });

    onSuccess(userData);
    onOpenChange(false);
    resetForm();
  };

  const handleGoogleAuth = () => {
    const userData = {
      id: Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      authMethod: 'google',
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));

    toast({
      title: 'Вход через Google',
      description: 'Успешная авторизация',
    });

    onSuccess(userData);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setVerificationCode('');
    setIsCodeSent(false);
    setMode('login');
    setAuthMethod('email');
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('7')) {
      return cleaned.slice(0, 11);
    }
    return cleaned.slice(0, 10);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'phone' ? 'Вход по телефону' : mode === 'register' ? 'Регистрация' : 'Вход'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode !== 'phone' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="col-span-3 h-12"
                >
                  <Icon name="Mail" size={18} className="mr-2" />
                  Войти через Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">или</span>
                </div>
              </div>
            </>
          )}

          {mode === 'phone' ? (
            <>
              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    disabled={isCodeSent}
                    className="flex-1"
                  />
                </div>
              </div>

              {isCodeSent && (
                <>
                  {mode === 'phone' && (
                    <div>
                      <Label htmlFor="name">Имя (необязательно)</Label>
                      <Input
                        id="name"
                        placeholder="Как вас зовут?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="code">Код из SMS</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="1234"
                      maxLength={4}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="mt-1.5 text-center text-2xl tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Код отправлен на {phone}
                    </p>
                  </div>
                </>
              )}

              <Button onClick={handlePhoneAuth} className="w-full h-12">
                {isCodeSent ? (
                  <>
                    <Icon name="Check" size={18} className="mr-2" />
                    Подтвердить код
                  </>
                ) : (
                  <>
                    <Icon name="MessageSquare" size={18} className="mr-2" />
                    Получить код
                  </>
                )}
              </Button>

              {isCodeSent && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsCodeSent(false);
                    setVerificationCode('');
                    toast({
                      title: 'Код отправлен повторно',
                    });
                  }}
                  className="w-full"
                >
                  Отправить код повторно
                </Button>
              )}
            </>
          ) : (
            <>
              {mode === 'register' && (
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    placeholder="Например: Александр"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password">Пароль *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              )}

              <Button onClick={handleEmailAuth} className="w-full h-12">
                <Icon name="LogIn" size={18} className="mr-2" />
                {mode === 'register' ? 'Зарегистрироваться' : 'Войти'}
              </Button>
            </>
          )}

          <div className="space-y-2">
            {mode !== 'phone' && (
              <Button
                variant="outline"
                onClick={() => setMode('phone')}
                className="w-full"
              >
                <Icon name="Smartphone" size={18} className="mr-2" />
                Войти по номеру телефона
              </Button>
            )}

            {mode === 'phone' && (
              <Button
                variant="outline"
                onClick={() => {
                  setMode('login');
                  setIsCodeSent(false);
                }}
                className="w-full"
              >
                <Icon name="Mail" size={18} className="mr-2" />
                Войти через Email
              </Button>
            )}
          </div>

          {mode !== 'phone' && (
            <div className="text-center text-sm">
              {mode === 'login' ? (
                <p className="text-muted-foreground">
                  Нет аккаунта?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-primary font-medium hover:underline"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary font-medium hover:underline"
                  >
                    Войти
                  </button>
                </p>
              )}
            </div>
          )}

          <Card className="p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">
              Регистрируясь, вы соглашаетесь с{' '}
              <button className="text-primary hover:underline">
                правилами сервиса
              </button>{' '}
              и{' '}
              <button className="text-primary hover:underline">
                политикой конфиденциальности
              </button>
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
