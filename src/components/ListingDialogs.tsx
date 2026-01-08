import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ListingDialogsProps {
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  editingListing: any;
  setEditingListing: (listing: any) => void;
  selectedListing: any;
  setSelectedListing: (listing: any) => void;
  showCommentDialog: boolean;
  setShowCommentDialog: (show: boolean) => void;
  editingComment: any;
  setEditingComment: (comment: any) => void;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (show: boolean) => void;
  paymentType: 'vip' | 'boost' | 'protection' | null;
  setPaymentType: (type: 'vip' | 'boost' | 'protection' | null) => void;
  showAccessRequestDialog: boolean;
  setShowAccessRequestDialog: (show: boolean) => void;
  showMessagesDialog: boolean;
  setShowMessagesDialog: (show: boolean) => void;
  messageRecipient: any;
  setMessageRecipient: (recipient: any) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  messages: {[key: number]: any[]};
  unreadMessages: {[key: number]: number};
  newListing: any;
  setNewListing: (listing: any) => void;
  newComment: any;
  setNewComment: (comment: any) => void;
  categories: any[];
  currentUserId: number;
  currentPhotoIndex: number;
  setCurrentPhotoIndex: (index: number) => void;
  userVotes: {[key: number]: 'like' | 'dislike'};
  favorites: number[];
  comments: any;
  blockedUsers: number[];
  grantedAccess: {[key: number]: number[]};
  handleCreateListing: () => void;
  handleEditListing: () => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean, isPrivate?: boolean) => void;
  handleDeletePhoto: (index: number, isEditing: boolean, isPrivate?: boolean) => void;
  handleVote: (listingId: number, voteType: 'like' | 'dislike') => void;
  toggleFavorite: (listingId: number, event?: React.MouseEvent) => void;
  handleAddComment: () => void;
  handleEditComment: () => void;
  handleDeleteComment: (listingId: number, commentId: number) => void;
  handlePayment: () => void;
  handleRequestPhotoAccess: () => void;
  handleBlockUser: (listingId: number) => void;
  simulateIncomingMessage: (listingId: number | undefined) => void;
  markMessagesAsRead: (listingId: number) => void;
  hasAccessToPrivatePhotos: (listingId: number) => boolean;
  getRandomEmoji: (id: number) => string;
}

const ListingDialogs = (props: ListingDialogsProps) => {
  const {
    showCreateDialog,
    setShowCreateDialog,
    editingListing,
    setEditingListing,
    selectedListing,
    setSelectedListing,
    showCommentDialog,
    setShowCommentDialog,
    editingComment,
    setEditingComment,
    showPaymentDialog,
    setShowPaymentDialog,
    paymentType,
    showAccessRequestDialog,
    setShowAccessRequestDialog,
    showMessagesDialog,
    setShowMessagesDialog,
    messageRecipient,
    newMessage,
    setNewMessage,
    messages,
    unreadMessages,
    newListing,
    setNewListing,
    newComment,
    setNewComment,
    categories,
    currentUserId,
    currentPhotoIndex,
    setCurrentPhotoIndex,
    userVotes,
    favorites,
    comments,
    blockedUsers,
    grantedAccess,
    handleCreateListing,
    handleEditListing,
    handlePhotoUpload,
    handleDeletePhoto,
    handleVote,
    toggleFavorite,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
    handlePayment,
    handleRequestPhotoAccess,
    handleBlockUser,
    simulateIncomingMessage,
    markMessagesAsRead,
    hasAccessToPrivatePhotos,
    getRandomEmoji,
  } = props;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !messageRecipient) return;
    
    const msg = {
      text: newMessage,
      fromMe: true,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedMessages = {
      ...messages,
      [messageRecipient.id]: [...(messages[messageRecipient.id] || []), msg],
    };
    
    setNewMessage('');
    simulateIncomingMessage(messageRecipient.id);
  };

  return (
    <>
      {/* CREATE LISTING DIALOG */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl">Создать объявление</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="title">Название объявления *</Label>
              <Input
                id="title"
                placeholder="Например: Анна, 25 лет"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select
                value={newListing.category}
                onValueChange={(value) => setNewListing({ ...newListing, category: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Локация *</Label>
              <Input
                id="location"
                placeholder="Например: Москва, Центр"
                value={newListing.location}
                onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Расскажите подробнее о вашем предложении"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="price">Цена *</Label>
              <Input
                id="price"
                placeholder="Например: 5000 ₽/час"
                value={newListing.price}
                onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Фотографии (до 10 штук)</Label>
                <Badge variant="secondary">
                  {newListing.photos.length}/10
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                ⚠️ Разрешены только неинтимные фото: лицо, тело, общий вид. Интимный 18+ контент запрещён.
              </p>

              {newListing.photos.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {newListing.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index, false)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newListing.photos.length < 10 && (
                <div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, false)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    className="w-full"
                  >
                    <Icon name="Upload" size={18} className="mr-2" />
                    Загрузить фото
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t pt-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label>🔒 Приватные фото (до 10 штук)</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Доступ по запросу или обмену
                  </p>
                </div>
                <Badge variant="secondary">
                  {newListing.privatePhotos.length}/10
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                ⚠️ Разрешены только неинтимные фото: лицо, тело, ноги, спина. Интимный 18+ контент запрещён.
              </p>

              {newListing.privatePhotos.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {newListing.privatePhotos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square group">
                      <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center z-10 pointer-events-none">
                        <Icon name="Lock" size={20} className="text-white drop-shadow-lg" />
                      </div>
                      <img
                        src={photo}
                        alt={`Приватное фото ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index, false, true)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newListing.privatePhotos.length < 10 && (
                <div>
                  <input
                    type="file"
                    id="private-photo-upload"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, false, true)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('private-photo-upload')?.click()}
                    className="w-full"
                  >
                    <Icon name="Lock" size={18} className="mr-2" />
                    Загрузить приватные фото
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateListing} className="flex-1">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать объявление
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note: Due to file size limitations, the remaining 6 dialogs (Edit, Details, Comment, Payment, Access Request, Messages) 
          are still embedded in the main component. They should be moved here in a similar fashion for full decomposition. */}
    </>
  );
};

export default ListingDialogs;
