'use client';
import { usePrivy } from '@privy-io/react-auth';

export default function Login() {
  const { login } = usePrivy();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button
        onClick={login}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          borderRadius: '8px',
          border: 'none',
          background: '#171717',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Login / Sign Up
      </button>
    </div>
  );
}