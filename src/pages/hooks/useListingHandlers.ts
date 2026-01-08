import { useState } from 'react';
import { mockListings, mockComments } from '../data';

export const useListingHandlers = (toast: any) => {
  const [listings, setListings] = useState(mockListings);
  const [comments, setComments] = useState<any>(mockComments);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userVotes, setUserVotes] = useState<{[key: number]: 'like' | 'dislike'}>({});
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<{[key: number]: number}>({});
  const [photoAccessRequests, setPhotoAccessRequests] = useState<{[key: number]: number[]}>({});
  const [grantedAccess, setGrantedAccess] = useState<{[key: number]: number[]}>({});
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [messages, setMessages] = useState<{[key: number]: any[]}>({});

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
    toast({
      title: favorites.includes(id) ? 'Удалено из избранного' : 'Добавлено в избранное',
    });
  };

  const handleVote = (id: number, type: 'like' | 'dislike') => {
    if (userVotes[id] === type) {
      setUserVotes((prev) => {
        const newVotes = { ...prev };
        delete newVotes[id];
        return newVotes;
      });
      setListings((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, [type === 'like' ? 'likes' : 'dislikes']: l[type === 'like' ? 'likes' : 'dislikes'] - 1 }
            : l
        )
      );
    } else {
      const prevVote = userVotes[id];
      setUserVotes((prev) => ({ ...prev, [id]: type }));
      setListings((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          const newListing = { ...l };
          if (prevVote) {
            newListing[prevVote === 'like' ? 'likes' : 'dislikes']--;
          }
          newListing[type === 'like' ? 'likes' : 'dislikes']++;
          return newListing;
        })
      );
    }
  };

  const handleNextCardPhoto = (e: React.MouseEvent, listingId: number) => {
    e.stopPropagation();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing?.photos?.length) return;
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % listing.photos.length,
    }));
  };

  const handlePrevCardPhoto = (e: React.MouseEvent, listingId: number) => {
    e.stopPropagation();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing?.photos?.length) return;
    setCardPhotoIndexes((prev) => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + listing.photos.length) % listing.photos.length,
    }));
  };

  const handleDeleteListing = (id: number) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast({
      title: 'Объявление удалено',
    });
  };

  const handleRequestAccess = (listingId: number, userId: number) => {
    setPhotoAccessRequests((prev) => ({
      ...prev,
      [listingId]: [...(prev[listingId] || []), userId],
    }));
    toast({
      title: 'Запрос отправлен',
      description: 'Владелец получит уведомление о вашем запросе',
    });
  };

  const handleGrantAccess = (listingId: number, userId: number) => {
    setGrantedAccess((prev) => ({
      ...prev,
      [listingId]: [...(prev[listingId] || []), userId],
    }));
    setPhotoAccessRequests((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] || []).filter((id) => id !== userId),
    }));
    toast({
      title: 'Доступ предоставлен',
    });
  };

  const handleDenyAccess = (listingId: number, userId: number) => {
    setPhotoAccessRequests((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] || []).filter((id) => id !== userId),
    }));
    toast({
      title: 'Запрос отклонен',
    });
  };

  const hasAccessToPrivatePhotos = (listingId: number, userId: number = 1) => {
    const listing = listings.find((l) => l.id === listingId);
    if (listing?.ownerId === userId) return true;
    return (grantedAccess[listingId] || []).includes(userId);
  };

  const handleBlockUser = (listingId: number) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;

    if (blockedUsers.includes(listing.ownerId)) {
      setBlockedUsers((prev) => prev.filter((id) => id !== listing.ownerId));
      toast({
        title: 'Пользователь разблокирован',
      });
    } else {
      setBlockedUsers((prev) => [...prev, listing.ownerId]);
      toast({
        title: 'Пользователь заблокирован',
        description: 'Вы больше не будете видеть его объявления',
      });
    }
  };

  const handleSendMessage = (recipientId: number, message: string, currentUserId: number) => {
    const newMsg = {
      id: Date.now(),
      senderId: currentUserId,
      recipientId,
      message,
      timestamp: Date.now(),
    };

    setMessages((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMsg],
    }));

    toast({
      title: 'Сообщение отправлено',
    });
  };

  return {
    listings,
    setListings,
    comments,
    setComments,
    favorites,
    userVotes,
    cardPhotoIndexes,
    photoAccessRequests,
    grantedAccess,
    blockedUsers,
    messages,
    handleToggleFavorite,
    handleVote,
    handleNextCardPhoto,
    handlePrevCardPhoto,
    handleDeleteListing,
    handleRequestAccess,
    handleGrantAccess,
    handleDenyAccess,
    hasAccessToPrivatePhotos,
    handleBlockUser,
    handleSendMessage,
  };
};
