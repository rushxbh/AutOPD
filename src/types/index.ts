export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  hospital: string;
  department: string;
  languages: string[];
  qualifications: string[];
  bio: string;
  availability: {
    slots: number;
    nextAvailable: string;
    schedule: {
      [key: string]: { start: string; end: string; available: boolean };
    };
    isEmergency: boolean;
  };
  contact: {
    phone: string;
    email: string;
  };
  embedding?: number[]; // Vector embedding for semantic search
  metadata: {
    verified: boolean;
    lastUpdated: string;
    totalPatients: number;
    successRate: number;
  };
}

export interface Hospital {
  _id: string;
  name: string;
  type: 'Government' | 'Private' | 'Trust' | 'Corporate';
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: string;
  district: string;
  state: string;
  pincode: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  specialties: string[];
  facilities: string[];
  bedCapacity: {
    total: number;
    available: number;
    icu: { total: number; available: number };
    general: { total: number; available: number };
    emergency: { total: number; available: number };
    lastUpdated: string;
  };
  rating: number;
  accreditation: string[];
  embedding?: number[];
  metadata: {
    established: string;
    verified: boolean;
    emergencyServices: boolean;
    ambulanceService: boolean;
  };
}

export interface SearchQuery {
  text: string;
  location?: {
    coordinates: [number, number];
    radius: number; // in kilometers
  };
  filters?: {
    specialization?: string;
    experience?: { min?: number; max?: number };
    rating?: { min?: number };
    availability?: boolean;
    emergencyOnly?: boolean;
    hospitalType?: string[];
  };
  limit?: number;
}

export interface SearchResult<T> {
  document: T;
  score: number;
  highlights?: string[];
  distance?: number; // in kilometers if geo search
}

export interface BedAvailability {
  _id: string;
  hospitalId: string;
  hospitalName: string;
  timestamp: string;
  bedCounts: {
    total: number;
    available: number;
    occupied: number;
    icu: { total: number; available: number; occupied: number };
    general: { total: number; available: number; occupied: number };
    emergency: { total: number; available: number; occupied: number };
    covid: { total: number; available: number; occupied: number };
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  district: string;
  contactNumber: string;
}

export interface AnalyticsData {
  hospitalTrends: {
    hospitalId: string;
    hospitalName: string;
    occupancyRate: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    predictions: {
      nextHour: number;
      next6Hours: number;
      next24Hours: number;
    };
  }[];
  districtSummary: {
    district: string;
    totalBeds: number;
    availableBeds: number;
    occupancyRate: number;
    criticalHospitals: number;
  }[];
  realTimeAlerts: {
    type: 'bed_shortage' | 'high_demand' | 'capacity_warning';
    message: string;
    hospitalId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }[];
}

export interface AppointmentBooking {
  _id?: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentDate: string;
  timeSlot: string;
  symptoms: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}