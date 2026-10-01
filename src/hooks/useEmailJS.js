import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * 
 * CARA SETUP:
 * 1. Buat akun gratis di https://www.emailjs.com
 * 2. Tambah Email Service (pilih Gmail) → dapatkan SERVICE_ID
 * 3. Buat Email Template dengan variabel: {{from_name}}, {{message}}, {{reply_to}}
 * 4. Ambil Public Key dari Account → General
 * 5. Ganti placeholder di bawah dengan ID asli Anda
 */
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',      // Ganti dengan Service ID Anda
  templateId: 'YOUR_TEMPLATE_ID',    // Ganti dengan Template ID Anda
  publicKey: 'YOUR_PUBLIC_KEY',      // Ganti dengan Public Key Anda
};

export function useEmailJS() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const formRef = useRef(null);

  const sendEmail = async (name, message) => {
    if (!name.trim() || !message.trim()) {
      setStatus('empty');
      return false;
    }

    setSending(true);
    setStatus(null);

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: name,
          message: message,
          reply_to: 'visitor@portfolio.com',
        },
        EMAILJS_CONFIG.publicKey
      );

      setStatus('success');
      setSending(false);
      return true;
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      setSending(false);
      return false;
    }
  };

  const resetStatus = () => setStatus(null);

  return { sendEmail, sending, status, resetStatus, formRef };
}
