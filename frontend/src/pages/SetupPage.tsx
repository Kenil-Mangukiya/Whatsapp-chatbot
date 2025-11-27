import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  services: string[];
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
    services: ['towing', 'tire-change', 'jump-start'] // Default checked services
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          serviceArea: parsed.serviceArea || ''
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
      serviceArea: formData.serviceArea
    };
    localStorage.setItem('roadai_setup', JSON.stringify(saveData));
  }, [formData.businessName, formData.fullName, formData.email, formData.phone, formData.serviceArea]);

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

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
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
    <div className={`min-h-screen bg-gray-50 ${isActive ? 'active' : ''}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 py-4">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#4F46E5" opacity="0.1"/>
                <path d="M20 10L26 16L20 22L14 16L20 10Z" fill="#4F46E5"/>
                <path d="M12 20C12 15.5817 15.5817 12 20 12V20H12Z" fill="#818CF8"/>
                <circle cx="20" cy="20" r="4" fill="#4F46E5"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">RoadAI Assistant</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">
                Need help? <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">Contact Support</a>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tell us about your business
            </h1>
            <p className="text-lg text-gray-600">
              This helps us customize your AI agent to represent your roadside assistance company professionally
            </p>
          </div>

          {/* Form */}
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
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
                  errors.businessName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
              <p className="mt-1 text-sm text-gray-600">
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
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
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
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                  className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
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
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors ${
                  errors.serviceArea ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.serviceArea && (
                <p className="mt-1 text-sm text-red-600">{errors.serviceArea}</p>
              )}
              <p className="mt-1 text-sm text-gray-600">
                City or region where you primarily operate
              </p>
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Services Offered <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.services.includes(service.value)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.value)}
                      onChange={() => handleServiceChange(service.value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600 cursor-pointer"
                    />
                    <span className="text-sm text-gray-900">{service.label}</span>
                  </label>
                ))}
              </div>
              {errors.services && (
                <p className="mt-1 text-sm text-red-600">{errors.services}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;

