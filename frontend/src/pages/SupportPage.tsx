import React, { useState } from 'react';

const SupportPage = ({ isActive }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const supportOptions = [
    {
      icon: '💬',
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      meta: 'Usually responds in 2 minutes',
      featured: true
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us a detailed message and we\'ll get back to you',
      meta: 'Response within 24 hours'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with our technical team',
      meta: 'Available 9 AM - 6 PM IST'
    }
  ];

  const resources = [
    {
      icon: '📚',
      title: 'Documentation',
      description: 'Complete setup guides and API references'
    },
    {
      icon: '🎥',
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features'
    },
    {
      icon: '💡',
      title: 'Best Practices',
      description: 'Tips and tricks to get the most out of RoadAI'
    }
  ];

  const faqs = [
    {
      question: 'How do I set up call forwarding?',
      answer: 'To set up call forwarding, go to Settings > Phone Configuration and follow the step-by-step guide. You\'ll need to configure your phone system to forward calls to our provided number. We support most major phone systems and can help with specific configurations.'
    },
    {
      question: 'Can I customize the AI agent\'s responses?',
      answer: 'Yes! You can customize responses in the AI Settings page. You can modify greeting messages, fallback responses, and even create custom responses for specific scenarios. The AI learns from your preferences over time.'
    },
    {
      question: 'How does billing work?',
      answer: 'We charge based on the number of calls handled by your AI agent. You can view detailed billing information in the Invoicing section. We offer flexible plans starting from a free tier with limited calls.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption for all data transmission and storage. Your call recordings and customer data are encrypted and stored securely. We are SOC 2 compliant and follow industry best practices for data security.'
    },
    {
      question: 'Can I integrate with my existing CRM?',
      answer: 'Yes, we offer integrations with popular CRM systems like Salesforce, HubSpot, and Zoho. You can also use our API to build custom integrations. Check our documentation for specific integration guides.'
    },
    {
      question: 'What languages are supported?',
      answer: 'We currently support English, Hindi, Bengali, Tamil, and Telugu. We\'re constantly adding more languages based on customer demand. You can request additional languages through our support team.'
    }
  ];

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Help & Support</h1>
          <p>Get help, find answers, and connect with our support team</p>
        </div>
      </div>

      <div className="support-grid">
        {supportOptions.map((option, index) => (
          <div 
            key={index} 
            className={`support-card ${option.featured ? 'featured' : ''}`}
            onClick={() => handleActionClick(option.title)}
          >
            <div className="support-icon">{option.icon}</div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <span className="support-meta">{option.meta}</span>
          </div>
        ))}
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <h3>{faq.question}</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="resources-section">
        <h2>Resources & Documentation</h2>
        <div className="resources-grid">
          {resources.map((resource, index) => (
            <button 
              key={index} 
              className="resource-card"
              onClick={() => handleActionClick(resource.title)}
            >
              <div className="resource-icon">{resource.icon}</div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="contact-cta">
        <h2>Still need help?</h2>
        <p>Our support team is here to help you succeed with RoadAI</p>
        <button 
          className="btn btn-primary"
          onClick={() => handleActionClick('Contact Support')}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default SupportPage;
