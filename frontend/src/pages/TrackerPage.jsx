import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import Tabs from '../components/Tabs';
import { useToast } from '../context/ToastContext';
import { Kanban, Plus, Building, Trash2, Search, Filter } from 'lucide-react';

export const TrackerPage = () => {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [applications, setApplications] = useState([
    { id: 'app-1', company: 'Stripe', role: 'Senior Backend Engineer', status: 'Interview', date: '2026-08-18', notes: 'Completed technical screen, system design next week.' },
    { id: 'app-2', company: 'TechScale Inc', role: 'Full Stack Engineer', status: 'Applied', date: '2026-08-20', notes: 'Submitted resume via referral.' },
    { id: 'app-3', company: 'CloudFlow', role: 'Backend Architect', status: 'Selected', date: '2026-08-10', notes: 'Offer letter received ($165k).' },
    { id: 'app-4', company: 'NextGen AI', role: 'AI Application Developer', status: 'Assessment', date: '2026-08-12', notes: 'Take-home coding task pending.' }
  ]);

  const [formData, setFormData] = useState({ company: '', role: '', status: 'Applied', notes: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role) return;
    const newApp = {
      id: 'app-' + Date.now(),
      company: formData.company,
      role: formData.role,
      status: formData.status,
      date: new Date().toISOString().split('T')[0],
      notes: formData.notes
    };
    setApplications([newApp, ...applications]);
    setModalOpen(false);
    setFormData({ company: '', role: '', status: 'Applied', notes: '' });
    toast.success(`Application for ${formData.role} at ${formData.company} saved!`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Selected': return 'success';
      case 'Interview': return 'info';
      case 'Assessment': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'demo';
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { label: `All (${applications.length})` },
    { label: 'Applied' },
    { label: 'Assessment' },
    { label: 'Interview' },
    { label: 'Selected' },
    { label: 'Rejected' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar isAuthenticated={true} />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <div className="flex items-center gap-sm">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Job Application Tracker</h1>
                <Badge variant="demo">Pipeline Manager</Badge>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Organize applications, track stage progression, and manage interview schedules.
              </p>
            </div>

            <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
              Add Application
            </Button>
          </div>

          {/* Filter Bar & Search Input */}
          <div className="flex items-center justify-between gap-md" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
              {['All', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'].map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm ${activeFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div style={{ width: '260px' }}>
              <Input
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>

          {/* Applications List */}
          <div className="grid grid-cols-1 gap-md">
            {filteredApps.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p className="text-muted">No applications found matching query "{searchQuery}".</p>
              </Card>
            ) : (
              filteredApps.map((app) => (
                <Card key={app.id}>
                  <div className="flex items-center justify-between flex-wrap gap-md">
                    <div className="flex items-center gap-md">
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-main)',
                        color: 'var(--color-primary)'
                      }}>
                        <Building size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-sm">
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{app.role}</h3>
                          <Badge variant={getStatusBadge(app.status)}>{app.status}</Badge>
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.2rem' }}>
                          {app.company} · Applied: {app.date}
                        </p>
                        {app.notes && (
                          <p className="text-subtle" style={{ fontSize: '0.8125rem', marginTop: '0.35rem' }}>
                            Note: {app.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-sm">
                      <Select
                        options={['Saved', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected']}
                        value={app.status}
                        onChange={(e) => {
                          const updated = applications.map(a => a.id === app.id ? { ...a, status: e.target.value } : a);
                          setApplications(updated);
                          toast.success(`Updated status to ${e.target.value}`);
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setApplications(applications.filter(a => a.id !== app.id));
                          toast.error('Application deleted');
                        }}
                      >
                        <Trash2 size={16} color="var(--color-danger)" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Track New Job Application"
          >
            <form onSubmit={handleAdd}>
              <Input
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google, Stripe"
                required
              />
              <Input
                label="Job Title"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Senior Backend Engineer"
                required
              />
              <Select
                label="Application Stage Status"
                options={['Saved', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected']}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
              <Input
                label="Notes / Interview Details"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Referred by engineer, screening on Monday"
              />
              <Button type="submit" variant="primary" fullWidth style={{ marginTop: '1rem' }}>
                Save Application
              </Button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default TrackerPage;
