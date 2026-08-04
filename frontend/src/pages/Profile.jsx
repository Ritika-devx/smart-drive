import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import { useAuth } from '../context/AuthContext';
import {
  Camera, Edit3, Mail, Calendar, Phone, MapPin, UserCircle, Lock, Clock, Shield,
  Palette, Bell, Globe, Moon, Sun, FolderOpen, HardDrive, Copy, Star,
  Activity, FileText, LogOut, Check,
} from 'lucide-react';

function stringToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function LocalAvatar({ name, gender }) {
  const hue = stringToHue(name || 'User');
  const skinTones = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642'];
  const skin = skinTones[Math.abs(hue) % skinTones.length];
  const hairColors = ['#3b2417', '#5a3825', '#1c1c1c', '#7a4a2a', '#2b1b12'];
  const hair = hairColors[(hue + 2) % hairColors.length];
  const bgHue = (hue + 40) % 360;

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <radialGradient id={`bg-${hue}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor={`hsl(${bgHue}, 70%, 88%)`} />
          <stop offset="100%" stopColor={`hsl(${bgHue}, 55%, 78%)`} />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#bg-${hue})`} />

      {/* shoulders/shirt */}
      <path d="M18 100 Q18 74 50 74 Q82 74 82 100 Z" fill={gender === 'male' ? '#3b4a63' : '#c65b7c'} />

      {/* neck */}
      <rect x="43" y="62" width="14" height="14" fill={skin} />

      {/* face */}
      <ellipse cx="50" cy="46" rx="22" ry="24" fill={skin} />

      {/* ears */}
      <circle cx="27" cy="47" r="4" fill={skin} />
      <circle cx="73" cy="47" r="4" fill={skin} />

      {/* hair back */}
      {gender === 'male' ? (
        <path d="M28 40 Q26 16 50 15 Q74 16 72 40 Q72 26 50 24 Q28 26 28 40 Z" fill={hair} />
      ) : (
        <path d="M24 42 Q18 12 50 11 Q82 12 76 42 Q78 60 74 78 Q68 55 68 40 Q60 48 50 32 Q40 48 32 40 Q32 55 26 78 Q22 60 24 42 Z" fill={hair} />
      )}

      {/* eyebrows */}
      <path d="M38 40 Q42 37 46 39" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M54 39 Q58 37 62 40" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* eyes */}
      <circle cx="42" cy="46" r="2.8" fill="#2a2a2a" />
      <circle cx="58" cy="46" r="2.8" fill="#2a2a2a" />
      <circle cx="42.9" cy="45" r="0.8" fill="#fff" />
      <circle cx="58.9" cy="45" r="0.8" fill="#fff" />

      {/* nose */}
      <path d="M49 48 Q48 53 50 54" stroke="#c98a5e" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* mouth */}
      <path d="M43 58 Q50 63 57 58" stroke="#9a4f45" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* blush */}
      <ellipse cx="36" cy="53" rx="3.5" ry="2" fill="#e8909a" opacity="0.5" />
      <ellipse cx="64" cy="53" rx="3.5" ry="2" fill="#e8909a" opacity="0.5" />
    </svg>
  );
}

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const username = storedUser?.name || storedUser?.username || 'User';
  const email = storedUser?.email || 'Not set';

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const [gender, setGender] = useState(storedUser?.gender || 'female');

  const updateGender = (g) => {
    setGender(g);
    const updated = { ...(storedUser || {}), gender: g };
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [theme] = useState(document.querySelector('.sd-root')?.dataset.theme || 'light');

  // Placeholders — wire to a real /api/profile or /api/dashboard endpoint later
  const stats = {
    filesUploaded: 0,
    storageUsed: '0.0 B',
    storageTotal: '10 GB',
    duplicatesRemoved: 0,
  };
  const usedPercent = 0;

  return (
    <div className="sd-profile-container">
      <div className="sd-profile-page-title">
        <h1 className="sd-h1" style={{ fontSize: '26px', margin: '0 0 4px' }}>My Profile</h1>
        <p style={{ color: 'var(--sd-text-mid)', fontSize: '13.5px', margin: 0 }}>
          Manage your account and personal preferences
        </p>
      </div>

      {/* ---- Hero ---- */}
      <div className="sd-profile-hero">
        <div className="sd-profile-hero-left">
          <div className="sd-profile-avatar-wrap">
            <div className="sd-profile-avatar" style={{ background: 'var(--sd-glass-strong)', overflow: 'hidden', padding: 0 }}>
              <LocalAvatar name={username} gender={gender} />
            </div>
            <div className="sd-profile-avatar-cam"><Camera size={13} /></div>
          </div>
          <div>
            <div className="sd-profile-name-row">
              <span className="sd-h1" style={{ fontSize: '20px' }}>{username}</span>
              <span className="sd-profile-plan-badge">Free Plan</span>
            </div>
            <div className="sd-profile-meta-row"><Mail size={13} /> {email}</div>
            <div className="sd-profile-meta-row"><Calendar size={13} /> Member since July 2026</div>
          </div>
        </div>

        <div style={{ minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Star size={20} color="var(--sd-violet)" />
            <div>
              <div style={{ fontSize: '11px', color: 'var(--sd-text-low)' }}>Current Plan</div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--sd-text-hi)' }}>Free Plan</div>
            </div>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--sd-text-mid)', marginBottom: '12px' }}>
            Upgrade anytime to unlock more features and storage.
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--sd-text-mid)', marginBottom: '4px' }}>Storage Used</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--sd-text-hi)' }}>{stats.storageUsed} of {stats.storageTotal}</span>
          </div>
          <div className="sd-upload-progress-track" style={{ marginBottom: '12px' }}>
            <div className="sd-upload-progress-fill sd-upload-progress-fill-active" style={{ width: `${usedPercent}%` }} />
          </div>

          <button className="sd-upload-btn sd-upload-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <Star size={14} /> Upgrade Plan
          </button>
        </div>
      </div>

      {/* ---- Stats ---- */}
      <div className="sd-profile-stats-row">
        <div className="sd-profile-stat-card">
          <div className="sd-profile-stat-icon sd-profile-stat-icon-blue"><FolderOpen size={18} /></div>
          <div>
            <div className="sd-profile-stat-num">{stats.filesUploaded}</div>
            <div className="sd-profile-stat-label">Files Uploaded</div>
            <div className="sd-profile-stat-sub">All your files</div>
          </div>
        </div>
        <div className="sd-profile-stat-card">
          <div className="sd-profile-stat-icon sd-profile-stat-icon-green"><HardDrive size={18} /></div>
          <div>
            <div className="sd-profile-stat-num">{stats.storageUsed}</div>
            <div className="sd-profile-stat-label">Storage Used</div>
            <div className="sd-profile-stat-sub">Of {stats.storageTotal}</div>
          </div>
        </div>
        <div className="sd-profile-stat-card">
          <div className="sd-profile-stat-icon sd-profile-stat-icon-amber"><Copy size={18} /></div>
          <div>
            <div className="sd-profile-stat-num">{stats.duplicatesRemoved}</div>
            <div className="sd-profile-stat-label">Duplicates Removed</div>
            <div className="sd-profile-stat-sub">Files cleaned</div>
          </div>
        </div>
        <div className="sd-profile-stat-card">
          <div className="sd-profile-stat-icon sd-profile-stat-icon-violet"><Star size={18} /></div>
          <div>
            <div className="sd-profile-stat-label">Free Plan</div>
            <div className="sd-profile-stat-sub">Current Plan</div>
            <div className="sd-profile-stat-sub">Upgrade anytime</div>
          </div>
        </div>
      </div>

      {/* ---- Personal Info + Security/Preferences ---- */}
      <div className="sd-profile-grid">
        <div className="sd-profile-card">
          <div className="sd-profile-card-header">
            <div className="sd-profile-card-title"><UserCircle size={16} /> Personal Information</div>
          </div>

          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><UserCircle size={15} /></div>
            <div><div className="sd-profile-field-label">Full Name</div><div className="sd-profile-field-value">{username}</div></div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><Mail size={15} /></div>
            <div><div className="sd-profile-field-label">Email Address</div><div className="sd-profile-field-value">{email}</div></div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><Phone size={15} /></div>
            <div><div className="sd-profile-field-label">Phone Number</div><div className="sd-profile-field-value">Not set</div></div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><MapPin size={15} /></div>
            <div><div className="sd-profile-field-label">Location</div><div className="sd-profile-field-value">Not set</div></div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><UserCircle size={15} /></div>
            <div><div className="sd-profile-field-label">Account Type</div><div className="sd-profile-field-value">Personal</div></div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><UserCircle size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="sd-profile-field-label">Avatar Style</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button
                  className="sd-upload-btn"
                  style={{ fontSize: '11.5px', padding: '5px 10px', background: gender === 'female' ? 'var(--sd-grad-primary)' : undefined, color: gender === 'female' ? '#fff' : undefined, borderColor: gender === 'female' ? 'transparent' : undefined }}
                  onClick={() => updateGender('female')}
                >
                  Female
                </button>
                <button
                  className="sd-upload-btn"
                  style={{ fontSize: '11.5px', padding: '5px 10px', background: gender === 'male' ? 'var(--sd-grad-primary)' : undefined, color: gender === 'male' ? '#fff' : undefined, borderColor: gender === 'male' ? 'transparent' : undefined }}
                  onClick={() => updateGender('male')}
                >
                  Male
                </button>
              </div>
            </div>
          </div>

          <div className="sd-profile-card-footer">
            <button className="sd-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <Edit3 size={14} /> Edit Information
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="sd-profile-card">
            <div className="sd-profile-card-header">
              <div className="sd-profile-card-title"><Shield size={16} /> Security</div>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon"><Lock size={15} /></div>
              <div style={{ flex: 1 }}><div className="sd-profile-field-label">Password</div><div className="sd-profile-field-value">••••••••••••</div></div>
              <button className="sd-upload-btn" style={{ fontSize: '11.5px', padding: '6px 10px' }}>Change Password</button>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon"><Clock size={15} /></div>
              <div><div className="sd-profile-field-label">Last changed</div><div className="sd-profile-field-value">Not tracked yet</div></div>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon"><Shield size={15} /></div>
              <div style={{ flex: 1 }}>
                <div className="sd-profile-field-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Two-Factor Authentication <span className="sd-profile-plan-badge" style={{ fontSize: '9px', padding: '1px 6px' }}>Soon</span>
                </div>
                <div className="sd-profile-field-value" style={{ fontWeight: 400, fontSize: '11.5px', color: 'var(--sd-text-low)' }}>Add an extra layer of security</div>
              </div>
              <button className={`sd-profile-toggle ${twoFA ? 'on' : ''}`} disabled onClick={() => setTwoFA(!twoFA)}>
                <span className="sd-profile-toggle-knob" />
              </button>
            </div>
          </div>

          <div className="sd-profile-card">
            <div className="sd-profile-card-header">
              <div className="sd-profile-card-title"><Palette size={16} /> Preferences</div>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon">{theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}</div>
              <div style={{ flex: 1 }}><div className="sd-profile-field-value">Theme</div></div>
              <div style={{ fontSize: '12.5px', color: 'var(--sd-text-mid)' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon"><Bell size={15} /></div>
              <div style={{ flex: 1 }}><div className="sd-profile-field-value">Notifications</div></div>
              <button className={`sd-profile-toggle ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}>
                <span className="sd-profile-toggle-knob" />
              </button>
            </div>
            <div className="sd-profile-field-row">
              <div className="sd-profile-field-icon"><Globe size={15} /></div>
              <div style={{ flex: 1 }}><div className="sd-profile-field-value">Language</div></div>
              <div style={{ fontSize: '12.5px', color: 'var(--sd-text-mid)' }}>English</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Storage donut + Activity ---- */}
      <div className="sd-profile-grid">
        <div className="sd-profile-card">
          <div className="sd-profile-card-header">
            <div className="sd-profile-card-title"><HardDrive size={16} /> Storage Usage</div>
          </div>
          <div className="sd-profile-donut-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="38" fill="none" stroke="var(--sd-glass-border)" strokeWidth="10" />
              <circle
                cx="45" cy="45" r="38" fill="none" stroke="var(--sd-blue)" strokeWidth="10"
                strokeDasharray={`${usedPercent * 2.39} 239`} strokeLinecap="round" transform="rotate(-90 45 45)"
              />
              <text x="45" y="42" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--sd-text-hi)">{usedPercent}%</text>
              <text x="45" y="56" textAnchor="middle" fontSize="9" fill="var(--sd-text-low)">Used</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'var(--sd-blue)', fontWeight: 600, marginBottom: '8px' }}>
                {stats.storageUsed} of {stats.storageTotal} Used
              </div>
              <div className="sd-profile-donut-legend-row">
                <span><span className="sd-profile-donut-dot" style={{ background: 'var(--sd-blue)' }} />Used</span>
                <span style={{ fontWeight: 600 }}>{stats.storageUsed}</span>
              </div>
              <div className="sd-profile-donut-legend-row">
                <span><span className="sd-profile-donut-dot" style={{ background: 'var(--sd-glass-border)' }} />Available</span>
                <span style={{ fontWeight: 600 }}>{stats.storageTotal}</span>
              </div>
            </div>
          </div>
          <div className="sd-profile-card-footer">
            <button className="sd-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
              View Detailed Breakdown
            </button>
          </div>
        </div>

        <div className="sd-profile-card">
          <div className="sd-profile-card-header">
            <div className="sd-profile-card-title"><Activity size={16} /> Recent Activity</div>
            <button className="sd-upload-btn" style={{ fontSize: '11.5px', padding: '5px 10px' }}>View All</button>
          </div>
          <div className="sd-profile-empty">
            <FileText size={40} color="var(--sd-text-low)" strokeWidth={1.3} />
            <div className="sd-profile-empty-title">No recent activity</div>
            <div className="sd-profile-empty-sub">Your recent actions will appear here</div>
          </div>
        </div>
      </div>

      {/* ---- Bottom actions ---- */}
      <div className="sd-profile-actions">
        <button className="sd-upload-btn" onClick={handleLogout}><LogOut size={14} /> Logout</button>
        <button className="sd-upload-btn sd-upload-btn-primary"><Check size={14} /> Save Changes</button>
      </div>
    </div>
  );
}