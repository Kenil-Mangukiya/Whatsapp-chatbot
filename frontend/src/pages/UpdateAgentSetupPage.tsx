import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, ArrowLeft, SkipForward } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { saveAgentSetup, getAgentSetup, AgentSetupData } from '../services/apis/authAPI';
import api from '../config/api';

interface AgentSetupPageProps {
  isActive?: boolean;
}

interface FormData {
  agentName: string;
  agentVoice: 'male' | 'female' | '';
  agentLanguage: string;
  welcomeMessage: string;
  agentType: string;
  customerDetails: string;
  transferCall: string;
  endingMessage: string;
}

interface FormErrors {
  agentName?: string;
  agentVoice?: string;
  agentLanguage?: string;
  welcomeMessage?: string;
  agentType?: string;
  customerDetails?: string;
  transferCall?: string;
  endingMessage?: string;
}

const UpdateAgentSetupPage: React.FC<AgentSetupPageProps> = ({ isActive }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId: string | null = searchParams.get('userId');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<any>(null);
  
  const [formData, setFormData] = useState<FormData>({
    agentName: '',
    agentVoice: '',
    agentLanguage: '',
    welcomeMessage: '',
    agentType: '',
    customerDetails: '',
    transferCall: '',
    endingMessage: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [enableTransferCall, setEnableTransferCall] = useState(false);

  // Check if admin and load admin session
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response: any = await api.get('/user/me');
        const user = response?.data?.user || response?.user;
        const userRole = user?.role || 'user';
        setIsAdmin(userRole === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    // Check for admin session in localStorage
    const storedAdminSession = localStorage.getItem('adminSession');
    if (storedAdminSession) {
      try {
        const session = JSON.parse(storedAdminSession);
        setAdminSession(session);
      } catch (e) {
        console.error('Error parsing admin session:', e);
      }
    }

    checkAdmin();
  }, []);

  // Fetch existing agent setup data on component mount
  useEffect(() => {
    const fetchAgentSetup = async () => {
      try {
        setIsLoading(true);
        // If userId is provided and user is admin, fetch that user's agent setup
        const targetUserId = (userId && (isAdmin || adminSession)) ? parseInt(userId) : undefined;
        const response = await getAgentSetup(targetUserId);
        if (response.data) {
          const existingData = response.data;
          const hasTransferCall = !!(existingData.transferCall && existingData.transferCall.trim());
          setEnableTransferCall(hasTransferCall);
          setFormData({
            agentName: existingData.agentName || '',
            agentVoice: (existingData.agentVoice as 'male' | 'female' | '') || '',
            agentLanguage: existingData.agentLanguage || '',
            welcomeMessage: existingData.welcomeMessage || '',
            agentType: existingData.agentFlow || '',
            customerDetails: existingData.customerDetails || '',
            transferCall: existingData.transferCall || '',
            endingMessage: existingData.endingMessage || ''
          });
        }
      } catch (error: any) {
        console.error('Error fetching agent setup:', error);
        // If no agent setup exists, form will remain empty (which is fine)
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we've checked admin status (or if no userId is provided)
    if (!userId || isAdmin !== null || adminSession !== null) {
    fetchAgentSetup();
    }
  }, [userId, isAdmin, adminSession]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validate form (all fields are optional now)
  const validateForm = (): boolean => {
    // No validation needed - all fields are optional
    setErrors({});
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validateForm();

    setIsSubmitting(true);

    try {
      const agentSetupData: AgentSetupData = {
        agentName: formData.agentName || undefined,
        agentVoice: formData.agentVoice || undefined,
        agentLanguage: formData.agentLanguage || undefined,
        welcomeMessage: formData.welcomeMessage || undefined,
        agentFlow: formData.agentType || undefined,
        customerDetails: formData.customerDetails || undefined,
        transferCall: enableTransferCall ? (formData.transferCall || undefined) : undefined,
        endingMessage: formData.endingMessage || undefined
      };
      
      // If userId is provided and user is admin, save to that user's agent setup
      const targetUserId = (userId && (isAdmin || adminSession)) ? parseInt(userId) : undefined;
      await saveAgentSetup(agentSetupData, targetUserId);
      
      toast.success('Agent setup saved successfully!');
      
      // Navigate based on context
      if (userId && (isAdmin || adminSession)) {
        navigate('/admin');
      }
      // Otherwise stay on the same page to allow further edits
    } catch (error: any) {
      console.error('Error saving agent setup:', error);
      toast.error(error.message || 'Failed to save agent setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip
  const handleSkip = () => {
    if (userId && (isAdmin || adminSession)) {
      navigate('/admin');
    } else {
    navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="App">
        <Navbar />
        <div className="dashboard-container">
          <Sidebar activePage="update-agent-setup" />
          <main className="main-content">
            <div className={`page-content ${isActive ? 'active' : ''}`}>
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading agent setup...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar activePage="update-agent-setup" />
        <main className="main-content">
          <div className={`page-content ${isActive ? 'active' : ''}`}>
            <div className="pt-4 pb-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                  <button
                      onClick={() => {
                        if (userId && (isAdmin || adminSession)) {
                          navigate('/admin');
                        } else {
                          navigate(-1);
                        }
                      }}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={20} />
                      <span>{userId && (isAdmin || adminSession) ? 'Back to Admin' : 'Back'}</span>
                  </button>
                    {userId && (isAdmin || adminSession) && (
                      <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-md">
                        Admin View - User ID: {userId}
                      </div>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Agent Setup
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    Configure your AI voice agent settings and behavior
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Agent Details Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Details</h2>
                    
                    {/* Agent Name */}
                    <div className="mb-6">
                      <label htmlFor="agentName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        id="agentName"
                        name="agentName"
                        value={formData.agentName}
                        onChange={handleInputChange}
                        placeholder="एजेंट का नाम दर्ज करें (Enter agent name)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white ${
                          errors.agentName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.agentName && (
                        <p className="mt-2 text-sm text-red-600">{errors.agentName}</p>
                      )}
                    </div>

                    {/* Agent Voice */}
                    <div className="mb-6">
                      <label htmlFor="agentVoice" className="block text-sm font-semibold text-gray-700 mb-2">
                        Agent Voice
                      </label>
                      <select
                        id="agentVoice"
                        name="agentVoice"
                        value={formData.agentVoice}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white ${
                          errors.agentVoice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <option value="">आवाज़ चुनें (Select voice)</option>
                        <option value="male">पुरुष (Male)</option>
                        <option value="female">महिला (Female)</option>
                      </select>
                      {errors.agentVoice && (
                        <p className="mt-2 text-sm text-red-600">{errors.agentVoice}</p>
                      )}
                    </div>

                    {/* Agent Language */}
                    <div className="mb-6">
                      <label htmlFor="agentLanguage" className="block text-sm font-semibold text-gray-700 mb-2">
                        Agent Language
                      </label>
                      <input
                        type="text"
                        id="agentLanguage"
                        name="agentLanguage"
                        value={formData.agentLanguage}
                        onChange={handleInputChange}
                        placeholder="भाषा दर्ज करें जैसे: हिंदी, अंग्रेजी (Enter language e.g., Hindi, English)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white ${
                          errors.agentLanguage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.agentLanguage && (
                        <p className="mt-2 text-sm text-red-600">{errors.agentLanguage}</p>
                      )}
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-6">
                      <label htmlFor="welcomeMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                        Welcome Message
                      </label>
                      <textarea
                        id="welcomeMessage"
                        name="welcomeMessage"
                        value={formData.welcomeMessage}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="स्वागत संदेश दर्ज करें जो ग्राहक को कॉल शुरू होने पर सुनाई देगा (Enter welcome message that customer will hear when call starts)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white resize-none ${
                          errors.welcomeMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.welcomeMessage && (
                        <p className="mt-2 text-sm text-red-600">{errors.welcomeMessage}</p>
                      )}
                    </div>
                  </div>

                  {/* Agent Configuration Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Configuration</h2>
                    
                    {/* Agent Flow */}
                    <div className="mb-6">
                      <label htmlFor="agentType" className="block text-sm font-semibold text-gray-700 mb-2">
                        Agent Flow
                      </label>
                      <textarea
                        id="agentType"
                        name="agentType"
                        value={formData.agentType}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="एजेंट सबसे पहले अपना परिचय देगा, फिर ग्राहक से उसकी समस्या के बारे में पूछेगा, उसके बाद आवश्यक ग्राहक जानकारी (नाम, लोकेशन, व्हीकल डिटेल्स आदि) लेगा। जरूरत पड़ने पर एजेंट कॉल को मानव प्रतिनिधि के पास ट्रांसफर करेगा।
(The agent will first introduce itself, then ask the customer about their issue, and then collect the required customer information such as name, location, and vehicle details. If needed, the agent will transfer the call to a human representative.)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white resize-none ${
                          errors.agentType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.agentType && (
                        <p className="mt-2 text-sm text-red-600">{errors.agentType}</p>
                      )}
                    </div>

                    {/* Customer Details */}
                    <div className="mb-6">
                      <label htmlFor="customerDetails" className="block text-sm font-semibold text-gray-700 mb-2">
                        Details You Want from Customers
                      </label>
                      <textarea
                        id="customerDetails"
                        name="customerDetails"
                        value={formData.customerDetails}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="ग्राहक से कौन सी जानकारी चाहिए? उदाहरण: नाम, फोन नंबर, पता, समस्या का विवरण (What information do you need from customers? Example: Name, Phone number, Address, Problem description)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white resize-none ${
                          errors.customerDetails ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.customerDetails && (
                        <p className="mt-2 text-sm text-red-600">{errors.customerDetails}</p>
                      )}
                    </div>

                    {/* Transfer Call */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Transfer Call to You
                      </label>
                      <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={enableTransferCall}
                              onChange={(e) => {
                                setEnableTransferCall(e.target.checked);
                                if (!e.target.checked) {
                                  setFormData(prev => ({ ...prev, transferCall: '' }));
                                }
                              }}
                              className="sr-only"
                            />
                            <div className={`w-14 h-7 rounded-full transition-colors duration-200 flex items-center ${
                              enableTransferCall ? 'bg-red-600' : 'bg-gray-300'
                            }`}>
                              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                enableTransferCall ? 'translate-x-7' : 'translate-x-1'
                              }`}></div>
                            </div>
                          </div>
                          <span className="text-gray-700 font-medium">
                            {enableTransferCall ? 'Yes' : 'No'}
                          </span>
                        </label>
                      </div>
                      {enableTransferCall && (
                        <textarea
                          id="transferCall"
                          name="transferCall"
                          value={formData.transferCall}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="कब और कैसे कॉल आपको ट्रांसफर की जाएगी? उदाहरण: जटिल समस्या के मामले में, ग्राहक मानव एजेंट से बात करना चाहता है (When and how should calls be transferred to you? Example: In case of complex issues, customer wants to speak with human agent)"
                          className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white resize-none ${
                            errors.transferCall ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        />
                      )}
                      {errors.transferCall && (
                        <p className="mt-2 text-sm text-red-600">{errors.transferCall}</p>
                      )}
                    </div>

                    {/* Ending Message */}
                    <div className="mb-6">
                      <label htmlFor="endingMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                        Agent Ending Message
                      </label>
                      <textarea
                        id="endingMessage"
                        name="endingMessage"
                        value={formData.endingMessage}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="कॉल समाप्त होने पर ग्राहक को क्या संदेश देना है? उदाहरण: धन्यवाद, आपकी समस्या हल हो गई है (What message should customer hear when call ends? Example: Thank you, your issue has been resolved)"
                        className={`w-full px-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all bg-white resize-none ${
                          errors.endingMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                      {errors.endingMessage && (
                        <p className="mt-2 text-sm text-red-600">{errors.endingMessage}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <SkipForward size={20} />
                      Skip
                    </button>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Save Agent Setup
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateAgentSetupPage;

