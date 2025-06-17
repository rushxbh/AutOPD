import React, { useState, useEffect } from 'react';
import { Clock, User, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Appointment } from '../../types';
import { mockAppointments } from '../../data/mockData';

export default function AppointmentQueue() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments(current => 
        current.map(apt => ({
          ...apt,
          // Simulate status changes
          status: Math.random() > 0.9 ? 
            (apt.status === 'Scheduled' ? 'In Progress' : 
             apt.status === 'In Progress' ? 'Completed' : apt.status) : apt.status
        }))
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return <Clock className="h-4 w-4 text-warning-500" />;
      case 'In Progress':
        return <Activity className="h-4 w-4 text-primary-500 animate-pulse" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-accent-500" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4 text-critical-500" />;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'In Progress':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'Completed':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'Cancelled':
        return 'bg-critical-100 text-critical-800 border-critical-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-critical-500';
    if (priority >= 6) return 'bg-warning-500';
    return 'bg-accent-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Live Appointment Queue</h2>
        <p className="text-sm text-gray-600 mt-1">Real-time patient appointments and status updates</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(appointment.priority)}`} />
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                  {getStatusIcon(appointment.status)}
                  <span>{appointment.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-2 font-medium">
                    {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium">{appointment.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Priority:</span>
                  <span className="ml-2 font-medium">{appointment.priority}/10</span>
                </div>
              </div>

              {appointment.symptoms.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-gray-500 text-sm">Symptoms:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {appointment.symptoms.map(symptom => (
                      <span
                        key={symptom}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}