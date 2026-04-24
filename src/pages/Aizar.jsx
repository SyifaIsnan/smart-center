import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/* ── Data Statis & Initial State ────────────────────────── */
const DUMMY_USERS = ['Budi S.', 'Siti A.', 'Rizky M.', 'Dina F.', 'Agus T.', 'Nisa R.', 'Hendra K.', 'Zaki A.', 'Nadya P.'];
const ERROR_TYPES = [
  { type: 'warning', title: 'Login Gagal', desc: 'Percobaan login gagal 3x (Salah PIN)' },
  { type: 'danger', title: 'Pembayaran Gagal', desc: 'Timeout dari Payment Gateway' },
  { type: 'warning', title: 'QR Gagal', desc: 'Gagal generate QRIS dinamis' },
  { type: 'critical', title: 'NFC Mati', desc: 'Service NFC Reader tidak merespon' },
];

const TRX_TYPES = [
  { type: 'topup', name: 'Top Up VA BCA', range: [50000, 1500000] },
  { type: 'topup', name: 'Top Up VA Mandiri', range: [50000, 1000000] },
  { type: 'payment', name: 'Bayar QRIS Toko', range: [15000, 350000] },
  { type: 'payment', name: 'Transfer Antar Bank', range: [50000, 2500000] },
  { type: 'payment', name: 'Bayar Tagihan PLN', range: [100000, 800000] },
];

const INITIAL_CASHFLOW = Array.from({ length: 15 }).map((_, i) => ({
  time: `10:${String(10 + i).padStart(2, '0')}`,
  pemasukan: Math.floor(Math.random() * 5000000) + 1000000,
  pengeluaran: Math.floor(Math.random() * 4000000) + 500000,
}));

const INITIAL_TRX_PER_JAM = [
  { jam: '07:00', topup: 124, payment: 89 },
  { jam: '08:00', topup: 210, payment: 178 },
  { jam: '09:00', topup: 340, payment: 290 },
  { jam: '10:00', topup: 480, payment: 412 },
  { jam: '11:00', topup: 390, payment: 355 },
  { jam: '12:00', topup: 520, payment: 480 },
  { jam: '13:00', topup: 310, payment: 270 },
  { jam: '14:00', topup: 445, payment: 398 },
];

const INITIAL_LOGINS = [
  { time: '10:24', ip: '114.12.55.1', user: 'admin_root', attempts: 8, status: 'blocked' },
  { time: '10:22', ip: '103.145.22.8', user: 'dina_f', attempts: 2, status: 'failed' },
  { time: '10:20', ip: '192.168.1.10', user: 'budi_s', attempts: 1, status: 'success' },
];

const INITIAL_FRAUD_USERS = [
  { user: 'anon_99', score: 92, flag: 'Multiple IPs in 5m', time: '10:25' },
  { user: 'test_bot', score: 88, flag: 'High Trx Frequency', time: '10:21' },
  { user: 'joko_w', score: 75, flag: 'Unusual Amount', time: '10:15' },
];

const INITIAL_PENDING_QUEUE = [
  { id: 'TX-921', user: 'Agus T.', amount: 150000, time: '10:26', gateway: 'BCA' },
  { id: 'TX-922', user: 'Nisa R.', amount: 50000, time: '10:25', gateway: 'QRIS' },
  { id: 'TX-923', user: 'Budi S.', amount: 350000, time: '10:20', gateway: 'Mandiri' },
];

export default function Aizar() {
  const [registerToday, setRegisterToday] = useState(1284);
  const [activeUsers, setActiveUsers] = useState(3420);

  const [totalTrxToday, setTotalTrxToday] = useState(8420);
  const [avgTrxPerUser, setAvgTrxPerUser] = useState(2.46);

  const [liveRegisters, setLiveRegisters] = useState([]);
  const [liveCashflow, setLiveCashflow] = useState(INITIAL_CASHFLOW);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [liveTransactions, setLiveTransactions] = useState([]);

  const [apiLatency, setApiLatency] = useState(45);
  const [successRate, setSuccessRate] = useState(99.2);

  const [uptimeSeconds, setUptimeSeconds] = useState(14 * 86400 + 5 * 3600 + 32 * 60);
  const [loginAttempts, setLoginAttempts] = useState(INITIAL_LOGINS);
  const [fraudLog, setFraudLog] = useState(INITIAL_FRAUD_USERS);
  const [pendingQueue, setPendingQueue] = useState(INITIAL_PENDING_QUEUE);
  const [pendingVolume, setPendingVolume] = useState(12500000);

  const [trxPerJam, setTrxPerJam] = useState(INITIAL_TRX_PER_JAM);

  const getCurrentTime = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  const getChartTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  const formatUptime = (totalSeconds) => {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  useEffect(() => {
    setLiveRegisters([
      { time: getCurrentTime(), name: 'Alex W.', phone: '+62 812-****-9901', status: 'verified' },
      { time: getCurrentTime(), name: 'Bambang P.', phone: '+62 857-****-1122', status: 'pending' },
    ]);
    setLiveAlerts([
      { type: 'warning', title: 'QR Gagal', desc: 'Gagal membaca QR dari Merchant A', time: getCurrentTime() }
    ]);
    setLiveTransactions([
      { time: getCurrentTime(), user: 'Dina F.', action: 'Bayar QRIS Toko', type: 'payment', amount: 45000 },
      { time: getCurrentTime(), user: 'Rizky M.', action: 'Top Up VA BCA', type: 'topup', amount: 500000 },
    ]);

    const metricsInterval = setInterval(() => {
      const newLatency = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
      setApiLatency(newLatency);
      setUptimeSeconds(prev => prev + 60);
      setSuccessRate(prev => {
        const drop = Math.random() > 0.8 ? (Math.random() * 0.5) : -(Math.random() * 0.2);
        const newVal = prev - drop;
        return newVal > 100 ? 100 : newVal < 95 ? 96 : Number(newVal.toFixed(2));
      });
      setPendingVolume(prev => Math.max(5000000, prev + (Math.floor(Math.random() * 5000000) - 2500000)));
      const addedTrx = Math.floor(Math.random() * 30) + 10;
      setTotalTrxToday(prev => {
        const newTotal = prev + addedTrx;
        setAvgTrxPerUser(Number((newTotal / (registerToday + Math.floor(Math.random() * 5))).toFixed(2)));
        return newTotal;
      });
    }, 60000);

    const regInterval = setInterval(() => {
      const addedUsers = Math.floor(Math.random() * 10) + 5;
      setRegisterToday(prev => prev + addedUsers);
      setLiveRegisters(prev => {
        const name = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
        const phone = `+62 8${Math.floor(Math.random() * 90) + 10}-****-${Math.floor(Math.random() * 9000) + 1000}`;
        const newReg = { time: getCurrentTime(), name, phone, status: Math.random() > 0.3 ? 'verified' : 'pending' };
        return [newReg, ...prev].slice(0, 6);
      });
    }, 60000);

    const trxInterval = setInterval(() => {
      setLiveTransactions(prev => {
        const trxInfo = TRX_TYPES[Math.floor(Math.random() * TRX_TYPES.length)];
        const rawAmount = Math.floor(Math.random() * (trxInfo.range[1] - trxInfo.range[0])) + trxInfo.range[0];
        const amount = Math.round(rawAmount / 1000) * 1000;
        const newTrx = { time: getCurrentTime(), user: DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)], action: trxInfo.name, type: trxInfo.type, amount };
        return [newTrx, ...prev].slice(0, 6);
      });

      setLiveCashflow(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: getChartTime(),
          pemasukan: Math.floor(Math.random() * 8000000) + 2000000,
          pengeluaran: Math.floor(Math.random() * 7000000) + 1000000,
        });
        return newData;
      });

      setActiveUsers(prev => Math.max(1000, prev + (Math.floor(Math.random() * 41) - 20)));

      setTrxPerJam(prev => {
        const newData = [...prev];
        const lastIdx = newData.length - 1;
        newData[lastIdx] = {
          ...newData[lastIdx],
          topup: newData[lastIdx].topup + Math.floor(Math.random() * 20),
          payment: newData[lastIdx].payment + Math.floor(Math.random() * 18),
        };
        return newData;
      });
    }, 60000);

    const alertInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setLiveAlerts(prev => {
          const errIndex = Math.floor(Math.random() * ERROR_TYPES.length);
          return [{ ...ERROR_TYPES[errIndex], time: getCurrentTime() }, ...prev].slice(0, 6);
        });
      }

      if (Math.random() > 0.6) {
        setLoginAttempts(prev => {
          const isBlocked = Math.random() > 0.7;
          const newAttempt = {
            time: getCurrentTime(),
            ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            user: isBlocked ? 'admin' : DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)].replace(' ', '').toLowerCase(),
            attempts: isBlocked ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 3) + 1,
            status: isBlocked ? 'blocked' : 'failed'
          };
          return [newAttempt, ...prev].slice(0, 6);
        });
      }

      if (Math.random() > 0.7) {
        setFraudLog(prev => {
          const flags = ['Proxy IP', 'Velocity Check Failed', 'Unusual Location'];
          const newFraud = {
            user: DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)].replace(' ', '_').toLowerCase(),
            score: Math.floor(Math.random() * 20) + 80,
            flag: flags[Math.floor(Math.random() * flags.length)],
            time: getCurrentTime()
          };
          return [newFraud, ...prev].slice(0, 6);
        });
      }

      setPendingQueue(prev => {
        const newQueue = [...prev];
        if (Math.random() > 0.5 && newQueue.length > 0) newQueue.pop();
        if (Math.random() > 0.4) {
          newQueue.unshift({
            id: `TX-${Math.floor(Math.random() * 900) + 100}`,
            user: DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)],
            amount: Math.floor(Math.random() * 500000) + 20000,
            time: getCurrentTime(),
            gateway: ['BCA', 'QRIS', 'Mandiri', 'OVO'][Math.floor(Math.random() * 4)]
          });
        }
        return newQueue.slice(0, 6);
      });
    }, 60000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(regInterval);
      clearInterval(trxInterval);
      clearInterval(alertInterval);
    };
  }, []);

  const totalTrxChart = trxPerJam.reduce((acc, d) => acc + d.topup + d.payment, 0);

  return (
    <>
      <Topbar title="SmartPay Command Center" subtitle="Enterprise Wallet Operations: Bisnis, Infrastruktur, & Keamanan" />
      <div className="page-content section-gap" style={{ padding: '0 24px 40px' }}>

        {/* ── ROW 1: TOP BIZ STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginTop: 24, marginBottom: 20 }}>
          <StatCard 
            label="Register Hari Ini" 
            value={registerToday.toLocaleString()} 
            changeText="+12% vs Kemarin" changeType="up" 
            color="#3b82f6" bg="rgba(59,130,246,.12)" delay="0s" 
          />
          
          <StatCard 
            label="Active Users (Real-time)" 
            value={activeUsers.toLocaleString()} 
            changeText="Koneksi socket terbuka" 
            color="#22c55e" bg="rgba(34,197,94,.12)" delay="0.1s"
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', animation: 'pulse-ring 2s infinite' }} />
          </StatCard>

          <StatCard 
            label="Volume Pemasukan (In)" 
            value={`Rp ${((liveCashflow[liveCashflow.length - 1]?.pemasukan || 0) / 1000000).toFixed(1)}M`} 
            changeText="Per menit ini" changeType="up" 
            color="#10b981" bg="rgba(16,185,129,.12)" delay="0.2s" 
          />

          <StatCard 
            label="Volume Pengeluaran (Out)" 
            value={`Rp ${((liveCashflow[liveCashflow.length - 1]?.pengeluaran || 0) / 1000000).toFixed(1)}M`} 
            changeText="Per menit ini" changeType="down" 
            color="#ef4444" bg="rgba(239,68,68,.12)" delay="0.3s" 
          />
        </div>

        {/* ── ROW 2: SYSTEM HEALTH & PENDING ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 20 }}>
          <StatCard 
            label="API Latency & Uptime" 
            value={`${apiLatency} ms`} 
            changeText={`Up: ${formatUptime(uptimeSeconds)}`} changeType="up" 
            color={apiLatency > 100 ? '#f59e0b' : '#3b82f6'} bg={apiLatency > 100 ? 'rgba(245,158,11,.12)' : 'rgba(59,130,246,.12)'} delay="0.4s" 
          />

          <StatCard 
            label="Total Transaksi Hari Ini" 
            value={totalTrxToday.toLocaleString()} 
            changeText={`Avg ${avgTrxPerUser}x / user`} changeType="up" 
            color="#6366f1" bg="rgba(99,102,241,.12)" delay="0.6s" 
          />

          <StatCard 
            label="Total Pending Volume" 
            value={`Rp ${(pendingVolume / 1000000).toFixed(1)}M`} 
            changeText={`${pendingQueue.length} Transaksi tertahan`} 
            color="#f59e0b" bg="rgba(245,158,11,.12)" delay="0.7s" 
          />
        </div>

        {/* ── ROW 3: CHARTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
          <Card title="Live Cashflow (IDR)" subtitle="Pemasukan vs Pengeluaran" delay="0.8s">
            <div style={{ height: 280, width: '100%', marginTop: 10 }}>
              <ResponsiveContainer>
                <AreaChart data={liveCashflow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                    <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000000}M`} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} />
                  <Area type="monotone" dataKey="pemasukan" name="In" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                  <Area type="monotone" dataKey="pengeluaran" name="Out" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Volume Transaksi per Jam" subtitle={`Top Up vs Pembayaran — Total: ${totalTrxChart.toLocaleString()} trx`} delay="0.9s">
            <div style={{ height: 280, width: '100%', marginTop: 10 }}>
              <ResponsiveContainer>
                <BarChart data={trxPerJam} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="jam" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value, name) => [value.toLocaleString(), name === 'topup' ? 'Top Up' : 'Pembayaran']} />
                  <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} formatter={(value) => value === 'topup' ? 'Top Up' : 'Pembayaran'} />
                  <Bar dataKey="topup" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={400} />
                  <Bar dataKey="payment" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={400} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ── ROW 4: LOG TABLES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

          {/* Table 1: Registrasi User */}
          <Card 
            title="Registrasi User" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'block', animation: 'pulse-ring 1s infinite' }} />} 
            delay="1.1s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>User Info</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {liveRegisters.map((reg, i) => (
                    <tr key={i} style={{ borderBottom: i < liveRegisters.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 11, color: '#64748b', fontFamily: 'monospace', width: '50px' }}>{reg.time}</td>
                      <td style={{ padding: '10px 0', fontSize: 12 }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#334155' }}>{reg.name}</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>{reg.phone}</span>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <Badge variant={reg.status === 'verified' ? 'success' : 'warning'}>
                          {reg.status === 'verified' ? 'Verified' : 'Pending KYC'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table 2: Live Transaksi */}
          <Card 
            title="Live Transaksi" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'block', animation: 'pulse-ring 1s infinite' }} />} 
            delay="1.2s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Aktivitas</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {liveTransactions.map((trx, i) => (
                    <tr key={i} style={{ borderBottom: i < liveTransactions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 11, color: '#64748b', fontFamily: 'monospace', width: '50px' }}>{trx.time}</td>
                      <td style={{ padding: '10px 0', fontSize: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <Badge variant={trx.type === 'topup' ? 'success' : 'danger'} style={{ minWidth: 0, fontSize: 10, padding: '2px 6px' }}>
                            {trx.type === 'topup' ? 'IN' : 'OUT'}
                          </Badge>
                          <span style={{ fontWeight: 600, color: '#334155', fontSize: 11 }}>{trx.user}</span>
                        </div>
                        <span style={{ fontSize: 10, color: '#64748b' }}>{trx.action}</span>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontSize: 12, fontWeight: 600, color: trx.type === 'topup' ? '#059669' : '#dc2626' }}>
                        {trx.type === 'topup' ? '+' : '-'}{formatRupiah(trx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table 3: Pending Queue */}
          <Card 
            title="Antrean Pending" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'block', animation: 'pulse-ring 1s infinite' }} />} 
            delay="1.3s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Info Trx</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Gateway</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingQueue.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: 20, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>Tidak ada antrean pending</td></tr>
                  ) : pendingQueue.map((item, i) => (
                    <tr key={i} style={{ borderBottom: i < pendingQueue.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 12 }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#334155' }}>{item.user}</span>
                        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>{item.id} • {item.time}</span>
                      </td>
                      <td style={{ padding: '10px 0', fontSize: 11, color: '#475569', fontWeight: 500 }}>{item.gateway}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#d97706' }}>
                        {formatRupiah(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table 4: Alert System */}
          <Card 
            title="Live Alert System" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'blink 1.5s infinite' }} />} 
            delay="1.4s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Pesan Error</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Tingkat</th>
                  </tr>
                </thead>
                <tbody>
                  {liveAlerts.map((a, i) => (
                    <tr key={i} style={{ borderBottom: i < liveAlerts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 11, color: '#ef4444', fontFamily: 'monospace', width: '50px' }}>{a.time}</td>
                      <td style={{ padding: '10px 0', fontSize: 12, color: '#646464' }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#334155' }}>{a.title}</span>
                        <span style={{ fontSize: 10, color: '#64748b' }}>{a.desc}</span>
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <Badge variant={a.type === 'critical' ? 'critical' : a.type === 'danger' ? 'danger' : 'warning'}>
                          {a.type.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table 5: Login Attempts */}
          <Card 
            title="Login Attempts" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block', animation: 'pulse-ring 1.5s infinite' }} />} 
            delay="1.5s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Info & IP</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'center' }}>Hit</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loginAttempts.map((log, i) => (
                    <tr key={i} style={{ borderBottom: i < loginAttempts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 12 }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#334155' }}>{log.user}</span>
                        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>{log.time} • {log.ip}</span>
                      </td>
                      <td style={{ padding: '10px 0', fontSize: 12, fontWeight: 700, textAlign: 'center', color: log.attempts > 3 ? '#ef4444' : '#64748b' }}>
                        {log.attempts}x
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <Badge variant={log.status === 'success' ? 'success' : log.status === 'blocked' ? 'danger' : 'warning'}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Table 6: Fraud Score Board */}
          <Card 
            title="Fraud Score Board" 
            rightElement={<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block', animation: 'blink 1s infinite' }} />} 
            delay="1.6s"
          >
            <div style={{ maxHeight: 220, overflowY: 'auto', paddingRight: 5 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>User / Waktu</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600 }}>Anomaly Flag</th>
                    <th style={{ paddingBottom: 8, fontWeight: 600, textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {fraudLog.map((log, i) => (
                    <tr key={i} style={{ borderBottom: i < fraudLog.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '10px 0', fontSize: 12 }}>
                        <span style={{ display: 'block', fontWeight: 600, color: '#334155' }}>{log.user}</span>
                        <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>{log.time}</span>
                      </td>
                      <td style={{ padding: '10px 0', fontSize: 11, color: '#b45309', fontWeight: 500 }}>{log.flag}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: log.score > 85 ? '#dc2626' : '#d97706' }}>
                          {log.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </>
  );
}