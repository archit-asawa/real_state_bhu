import mongoose, { Schema, Document } from 'mongoose';
import { Property as IProperty } from '../types';

export interface PropertyDocument extends Omit<IProperty, '_id'>, Document {}

const LocationSchema = new Schema({
  city: { type: String, required: true, index: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false }
  }
}, { _id: false });

const PropertySchema = new Schema<PropertyDocument>({
  title: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0,
    index: true
  },
  location: { 
    type: LocationSchema, 
    required: true 
  },
  propertyType: { 
    type: String, 
    required: true,
    enum: ['apartment', 'house', 'villa', 'office', 'land'],
    index: true
  },
  bedrooms: { 
    type: Number, 
    required: true, 
    min: 0,
    index: true
  },
  bathrooms: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  area: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  amenities: [{ 
    type: String, 
    trim: true 
  }],
  images: [{ 
    type: String, 
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  listedDate: { 
    type: Date, 
    required: true, 
    default: Date.now,
    index: true
  },
  status: { 
    type: String, 
    required: true,
    enum: ['available', 'sold', 'rented', 'under_negotiation'],
    default: 'available',
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
PropertySchema.index({ 'location.city': 1, price: 1 });
PropertySchema.index({ 'location.city': 1, propertyType: 1 });
PropertySchema.index({ 'location.city': 1, bedrooms: 1 });
PropertySchema.index({ price: 1, propertyType: 1 });
PropertySchema.index({ listedDate: -1 });
PropertySchema.index({ status: 1 });

// Compound index for common search patterns
PropertySchema.index({ 
  'location.city': 1, 
  propertyType: 1, 
  price: 1, 
  bedrooms: 1,
  status: 1
});

// Geospatial index for location-based queries (if coordinates are available)
PropertySchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for property URL
PropertySchema.virtual('url').get(function() {
  return `/properties/${this._id}`;
});

// Transform function to clean up the response
PropertySchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const PropertyModel = mongoose.model<PropertyDocument>('Property', PropertySchema);
