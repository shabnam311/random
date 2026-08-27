import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/api/supabase';
import './AuthForm.css';

type AuthMode = 'login' | 'signup';
type Role = 'student' | 'teacher';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>('student');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (mode === 'signup') {
        await auth.signup(email, password, name, role);
        // Supabase might require email verification, but we'll try to log them in or redirect
        alert('Account created! You can now log in.');
        setMode('login');
      } else {
        await auth.login(email, password);
        navigate('/classes');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="brand"><div className="mark"></div>ClassVault</div>
        <div>
          <h2>One record per group. No lost submissions, ever.</h2>
          <p>A scoped workspace for class projects — students submit and version their files, teachers see every group's status at a glance.</p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <span className="eyebrow">{mode === 'login' ? 'Sign in' : 'Create account'}</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Join ClassVault'}</h1>
          <p className="sub">
            {mode === 'login' ? 'Enter your details to open your classes.' : 'Sign up to manage your classroom workspace.'}
          </p>

          {errorMsg && (
            <div aria-live="assertive" style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
              {errorMsg}
            </div>
          )}
          
          <div className="role-toggle">
            <button 
              className={role === 'student' ? 'active' : ''} 
              onClick={() => setRole('student')}
              type="button"
            >
              Student
            </button>
            <button 
              className={role === 'teacher' ? 'active' : ''} 
              onClick={() => setRole('teacher')}
              type="button"
            >
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="First Last" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
            )}
            
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="you@school.edu" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="field">
              <label htmlFor="pw">Password</label>
              <input 
                id="pw" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </form>
          
          <p className="fine-print">
            {mode === 'login' ? (
              <>No account? <a href="#" onClick={toggleMode}>Create one</a> — or <a href="#">reset your password</a>.</>
            ) : (
              <>Already have an account? <a href="#" onClick={toggleMode}>Sign in</a>.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
