'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Clock, User, Mail, Phone, FileText, Shield, Award, Check, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  image_url: string | null;
}

function BookingPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service_id');
  const styleName = searchParams.get('style');
  const selectedStyleImageFromQuery = searchParams.get('style_image');

  // Optional explicit style name passed from gallery cards.
  const styleNameFromQuery = searchParams.get('style_name');

  // style_image is used for the book page image preview
  const decodedStyleImageFromQuery = selectedStyleImageFromQuery
    ? decodeURIComponent(selectedStyleImageFromQuery)
    : null;

  const resolvedStyleName = styleNameFromQuery
    ? decodeURIComponent(styleNameFromQuery)
    : styleName
      ? decodeURIComponent(styleName)
      : null;

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const availableTimes = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'];

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch services');
      }

      setServices(result.data || []);
      
      // If service_id is in URL, select that service
      if (serviceId && result.data) {
        const service = result.data.find((s: Service) => s.id === serviceId);
        if (service) {
          setSelectedService(service);
        } else if (result.data.length > 0) {
          setSelectedService(result.data[0]);
        }
      } 
      // If styleName is in URL, try to find matching service
      else if (styleName && result.data) {
        const decodedStyle = decodeURIComponent(styleName);
        const matchingService = result.data.find((s: Service) => 
          s.name.toLowerCase().includes(decodedStyle.toLowerCase()) ||
          s.category?.toLowerCase().includes(decodedStyle.toLowerCase())
        );
        if (matchingService) {
          setSelectedService(matchingService);
        } else if (result.data.length > 0) {
          setSelectedService(result.data[0]);
        }
      }
      else if (result.data && result.data.length > 0) {
        setSelectedService(result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      const fallbackServices = [{
        id: '1',
        name: 'Boho Box Braids',
        description: 'Elegant bohemian-style box braids with intricate patterns',
        price: 250.00,
        duration: 270,
        category: 'Boho',
        image_url: null,
      }];
      setServices(fallbackServices);
      setSelectedService(fallbackServices[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [serviceId, styleName]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    const days = [];
    
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, currentMonth: false });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(year, month, i);
      const isToday = dayDate.toDateString() === new Date().toDateString();
      const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
      const isSelected = selectedDate && dayDate.toDateString() === selectedDate.toDateString();
      days.push({ day: i, currentMonth: true, isToday, isPast, isSelected, date: dayDate });
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: any) => {
    if (day && day.currentMonth && !day.isPast) {
      setSelectedDate(day.date);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    // Manually validate the form
    const form = document.getElementById('booking-form') as HTMLFormElement;

    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    if (!selectedService || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Step 1: Creating/updating customer...');
      // Step 1: Create or get customer
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('Customer creation failed:', errorText);
        throw new Error('Failed to create customer: ' + errorText);
      }

      const customerData = await customerResponse.json();
      console.log('Customer data:', customerData);
      const customerId = customerData.data.id;

      console.log('Step 2: Creating booking...');
      // Step 2: Create booking
      const bookingPayload = {
        customer_id: customerId,
        service_id: selectedService.id,
        stylist_id: null, // Will be assigned by admin
        appointment_date: selectedDate.toISOString().split('T')[0],
        appointment_time: selectedTime,
        status: 'pending',
        notes: appointmentNotes || null,
        total_price: selectedService.price,
        // Persist the exact style name the user chose on the book page
        style_name: resolvedStyleName || selectedService.name,
      };

      console.log('Booking payload:', bookingPayload);

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.error('Booking creation failed:', errorText);
        const errorData = await bookingResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create booking: ' + errorText);
      }

      const bookingData = await bookingResponse.json();
      console.log('Booking created successfully:', bookingData);



      setSubmitSuccess(true);
      
      // Redirect to home page after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedDate && selectedTime && fullName && email && phone && privacyAgreed;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF5F2]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#6F3D2E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6F3D2E] font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF5F2]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-serif text-[#6F3D2E] mb-2">Booking Requested!</h2>
          <p className="text-gray-600 mb-4">
            Your appointment request has been received. The admin will confirm or reject it shortly. We'll notify you in the dashboard.
          </p>
          <p className="text-sm text-gray-400">Redirecting to home page...</p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F2]">
      {/* Header */}
      <div className="bg-[#6F3D2E] text-white py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-serif font-light tracking-wide">Book Your Appointment</h1>
          <p className="text-sm text-white/80 mt-1">Premium hair braiding services</p>
        </div>
      </div>

      {submitError && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Service Selection */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <h2 className="text-lg font-serif text-[#6F3D2E] mb-3">Select Service</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`
                      relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all
                      ${selectedService?.id === service.id
                        ? 'border-[#6F3D2E] ring-2 ring-[#6F3D2E] ring-offset-2'
                        : 'border-gray-200 hover:border-[#6F3D2E]'
                      }
                    `}
                  >
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#EBE5DE] to-[#D4C4B5] flex items-center justify-center">
                        <span className="text-3xl font-serif text-[#4A2C2A]">{service.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                      <div className="font-semibold text-white text-sm mb-1 drop-shadow">{service.name}</div>
                      <div className="text-xs text-white/90 drop-shadow">{service.price.toLocaleString()} XAF</div>
                    </div>
                    {selectedService?.id === service.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#6F3D2E] rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Service Preview */}
            {selectedService && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-serif text-[#6F3D2E] mb-3">Selected Style</h2>
                <div className="flex gap-4">
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 border-[#6F3D2E]">
                    {selectedStyleImageFromQuery || selectedService?.image_url ? (
                      <img
                        src={selectedStyleImageFromQuery || (selectedService?.image_url as string)}
                        alt={
                          (styleNameFromQuery ? decodeURIComponent(styleNameFromQuery) : null) ||
                          (styleName ? decodeURIComponent(styleName) : null) ||
                          selectedService?.name ||
                          'Selected style'
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#EBE5DE] to-[#D4C4B5] flex items-center justify-center">
                        <span className="text-2xl font-serif text-[#4A2C2A]">{selectedService?.name?.charAt(0) || ''}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                <h3 className="text-xl font-serif text-[#6F3D2E] mb-2">
                    {resolvedStyleName || selectedService.name}
                    </h3>
                    {selectedService.description && (
                      <p className="text-sm text-gray-600 mb-2">{selectedService.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#6F3D2E]">
                        <DollarSign size={16} />
                        <span className="font-semibold">{selectedService.price.toLocaleString()} XAF</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        <span>{Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <h2 className="text-sm font-serif text-[#6F3D2E] mb-2">Select Date</h2>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft size={16} className="text-[#6F3D2E]" />
                </button>
                <h3 className="text-sm font-semibold text-[#1a1a1a]">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronRight size={16} className="text-[#6F3D2E]" />
                </button>
              </div>
              
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    disabled={day.isPast || !day.currentMonth}
                    className={`
                      aspect-square rounded-md text-xs font-medium transition-all relative
                      ${!day.currentMonth ? 'text-gray-300 cursor-default' : ''}
                      ${day.isPast ? 'text-gray-400 cursor-not-allowed' : ''}
                      ${day.isToday ? 'border-2 border-[#6F3D2E]' : ''}
                      ${day.isSelected 
                        ? 'bg-[#6F3D2E] text-white shadow-lg' 
                        : day.currentMonth && !day.isPast
                          ? 'hover:bg-gray-100 text-[#1a1a1a] border border-gray-200'
                          : ''
                      }
                    `}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#6F3D2E] mb-4">Available Times</h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    disabled={!selectedDate}
                    className={`
                      px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all
                      ${selectedTime === time
                        ? 'bg-[#6F3D2E] text-white border-[#6F3D2E]'
                        : 'border-gray-200 text-[#1a1a1a] hover:border-[#6F3D2E] hover:text-[#6F3D2E]'
                      }
                      ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Details */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif text-[#6F3D2E] mb-4">Client Details</h2>
              
              <form id="booking-form" onSubmit={handleBookingSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 tracking-wide">Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF5F2] border border-gray-200 rounded-lg focus:outline-none focus:border-[#6F3D2E] focus:ring-1 focus:ring-[#6F3D2E]/20 text-[#1a1a1a] placeholder-gray-400 transition"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 tracking-wide">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF5F2] border border-gray-200 rounded-lg focus:outline-none focus:border-[#6F3D2E] focus:ring-1 focus:ring-[#6F3D2E]/20 text-[#1a1a1a] placeholder-gray-400 transition"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 tracking-wide">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFF5F2] border border-gray-200 rounded-lg focus:outline-none focus:border-[#6F3D2E] focus:ring-1 focus:ring-[#6F3D2E]/20 text-[#1a1a1a] placeholder-gray-400 transition"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1 tracking-wide">Appointment Notes</label>
                  <textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-[#FFF5F2] border border-gray-200 rounded-lg focus:outline-none focus:border-[#6F3D2E] focus:ring-1 focus:ring-[#6F3D2E]/20 text-[#1a1a1a] placeholder-gray-400 resize-none transition"
                    placeholder="Any special requests or preferences..."
                  />
                </div>

                <div className="flex items-start gap-2 pt-3 border-t border-gray-100">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#6F3D2E] border-gray-300 rounded focus:ring-[#6F3D2E]"
                    required
                  />
                  <label htmlFor="privacy" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-4">
              {/* Image */}
              <div className="relative aspect-[4/5] bg-gray-100 rounded-t-xl overflow-hidden">
                {selectedStyleImageFromQuery || selectedService?.image_url ? (
                  <img
                    src={selectedStyleImageFromQuery || (selectedService?.image_url as string)}
                    alt={selectedService?.name || 'Selected style'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6F3D2E] to-[#4a2a1a]">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar size={32} />
                      </div>
                      <p className="font-serif">Elegance</p>
                    </div>
                  </div>
                )}

                {/* Classic Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Award size={12} />
                    Classic
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-serif text-[#6F3D2E] leading-tight">
                  {styleNameFromQuery ? decodeURIComponent(styleNameFromQuery) : (styleName ? decodeURIComponent(styleName) : (selectedService?.name || 'Select a service'))}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-[#6F3D2E]" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                      <p className="font-medium text-sm">{selectedService?.duration ? `${(selectedService.duration / 60).toFixed(1)} Hours` : '4.5 Hours'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-[#6F3D2E]" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                      <p className="font-medium text-sm">{selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select date'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} className="text-[#6F3D2E]" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Time</p>
                      <p className="font-medium text-sm">{selectedTime || 'Select time'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Total Investment</p>
                    <p className="text-2xl font-serif font-bold text-[#6F3D2E]">
                      {selectedService?.price ? selectedService.price.toLocaleString() : '250,000'} XAF
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="w-full py-3 bg-[#6F3D2E] text-white rounded-lg font-semibold text-base hover:bg-[#5a2d20] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-[#6F3D2E]" />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={12} className="text-[#6F3D2E]" />
                    <span>Certified Stylist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 py-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#6F3D2E]" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#6F3D2E]" />
              <span>Certified Stylist</span>
            </div>
          </div>
          <p className="text-gray-400">© 2024 Fave's Touch Studio</p>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#FFF5F2]">
        <div className="w-12 h-12 border-2 border-[#6F3D2E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BookingPage />
    </Suspense>
  );
}
