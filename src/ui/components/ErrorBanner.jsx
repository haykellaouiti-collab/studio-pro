import React from 'react';
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return <div role="alert" style={{ color: '#f87171' }}>{message}</div>;
}
