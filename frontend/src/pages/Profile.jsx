import React, { useState, useEffect, useRef } from "react";
import { getStorage } from "../services/storageService";
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import { useAuth } from '../context/AuthContext';
import { avatarGradient, avatarInitial } from "../utils/avatar";
import { getToken, getStoredUser } from "../utils/authStorage";
import {
  Camera, Edit3, Mail, Calendar, Phone, MapPin, UserCircle, Lock, Clock, Shield,
  Palette, Globe, Moon, Sun, FolderOpen, HardDrive, Copy,
  LogOut, Check, X, AlertCircle,
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', label: 'India' },
  { code: '+1', label: 'USA/Canada' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'Australia' },
  { code: '+971', label: 'UAE' },
  { code: '+65', label: 'Singapore' },
  { code: '+81', label: 'Japan' },
  { code: '+49', label: 'Germany' },
  { code: '+33', label: 'France' },
  { code: '+86', label: 'China' },
];

function InitialsAvatar({ name }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: avatarGradient(name),
      color: '#fff', fontFamily: 'var(--sd-font-display)', fontSize: '30px', fontWeight: 700,
    }}>
      {avatarInitial(name)}
    </div>
  );
}

// Small helper — every real save goes through this so token/headers/error
// handling stays in one place instead of being duplicated per call site.
async function callUpdateProfile(payload) {
  const token = getToken();
  const res = await fetch('/api/auth/update-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data.user;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
    " " +
    sizes[i]
  );
}

export default function Profile() {
  const storedUser = getStoredUser();
  const fileInputRef = useRef(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  const [photo, setPhoto] = useState(storedUser?.photo || null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState({
    username: storedUser?.username || storedUser?.name || 'User',
    email: storedUser?.email || 'Not set',
    countryCode: storedUser?.countryCode || '+91',
    phone: storedUser?.phone || '',
    location: storedUser?.location || '',
  });
  const [phoneError, setPhoneError] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [saveMsgTone, setSaveMsgTone] = useState('success'); // 'success' | 'warn' | 'error'

  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [storage, setStorage] = useState({
    usedStorage: 0,
    totalStorage: 0,
    availableStorage: 0,
    percentage: 0,
    filesUploaded: 0,
    duplicatesRemoved: 0,
  });

  const flashMsg = (msg, tone = 'success', duration = 2500) => {
    setSaveMsg(msg);
    setSaveMsgTone(tone);
    setTimeout(() => setSaveMsg(null), duration);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const loadStorage = async () => {
    try {
      const data = await getStorage();
      setStorage({
        usedStorage: data.usedStorage,
        totalStorage: data.totalStorage,
        availableStorage: data.availableStorage,
        percentage: data.percentage,
        filesUploaded: data.filesUploaded,
        duplicatesRemoved: data.duplicatesRemoved,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Persists to localStorage AND broadcasts a same-tab event so AppShell
  // (which reads the user from localStorage separately, for the sidebar/topbar
  // avatars) refreshes immediately instead of waiting for a full reload.
  const persistLocalUser = (patch) => {
    const merged = { ...(getStoredUser() || {}), ...patch };
const store = localStorage.getItem('token') ? localStorage : sessionStorage;
store.setItem('user', JSON.stringify(merged));
    window.dispatchEvent(new Event('sd-user-updated'));
    return merged;
  };

  const handlePhotoPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 2 * 1024 * 1024) {
      flashMsg('Image must be under 2MB', 'warn');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setPhoto(dataUrl); // show it immediately, don't wait on the network
      setPhotoSaving(true);
      try {
        const updatedUser = await callUpdateProfile({ photo: dataUrl });
        persistLocalUser(updatedUser);
        flashMsg('Photo saved to your account');
      } catch (err) {
        flashMsg(`Photo upload failed: ${err.message}`, 'error', 4000);
      } finally {
        setPhotoSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = async () => {
    setPhoto(null);
    setPhotoSaving(true);
    try {
      const updatedUser = await callUpdateProfile({ photo: null });
      persistLocalUser(updatedUser);
      flashMsg('Photo removed');
    } catch (err) {
      flashMsg(`Couldn't remove photo: ${err.message}`, 'error', 4000);
    } finally {
      setPhotoSaving(false);
    }
  };

  // Only phone has a hard format requirement. Every other field saves
  // regardless — an invalid phone no longer blocks name/location from saving.
  const saveFields = async () => {
    const phoneInvalid = fields.phone && fields.phone.length !== 10;
    setPhoneError(phoneInvalid);

    const payload = {
      name: fields.username,
      location: fields.location,
    };
    if (!phoneInvalid) {
      payload.phone = fields.phone || null;
    }

    setSaving(true);
    try {
      const updatedUser = await callUpdateProfile(payload);
      persistLocalUser({ ...updatedUser, countryCode: fields.countryCode });
      setIsEditing(false);
      flashMsg(
        phoneInvalid ? 'Saved to your account (phone skipped — must be 10 digits)' : 'Saved to your account',
        phoneInvalid ? 'warn' : 'success',
        phoneInvalid ? 3500 : 2000
      );
    } catch (err) {
      flashMsg(`Save failed: ${err.message}`, 'error', 4000);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setPhoneError(false);
    setFields({
      username: storedUser?.username || storedUser?.name || 'User',
      email: storedUser?.email || 'Not set',
      countryCode: storedUser?.countryCode || '+91',
      phone: storedUser?.phone || '',
      location: storedUser?.location || '',
    });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPwError(null);

    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError('All fields are required');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords don't match");
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError('New password must be at least 6 characters');
      return;
    }

    setPwLoading(true);
    try {
      const token = getToken();
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      setShowPwModal(false);
      setPwForm({ current: '', next: '', confirm: '' });
      flashMsg('Password updated');
    } catch (err) {
      setPwError(err.message || 'Something went wrong');
    } finally {
      setPwLoading(false);
    }
  };

  const closePwModal = () => {
    setShowPwModal(false);
    setPwForm({ current: '', next: '', confirm: '' });
    setPwError(null);
  };

  // Live theme detection: reads the initial value from the .sd-root
  // data-theme attribute, then watches that attribute for changes so the
  // "Theme" row updates immediately when the topbar toggle is clicked —
  // instead of only reflecting whatever the theme was when Profile mounted.
  const [theme, setTheme] = useState(
    () => document.querySelector('.sd-root')?.dataset.theme || 'light'
  );

  useEffect(() => {
    const rootEl = document.querySelector('.sd-root');
    if (!rootEl) return;

    const observer = new MutationObserver(() => {
      setTheme(rootEl.dataset.theme || 'light');
    });

    observer.observe(rootEl, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const stats = {
    filesUploaded: storage.filesUploaded,
    storageUsed: formatBytes(storage.usedStorage),
    storageTotal: formatBytes(storage.totalStorage),
    duplicatesRemoved: storage.duplicatesRemoved,
  };

  const usedPercent = storage.percentage;

  const toneColor = saveMsgTone === 'error' ? 'var(--sd-rose)' : saveMsgTone === 'warn' ? 'var(--sd-amber)' : 'var(--sd-green)';

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
            <div className="sd-profile-avatar" style={{ background: 'var(--sd-glass-strong)', overflow: 'hidden', padding: 0, opacity: photoSaving ? 0.6 : 1 }}>
              {photo ? (
                <img src={photo} alt={fields.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <InitialsAvatar name={fields.username} />
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoPick} style={{ display: 'none' }} />
            <div className="sd-profile-avatar-cam" onClick={() => !photoSaving && fileInputRef.current?.click()} title="Upload photo">
              <Camera size={13} />
            </div>
          </div>
          <div>
            <div className="sd-profile-name-row">
              <span className="sd-h1" style={{ fontSize: '20px' }}>{fields.username}</span>
            </div>
            <div className="sd-profile-meta-row"><Mail size={13} /> {fields.email}</div>
            <div className="sd-profile-meta-row"><Calendar size={13} /> Member since July 2026</div>
            {photo && (
              <button
                onClick={removePhoto}
                disabled={photoSaving}
                style={{ marginTop: '6px', fontSize: '11px', color: 'var(--sd-rose)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Remove photo
              </button>
            )}
          </div>
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
      </div>

      {/* ---- Personal Info + Security/Preferences ---- */}
      <div className="sd-profile-grid">
        <div className="sd-profile-card">
          <div className="sd-profile-card-header">
            <div className="sd-profile-card-title"><UserCircle size={16} /> Personal Information</div>
            {!isEditing && (
              <button className="sd-upload-btn" style={{ fontSize: '11.5px', padding: '5px 10px' }} onClick={() => setIsEditing(true)}>
                <Edit3 size={13} /> Edit
              </button>
            )}
          </div>

          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><UserCircle size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="sd-profile-field-label">Full Name</div>
              {isEditing ? (
                <input
                  value={fields.username}
                  onChange={(e) => setFields({ ...fields, username: e.target.value })}
                  style={{ fontSize: '13.5px', fontWeight: 600, border: '1px solid var(--sd-glass-border)', borderRadius: '6px', padding: '4px 8px', marginTop: '2px', width: '100%', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)' }}
                />
              ) : (
                <div className="sd-profile-field-value">{fields.username}</div>
              )}
            </div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><Mail size={15} /></div>
            <div><div className="sd-profile-field-label">Email Address</div><div className="sd-profile-field-value">{fields.email}</div></div>
          </div>

          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><Phone size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="sd-profile-field-label">Phone Number</div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <select
                    value={fields.countryCode}
                    onChange={(e) => setFields({ ...fields, countryCode: e.target.value })}
                    style={{ fontSize: '13px', fontWeight: 600, border: '1px solid var(--sd-glass-border)', borderRadius: '6px', padding: '4px 6px', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)' }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} {c.label}</option>
                    ))}
                  </select>
                  <input
                    value={fields.phone}
                    placeholder="10 digit number"
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(e) => { setFields({ ...fields, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }); setPhoneError(false); }}
                    style={{
                      fontSize: '13.5px', fontWeight: 600, flex: 1,
                      border: `1px solid ${phoneError || (fields.phone && fields.phone.length !== 10) ? 'var(--sd-rose)' : 'var(--sd-glass-border)'}`,
                      borderRadius: '6px', padding: '4px 8px', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)',
                    }}
                  />
                </div>
              ) : (
                <div className="sd-profile-field-value">
                  {fields.phone ? `${fields.countryCode} ${fields.phone}` : 'Not set'}
                </div>
              )}
              {isEditing && fields.phone && fields.phone.length !== 10 && (
                <div style={{ fontSize: '10.5px', color: 'var(--sd-rose)', marginTop: '3px' }}>
                  Must be exactly 10 digits ({fields.phone.length}/10) — other fields will still save
                </div>
              )}
            </div>
          </div>

          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><MapPin size={15} /></div>
            <div style={{ flex: 1 }}>
              <div className="sd-profile-field-label">Location</div>
              {isEditing ? (
                <input
                  value={fields.location}
                  placeholder="Not set"
                  onChange={(e) => setFields({ ...fields, location: e.target.value })}
                  style={{ fontSize: '13.5px', fontWeight: 600, border: '1px solid var(--sd-glass-border)', borderRadius: '6px', padding: '4px 8px', marginTop: '2px', width: '100%', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)' }}
                />
              ) : (
                <div className="sd-profile-field-value">{fields.location || 'Not set'}</div>
              )}
            </div>
          </div>
          <div className="sd-profile-field-row">
            <div className="sd-profile-field-icon"><UserCircle size={15} /></div>
            <div><div className="sd-profile-field-label">Account Type</div><div className="sd-profile-field-value">Personal</div></div>
          </div>

          <div className="sd-profile-card-footer" style={{ display: 'flex', gap: '8px' }}>
            {isEditing ? (
              <>
                <button className="sd-upload-btn sd-upload-btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveFields} disabled={saving}>
                  <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="sd-upload-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={cancelEdit} disabled={saving}>
                  <X size={14} /> Cancel
                </button>
              </>
            ) : (
              <button className="sd-upload-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsEditing(true)}>
                <Edit3 size={14} /> Edit Information
              </button>
            )}
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
              <button className="sd-upload-btn" style={{ fontSize: '11.5px', padding: '6px 10px' }} onClick={() => setShowPwModal(true)}>Change Password</button>
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
              <button className="sd-profile-toggle" disabled title="Not built yet — needs a backend endpoint">
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
              <div className="sd-profile-field-icon"><Globe size={15} /></div>
              <div style={{ flex: 1 }}><div className="sd-profile-field-value">Language</div></div>
              <div style={{ fontSize: '12.5px', color: 'var(--sd-text-mid)' }}>English</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Storage Usage ---- */}
      <div className="sd-profile-card" style={{ marginBottom: '16px' }}>
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
      </div>

      {/* ---- Bottom actions ---- */}
      <div className="sd-profile-actions">
        <button className="sd-upload-btn" onClick={handleLogout}><LogOut size={14} /> Logout</button>
      </div>

      {/* ---- Toast ---- */}
      {saveMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'var(--sd-glass-strong)', border: `1px solid ${toneColor}`,
          borderRadius: '9px', padding: '10px 14px', fontSize: '12.5px', maxWidth: '340px',
          color: 'var(--sd-text-hi)', boxShadow: 'var(--sd-shadow-card)', zIndex: 200,
          display: 'flex', alignItems: 'center', gap: '7px',
        }}>
          {saveMsgTone === 'error' ? <AlertCircle size={14} color={toneColor} /> : <Check size={14} color={toneColor} />}
          {saveMsg}
        </div>
      )}

      {/* ---- Change Password Modal ---- */}
      {showPwModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,12,24,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div className="sd-profile-card" style={{ padding: '24px', width: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--sd-blue)" />
                <span className="sd-h1" style={{ fontSize: '16px' }}>Change Password</span>
              </div>
              <button className="sd-upload-btn sd-upload-btn-icon" onClick={closePwModal}><X size={16} /></button>
            </div>

            <form onSubmit={submitPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: 'var(--sd-text-low)', display: 'block', marginBottom: '4px' }}>Current Password</label>
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--sd-glass-border)', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: 'var(--sd-text-low)', display: 'block', marginBottom: '4px' }}>New Password</label>
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--sd-glass-border)', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: 'var(--sd-text-low)', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--sd-glass-border)', background: 'var(--sd-glass)', color: 'var(--sd-text-hi)', fontSize: '13px' }}
                />
              </div>

              {pwError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sd-rose)', fontSize: '12px', background: 'rgba(225,29,72,0.08)', padding: '8px 10px', borderRadius: '8px' }}>
                  <AlertCircle size={14} /> {pwError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button type="submit" className="sd-upload-btn sd-upload-btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={pwLoading}>
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button type="button" className="sd-upload-btn" style={{ flex: 1, justifyContent: 'center' }} onClick={closePwModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}