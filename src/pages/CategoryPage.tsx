
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { getCategoryBySlug } from '@/utils/categoryData';
import MatchCard from '@/components/ui/MatchCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Match } from '@/utils/mockData';
import { Search } from 'lucide-react';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || '');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  
  if (!category) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </MainLayout>
    );
  }
  
  // Filter matches based on search term
  const filteredMatches = category.matches.filter(match => 
    match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.competition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort matches based on selection
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating-desc':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'popularity':
        return (b.viewCount || 0) - (a.viewCount || 0);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <MainLayout>
      <div className="page-transition">
        {/* Category Banner */}
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
          {category.bannerImage ? (
            <img 
              src={category.bannerImage} 
              alt={category.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/30 to-primary/10 flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white">{category.title}</h1>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <h1 className="text-3xl font-bold text-white">{category.title}</h1>
            {category.description && (
              <p className="text-white/80 mt-2 max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Match Grid */}
        {sortedMatches.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {sortedMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
