import { supabase } from '../lib/supabase';

export type ContactType = 'phone' | 'email';

interface EmailVerificationRequest {
  contact: string;
  code: string;
  contact_type: ContactType;
}

const EMAIL_API_URL = 'http://localhost:3007/api';
console.log('Email server will be available at:', EMAIL_API_URL);

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const createVerificationRequest = async (
  contact: string,
  contactType: ContactType
): Promise<{ success: boolean; error?: string; verificationId?: string }> => {
  try {
    if (contactType === 'email' && !isValidEmail(contact)) {
      return { success: false, error: 'Invalid email address' };
    }

    if (contactType === 'phone' && !isValidPhone(contact)) {
      return { success: false, error: 'Invalid phone number' };
    }

    const code = generateVerificationCode();

    const { data, error } = await supabase
      .from('verification_requests')
      .insert({
        contact,
        contact_type: contactType,
        code,
        is_verified: false,
        attempts: 0,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Failed to create verification request' };
    }

    // Prefer the DB's code value if any trigger overwrites it
    const finalCode = data.code;

    console.log(`Verification code for ${contactType} ${contact}: ${finalCode}`);

    // Send email verification if contact type is email and Edge function URL is configured
    if (contactType === 'email' && import.meta.env.VITE_SUPABASE_URL) {
      const emailResult = await sendEmailVerification({
        contact: data.contact,
        code: finalCode,
        contact_type: data.contact_type,
      });
      
      if (!emailResult.success) {
        console.warn('Email verification created but sending failed:', emailResult.error);
        // Return partial success - record created but email might not be sent
        return {
          success: true,
          verificationId: data.id,
          error: `Record created but email not sent: ${emailResult.error}. Check logs.`
        };
      }
    }

    return { success: true, verificationId: data.id };
  } catch (error) {
    console.error('Error creating verification request:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

const sendEmailVerification = async (data: EmailVerificationRequest): Promise<{ success: boolean; error?: string }> => {
  try {
    // Send verification email via local email API
    const response = await fetch(`${EMAIL_API_URL}/send-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.contact,
        code: data.code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      return {
        success: false,
        error: `Failed to send email: ${errorData.error || response.statusText}`
      };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return { success: true };
  } catch (error) {
    console.error('Error sending email verification:', error);
    return {
      success: false,
      error: 'Failed to connect to email server. Make sure the email server is running on port 3007.'
    };
  }
};

export const verifyEmailVerificationCode = async (
  email: string,
  code: string
): Promise<{ success: boolean; error?: string; verificationId?: string }> => {
  try {
    const { data, error } = await supabase
      .from('verification_requests')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('contact', email)
      .eq('contact_type', 'email')
      .eq('code', code)
      .eq('is_verified', false)
      .select()

    if (error) {
      return { success: false, error: 'Failed to verify code' };
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Invalid or expired code' };
    }

    return { success: true, verificationId: data[0]?.id };
  } catch (error) {
    console.error('Error verifying email code:', error);
    return { success: false, error: 'An unexpected error occurred during verification' };
  }
};

export const verifyCode = async (
  verificationId: string,
  code: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: verification, error: fetchError } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('id', verificationId)
      .maybeSingle();

    if (fetchError || !verification) {
      return { success: false, error: 'Verification request not found' };
    }

    if (verification.is_verified) {
      return { success: false, error: 'Already verified' };
    }

    if (verification.expires_at && new Date(verification.expires_at) < new Date()) {
      return { success: false, error: 'Verification code expired' };
    }

    if (verification.attempts >= 5) {
      return { success: false, error: 'Too many attempts. Please request a new code' };
    }

    if (verification.code !== code) {
      const { error: updateError } = await supabase
        .from('verification_requests')
        .update({ attempts: (verification.attempts || 0) + 1 })
        .eq('id', verificationId);

      if (updateError) {
        console.error('Error updating verification attempts:', updateError);
      }

      const remainingAttempts = 5 - ((verification.attempts || 0) + 1);
      return {
        success: false,
        error: `Invalid code. ${Math.max(0, remainingAttempts)} attempts remaining`,
      };
    }

    const { error: verifyError } = await supabase
      .from('verification_requests')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('id', verificationId);

    if (verifyError) {
      return { success: false, error: 'Failed to verify code' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error verifying code:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};
