import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { id: 'sex', name: 'Секс знакомства', icon: 'Heart', color: 'bg-pink-100 text-pink-700' },
  { id: 'escort', name: 'Эскорт', icon: 'User', color: 'bg-purple-100 text-purple-700' },
  { id: 'couples', name: 'Пары МЖ', icon: 'Users2', color: 'bg-rose-100 text-rose-700' },
  { id: 'rent', name: 'Аренда', icon: 'Home', color: 'bg-blue-100 text-blue-700' },
  { id: 'tourism', name: 'Туризм', icon: 'MapPin', color: 'bg-green-100 text-green-700' },
  { id: 'fetish', name: 'Фетиш', icon: 'Star', color: 'bg-orange-100 text-orange-700' },
  { id: 'trans', name: 'Трансы', icon: 'Users', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'bdsm', name: 'БДСМ', icon: 'Lock', color: 'bg-red-100 text-red-700' },
];

const popularSearches = [
  'знакомства',
  'встреча',
  'девушка',
  'москва',
  'центр',
  'vip',
  'проверенная',
  'массаж',
];

const mockComments: any = {
  1: [
    { id: 1, author: 'Александр', comment: 'Отличная встреча, всё на высшем уровне!', date: '2 дня назад', userId: 2 },
    { id: 2, author: 'Дмитрий', comment: 'Очень приятная девушка, рекомендую', date: '5 дней назад', userId: 3 },
    { id: 3, author: 'Михаил', comment: 'Хорошо, соответствует описанию', date: '1 неделю назад', userId: 4 },
  ],
  2: [
    { id: 1, author: 'Иван', comment: 'Премиальный сервис, всё идеально', date: '1 день назад', userId: 5 },
    { id: 2, author: 'Сергей', comment: 'Профессиональный подход, буду обращаться снова', date: '3 дня назад', userId: 6 },
  ],
};

const mockListings = [
  {
    id: 1,
    title: 'Анна, 25 лет',
    category: 'sex',
    location: 'Москва, Центр',
    likes: 42,
    dislikes: 3,
    commentsCount: 24,
    verified: true,
    description: 'Приятная встреча, комфортная обстановка',
    price: '5000 ₽/час',
    isVip: false,
    boostedAt: null,
    ownerId: 1,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
  {
    id: 2,
    title: 'Элитное сопровождение VIP',
    category: 'escort',
    location: 'Москва, Пресня',
    likes: 89,
    dislikes: 2,
    commentsCount: 45,
    verified: true,
    description: 'Премиальный сервис для деловых встреч',
    price: '15000 ₽/час',
    isVip: true,
    boostedAt: Date.now(),
    ownerId: 1,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
  {
    id: 3,
    title: 'Квартира посуточно',
    category: 'rent',
    location: 'Санкт-Петербург',
    likes: 28,
    dislikes: 5,
    commentsCount: 18,
    verified: false,
    description: 'Уютная квартира в центре города',
    price: '3000 ₽/сутки',
    isVip: false,
    boostedAt: null,
    ownerId: 2,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
  {
    id: 4,
    title: 'Тур выходного дня',
    category: 'tourism',
    location: 'Сочи',
    likes: 56,
    dislikes: 8,
    commentsCount: 32,
    verified: true,
    description: 'Отдых на море с развлечениями',
    price: '25000 ₽',
    isVip: false,
    boostedAt: null,
    ownerId: 2,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
  {
    id: 5,
    title: 'Мария, 28 лет',
    category: 'fetish',
    location: 'Москва, Юго-Запад',
    likes: 102,
    dislikes: 4,
    commentsCount: 56,
    verified: true,
    description: 'Особые встречи для ценителей',
    price: '8000 ₽/час',
    isVip: false,
    boostedAt: null,
    ownerId: 2,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
  {
    id: 6,
    title: 'София, 24 года',
    category: 'trans',
    location: 'Москва, Арбат',
    likes: 64,
    dislikes: 6,
    commentsCount: 29,
    verified: true,
    description: 'Яркая и запоминающаяся встреча',
    price: '6000 ₽/час',
    isVip: false,
    boostedAt: null,
    ownerId: 2,
    protectionEnabled: false,
    photos: [],
    privatePhotos: [],
  },
];

const Index = () => {
  const [currentUserId] = useState(1);
  const [showProfile, setShowProfile] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('searchQuery') || '';
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [editingComment, setEditingComment] = useState<any>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentType, setPaymentType] = useState<'vip' | 'boost' | 'protection' | null>(null);
  const [listings, setListings] = useState(mockListings);
  const [comments, setComments] = useState<any>(mockComments);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [userVotes, setUserVotes] = useState<{[key: number]: 'like' | 'dislike'}>({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoAccessRequests, setPhotoAccessRequests] = useState<{[key: number]: number[]}>({});
  const [grantedAccess, setGrantedAccess] = useState<{[key: number]: number[]}>({});
  const [showPrivatePhotos, setShowPrivatePhotos] = useState(false);
  const [showAccessRequestDialog, setShowAccessRequestDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearchSubmit = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory([query.trim(), ...searchHistory].slice(0, 10));
    }
    setShowSearchHistory(false);
  };

  const handleSearchHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    setShowSearchHistory(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getAutocomplete = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const suggestions = new Set<string>();
    
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(query)) {
        suggestions.add(cat.name);
      }
    });
    
    listings.forEach(listing => {
      if (listing.title.toLowerCase().includes(query)) {
        suggestions.add(listing.title);
      }
      if (listing.location.toLowerCase().includes(query)) {
        suggestions.add(listing.location);
      }
    });
    
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(query)) {
        suggestions.add(search);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  };

  const autocompleteSuggestions = getAutocomplete();

  const [newListing, setNewListing] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    price: '',
    photos: [] as string[],
    privatePhotos: [] as string[],
  });

  const [newComment, setNewComment] = useState({
    author: '',
    comment: '',
  });

  const handleCreateListing = () => {
    if (!newListing.title || !newListing.category || !newListing.location || !newListing.price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const listing = {
      id: listings.length + 1,
      ...newListing,
      likes: 0,
      dislikes: 0,
      commentsCount: 0,
      verified: false,
      isVip: false,
      boostedAt: null,
      ownerId: currentUserId,
      protectionEnabled: false,
      photos: newListing.photos || [],
      privatePhotos: newListing.privatePhotos || [],
    };

    setListings([listing, ...listings]);
    setShowCreateDialog(false);
    setNewListing({
      title: '',
      category: '',
      location: '',
      description: '',
      price: '',
      photos: [],
      privatePhotos: [],
    });

    toast({
      title: 'Успешно!',
      description: 'Ваше объявление опубликовано',
    });
  };

  const handleEditListing = () => {
    if (!editingListing.title || !editingListing.category || !editingListing.location || !editingListing.price) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const updatedListings = listings.map((listing) =>
      listing.id === editingListing.id ? editingListing : listing
    );

    setListings(updatedListings);
    setEditingListing(null);

    toast({
      title: 'Сохранено!',
      description: 'Изменения успешно сохранены',
    });
  };

  const handleDeleteListing = (listingId: number) => {
    setListings(listings.filter((listing) => listing.id !== listingId));
    toast({
      title: 'Удалено',
      description: 'Объявление успешно удалено',
    });
  };

  const myListings = listings.filter((listing) => listing.ownerId === currentUserId);

  const handleVote = (listingId: number, voteType: 'like' | 'dislike') => {
    const listing = listings.find((l) => l.id === listingId);
    if (listing?.protectionEnabled) {
      toast({
        title: 'Оценки отключены',
        description: 'Владелец отключил возможность оценки этого объявления',
        variant: 'destructive',
      });
      return;
    }

    const previousVote = userVotes[listingId];
    
    setListings(listings.map((listing) => {
      if (listing.id === listingId) {
        let newLikes = listing.likes;
        let newDislikes = listing.dislikes;

        if (previousVote === voteType) {
          if (voteType === 'like') newLikes--;
          else newDislikes--;
        } else {
          if (previousVote === 'like') newLikes--;
          if (previousVote === 'dislike') newDislikes--;
          
          if (voteType === 'like') newLikes++;
          else newDislikes++;
        }

        return { ...listing, likes: newLikes, dislikes: newDislikes };
      }
      return listing;
    }));

    setUserVotes((prev) => {
      const newVotes = { ...prev };
      if (previousVote === voteType) {
        delete newVotes[listingId];
      } else {
        newVotes[listingId] = voteType;
      }
      return newVotes;
    });

    if (selectedListing?.id === listingId) {
      const updated = listings.find((l) => l.id === listingId);
      if (updated) setSelectedListing(updated);
    }
  };

  const handleAddComment = () => {
    if (!newComment.author || !newComment.comment) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля комментария',
        variant: 'destructive',
      });
      return;
    }

    if (selectedListing?.protectionEnabled) {
      toast({
        title: 'Комментарии отключены',
        description: 'Владелец отключил возможность комментировать это объявление',
        variant: 'destructive',
      });
      return;
    }

    const listingId = selectedListing.id;
    const comment = {
      id: (comments[listingId]?.length || 0) + 1,
      ...newComment,
      date: 'Только что',
      userId: currentUserId,
    };

    setComments({
      ...comments,
      [listingId]: [comment, ...(comments[listingId] || [])],
    });

    const updatedListings = listings.map((listing) => {
      if (listing.id === listingId) {
        return {
          ...listing,
          commentsCount: (comments[listingId]?.length || 0) + 1,
        };
      }
      return listing;
    });

    setListings(updatedListings);
    setSelectedListing(updatedListings.find((l) => l.id === listingId));
    setShowCommentDialog(false);
    setNewComment({ author: '', comment: '' });

    toast({
      title: 'Спасибо!',
      description: 'Ваш комментарий опубликован',
    });
  };

  const handleEditComment = () => {
    if (!editingComment.comment) {
      toast({
        title: 'Ошибка',
        description: 'Комментарий не может быть пустым',
        variant: 'destructive',
      });
      return;
    }

    const listingId = selectedListing.id;
    const updatedComments = {
      ...comments,
      [listingId]: comments[listingId].map((c: any) =>
        c.id === editingComment.id
          ? { ...c, comment: editingComment.comment, date: 'Изменено только что' }
          : c
      ),
    };

    setComments(updatedComments);
    setEditingComment(null);

    toast({
      title: 'Готово!',
      description: 'Комментарий успешно изменён',
    });
  };

  const handleDeleteComment = (listingId: number, commentId: number) => {
    const updatedComments = {
      ...comments,
      [listingId]: comments[listingId].filter((c: any) => c.id !== commentId),
    };

    setComments(updatedComments);

    const updatedListings = listings.map((listing) => {
      if (listing.id === listingId) {
        return {
          ...listing,
          commentsCount: updatedComments[listingId]?.length || 0,
        };
      }
      return listing;
    });

    setListings(updatedListings);
    setSelectedListing(updatedListings.find((l) => l.id === listingId));

    toast({
      title: 'Удалено',
      description: 'Комментарий успешно удалён',
    });
  };

  const toggleFavorite = (listingId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setFavorites((prev) => {
      const isAdded = !prev.includes(listingId);
      const newFavorites = isAdded
        ? [...prev, listingId]
        : prev.filter((id) => id !== listingId);
      
      toast({
        title: isAdded ? 'Добавлено в избранное' : 'Удалено из избранного',
        description: isAdded
          ? 'Объявление сохранено в ваших избранных'
          : 'Объявление удалено из избранных',
      });
      
      return newFavorites;
    });
  };

  const handleRequestPhotoAccess = () => {
    if (!selectedListing || selectedListing.ownerId === currentUserId) return;

    const listingId = selectedListing.id;
    const currentRequests = photoAccessRequests[listingId] || [];

    if (currentRequests.includes(currentUserId)) {
      toast({
        title: 'Запрос уже отправлен',
        description: 'Дождитесь ответа владельца',
        variant: 'destructive',
      });
      return;
    }

    setPhotoAccessRequests({
      ...photoAccessRequests,
      [listingId]: [...currentRequests, currentUserId],
    });

    toast({
      title: 'Запрос отправлен',
      description: 'Владелец получит уведомление о вашем запросе',
    });
  };

  const handleGrantAccess = (listingId: number, userId: number) => {
    const currentGranted = grantedAccess[listingId] || [];
    
    setGrantedAccess({
      ...grantedAccess,
      [listingId]: [...currentGranted, userId],
    });

    setPhotoAccessRequests({
      ...photoAccessRequests,
      [listingId]: (photoAccessRequests[listingId] || []).filter((id) => id !== userId),
    });

    // Автоматический взаимный обмен: находим объявления пользователя и даём доступ
    const requesterListings = listings.filter((l) => l.ownerId === userId && l.privatePhotos.length > 0);
    
    if (requesterListings.length > 0) {
      const mutualAccess = { ...grantedAccess };
      let grantedCount = 0;

      requesterListings.forEach((listing) => {
        // Проверяем, есть ли уже доступ
        if (!(mutualAccess[listing.id] || []).includes(currentUserId)) {
          mutualAccess[listing.id] = [...(mutualAccess[listing.id] || []), currentUserId];
          grantedCount++;
        }
      });

      if (grantedCount > 0) {
        setGrantedAccess(mutualAccess);
        
        toast({
          title: 'Взаимный обмен!',
          description: `Доступ предоставлен. Вы получили доступ к ${grantedCount} объявлению(-ям) пользователя`,
        });
        return;
      }
    }

    toast({
      title: 'Доступ предоставлен',
      description: 'Пользователь теперь может видеть ваши приватные фото',
    });
  };

  const handleRejectAccess = (listingId: number, userId: number) => {
    setPhotoAccessRequests({
      ...photoAccessRequests,
      [listingId]: (photoAccessRequests[listingId] || []).filter((id) => id !== userId),
    });

    toast({
      title: 'Запрос отклонён',
    });
  };

  const hasAccessToPrivatePhotos = (listingId: number) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return false;
    if (listing.ownerId === currentUserId) return true;
    return (grantedAccess[listingId] || []).includes(currentUserId);
  };

  const getPendingRequests = () => {
    let total = 0;
    myListings.forEach((listing) => {
      total += (photoAccessRequests[listing.id] || []).length;
    });
    return total;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false, isPrivate: boolean = false) => {
    const files = event.target.files;
    if (!files) return;

    const currentPhotos = isPrivate 
      ? (isEditing ? (editingListing?.privatePhotos || []) : newListing.privatePhotos)
      : (isEditing ? (editingListing?.photos || []) : newListing.photos);
    
    if (currentPhotos.length + files.length > 10) {
      toast({
        title: 'Ограничение',
        description: 'Можно загрузить не более 10 фотографий',
        variant: 'destructive',
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Ошибка',
          description: 'Можно загружать только изображения',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing) {
          if (isPrivate) {
            setEditingListing({
              ...editingListing,
              privatePhotos: [...(editingListing?.privatePhotos || []), base64String],
            });
          } else {
            setEditingListing({
              ...editingListing,
              photos: [...(editingListing?.photos || []), base64String],
            });
          }
        } else {
          if (isPrivate) {
            setNewListing({
              ...newListing,
              privatePhotos: [...newListing.privatePhotos, base64String],
            });
          } else {
            setNewListing({
              ...newListing,
              photos: [...newListing.photos, base64String],
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (index: number, isEditing: boolean = false, isPrivate: boolean = false) => {
    if (isEditing) {
      if (isPrivate) {
        setEditingListing({
          ...editingListing,
          privatePhotos: editingListing?.privatePhotos?.filter((_: string, i: number) => i !== index) || [],
        });
      } else {
        setEditingListing({
          ...editingListing,
          photos: editingListing?.photos?.filter((_: string, i: number) => i !== index) || [],
        });
      }
    } else {
      if (isPrivate) {
        setNewListing({
          ...newListing,
          privatePhotos: newListing.privatePhotos.filter((_, i) => i !== index),
        });
      } else {
        setNewListing({
          ...newListing,
          photos: newListing.photos.filter((_, i) => i !== index),
        });
      }
    }

    toast({
      title: 'Удалено',
      description: 'Фотография удалена',
    });
  };

  const handlePayment = () => {
    if (!selectedListing || !paymentType) return;

    const updatedListings = listings.map((listing) => {
      if (listing.id === selectedListing.id) {
        if (paymentType === 'vip') {
          return { ...listing, isVip: true };
        } else if (paymentType === 'boost') {
          return { ...listing, boostedAt: Date.now() };
        } else if (paymentType === 'protection') {
          return { ...listing, protectionEnabled: true };
        }
      }
      return listing;
    });

    setListings(updatedListings);
    setSelectedListing(updatedListings.find((l) => l.id === selectedListing.id));
    setShowPaymentDialog(false);
    setPaymentType(null);

    toast({
      title: 'Оплата успешна!',
      description:
        paymentType === 'vip'
          ? 'Ваше объявление теперь VIP'
          : paymentType === 'boost'
          ? 'Объявление поднято в топ'
          : 'Защита от оценок и комментариев активирована',
    });
  };

  const filteredListings = listings
    .filter((listing) => {
      const matchesCategory = !selectedCategory || listing.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavorites || favorites.includes(listing.id);
      return matchesCategory && matchesSearch && matchesFavorites;
    })
    .sort((a, b) => {
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      if (a.boostedAt && b.boostedAt) return b.boostedAt - a.boostedAt;
      if (a.boostedAt && !b.boostedAt) return -1;
      if (!a.boostedAt && b.boostedAt) return 1;
      return 0;
    });

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || 'Circle';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">МойДосуг</h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowFavorites(!showFavorites)}
                variant={showFavorites ? 'default' : 'outline'}
                size="sm"
                className="relative"
              >
                <Icon name="Heart" size={16} className="mr-2" />
                Избранное
                {favorites.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} size="sm">
                <Icon name="Plus" size={16} className="mr-2" />
                Разместить
              </Button>
              <Button
                variant={showProfile ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
                className="relative"
              >
                <Icon name="User" size={16} className="mr-2" />
                Кабинет
                {myListings.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-white h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {myListings.length}
                  </Badge>
                )}
                {getPendingRequests() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {getPendingRequests()}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
            />
            <Input
              placeholder="Поиск по объявлениям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchQuery);
                }
              }}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
              >
                <Icon name="X" size={16} />
              </button>
            )}
            
            {showSearchHistory && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowSearchHistory(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-30 max-h-80 overflow-y-auto">
                  {autocompleteSuggestions.length > 0 && (
                    <div className="border-b">
                      <div className="px-4 py-2 bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Подсказки</span>
                      </div>
                      {autocompleteSuggestions.map((suggestion, index) => (
                        <button
                          key={`autocomplete-${index}`}
                          onClick={() => handleSearchHistoryClick(suggestion)}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 group"
                        >
                          <Icon name="Search" size={14} className="text-primary" />
                          <span className="flex-1 text-sm">{suggestion}</span>
                          <Icon name="CornerDownLeft" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {searchHistory.length > 0 && (
                    <>
                      <div className="flex items-center justify-between px-4 py-2 bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">История поиска</span>
                        <button
                          onClick={clearSearchHistory}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Очистить
                        </button>
                      </div>
                      {searchHistory.map((item, index) => (
                        <button
                          key={`history-${index}`}
                          onClick={() => handleSearchHistoryClick(item)}
                          className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 group"
                        >
                          <Icon name="Clock" size={14} className="text-muted-foreground" />
                          <span className="flex-1 text-sm">{item}</span>
                          <Icon name="ArrowUpLeft" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </>
                  )}
                  
                  {autocompleteSuggestions.length === 0 && searchHistory.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Начните вводить для поиска
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showProfile ? (
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
        ) : (
          <>
        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon name={category.icon as any} size={24} />
                </div>
                <p className="text-sm font-medium text-center">{category.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {showFavorites
              ? 'Избранное'
              : selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : 'Все объявления'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Найдено: {filteredListings.length}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 animate-fade-in">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] relative aspect-square"
              onClick={() => setSelectedListing(listing)}
            >
              {listing.isVip && (
                <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-1.5 py-0.5">
                  <Icon name="Crown" size={10} className="mr-0.5" />
                  VIP
                </Badge>
              )}
              {listing.boostedAt && (
                <Badge className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs px-1.5 py-0.5">
                  <Icon name="TrendingUp" size={10} className="mr-0.5" />
                  ТОП
                </Badge>
              )}
              <button
                onClick={(e) => toggleFavorite(listing.id, e)}
                className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 transition-all hover:scale-110 shadow-md"
              >
                <Icon
                  name="Heart"
                  size={14}
                  className={favorites.includes(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />
              </button>
              
              <div className="h-full flex flex-col justify-between overflow-hidden">
                <div className={`flex-1 flex items-center justify-center ${
                  listing.isVip
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                    : 'bg-gradient-to-br from-primary/20 to-primary/5'
                }`}>
                  {listing.photos && listing.photos.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      {listing.photos.length > 1 && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0 text-xs">
                          <Icon name="Image" size={10} className="mr-1" />
                          {listing.photos.length}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <Icon
                      name={getCategoryIcon(listing.category) as any}
                      size={40}
                      className="text-primary/40"
                    />
                  )}
                </div>

                <div className="p-3 bg-white/95">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{listing.title}</h3>
                  
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Icon name="MapPin" size={10} className="mr-0.5" />
                    <span className="line-clamp-1">{listing.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <span className="text-xs">👍</span>
                        <span className="text-xs font-medium text-green-600">{listing.likes}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-xs">👎</span>
                        <span className="text-xs font-medium text-red-600">{listing.dislikes}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Icon name="MessageCircle" size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{listing.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-primary block">{listing.price}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Объявления не найдены</p>
          </div>
        )}
        </>
        )}
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  {newListing.photos.map((photo, index) => (
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
                  {newListing.privatePhotos.map((photo, index) => (
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

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCreateListing} className="flex-1">
                <Icon name="Check" size={18} className="mr-2" />
                Опубликовать
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

      <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Редактировать объявление</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="edit-title">Название объявления *</Label>
              <Input
                id="edit-title"
                placeholder="Например: Анна, 25 лет"
                value={editingListing?.title || ''}
                onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Категория *</Label>
              <Select
                value={editingListing?.category || ''}
                onValueChange={(value) => setEditingListing({ ...editingListing, category: value })}
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
              <Label htmlFor="edit-location">Локация *</Label>
              <Input
                id="edit-location"
                placeholder="Например: Москва, Центр"
                value={editingListing?.location || ''}
                onChange={(e) => setEditingListing({ ...editingListing, location: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                placeholder="Расскажите подробнее о вашем предложении"
                value={editingListing?.description || ''}
                onChange={(e) => setEditingListing({ ...editingListing, description: e.target.value })}
                className="mt-1.5 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="edit-price">Цена *</Label>
              <Input
                id="edit-price"
                placeholder="Например: 5000 ₽/час"
                value={editingListing?.price || ''}
                onChange={(e) => setEditingListing({ ...editingListing, price: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Фотографии (до 10 штук)</Label>
                <Badge variant="secondary">
                  {editingListing?.photos?.length || 0}/10
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                ⚠️ Разрешены только неинтимные фото: лицо, тело, общий вид. Интимный 18+ контент запрещён.
              </p>

              {editingListing?.photos && editingListing.photos.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {editingListing.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(index, true)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!editingListing?.photos || editingListing.photos.length < 10) && (
                <div>
                  <input
                    type="file"
                    id="photo-upload-edit"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, true)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload-edit')?.click()}
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
                  {editingListing?.privatePhotos?.length || 0}/10
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                ⚠️ Разрешены только неинтимные фото: лицо, тело, ноги, спина. Интимный 18+ контент запрещён.
              </p>

              {editingListing?.privatePhotos && editingListing.privatePhotos.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {editingListing.privatePhotos.map((photo: string, index: number) => (
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
                        onClick={() => handleDeletePhoto(index, true, true)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!editingListing?.privatePhotos || editingListing.privatePhotos.length < 10) && (
                <div>
                  <input
                    type="file"
                    id="private-photo-upload-edit"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, true, true)}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('private-photo-upload-edit')?.click()}
                    className="w-full"
                  >
                    <Icon name="Lock" size={18} className="mr-2" />
                    Загрузить приватные фото
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditListing} className="flex-1">
                <Icon name="Check" size={18} className="mr-2" />
                Сохранить изменения
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingListing(null)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedListing} onOpenChange={() => {
        setSelectedListing(null);
        setCurrentPhotoIndex(0);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedListing?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center overflow-hidden">
              {selectedListing?.photos && selectedListing.photos.length > 0 ? (
                <>
                  <img
                    src={selectedListing.photos[currentPhotoIndex]}
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                  />
                  {selectedListing.photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => 
                          prev === 0 ? selectedListing.photos.length - 1 : prev - 1
                        )}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <Icon name="ChevronLeft" size={24} />
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => 
                          prev === selectedListing.photos.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                      >
                        <Icon name="ChevronRight" size={24} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedListing.photos.map((_: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentPhotoIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentPhotoIndex + 1} / {selectedListing.photos.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Icon
                  name={getCategoryIcon(selectedListing?.category) as any}
                  size={96}
                  className="text-primary/40"
                />
              )}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {selectedListing?.isVip && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Icon name="Crown" size={14} className="mr-1" />
                    VIP
                  </Badge>
                )}
                {selectedListing?.boostedAt && (
                  <Badge className="bg-blue-500 text-white">
                    <Icon name="TrendingUp" size={14} className="mr-1" />
                    ТОП
                  </Badge>
                )}
                {selectedListing?.verified && (
                  <Badge className="bg-green-100 text-green-700">
                    <Icon name="CheckCircle" size={14} className="mr-1" />
                    Верифицирован
                  </Badge>
                )}
                {selectedListing?.protectionEnabled && (
                  <Badge className="bg-orange-100 text-orange-700">
                    <Icon name="Shield" size={14} className="mr-1" />
                    Защищено
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVotes[selectedListing?.id] === 'like' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(selectedListing?.id, 'like')}
                    disabled={selectedListing?.protectionEnabled}
                  >
                    <span className="text-base">👍</span>
                    <span className="ml-1 font-semibold">{selectedListing?.likes}</span>
                  </Button>
                  <Button
                    variant={userVotes[selectedListing?.id] === 'dislike' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(selectedListing?.id, 'dislike')}
                    disabled={selectedListing?.protectionEnabled}
                  >
                    <span className="text-base">👎</span>
                    <span className="ml-1 font-semibold">{selectedListing?.dislikes}</span>
                  </Button>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="MessageCircle" size={16} />
                  <span className="text-sm font-medium">{selectedListing?.commentsCount} комментариев</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedListing?.id);
                }}
              >
                <Icon
                  name="Heart"
                  size={20}
                  className={favorites.includes(selectedListing?.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />
              </Button>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Icon name="MapPin" size={18} className="mr-2" />
              {selectedListing?.location}
            </div>

            <p className="text-foreground leading-relaxed">
              {selectedListing?.description}
            </p>

            {selectedListing?.privatePhotos && selectedListing.privatePhotos.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Lock" size={18} className="text-primary" />
                    <h3 className="font-semibold">Приватные фото ({selectedListing.privatePhotos.length})</h3>
                  </div>
                  {hasAccessToPrivatePhotos(selectedListing.id) && (
                    <Badge className="bg-green-100 text-green-700">
                      <Icon name="Check" size={12} className="mr-1" />
                      Доступ открыт
                    </Badge>
                  )}
                </div>

                {hasAccessToPrivatePhotos(selectedListing.id) ? (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedListing.privatePhotos.map((photo: string, index: number) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={photo}
                          alt={`Приватное фото ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setCurrentPhotoIndex(index);
                            setShowPrivatePhotos(true);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {selectedListing.privatePhotos.slice(0, 3).map((_: string, index: number) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Icon name="Lock" size={32} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Закрытые фотографии. Отправьте запрос для получения доступа
                    </p>
                    {(photoAccessRequests[selectedListing.id] || []).includes(currentUserId) ? (
                      <Badge variant="secondary">
                        <Icon name="Clock" size={12} className="mr-1" />
                        Запрос отправлен
                      </Badge>
                    ) : (
                      <Button onClick={handleRequestPhotoAccess} variant="outline" size="sm">
                        <Icon name="Unlock" size={14} className="mr-2" />
                        Запросить доступ
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedListing?.ownerId === currentUserId && (
              <div className="flex gap-2 pt-2 border-t">
                {!selectedListing?.isVip && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPaymentType('vip');
                      setShowPaymentDialog(true);
                    }}
                  >
                    <Icon name="Crown" size={14} className="mr-1" />
                    Сделать VIP (500₽)
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPaymentType('boost');
                    setShowPaymentDialog(true);
                  }}
                >
                  <Icon name="TrendingUp" size={14} className="mr-1" />
                  Поднять (200₽)
                </Button>
                {!selectedListing?.protectionEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPaymentType('protection');
                      setShowPaymentDialog(true);
                    }}
                  >
                    <Icon name="Shield" size={14} className="mr-1" />
                    Защита (300₽)
                  </Button>
                )}
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Комментарии</h3>
                <Button 
                  onClick={() => setShowCommentDialog(true)} 
                  variant="outline" 
                  size="sm"
                  disabled={selectedListing?.protectionEnabled}
                >
                  <Icon name="MessageSquarePlus" size={16} className="mr-2" />
                  Оставить комментарий
                </Button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {comments[selectedListing?.id]?.length > 0 ? (
                  comments[selectedListing?.id].map((comment: any) => (
                    <div key={comment.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.author}</span>
                            {comment.userId === currentUserId && (
                              <Badge variant="secondary" className="text-xs">Вы</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        {comment.userId === currentUserId && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => setEditingComment(comment)}
                            >
                              <Icon name="Pencil" size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => {
                                if (confirm('Удалить комментарий?')) {
                                  handleDeleteComment(selectedListing?.id, comment.id);
                                }
                              }}
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    {selectedListing?.protectionEnabled 
                      ? 'Комментарии отключены владельцем'
                      : 'Пока нет комментариев. Будьте первым!'}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-2xl font-bold text-primary">
                  {selectedListing?.price}
                </span>
                <Button size="lg">
                  <Icon name="MessageCircle" size={18} className="mr-2" />
                  Написать
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оставить комментарий</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="author">Ваше имя *</Label>
              <Input
                id="author"
                placeholder="Например: Александр"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="comment">Комментарий *</Label>
              <Textarea
                id="comment"
                placeholder="Поделитесь своим мнением"
                value={newComment.comment}
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddComment} className="flex-1">
                <Icon name="Send" size={18} className="mr-2" />
                Отправить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCommentDialog(false);
                  setNewComment({ author: '', comment: '' });
                }}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingComment} onOpenChange={() => setEditingComment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Редактировать комментарий</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="edit-comment">Комментарий *</Label>
              <Textarea
                id="edit-comment"
                placeholder="Поделитесь своим мнением"
                value={editingComment?.comment || ''}
                onChange={(e) => setEditingComment({ ...editingComment, comment: e.target.value })}
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditComment} className="flex-1">
                <Icon name="Check" size={18} className="mr-2" />
                Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingComment(null)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {paymentType === 'vip' 
                ? 'Сделать объявление VIP' 
                : paymentType === 'boost'
                ? 'Поднять в топ'
                : 'Защита от оценок и комментариев'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">
                  {paymentType === 'vip' 
                    ? 'VIP размещение' 
                    : paymentType === 'boost'
                    ? 'Поднятие в топ'
                    : 'Защита объявления'}
                </span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {paymentType === 'vip' ? '500 ₽' : paymentType === 'boost' ? '200 ₽' : '300 ₽'}
                </Badge>
              </div>

              <div className="space-y-3 text-sm">
                {paymentType === 'vip' ? (
                  <>
                    <div className="flex items-start gap-2">
                      <Icon name="Crown" size={16} className="text-primary mt-0.5" />
                      <p>Золотая рамка и значок VIP</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
                      <p>Приоритетное размещение в списках</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Eye" size={16} className="text-primary mt-0.5" />
                      <p>До 5x больше просмотров</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                      <p>Действует 30 дней</p>
                    </div>
                  </>
                ) : paymentType === 'boost' ? (
                  <>
                    <div className="flex items-start gap-2">
                      <Icon name="ArrowUp" size={16} className="text-primary mt-0.5" />
                      <p>Поднятие в самый верх списка</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="TrendingUp" size={16} className="text-primary mt-0.5" />
                      <p>Значок "ТОП" на объявлении</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Eye" size={16} className="text-primary mt-0.5" />
                      <p>До 3x больше просмотров</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                      <p>Действует 7 дней</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <Icon name="Shield" size={16} className="text-primary mt-0.5" />
                      <p>Полный запрет на оценки (лайки/дизлайки)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="MessageOff" size={16} className="text-primary mt-0.5" />
                      <p>Полный запрет на комментарии</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="BadgeCheck" size={16} className="text-primary mt-0.5" />
                      <p>Значок "Защищено"</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Clock" size={16} className="text-primary mt-0.5" />
                      <p>Действует бессрочно</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Способ оплаты</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col">
                  <Icon name="CreditCard" size={24} className="mb-2" />
                  <span className="text-sm">Карта</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Icon name="Wallet" size={24} className="mb-2" />
                  <span className="text-sm">Кошелек</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handlePayment} className="flex-1" size="lg">
                <Icon name="Check" size={18} className="mr-2" />
                Оплатить {paymentType === 'vip' ? '500 ₽' : paymentType === 'boost' ? '200 ₽' : '300 ₽'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPaymentDialog(false);
                  setPaymentType(null);
                }}
                size="lg"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivatePhotos} onOpenChange={setShowPrivatePhotos}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Lock" size={24} className="text-primary" />
              Приватные фотографии
            </DialogTitle>
          </DialogHeader>

          <div className="relative h-[600px] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center overflow-hidden">
            {selectedListing?.privatePhotos && selectedListing.privatePhotos.length > 0 && (
              <>
                <img
                  src={selectedListing.privatePhotos[currentPhotoIndex]}
                  alt={`Приватное фото ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {selectedListing.privatePhotos.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPhotoIndex((prev) => 
                        prev === 0 ? selectedListing.privatePhotos.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    >
                      <Icon name="ChevronLeft" size={32} />
                    </button>
                    <button
                      onClick={() => setCurrentPhotoIndex((prev) => 
                        prev === selectedListing.privatePhotos.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    >
                      <Icon name="ChevronRight" size={32} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedListing.privatePhotos.map((_: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === currentPhotoIndex
                              ? 'bg-white w-8'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {currentPhotoIndex + 1} / {selectedListing.privatePhotos.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;