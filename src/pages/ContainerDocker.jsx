import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
// Import fetcher utama yang merangkum semua data (/monitoring/)
import { getZakiDashboardData } from '../api/zakiApi';

/* ── Helpers ─────────────────────────────────────────────── */
const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const truncate = (str, n) => (str && str.length > n ? str.substr(0, n - 1) + '...' : str);

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT: DOCKER CONTAINER MONITOR
══════════════════════════════════════════════════════════════ */
export default function ContainerDocker() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch dari endpoint utama yang punya nodejs, docker, dan system
        const apiData = await getZakiDashboardData();
        setData(apiData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dari server");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 5000); 
    return () => clearInterval(interval);
  }, []);

  if (isLoading && !data) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
         <div style={{ width: 40, height: 40, border: '3px solid #f1f5f9', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 15px' }} />
         <div style={{ color: '#64748b' }}>Memuat Konfigurasi Infrastruktur...</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#ef4444' }}>
        <h3>Koneksi Terputus</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Fallback pengaman agar tidak crash jika API tidak mereturn object
  const system = data?.system || {};
  const docker = data?.docker || { running: 0, total: 0, containers: [] };
  const nodejs = data?.nodejs || {};
  const containers = docker.containers || [];

  const stoppedContainers = docker.total - docker.running;

  return (
    <>
      <Topbar title="Docker Infrastructure" subtitle="Portainer-style Monitoring: Engine, Containers, & Live Events" />
      <div className="page-content section-gap" style={{ padding: '0 24px 40px' }}>

        {/* ── ROW 1: DOCKER ENGINE STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 20, marginTop: 10 }}>
          <StatCard 
            label="Docker Host" 
            value={system.hostname || '-'} 
            changeText={`OS: ${system.platform || '-'} ${system.arch || ''}`} 
            color="#3b82f6" bg="rgba(59,130,246,.12)" delay="0s" 
          />
          <StatCard 
            label="Containers" 
            value={`${docker.running} Running`} 
            changeText={`${stoppedContainers} Stopped / Exited`} 
            changeType={stoppedContainers > 0 ? "down" : "up"}
            color={stoppedContainers > 0 ? "#ef4444" : "#22c55e"} 
            bg={stoppedContainers > 0 ? "rgba(239,68,68,.12)" : "rgba(34,197,94,.12)"} 
            delay="0.1s" 
          />
          <StatCard 
            label="Docker Images" 
            value="-" /* API belum mengirimkan total images */
            changeText="Data not provided by API" 
            color="#8b5cf6" bg="rgba(139,92,246,.12)" delay="0.2s" 
          />
          <StatCard 
            label="Volumes & Networks" 
            value="-" /* API belum mengirimkan total volume */
            changeText="Data not provided by API" 
            color="#f59e0b" bg="rgba(245,158,11,.12)" delay="0.3s" 
          />
        </div>

        {/* ── ROW 2: ADVANCED CONTAINER TABLE ── */}
        <Card 
          title="Container Instances" 
          subtitle="Real-time resource, port mapping, and network I/O per container" 
          delay="0.4s"
          style={{ marginBottom: 20 }}
        >
          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 8px' }}>Name & Image</th>
                  <th style={{ padding: '12px 8px' }}>State / Health</th>
                  <th style={{ padding: '12px 8px' }}>Published Ports</th>
                  <th style={{ padding: '12px 8px' }}>CPU</th>
                  <th style={{ padding: '12px 8px' }}>RAM Usage</th>
                  <th style={{ padding: '12px 8px' }}>Net I/O (Rx/Tx)</th>
                  <th style={{ padding: '12px 8px' }}>Block I/O</th>
                </tr>
              </thead>
              <tbody>
                {containers.length > 0 ? containers.map((c, i) => {
                  // Cek status "Up" dari text, misal "Up 53 minutes"
                  const isRunning = c.status && c.status.toLowerCase().startsWith('up');
                  
                  // Parsing memPercent agar bisa jadi lebar bar CSS ("0.93%" jadi angka 0.93)
                  const memPctRaw = c.stats?.memPercent || '0%';
                  const memPct = parseFloat(memPctRaw.replace('%', '')) || 0;
                  
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      
                      {/* Name & Image */}
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#334155' }} title={c.name}>
                          {truncate(c.name || '-', 40)}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginTop: 4 }}>
                          {c.image || '-'}
                        </div>
                      </td>

                      {/* State */}
                      <td style={{ padding: '12px 8px' }}>
                        <Badge variant={isRunning ? 'success' : 'danger'} style={{ fontSize: 10, padding: '4px 8px' }}>
                          {isRunning ? 'RUNNING' : 'EXITED/UNKNOWN'}
                        </Badge>
                        <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{c.status || '-'}</div>
                      </td>

                      {/* Ports - API belum sedia */}
                      <td style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#4072af' }}>
                        -
                      </td>

                      {/* CPU */}
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#334155' }}>
                          {c.stats?.cpu || '0.00%'}
                        </span>
                      </td>

                      {/* RAM */}
                      <td style={{ padding: '12px 8px', minWidth: '150px' }}>
                        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#334155', display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span>{c.stats?.memUsage || '0B / 0B'}</span>
                          <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{c.stats?.memPercent || '0.00%'}</span>
                        </div>
                        <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 3 }}>
                          <div style={{ height: '100%', width: `${memPct}%`, background: memPct > 80 ? '#ef4444' : '#8b5cf6', borderRadius: 3 }} />
                        </div>
                      </td>

                      {/* Net I/O - API belum sedia */}
                      <td style={{ padding: '12px 8px', fontSize: 12, fontFamily: 'monospace', color: '#475569' }}>
                        -
                      </td>

                      {/* Block I/O - API belum sedia */}
                      <td style={{ padding: '12px 8px', fontSize: 12, fontFamily: 'monospace', color: '#475569' }}>
                        -
                      </td>

                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>Belum ada container yang terdeteksi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ── ROW 3: APP RUNTIME & LIVE EVENTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
          
          {/* Left: Node.js Stats */}
          <Card title={`Node.js ${nodejs.version || ''}`} subtitle="Alokasi memori internal V8 Engine" delay="0.5s">
            {nodejs.memoryUsage ? (
              <div style={{ marginTop: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Resident Set Size (RSS)</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>{formatBytes(nodejs.memoryUsage.rss)}</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, marginBottom: 20 }}>
                  <div style={{ width: '100%', height: '100%', background: '#3b82f6', borderRadius: 3 }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Heap Used / Total</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>
                    {formatBytes(nodejs.memoryUsage.heapUsed)} / {formatBytes(nodejs.memoryUsage.heapTotal)}
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, marginBottom: 20 }}>
                  <div style={{ width: `${Math.min((nodejs.memoryUsage.heapUsed / nodejs.memoryUsage.heapTotal) * 100, 100)}%`, height: '100%', background: '#10b981', borderRadius: 3 }} />
                </div>

                <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Ext C++ Binding</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#475569', fontWeight: 600 }}>{formatBytes(nodejs.memoryUsage.external)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>Array Buffers</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#475569', fontWeight: 600 }}>{formatBytes(nodejs.memoryUsage.arrayBuffers)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px dashed #cbd5e1' }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>App Platform Uptime</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#10b981', fontWeight: 700 }}>{Math.floor((nodejs.uptime || 0) / 3600)} Hours</span>
                  </div>
                </div>
              </div>
            ) : (
               <div style={{ color: '#64748b', marginTop: 15 }}>Data Node.js tidak tersedia</div>
            )}
          </Card>

          {/* Right: Live Terminal Feed */}
          <Card 
            title="Live Docker Events" 
            subtitle="Terminal log stream dari Docker Daemon" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: error ? '#ef4444' : '#22c55e', display: 'block', animation: 'pulse-ring 1s infinite' }} />}
            delay="0.6s"
            style={{ background: '#0f172a', color: '#e2e8f0', border: 'none' }}
          >
            <div style={{ 
              marginTop: 15, 
              height: 240, 
              overflowY: 'auto', 
              fontFamily: 'JetBrains Mono, monospace', 
              fontSize: 12,
              paddingRight: 10,
              lineHeight: '1.6'
            }}>
              <div style={{ color: '#64748b', marginBottom: 10 }}>API saat ini belum mensupport live event stream...</div>
              <div style={{ color: '#64748b', marginTop: 15 }}>
                root@{system.hostname || 'smartcity-host'}:~# docker events --since 1h <span style={{ animation: 'blink 1s infinite' }}>_</span>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </>
  );
}