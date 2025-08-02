import { Router } from 'express';
import { PropertyController } from '../controllers/PropertyController';
import { validateRequest } from '../middleware/validation';
import {
  searchPropertySchema,
  nearbyAmenitiesSchema,
  createPropertySchema,
  updatePropertySchema,
} from '../utils/validationSchemas';

const router = Router();
const propertyController = new PropertyController();

/**
 * @route   GET /api/properties/search
 * @desc    Search properties with filters and pagination
 * @access  Public
 * @query   city, minPrice, maxPrice, propertyType, minBedrooms, sortBy, sortOrder, page, limit
 */
router.get(
  '/search',
  validateRequest(searchPropertySchema),
  propertyController.searchProperties
);

/**
 * @route   GET /api/properties/search-radius
 * @desc    Search properties within a radius from coordinates
 * @access  Public
 * @query   lat, lng, radius, propertyType, minPrice, maxPrice, minBedrooms, sortBy, sortOrder, page, limit
 */
router.get(
  '/search-radius',
  propertyController.searchPropertiesWithinRadius
);

/**
 * @route   GET /api/properties/:id
 * @desc    Get a single property by ID
 * @access  Public
 */
router.get(
  '/:id',
  propertyController.getPropertyById
);

/**
 * @route   GET /api/properties/:id/nearby-amenities
 * @desc    Get nearby amenities for a property
 * @access  Public
 * @query   types, radius, limit
 */
router.get(
  '/:id/nearby-amenities',
  validateRequest(nearbyAmenitiesSchema),
  propertyController.getNearbyAmenities
);

/**
 * @route   POST /api/properties
 * @desc    Create a new property
 * @access  Private (would need authentication middleware)
 */
router.post(
  '/',
  validateRequest(createPropertySchema),
  propertyController.createProperty
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update a property
 * @access  Private (would need authentication middleware)
 */
router.put(
  '/:id',
  validateRequest(updatePropertySchema),
  propertyController.updateProperty
);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete a property
 * @access  Private (would need authentication middleware)
 */
router.delete(
  '/:id',
  propertyController.deleteProperty
);

export default router;
