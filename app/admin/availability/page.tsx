'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar,
  Plus,
  Save,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone
} from 'lucide-react';

export default function AvailabilityPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const salonHours = {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '20:00', closed: false },
    friday: { open: '09:00', close: '20:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '', close: '', closed: true },
  };

  const stylistSchedules = [
    {
      id: 'ST001',
      name: 'Maria Santos',
      schedule: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '09:00', end: '17:00', available: true },
        saturday: { start: '10:00', end: '15:00', available: true },
        sunday: { start: '', end: '', available: false },
      },
    },
    {
      id: 'ST002',
      name: 'Lisa Chen',
      schedule: {
        monday: { start: '', end: '', available: false },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '', end: '', available: false },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '18:00', available: true },
        saturday: { start: '', end: '', available: false },
        sunday: { start: '', end: '', available: false },
      },
    },
  ];

  const specialDates = [
    { date: '2024-01-15', event: 'Martin Luther King Jr. Day', closed: true },
    { date: '2024-02-14', event: 'Valentine\'s Day Special Hours', open: '10:00', close: '18:00' },
    { date: '2024-02-19', event: 'Presidents\' Day', closed: true },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#3A241C] mb-2">Availability Management</h1>
          <p className="text-[#454545]">Manage salon hours and stylist schedules</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#8A4A32] text-white rounded-lg hover:bg-[#6A3A22] transition font-medium">
          <Plus size={20} />
          Add Special Date
        </button>
      </div>

      {/* Salon Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#8A4A32] to-[#5C241E] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-white" size={24} />
              <h2 className="text-xl font-serif text-white">Salon Operating Hours</h2>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {days.map((day, index) => {
              const dayKey = dayKeys[index];
              const hours = salonHours[dayKey as keyof typeof salonHours];
              
              return (
                <div key={day} className="flex items-center justify-between p-4 bg-[#F7F1EC]/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <p className="font-medium text-[#3A241C]">{day}</p>
                    </div>
                    {hours.closed ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        Closed
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          defaultValue={hours.open}
                          className="px-3 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32]"
                        />
                        <span className="text-[#454545]">to</span>
                        <input
                          type="time"
                          defaultValue={hours.close}
                          className="px-3 py-2 border border-[#3A241C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4A32]"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition">
                      <Edit size={18} className="text-[#8A4A32]" />
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={hours.closed}
                        className="w-5 h-5 rounded border-[#3A241C]/20 text-[#8A4A32] focus:ring-[#8A4A32]"
                      />
                      <span className="text-sm text-[#454545]">Closed</span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Stylist Schedules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#5C241E] to-[#3A241C] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="text-white" size={24} />
              <h2 className="text-xl font-serif text-white">Stylist Weekly Schedules</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/20 rounded-lg transition">
                <ChevronLeft className="text-white" size={20} />
              </button>
              <span className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium">
                Week of Jan 15, 2024
              </span>
              <button className="p-2 hover:bg-white/20 rounded-lg transition">
                <ChevronRight className="text-white" size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {stylistSchedules.map((stylist) => (
              <div key={stylist.id} className="border border-[#3A241C]/10 rounded-lg overflow-hidden">
                <div className="bg-[#F7F1EC]/50 p-4 flex items-center justify-between">
                  <h3 className="font-serif text-lg text-[#3A241C]">{stylist.name}</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition">
                      <Edit size={18} className="text-[#8A4A32]" />
                    </button>
                    <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition">
                      <Save size={18} className="text-[#8A4A32]" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                      const dayKey = dayKeys[index];
                      const schedule = stylist.schedule[dayKey as keyof typeof stylist.schedule];
                      
                      return (
                        <div key={day} className="text-center">
                          <p className="text-xs font-medium text-[#454545] mb-2">{day.slice(0, 3)}</p>
                          {schedule.available ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                              <p className="text-xs text-green-800 font-medium">{schedule.start}</p>
                              <p className="text-xs text-green-600">to</p>
                              <p className="text-xs text-green-800 font-medium">{schedule.end}</p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                              <XCircle size={16} className="mx-auto text-gray-400" />
                              <p className="text-xs text-gray-500 mt-1">Off</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Special Dates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#6A3A2C] to-[#5C241E] p-6">
          <div className="flex items-center gap-3">
            <Calendar className="text-white" size={24} />
            <h2 className="text-xl font-serif text-white">Special Dates & Holidays</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {specialDates.map((date, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#F7F1EC]/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#3A241C]">{date.date}</p>
                    <p className="text-xs text-[#454545]">{date.event}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {date.closed ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Closed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#454545]">Special Hours:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {date.open} - {date.close}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-[#F7F1EC] rounded-lg transition">
                      <Edit size={18} className="text-[#8A4A32]" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
          <h3 className="text-lg font-serif text-[#3A241C] mb-4">Salon Location</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#8A4A32]" />
              <p className="text-[#454545]">123 Luxury Lane, Beauty District, NY 10001</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#8A4A32]" />
              <p className="text-[#454545]">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#3A241C]/10 p-6">
          <h3 className="text-lg font-serif text-[#3A241C] mb-4">Booking Policies</h3>
          <div className="space-y-2 text-sm text-[#454545]">
            <p>• Cancellation required 24 hours in advance</p>
            <p>• Late arrivals may have reduced service time</p>
            <p>• Deposit required for appointments over 200,000 XAF</p>
            <p>• Children under 12 must be accompanied by adult</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
