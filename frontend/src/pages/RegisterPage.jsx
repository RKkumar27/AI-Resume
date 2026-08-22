import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password, 'Software Engineer');
    setLoading(false);

    if (result.success) {
      toast.success(`Account created for ${result.data.name}!`);
      navigate('/dashboard');
    } else {
      toast.info('Account created in Demo Mode! Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container flex items-center justify-center" style={{ flex: 1, padding: '3rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Badge variant="demo" className="mb-sm">ResuMatch AI Registration</Badge>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>Create Your Account</h2>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Join ResuMatch AI to unlock instant resume scoring and career matching.
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                icon={User}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex.morgan@example.com"
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                icon={Lock}
                required
              />

              <Button type="submit" variant="primary" fullWidth loading={loading} icon={UserPlus} style={{ marginTop: '0.5rem' }}>
                Create Free Account
              </Button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border)',
              fontSize: '0.875rem'
            }}>
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Sign In
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
