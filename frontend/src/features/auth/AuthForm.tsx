import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth then redirect to dashboard
    setTimeout(() => {
      setIsLoading(false);
      navigate('/classes');
    }, 800);
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="brand"><div className="mark"></div>ClassVault</div>
        <div>
          <h2>One record per group. No lost submissions, ever.</h2>
          <p>A scoped workspace for class projects — students submit and version their files, teachers see every group's status at a glance.</p>
          <div style={{ marginTop: '40px' }}>
            <div className="ledger-row"><span>ENV-DESIGN / GROUP-04</span><span>SUBMITTED · ON TIME</span></div>
            <div className="ledger-row"><span>ENV-DESIGN / GROUP-07</span><span>DRAFT</span></div>
            <div className="ledger-row"><span>ENV-DESIGN / GROUP-11</span><span>LATE</span></div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <span className="eyebrow">{mode === 'login' ? 'Sign in' : 'Create account'}</span>
          <h1>{mode === 'login' ? 'Welcome back' : 'Join ClassVault'}</h1>
          <p className="sub">
            {mode === 'login' ? 'Enter your details to open your classes.' : 'Sign up to manage your classroom workspace.'}
          </p>
          
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
