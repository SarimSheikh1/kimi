import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { Search, ChefHat, Clock, Users, Flame, Heart, Bookmark, Share2, Printer, ArrowRight, Star, Menu, X, ChevronRight, Calendar, ShoppingCart, PlayCircle, Utensils, Coffee, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: 'bg-amber-100 text-amber-700' },
  { id: 'lunch', name: 'Lunch & Dinner', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  { id: 'dessert', name: 'Desserts', icon: Star, color: 'bg-pink-100 text-pink-700' },
  { id: 'quick', name: 'Quick & Easy', icon: Clock, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'healthy', name: 'Healthy', icon: Heart, color: 'bg-green-100 text-green-700' },
  { id: 'vegan', name: 'Vegan', icon: Sun, color: 'bg-lime-100 text-lime-700' },
];

const RECIPES = [
  {
    id: 1,
    title: "Rustic Tomato Basil Soup",
    description: "A comforting classic made with roasted tomatoes, fresh basil, and a hint of cream.",
    image: "https://images.unsplash.com/photo-1547592166-23acbe34071b?auto=format&fit=crop&w=800&q=80",
    time: "45 min",
    difficulty: "Easy",
    calories: 320,
    rating: 4.8,
    reviews: 124,
    category: "lunch",
    tags: ["Vegetarian", "Comfort Food"],
    ingredients: [
      "2 lbs Roma tomatoes, halved",
      "1 onion, quartered",
      "4 cloves garlic",
      "1 cup fresh basil",
      "2 cups vegetable broth",
      "1/2 cup heavy cream"
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "Place tomatoes, onion, and garlic on a baking sheet. Drizzle with olive oil and roast for 40 mins.",
      "Transfer roasted veggies to a pot. Add broth and basil.",
      "Simmer for 10 minutes, then blend until smooth.",
      "Stir in cream and season with salt and pepper."
    ]
  },
  {
    id: 2,
    title: "Avocado & Poached Egg Toast",
    description: "Creamy avocado spread over artisan sourdough topped with a perfectly poached egg.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&w=800&q=80",
    time: "15 min",
    difficulty: "Medium",
    calories: 410,
    rating: 4.9,
    reviews: 89,
    category: "breakfast",
    tags: ["Healthy", "Quick"],
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "2 large eggs",
      "Chili flakes",
      "Lemon juice",
      "Salt & pepper"
    ],
    instructions: [
      "Toast the sourdough bread until golden.",
      "Mash the avocado with lemon juice, salt, and pepper.",
      "Poach eggs in simmering water for 3 minutes.",
      "Spread avocado on toast, top with egg and chili flakes."
    ]
  },
  {
    id: 3,
    title: "Spicy Thai Basil Chicken",
    description: "A quick stir-fry with holy basil, chilies, and a savory sauce served over jasmine rice.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    time: "25 min",
    difficulty: "Medium",
    calories: 550,
    rating: 4.7,
    reviews: 210,
    category: "quick",
    tags: ["Spicy", "Asian"],
    ingredients: [
      "1 lb ground chicken",
      "Thai chilies, minced",
      "1 cup holy basil leaves",
      "2 cloves garlic, minced",
      "2 tbsp soy sauce",
      "1 tbsp oyster sauce"
    ],
    instructions: [
      "Heat oil in a wok over high heat.",
      "Add garlic and chilies, stir-fry for 30 seconds.",
      "Add chicken and cook until browned.",
      "Stir in sauces and basil leaves. Cook until wilted.",
      "Serve immediately over rice."
    ]
  },
  {
    id: 4,
    title: "Decadent Chocolate Lava Cake",
    description: "Rich, molten chocolate center in a mini cake, perfect for date night.",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80",
    time: "30 min",
    difficulty: "Hard",
    calories: 480,
    rating: 5.0,
    reviews: 56,
    category: "dessert",
    tags: ["Sweet", "Baking"],
    ingredients: [
      "1/2 cup butter",
      "1 cup semi-sweet chocolate",
      "2 eggs + 2 yolks",
      "1/4 cup sugar",
      "2 tbsp flour"
    ],
    instructions: [
      "Preheat oven to 450°F (230°C). Grease ramekins.",
      "Melt butter and chocolate together.",
      "Whisk eggs and sugar until pale.",
      "Fold chocolate mix into eggs, then fold in flour.",
      "Bake for 12-14 minutes. Center should still be jiggly."
    ]
  },
  {
    id: 5,
    title: "Mediterranean Quinoa Salad",
    description: "Fresh, light, and packed with protein. Cucumber, feta, olives, and herbs.",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
    time: "20 min",
    difficulty: "Easy",
    calories: 290,
    rating: 4.6,
    reviews: 45,
    category: "healthy",
    tags: ["Vegetarian", "Salad"],
    ingredients: [
      "1 cup quinoa, cooked",
      "1 cucumber, diced",
      "1 cup cherry tomatoes",
      "1/2 cup kalamata olives",
      "1/2 cup feta cheese",
      "Lemon vinaigrette"
    ],
    instructions: [
      "Cook quinoa according to package instructions and let cool.",
      "Chop cucumber, tomatoes, and olives.",
      "Combine all ingredients in a large bowl.",
      "Toss with vinaigrette and serve chilled."
    ]
  },
  {
    id: 6,
    title: "Classic Beef Burger",
    description: "Juicy beef patty with cheddar, lettuce, tomato, and secret sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    time: "35 min",
    difficulty: "Medium",
    calories: 700,
    rating: 4.8,
    reviews: 312,
    category: "lunch",
    tags: ["Meat", "Comfort"],
    ingredients: [
      "1 lb ground beef (80/20)",
      "4 brioche buns",
      "4 slices cheddar",
      "Lettuce, tomato, onion",
      "Salt & pepper"
    ],
    instructions: [
      "Form beef into 4 patties. Season generously.",
      "Grill or pan-sear over high heat for 4 mins per side.",
      "Add cheese in the last minute to melt.",
      "Toast buns. Assemble burgers with toppings."
    ]
  }
];
// --- Components ---
const Navbar = ({ activeTab, setActiveTab, favoritesCount }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'recipes', label: 'Recipes' },
    { id: 'meal-planner', label: 'Meal Planner' },
    { id: 'tips', label: 'Tips & Tricks' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-white/90 backdrop-blur-md border-stone-200 py-3 shadow-sm" : "bg-transparent border-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer"
             onClick={() => setActiveTab('home')}>
          <div className="bg-orange-500 p-2 rounded-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className={cn(
            "text-2xl font-bold tracking-tight",
            isScrolled ? "text-stone-800" : "text-stone-900"
          )}>
            Flavor<span className="text-orange-500">Craft</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                activeTab === link.id ? "text-orange-600" : "text-stone-600"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
            <Heart className="w-5 h-5 text-stone-600" />
            {favoritesCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
          <button className="bg-stone-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors">
            Subscribe
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-lg font-medium text-stone-800 py-2 border-b border-stone-100"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1600&q=80" 
          alt="Cooking Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 text-sm font-medium mb-6">
            Welcome to FlavorCraft
          </span>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Cook Like a Pro, <br />
            <span className="text-orange-500">Eat Like a King</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-200 mb-10 max-w-2xl mx-auto">
            Explore thousands of tested recipes, cooking tips, and meal inspiration curated just for you.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-stone-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ingredient, cuisine, or dish..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
            />
            <button 
              onClick={() => onSearch(searchTerm)}
              className="absolute right-2 top-2 bottom-2 bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-full font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe, onClick, isFavorite, toggleFavorite }: any) => {
  return (
    <motion.div 
      layoutId={`recipe-${recipe.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 cursor-pointer"
      onClick={() => onClick(recipe)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(recipe.id);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          >
            <Heart className={cn(
              "w-5 h-5 transition-colors", 
              isFavorite ? "fill-red-500 text-red-500" : "text-stone-400"
            )} />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" /> {recipe.time}
          </span>
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3" /> {recipe.calories} kcal
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-stone-800 group-hover:text-orange-600 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
            <Star className="w-4 h-4 fill-current" />
            {recipe.rating}
          </div>
        </div>
        
        <p className="text-stone-500 text-sm line-clamp-2 mb-4">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
            {recipe.difficulty}
          </span>
          <span className="text-orange-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Recipe <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};
const RecipeModal = ({ recipe, onClose, isFavorite, toggleFavorite }: any) => {
  if (!recipe) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        layoutId={`recipe-${recipe.id}`}
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h2 className="text-3xl font-serif font-bold mb-2">{recipe.title}</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> 4 Servings
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4" /> {recipe.calories} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {recipe.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleFavorite(recipe.id)}
                className={cn(
                  "p-2 rounded-full border transition-colors", 
                  isFavorite ? "bg-red-50 border-red-200 text-red-500" : "border-stone-200 text-stone-400 hover:bg-stone-50"
                )}
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
              </button>
              <button className="p-2 rounded-full border border-stone-200 text-stone-400 hover:bg-stone-50">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full border border-stone-200 text-stone-400 hover:bg-stone-50">
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-stone-600 mb-8 leading-relaxed">{recipe.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" /> Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-stone-600 text-sm">
                    <div className="w-5 h-5 rounded border border-stone-300 flex-shrink-0 mt-0.5 cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" /> Instructions
              </h3>
              <div className="space-y-6">
                {recipe.instructions.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-stone-600 text-sm leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-100">
            <h3 className="text-lg font-bold text-stone-900 mb-2">Chef's Tips</h3>
            <p className="text-stone-500 text-sm italic">
              "For best results, use room temperature ingredients. Don't overmix the batter if baking, and always let meat rest before slicing!"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MealPlanner = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Weekly Meal Planner</h2>
        <p className="text-stone-600">Plan your week ahead and generate your shopping list automatically.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-stone-200 bg-stone-50">
          <div className="p-4 font-bold text-stone-400 text-sm uppercase tracking-wider">Time</div>
          {days.map(day => (
            <div key={day} className="p-4 font-bold text-stone-700 text-center border-l border-stone-200">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {meals.map((meal, i) => (
          <div key={meal} className="grid grid-cols-8 border-b border-stone-200 last:border-0">
            <div className="p-4 font-medium text-stone-600 bg-stone-50 flex items-center">
              {meal}
            </div>
            {days.map((day, j) => (
              <div 
                key={`${meal}-${day}`} 
                className="p-2 border-l border-stone-200 min-h-[100px] hover:bg-orange-50/50 transition-colors cursor-pointer group relative"
              >
                <div className="h-full w-full rounded-lg border-2 border-dashed border-stone-200 group-hover:border-orange-300 flex items-center justify-center">
                  <span className="text-stone-300 group-hover:text-orange-400">
                    <PlusIcon />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
// --- Main Page Component ---
export default function FlavorCraftApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           recipe.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setActiveTab('recipes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-orange-200">
      <Head>
        <title>FlavorCraft | Recipes Made Simple</title>
        <meta name="description" content="Discover delicious recipes and meal planning tools." />
      </Head>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        favoritesCount={favorites.length} 
      />

      <main className="pt-0">
        {activeTab === 'home' && (
          <>
            <Hero onSearch={handleSearch} />
            
            {/* Categories Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Explore by Category</h2>
                <p className="text-stone-500">Find exactly what you're craving today.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveTab('recipes');
                    }}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
                  >
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center transition-colors", cat.color)}>
                      <cat.icon className="w-7 h-7" />
                    </div>
                    <span className="font-medium text-stone-700 group-hover:text-stone-900">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Recipes */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Trending Now</h2>
                    <p className="text-stone-500">Most loved recipes by our community this week.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('recipes')}
                    className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {RECIPES.slice(0, 3).map(recipe => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onClick={setSelectedRecipe}
                      isFavorite={favorites.includes(recipe.id)}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 px-6 bg-stone-900 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block p-3 bg-orange-500/20 rounded-full mb-6">
                  <MailIcon />
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Get Weekly Recipes</h2>
                <p className="text-stone-400 mb-10 text-lg">
                  Join 50,000+ food lovers. Get a free e-book "10 Quick Weeknight Dinners" when you sign up.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'recipes' && (
          <div className="pt-24 min-h-screen px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">All Recipes</h1>
                <p className="text-stone-500">Showing {filteredRecipes.length} delicious results</p>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === 'all' ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  )}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      selectedCategory === cat.id ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredRecipes.map(recipe => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={setSelectedRecipe}
                    isFavorite={favorites.includes(recipe.id)}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">No recipes found</h3>
                <p className="text-stone-500">Try adjusting your search or category filter.</p>
                <button 
                  onClick={() => {
                    setSearchQuery(''); 
                    setSelectedCategory('all');
                  }}
                  className="mt-6 text-orange-600 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meal-planner' && (
          <div className="pt-24 min-h-screen bg-stone-50">
            <MealPlanner />
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="pt-24 min-h-screen max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">Cooking Tips & Techniques</h1>
            <div className="grid gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex gap-6">
                  <div className="w-32 h-32 bg-stone-200 rounded-xl flex-shrink-0 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${i === 1 ? '1556910103-1c02745a30bf' : i === 2 ? '1507048331197-7d4ac70811cf' : '1495521821757-a1efb6729352'}?auto=format&fit=crop&w=300&q=80`} 
                      className="w-full h-full object-cover" 
                      alt="Tip" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-orange-600 text-sm font-bold uppercase tracking-wider mb-2">
                      <PlayCircle className="w-4 h-4" /> Video Tutorial
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">
                      {i === 1 ? 'Knife Skills 101' : i === 2 ? 'Perfecting Rice Every Time' : 'The Art of Plating'}
                    </h3>
                    <p className="text-stone-600 mb-4">
                      Master the fundamentals with our step-by-step guides designed for home cooks of all levels.
                    </p>
                    <button className="text-stone-900 font-medium hover:text-orange-600 flex items-center gap-1">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-stone-900">
                Flavor<span className="text-orange-500">Craft</span>
              </span>
            </div>
            <p className="text-stone-500 max-w-sm">
              Making cooking accessible, enjoyable, and delicious for everyone. Join our community of food lovers today.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Explore</h4>
            <ul className="space-y-2 text-stone-500">
              <li><button onClick={() => setActiveTab('recipes')} className="hover:text-orange-600">Recipes</button></li>
              <li><button onClick={() => setActiveTab('meal-planner')} className="hover:text-orange-600">Meal Planner</button></li>
              <li><button onClick={() => setActiveTab('tips')} className="hover:text-orange-600">Tips & Tricks</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-stone-900 mb-4">Company</h4>
            <ul className="space-y-2 text-stone-500">
              <li><a href="#" className="hover:text-orange-600">About Us</a></li>
              <li><a href="#" className="hover:text-orange-600">Careers</a></li>
              <li><a href="#" className="hover:text-orange-600">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-100 text-center text-stone-400 text-sm">
          © 2024 FlavorCraft Inc. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
            isFavorite={favorites.includes(selectedRecipe.id)}
            toggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}