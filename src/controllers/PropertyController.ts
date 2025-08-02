import { Request, Response, NextFunction } from 'express';
import { PropertyService } from '../services/PropertyService';
import { CustomError } from '../middleware/errorHandler';
import { 
  SearchFilters, 
  PaginationParams, 
  AmenityType,
  ApiResponse,
  Property 
} from '../types';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  searchProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters: SearchFilters = {};
      
      if (req.query.city) filters.city = req.query.city as string;
      if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);
      if (req.query.propertyType) filters.propertyType = req.query.propertyType as Property['propertyType'];
      if (req.query.minBedrooms) filters.minBedrooms = Number(req.query.minBedrooms);
      if (req.query.sortBy) filters.sortBy = req.query.sortBy as 'price' | 'listedDate';
      if (req.query.sortOrder) filters.sortOrder = req.query.sortOrder as 'asc' | 'desc';

      const pagination: PaginationParams = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      };

      const result = await this.propertyService.searchProperties(filters, pagination);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `Found ${result.properties.length} properties`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getPropertyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError('Property ID is required', 400);
      }
      const property = await this.propertyService.getPropertyById(id);

      if (!property) {
        throw new CustomError('Property not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        data: property,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  createProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const property = await this.propertyService.createProperty(req.body);

      const response: ApiResponse = {
        success: true,
        data: property,
        message: 'Property created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError('Property ID is required', 400);
      }
      const property = await this.propertyService.updateProperty(id, req.body);

      if (!property) {
        throw new CustomError('Property not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        data: property,
        message: 'Property updated successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  deleteProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError('Property ID is required', 400);
      }
      const deleted = await this.propertyService.deleteProperty(id);

      if (!deleted) {
        throw new CustomError('Property not found', 404);
      }

      const response: ApiResponse = {
        success: true,
        message: 'Property deleted successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getNearbyAmenities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new CustomError('Property ID is required', 400);
      }
      
      let amenityTypes: AmenityType[] = [];
      if (req.query.types) {
        if (Array.isArray(req.query.types)) {
          amenityTypes = req.query.types as AmenityType[];
        } else {
          amenityTypes = (req.query.types as string).split(',') as AmenityType[];
        }
      } else {
        amenityTypes = ['hospital', 'school', 'restaurant', 'shopping_mall', 'bank'];
      }

      const radius = Number(req.query.radius) || 5000;

      const result = await this.propertyService.getNearbyAmenities(
        id,
        amenityTypes,
        radius
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Nearby amenities retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  searchPropertiesWithinRadius = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);
      const radius = Number(req.query.radius) || 5000;

      if (!lat || !lng) {
        throw new CustomError('Latitude and longitude are required', 400);
      }

      const filters: SearchFilters = {};
      
      if (req.query.propertyType) filters.propertyType = req.query.propertyType as Property['propertyType'];
      if (req.query.minPrice) filters.minPrice = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.maxPrice = Number(req.query.maxPrice);
      if (req.query.minBedrooms) filters.minBedrooms = Number(req.query.minBedrooms);
      if (req.query.sortBy) filters.sortBy = req.query.sortBy as 'price' | 'listedDate';
      if (req.query.sortOrder) filters.sortOrder = req.query.sortOrder as 'asc' | 'desc';

      const pagination: PaginationParams = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
      };

      const result = await this.propertyService.getPropertiesWithinRadius(
        lat,
        lng,
        radius,
        filters,
        pagination
      );

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `Found ${result.properties.length} properties within ${radius}m radius`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
