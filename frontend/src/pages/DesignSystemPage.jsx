import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import ScoreCircle from '../components/ScoreCircle';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import FileUploader from '../components/FileUploader';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Dropdown from '../components/Dropdown';
import Chart from '../components/Chart';
import Tabs from '../components/Tabs';
import Alert from '../components/Alert';
import { useToast } from '../context/ToastContext';
import { Mail, Sparkles, Trash2, Settings, User, LogOut, FileText, CheckCircle2 } from 'lucide-react';

export const DesignSystemPage = () => {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const chartData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 65 },
    { label: 'Mar', value: 86 },
    { label: 'Apr', value: 72 },
    { label: 'May', value: 94 }
  ];

  const dropdownItems = [
    { label: 'My Profile', icon: User, onClick: () => toast.info('Profile clicked') },
    { label: 'Settings', icon: Settings, onClick: () => toast.info('Settings clicked') },
    { label: 'Log Out', icon: LogOut, danger: true, onClick: () => toast.error('Logged out') }
  ];

  const sampleTabs = [
    { label: 'Overview', icon: <FileText size={14} />, content: <p className="text-muted" style={{ fontSize: '0.875rem' }}>Overview content tab panel</p> },
    { label: 'Skills Breakdown', icon: <CheckCircle2 size={14} />, content: <p className="text-muted" style={{ fontSize: '0.875rem' }}>Skills breakdown tab panel</p> }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ padding: '3rem 1rem', flex: 1 }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <Badge variant="demo">Design System Showcase</Badge>
          <h1 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>Component Library Playground</h1>
          <p className="text-muted">Explore all 20 production design tokens and UI components.</p>
        </div>

        {/* Section 1: Toast Notification System */}
        <Card title="1. Toast Notification System" style={{ marginBottom: '2rem' }}>
          <div className="flex gap-md flex-wrap">
            <Button variant="primary" onClick={() => toast.success('Resume parsed successfully!')}>
              Trigger Success Toast
            </Button>
            <Button variant="danger" onClick={() => toast.error('Failed to match job description.')}>
              Trigger Error Toast
            </Button>
            <Button variant="secondary" onClick={() => toast.warning('File size is near 10MB limit.')}>
              Trigger Warning Toast
            </Button>
            <Button variant="outline" onClick={() => toast.info('FastAPI AI Service is online.')}>
              Trigger Info Toast
            </Button>
          </div>
        </Card>

        {/* Section 2: Banner Alerts & Tabs */}
        <Card title="2. Banner Alerts & Tabs Navigation" style={{ marginBottom: '2rem' }}>
          <Alert variant="info" title="AI Microservice Update">
            FastAPI model v1.2.0 is currently operating at 99.9% uptime.
          </Alert>
          <Tabs tabs={sampleTabs} />
        </Card>

        {/* Section 3: Buttons & Badges */}
        <Card title="3. Buttons & Status Badges" style={{ marginBottom: '2rem' }}>
          <div className="flex flex-col gap-md">
            <div className="flex gap-sm items-center flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" loading>Loading</Button>
            </div>
            <div className="flex gap-sm items-center flex-wrap">
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="demo">Demo Data</Badge>
            </div>
          </div>
        </Card>

        {/* Section 4: Inputs, Selects & Dropdowns */}
        <Card title="4. Form Inputs, Selects & Popover Menu" style={{ marginBottom: '2rem' }}>
          <div className="grid grid-cols-3 gap-md items-end">
            <Input 
              label="Sample Email Input"
              placeholder="user@example.com"
              icon={Mail}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Select 
              label="Target Seniority Level"
              options={["Junior", "Mid-Level", "Senior", "Lead / Staff"]}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            />
            <div style={{ marginBottom: '1rem' }}>
              <Dropdown 
                trigger={<Button variant="outline">User Account Options ▾</Button>} 
                items={dropdownItems} 
              />
            </div>
          </div>
        </Card>

        {/* Section 5: File Uploader */}
        <Card title="5. Drag & Drop File Uploader" style={{ marginBottom: '2rem' }}>
          <FileUploader onFileSelect={(file) => file && toast.success(`Selected file: ${file.name}`)} />
        </Card>

        {/* Section 6: Modals & Confirmation */}
        <Card title="6. Modals & Dialog Windows" style={{ marginBottom: '2rem' }}>
          <div className="flex gap-md">
            <Button variant="primary" onClick={() => setModalOpen(true)}>Open Standard Modal</Button>
            <Button variant="danger" icon={Trash2} onClick={() => setConfirmOpen(true)}>Open Delete Confirmation</Button>
          </div>
        </Card>

        {/* Section 7: Analytics & Score Widgets */}
        <Card title="7. Gauges, Progress Bars & SVG Chart" style={{ marginBottom: '2rem' }}>
          <div className="grid grid-cols-3 gap-lg items-center">
            <ScoreCircle score={86} maxScore={100} label="ATS Score" />
            <div>
              <ProgressBar label="ATS Keywords" progress={89} />
              <ProgressBar label="Formatting" progress={76} />
            </div>
            <Chart title="Monthly Resume Uploads" data={chartData} />
          </div>
        </Card>

        {/* Section 8: Empty & Error States */}
        <Card title="8. Empty & Error State Placeholders">
          <div className="grid grid-cols-2 gap-md">
            <EmptyState title="No Resumes Analyzed Yet" description="Upload a PDF resume to calculate score." actionLabel="Upload Resume" onAction={() => toast.info('Navigating to upload')} />
            <ErrorState title="Connection Timeout" message="Unable to reach AI service on port 8000." onRetry={() => toast.success('Retrying connection...')} />
          </div>
        </Card>

        {/* Modal Declarations */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Sample Component Modal" subtitle="Modal window with backdrop blur">
          <p className="text-muted" style={{ fontSize: '0.9375rem' }}>
            This modal supports full keyboard ESC dismiss, click outside dismiss, custom action footers, and accessible focus management.
          </p>
        </Modal>

        <ConfirmDialog 
          isOpen={confirmOpen} 
          onClose={() => setConfirmOpen(false)} 
          onConfirm={() => { setConfirmOpen(false); toast.error('Item deleted'); }}
          title="Delete Saved Resume?"
          message="Are you sure you want to permanently remove Software_Engineer_2026.pdf?"
        />
      </main>
    </div>
  );
};

export default DesignSystemPage;
