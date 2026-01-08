import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const AppInfo = () => {
  const [showInfo, setShowInfo] = useState(false);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowInfo(true)}
        className="relative h-8 sm:h-9 px-2 sm:px-3"
      >
        <Icon name="Info" size={14} className="sm:mr-2" />
        <span className="hidden sm:inline">О приложении</span>
      </Button>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold">
                V
              </div>
              МойДосуг PWA
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start gap-3">
                <Icon name={isStandalone ? 'Check' : 'Info'} size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">
                    {isStandalone ? '✅ Установлено как приложение' : '📱 Можно установить как приложение'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isStandalone 
                      ? 'Вы используете полноценное приложение с автономным режимом'
                      : 'Добавьте МойДосуг на главный экран для удобного доступа'
                    }
                  </p>
                </div>
              </div>
            </Card>

            {!isStandalone && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Download" size={18} className="text-primary" />
                  Как установить
                </h3>

                {isAndroid && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Откройте меню браузера</p>
                        <p className="text-xs text-muted-foreground">Нажмите ⋮ (три точки) в правом верхнем углу</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Выберите "Добавить на главный экран"</p>
                        <p className="text-xs text-muted-foreground">Или "Установить приложение"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Подтвердите установку</p>
                        <p className="text-xs text-muted-foreground">Приложение появится на главном экране</p>
                      </div>
                    </div>
                  </div>
                )}

                {isIOS && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-sm">Нажмите кнопку "Поделиться"</p>
                        <p className="text-xs text-muted-foreground">Квадрат со стрелкой вверх внизу экрана</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-sm">Прокрутите и выберите "На экран «Домой»"</p>
                        <p className="text-xs text-muted-foreground">Иконка с плюсом</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-sm">Нажмите "Добавить"</p>
                        <p className="text-xs text-muted-foreground">Приложение появится на главном экране</p>
                      </div>
                    </div>
                  </div>
                )}

                {!isIOS && !isAndroid && (
                  <p className="text-sm text-muted-foreground">
                    Нажмите на иконку установки в адресной строке браузера или в меню ⋮
                  </p>
                )}
              </Card>
            )}

            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Sparkles" size={18} className="text-primary" />
                Преимущества приложения
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Icon name="Zap" size={16} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Быстрый запуск</p>
                    <p className="text-xs text-muted-foreground">Открывается мгновенно</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="WifiOff" size={16} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Offline режим</p>
                    <p className="text-xs text-muted-foreground">Работает без интернета</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Maximize2" size={16} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Полный экран</p>
                    <p className="text-xs text-muted-foreground">Без браузерной панели</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Bell" size={16} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Уведомления</p>
                    <p className="text-xs text-muted-foreground">О новых сообщениях</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="text-center text-sm text-muted-foreground pt-2">
              <p>Версия 1.0.0 • PWA</p>
              <p className="mt-1">Работает на всех устройствах</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppInfo;
