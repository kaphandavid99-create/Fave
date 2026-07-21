'use client';

import { useState, useMemo } from 'react';
import { Service, Stylist } from '@/types/database';
import ImageUpload from '@/components/ImageUpload';

interface BookingFormProps {
  services: Service[];
  stylists: Stylist[];
  useDatabase?: boolean;
}

export default function BookingForm({ services, stylists, useDatabase = true }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceId: '',
    stylistId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
    customerPhotoUrl: '',
    privacyAgreed: false
  });

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadResetKey, setUploadResetKey] = useState(0);

  const availableTimes = ['9:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];

  // Generate calendar for current month
  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  }, []);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleUpload = (url: string, publicId: string) => {
    setFormData({ ...formData, customerPhotoUrl: url });
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const now = new Date();
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), day);
    setFormData({ ...formData, appointmentDate: selectedDate.toISOString().split('T')[0] });
  };

  const handleTimeClick = (time: string) => {
    setFormData({ ...formData, appointmentTime: time });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (useDatabase) {
        const customerResponse = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            preferences: {
              photo_url: formData.customerPhotoUrl
            }
          })
        });

        const customerData = await customerResponse.json();
        
        if (!customerResponse.ok) {
          throw new Error('Failed to create customer');
        }

        const bookingResponse = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: customerData.data.id,
            stylist_id: formData.stylistId || null,
            service_id: formData.serviceId,
            appointment_date: formData.appointmentDate,
            appointment_time: formData.appointmentTime,
            notes: formData.notes,
            status: 'pending',
            total_price: services.find(s => s.id === formData.serviceId)?.price
          })
        });

        if (!bookingResponse.ok) {
          throw new Error('Failed to create booking');
        }

        setMessage('Booking successful! We will contact you shortly to confirm.');
      } else {
        console.log('Demo booking:', formData);
        setMessage('Demo booking submitted! (Database not connected)');
      }

      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceId: '',
        stylistId: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
        customerPhotoUrl: '',
        privacyAgreed: false
      });
      setSelectedDay(null);
      
      // Reset image upload
      setUploadResetKey(prev => prev + 1);
    } catch (error) {
      setMessage('Error creating booking. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.includes('successful') || message.includes('submitted') 
              ? 'bg-green-50 text-green-800' 
              : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Three Row Layout */}
        <div className="space-y-4">
          
          {/* SECTION 1: Select Date & Time */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h2 className="text-xl font-serif text-[#5C241E] mb-4">Select Date</h2>
            
            {/* Service Selection */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#3A241C] mb-1 uppercase tracking-wider">
                Select Service *
              </label>
              <select
                required
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-3 py-2 bg-[#F7F1EC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#8A4A32] transition-all cursor-pointer text-sm"
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString()} XAF
                  </option>
                ))}
              </select>
            </div>
            
            {/* Calendar */}
            <div className="mb-4">
              <div className="bg-[#F7F1EC] rounded-lg p-3">
                <div className="text-center mb-2">
                  <h3 className="text-sm font-semibold text-[#3A241C]">{currentMonth}</h3>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="font-semibold text-[#8A4A32] text-xs uppercase">
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      onClick={() => day && handleDayClick(day)}
                      className={`
                        aspect-square flex items-center justify-center rounded cursor-pointer transition-all text-xs
                        ${day 
                          ? selectedDay === day
                            ? 'bg-[#8A4A32] text-white'
                            : 'bg-white text-[#3A241C] hover:bg-[#8A4A32] hover:text-white'
                          : ''
                        }
                      `}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Times */}
            <div>
              <h3 className="text-lg font-serif text-[#5C241E] mb-3">Available Times</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => handleTimeClick(time)}
                    className={`
                      p-2 rounded border transition-all text-xs font-medium
                      ${formData.appointmentTime === time
                        ? 'border-[#8A4A32] bg-[#8A4A32] text-white'
                        : 'border-gray-200 bg-white text-[#3A241C] hover:border-[#8A4A32]'
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: Client Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h2 className="text-xl font-serif text-[#5C241E] mb-4">Clients Details</h2>
            
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#3A241C] mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F1EC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#8A4A32] transition-all text-sm"
                  placeholder="Your full name"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#3A241C] mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F7F1EC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#8A4A32] transition-all text-sm"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Appointment Note */}
              <div>
                <label className="block text-xs font-semibold text-[#3A241C] mb-1 uppercase tracking-wider">
                  Appointment Note
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#F7F1EC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#8A4A32] transition-all resize-none text-sm"
                  placeholder="Any special requests or notes for your appointment..."
                />
              </div>

              {/* Privacy Agreement */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  checked={formData.privacyAgreed}
                  onChange={(e) => setFormData({ ...formData, privacyAgreed: e.target.checked })}
                  className="mt-0.5 w-3 h-3 text-[#8A4A32] border-gray-300 rounded focus:ring-[#8A4A32]"
                />
                <label htmlFor="privacy" className="text-xs text-[#454545] leading-relaxed">
                  I agree to the privacy policy and consent to the collection and processing of my personal data for booking purposes.
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 3: Service Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <h2 className="text-xl font-serif text-[#5C241E] mb-4">Booking Summary</h2>
            
            <div>
              {/* Service Image */}
              <div className="mb-4">
                {formData.customerPhotoUrl ? (
                  <img
                    src={formData.customerPhotoUrl}
                    alt="Customer reference"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-[#F7F1EC] rounded-lg flex items-center justify-center">
                    <ImageUpload
                      onUpload={handleUpload}
                      folder="customers"
                      buttonText="Upload Reference Image"
                      resetKey={uploadResetKey}
                    />
                  </div>
                )}
              </div>

              {/* Service Details */}
              {selectedService ? (
                <div className="bg-[#F7F1EC] rounded-lg p-3 mb-4">
                  <h3 className="text-lg font-serif text-[#5C241E] mb-1">{selectedService.name}</h3>
                  <p className="text-xs text-[#454545] mb-2">{selectedService.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#8A4A32] font-semibold">Duration:</span>{' '}
                      <span className="text-[#3A241C]">{Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m</span>
                    </div>
                    <div>
                      <span className="text-[#8A4A32] font-semibold">Date:</span>{' '}
                      <span className="text-[#3A241C]">
                        {formData.appointmentDate ? new Date(formData.appointmentDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : 'Not selected'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8A4A32] font-semibold">Time:</span>{' '}
                      <span className="text-[#3A241C]">{formData.appointmentTime || 'Not selected'}</span>
                    </div>
                    <div>
                      <span className="text-[#8A4A32] font-semibold">Total Investment:</span>{' '}
                      <span className="text-[#3A241C] font-semibold">{selectedService.price.toLocaleString()} XAF</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F7F1EC] rounded-lg p-3 mb-4 text-center">
                  <p className="text-xs text-[#454545]">Select a service above to see details</p>
                </div>
              )}

              {/* Confirm Booking Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#8A4A32] to-[#5C241E] text-white py-4 px-6 rounded-xl font-bold text-base hover:from-[#6A3A22] hover:to-[#3A241C] transition-all duration-200 disabled:opacity-90 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Confirm Booking'}
              </button>
              
              {/* Form validation message */}
              {!formData.serviceId || !formData.appointmentDate || !formData.appointmentTime || !formData.privacyAgreed ? (
                <p className="text-xs text-[#8A4A32] mt-2 text-center font-medium">
                  {!formData.serviceId ? '• Select a service ' : ''}
                  {!formData.appointmentDate ? '• Choose a date ' : ''}
                  {!formData.appointmentTime ? '• Pick a time ' : ''}
                  {!formData.privacyAgreed ? '• Agree to privacy policy ' : ''}
                </p>
              ) : null}
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
