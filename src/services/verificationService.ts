import { supabase } from '../lib/supabase';

export type ContactType = 'phone' | 'email';

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
      .select('id')
      .maybeSingle();

    if (error) {
      return { success: false, error: 'Failed to create verification request' };
    }

    console.log(`Verification code for ${contactType} ${contact}: ${code}`);

    return { success: true, verificationId: data?.id };
  } catch (error) {
    console.error('Error creating verification request:', error);
    return { success: false, error: 'An unexpected error occurred' };
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
        .update({ attempts: verification.attempts + 1 })
        .eq('id', verificationId);

      if (updateError) {
        console.error('Error updating verification attempts:', updateError);
      }

      return {
        success: false,
        error: `Invalid code. ${5 - (verification.attempts + 1)} attempts remaining`,
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
