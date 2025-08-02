import React from 'react';
import { Property } from '../types';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  IndianRupee,
  Calendar,
  Star,
  Heart,
  Share2 
} from 'lucide-react';
import { ApiService } from '../services/api';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  compact?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onViewDetails, 
  compact = false 
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=No+Image';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const mainImage = property.images?.[0] || 'https://via.placeholder.com/400x300/f1f5f9/64748b?text=No+Image';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden property-card-hover cursor-pointer ${
      compact ? 'max-w-sm' : 'max-w-md'
    }`}>
      {/* Image Section */}
      <div className="relative">
        <img
          src={mainImage}
          alt={property.title}
          className={`w-full object-cover ${compact ? 'h-48' : 'h-56'}`}
          onError={handleImageError}
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            ApiService.getStatusColor(property.status)
          }`}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Image Count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
            +{property.images.length - 1} more
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-${compact ? '4' : '5'}`}>
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <IndianRupee className="w-5 h-5 text-blue-600 mr-1" />
            <span className="text-2xl font-bold text-gray-900">
              {ApiService.formatPrice(property.price)}
            </span>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.5</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.location.city}, {property.location.state} - {property.location.pincode}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{ApiService.formatArea(property.area)}</span>
            </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {ApiService.getPropertyTypeDisplay(property.propertyType)}
          </span>
        </div>

        {/* Amenities */}
        {!compact && property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Listed {formatDate(property.createdAt)}</span>
          </div>
          <button
            onClick={() => onViewDetails(property)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
