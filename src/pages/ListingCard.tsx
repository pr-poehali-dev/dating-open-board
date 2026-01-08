import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { categories, getRandomEmoji } from './data';

interface ListingCardProps {
  listing: any;
  currentUserId: number;
  favorites: number[];
  userVotes: {[key: number]: 'like' | 'dislike'};
  blockedUsers: number[];
  cardPhotoIndex: number;
  onSelect: (listing: any) => void;
  onToggleFavorite: (id: number) => void;
  onVote: (id: number, type: 'like' | 'dislike') => void;
  onNextPhoto: (e: React.MouseEvent, id: number) => void;
  onPrevPhoto: (e: React.MouseEvent, id: number) => void;
  onEdit: (listing: any) => void;
  onDelete: (id: number) => void;
}

export const ListingCard = ({
  listing,
  currentUserId,
  favorites,
  userVotes,
  blockedUsers,
  cardPhotoIndex,
  onSelect,
  onToggleFavorite,
  onVote,
  onNextPhoto,
  onPrevPhoto,
  onEdit,
  onDelete,
}: ListingCardProps) => {
  if (blockedUsers.includes(listing.ownerId)) {
    return null;
  }

  const category = categories.find((c) => c.id === listing.category);
  const isOwner = listing.ownerId === currentUserId;
  const isFavorite = favorites.includes(listing.id);
  const hasPhotos = listing.photos && listing.photos.length > 0;
  const currentPhoto = hasPhotos ? listing.photos[cardPhotoIndex] : null;

  const getTimeAgo = (timestamp: number | null) => {
    if (!timestamp) return null;
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    return `${Math.floor(hours / 24)} д назад`;
  };

  const boostedTimeAgo = getTimeAgo(listing.boostedAt);

  return (
    <Card
      className={`p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer border-2 ${
        listing.isVip
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50'
          : 'hover:border-primary/50'
      }`}
      onClick={() => onSelect(listing)}
    >
      <div className="flex flex-col gap-4">
        {hasPhotos && (
          <div className="relative w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
            <img
              src={currentPhoto}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.photos.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => onPrevPhoto(e, listing.id)}
                >
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => onNextPhoto(e, listing.id)}
                >
                  <Icon name="ChevronRight" size={20} />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {cardPhotoIndex + 1} / {listing.photos.length}
                </div>
              </>
            )}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="text-lg sm:text-xl font-semibold truncate">
                {listing.title}
              </h3>
              {listing.verified && (
                <Badge className="bg-green-100 text-green-700 border-green-300 shrink-0">
                  <Icon name="BadgeCheck" size={14} className="mr-1" />
                  Проверено
                </Badge>
              )}
              {listing.isVip && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-600 shrink-0">
                  <Icon name="Crown" size={14} className="mr-1" />
                  VIP
                </Badge>
              )}
              {listing.protectionEnabled && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300 shrink-0">
                  <Icon name="Shield" size={14} className="mr-1" />
                  Защищено
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {category && (
                <Badge className={`${category.color} shrink-0`}>
                  <Icon name={category.icon as any} size={14} className="mr-1" />
                  {category.name}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Icon name="MapPin" size={14} />
                <span className="truncate">{listing.location}</span>
              </div>
            </div>
          </div>
          <Button
            variant={isFavorite ? 'default' : 'outline'}
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(listing.id);
            }}
            className="shrink-0"
          >
            <Icon name={isFavorite ? 'Heart' : 'Heart'} size={18} />
          </Button>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base">
          {listing.description}
        </p>

        <div className="flex items-center justify-between gap-4 pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <Button
                variant={userVotes[listing.id] === 'like' ? 'default' : 'ghost'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(listing.id, 'like');
                }}
              >
                <Icon name="ThumbsUp" size={16} />
                <span className="ml-1">{listing.likes}</span>
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={userVotes[listing.id] === 'dislike' ? 'default' : 'ghost'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVote(listing.id, 'dislike');
                }}
              >
                <Icon name="ThumbsDown" size={16} />
                <span className="ml-1">{listing.dislikes}</span>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(listing);
              }}
            >
              <Icon name="MessageSquare" size={16} />
              <span className="ml-1">{listing.commentsCount}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {listing.price && (
              <span className="font-semibold text-primary">{listing.price}</span>
            )}
            {isOwner && (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(listing);
                  }}
                >
                  <Icon name="Edit" size={14} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(listing.id);
                  }}
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {boostedTimeAgo && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
            <Icon name="TrendingUp" size={14} />
            <span>Поднято в топ {boostedTimeAgo}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
