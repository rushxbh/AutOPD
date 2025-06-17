import { Doctor, Bed, VectorSearchQuery } from '../types';

// Vector dimensionality for the demo
const VECTOR_DIM = 128;

// Generate mock base vectors for doctors
export const generateDoctorBaseVector = (doctor: Partial<Doctor>): number[] => {
  const vector = new Array(VECTOR_DIM).fill(0);
  
  // Encode specialization (first 20 dimensions)
  const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General'];
  const specIndex = specializations.indexOf(doctor.specialization || 'General');
  if (specIndex >= 0) vector[specIndex] = 1.0;
  
  // Encode experience (dimensions 20-30)
  const expNormalized = Math.min((doctor.experience || 0) / 30, 1.0);
  vector[20] = expNormalized;
  
  // Encode rating (dimensions 30-35)
  const ratingNormalized = (doctor.rating || 0) / 5.0;
  vector[30] = ratingNormalized;
  
  // Encode location features (dimensions 35-50)
  if (doctor.location) {
    const locationHash = hashString(doctor.location) % 15;
    vector[35 + locationHash] = 1.0;
  }
  
  // Add some random features for the remaining dimensions
  for (let i = 50; i < VECTOR_DIM; i++) {
    vector[i] = Math.random() * 0.1;
  }
  
  return vector;
};

// Generate delta vectors for real-time updates
export const generateDeltaVector = (entityType: 'doctor' | 'bed', updates: any): number[] => {
  const delta = new Array(VECTOR_DIM).fill(0);
  
  if (entityType === 'doctor') {
    // Availability impact (dimension 100-110)
    if (updates.availability) {
      const availabilityScore = updates.availability.slots / 10; // Normalize
      delta[100] = availabilityScore - 0.5; // Center around 0
    }
    
    // Emergency mode boost (dimension 110)
    if (updates.isEmergency) {
      delta[110] = 0.3;
    }
    
    // On-call status (dimension 111)
    if (updates.isOnCall) {
      delta[111] = 0.2;
    }
    
    // Temporal decay (dimension 112-115)
    const currentHour = new Date().getHours();
    const timeScore = Math.sin((currentHour / 24) * Math.PI * 2) * 0.1;
    delta[112] = timeScore;
  }
  
  return delta;
};

// Compute effective vector
export const computeEffectiveVector = (baseVector: number[], deltaVector: number[]): number[] => {
  return baseVector.map((base, i) => base + (deltaVector[i] || 0));
};

// Cosine similarity
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

// Convert search query to vector
export const queryToVector = (query: VectorSearchQuery): number[] => {
  const vector = new Array(VECTOR_DIM).fill(0);
  
  // Encode symptoms (first 50 dimensions using simple keyword matching)
  const commonSymptoms = [
    'chest pain', 'headache', 'fever', 'cough', 'fatigue',
    'shortness of breath', 'nausea', 'dizziness', 'joint pain',
    'skin rash', 'abdominal pain', 'back pain'
  ];
  
  query.symptoms.forEach(symptom => {
    const index = commonSymptoms.findIndex(s => 
      symptom.toLowerCase().includes(s) || s.includes(symptom.toLowerCase())
    );
    if (index >= 0) {
      vector[index] = 1.0;
    }
  });
  
  // Encode urgency (dimension 60-65)
  const urgencyMap = { 'Low': 0.25, 'Medium': 0.5, 'High': 0.75, 'Critical': 1.0 };
  vector[60] = urgencyMap[query.urgency];
  
  // Encode specialization preference (dimension 70-85)
  if (query.specialization) {
    const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General'];
    const specIndex = specializations.indexOf(query.specialization);
    if (specIndex >= 0) vector[70 + specIndex] = 1.0;
  }
  
  return vector;
};

// Vector search with ranking
export const vectorSearch = (
  query: VectorSearchQuery,
  doctors: Doctor[],
  topK: number = 10
): Array<{ doctor: Doctor; similarity: number; reasoning: string }> => {
  const queryVector = queryToVector(query);
  
  const results = doctors.map(doctor => {
    const similarity = cosineSimilarity(queryVector, doctor.effectiveVector);
    
    // Generate reasoning
    let reasoning = `Match: ${(similarity * 100).toFixed(1)}% - `;
    if (doctor.availability.isEmergency && query.urgency === 'Critical') {
      reasoning += 'Emergency availability, ';
    }
    if (doctor.specialization === query.specialization) {
      reasoning += 'Specialization match, ';
    }
    reasoning += `${doctor.availability.slots} slots available`;
    
    return { doctor, similarity, reasoning };
  });
  
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
};

// Hash function for string encoding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}