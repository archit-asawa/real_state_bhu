import Joi from 'joi';

export const searchPropertySchema = {
  query: Joi.object({
    city: Joi.string().trim().min(2).max(50),
    minPrice: Joi.number().positive().min(0),
    maxPrice: Joi.number().positive().min(0).when('minPrice', {
      is: Joi.exist(),
      then: Joi.number().greater(Joi.ref('minPrice')),
    }),
    propertyType: Joi.string().valid('apartment', 'house', 'villa', 'plot', 'commercial'),
    minBedrooms: Joi.number().integer().min(0).max(20),
    sortBy: Joi.string().valid('price', 'listedDate').default('listedDate'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

export const nearbyAmenitiesSchema = {
  params: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid property ID format',
    }),
  }),
  query: Joi.object({
    types: Joi.alternatives()
      .try(
        Joi.string().valid(
          'hospital',
          'school',
          'restaurant',
          'shopping_mall',
          'bank',
          'gas_station',
          'pharmacy',
          'gym',
          'park',
          'bus_station',
          'train_station',
          'airport'
        ),
        Joi.array().items(
          Joi.string().valid(
            'hospital',
            'school',
            'restaurant',
            'shopping_mall',
            'bank',
            'gas_station',
            'pharmacy',
            'gym',
            'park',
            'bus_station',
            'train_station',
            'airport'
          )
        )
      )
      .default(['hospital', 'school', 'restaurant', 'shopping_mall', 'bank']),
    radius: Joi.number().integer().min(500).max(50000).default(5000),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
};

export const createPropertySchema = {
  body: Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().trim().min(10).max(2000).required(),
    price: Joi.number().positive().required(),
    location: Joi.object({
      city: Joi.string().trim().min(2).max(50).required(),
      state: Joi.string().trim().min(2).max(50).required(),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
        'string.pattern.base': 'Pincode must be exactly 6 digits',
      }),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180),
      }).optional(),
    }).required(),
    propertyType: Joi.string().valid('apartment', 'house', 'villa', 'plot', 'commercial').required(),
    bedrooms: Joi.number().integer().min(0).max(20).required(),
    bathrooms: Joi.number().integer().min(0).max(20).required(),
    area: Joi.number().positive().required(),
    amenities: Joi.array().items(Joi.string().trim().min(2).max(50)).default([]),
    images: Joi.array().items(
      Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp|gif)$/i).messages({
        'string.pattern.base': 'Image URL must end with a valid image extension (jpg, jpeg, png, webp, gif)',
      })
    ).default([]),
    status: Joi.string().valid('available', 'sold', 'rented', 'under_negotiation').default('available'),
  }),
};

export const updatePropertySchema = {
  params: Joi.object({
    id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      'string.pattern.base': 'Invalid property ID format',
    }),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(5).max(200),
    description: Joi.string().trim().min(10).max(2000),
    price: Joi.number().positive(),
    location: Joi.object({
      city: Joi.string().trim().min(2).max(50),
      state: Joi.string().trim().min(2).max(50),
      pincode: Joi.string().pattern(/^[0-9]{6}$/),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180),
      }),
    }),
    propertyType: Joi.string().valid('apartment', 'house', 'villa', 'plot', 'commercial'),
    bedrooms: Joi.number().integer().min(0).max(20),
    bathrooms: Joi.number().integer().min(0).max(20),
    area: Joi.number().positive(),
    amenities: Joi.array().items(Joi.string().trim().min(2).max(50)),
    images: Joi.array().items(
      Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp|gif)$/i)
    ),
    status: Joi.string().valid('available', 'sold', 'rented', 'under_negotiation'),
  }).min(1), // At least one field must be provided for update
};
