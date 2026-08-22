import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Chart from '../components/Chart';
import { useAuth } from '../context/AuthContext';
import { healthAPI } from '../services/api';
import { ShieldAlert, Server, Cpu, Database, Activity, RefreshCw } from 'lucide-react';

export const AdminPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await healthAPI.getHealth();
      if (res.data) {
        setHealthData(res.data);
      }
    } catch (err) {
      console.warn('[Admin Page] Health check warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const systemTraffic = [
    { label: '00:00', value: 12 },
    { label: '04:00', value: 5 },
    { label: '08:00', value: 45 },
    { label: '12:00', value: 88 },
    { label: '16:00', value: 94 },
    { label: '20:00', value: 62 }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <div className="flex items-center gap-sm">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin & AI Observability</h1>
                <Badge variant={user?.role === 'admin' ? 'danger' : 'info'}>
                  {user?.role === 'admin' ? 'Admin Access' : 'Demo Mode Access'}
                </Badge>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Monitor system metrics, Node Express API health, MongoDB connection status, and FastAPI AI inference latency.
              </p>
            </div>

            <Button variant="secondary" icon={RefreshCw} loading={loading} onClick={fetchHealth}>
              Refresh Metrics
            </Button>
          </div>

          {/* System Health Cards */}
          <div className="grid grid-cols-4 gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Express API Service</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
                    {healthData?.status === 'ok' ? 'HTTP 200 OK' : 'Degraded'}
                  </div>
                </div>
                <Server size={24} color="var(--color-success)" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>MongoDB Database</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
                    {healthData?.database?.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                <Database size={24} color="var(--color-primary)" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>FastAPI AI Engine</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
                    Online (v1.2.0)
                  </div>
                </div>
                <Cpu size={24} color="var(--color-secondary)" />
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Avg Inference Latency</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '0.25rem' }}>
                    ~420 ms
                  </div>
                </div>
                <Activity size={24} color="var(--color-warning)" />
              </div>
            </Card>
          </div>

          {/* System Traffic & Health Raw Data */}
          <div className="grid grid-cols-2 gap-lg">
            <Chart title="24-Hour Express API Request Volume" data={systemTraffic} />

            <Card title="Raw Server Health Telemetry Response">
              {loading ? (
                <Loader label="Polling server health check..." />
              ) : (
                <pre style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.8125rem',
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
