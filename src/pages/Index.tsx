import { useState } from 'react';
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
  { id: 'rent', name: 'Аренда', icon: 'Home', color: 'bg-blue-100 text-blue-700' },
  { id: 'tourism', name: 'Туризм', icon: 'MapPin', color: 'bg-green-100 text-green-700' },
  { id: 'fetish', name: 'Фетиш', icon: 'Star', color: 'bg-orange-100 text-orange-700' },
  { id: 'trans', name: 'Трансы', icon: 'Users', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'bdsm', name: 'БДСМ', icon: 'Lock', color: 'bg-red-100 text-red-700' },
];

const mockReviews: any = {
  1: [
    { id: 1, author: 'Александр', rating: 5, comment: 'Отличная встреча, всё на высшем уровне!', date: '2 дня назад' },
    { id: 2, author: 'Дмитрий', rating: 5, comment: 'Очень приятная девушка, рекомендую', date: '5 дней назад' },
    { id: 3, author: 'Михаил', rating: 4, comment: 'Хорошо, соответствует описанию', date: '1 неделю назад' },
  ],
  2: [
    { id: 1, author: 'Иван', rating: 5, comment: 'Премиальный сервис, всё идеально', date: '1 день назад' },
    { id: 2, author: 'Сергей', rating: 5, comment: 'Профессиональный подход, буду обращаться снова', date: '3 дня назад' },
  ],
};

const mockListings = [
  {
    id: 1,
    title: 'Анна, 25 лет',
    category: 'sex',
    location: 'Москва, Центр',
    rating: 4.8,
    reviews: 24,
    verified: true,
    description: 'Приятная встреча, комфортная обстановка',
    price: '5000 ₽/час',
  },
  {
    id: 2,
    title: 'Элитное сопровождение VIP',
    category: 'escort',
    location: 'Москва, Пресня',
    rating: 4.9,
    reviews: 45,
    verified: true,
    description: 'Премиальный сервис для деловых встреч',
    price: '15000 ₽/час',
  },
  {
    id: 3,
    title: 'Квартира посуточно',
    category: 'rent',
    location: 'Санкт-Петербург',
    rating: 4.6,
    reviews: 18,
    verified: false,
    description: 'Уютная квартира в центре города',
    price: '3000 ₽/сутки',
  },
  {
    id: 4,
    title: 'Тур выходного дня',
    category: 'tourism',
    location: 'Сочи',
    rating: 4.7,
    reviews: 32,
    verified: true,
    description: 'Отдых на море с развлечениями',
    price: '25000 ₽',
  },
  {
    id: 5,
    title: 'Мария, 28 лет',
    category: 'fetish',
    location: 'Москва, Юго-Запад',
    rating: 4.9,
    reviews: 56,
    verified: true,
    description: 'Особые встречи для ценителей',
    price: '8000 ₽/час',
  },
  {
    id: 6,
    title: 'София, 24 года',
    category: 'trans',
    location: 'Москва, Арбат',
    rating: 4.8,
    reviews: 29,
    verified: true,
    description: 'Яркая и запоминающаяся встреча',
    price: '6000 ₽/час',
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [listings, setListings] = useState(mockListings);
  const [reviews, setReviews] = useState<any>(mockReviews);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();

  const [newListing, setNewListing] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    price: '',
  });

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
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
      rating: 0,
      reviews: 0,
      verified: false,
    };

    setListings([listing, ...listings]);
    setShowCreateDialog(false);
    setNewListing({
      title: '',
      category: '',
      location: '',
      description: '',
      price: '',
    });

    toast({
      title: 'Успешно!',
      description: 'Ваше объявление опубликовано',
    });
  };

  const handleAddReview = () => {
    if (!newReview.author || !newReview.comment) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля отзыва',
        variant: 'destructive',
      });
      return;
    }

    const listingId = selectedListing.id;
    const review = {
      id: (reviews[listingId]?.length || 0) + 1,
      ...newReview,
      date: 'Только что',
    };

    setReviews({
      ...reviews,
      [listingId]: [review, ...(reviews[listingId] || [])],
    });

    const updatedListings = listings.map((listing) => {
      if (listing.id === listingId) {
        const allReviews = [review, ...(reviews[listingId] || [])];
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        return {
          ...listing,
          rating: Math.round(avgRating * 10) / 10,
          reviews: allReviews.length,
        };
      }
      return listing;
    });

    setListings(updatedListings);
    setSelectedListing(updatedListings.find((l) => l.id === listingId));
    setShowReviewDialog(false);
    setNewReview({ author: '', rating: 5, comment: '' });

    toast({
      title: 'Спасибо!',
      description: 'Ваш отзыв опубликован',
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

  const filteredListings = listings.filter((listing) => {
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavorites || favorites.includes(listing.id);
    return matchesCategory && matchesSearch && matchesFavorites;
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
              <Button variant="outline" size="sm">
                <Icon name="User" size={16} className="mr-2" />
                Войти
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Поиск по объявлениям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] relative"
              onClick={() => setSelectedListing(listing)}
            >
              <button
                onClick={(e) => toggleFavorite(listing.id, e)}
                className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all hover:scale-110 shadow-md"
              >
                <Icon
                  name="Heart"
                  size={20}
                  className={favorites.includes(listing.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />
              </button>
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Icon
                  name={getCategoryIcon(listing.category) as any}
                  size={64}
                  className="text-primary/40"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{listing.title}</h3>
                  {listing.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      Верифицирован
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {listing.location}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{listing.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({listing.reviews})
                    </span>
                  </div>
                  <span className="font-semibold text-primary">{listing.price}</span>
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

      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedListing?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <Icon
                name={getCategoryIcon(selectedListing?.category) as any}
                size={96}
                className="text-primary/40"
              />
            </div>

            <div className="flex items-center gap-4">
              {selectedListing?.verified && (
                <Badge className="bg-green-100 text-green-700">
                  <Icon name="CheckCircle" size={14} className="mr-1" />
                  Верифицирован
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{selectedListing?.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({selectedListing?.reviews} отзывов)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-muted-foreground">
                <Icon name="MapPin" size={18} className="mr-2" />
                {selectedListing?.location}
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

            <p className="text-foreground leading-relaxed">
              {selectedListing?.description}
            </p>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Отзывы</h3>
                <Button onClick={() => setShowReviewDialog(true)} variant="outline" size="sm">
                  <Icon name="MessageSquarePlus" size={16} className="mr-2" />
                  Оставить отзыв
                </Button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {reviews[selectedListing?.id]?.length > 0 ? (
                  reviews[selectedListing?.id].map((review: any) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.comment}</p>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Пока нет отзывов. Будьте первым!
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

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оставить отзыв</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="author">Ваше имя *</Label>
              <Input
                id="author"
                placeholder="Например: Александр"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Оценка *</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Icon
                      name="Star"
                      size={32}
                      className={
                        star <= newReview.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Комментарий *</Label>
              <Textarea
                id="comment"
                placeholder="Расскажите о вашем опыте"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddReview} className="flex-1">
                <Icon name="Send" size={18} className="mr-2" />
                Отправить
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewDialog(false);
                  setNewReview({ author: '', rating: 5, comment: '' });
                }}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;