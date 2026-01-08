import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface UserProfileSectionProps {
  myListings: any[];
  categories: any[];
  photoAccessRequests: {[key: number]: number[]};
  grantedAccess: {[key: number]: number[]};
  listings: any[];
  currentUserId: number;
  setShowProfile: (show: boolean) => void;
  setShowCreateDialog: (show: boolean) => void;
  setEditingListing: (listing: any) => void;
  setSelectedListing: (listing: any) => void;
  setPaymentType: (type: 'vip' | 'boost' | 'protection') => void;
  setShowPaymentDialog: (show: boolean) => void;
  handleDeleteListing: (id: number) => void;
  handleGrantAccess: (listingId: number, userId: number) => void;
  handleRejectAccess: (listingId: number, userId: number) => void;
  getCategoryIcon: (categoryId: string) => string;
}

const UserProfileSection = ({
  myListings,
  categories,
  photoAccessRequests,
  grantedAccess,
  listings,
  currentUserId,
  setShowProfile,
  setShowCreateDialog,
  setEditingListing,
  setSelectedListing,
  setPaymentType,
  setShowPaymentDialog,
  handleDeleteListing,
  handleGrantAccess,
  handleRejectAccess,
  getCategoryIcon,
}: UserProfileSectionProps) => {
  const getAccessGrantedByMe = () => {
    let total = 0;
    myListings.forEach((listing) => {
      total += (grantedAccess[listing.id] || []).length;
    });
    return total;
  };

  const getAccessGrantedToMe = () => {
    let total = 0;
    listings.forEach((listing) => {
      if (listing.ownerId !== currentUserId && (grantedAccess[listing.id] || []).includes(currentUserId)) {
        total++;
      }
    });
    return total;
  };

  const getMutualExchangesCount = () => {
    let total = 0;
    myListings.forEach((listing) => {
      const accessGranted = grantedAccess[listing.id] || [];
      accessGranted.forEach((userId) => {
        const userListings = listings.filter((l) => l.ownerId === userId && l.privatePhotos.length > 0);
        userListings.forEach((userListing) => {
          if ((grantedAccess[userListing.id] || []).includes(currentUserId)) {
            total++;
          }
        });
      });
    });
    return total;
  };

  const getPendingRequests = () => {
    let total = 0;
    myListings.forEach((listing) => {
      total += (photoAccessRequests[listing.id] || []).length;
    });
    return total;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Мои объявления</h2>
        <Button variant="outline" onClick={() => setShowProfile(false)}>
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к доске
        </Button>
      </div>

      {myListings.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">У вас пока нет объявлений</h3>
          <p className="text-muted-foreground mb-6">
            Создайте первое объявление чтобы начать получать отклики
          </p>
          <Button onClick={() => {
            setShowProfile(false);
            setShowCreateDialog(true);
          }}>
            <Icon name="Plus" size={18} className="mr-2" />
            Создать объявление
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {(getAccessGrantedByMe() > 0 || getAccessGrantedToMe() > 0 || getMutualExchangesCount() > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Unlock" size={20} className="text-green-600" />
                  <Badge className="bg-green-600 text-white">{getAccessGrantedToMe()}</Badge>
                </div>
                <p className="text-sm font-medium text-green-900">Доступ получен</p>
                <p className="text-xs text-green-700 mt-1">К приватным фото других</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Share2" size={20} className="text-blue-600" />
                  <Badge className="bg-blue-600 text-white">{getAccessGrantedByMe()}</Badge>
                </div>
                <p className="text-sm font-medium text-blue-900">Доступ выдан</p>
                <p className="text-xs text-blue-700 mt-1">К моим фото</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Repeat2" size={20} className="text-purple-600" />
                  <Badge className="bg-purple-600 text-white">{getMutualExchangesCount()}</Badge>
                </div>
                <p className="text-sm font-medium text-purple-900">Взаимный обмен</p>
                <p className="text-xs text-purple-700 mt-1">Обоюдный доступ</p>
              </Card>
            </div>
          )}

          {getPendingRequests() > 0 && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Bell" size={20} className="text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Запросы доступа к приватным фото</h3>
                </div>
                <Badge className="bg-blue-600 text-white">{getPendingRequests()}</Badge>
              </div>
              <div className="space-y-3">
                {myListings.map((listing) => {
                  const requests = photoAccessRequests[listing.id] || [];
                  if (requests.length === 0) return null;
                  return (
                    <div key={listing.id} className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium mb-3">
                        Запросы к объявлению "{listing.title}"
                      </p>
                      <div className="space-y-2">
                        {requests.map((userId) => (
                          <div key={userId} className="flex items-center justify-between gap-3 p-2 bg-muted/50 rounded">
                            <span className="text-sm">Пользователь #{userId}</span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleGrantAccess(listing.id, userId)}
                              >
                                <Icon name="Check" size={14} className="mr-1" />
                                Разрешить
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectAccess(listing.id, userId)}
                              >
                                <Icon name="X" size={14} className="mr-1" />
                                Отклонить
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {myListings.map((listing) => (
            <Card key={listing.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    {listing.isVip && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Icon name="Crown" size={12} className="mr-1" />
                        VIP
                      </Badge>
                    )}
                    {listing.boostedAt && (
                      <Badge className="bg-blue-500 text-white">
                        <Icon name="TrendingUp" size={12} className="mr-1" />
                        ТОП
                      </Badge>
                    )}
                    {listing.verified && (
                      <Badge className="bg-green-100 text-green-700">
                        <Icon name="CheckCircle" size={12} className="mr-1" />
                        Верифицирован
                      </Badge>
                    )}
                    {listing.protectionEnabled && (
                      <Badge className="bg-orange-100 text-orange-700">
                        <Icon name="Shield" size={12} className="mr-1" />
                        Защищено
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Icon name={getCategoryIcon(listing.category) as any} size={14} />
                      {categories.find((c) => c.id === listing.category)?.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {listing.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👍 {listing.likes}</span>
                      <span>👎 {listing.dislikes}</span>
                      <span className="flex items-center gap-0.5">
                        <Icon name="MessageCircle" size={12} />
                        {listing.commentsCount}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3">{listing.description}</p>
                  <p className="text-lg font-semibold text-primary">{listing.price}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingListing(listing)}
                  >
                    <Icon name="Edit" size={14} className="mr-1" />
                    Редактировать
                  </Button>
                  
                  {!listing.isVip && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedListing(listing);
                        setPaymentType('vip');
                        setShowPaymentDialog(true);
                      }}
                    >
                      <Icon name="Crown" size={14} className="mr-1" />
                      VIP (500₽)
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedListing(listing);
                      setPaymentType('boost');
                      setShowPaymentDialog(true);
                    }}
                  >
                    <Icon name="TrendingUp" size={14} className="mr-1" />
                    Поднять (200₽)
                  </Button>
                  
                  {!listing.protectionEnabled && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedListing(listing);
                        setPaymentType('protection');
                        setShowPaymentDialog(true);
                      }}
                    >
                      <Icon name="Shield" size={14} className="mr-1" />
                      Защита (300₽)
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Вы уверены что хотите удалить объявление?')) {
                        handleDeleteListing(listing.id);
                      }
                    }}
                  >
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;
