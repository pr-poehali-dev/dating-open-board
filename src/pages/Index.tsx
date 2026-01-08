import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const categories = [
  { id: 'sex', name: 'Секс знакомства', icon: 'Heart', color: 'bg-pink-100 text-pink-700' },
  { id: 'escort', name: 'Эскорт', icon: 'User', color: 'bg-purple-100 text-purple-700' },
  { id: 'rent', name: 'Аренда', icon: 'Home', color: 'bg-blue-100 text-blue-700' },
  { id: 'tourism', name: 'Туризм', icon: 'MapPin', color: 'bg-green-100 text-green-700' },
  { id: 'fetish', name: 'Фетиш', icon: 'Star', color: 'bg-orange-100 text-orange-700' },
  { id: 'trans', name: 'Трансы', icon: 'Users', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'bdsm', name: 'БДСМ', icon: 'Lock', color: 'bg-red-100 text-red-700' },
];

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

  const filteredListings = mockListings.filter((listing) => {
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
            <Button variant="outline" size="sm">
              <Icon name="User" size={16} className="mr-2" />
              Войти
            </Button>
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
            {selectedCategory
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
              className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedListing(listing)}
            >
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

            <div className="flex items-center text-muted-foreground">
              <Icon name="MapPin" size={18} className="mr-2" />
              {selectedListing?.location}
            </div>

            <p className="text-foreground leading-relaxed">
              {selectedListing?.description}
            </p>

            <div className="pt-4 border-t flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {selectedListing?.price}
              </span>
              <Button size="lg">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Написать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
