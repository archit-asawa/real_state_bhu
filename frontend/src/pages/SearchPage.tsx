import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Property, SearchParams, SearchResponse } from '../types';
import apiService from '../services/api';

// Components
import SearchForm from '../components/SearchForm';
import PropertyCard from '../components/PropertyCard';
import Pagination from '../components/Pagination';

// Icons
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});

  // Fetch properties
  const {
    data: searchResults,
    isLoading,
    error,
    refetch
  } = useQuery<SearchResponse, Error>(
    ['properties', searchParams],
    () => apiService.searchProperties(searchParams),
    {
      enabled: false, // Don't fetch on mount
      keepPreviousData: true,
    }
  );

  // Initial load - get all properties
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleViewDetails = (property: Property) => {
    // In a real app, you'd navigate to a detail page
    window.open(`/property/${property._id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div style={{background: 'linear-gradient(to right, #2563eb, #1d4ed8)'}} className="text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              🏡 Find Your Perfect Property
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover thousands of properties across India with our advanced search platform. 
              From apartments to villas, find exactly what you're looking for.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-6xl mx-auto">
            <SearchForm 
              onSearch={handleSearch} 
              loading={isLoading}
              initialFilters={searchParams}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
        {/* Results Header */}
        {searchResults && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Search Results
              </h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {searchResults.pagination.totalProperties} properties
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Searching for properties...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">
                Failed to load properties. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchResults && searchResults.properties.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or location to find more results.
            </p>
            <button
              onClick={() => handleSearch({})}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Properties
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {searchResults && searchResults.properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={searchResults.pagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Quick Stats */}
      {searchResults && searchResults.properties.length > 0 && (
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Market Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {searchResults.pagination.totalProperties}
              </div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {searchResults.properties.filter(p => p.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(searchResults.properties.reduce((acc, p) => acc + p.price, 0) / searchResults.properties.length / 100000)}L
              </div>
              <div className="text-sm text-gray-600">Avg Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(searchResults.properties.reduce((acc, p) => acc + p.area, 0) / searchResults.properties.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Area (sq ft)</div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchPage;
