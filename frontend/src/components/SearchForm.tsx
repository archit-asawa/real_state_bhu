import React, { useState } from 'react';
import { SearchParams, PROPERTY_TYPES, SORT_OPTIONS, COMMON_AMENITIES } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  initialFilters?: SearchParams;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  onSearch, 
  loading = false,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<SearchParams>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialFilters.amenities || []
  );

  const handleInputChange = (key: keyof SearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(updated);
    handleInputChange('amenities', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = { ...filters };
    
    // Parse sort option
    if (filters.sortBy) {
      const [field, order] = filters.sortBy.split('_');
      searchParams.sortBy = field;
      searchParams.sortOrder = order as 'asc' | 'desc';
    }
    
    onSearch(searchParams);
  };

  const handleReset = () => {
    setFilters({});
    setSelectedAmenities([]);
    onSearch({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof SearchParams] !== undefined && 
    filters[key as keyof SearchParams] !== ''
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        {/* Main Search Row - Forced Horizontal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
          alignItems: 'end'
        }}>
          {/* City Input */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
              🏙️ City
            </label>
            <input
              type="text"
              placeholder="Enter city"
              value={filters.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Property Type */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
              🏠 Type
            </label>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
              💰 Min Price
            </label>
            <input
              type="number"
              placeholder="Min price"
              value={filters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Max Price */}
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
              💸 Max Price
            </label>
            <input
              type="number"
              placeholder="Max price"
              value={filters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              🔍 {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#2563eb',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ⚙️ {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                color: '#6b7280',
                background: 'none',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            {/* Property Details Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  🛏️ Bedrooms
                </label>
                <select
                  value={filters.minBedrooms || ''}
                  onChange={(e) => handleInputChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  🚿 Bathrooms
                </label>
                <select
                  value={filters.minBathrooms || ''}
                  onChange={(e) => handleInputChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  📐 Min Area (sq ft)
                </label>
                <input
                  type="number"
                  placeholder="Min area"
                  value={filters.minArea || ''}
                  onChange={(e) => handleInputChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  📏 Max Area (sq ft)
                </label>
                <input
                  type="number"
                  placeholder="Max area"
                  value={filters.maxArea || ''}
                  onChange={(e) => handleInputChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>

            {/* Location & Sort Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  🏛️ State
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={filters.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  📮 Pincode
                </label>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={filters.pincode || ''}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                  📊 Sort By
                </label>
                <select
                  value={filters.sortBy || ''}
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Default</option>
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amenities Section */}
            <div>
              <label style={{display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '12px'}}>
                ✨ Amenities
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '8px'
              }}>
                {COMMON_AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500',
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedAmenities.includes(amenity) ? '#3b82f6' : '#ffffff',
                      color: selectedAmenities.includes(amenity) ? '#ffffff' : '#374151',
                      borderColor: selectedAmenities.includes(amenity) ? '#3b82f6' : '#d1d5db'
                    }}
                  >
                    {amenity}
                    {selectedAmenities.includes(amenity) && ' ✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;
