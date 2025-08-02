// Google Maps API temporarily disabled
// import { Client, UnitSystem, TravelMode } from '@googlemaps/google-maps-services-js';
import { config } from '../config/environment';
import { 
  NearbyAmenity, 
  AmenityType, 
  GooglePlaceResult,
  DistanceMatrixResult 
} from '../types';

export class GoogleMapsService {
  // private client: Client;
  private apiKey: string;

  constructor() {
    // this.client = new Client({});
    this.apiKey = config.googleMaps.apiKey;
    
    if (!this.apiKey) {
      console.warn('⚠️ Google Maps API key not configured - using mock data');
    }
  }

  async searchNearbyPlaces(
    location: { lat: number; lng: number },
    type: AmenityType,
    radius: number = 5000
  ): Promise<GooglePlaceResult[]> {
    try {
      // Google Maps API temporarily disabled - returning mock data
      console.log('🗺️ Google Maps API disabled - returning mock amenities');
      
      // Return mock data for testing
      const mockAmenities: GooglePlaceResult[] = [
        {
          place_id: 'mock_hospital_1',
          name: 'City Hospital',
          formatted_address: 'Near Property Location, Mumbai, Maharashtra',
          geometry: {
            location: {
              lat: location.lat + 0.001,
              lng: location.lng + 0.001
            }
          },
          rating: 4.2,
          user_ratings_total: 156,
          types: ['hospital', 'health']
        },
        {
          place_id: 'mock_school_1',
          name: 'ABC School',
          formatted_address: 'Education District, Mumbai, Maharashtra',
          geometry: {
            location: {
              lat: location.lat + 0.002,
              lng: location.lng - 0.001
            }
          },
          rating: 4.5,
          user_ratings_total: 89,
          types: ['school', 'education']
        },
        {
          place_id: 'mock_mall_1',
          name: 'Shopping Center',
          formatted_address: 'Commercial Area, Mumbai, Maharashtra',
          geometry: {
            location: {
              lat: location.lat - 0.001,
              lng: location.lng + 0.002
            }
          },
          rating: 4.0,
          user_ratings_total: 203,
          types: ['shopping_mall', 'establishment']
        }
      ];

      return mockAmenities;

      /* Original Google Maps API code - commented out
      if (!this.apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await this.client.placesNearby({
        params: {
          location,
          radius,
          type: this.mapAmenityTypeToGoogleType(type),
          key: this.apiKey,
        },
      });

      return (response.data.results || [])
        .filter(place => !!place.place_id)
        .map(place => place as GooglePlaceResult);
      */
    } catch (error) {
      console.error('Error searching nearby places:', error);
      throw error;
    }
  }

  async calculateDistance(
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number }[]
  ): Promise<DistanceMatrixResult> {
    try {
      // Google Maps API temporarily disabled - returning mock data
      console.log('🗺️ Google Maps API disabled - returning mock distance data');
      
      // Return mock distance data
      const mockDistanceResult: DistanceMatrixResult = {
        origin_addresses: [`${origin.lat}, ${origin.lng}`],
        destination_addresses: destinations.map(dest => `${dest.lat}, ${dest.lng}`),
        rows: [{
          elements: destinations.map(() => ({
            distance: { text: '2.5 km', value: 2500 },
            duration: { text: '8 mins', value: 480 },
            status: 'OK'
          }))
        }],
        status: 'OK'
      };

      return mockDistanceResult;

      /* Original Google Maps API code - commented out
      if (!this.apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await this.client.distancematrix({
        params: {
          origins: [origin],
          destinations,
          units: UnitSystem.metric,
          mode: TravelMode.driving,
          key: this.apiKey,
        },
      });

      return response.data;
      */
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      // Google Maps API temporarily disabled - returning mock data
      console.log('🗺️ Google Maps API disabled - returning mock place details');
      
      // Return mock place details
      const mockPlaceDetails = {
        name: 'Mock Place',
        formatted_address: 'Mock Address, City, State',
        geometry: {
          location: { lat: 19.0760, lng: 72.8777 }
        },
        rating: 4.2,
        user_ratings_total: 150
      };

      return mockPlaceDetails;

      /* Original Google Maps API code - commented out
      if (!this.apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total'],
          key: this.apiKey,
        },
      });

      return response.data.result;
      */
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  async processNearbyAmenities(
    propertyLocation: { lat: number; lng: number },
    amenityTypes: AmenityType[],
    radius: number = 5000
  ): Promise<{ [key in AmenityType]?: NearbyAmenity[] }> {
    const results: { [key in AmenityType]?: NearbyAmenity[] } = {};

    for (const type of amenityTypes) {
      try {
        const places = await this.searchNearbyPlaces(propertyLocation, type, radius);
        
        if (places.length > 0) {
          const destinations = places.map(place => place.geometry.location);
          const distanceMatrix = await this.calculateDistance(propertyLocation, destinations);
          
          const amenities: NearbyAmenity[] = places.map((place, index) => {
            const element = distanceMatrix.rows[0]?.elements[index];
            
            return {
              type,
              name: place.name,
              address: place.formatted_address,
              distance: element?.distance?.value || 0,
              duration: element?.duration?.value || 0,
              placeId: place.place_id,
              ...(place.rating !== undefined && { rating: place.rating }),
              ...(place.user_ratings_total !== undefined && { userRatingsTotal: place.user_ratings_total }),
              coordinates: place.geometry.location,
            };
          });

          // Sort by distance
          amenities.sort((a, b) => a.distance - b.distance);
          results[type] = amenities.slice(0, 10); // Limit to top 10
        }
      } catch (error) {
        console.error(`Error processing amenities for type ${type}:`, error);
        // Continue with other types even if one fails
      }
    }

    return results;
  }

  private mapAmenityTypeToGoogleType(amenityType: AmenityType): string {
    const mapping: Record<AmenityType, string> = {
      hospital: 'hospital',
      school: 'school',
      restaurant: 'restaurant',
      shopping_mall: 'shopping_mall',
      bank: 'bank',
      gas_station: 'gas_station',
      pharmacy: 'pharmacy',
      gym: 'gym',
      park: 'park',
      bus_station: 'bus_station',
      train_station: 'train_station',
      airport: 'airport',
    };

    return mapping[amenityType] || amenityType;
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // Google Maps API temporarily disabled - returning mock data
      console.log('🗺️ Google Maps API disabled - returning mock geocoding data');
      
      // Return mock coordinates (Mumbai coordinates as default)
      const mockCoordinates = {
        lat: 19.0760,
        lng: 72.8777
      };

      return mockCoordinates;

      /* Original Google Maps API code - commented out
      if (!this.apiKey) {
        throw new Error('Google Maps API key not configured');
      }

      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      const result = response.data.results[0];
      if (result) {
        return result.geometry.location;
      }

      return null;
      */
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }
}
