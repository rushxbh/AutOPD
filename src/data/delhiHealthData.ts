

// Simulated Delhi Health Data based on real DSHM API structure
import { Doctor, Hospital, BedAvailability } from '../types';

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch("http://localhost:3000/api/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text })
    });

    if (!response.ok) throw new Error("API request failed");

    const result = await response.json();

    if (!result || !Array.isArray(result)) throw new Error("Invalid embedding response");

    return result;
  } catch (error) {
    const embedding = new Array(1536).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = charCode % 1536;
      embedding[index] += Math.sin(charCode) * 0.1;
    }
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }
}

export const delhiHospitals: Hospital[] = [
  {
    _id: 'hosp-aiims-001',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Government',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.5672] // AIIMS Delhi coordinates
    },
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    contact: {
      phone: '+91-11-2658-8500',
      email: 'director@aiims.ac.in',
      website: 'https://www.aiims.edu'
    },
    specialties: [
      'Cardiology', 'Neurology', 'Oncology', 'Trauma Surgery', 
      'Pediatrics', 'Orthopedics', 'Emergency Medicine'
    ],
    facilities: [
      'ICU', 'Emergency Department', 'Blood Bank', 'Pharmacy',
      'Radiology', 'Laboratory', 'Ambulance Service', 'Trauma Center'
    ],
    bedCapacity: {
      total: 2478,
      available: 234,
      icu: { total: 200, available: 12 },
      general: { total: 2000, available: 180 },
      emergency: { total: 278, available: 42 },
      lastUpdated: new Date().toISOString()
    },
    rating: 4.8,
    accreditation: ['NABH', 'NABL', 'JCI'],
    metadata: {
      established: '1956',
      verified: true,
      emergencyServices: true,
      ambulanceService: true
    }
  },
  {
    _id: 'hosp-safdarjung-002',
    name: 'Safdarjung Hospital',
    type: 'Government',
    location: {
      type: 'Point',
      coordinates: [77.1925, 28.5706]
    },
    address: 'Ring Road, Safdarjung Enclave, New Delhi',
    district: 'South West Delhi',
    state: 'Delhi',
    pincode: '110029',
    contact: {
      phone: '+91-11-2670-1000',
      email: 'ms.safdarjung@gov.in'
    },
    specialties: [
      'General Medicine', 'Surgery', 'Gynecology', 'Pediatrics',
      'Orthopedics', 'ENT', 'Ophthalmology'
    ],
    facilities: [
      'ICU', 'Emergency Department', 'Blood Bank', 'Pharmacy',
      'Radiology', 'Laboratory', 'Ambulance Service'
    ],
    bedCapacity: {
      total: 1500,
      available: 89,
      icu: { total: 120, available: 8 },
      general: { total: 1200, available: 65 },
      emergency: { total: 180, available: 16 },
      lastUpdated: new Date().toISOString()
    },
    rating: 4.2,
    accreditation: ['NABH'],
    metadata: {
      established: '1942',
      verified: true,
      emergencyServices: true,
      ambulanceService: true
    }
  },
  {
    _id: 'hosp-apollo-003',
    name: 'Apollo Hospital Delhi',
    type: 'Private',
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.5355]
    },
    address: 'Sarita Vihar, Mathura Road, New Delhi',
    district: 'South Delhi',
    state: 'Delhi',
    pincode: '110076',
    contact: {
      phone: '+91-11-2692-5858',
      email: 'info.delhi@apollohospitals.com',
      website: 'https://www.apollohospitals.com'
    },
    specialties: [
      'Cardiology', 'Cardiac Surgery', 'Neurology', 'Oncology',
      'Transplant Surgery', 'Robotic Surgery', 'Emergency Medicine'
    ],
    facilities: [
      'ICU', 'NICU', 'Emergency Department', 'Blood Bank',
      'Pharmacy', 'Radiology', 'Laboratory', 'Ambulance Service',
      'Robotic Surgery Suite', 'Cath Lab'
    ],
    bedCapacity: {
      total: 695,
      available: 45,
      icu: { total: 85, available: 3 },
      general: { total: 550, available: 38 },
      emergency: { total: 60, available: 4 },
      lastUpdated: new Date().toISOString()
    },
    rating: 4.7,
    accreditation: ['NABH', 'JCI', 'NABL'],
    metadata: {
      established: '1996',
      verified: true,
      emergencyServices: true,
      ambulanceService: true
    }
  },
  {
    _id: 'hosp-fortis-004',
    name: 'Fortis Hospital Shalimar Bagh',
    type: 'Private',
    location: {
      type: 'Point',
      coordinates: [77.1644, 28.7196]
    },
    address: 'A Block, Shalimar Bagh, Delhi',
    district: 'North West Delhi',
    state: 'Delhi',
    pincode: '110088',
    contact: {
      phone: '+91-11-4277-6222',
      email: 'shalimarbagh@fortishealthcare.com',
      website: 'https://www.fortishealthcare.com'
    },
    specialties: [
      'Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology',
      'Urology', 'Emergency Medicine', 'Critical Care'
    ],
    facilities: [
      'ICU', 'CCU', 'Emergency Department', 'Blood Bank',
      'Pharmacy', 'Radiology', 'Laboratory', 'Ambulance Service'
    ],
    bedCapacity: {
      total: 262,
      available: 18,
      icu: { total: 40, available: 2 },
      general: { total: 200, available: 14 },
      emergency: { total: 22, available: 2 },
      lastUpdated: new Date().toISOString()
    },
    rating: 4.5,
    accreditation: ['NABH', 'NABL'],
    metadata: {
      established: '2010',
      verified: true,
      emergencyServices: true,
      ambulanceService: true
    }
  }]; // your unchanged hospital array

export const delhiDoctors: Doctor[] =  [
  {
    _id: 'doc-aiims-001',
    name: 'Dr. Rajesh Kumar Sharma',
    specialization: 'Cardiology',
    experience: 18,
    rating: 4.9,
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.5672]
    },
    address: 'AIIMS, Cardiology Department, New Delhi',
    hospital: 'All India Institute of Medical Sciences (AIIMS)',
    department: 'Cardiology',
    languages: ['Hindi', 'English', 'Punjabi'],
    qualifications: ['MBBS', 'MD (Cardiology)', 'DM (Interventional Cardiology)', 'FACC'],
    bio: 'Senior Consultant Cardiologist with expertise in interventional cardiology, heart failure management, and preventive cardiology. Specializes in complex angioplasty procedures and cardiac catheterization.',
    availability: {
      slots: 3,
      nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      schedule: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: false },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      isEmergency: true
    },
    contact: {
      phone: '+91-11-2658-8500',
      email: 'dr.rajesh.cardio@aiims.ac.in'
    },
    metadata: {
      verified: true,
      lastUpdated: new Date().toISOString(),
      totalPatients: 15420,
      successRate: 96.8
    }
  },
  {
    _id: 'doc-apollo-002',
    name: 'Dr. Priya Malhotra',
    specialization: 'Neurology',
    experience: 14,
    rating: 4.8,
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.5355]
    },
    address: 'Apollo Hospital, Neurology Department, Sarita Vihar',
    hospital: 'Apollo Hospital Delhi',
    department: 'Neurology',
    languages: ['Hindi', 'English'],
    qualifications: ['MBBS', 'MD (Medicine)', 'DM (Neurology)', 'FAAN'],
    bio: 'Consultant Neurologist specializing in stroke management, epilepsy treatment, and movement disorders. Expert in neurological emergencies and critical care neurology.',
    availability: {
      slots: 5,
      nextAvailable: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      schedule: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: false },
        friday: { start: '10:00', end: '18:00', available: true },
        saturday: { start: '10:00', end: '14:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      isEmergency: false
    },
    contact: {
      phone: '+91-11-2692-5858',
      email: 'dr.priya.neuro@apollodelhi.com'
    },
    metadata: {
      verified: true,
      lastUpdated: new Date().toISOString(),
      totalPatients: 8750,
      successRate: 94.2
    }
  },
  {
    _id: 'doc-safdarjung-003',
    name: 'Dr. Amit Singh',
    specialization: 'Emergency Medicine',
    experience: 10,
    rating: 4.6,
    location: {
      type: 'Point',
      coordinates: [77.1925, 28.5706]
    },
    address: 'Safdarjung Hospital, Emergency Department',
    hospital: 'Safdarjung Hospital',
    department: 'Emergency Medicine',
    languages: ['Hindi', 'English', 'Urdu'],
    qualifications: ['MBBS', 'MD (Emergency Medicine)', 'FCEM'],
    bio: 'Emergency Medicine specialist with expertise in trauma care, critical care, and emergency procedures. Available 24/7 for emergency consultations and critical patient management.',
    availability: {
      slots: 8,
      nextAvailable: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      schedule: {
        monday: { start: '00:00', end: '23:59', available: true },
        tuesday: { start: '00:00', end: '23:59', available: true },
        wednesday: { start: '00:00', end: '23:59', available: true },
        thursday: { start: '00:00', end: '23:59', available: true },
        friday: { start: '00:00', end: '23:59', available: true },
        saturday: { start: '00:00', end: '23:59', available: true },
        sunday: { start: '00:00', end: '23:59', available: true }
      },
      isEmergency: true
    },
    contact: {
      phone: '+91-11-2670-1000',
      email: 'dr.amit.emergency@safdarjung.gov.in'
    },
    metadata: {
      verified: true,
      lastUpdated: new Date().toISOString(),
      totalPatients: 12300,
      successRate: 92.5
    }
  },
  {
    _id: 'doc-fortis-004',
    name: 'Dr. Sunita Agarwal',
    specialization: 'Pediatrics',
    experience: 12,
    rating: 4.7,
    location: {
      type: 'Point',
      coordinates: [77.1644, 28.7196]
    },
    address: 'Fortis Hospital, Pediatrics Department, Shalimar Bagh',
    hospital: 'Fortis Hospital Shalimar Bagh',
    department: 'Pediatrics',
    languages: ['Hindi', 'English'],
    qualifications: ['MBBS', 'MD (Pediatrics)', 'Fellowship in Pediatric Cardiology'],
    bio: 'Pediatric specialist with focus on newborn care, childhood diseases, and pediatric cardiology. Expert in managing complex pediatric cases and neonatal emergencies.',
    availability: {
      slots: 4,
      nextAvailable: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      schedule: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '17:00', available: false },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      isEmergency: false
    },
    contact: {
      phone: '+91-11-4277-6222',
      email: 'dr.sunita.pediatrics@fortis.in'
    },
    metadata: {
      verified: true,
      lastUpdated: new Date().toISOString(),
      totalPatients: 6890,
      successRate: 95.1
    }
  }
]; // your unchanged doctor array

export const delhiBedAvailability: BedAvailability[] = [
  {
    _id: 'bed-aiims-001',
    hospitalId: 'hosp-aiims-001',
    hospitalName: 'All India Institute of Medical Sciences (AIIMS)',
    timestamp: new Date().toISOString(),
    bedCounts: {
      total: 2478,
      available: 234,
      occupied: 2244,
      icu: { total: 200, available: 12, occupied: 188 },
      general: { total: 2000, available: 180, occupied: 1820 },
      emergency: { total: 278, available: 42, occupied: 236 },
      covid: { total: 100, available: 8, occupied: 92 }
    },
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.5672]
    },
    district: 'New Delhi',
    contactNumber: '+91-11-2658-8500'
  },
  {
    _id: 'bed-apollo-002',
    hospitalId: 'hosp-apollo-003',
    hospitalName: 'Apollo Hospital Delhi',
    timestamp: new Date().toISOString(),
    bedCounts: {
      total: 695,
      available: 45,
      occupied: 650,
      icu: { total: 85, available: 3, occupied: 82 },
      general: { total: 550, available: 38, occupied: 512 },
      emergency: { total: 60, available: 4, occupied: 56 },
      covid: { total: 50, available: 2, occupied: 48 }
    },
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.5355]
    },
    district: 'South Delhi',
    contactNumber: '+91-11-2692-5858'
  },
  {
    _id: 'bed-safdarjung-003',
    hospitalId: 'hosp-safdarjung-002',
    hospitalName: 'Safdarjung Hospital',
    timestamp: new Date().toISOString(),
    bedCounts: {
      total: 1500,
      available: 89,
      occupied: 1411,
      icu: { total: 120, available: 8, occupied: 112 },
      general: { total: 1200, available: 65, occupied: 1135 },
      emergency: { total: 180, available: 16, occupied: 164 },
      covid: { total: 80, available: 5, occupied: 75 }
    },
    location: {
      type: 'Point',
      coordinates: [77.1925, 28.5706]
    },
    district: 'South West Delhi',
    contactNumber: '+91-11-2670-1000'
  },
  {
    _id: 'bed-fortis-004',
    hospitalId: 'hosp-fortis-004',
    hospitalName: 'Fortis Hospital Shalimar Bagh',
    timestamp: new Date().toISOString(),
    bedCounts: {
      total: 262,
      available: 18,
      occupied: 244,
      icu: { total: 40, available: 2, occupied: 38 },
      general: { total: 200, available: 14, occupied: 186 },
      emergency: { total: 22, available: 2, occupied: 20 },
      covid: { total: 25, available: 1, occupied: 24 }
    },
    location: {
      type: 'Point',
      coordinates: [77.1644, 28.7196]
    },
    district: 'North West Delhi',
    contactNumber: '+91-11-4277-6222'
  }
]; // your unchanged bed data

// Generate doctor embeddings
(async () => {
  for (const doctor of delhiDoctors) {
    const profileText = `${doctor.name} ${doctor.specialization} ${doctor.bio} ${doctor.qualifications.join(' ')} ${doctor.languages.join(' ')}`;
    doctor.embedding = await generateEmbedding(profileText);
  }
})();

// Generate hospital embeddings
(async () => {
  for (const hospital of delhiHospitals) {
    const profileText = `${hospital.name} ${hospital.specialties.join(' ')} ${hospital.facilities.join(' ')} ${hospital.type}`;
    hospital.embedding = await generateEmbedding(profileText);
  }
})();
