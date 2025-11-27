// In-memory OTP store
// In production, use Redis or a database for OTP storage

const otpStore = new Map();

// Store OTP with phone number and expiration (5 minutes)
export const storeOTP = (phoneNumber, otp) => {
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStore.set(phoneNumber, {
        otp,
        expiresAt
    });
    
    // Clean up expired OTPs after 10 minutes (5 minutes buffer after expiration)
    // This ensures verifyOTP can detect expiration before cleanup
    setTimeout(() => {
        otpStore.delete(phoneNumber);
    }, 10 * 60 * 1000); // 10 minutes - gives enough time for verifyOTP to check expiration
};

// Verify OTP
export const verifyOTP = (phoneNumber, otp) => {
    const stored = otpStore.get(phoneNumber);
    
    // Check if OTP exists in store
    if (!stored) {
        // OTP doesn't exist - could be never sent or already used/expired and cleaned up
        // Since we can't distinguish, we'll assume it's expired if it was recently requested
        // For now, return not_found for truly missing OTPs
        return { 
            valid: false, 
            errorType: 'not_found',
            message: 'OTP not found. Please request a new OTP.' 
        };
    }
    
    // Check if OTP has expired FIRST (before checking OTP match)
    // This ensures we return "expired" message when OTP exists but is expired
    if (Date.now() > stored.expiresAt) {
        otpStore.delete(phoneNumber);
        return { 
            valid: false, 
            errorType: 'expired',
            message: 'OTP has expired. Please request a new OTP.' 
        };
    }
    
    // Check if OTP matches
    if (stored.otp !== otp) {
        return { 
            valid: false, 
            errorType: 'invalid',
            message: 'Invalid OTP. Please check and try again.' 
        };
    }
    
    // OTP is valid, remove it from store
    otpStore.delete(phoneNumber);
    return { valid: true, message: 'OTP verified' };
};

// Get OTP (for testing/debugging)
export const getOTP = (phoneNumber) => {
    return otpStore.get(phoneNumber);
};

