import { useState } from 'react';

export default function AuthForm({ mode, onAuth, onSwitchMode }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(form.username, form.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      <button type="button" onClick={onSwitchMode}>
        {mode === 'register' ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </form>
  );
}
