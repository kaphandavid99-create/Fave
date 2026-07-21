'use client';

import { useState } from 'react';

export default function NewsletterSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const submit = async () => {
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatus('error');
      setMessage('Please enter a valid email.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || 'Subscription failed');
      }

      setStatus('success');
      setMessage('Subscribed! You’re on the luxe list.');
      setEmail('');
    } catch (e) {
      setStatus('error');
      setMessage(e instanceof Error ? e.message : 'Subscription failed');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== 'idle') {
            setStatus('idle');
            setMessage('');
          }
        }}
        className="w-full px-4 md:px-5 py-2 md:py-3 border border-[#3A241C] rounded text-sm md:text-base bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#8A4A32] focus:border-transparent"
        aria-label="Email"
      />
      <button
        onClick={submit}
        disabled={status === 'loading'}
        className="w-full sm:w-auto bg-[#3A241C] text-white px-6 py-2 md:py-3 rounded hover:bg-[#5A3A2C] transition text-sm md:text-base disabled:opacity-70"
        type="button"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>

      {message ? (
        <p
          className={
            status === 'success'
              ? 'text-center text-sm text-green-700 sm:col-span-2 mt-1'
              : 'text-center text-sm text-red-700 sm:col-span-2 mt-1'
          }
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

