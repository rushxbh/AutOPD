import React, { useState } from 'react';
import { AlertTriangle, Zap, Clock, Phone, MapPin, Activity } from 'lucide-react';
import { mockBeds, mockDoctors } from '../../data/mockData';

export default function EmergencyBooking() {
  const [emergencyType, setEmergencyType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const emergencyTypes = [
    { id: 'cardiac', label: 'Cardiac Emergency', icon: '❤️', priority: 10 },
    { id: 'trauma', label: 'Trauma/Accident', icon: '🚨', priority: 9 },
    { id: 'respiratory', label: 'Breathing Difficulty', icon: '🫁', priority: 8 },
    { id: 'neurological', label: 'Neurological Emergency', icon: '🧠', priority: 9 },
    { id: 'other', label: 'Other Emergency', icon: '🏥', priority: 7 },
  ];

  const handleEmergencyBooking = () => {
    if (!emergencyType || !symptoms) return;
    
    setIsBooking(true);
    
    // Simulate AI-powered emergency allocation
    setTimeout(() => {
      const availableBeds = mockBeds.filter(bed => !bed.isOccupied && (bed.type === 'ICU' || bed.type === 'Emergency'));
      const emergencyDoctors = mockDoctors.filter(doc => doc.availability.isEmergency);
      
      const selectedBed = availableBeds[0];
      const selectedDoctor = emergencyDoctors[0];
      
      setBookingResult({
        bed: selectedBed,
        doctor: selectedDoctor,
        estimatedWaitTime: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
        priority: emergencyTypes.find(e => e.id === emergencyType)?.priority || 7,
      });
      setIsBooking(false);
    }, 2000);
  };

  if (bookingResult) {
    return (
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="bg-accent-50 border border-accent-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent-100 rounded-lg">
              <Activity className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-accent-800">Emergency Booking Confirmed</h2>
              <p className="text-sm text-accent-700">Your emergency appointment has been processed via AI allocation</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Assigned Doctor</h3>
                <div className="space-y-2">
                  <div className="text-sm"><strong>{bookingResult.doctor.name}</strong></div>
                  <div className="text-sm text-gray-600">{bookingResult.doctor.specialization}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{bookingResult.doctor.location}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Allocated Bed</h3>
                <div className="space-y-2">
                  <div className="text-sm"><strong>{bookingResult.bed.id}</strong></div>
                  <div className="text-sm text-gray-600">{bookingResult.bed.type} - {bookingResult.bed.ward}</div>
                  <div className="text-sm text-gray-600">Floor {bookingResult.bed.floor}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Estimated wait time: <strong>{bookingResult.estimatedWaitTime} minutes</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-critical-500" />
                  <span className="text-sm text-gray-600">
                    Priority: <strong>{bookingResult.priority}/10</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-critical-50 rounded-lg">
              <Phone className="h-5 w-5 text-critical-600" />
              <div>
                <div className="font-medium text-critical-800">Emergency Hotline</div>
                <div className="text-sm text-critical-700">Call 102 if condition worsens</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Please arrive at the hospital as soon as possible</p>
              <p>• Bring your Ayushman Bharat Health ID and any relevant medical records</p>
              <p>• You will receive an SMS confirmation shortly</p>
              <p>• Our medical team has been notified and is preparing for your arrival</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <div className="bg-critical-50 border border-critical-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-critical-600" />
          <h2 className="text-lg font-semibold text-critical-800">Emergency Booking</h2>
        </div>
        <p className="text-sm text-critical-700">
          For life-threatening emergencies, please call 108 immediately. This system will auto-allocate the best available resources.
        </p>
      </div>

      {/* Emergency Booking Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Details</h3>
        
        <div className="space-y-6">
          {/* Emergency Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type of Emergency
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setEmergencyType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    emergencyType === type.id
                      ? 'border-critical-500 bg-critical-50'
                      : 'border-gray-200 hover:border-critical-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">Priority: {type.priority}/10</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe Current Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              placeholder="Please describe your current symptoms in detail..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-critical-500 focus:ring-critical-500"
            />
          </div>

          {/* Emergency Booking Button */}
          <button
            onClick={handleEmergencyBooking}
            disabled={!emergencyType || !symptoms || isBooking}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-critical-600 text-white rounded-lg hover:bg-critical-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing Emergency Booking...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Book Emergency Appointment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Available Resources */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Availability</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Emergency Doctors</h4>
            <div className="text-2xl font-bold text-accent-600">
              {mockDoctors.filter(doc => doc.availability.isEmergency).length}
            </div>
            <div className="text-sm text-gray-600">Available now</div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Emergency Beds</h4>
            <div className="text-2xl font-bold text-accent-600">
              {mockBeds.filter(bed => !bed.isOccupied && (bed.type === 'ICU' || bed.type === 'Emergency')).length}
            </div>
            <div className="text-sm text-gray-600">ICU & Emergency beds free</div>
          </div>
        </div>
      </div>
    </div>
  );
}