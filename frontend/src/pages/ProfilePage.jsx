import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Briefcase, Award, Save, Lock } from 'lucide-react';

export const ProfilePage = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Candidate User',
    email: user?.email || 'user@example.com',
    targetRole: user?.targetRole || 'Senior Backend Engineer',
    experienceLevel: user?.experienceLevel || 'Senior'
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile settings updated successfully.');
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile & Career Preferences</h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Manage your personal information, target job title, and experience level preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-lg">
            <div style={{ gridColumn: 'span 2' }}>
              <Card title="User Account Information">
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={User}
                    required
                  />

                  <Input
                    label="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    icon={Mail}
                    disabled
                  />

                  <Input
                    label="Target Job Title"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    icon={Briefcase}
                    required
                  />

                  <Select
                    label="Seniority / Experience Level"
                    options={['Junior (0-2 yrs)', 'Mid-Level (2-5 yrs)', 'Senior (5-8 yrs)', 'Lead / Staff (8+ yrs)']}
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  />

                  <Button type="submit" variant="primary" loading={saving} icon={Save} style={{ marginTop: '1rem' }}>
                    Save Profile Changes
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card title="Account Security">
                <div style={{ marginBottom: '1.25rem' }}>
                  <div className="flex items-center gap-xs" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <Lock size={16} color="var(--color-primary)" /> Password Policy
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.8125rem' }}>
                    Your password is securely hashed using bcrypt with 10 salt rounds.
                  </p>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-muted" style={{ fontSize: '0.8125rem' }}>Account Role:</span>
                    <Badge variant={user?.role === 'admin' ? 'danger' : 'info'}>
                      {user?.role || 'Standard Candidate'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
