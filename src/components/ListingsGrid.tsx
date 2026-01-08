import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const profileEmojis = ['👤', '👨', '👩', '🧑', '👱‍♀️', '👱‍♂️', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '🧑‍🦰', '🧑‍🦱'];

const getRandomEmoji = (id: number) => {
  return profileEmojis[id % profileEmojis.length];
};

interface ListingsGridProps {
  listings: any[];
  cardPhotoIndexes: {[key: number]: number};
  setCardPhotoIndexes: (indexes: {[key: number]: number}) => void;
  favorites: number[];
  toggleFavorite: (listingId: number, event?: React.MouseEvent) => void;
  blockedUsers: number[];
  showBlockedSection: boolean;
  handleBlockUser: (listingId: number) => void;
  setSelectedListing: (listing: any) => void;
}

const ListingsGrid = ({
  listings,
  cardPhotoIndexes,
  setCardPhotoIndexes,
  favorites,
  toggleFavorite,
  blockedUsers,
  showBlockedSection,
  handleBlockUser,
  setSelectedListing,
}: ListingsGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 animate-fade-in">
      {listings.map((listing) => (
        <Card
          key={listing.id}
          className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] relative aspect-square"
          onClick={() => setSelectedListing(listing)}
        >
          {listing.isVip && (
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5">
              <Icon name="Crown" size={8} className="mr-0.5 sm:w-2.5 sm:h-2.5" />
              VIP
            </Badge>
          )}
          {listing.boostedAt && (
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 bg-blue-500 text-white text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5">
              <Icon name="TrendingUp" size={8} className="mr-0.5 sm:w-2.5 sm:h-2.5" />
              ТОП
            </Badge>
          )}
          <button
            onClick={(e) => toggleFavorite(listing.id, e)}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 bg-white/90 hover:bg-white rounded-full p-1 sm:p-1.5 transition-all hover:scale-110 shadow-md"
          >
            <Icon
              name="Heart"
              size={12}
              className={`sm:w-3.5 sm:h-3.5 ${favorites.includes(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
            />
          </button>
          
          <div className="h-full flex flex-col justify-between overflow-hidden">
            <div className={`flex-1 flex items-center justify-center relative ${
              listing.isVip
                ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                : 'bg-gradient-to-br from-primary/20 to-primary/5'
            }`}>
              {showBlockedSection && listing.ownerId && blockedUsers.includes(listing.ownerId) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                  <Icon name="Ban" size={48} className="text-red-500 mb-2" />
                  <span className="text-white text-xs font-semibold">Заблокирован</span>
                </div>
              )}
              {listing.photos && listing.photos.length > 0 ? (
                <div className="relative w-full h-full group">
                  <img
                    src={listing.photos[cardPhotoIndexes[listing.id] || 0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIdx = cardPhotoIndexes[listing.id] || 0;
                          const newIdx = currentIdx === 0 ? listing.photos.length - 1 : currentIdx - 1;
                          setCardPhotoIndexes({...cardPhotoIndexes, [listing.id]: newIdx});
                        }}
                        className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Icon name="ChevronLeft" size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentIdx = cardPhotoIndexes[listing.id] || 0;
                          const newIdx = currentIdx === listing.photos.length - 1 ? 0 : currentIdx + 1;
                          setCardPhotoIndexes({...cardPhotoIndexes, [listing.id]: newIdx});
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Icon name="ChevronRight" size={14} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {listing.photos.map((_: string, idx: number) => (
                          <div
                            key={idx}
                            className={`w-1 h-1 rounded-full transition-all ${
                              idx === (cardPhotoIndexes[listing.id] || 0)
                                ? 'bg-white w-2'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0 text-[10px]">
                        {(cardPhotoIndexes[listing.id] || 0) + 1}/{listing.photos.length}
                      </Badge>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-6xl sm:text-7xl">
                  {getRandomEmoji(listing.id)}
                </div>
              )}
            </div>

            <div className="p-2 sm:p-3 bg-white/95">
              <h3 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-1">{listing.title}</h3>
              
              <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2">
                <Icon name="MapPin" size={8} className="mr-0.5 sm:w-2.5 sm:h-2.5" />
                <span className="line-clamp-1">{listing.location}</span>
              </div>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] sm:text-xs">👍</span>
                    <span className="text-[10px] sm:text-xs font-medium text-green-600">{listing.likes}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px] sm:text-xs">👎</span>
                    <span className="text-[10px] sm:text-xs font-medium text-red-600">{listing.dislikes}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Icon name="MessageCircle" size={8} className="text-muted-foreground sm:w-2.5 sm:h-2.5" />
                    <span className="text-[10px] sm:text-xs text-muted-foreground">{listing.commentsCount}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-primary block">{listing.price}</span>
              {showBlockedSection && listing.ownerId && blockedUsers.includes(listing.ownerId) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockUser(listing.id);
                  }}
                >
                  <Icon name="UserCheck" size={12} className="mr-1" />
                  Разблокировать
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListingsGrid;