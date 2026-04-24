import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/* ── Data Statis & Initial State ────────────────────────── */
// 12 Daftar CCTV
const CCTV_LIST = [
  { id: 'CAM-01', name: 'Gerbang Utama', status: 'aktif' },
  { id: 'CAM-02', name: 'Area Tiket 1', status: 'aktif' },
  { id: 'CAM-03', name: 'Area Tiket 2', status: 'aktif' },
  { id: 'CAM-04', name: 'Lobby Informasi', status: 'aktif' },
  { id: 'CAM-05', name: 'Zona Wisata A', status: 'aktif' },
  { id: 'CAM-06', name: 'Zona Wisata B', status: 'mati' },
  { id: 'CAM-07', name: 'Zona Wisata C', status: 'aktif' },
  { id: 'CAM-08', name: 'Wahana Air 1', status: 'aktif' },
  { id: 'CAM-09', name: 'Parkiran Timur', status: 'mati' },
  { id: 'CAM-10', name: 'Parkiran Barat', status: 'aktif' },
  { id: 'CAM-11', name: 'Zona Kuliner 1', status: 'aktif' },
  { id: 'CAM-12', name: 'Zona Kuliner 2', status: 'aktif' },
];

const TRENDING_TOPIC = [
  { rank: 1, topic: 'Tiket Masuk Taman Safari', count: 1240 },
  { rank: 2, topic: 'Jadwal Event Weekend', count: 980 },
  { rank: 3, topic: 'Promo Liburan Lebaran', count: 754 },
  { rank: 4, topic: 'Cara Refund Tiket', count: 621 },
  { rank: 5, topic: 'Fasilitas Ramah Anak', count: 489 },
];

const TRENDING_LOCATION = [
  { rank: 1, topic: 'Pantai Anyer', count: 2140 },
  { rank: 2, topic: 'Candi Borobudur', count: 1688 },
  { rank: 3, topic: 'Taman Safari Bogor', count: 1320 },
  { rank: 4, topic: 'Gunung Bromo', count: 998 },
  { rank: 5, topic: 'Kebun Raya Cibodas', count: 740 },
];

const INITIAL_TICKET_SALES = [
  { wisata: 'Pantai Anyer', terjual: 1240 },
  { wisata: 'Taman Safari', terjual: 980 },
  { wisata: 'Borobudur', terjual: 850 },
  { wisata: 'Gunung Bromo', terjual: 620 },
  { wisata: 'Kebun Raya', terjual: 450 },
  { wisata: 'Pulau Komodo', terjual: 210 },
  { wisata: 'Pantai Cilacap', terjual: 11240 },
  { wisata: 'Taman Bunga', terjual: 9180 },
  { wisata: 'Bukit Tinggi', terjual: 8150 },
  { wisata: 'Gunung Slamet', terjual: 6210 },
  { wisata: 'Kebun Raya Bogor', terjual: 4510 },
  { wisata: 'Pulau Seribu', terjual: 2110 },
];

const INITIAL_PIE_DATA = [
  { name: 'Berhasil', value: 3840, color: '#22c55e' },
  { name: 'Pending', value: 450, color: '#f59e0b' },
  { name: 'Gagal', value: 85, color: '#ef4444' },
];

const DUMMY_EMAILS = ['rizky@gmail.com', 'siti_n@yahoo.com', 'joko.w@company.id', 'ayu.lestari@gmail.com', 'hendra99@hotmail.com', 'putri.a@gmail.com'];
const DUMMY_ERRORS = [
  { type: 'danger', title: 'Transaksi Gagal', desc: 'Timeout saat koneksi ke Payment Gateway' },
  { type: 'warning', title: 'Database Beban Tinggi', desc: 'Penggunaan CPU Database > 85%' },
  { type: 'danger', title: 'CCTV Glitch', desc: 'CAM-09 Parkiran Timur kehilangan sinyal' },
  { type: 'warning', title: 'Fraud Detected', desc: 'Percobaan login gagal 5x berturut-turut' },
];

/* ── Komponen CCTV ──────────────────────────────────────── */
function CctvCam({ cam }) {
  const isActive = cam.status === 'aktif';
  return (
    <div className="cctv-card" style={{ background: '#1e293b', borderRadius: 8, overflow: 'hidden', position: 'relative', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isActive ? (
        <>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
            <path d="M23 7 16 12 23 17V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <div style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, color: 'rgba(255,255,255,0.9)', fontFamily: 'JetBrains Mono', background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: 4 }}>
            {cam.id}
          </div>
          <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
            <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 700, letterSpacing: 0.5 }}>REC</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ textAlign: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <line x1="2" y1="2" x2="22" y2="22"/><path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L23 7v10"/><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10z"/>
            </svg>
            <div style={{ fontSize: 9, color: 'rgba(239,68,68,0.7)', fontFamily: 'JetBrains Mono', marginTop: 4 }}>OFFLINE</div>
          </div>
          <div style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>
            {cam.id}
          </div>
        </>
      )}
      <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 9, color: 'rgba(255,255,255,0.7)', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2px 4px', borderRadius: 4 }}>
        {cam.name}
      </div>
    </div>
  );
}

/* ── Main Dashboard Component ───────────────────────────── */
export default function Nadya() {
  const [totalRegisterToday, setTotalRegisterToday] = useState(312); 
  const cctvAktif = CCTV_LIST.filter(c => c.status === 'aktif').length;

  const [activeUsers, setActiveUsers] = useState(142);
  const [ticketSales, setTicketSales] = useState(INITIAL_TICKET_SALES);
  const [pieData, setPieData] = useState(INITIAL_PIE_DATA);
  const [liveTrx, setLiveTrx] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  
  const [sortMethod, setSortMethod] = useState('terbanyak');
  
  const totalTransaksi = pieData.reduce((acc, curr) => acc + curr.value, 0);
  const maxSales = Math.max(...ticketSales.map(t => t.terjual));

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  useEffect(() => {
    setLiveTrx([
      { time: getCurrentTime(), email: 'dina_marlina@hotmail.com', status: 'berhasil' },
      { time: getCurrentTime(), email: 'alexander22@gmail.com', status: 'pending' },
      { time: getCurrentTime(), email: 'budi.antoro@yahoo.com', status: 'gagal' }
    ]);
    
    setLiveAlerts([
      { type: 'danger', title: 'CCTV Offline', desc: 'Koneksi ke CAM-06 terputus', time: getCurrentTime() },
      { type: 'warning', title: 'Payment Gateway', desc: 'Latensi Bank BRI > 500ms', time: getCurrentTime() }
    ]);

    const userInterval = setInterval(() => {
      setActiveUsers(prev => Math.max(1, prev + (Math.floor(Math.random() * 21) - 10)));
      setTotalRegisterToday(prev => prev + Math.floor(Math.random() * 5));
    }, 60000);

    const trxInterval = setInterval(() => {
      const trxCount = Math.floor(Math.random() * 10) + 5; 
      
      let newBerhasil = 0;
      let newPending = 0;
      let newGagal = 0;
      const newLogs = [];

      for(let i=0; i<trxCount; i++) {
        const randStatus = Math.random();
        let statusTrx = 'berhasil';

        if (randStatus > 0.9) {
          statusTrx = 'gagal';
          newGagal++;
        } else if (randStatus > 0.75) {
          statusTrx = 'pending';
          newPending++;
        } else {
          newBerhasil++;
        }

        if (newLogs.length < 5) {
          const email = DUMMY_EMAILS[Math.floor(Math.random() * DUMMY_EMAILS.length)];
          newLogs.push({ time: getCurrentTime(), email, status: statusTrx });
        }
      }

      setPieData(prev => [
        { ...prev[0], value: prev[0].value + newBerhasil },
        { ...prev[1], value: prev[1].value + newPending },
        { ...prev[2], value: prev[2].value + newGagal },
      ]);

      setLiveTrx(prev => [...newLogs, ...prev].slice(0, 8));

      setTicketSales(prevSales => {
        const newSales = [...prevSales];
        for(let i=0; i<newBerhasil; i++) {
            const randomIndex = Math.floor(Math.random() * newSales.length);
            const qty = Math.floor(Math.random() * 4) + 1; 
            newSales[randomIndex] = {
              ...newSales[randomIndex],
              terjual: newSales[randomIndex].terjual + qty
            };
        }
        return newSales; 
      });

    }, 60000); 

    const alertInterval = setInterval(() => {
      const hasNewError = Math.random() > 0.6; 
      if (hasNewError) {
        setLiveAlerts(prev => {
          const errIndex = Math.floor(Math.random() * DUMMY_ERRORS.length);
          const newAlert = { ...DUMMY_ERRORS[errIndex], time: getCurrentTime() };
          return [newAlert, ...prev].slice(0, 6); 
        });
      }
    }, 60000);

    return () => {
      clearInterval(userInterval);
      clearInterval(trxInterval);
      clearInterval(alertInterval);
    };
  }, []);

  const getDisplayedTickets = () => {
    const rankedData = [...ticketSales]
      .sort((a, b) => b.terjual - a.terjual)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    if (sortMethod === 'az') {
      return rankedData.sort((a, b) => a.wisata.localeCompare(b.wisata));
    }
    return rankedData;
  };

  const displayedTickets = getDisplayedTickets();

  return (
    <>
      <Topbar title="SmartCity Monitoring Center" subtitle="Monitoring user, transaksi, trending, dan CCTV real-time" />
      <div className="page-content section-gap">

        {/* ── 1. Top Stats Cards ────────────────────────────────── */}
        <div className="grid-4" style={{ marginBottom: 20 }}>
          <StatCard 
            label="Register Hari Ini" 
            value={totalRegisterToday} 
            changeText="+4% dari kemarin" changeType="up" 
            color="#f59e0b" bg="rgba(245,158,11,.12)" delay="0s" 
          />
          
          <StatCard 
            label="User Aktif Real-time" 
            value={activeUsers} 
            changeText="Fluktuasi per menit" 
            color="#22c55e" bg="rgba(34,197,94,.12)" delay="0.08s"
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
          </StatCard>

          <StatCard 
            label="Kamera CCTV Aktif" 
            value={`${cctvAktif} / ${CCTV_LIST.length}`} 
            changeText={`${CCTV_LIST.length - cctvAktif} kamera offline`} 
            changeType={cctvAktif < CCTV_LIST.length ? 'down' : 'up'} 
            color={cctvAktif < CCTV_LIST.length ? '#ef4444' : '#3b82f6'} 
            bg={cctvAktif < CCTV_LIST.length ? 'rgba(239,68,68,.12)' : 'rgba(59,130,246,.12)'} 
            delay="0.16s" 
          />

          <StatCard 
            label="Total Transaksi" 
            value={<span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{totalTransaksi.toLocaleString()}</span>} 
            changeText="Update per menit" changeType="up" 
            color="#4072af" bg="#dae2ef" delay="0.24s" 
          />
        </div>

        {/* ── 2. Live CCTV Monitoring (12 Kamera) ───────────────── */}
        <Card 
          title="Live Monitoring CCTV Keseluruhan" 
          subtitle={`Menampilkan ${CCTV_LIST.length} titik pemantauan`} 
          rightElement={<Badge variant="success" dot>Streaming</Badge>} 
          delay="0.28s" 
          style={{ marginBottom: 20 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {CCTV_LIST.map((cam, idx) => <CctvCam key={idx} cam={cam} />)}
          </div>
        </Card>

        {/* ── 3. Live Logs: Transaksi & Alerts ──────────────────── */}
        <div className="grid-2" style={{ marginBottom: 20 }}>
          
          <Card 
            title="Live Aktivitas Transaksi" 
            subtitle="Log aktivitas per menit" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4072af', display: 'inline-block', animation: 'pulse-ring 1s infinite' }} />} 
            delay="0.32s"
          >
            <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Log Aktivitas</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveTrx.map((item, index) => (
                    <tr key={index} style={{ borderBottom: index < liveTrx.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '12px 0', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.time}</td>
                      <td style={{ padding: '12px 0', fontSize: 12, color: '#334155' }}>
                        <span style={{ fontWeight: 600 }}>{item.email}</span> melakukan transaksi
                      </td>
                      <td style={{ padding: '12px 0', textAlign: 'right' }}>
                        <Badge variant={item.status === 'berhasil' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card 
            title="Live Alert Error" 
            subtitle="Log anomali dan error per menit" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'blink 1.5s infinite' }} />} 
            delay="0.36s"
          >
            <div style={{ maxHeight: 280, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Pesan Error</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Tingkat</th>
                  </tr>
                </thead>
                <tbody>
                  {liveAlerts.map((a, i) => (
                    <tr key={i} style={{ borderBottom: i < liveAlerts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                       <td style={{ padding: '12px 0', fontSize: 12, color: '#ef4444', fontFamily: 'monospace', width: '70px' }}>{a.time}</td>
                       <td style={{ padding: '12px 0', fontSize: 12, color: a.type === 'danger' ? '#646464' : '#646464'}}>
                          <span style={{display: 'block', fontWeight: 'bold'}}>{a.title}</span>
                          <span style={{fontSize: 11}}>{a.desc}</span>
                       </td>
                       <td style={{ padding: '12px 0', textAlign: 'right' }}>
                         <Badge variant={a.type === 'danger' ? 'danger' : 'warning'}>
                           {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                         </Badge>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* ── 4. Visualisasi Data: Tabel Pembelian & Pie Chart ──── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 20, marginBottom: 20 }}>
          
          <Card 
            title="Pembelian Tiket per Wisata" 
            subtitle="Penjualan bertambah per menit" 
            rightElement={
              <select 
                value={sortMethod} 
                onChange={(e) => setSortMethod(e.target.value)}
                style={{ 
                  padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0', 
                  fontSize: 12, outline: 'none', background: '#f8fafc', color: '#475569', cursor: 'pointer'
                }}
              >
                <option value="terbanyak">Terbanyak</option>
                <option value="az">A - Z</option>
              </select>
            }
            delay="0.4s"
          >
            <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 10, paddingRight: 4 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 8px', fontWeight: 600, position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: '1px solid var(--card-border)' }}>Rank</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600, position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: '1px solid var(--card-border)' }}>Destinasi Wisata</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600, position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: '1px solid var(--card-border)' }}>Terjual</th>
                    <th style={{ padding: '10px 8px', fontWeight: 600, position: 'sticky', top: 0, background: '#fff', zIndex: 10, borderBottom: '1px solid var(--card-border)' }}>Indikator Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTickets.map((item) => (
                    <tr key={item.wisata} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 700, color: item.rank <= 3 ? '#4072af' : '#94a3b8' }}>
                        #{item.rank}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 500, color: '#334155' }}>
                        {item.wisata}
                      </td>
                      <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 600, color: '#4072af', fontFamily: 'monospace' }}>
                        {item.terjual.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 8px', width: '35%' }}>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${(item.terjual / maxSales) * 100}%`, 
                              background: item.rank <= 3 ? '#4072af' : '#cbd5e1', 
                              borderRadius: 4, 
                              transition: 'width 0.4s ease' 
                            }} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Distribusi Transaksi" delay="0.44s">
            <div style={{ height: 280, marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="40%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" animationDuration={500}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* ── 5. Trending Lists ─────────────────────────────────── */}
        <div className="grid-2">
          
          <Card title="Trending Topik Utama" rightElement={<Badge variant="info">By Search</Badge>} delay="0.48s">
            {TRENDING_TOPIC.map((t) => (
              <div key={t.rank} className="trending-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: t.rank <= 3 ? '#4072af' : '#e2e8f0', color: t.rank <= 3 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', marginRight: 12 }}>
                  {t.rank}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.topic}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.count.toLocaleString()}x</div>
              </div>
            ))}
          </Card>

          <Card title="Trending Lokasi Destinasi" rightElement={<Badge variant="success">By Search</Badge>} delay="0.52s">
            {TRENDING_LOCATION.map((t) => (
              <div key={t.rank} className="trending-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: t.rank <= 3 ? '#22c55e' : '#e2e8f0', color: t.rank <= 3 ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', marginRight: 12 }}>
                  {t.rank}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.topic}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.count.toLocaleString()}x</div>
              </div>
            ))}
          </Card>

        </div>

      </div>
    </>
  );
}