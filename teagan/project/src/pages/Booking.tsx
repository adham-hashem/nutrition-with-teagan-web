import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Video, Calendar, Tag, Loader2, X, MapPin, Users, Package } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from '../router';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_minutes: number;
  price_pence: number;
  tag: string | null;
  tag_color: string;
  image_url: string | null;
  is_featured: boolean;
  consultation_type: 'online' | 'in_person' | 'hybrid';
}

interface Programme {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_weeks: number;
  price_pence: number;
  tag: string | null;
  tag_color: string;
  image_url: string | null;
  is_featured: boolean;
  is_bookable_standalone: boolean;
}

interface AvailabilitySettings {
  start_hour: number;
  end_hour: number;
  slot_duration_minutes: number;
  buffer_minutes: number;
  working_days: number[];
  blocked_dates: string[];
}

interface AvailabilityTemplate {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

interface AvailabilityException {
  exception_date: string;
  exception_type: 'holiday' | 'blocked' | 'special';
  alternative_hours: { start: string; end: string } | null;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatPrice = (pence: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(pence / 100);
};

export default function Booking() {
  // Dynamic data - services for Step 1, programmes for Step 2
  const [services, setServices] = useState<Service[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<AvailabilityTemplate[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySettings>({
    start_hour: 9,
    end_hour: 17,
    slot_duration_minutes: 30,
    buffer_minutes: 15,
    working_days: [1, 2, 3, 4, 5],
    blocked_dates: [],
  });

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null); // Optional
  const [selectedType, setSelectedType] = useState<'online' | 'in_person' | 'hybrid'>('online');
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    symptoms: '',
    mainConcern: '',
    medications: '',
    notes: '',
  });

  // Discount code state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_discount_amount: number | null;
  } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [validatingDiscount, setValidatingDiscount] = useState(false);

  // Booked slots
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (selectedDay) {
      fetchBookedSlots();
    }
  }, [selectedDay, calMonth, calYear]);

  async function fetchData() {
    setLoading(true);
    try {
      const [servicesData, programmesData] = await Promise.all([
        supabase.from('services').select('*').eq('is_active', true).order('display_order'),
        supabase.from('programmes').select('*').eq('is_active', true).order('display_order'),
      ]);

      if (servicesData.data) {
        setServices(servicesData.data as Service[]);
      }

      if (programmesData.data) {
        setProgrammes(programmesData.data as Programme[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAvailability() {
    try {
      const [settingsRes, templatesRes, exceptionsRes] = await Promise.all([
        supabase.from('availability_settings').select('*').maybeSingle(),
        supabase.from('availability_templates').select('*'),
        supabase.from('availability_exceptions').select('*'),
      ]);

      if (settingsRes && settingsRes.data) {
        setAvailability(prev => ({
          ...prev,
          slot_duration_minutes: settingsRes.data.slot_duration_minutes || 30,
          buffer_minutes: settingsRes.data.buffer_minutes || 15,
        }));
      }

      if (templatesRes && templatesRes.data) {
        setTemplates(templatesRes.data as AvailabilityTemplate[]);
      }

      if (exceptionsRes && exceptionsRes.data) {
        setExceptions(exceptionsRes.data as AvailabilityException[]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  }

  async function fetchBookedSlots() {
    if (!selectedDay) return;

    const selectedDate = new Date(calYear, calMonth, selectedDay);
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from('bookings')
      .select('scheduled_at, duration_minutes')
      .eq('status', 'confirmed')
      .gte('scheduled_at', startOfDay.toISOString())
      .lte('scheduled_at', endOfDay.toISOString());

    if (data) {
      const slots: string[] = [];
      data.forEach((booking: { scheduled_at: string; duration_minutes: number }) => {
        const start = new Date(booking.scheduled_at);
        const hours = start.getHours();
        const minutes = start.getMinutes();
        const slotKey = `${hours}:${minutes.toString().padStart(2, '0')}`;
        slots.push(slotKey);
      });
      setBookedSlots(slots);
    }
  }

  const generateTimeSlots = () => {
    if (!selectedDay) return [];
    const slots: string[] = [];

    const selectedDate = new Date(calYear, calMonth, selectedDay);
    const jsDayOfWeek = selectedDate.getDay();
    const templateDay = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;
    const dateStr = `${calYear}-${(calMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

    const exception = exceptions.find(e => e.exception_date === dateStr);
    const template = templates.find(t => t.day_of_week === templateDay);

    let startStr = '09:00';
    let endStr = '17:00';

    if (exception && exception.exception_type === 'special' && exception.alternative_hours) {
      startStr = exception.alternative_hours.start;
      endStr = exception.alternative_hours.end;
    } else if (template && template.is_working_day) {
      startStr = template.start_time;
      endStr = template.end_time;
    }

    const parseTime = (timeStr: string, defaultHour: number) => {
      if (!timeStr) return [defaultHour, 0];
      const parts = timeStr.split(':').map(Number);
      return [isNaN(parts[0]) ? defaultHour : parts[0], isNaN(parts[1]) ? 0 : parts[1]];
    };

    const [startH, startM] = parseTime(startStr, 9);
    const [endH, endM] = parseTime(endStr, 17);

    const slotDuration = availability.slot_duration_minutes || 30;

    let currentHour = startH;
    let currentMin = startM;

    while (currentHour < endH || (currentHour === endH && currentMin < endM)) {
      const slotKey = `${currentHour}:${currentMin.toString().padStart(2, '0')}`;
      if (!bookedSlots.includes(slotKey)) {
        const hour12 = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
        const ampm = currentHour >= 12 ? 'PM' : 'AM';
        slots.push(`${hour12}:${currentMin.toString().padStart(2, '0')} ${ampm}`);
      }

      currentMin += slotDuration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  };

  const availableTimes = generateTimeSlots();

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) return;

    setValidatingDiscount(true);
    setDiscountError('');

    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setDiscountError('Invalid discount code');
        setAppliedDiscount(null);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setDiscountError('This code has expired');
        setAppliedDiscount(null);
        return;
      }

      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        setDiscountError('This code has reached its usage limit');
        setAppliedDiscount(null);
        return;
      }

      setAppliedDiscount({
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        max_discount_amount: data.max_discount_amount,
      });
    } catch (err) {
      setDiscountError('Failed to validate code');
      setAppliedDiscount(null);
    } finally {
      setValidatingDiscount(false);
    }
  };

  const getServicePrice = (): number => {
    const service = services.find(s => s.id === selectedService);
    return service?.price_pence || 0;
  };

  const getProgrammePrice = (): number => {
    if (!selectedProgramme) return 0;
    const programme = programmes.find(p => p.id === selectedProgramme);
    return programme?.price_pence || 0;
  };

  const getTotalPrice = (): number => {
    return getServicePrice() + getProgrammePrice();
  };

  const calculateDiscount = (totalPrice: number): { discount: number; finalPrice: number } => {
    if (!appliedDiscount) {
      return { discount: 0, finalPrice: totalPrice };
    }

    let discount = 0;
    if (appliedDiscount.discount_type === 'percentage') {
      discount = (totalPrice * appliedDiscount.discount_value) / 100;
      if (appliedDiscount.max_discount_amount) {
        discount = Math.min(discount, appliedDiscount.max_discount_amount * 100);
      }
    } else {
      discount = appliedDiscount.discount_value * 100;
    }

    discount = Math.min(discount, totalPrice);
    return { discount, finalPrice: totalPrice - discount };
  };

  const totalSteps = 6;

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const isPastDay = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    const todayCopy = new Date(today);
    todayCopy.setHours(0, 0, 0, 0);
    return d < todayCopy;
  };

  const isWorkingDay = (day: number) => {
    const dayOfWeek = new Date(calYear, calMonth, day).getDay();
    // JS: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    // Template: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
    const templateDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (templates.length === 0) {
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    }

    const template = templates.find(t => t.day_of_week === templateDay);
    return template ? template.is_working_day : false;
  };

  const isBlockedDate = (day: number) => {
    const dateStr = `${calYear}-${(calMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const exception = exceptions.find(e => e.exception_date === dateStr);
    if (exception) {
      return exception.exception_type === 'holiday' || exception.exception_type === 'blocked';
    }
    return false;
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
    setSelectedDay(null);
  };

  const prevMonth = () => {
    const newDate = new Date(calYear, calMonth - 1, 1);
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
      else setCalMonth(calMonth - 1);
      setSelectedDay(null);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return true; // Programme is optional
    if (step === 3) return !!selectedDay;
    if (step === 4) return !!selectedTime;
    if (step === 5) return form.fullName && form.email && form.mainConcern;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitted(true);

    const selectedServiceData = services.find(s => s.id === selectedService);
    if (!selectedServiceData || !selectedDay || !selectedTime) return;

    const totalPrice = getTotalPrice();
    const { discount, finalPrice } = calculateDiscount(totalPrice);

    const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return;

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const isPM = timeMatch[3].toUpperCase() === 'PM';
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    const scheduledAt = new Date(calYear, calMonth, selectedDay, hours, minutes);

    try {
      let bookingType: 'initial' | 'follow-up' | 'programme' = 'initial';
      if (selectedProgramme) {
        bookingType = 'programme';
      } else if (selectedServiceData) {
        const titleLower = selectedServiceData.title.toLowerCase();
        if (titleLower.includes('follow')) {
          bookingType = 'follow-up';
        } else {
          bookingType = 'initial';
        }
      }

      const bookingData = {
        client_name: form.fullName,
        client_email: form.email,
        client_phone: form.phone || null,
        booking_type: bookingType,
        service_id: selectedService,
        programme_id: selectedProgramme,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: selectedServiceData.duration_minutes,
        status: 'pending',
        notes: form.notes || null,
        consultation_type: selectedType,
        discount_code: appliedDiscount?.code || null,
        discount_amount: Math.round(discount),
        original_price: totalPrice,
        final_price: Math.round(finalPrice),
        main_concern: form.mainConcern,
        symptoms: form.symptoms || null,
        medications: form.medications || null,
      };

      const { error } = await supabase.from('bookings').insert(bookingData);

      if (error) {
        console.error('Booking error:', error);
        setSubmitError('Failed to submit booking. Please try again.');
        setSubmitted(false);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitError('An error occurred. Please try again.');
      setSubmitted(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedProgrammeData = selectedProgramme ? programmes.find(p => p.id === selectedProgramme) : null;

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center" style={{ background: '#FAF8F3' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-sage-dark mx-auto mb-4" />
          <p className="font-montserrat text-sm text-text-body">Loading available services...</p>
        </div>
      </div>
    );
  }

  // No services available
  if (!loading && services.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-lg w-full text-center">
          <Calendar className="w-16 h-16 text-sage mx-auto mb-6 opacity-30" />
          <h1 className="font-playfair text-2xl font-bold text-text-heading mb-3">No Services Available</h1>
          <p className="font-montserrat text-sm text-text-body mb-6">
            Booking is currently unavailable. Please check back soon or contact us directly.
          </p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    const totalPrice = getTotalPrice();
    const { discount, finalPrice } = calculateDiscount(totalPrice);

    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6" style={{ background: '#FAF8F3' }}>
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={38} className="text-sage" />
          </div>
          <h1 className="font-playfair text-3xl font-medium text-text-primary mb-4">Booking Request Submitted!</h1>
          <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-3">
            Thank you, <strong>{form.fullName}</strong>. Your booking request has been received.
          </p>
          <p className="font-montserrat text-sm text-text-secondary leading-relaxed mb-8">
            Teagan's team will confirm your appointment via email within 24 hours. Please check {form.email} for your confirmation.
          </p>
          <div className="bg-white rounded-2xl p-7 shadow-card text-left mb-8">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-light mb-4">Booking Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-montserrat text-xs text-text-light">Consultation Type</span>
                <span className="font-montserrat text-sm font-medium text-text-primary">{selectedServiceData?.title}</span>
              </div>
              {selectedProgrammeData && (
                <div className="flex justify-between">
                  <span className="font-montserrat text-xs text-text-light">Programme</span>
                  <span className="font-montserrat text-sm font-medium text-text-primary">{selectedProgrammeData.title}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-montserrat text-xs text-text-light">Date</span>
                <span className="font-montserrat text-sm font-medium text-text-primary">{selectedDay} {MONTHS[calMonth]} {calYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-montserrat text-xs text-text-light">Time</span>
                <span className="font-montserrat text-sm font-medium text-text-primary">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-montserrat text-xs text-text-light">Format</span>
                <span className="font-montserrat text-sm font-medium text-text-primary">
                  {selectedType === 'online' ? 'Online Consultation' : selectedType === 'in_person' ? 'In-Person' : 'Hybrid'}
                </span>
              </div>
              <div className="border-t border-sage/15 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-montserrat text-xs text-text-light">Total Amount</span>
                  <span className="font-playfair text-lg font-bold text-sage-dark">{formatPrice(finalPrice)}</span>
                </div>
                {appliedDiscount && discount > 0 && (
                  <div className="flex justify-between mt-2">
                    <span className="font-montserrat text-xs text-sage-dark flex items-center gap-1">
                      <Tag size={12} />
                      Discount Applied
                    </span>
                    <span className="font-montserrat text-xs font-medium text-sage-dark">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen" style={{ background: '#FAF8F3' }}>
      {/* Header */}
      <section className="py-12 px-6 text-center">
        <p className="section-tag">Book a Consultation</p>
        <h1 className="section-title mb-3">
          Begin Your Healing<br />
          <em className="not-italic text-sage">Journey</em>
        </h1>
      </section>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i + 1 <= step ? 'bg-sage' : 'bg-sage/20'
                  }`}
                />
              </div>
            ))}
          </div>
          <p className="font-montserrat text-xs text-text-light mt-3 text-center">
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card overflow-hidden">
            {/* Step 1: Choose Consultation Type */}
            {step === 1 && (
              <ScrollReveal>
                <div className="p-9">
                  <h2 className="font-playfair text-2xl font-bold text-text-heading mb-2">Choose Consultation Type</h2>
                  <p className="font-montserrat text-sm text-text-body mb-8">Select how you'd like to work with Teagan. Each consultation includes personalised nutrition guidance.</p>
                  <div className="space-y-4">
                    {services.map((service) => {
                      const price = service.price_pence;
                      const isSelected = selectedService === service.id;

                      return (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
                            isSelected
                              ? 'border-sage-dark bg-sage/5'
                              : 'border-sage/30 hover:border-sage-dark'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-playfair text-lg font-bold text-text-heading">{service.title}</h3>
                                {service.is_featured && (
                                  <span
                                    className="px-2 py-0.5 rounded-full font-montserrat text-[10px] font-bold text-text-heading"
                                    style={{ background: service.tag_color || '#98A88B' }}
                                  >
                                    {service.tag || 'Recommended'}
                                  </span>
                                )}
                              </div>
                              {service.subtitle && (
                                <p className="font-montserrat text-xs text-sage-dark mb-1">{service.subtitle}</p>
                              )}
                              <p className="font-montserrat text-sm text-text-body mb-2">{service.description}</p>
                              <div className="flex items-center gap-4 flex-wrap">
                                <span className="flex items-center gap-1.5 font-montserrat text-xs text-text-body">
                                  <Clock size={12} /> {service.duration_minutes} min
                                </span>
                                <span className={`flex items-center gap-1.5 font-montserrat text-xs ${
                                  service.consultation_type === 'online' ? 'text-lilac-dark' :
                                  service.consultation_type === 'in_person' ? 'text-yellow-mellow-dark' :
                                  'text-sage-dark'
                                }`}>
                                  {service.consultation_type === 'online' && <Video size={12} />}
                                  {service.consultation_type === 'in_person' && <MapPin size={12} />}
                                  {service.consultation_type === 'hybrid' && <Users size={12} />}
                                  {service.consultation_type === 'online' ? 'Online' :
                                   service.consultation_type === 'in_person' ? 'In-Person' : 'Hybrid'}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-playfair text-xl font-bold text-sage-dark">{formatPrice(price)}</p>
                              {isSelected && (
                                <CheckCircle2 size={18} className="text-sage-dark ml-auto mt-2" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Step 2: Select Programme (Optional) */}
            {step === 2 && (
              <ScrollReveal>
                <div className="p-9">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-playfair text-2xl font-bold text-text-heading">Select Your Programme</h2>
                    <span className="px-3 py-1 rounded-full bg-sage/10 text-sage-dark font-montserrat text-xs font-bold">Optional</span>
                  </div>
                  <p className="font-montserrat text-sm text-text-body mb-8">Enhance your consultation with a structured wellness programme. You can also complete your booking without selecting a programme.</p>

                  <div className="space-y-4">
                    {programmes.map((programme) => {
                      const isSelected = selectedProgramme === programme.id;

                      return (
                        <button
                          key={programme.id}
                          onClick={() => setSelectedProgramme(isSelected ? null : programme.id)}
                          className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
                            isSelected
                              ? 'border-sage-dark bg-sage/5'
                              : 'border-sage/30 hover:border-sage-dark'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-playfair text-lg font-bold text-text-heading">{programme.title}</h3>
                                {programme.is_featured && programme.tag && (
                                  <span
                                    className="px-2 py-0.5 rounded-full font-montserrat text-[10px] font-bold text-text-heading"
                                    style={{ background: programme.tag_color || '#98A88B' }}
                                  >
                                    {programme.tag}
                                  </span>
                                )}
                              </div>
                              {programme.subtitle && (
                                <p className="font-montserrat text-xs text-sage-dark mb-1">{programme.subtitle}</p>
                              )}
                              <p className="font-montserrat text-sm text-text-body mb-2">{programme.description}</p>
                              <span className="flex items-center gap-1.5 font-montserrat text-xs text-text-body">
                                <Clock size={12} /> {programme.duration_weeks} weeks
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-playfair text-xl font-bold text-sage-dark">{formatPrice(programme.price_pence)}</p>
                              {isSelected && (
                                <CheckCircle2 size={18} className="text-sage-dark ml-auto mt-2" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Skip option */}
                  <button
                    onClick={() => setSelectedProgramme(null)}
                    className={`w-full mt-4 text-left rounded-2xl border-2 p-5 transition-all duration-300 ${
                      selectedProgramme === null
                        ? 'border-sage-dark bg-sage/5'
                        : 'border-sage/20 hover:border-sage/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center">
                        <X size={20} className="text-sage-dark" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair text-lg font-bold text-text-heading">No Programme</h3>
                        <p className="font-montserrat text-xs text-text-body">Continue with consultation only. You can always add a programme later.</p>
                      </div>
                      {selectedProgramme === null && (
                        <CheckCircle2 size={18} className="text-sage-dark flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Discount Code Section */}
                  <div className="mt-8 pt-6 border-t border-sage/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag size={14} className="text-sage-dark" />
                      <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body">
                        Have a Promo Code?
                      </span>
                    </div>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between bg-sage/10 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-sage-dark" />
                          <span className="font-montserrat text-sm font-medium text-text-heading">{appliedDiscount.code}</span>
                          <span className="font-montserrat text-xs text-sage-dark">
                            {appliedDiscount.discount_type === 'percentage'
                              ? `${appliedDiscount.discount_value}% off`
                              : `${formatPrice(appliedDiscount.discount_value * 100)} off`
                            }
                          </span>
                        </div>
                        <button
                          onClick={() => { setAppliedDiscount(null); setDiscountCode(''); }}
                          className="p-1 hover:bg-sage/20 rounded-full transition-colors"
                        >
                          <X size={16} className="text-text-small" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => { setDiscountCode(e.target.value.toUpperCase()); setDiscountError(''); }}
                          placeholder="Enter promo code"
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-sage/30 font-montserrat text-sm uppercase tracking-wider focus:border-sage-dark focus:outline-none"
                        />
                        <button
                          onClick={validateDiscountCode}
                          disabled={!discountCode.trim() || validatingDiscount}
                          className="px-5 py-3 rounded-xl bg-sage-dark text-white font-montserrat text-sm font-bold hover:bg-sage-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {validatingDiscount ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                    )}
                    {discountError && (
                      <p className="text-xs text-red-500 font-montserrat mt-2">{discountError}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Step 3: Choose Date */}
            {step === 3 && (
              <ScrollReveal>
                <div className="p-9">
                  <h2 className="font-playfair text-2xl font-bold text-text-heading mb-2">Select a Date</h2>
                  <p className="font-montserrat text-sm text-text-body mb-8">
                    Choose your preferred appointment date. Only available working days are selectable.
                  </p>

                  {/* Calendar */}
                  <div className="rounded-2xl p-6" style={{ background: '#FAF8F3' }}>
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <button onClick={prevMonth} className="w-9 h-9 rounded-full border-2 border-sage-dark flex items-center justify-center hover:bg-sage/10 transition-colors">
                        <ChevronLeft size={16} className="text-sage-dark" />
                      </button>
                      <h3 className="font-playfair text-lg font-bold text-text-heading">
                        {MONTHS[calMonth]} {calYear}
                      </h3>
                      <button onClick={nextMonth} className="w-9 h-9 rounded-full border-2 border-sage-dark flex items-center justify-center hover:bg-sage/10 transition-colors">
                        <ChevronRight size={16} className="text-sage-dark" />
                      </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {DAYS.map((d) => (
                        <div key={d} className="text-center font-montserrat text-xs font-bold text-text-body py-1">{d}</div>
                      ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const past = isPastDay(day);
                        const notWorkingDay = !isWorkingDay(day);
                        const blocked = isBlockedDate(day);
                        const disabled = past || notWorkingDay || blocked;
                        const selected = selectedDay === day;
                        return (
                          <button
                            key={day}
                            disabled={disabled}
                            onClick={() => setSelectedDay(day)}
                            className={`aspect-square flex items-center justify-center rounded-full font-montserrat text-sm transition-all duration-200 ${
                              selected
                                ? 'bg-sage-dark text-white font-bold'
                                : disabled
                                ? 'text-text-small cursor-not-allowed opacity-40'
                                : 'text-text-heading hover:bg-sage/15 font-medium'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDay && (
                    <p className="font-montserrat text-sm text-sage-dark mt-4 flex items-center gap-2 font-medium">
                      <Calendar size={14} />
                      {selectedDay} {MONTHS[calMonth]} {calYear} selected
                    </p>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Step 4: Choose Time */}
            {step === 4 && (
              <ScrollReveal>
                <div className="p-9">
                  <h2 className="font-playfair text-2xl font-bold text-text-heading mb-2">Select a Time</h2>
                  <p className="font-montserrat text-sm text-text-body mb-2">
                    Available times for {selectedDay} {MONTHS[calMonth]} {calYear} (GMT/BST)
                  </p>
                  <p className="font-montserrat text-xs text-text-small mb-8">
                    All times are in UK time. Already booked slots are not shown.
                  </p>
                  {availableTimes.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-sage mx-auto mb-4 opacity-30" />
                      <p className="font-montserrat text-sm text-text-body">
                        No available times for this date. Please select another day.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3.5 rounded-2xl border-2 font-montserrat text-sm font-medium transition-all duration-300 ${
                            selectedTime === time
                              ? 'border-sage-dark bg-sage-dark text-white'
                              : 'border-sage/30 text-text-body hover:border-sage-dark hover:bg-sage/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Step 5: Health Questionnaire */}
            {step === 5 && (
              <ScrollReveal>
                <div className="p-9">
                  <h2 className="font-playfair text-2xl font-bold text-text-heading mb-2">Health Questionnaire</h2>
                  <p className="font-montserrat text-sm text-text-body mb-8">
                    Help Teagan prepare for your consultation. Fields marked * are required.
                  </p>
                  <form className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body block mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder="Your full name"
                          className="w-full px-4 py-3.5 rounded-2xl border-2 border-sage/30 bg-cream-DEFAULT font-montserrat text-sm focus:border-sage-dark focus:outline-none transition"
                          style={{ background: '#FAF8F3' }}
                        />
                      </div>
                      <div>
                        <label className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body block mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="hello@example.com"
                          className="w-full px-4 py-3.5 rounded-2xl border-2 border-sage/30 bg-cream-DEFAULT font-montserrat text-sm focus:border-sage-dark focus:outline-none transition"
                          style={{ background: '#FAF8F3' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body block mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+44 7XXX XXXXXX"
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-sage/30 bg-cream-DEFAULT font-montserrat text-sm focus:border-sage-dark focus:outline-none transition text-left"
                        dir="ltr"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body block mb-2">Main Health Concern *</label>
                      <input
                        type="text"
                        required
                        value={form.mainConcern}
                        onChange={(e) => setForm({ ...form, mainConcern: e.target.value })}
                        placeholder="e.g. PCOS, bloating, hormonal acne..."
                        className="w-full px-4 py-3.5 rounded-2xl border-2 border-sage/30 bg-cream-DEFAULT font-montserrat text-sm focus:border-sage-dark focus:outline-none transition"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>
                    <div>
                      <label className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-body block mb-2">Additional Notes</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Anything else you'd like Teagan to know before your consultation..."
                        rows={3}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-sage/30 bg-cream-DEFAULT font-montserrat text-sm focus:border-sage-dark focus:outline-none transition resize-none"
                        style={{ background: '#FAF8F3' }}
                      />
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* Step 6: Confirm & Submit */}
            {step === 6 && (
              <ScrollReveal>
                <div className="p-9">
                  <h2 className="font-playfair text-2xl font-bold text-text-heading mb-2">Review & Confirm</h2>
                  <p className="font-montserrat text-sm text-text-body mb-8">Please review your booking details before submitting.</p>

                  <div className="rounded-2xl p-7 mb-8 space-y-4" style={{ background: '#FAF8F3' }}>
                    <h4 className="font-montserrat text-xs font-bold uppercase tracking-wider text-text-light mb-3">Booking Summary</h4>

                    {/* Consultation Type */}
                    <div className="flex justify-between gap-4">
                      <span className="font-montserrat text-xs text-text-light flex-shrink-0">Consultation Type</span>
                      <span className="font-montserrat text-sm font-medium text-text-primary text-right">{selectedServiceData?.title}</span>
                    </div>

                    {/* Programme (if selected) */}
                    {selectedProgrammeData && (
                      <div className="flex justify-between gap-4">
                        <span className="font-montserrat text-xs text-text-light flex-shrink-0">Programme</span>
                        <span className="font-montserrat text-sm font-medium text-text-primary text-right">{selectedProgrammeData.title}</span>
                      </div>
                    )}

                    {[
                      { label: 'Date', value: `${selectedDay} ${MONTHS[calMonth]} ${calYear}` },
                      { label: 'Time', value: selectedTime + ' GMT/BST' },
                      { label: 'Format', value: selectedType === 'online' ? 'Online (Telehealth)' : selectedType === 'in_person' ? 'In-Person' : 'Hybrid' },
                      { label: 'Name', value: form.fullName },
                      { label: 'Email', value: form.email },
                      { label: 'Main Concern', value: form.mainConcern },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between gap-4">
                        <span className="font-montserrat text-xs text-text-light flex-shrink-0">{item.label}</span>
                        <span className="font-montserrat text-sm font-medium text text-primary text-right">{item.value}</span>
                      </div>
                    ))}

                    <div className="border-t border-sage/15 pt-4 mt-4">
                      {/* Consultation Price */}
                      <div className="flex justify-between gap-4">
                        <span className="font-montserrat text-xs text-text-light">{selectedServiceData?.title}</span>
                        <span className="font-montserrat text-sm text-text-secondary">{formatPrice(getServicePrice())}</span>
                      </div>

                      {/* Programme Price (if selected) */}
                      {selectedProgrammeData && (
                        <div className="flex justify-between gap-4 mt-2">
                          <span className="font-montserrat text-xs text-text-light">{selectedProgrammeData.title}</span>
                          <span className="font-montserrat text-sm text-text-secondary">{formatPrice(getProgrammePrice())}</span>
                        </div>
                      )}

                      {/* Subtotal */}
                      <div className="flex justify-between gap-4 mt-2 pt-2">
                        <span className="font-montserrat text-xs text-text-light">Subtotal</span>
                        <span className="font-montserrat text-sm text-text-secondary">{formatPrice(getTotalPrice())}</span>
                      </div>

                      {/* Discount */}
                      {appliedDiscount && (
                        <div className="flex justify-between gap-4 mt-2">
                          <span className="font-montserrat text-xs text-sage-dark flex items-center gap-1">
                            <Tag size={12} />
                            Discount ({appliedDiscount.code})
                          </span>
                          <span className="font-montserrat text-sm font-medium text-sage-dark">
                            -{formatPrice(calculateDiscount(getTotalPrice()).discount)}
                          </span>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex justify-between gap-4 mt-3 pt-3 border-t border-sage/15">
                        <span className="font-montserrat text-sm font-bold text-text-heading">Total</span>
                        <span className="font-playfair text-xl font-bold text-sage-dark">
                          {formatPrice(calculateDiscount(getTotalPrice()).finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-sage/8 border-2 border-sage/20 rounded-2xl p-5 mb-8">
                    <p className="font-montserrat text-xs text-text-body leading-relaxed">
                      By submitting this booking request, you agree that your information will be used to facilitate your consultation with Teagan. You will receive a confirmation email within 24 hours. Payment will be collected prior to your appointment.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <button type="submit" className="btn-primary w-full justify-center text-base py-4">
                      Confirm Booking Request
                      <CheckCircle2 size={18} />
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* Navigation */}
            <div className="px-9 py-6 border-t border-sage/10 flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className={`flex items-center gap-2 font-montserrat text-sm font-bold transition-all duration-300 ${
                  step === 1 ? 'text-text-light cursor-not-allowed' : 'text-text-body hover:text-sage'
                }`}
              >
                <ChevronLeft size={16} /> Back
              </button>
              <span className="font-montserrat text-xs text-text-light">
                {step} / {totalSteps}
              </span>
              {step < totalSteps ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 font-montserrat text-sm font-bold transition-all duration-300 ${
                    canProceed() ? 'text-sage hover:text-sage-dark' : 'text-text-light cursor-not-allowed'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
