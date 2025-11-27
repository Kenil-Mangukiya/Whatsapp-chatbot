// Step Navigation
let currentStep = 1;

function nextStep(step) {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
        return;
    }

    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');

    // Show next step
    currentStep = step;
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update review if going to step 5
    if (step === 5) {
        updateReview();
    }
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show previous step
    currentStep = step;
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToStep(step) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');

    // Show target step
    currentStep = step;
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validation
function validateStep(step) {
    switch(step) {
        case 1:
            const businessName = document.getElementById('businessName').value;
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const serviceArea = document.getElementById('serviceArea').value;

            if (!businessName || !fullName || !email || !phone || !serviceArea) {
                alert('Please fill in all required fields');
                return false;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }

            return true;

        case 2:
            const greeting = document.getElementById('greeting').value;
            if (!greeting) {
                alert('Please enter a greeting message');
                return false;
            }
            return true;

        case 3:
            const phoneOption = document.querySelector('input[name="phoneOption"]:checked').value;
            if (phoneOption === 'forward') {
                const existingPhone = document.getElementById('existingPhone').value;
                if (!existingPhone) {
                    alert('Please enter your business phone number');
                    return false;
                }
            }
            return true;

        case 4:
            return true;

        case 5:
            const agreeTerms = document.getElementById('agreeTerms').checked;
            if (!agreeTerms) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                return false;
            }
            return true;

        default:
            return true;
    }
}

// Phone Option Toggle
document.addEventListener('DOMContentLoaded', function() {
    const phoneOptions = document.querySelectorAll('input[name="phoneOption"]');
    phoneOptions.forEach(option => {
        option.addEventListener('change', function() {
            const forwardNumber = document.getElementById('forwardNumber');
            const newNumber = document.getElementById('newNumber');
            
            if (this.value === 'forward') {
                forwardNumber.style.display = 'block';
                newNumber.style.display = 'none';
            } else {
                forwardNumber.style.display = 'none';
                newNumber.style.display = 'block';
            }
        });
    });

    // 24/7 Toggle
    const twentyFourSeven = document.getElementById('twentyFourSeven');
    const customHours = document.getElementById('customHours');
    
    if (twentyFourSeven) {
        twentyFourSeven.addEventListener('change', function() {
            if (this.checked) {
                customHours.style.display = 'none';
            } else {
                customHours.style.display = 'block';
            }
        });
    }

    // Voice Preview Play Button
    const playBtn = document.querySelector('.play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            alert('Voice preview would play here. In production, this would play an audio sample of your greeting message.');
        });
    }
});

// Update Review Section
function updateReview() {
    // Business Details
    const businessName = document.getElementById('businessName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const serviceArea = document.getElementById('serviceArea').value;

    document.getElementById('review-businessName').textContent = businessName;
    document.getElementById('review-serviceArea').textContent = serviceArea;
    document.getElementById('review-contact').textContent = `${email} / ${phone}`;

    // Voice Configuration
    const primaryLanguage = document.querySelector('input[name="primaryLanguage"]:checked').value;
    const voiceGender = document.getElementById('voiceGender').value;
    
    let languageText = primaryLanguage.charAt(0).toUpperCase() + primaryLanguage.slice(1);
    let voiceText = voiceGender.charAt(0).toUpperCase() + voiceGender.slice(1);
    
    document.getElementById('review-language').textContent = languageText;
    document.getElementById('review-voice').textContent = voiceText + ' (Professional)';
}

// Launch Agent
function launchAgent() {
    if (!validateStep(5)) {
        return;
    }

    // Show loading state
    const launchBtn = document.querySelector('.btn-launch');
    const originalText = launchBtn.innerHTML;
    launchBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg> Launching...';
    launchBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Collect all form data
        const setupData = {
            // Step 1
            businessName: document.getElementById('businessName').value,
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            businessSize: document.getElementById('businessSize').value,
            serviceArea: document.getElementById('serviceArea').value,
            services: getCheckedValues('input[type="checkbox"][value]'),
            
            // Step 2
            voiceGender: document.getElementById('voiceGender').value,
            voiceSpeed: document.getElementById('voiceSpeed').value,
            primaryLanguage: document.querySelector('input[name="primaryLanguage"]:checked').value,
            additionalLanguages: getCheckedValues('input[type="checkbox"][value]'),
            greeting: document.getElementById('greeting').value,
            autoTransfer: document.getElementById('autoTransfer').checked,
            collectLocation: document.getElementById('collectLocation').checked,
            sendSMS: document.getElementById('sendSMS').checked,
            
            // Step 3
            phoneOption: document.querySelector('input[name="phoneOption"]:checked').value,
            existingPhone: document.getElementById('existingPhone')?.value || '',
            carrier: document.getElementById('carrier')?.value || '',
            twentyFourSeven: document.getElementById('twentyFourSeven').checked,
            openTime: document.getElementById('openTime')?.value || '',
            closeTime: document.getElementById('closeTime')?.value || '',
            
            // Step 4
            integrations: getEnabledIntegrations(),
            webhookUrl: document.getElementById('webhookUrl').value
        };

        console.log('Setup Data:', setupData);

        // In production, send this data to your backend
        // fetch('/api/setup-agent', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(setupData)
        // });

        // Hide all steps and show success
        document.querySelectorAll('.setup-step').forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        const successStep = document.getElementById('step-success');
        successStep.style.display = 'block';
        successStep.classList.add('active');

        // Update progress sidebar
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Send welcome email (simulated)
        sendWelcomeEmail(setupData.email);

    }, 2000); // 2 second delay to simulate API call
}

// Helper Functions
function getCheckedValues(selector) {
    const checkboxes = document.querySelectorAll(selector);
    const values = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            values.push(checkbox.value);
        }
    });
    return values;
}

function getEnabledIntegrations() {
    const integrationToggles = document.querySelectorAll('.integration-toggle');
    const enabled = [];
    integrationToggles.forEach((toggle, index) => {
        if (toggle.checked) {
            const card = toggle.closest('.integration-card');
            const name = card.querySelector('h3').textContent;
            enabled.push(name);
        }
    });
    return enabled;
}

function sendWelcomeEmail(email) {
    console.log(`Welcome email would be sent to: ${email}`);
    // In production, this would trigger an email via your backend
}

// Auto-save form data to localStorage
function saveFormData() {
    const formData = {
        businessName: document.getElementById('businessName')?.value || '',
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        serviceArea: document.getElementById('serviceArea')?.value || ''
    };
    localStorage.setItem('roadai_setup', JSON.stringify(formData));
}

// Restore form data from localStorage
function restoreFormData() {
    const savedData = localStorage.getItem('roadai_setup');
    if (savedData) {
        const formData = JSON.parse(savedData);
        if (formData.businessName) document.getElementById('businessName').value = formData.businessName;
        if (formData.fullName) document.getElementById('fullName').value = formData.fullName;
        if (formData.email) document.getElementById('email').value = formData.email;
        if (formData.phone) document.getElementById('phone').value = formData.phone;
        if (formData.serviceArea) document.getElementById('serviceArea').value = formData.serviceArea;
    }
}

// Auto-save on input change
document.addEventListener('DOMContentLoaded', function() {
    restoreFormData();

    const inputs = document.querySelectorAll('#step-1 input');
    inputs.forEach(input => {
        input.addEventListener('change', saveFormData);
        input.addEventListener('blur', saveFormData);
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Only enable keyboard navigation when not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }

    // Right arrow or Enter to go to next step
    if (e.key === 'ArrowRight' || (e.key === 'Enter' && currentStep < 5)) {
        const nextBtn = document.querySelector('.step-actions .btn-primary');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        }
    }

    // Left arrow to go to previous step
    if (e.key === 'ArrowLeft' && currentStep > 1) {
        const backBtn = document.querySelector('.step-actions .btn-secondary');
        if (backBtn && !backBtn.disabled) {
            backBtn.click();
        }
    }
});

// Track analytics (placeholder)
function trackSetupProgress(step, data) {
    console.log(`Setup Progress - Step ${step}:`, data);
    // In production, send to analytics service
    // analytics.track('setup_step_completed', { step, ...data });
}

// Warn before leaving if setup incomplete
window.addEventListener('beforeunload', function(e) {
    if (currentStep < 5 && currentStep > 1) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your setup progress will be saved.';
        saveFormData();
    }
});

