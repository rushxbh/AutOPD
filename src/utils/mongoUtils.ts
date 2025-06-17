// MongoDB Atlas Vector Search and aggregation utilities
import { SearchQuery, SearchResult, Doctor, Hospital, BedAvailability } from '../types';

// Simulated MongoDB Atlas Vector Search
export const performVectorSearch = async <T>(
  collection: string,
  query: SearchQuery,
  documents: T[]
): Promise<SearchResult<T>[]> => {
  // Simulate vector embedding generation for query
  const queryEmbedding = await generateEmbedding(query.text);
  
  // Simulate Atlas Vector Search with compound queries
  let results = documents.map(doc => {
    const docEmbedding = (doc as any).embedding || generateRandomEmbedding();
    const score = cosineSimilarity(queryEmbedding, docEmbedding);
    
    return {
      document: doc,
      score,
      highlights: extractHighlights(query.text, doc),
    };
  });

  // Apply filters (simulating Atlas Search compound queries)
  if (query.filters) {
    results = results.filter(result => applyFilters(result.document, query.filters!));
  }

  // Apply geo filtering if location specified
  if (query.location) {
    results = results.map(result => {
      const distance = calculateDistance(
        query.location!.coordinates,
        (result.document as any).location.coordinates
      );
      
      return {
        ...result,
        distance,
      };
    }).filter(result => result.distance! <= query.location!.radius);
  }

  // Sort by score and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, query.limit || 10);
};

// Simulated aggregation pipeline for analytics
export const getHospitalAnalytics = async (bedData: BedAvailability[]) => {
  // Simulate MongoDB aggregation pipeline
  const pipeline = [
    {
      $group: {
        _id: '$hospitalId',
        hospitalName: { $first: '$hospitalName' },
        avgOccupancy: { $avg: { $divide: ['$bedCounts.occupied', '$bedCounts.total'] } },
        totalCapacity: { $sum: '$bedCounts.total' },
        currentAvailable: { $last: '$bedCounts.available' },
        district: { $first: '$district' },
      }
    },
    {
      $addFields: {
        occupancyRate: { $multiply: ['$avgOccupancy', 100] },
        trend: {
          $switch: {
            branches: [
              { case: { $gte: ['$avgOccupancy', 0.9] }, then: 'increasing' },
              { case: { $lte: ['$avgOccupancy', 0.6] }, then: 'decreasing' },
            ],
            default: 'stable'
          }
        }
      }
    },
    { $sort: { occupancyRate: -1 } }
  ];

  // Simulate pipeline execution
  return bedData.reduce((acc, bed) => {
    const existing = acc.find(item => item.hospitalId === bed.hospitalId);
    const occupancyRate = (bed.bedCounts.occupied / bed.bedCounts.total) * 100;
    
    if (!existing) {
      acc.push({
        hospitalId: bed.hospitalId,
        hospitalName: bed.hospitalName,
        occupancyRate,
        trend: occupancyRate > 90 ? 'increasing' : occupancyRate < 60 ? 'decreasing' : 'stable',
        predictions: {
          nextHour: Math.max(0, bed.bedCounts.available - Math.floor(Math.random() * 5)),
          next6Hours: Math.max(0, bed.bedCounts.available - Math.floor(Math.random() * 15)),
          next24Hours: Math.max(0, bed.bedCounts.available - Math.floor(Math.random() * 30)),
        }
      });
    }
    
    return acc;
  }, [] as any[]);
};

// Time-series aggregation for bed availability trends
export const getBedTrends = async (bedData: BedAvailability[], timeRange: string) => {
  // Simulate time-series collection aggregation
  const now = new Date();
  const ranges = {
    '24h': 24,
    '7d': 7 * 24,
    '30d': 30 * 24,
  };
  
  const hours = ranges[timeRange as keyof typeof ranges] || 24;
  const trends = [];
  
  for (let i = 0; i < hours; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const totalBeds = bedData.reduce((sum, bed) => sum + bed.bedCounts.total, 0);
    const availableBeds = bedData.reduce((sum, bed) => sum + bed.bedCounts.available, 0);
    
    trends.unshift({
      timestamp: timestamp.toISOString(),
      totalBeds,
      availableBeds,
      occupancyRate: ((totalBeds - availableBeds) / totalBeds) * 100,
    });
  }
  
  return trends;
};

// Utility functions
const generateEmbedding = async (text: string): Promise<number[]> => {
  // Simulate OpenAI/Cohere embedding generation
  // In production, this would call OpenAI API or use local model
  return new Array(1536).fill(0).map(() => Math.random() - 0.5);
};

const generateRandomEmbedding = (): number[] => {
  return new Array(1536).fill(0).map(() => Math.random() - 0.5);
};

const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const applyFilters = (document: any, filters: any): boolean => {
  if (filters.specialization && document.specialization !== filters.specialization) {
    return false;
  }
  
  if (filters.experience) {
    if (filters.experience.min && document.experience < filters.experience.min) return false;
    if (filters.experience.max && document.experience > filters.experience.max) return false;
  }
  
  if (filters.rating?.min && document.rating < filters.rating.min) {
    return false;
  }
  
  if (filters.availability && document.availability?.slots <= 0) {
    return false;
  }
  
  if (filters.emergencyOnly && !document.availability?.isEmergency) {
    return false;
  }
  
  return true;
};

const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const extractHighlights = (query: string, document: any): string[] => {
  const highlights: string[] = [];
  const queryWords = query.toLowerCase().split(' ');
  
  // Check various fields for matches
  const fields = ['name', 'specialization', 'bio', 'hospital', 'address'];
  
  fields.forEach(field => {
    if (document[field]) {
      const fieldValue = document[field].toLowerCase();
      queryWords.forEach(word => {
        if (fieldValue.includes(word) && word.length > 2) {
          highlights.push(`${field}: ...${document[field]}...`);
        }
      });
    }
  });
  
  return [...new Set(highlights)]; // Remove duplicates
};

// Geospatial utilities for MongoDB geo queries
export const createGeoQuery = (coordinates: [number, number], radiusKm: number) => {
  return {
    location: {
      $geoWithin: {
        $centerSphere: [coordinates, radiusKm / 6371] // Convert km to radians
      }
    }
  };
};

export const createTextSearchQuery = (searchText: string) => {
  return {
    $text: {
      $search: searchText,
      $caseSensitive: false,
      $diacriticSensitive: false
    }
  };
};