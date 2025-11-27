import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface SetupPageProps {
  isActive?: boolean;
}

interface FormData {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  businessSize: string;
  serviceArea: string;
}

interface FormErrors {
  businessName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  serviceArea?: string;
}

interface PricingService {
  id: string;
  serviceName: string;
  dayPrice: string;
  nightPrice: string;
}

interface VehicleType {
  id: string;
  vehicleType: string;
  services: PricingService[];
  kmRate: string;
}

const SetupPage: React.FC<SetupPageProps> = ({ isActive }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    businessSize: '',
    serviceArea: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing setup state
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editingVehicleType, setEditingVehicleType] = useState('');
  
  // Service input states (local to each vehicle)
  const [serviceInputs, setServiceInputs] = useState<Record<string, { serviceName: string; dayPrice: string; nightPrice: string }>>({});
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceData, setEditServiceData] = useState<{ serviceName: string; dayPrice: string; nightPrice: string }>({
    serviceName: '',
    dayPrice: '',
    nightPrice: ''
  });
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('roadai_setup');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          businessName: parsed.businessName || '',
          fullName: parsed.fullName || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          businessSize: parsed.businessSize || '',
          serviceArea: parsed.serviceArea || ''
        }));
        if (parsed.vehicleTypes) {
          setVehicleTypes(parsed.vehicleTypes);
        }
        if (parsed.startTime) setStartTime(parsed.startTime);
        if (parsed.endTime) setEndTime(parsed.endTime);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage when form data changes
  useEffect(() => {
    const saveData = {
      businessName: formData.businessName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      businessSize: formData.businessSize,
      serviceArea: formData.serviceArea,
      vehicleTypes: vehicleTypes,
      startTime: startTime,
      endTime: endTime
    };
    localStorage.setItem('roadai_setup', JSON.stringify(saveData));
  }, [formData.businessName, formData.fullName, formData.email, formData.phone, formData.businessSize, formData.serviceArea, vehicleTypes, startTime, endTime]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.serviceArea.trim()) {
      newErrors.serviceArea = 'Primary service area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send data to your backend API
      // const response = await api.post('/api/setup/business-details', { formData, vehicleTypes, startTime, endTime });
      
      console.log('Form submitted:', { formData, vehicleTypes, startTime, endTime });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Business details and pricing saved successfully!');
      
      // Navigate to next step or dashboard
      // navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== PRICING SETUP FUNCTIONS ==========

  // Add new vehicle type
  const handleAddVehicle = () => {
    const newVehicle: VehicleType = {
      id: Date.now().toString(),
      vehicleType: '',
      services: [],
      kmRate: ''
    };
    setVehicleTypes(prev => [...prev, newVehicle]);
    setEditingVehicleId(newVehicle.id);
    setEditingVehicleType('');
    setServiceInputs(prev => ({ ...prev, [newVehicle.id]: { serviceName: '', dayPrice: '', nightPrice: '' } }));
  };

  // Start editing vehicle type
  const handleStartEditVehicle = (vehicle: VehicleType) => {
    setEditingVehicleId(vehicle.id);
    setEditingVehicleType(vehicle.vehicleType);
  };

  // Save vehicle type edit
  const handleSaveVehicleEdit = () => {
    if (!editingVehicleType.trim()) {
      toast.error('Please enter vehicle type');
      return;
    }

    setVehicleTypes(prev =>
      prev.map(v =>
        v.id === editingVehicleId
          ? { ...v, vehicleType: editingVehicleType.trim() }
          : v
      )
    );

    setEditingVehicleId(null);
    setEditingVehicleType('');
    toast.success('Vehicle type updated');
  };

  // Cancel vehicle edit
  const handleCancelVehicleEdit = () => {
    setEditingVehicleId(null);
    setEditingVehicleType('');
  };

  // Delete vehicle type
  const handleDeleteVehicle = (id: string) => {
    setVehicleTypes(prev => prev.filter(v => v.id !== id));
    setServiceInputs(prev => {
      const newInputs = { ...prev };
      delete newInputs[id];
      return newInputs;
    });
    toast.success('Vehicle type deleted');
  };

  // Handle service input change
  const handleServiceInputChange = (vehicleId: string, field: string, value: string) => {
    setServiceInputs(prev => ({
      ...prev,
      [vehicleId]: {
        ...prev[vehicleId],
        [field]: value
      }
    }));
  };

  // Add service to vehicle
  const handleAddService = (vehicleId: string) => {
    const inputs = serviceInputs[vehicleId] || { serviceName: '', dayPrice: '', nightPrice: '' };

    if (!inputs.serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    if (!inputs.dayPrice.trim()) {
      toast.error('Please enter day price');
      return;
    }

    if (!inputs.nightPrice.trim()) {
      toast.error('Please enter night price');
      return;
    }

    const dayPriceNum = parseFloat(inputs.dayPrice.replace(/[₹,]/g, ''));
    const nightPriceNum = parseFloat(inputs.nightPrice.replace(/[₹,]/g, ''));

    if (isNaN(dayPriceNum) || dayPriceNum < 0) {
      toast.error('Please enter a valid day price');
      return;
    }

    if (isNaN(nightPriceNum) || nightPriceNum < 0) {
      toast.error('Please enter a valid night price');
      return;
    }

    const newService: PricingService = {
      id: Date.now().toString(),
      serviceName: inputs.serviceName.trim(),
      dayPrice: dayPriceNum.toString(),
      nightPrice: nightPriceNum.toString()
    };

    setVehicleTypes(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, services: [...v.services, newService] }
          : v
      )
    );

    setServiceInputs(prev => ({
      ...prev,
      [vehicleId]: { serviceName: '', dayPrice: '', nightPrice: '' }
    }));

    toast.success('Service added successfully');
  };

  // Start editing service
  const handleStartEditService = (service: PricingService) => {
    setEditingServiceId(service.id);
    setEditServiceData({
      serviceName: service.serviceName,
      dayPrice: service.dayPrice,
      nightPrice: service.nightPrice
    });
  };

  // Save service edit
  const handleSaveServiceEdit = () => {
    if (!editServiceData.serviceName.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    if (!editServiceData.dayPrice.trim()) {
      toast.error('Please enter day price');
      return;
    }

    if (!editServiceData.nightPrice.trim()) {
      toast.error('Please enter night price');
      return;
    }

    const dayPriceNum = parseFloat(editServiceData.dayPrice.replace(/[₹,]/g, ''));
    const nightPriceNum = parseFloat(editServiceData.nightPrice.replace(/[₹,]/g, ''));

    if (isNaN(dayPriceNum) || dayPriceNum < 0) {
      toast.error('Please enter a valid day price');
      return;
    }

    if (isNaN(nightPriceNum) || nightPriceNum < 0) {
      toast.error('Please enter a valid night price');
      return;
    }

    setVehicleTypes(prev =>
      prev.map(v => ({
        ...v,
        services: v.services.map(s =>
          s.id === editingServiceId
            ? {
                ...s,
                serviceName: editServiceData.serviceName.trim(),
                dayPrice: dayPriceNum.toString(),
                nightPrice: nightPriceNum.toString()
              }
            : s
        )
      }))
    );

    setEditingServiceId(null);
    setEditServiceData({ serviceName: '', dayPrice: '', nightPrice: '' });
    toast.success('Service updated successfully');
  };

  // Cancel service edit
  const handleCancelServiceEdit = () => {
    setEditingServiceId(null);
    setEditServiceData({ serviceName: '', dayPrice: '', nightPrice: '' });
  };

  // Delete service
  const handleDeleteService = (vehicleId: string, serviceId: string) => {
    setVehicleTypes(prev =>
      prev.map(v =>
        v.id === vehicleId
          ? { ...v, services: v.services.filter(s => s.id !== serviceId) }
          : v
      )
    );
    toast.success('Service deleted successfully');
  };

  // Update KM rate for vehicle
  const handleKmRateChange = (vehicleId: string, value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;

    setVehicleTypes(prev =>
      prev.map(v =>
        v.id === vehicleId ? { ...v, kmRate: formatted } : v
      )
    );
  };

  // Format price for display
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Handle price input change
  const handlePriceChange = (value: string, setter: (val: string) => void) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
    setter(formatted);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 ${isActive ? 'active' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#FFFFFF" opacity="0.2"/>
                  <path d="M20 10L26 16L20 22L14 16L20 10Z" fill="#FFFFFF"/>
                  <circle cx="20" cy="20" r="4" fill="#FFFFFF"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">RoadAI Assistant</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">
                Need help? <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">Contact Support</a>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Tell us about your business
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This helps us customize your AI agent to represent your roadside assistance company professionally
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Details Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Details</h2>
              
              {/* Business Name */}
              <div className="mb-6">
                <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g., QuickFix Roadside Assistance"
                  className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white ${
                    errors.businessName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {errors.businessName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.businessName}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  This is how your AI agent will introduce your company
                </p>
              </div>

              {/* Full Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@yourcompany.com"
                    className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone and Business Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="businessSize" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Size
                  </label>
                  <select
                    id="businessSize"
                    name="businessSize"
                    value={formData.businessSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all hover:border-gray-400 cursor-pointer"
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-20">6-20 employees</option>
                    <option value="21-50">21-50 employees</option>
                    <option value="51+">51+ employees</option>
                  </select>
                </div>
              </div>

              {/* Service Area */}
              <div>
                <label htmlFor="serviceArea" className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Service Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="serviceArea"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  placeholder="e.g., Mumbai, Maharashtra"
                  className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white ${
                    errors.serviceArea ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {errors.serviceArea && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.serviceArea}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  City or region where you primarily operate
                </p>
              </div>
            </div>

            {/* Pricing Setup Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Roadside Assistance Pricing Setup</h2>

              <div className="space-y-6">
                {/* Add New Vehicle Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Vehicle
                  </button>
                </div>

                {/* Vehicle Type Blocks */}
                {vehicleTypes.map((vehicle) => (
                  <div key={vehicle.id} className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    {/* Vehicle Type Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      {editingVehicleId === vehicle.id ? (
                        <div className="flex-1 flex items-center gap-3">
                          <input
                            type="text"
                            value={editingVehicleType}
                            onChange={(e) => setEditingVehicleType(e.target.value)}
                            placeholder="Enter vehicle type (e.g., Car, Bike)"
                            className="flex-1 px-4 py-2 border border-indigo-600 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveVehicleEdit}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelVehicleEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {vehicle.vehicleType || 'New Vehicle Type'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditVehicle(vehicle)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Vehicle Type"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Vehicle Type"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Add Service & Pricing Section */}
                    {vehicle.vehicleType && (
                      <>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Service & Pricing</h4>
                          
                          {/* Service Input Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Service Name
                              </label>
                              <input
                                type="text"
                                value={serviceInputs[vehicle.id]?.serviceName || ''}
                                onChange={(e) => handleServiceInputChange(vehicle.id, 'serviceName', e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddService(vehicle.id);
                                  }
                                }}
                                placeholder="Service name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Day Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">₹</span>
                                <input
                                  type="text"
                                  value={serviceInputs[vehicle.id]?.dayPrice || ''}
                                  onChange={(e) => handlePriceChange(e.target.value, (val) => handleServiceInputChange(vehicle.id, 'dayPrice', val))}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddService(vehicle.id);
                                    }
                                  }}
                                  placeholder="Day price (₹)"
                                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Night Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">₹</span>
                                <input
                                  type="text"
                                  value={serviceInputs[vehicle.id]?.nightPrice || ''}
                                  onChange={(e) => handlePriceChange(e.target.value, (val) => handleServiceInputChange(vehicle.id, 'nightPrice', val))}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddService(vehicle.id);
                                    }
                                  }}
                                  placeholder="Night price (₹)"
                                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddService(vehicle.id)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            Add Service
                          </button>
                        </div>

                        {/* Services List */}
                        {vehicle.services.length > 0 && (
                          <div className="space-y-3">
                            {vehicle.services.map((service) => (
                              <div
                                key={service.id}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-600 transition-all"
                              >
                                {editingServiceId === service.id ? (
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div>
                                      <input
                                        type="text"
                                        value={editServiceData.serviceName}
                                        onChange={(e) => setEditServiceData(prev => ({ ...prev, serviceName: e.target.value }))}
                                        className="w-full px-3 py-2 border border-indigo-600 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                                        placeholder="Service name"
                                      />
                                    </div>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">₹</span>
                                      <input
                                        type="text"
                                        value={editServiceData.dayPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, (val) => setEditServiceData(prev => ({ ...prev, dayPrice: val })))}
                                        className="w-full pl-8 pr-3 py-2 border border-indigo-600 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                                        placeholder="Day price"
                                      />
                                    </div>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">₹</span>
                                      <input
                                        type="text"
                                        value={editServiceData.nightPrice}
                                        onChange={(e) => handlePriceChange(e.target.value, (val) => setEditServiceData(prev => ({ ...prev, nightPrice: val })))}
                                        className="w-full pl-8 pr-3 py-2 border border-indigo-600 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                                        placeholder="Night price"
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={handleSaveServiceEdit}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Save"
                                      >
                                        <Save className="w-5 h-5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelServiceEdit}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Cancel"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                    <div>
                                      <span className="text-sm font-medium text-gray-900">{service.serviceName}</span>
                                    </div>
                                    <div>
                                      <span className="text-sm font-semibold text-gray-700">{formatPrice(service.dayPrice)}</span>
                                      <span className="text-xs text-gray-500 ml-2">(Day)</span>
                                    </div>
                                    <div>
                                      <span className="text-sm font-semibold text-gray-700">{formatPrice(service.nightPrice)}</span>
                                      <span className="text-xs text-gray-500 ml-2">(Night)</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleStartEditService(service)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-5 h-5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteService(vehicle.id, service.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {vehicle.services.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No services added yet. Add your first service above.</p>
                          </div>
                        )}

                        {/* Per KM Charges */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Per KM Charges</h4>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price per KM in ₹
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">₹</span>
                              <input
                                type="text"
                                value={vehicle.kmRate}
                                onChange={(e) => handleKmRateChange(vehicle.id, e.target.value)}
                                placeholder="Enter per km rate (₹)"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {!vehicle.vehicleType && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Click Edit to enter vehicle type</p>
                      </div>
                    )}
                  </div>
                ))}

                {vehicleTypes.length === 0 && (
                  <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <p className="text-gray-500 mb-4">No vehicle types added yet</p>
                    <p className="text-sm text-gray-400">Click "Add New Vehicle" to get started</p>
                  </div>
                )}

                {/* Business Hours Section - Always Visible */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        placeholder="Opening Time"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        placeholder="Closing Time"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save & Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
