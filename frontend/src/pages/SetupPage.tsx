import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SetupPageProps {
  isActive?: boolean;
}

interface CustomService {
  id: string;
  name: string;
}

interface FormData {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  businessSize: string;
  serviceArea: string;
  services: string[];
  customServices: CustomService[];
}

interface FormErrors {
  businessName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  serviceArea?: string;
  services?: string;
}

const SetupPage: React.FC<SetupPageProps> = ({ isActive }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    fullName: '',
    email: '',
    phone: '',
    businessSize: '',
    serviceArea: '',
    services: ['towing', 'tire-change', 'jump-start'], // Default checked services
    customServices: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomService, setNewCustomService] = useState('');
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingServiceName, setEditingServiceName] = useState('');

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
          serviceArea: parsed.serviceArea || '',
          customServices: parsed.customServices || []
        }));
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
      serviceArea: formData.serviceArea,
      customServices: formData.customServices
    };
    localStorage.setItem('roadai_setup', JSON.stringify(saveData));
  }, [formData.businessName, formData.fullName, formData.email, formData.phone, formData.serviceArea, formData.customServices]);

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

  // Handle checkbox change for services
  const handleServiceChange = (service: string) => {
    setFormData(prev => {
      const services = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      
      return {
        ...prev,
        services
      };
    });

    // Clear services error
    if (errors.services) {
      setErrors(prev => ({
        ...prev,
        services: undefined
      }));
    }
  };

  // Add custom service
  const handleAddCustomService = () => {
    if (!newCustomService.trim()) {
      toast.error('Please enter a service name');
      return;
    }

    // Check if service already exists
    const exists = formData.customServices.some(
      s => s.name.toLowerCase() === newCustomService.trim().toLowerCase()
    );
    
    if (exists) {
      toast.error('This service already exists');
      return;
    }

    const newService: CustomService = {
      id: Date.now().toString(),
      name: newCustomService.trim()
    };

    setFormData(prev => ({
      ...prev,
      customServices: [...prev.customServices, newService]
    }));

    setNewCustomService('');
    toast.success('Custom service added');
  };

  // Start editing custom service
  const handleStartEdit = (service: CustomService) => {
    setEditingServiceId(service.id);
    setEditingServiceName(service.name);
  };

  // Save edited custom service
  const handleSaveEdit = () => {
    if (!editingServiceName.trim()) {
      toast.error('Service name cannot be empty');
      return;
    }

    // Check if service name already exists (excluding current one)
    const exists = formData.customServices.some(
      s => s.id !== editingServiceId && s.name.toLowerCase() === editingServiceName.trim().toLowerCase()
    );
    
    if (exists) {
      toast.error('This service already exists');
      return;
    }

    setFormData(prev => ({
      ...prev,
      customServices: prev.customServices.map(s =>
        s.id === editingServiceId ? { ...s, name: editingServiceName.trim() } : s
      )
    }));

    setEditingServiceId(null);
    setEditingServiceName('');
    toast.success('Service updated');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditingServiceName('');
  };

  // Delete custom service
  const handleDeleteCustomService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customServices: prev.customServices.filter(s => s.id !== id)
    }));
    toast.success('Service deleted');
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

    if (formData.services.length === 0 && formData.customServices.length === 0) {
      newErrors.services = 'Please select at least one service or add a custom service';
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
      // const response = await api.post('/api/setup/business-details', formData);
      
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Business details saved successfully!');
      
      // Navigate to next step or dashboard
      // navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to save business details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    { value: 'towing', label: 'Towing' },
    { value: 'tire-change', label: 'Tire Change' },
    { value: 'jump-start', label: 'Jump Start' },
    { value: 'fuel-delivery', label: 'Fuel Delivery' },
    { value: 'lockout', label: 'Lockout Service' },
    { value: 'winch-out', label: 'Winch Out' }
  ];

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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Tell us about your business
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This helps us customize your AI agent to represent your roadside assistance company professionally
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Business Name */}
            <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Services Offered */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Services Offered <span className="text-red-500">*</span>
              </label>
              
              {/* Predefined Services */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {serviceOptions.map((service) => (
                  <label
                    key={service.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service.value)
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                        : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.value)}
                      onChange={() => handleServiceChange(service.value)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 focus:ring-2 cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${
                      formData.services.includes(service.value) ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                      {service.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Custom Services Section */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Custom Services
                </label>
                
                {/* Add Custom Service Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newCustomService}
                    onChange={(e) => setNewCustomService(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomService();
                      }
                    }}
                    placeholder="Enter custom service name"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white hover:border-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                </div>

                {/* Custom Services List */}
                {formData.customServices.length > 0 && (
                  <div className="space-y-2">
                    {formData.customServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-3 p-4 border-2 border-indigo-600 bg-indigo-50 rounded-lg"
                      >
                        {editingServiceId === service.id ? (
                          <>
                            <input
                              type="text"
                              value={editingServiceName}
                              onChange={(e) => setEditingServiceName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEdit();
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit();
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-indigo-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-indigo-900">{service.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(service)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomService(service.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.services && (
                <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.services}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
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
    </div>
  );
};

export default SetupPage;

