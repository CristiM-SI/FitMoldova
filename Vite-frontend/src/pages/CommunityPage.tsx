import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useDashboardData } from '../context/useDashboardData';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { 
    SPORTS, SPORT_CHIPS, INITIAL_CHALLENGES, MEMBERS, MEMBER_POSTS,
} from '../services/mock/community';
import type {
    Sport, FeedTab, Post, Challenge, ToastState, Member,
} from '../services/mock/community';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

interface CircleProgressProps { pct: number; uid: string; }
function CircleProgress({ pct, uid }: CircleProgressProps) {
    const r = 28;
    const circ = 2 * Math.PI * r;
    return (
        <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx="35" cy="35" r={r} fill="none"
                    stroke={`url(#g-${uid})`} strokeWidth="6"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - pct / 100)}
                    strokeLinecap="round"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
                <defs>
                    <linearGradient id={`g-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#1a6fff" />
                        <stop offset="100%" stopColor="#00c8ff" />
                    </linearGradient>
                </defs>
            </svg>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', fontWeight: 900, color: 'var(--cyan)',
            }}>
                {pct}%
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');

  .fm *, .fm *::before, .fm *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fm {
    --bg:       #050d1a;
    --card:     #0a1628;
    --card2:    #0d1f3a;
    --blue:     #1a6fff;
    --cyan:     #00c8ff;
    --cdim:     rgba(0,200,255,0.10);
    --bdim:     rgba(26,111,255,0.12);
    --text:     #e8f0fe;
    --muted:    #5a7aa0;
    --border:   rgba(0,200,255,0.12);
    --radius:   14px;
    font-family: 'Barlow', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .fm::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  /* ── TOPNAV ── */
  .fm-topnav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 64px;
    background: rgba(5,13,26,0.95);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .fm-logo { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 1.45rem; letter-spacing: 1px; color: #fff; cursor: pointer; }
  .fm-logo span { color: var(--cyan); }
  .fm-topnav-links { display: flex; gap: 28px; list-style: none; }
  .fm-topnav-links a {
    color: var(--muted); text-decoration: none; font-size: .8rem;
    font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    transition: color .2s; cursor: pointer;
  }
  .fm-topnav-links a:hover { color: #fff; }
  .fm-topnav-links a.active { color: var(--cyan); }
  .fm-topnav-actions { display: flex; gap: 10px; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border-radius: 8px;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    font-size: .85rem; letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer; transition: all .2s; border: none;
  }
  .btn-outline { border: 1.5px solid var(--cyan); color: var(--cyan); background: transparent; }
  .btn-outline:hover { background: var(--cdim); }
  .btn-solid { background: var(--blue); color: #fff; }
  .btn-solid:hover { background: #2a7fff; box-shadow: 0 0 24px rgba(26,111,255,.5); }

  /* ── LAYOUT ── */
  .fm-body {
    position: relative; z-index: 1; flex: 1;
    display: flex; max-width: 1340px; margin: 0 auto;
    width: 100%; padding: 28px; gap: 24px;
  }

  /* ── LEFT SIDEBAR ── */
  .fm-leftnav { width: 220px; flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
  .leftnav-section-title {
    font-size: .68rem; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted);
    padding: 4px 12px 6px;
  }
  .nav-divider { height: 1px; background: var(--border); margin: 6px 0; }

  /* profile chip in sidebar */
  .profile-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; background: var(--card2);
    border-radius: 10px; border: 1px solid var(--border);
    margin-bottom: 6px; cursor: pointer; transition: border-color .2s;
  }
  .profile-chip:hover { border-color: rgba(0,200,255,.25); }
  .profile-chip-ava {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: .85rem; color: #fff; flex-shrink: 0;
  }
  .profile-chip-name { font-weight: 700; font-size: .88rem; }
  .profile-chip-tag  { font-size: .72rem; color: var(--muted); margin-top: 1px; }

  /* nav items */
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; border: 1px solid transparent;
    background: transparent; color: var(--muted);
    font-family: 'Barlow', sans-serif; font-size: .88rem; font-weight: 600;
    cursor: pointer; transition: all .2s; width: 100%; text-align: left;
  }
  .nav-item:hover:not(.nav-item--disabled)    { background: var(--cdim); color: #fff; }
  .nav-item.nav-item--active                  { background: var(--bdim); color: var(--cyan); border-color: rgba(26,111,255,.2); }
  .nav-item--disabled                         { opacity: .45; cursor: not-allowed; }
  .nav-item__icon                             { font-size: 1.1rem; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-item__badge {
    margin-left: auto; border-radius: 100px;
    padding: 2px 8px; font-size: .62rem; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  }
  .nav-item__badge--count { background: var(--cdim); color: var(--cyan); }
  .nav-item__badge--soon  { background: rgba(255,145,0,.12); color: #ff9100; }

  /* ── CENTER ── */
  .fm-center { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18px; }

  /* ── CARD ── */
  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; transition: border-color .2s; }
  .card:hover { border-color: rgba(0,200,255,.2); }
  .card-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: .95rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }

  /* ── CREATE POST ── */
  .create-row { display: flex; gap: 12px; }
  .user-ava {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: .9rem;
    color: #fff; flex-shrink: 0;
  }
  .create-body { flex: 1; }
  .create-textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
    padding: 12px 16px; color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: .88rem; resize: none; min-height: 76px; outline: none; transition: border-color .2s;
  }
  .create-textarea:focus { border-color: rgba(0,200,255,.4); }
  .create-textarea::placeholder { color: var(--muted); }
  .create-actions { display: flex; gap: 8px; margin-top: 10px; align-items: center; flex-wrap: wrap; }
  .select-sport {
    background: var(--bg); border: 1px solid var(--border); color: var(--muted);
    border-radius: 7px; padding: 6px 10px; font-size: .78rem; outline: none; cursor: pointer;
    transition: border-color .2s; font-family: 'Barlow', sans-serif;
  }
  .select-sport:focus { border-color: rgba(0,200,255,.4); color: var(--text); }
  .media-btn {
    background: var(--bg); border: 1px solid var(--border); color: var(--muted);
    border-radius: 7px; padding: 6px 13px; font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: all .2s;
  }
  .media-btn:hover { border-color: var(--cyan); color: var(--cyan); }

  /* ── SPORT CHIPS ── */
  .chips { display: flex; flex-wrap: wrap; gap: 7px; }
  .chip {
    padding: 5px 12px; border-radius: 100px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); font-size: .74rem; font-weight: 600;
    cursor: pointer; transition: all .2s; white-space: nowrap;
  }
  .chip--active { background: var(--cyan); color: var(--bg); border-color: var(--cyan); }
  .chip:not(.chip--active):hover { border-color: var(--cyan); color: var(--cyan); }

  /* ── FEED ── */
  .feed { display: flex; flex-direction: column; gap: 14px; }

  /* empty state */
  .empty { text-align: center; padding: 64px 24px; color: var(--muted); }
  .empty__icon { font-size: 2.8rem; margin-bottom: 14px; opacity: .5; }
  .empty__title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .empty__sub { font-size: .85rem; line-height: 1.65; }

  /* post card */
  .post {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; transition: border-color .2s, transform .2s;
    animation: fadeUp .3s ease both;
  }
  .post:hover { border-color: rgba(0,200,255,.2); transform: translateY(-2px); }
  .post__header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .post__ava {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .9rem; color: #fff; flex-shrink: 0;
  }
  .post__author { font-weight: 700; font-size: .9rem; }
  .post__time   { font-size: .72rem; color: var(--muted); margin-top: 1px; }
  .post__badge  {
    margin-left: auto; font-size: .7rem;
    background: var(--cdim); color: var(--cyan);
    border: 1px solid rgba(0,200,255,.2);
    padding: 3px 10px; border-radius: 100px; font-weight: 600;
  }
  .post__tag {
    display: inline-block; background: var(--bdim); color: var(--blue);
    border-radius: 6px; padding: 2px 9px; font-size: .72rem; font-weight: 600;
    margin-bottom: 10px;
  }
  .post__content { font-size: .88rem; line-height: 1.65; color: #c8d8f0; margin-bottom: 14px; }
  .post__actions { display: flex; gap: 4px; border-top: 1px solid var(--border); padding-top: 12px; }
  .post-btn {
    display: flex; align-items: center; gap: 5px;
    background: transparent; border: none; color: var(--muted);
    font-family: 'Barlow', sans-serif; font-size: .79rem; font-weight: 600;
    padding: 5px 11px; border-radius: 7px; cursor: pointer; transition: all .2s;
  }
  .post-btn:hover          { background: var(--cdim); color: var(--cyan); }
  .post-btn--liked         { color: #ff4d6d; }
  .post-btn--liked:hover   { background: rgba(255,77,109,.1); }

  /* ── CHALLENGES ── */
  .sec-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: -.5px; margin-bottom: 4px; }
  .sec-sub   { font-size: .84rem; color: var(--muted); margin-bottom: 18px; }

  .challenge {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; display: grid; grid-template-columns: 1fr 80px; gap: 16px; align-items: center;
    transition: border-color .2s, transform .2s; animation: fadeUp .3s ease both;
  }
  .challenge:hover { border-color: rgba(0,200,255,.25); transform: translateY(-2px); box-shadow: 0 0 28px rgba(0,200,255,.08); }
  .ch__emoji { font-size: 1.6rem; margin-bottom: 6px; }
  .ch__title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.15rem; font-weight: 700; margin-bottom: 5px; }
  .ch__desc  { font-size: .81rem; color: var(--muted); line-height: 1.55; margin-bottom: 12px; }
  .ch__meta  { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
  .ch__pill  { display: flex; align-items: center; gap: 5px; font-size: .74rem; font-weight: 600; color: var(--muted); }
  .ch__dot   { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ch__join  { width: 100%; padding: 9px; border-radius: 8px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: .85rem; letter-spacing: 1px; cursor: pointer; transition: all .2s; border: none; }
  .ch__join--default { background: var(--blue); color: #fff; }
  .ch__join--default:hover { background: #2a7fff; box-shadow: 0 0 18px rgba(26,111,255,.5); }
  .ch__join--joined  { background: var(--cdim); color: var(--cyan); border: 1px solid rgba(0,200,255,.3) !important; }

  /* ── MEMBERS ── */
  .member-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(178px, 1fr)); gap: 14px; }
  .member-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; text-align: center; cursor: pointer; transition: border-color .2s, transform .2s;
  }
  .member-card:hover { border-color: rgba(0,200,255,.3); transform: translateY(-2px); }
  .m__ava   { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0 auto 10px; }
  .m__name  { font-weight: 700; font-size: .9rem; margin-bottom: 3px; }
  .m__sub   { color: var(--muted); font-size: .73rem; margin-bottom: 8px; }
  .m__rank  { background: var(--cdim); color: var(--cyan); border-radius: 6px; padding: 3px 0; font-size: .72rem; font-weight: 700; margin-bottom: 8px; }
  .m__pts   { font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; font-weight: 900; color: var(--cyan); }
  .m__pts span { font-size: .68rem; color: var(--muted); }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 300;
    background: var(--card); border: 1px solid rgba(0,200,255,.3);
    border-radius: 12px; padding: 13px 18px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,.5); font-size: .86rem;
    transform: translateY(80px); opacity: 0;
    transition: all .4s cubic-bezier(.34, 1.56, .64, 1);
    pointer-events: none;
  }
  .toast--show { transform: translateY(0); opacity: 1; }

  .fm ::-webkit-scrollbar { width: 5px; }
  .fm ::-webkit-scrollbar-thumb { background: rgba(0,200,255,.2); border-radius: 100px; }

  @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes pulse   { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }
  .pulse { animation: pulse 1.5s infinite; }

  /* ── MEMBER MODAL ── */
  .mp-backdrop {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,.65);
    backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: mpFadeIn .2s ease;
  }
  .mp-panel {
    background: var(--card); border: 1px solid rgba(0,200,255,.22);
    border-radius: 20px; width: 100%; max-width: 460px;
    max-height: 88vh; overflow-y: auto; position: relative;
    animation: mpSlideUp .25s ease;
  }
  .mp-panel::-webkit-scrollbar { width: 4px; }
  .mp-panel::-webkit-scrollbar-thumb { background: rgba(0,200,255,.2); border-radius: 100px; }
  .mp-close {
    position: absolute; top: 14px; right: 14px; z-index: 10;
    background: rgba(255,255,255,.06); border: none; color: var(--muted);
    width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
    font-size: .9rem; display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .mp-close:hover { background: rgba(255,255,255,.14); color: #fff; }

  /* hero */
  .mp-hero {
    padding: 36px 24px 22px;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    border-bottom: 1px solid var(--border);
  }
  .mp-ava {
    width: 82px; height: 82px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
    font-size: 1.9rem; color: #fff; margin-bottom: 14px;
    box-shadow: 0 0 32px color-mix(in srgb, currentColor 30%, transparent);
  }
  .mp-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.55rem; font-weight: 900; letter-spacing: -.5px; }
  .mp-meta { color: var(--muted); font-size: .82rem; margin-top: 4px; }
  .mp-rank {
    background: var(--cdim); color: var(--cyan);
    border: 1px solid rgba(0,200,255,.2);
    border-radius: 100px; padding: 4px 16px; font-size: .74rem; font-weight: 700;
    margin: 10px 0 14px;
  }
  .mp-follow-btn {
    padding: 9px 28px; border-radius: 9px; border: 1.5px solid var(--cyan);
    color: var(--cyan); background: transparent; cursor: pointer;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    font-size: .88rem; letter-spacing: 1px; text-transform: uppercase;
    transition: all .2s;
  }
  .mp-follow-btn:hover { background: var(--cdim); }
  .mp-follow-btn--active { background: var(--cdim); color: #fff; border-color: rgba(0,200,255,.4); }
  .mp-follow-btn--active:hover { background: rgba(255,77,109,.1); border-color: #ff4d6d; color: #ff4d6d; }

  /* stats bar */
  .mp-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    padding: 18px 20px; gap: 6px;
    border-bottom: 1px solid var(--border);
  }
  .mp-stat { text-align: center; }
  .mp-stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.35rem; font-weight: 900; color: var(--cyan);
  }
  .mp-stat-lbl { font-size: .62rem; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: .5px; }

  /* sections */
  .mp-section { padding: 18px 22px; border-bottom: 1px solid var(--border); }
  .mp-section:last-child { border-bottom: none; }
  .mp-section-title {
    font-family: 'Barlow Condensed', sans-serif; font-size: .75rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
  }
  .mp-bio { font-size: .85rem; line-height: 1.7; color: #c8d8f0; }

  /* achievements */
  .mp-achievements { display: flex; flex-direction: column; gap: 9px; }
  .mp-ach {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px; border-radius: 10px;
    background: var(--card2); border: 1px solid var(--border);
    animation: fadeUp .2s ease both;
  }
  .mp-ach-icon { font-size: 1.35rem; flex-shrink: 0; }
  .mp-ach-info { flex: 1; }
  .mp-ach-title { font-weight: 700; font-size: .84rem; }
  .mp-ach-date  { font-size: .7rem; color: var(--muted); margin-top: 1px; }

  /* footer */
  .mp-footer { padding: 14px 22px; text-align: center; font-size: .75rem; color: var(--muted); }

  @keyframes mpFadeIn   { from { opacity: 0; } to { opacity: 1; } }
  @keyframes mpSlideUp  { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }

  /* ── CLUBS TAB ── */
  .cv-layout { display: grid; grid-template-columns: 248px 1fr; gap: 18px; align-items: start; }

  /* Left: joined */
  .cv-joined { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; position: sticky; top: 80px; }
  .cv-joined-head { padding: 13px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .cv-joined-title { font-family: 'Barlow Condensed', sans-serif; font-size: .88rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; flex: 1; }
  .cv-joined-badge { background: var(--cdim); color: var(--cyan); border-radius: 100px; padding: 2px 9px; font-size: .68rem; font-weight: 700; }
  .cv-joined-list { display: flex; flex-direction: column; }
  .cv-jclub { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border-bottom: 1px solid var(--border); position: relative; transition: background .15s; }
  .cv-jclub:last-child { border-bottom: none; }
  .cv-jclub:hover { background: rgba(255,255,255,.025); }
  .cv-jclub-bar { width: 3px; position: absolute; left: 0; top: 0; bottom: 0; border-radius: 0 2px 2px 0; }
  .cv-jclub-icon { font-size: 1.2rem; flex-shrink: 0; }
  .cv-jclub-info { flex: 1; min-width: 0; }
  .cv-jclub-name { font-weight: 700; font-size: .82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cv-jclub-meta { font-size: .67rem; color: var(--muted); margin-top: 2px; }
  .cv-jclub-leave { background: none; border: 1px solid rgba(255,77,109,.3); color: #ff4d6d; border-radius: 6px; padding: 3px 8px; font-size: .65rem; font-weight: 700; cursor: pointer; transition: all .2s; white-space: nowrap; flex-shrink: 0; }
  .cv-jclub-leave:hover { background: rgba(255,77,109,.1); border-color: #ff4d6d; }
  .cv-joined-empty { padding: 28px 16px; text-align: center; }
  .cv-joined-empty-icon { font-size: 1.8rem; opacity: .4; margin-bottom: 8px; }
  .cv-joined-empty-text { font-size: .74rem; color: var(--muted); line-height: 1.65; }

  /* Right: explore */
  .cv-explore { display: flex; flex-direction: column; gap: 12px; }
  .cv-search-row { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px 16px; transition: border-color .2s; }
  .cv-search-row:focus-within { border-color: rgba(0,200,255,.4); }
  .cv-search-icon { color: var(--muted); font-size: .95rem; flex-shrink: 0; }
  .cv-search-input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: 'Barlow', sans-serif; font-size: .87rem; }
  .cv-search-input::placeholder { color: var(--muted); }
  .cv-cats { display: flex; flex-wrap: wrap; gap: 6px; }
  .cv-cat { padding: 5px 13px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-size: .72rem; font-weight: 600; cursor: pointer; transition: all .2s; }
  .cv-cat:hover { border-color: rgba(0,200,255,.35); color: var(--cyan); }
  .cv-cat--active { background: var(--cdim); border-color: rgba(0,200,255,.4); color: var(--cyan); }

  /* Grid */
  .cv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 14px; }
  .cv-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: transform .22s, border-color .22s, box-shadow .22s; display: flex; flex-direction: column; }
  .cv-card:hover { transform: translateY(-5px); border-color: rgba(0,200,255,.3); box-shadow: 0 16px 48px rgba(0,0,0,.4); }
  .cv-card--joined { border-color: rgba(0,200,255,.28); }
  .cv-card-hero { height: 90px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
  .cv-card-hero-icon { font-size: 2.6rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,.5)); }
  .cv-hero-joined { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,.5); backdrop-filter: blur(4px); color: var(--cyan); border: 1px solid rgba(0,200,255,.4); border-radius: 100px; padding: 2px 10px; font-size: .64rem; font-weight: 700; }
  .cv-card-body { padding: 13px 14px; display: flex; flex-direction: column; flex: 1; }
  .cv-card-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 2px; }
  .cv-card-loc { font-size: .69rem; color: var(--muted); margin-bottom: 8px; }
  .cv-card-desc { font-size: .77rem; color: #8a9bbc; line-height: 1.55; margin-bottom: 9px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .cv-next-event { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(26,111,255,.1); border: 1px solid rgba(26,111,255,.2); border-radius: 8px; margin-bottom: 9px; font-size: .7rem; color: #c0d0ff; }
  .cv-card-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
  .cv-chip { padding: 2px 8px; border-radius: 100px; font-size: .62rem; font-weight: 700; border: 1px solid rgba(255,255,255,.1); color: #aaa; background: rgba(255,255,255,.06); }
  .cv-chip--cat { background: var(--cdim); color: var(--cyan); border-color: rgba(0,200,255,.2); }
  .cv-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border); margin-top: auto; }
  .cv-card-stats { display: flex; flex-direction: column; gap: 1px; }
  .cv-card-members { font-size: .69rem; color: var(--muted); }
  .cv-card-rating { font-size: .69rem; color: #fbbf24; }
  .cv-join-btn { padding: 6px 13px; border-radius: 7px; background: var(--blue); color: #fff; border: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: .76rem; letter-spacing: .5px; cursor: pointer; transition: all .2s; }
  .cv-join-btn:hover { background: #2a7fff; box-shadow: 0 0 16px rgba(26,111,255,.5); }
  .cv-join-btn--leave { background: transparent; border: 1px solid rgba(255,77,109,.4); color: #ff4d6d; }
  .cv-join-btn--leave:hover { background: rgba(255,77,109,.1); border-color: #ff4d6d; box-shadow: none; }

  /* empty */
  .cv-empty { text-align: center; padding: 48px 24px; color: var(--muted); }
  .cv-empty-icon { font-size: 2.2rem; margin-bottom: 12px; opacity: .45; }
  .cv-empty-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .cv-empty-sub { font-size: .82rem; line-height: 1.6; }
`;

// ─────────────────────────────────────────────
// CLUBS HELPERS
// ─────────────────────────────────────────────

const CLUB_CATEGORIES = ['Toate', 'Alergare', 'Ciclism', 'Fitness', 'Yoga', 'Înot', 'Trail'] as const;

const CLUB_CAT_GRADIENTS: Record<string, string> = {
    Alergare: 'linear-gradient(135deg, #ff6b35 0%, #f7c948 100%)',
    Ciclism:  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    Fitness:  'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    Yoga:     'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    Înot:     'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    Trail:    'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    default:  'linear-gradient(135deg, #1a6fff 0%, #7c3aed 100%)',
};

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function CommunityPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    const userName = user ? `${user.firstName} ${user.lastName}` : 'Oaspete';
    const userAvatar = user?.avatar ?? '?';
    const userTag = user ? `@${user.email.split('@')[0]}` : '';

    const [tab, setTab]               = useState<FeedTab>('feed');
    const [filter, setFilter]         = useState<Sport | 'all'>('all');
    const [posts, setPosts]           = useState<Post[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
    const [postInput, setPostInput]   = useState<string>('');
    const [postSport, setPostSport]   = useState<Sport>('Fotbal');
    const [toast, setToast]           = useState<ToastState>({ icon: '', msg: '', visible: false });
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [following, setFollowing]           = useState<Set<string>>(new Set());
    const [clubSearch, setClubSearch]         = useState('');
    const [clubCat, setClubCat]               = useState('Toate');

    // Dashboard sync
    const { addProvocare, removeProvocare, cluburiJoined, cluburiDisponibile, addClub, removeClub } = useDashboardData();
    const { completeChallenge, completeJoinClub } = useProgress();

    const showToast = useCallback((icon: string, msg: string): void => {
        setToast({ icon, msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    }, []);

    const handlePublish = useCallback((): void => {
        if (!postInput.trim()) { showToast('⚠️', 'Scrie ceva înainte de a publica!'); return; }
        const newPost: Post = {
            id:       Date.now(),
            author:   userName,
            color:    '#1a6fff',
            sport:    postSport,
            time:     'acum câteva secunde',
            content:  postInput.trim(),
            likes:    0,
            comments: 0,
            liked:    false,
        };
        setPosts((prev) => [newPost, ...prev]);
        setPostInput('');
        showToast('✅', 'Postare publicată!');
    }, [postInput, postSport, showToast, userName]);

    const handleLike = useCallback((id: number): void => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
            ),
        );
    }, []);

    const handleJoin = useCallback((id: number): void => {
        setChallenges((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                const joining = !c.joined;
                showToast(joining ? '🏆' : '👋', joining ? 'Te-ai alăturat provocării!' : 'Ai ieșit din provocare.');

                // Sincronizare cu Dashboard-ul
                if (isAuthenticated) {
                    if (joining) {
                        // Convertim Challenge → Provocare și adăugăm în dashboard
                        const difficulty = c.days <= 7 ? 'Ușor' : c.days <= 30 ? 'Mediu' : 'Greu';
                        addProvocare({
                            id: 10000 + c.id, // ID unic (offset pentru a evita coliziuni cu mock)
                            name: c.title,
                            description: c.desc,
                            participants: c.participants + 1,
                            duration: `${c.days} zile`,
                            difficulty: difficulty as 'Ușor' | 'Mediu' | 'Greu',
                            progress: 0,
                        });
                        completeChallenge();
                    } else {
                        // Scoatem din dashboard
                        removeProvocare(10000 + c.id);
                    }
                }

                return { ...c, joined: joining, participants: joining ? c.participants + 1 : c.participants - 1 };
            }),
        );
    }, [showToast, isAuthenticated, addProvocare, removeProvocare, completeChallenge]);

    const handleFollow = useCallback((member: Member): void => {
        const isFollowing = following.has(member.name);
        setFollowing((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(member.name);
            else next.add(member.name);
            return next;
        });
        if (isFollowing) {
            setPosts((prev) => prev.filter((p) => p.author !== member.name));
            showToast('👋', `Ai încetat să urmărești pe ${member.name}`);
        } else {
            const newPosts = MEMBER_POSTS.filter((p) => p.author === member.name);
            setPosts((prev) => [...prev, ...newPosts]);
            showToast('👤', `Urmărești acum pe ${member.name}!`);
        }
    }, [following, showToast]);

    const handleJoinClub = useCallback((club: Parameters<typeof addClub>[0]): void => {
        addClub(club);
        completeJoinClub();
        showToast('🏟️', `Te-ai alăturat clubului ${club.name}!`);
    }, [addClub, completeJoinClub, showToast]);

    const handleLeaveClub = useCallback((id: number): void => {
        removeClub(id);
        showToast('👋', 'Ai ieșit din club.');
    }, [removeClub, showToast]);

    const filteredClubs = useMemo(() => {
        const q = clubSearch.toLowerCase();
        return cluburiDisponibile.filter((c) => {
            const matchSearch = c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
            const matchCat = clubCat === 'Toate' || c.category === clubCat;
            return matchSearch && matchCat;
        });
    }, [cluburiDisponibile, clubSearch, clubCat]);

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.sport === filter);

    // Left nav items — internal tabs + route-based items
    const NAV_ITEMS = [
        { id: 'feed',       icon: '📰', label: 'Feed',      badge: null,                   action: () => setTab('feed'),       isTab: true  },
        { id: 'challenges', icon: '🏆', label: 'Provocări', badge: { text: '15', type: 'count' as const }, action: () => setTab('challenges'), isTab: true  },
        { id: 'members',    icon: '👥', label: 'Membri',    badge: null,                   action: () => setTab('members'),    isTab: true  },
        { divider: true },
        { id: 'clubs',      icon: '🏟️', label: 'Cluburi',   badge: null,                                          action: () => setTab('clubs'),         isTab: true  },
        { id: 'forum',      icon: '💬', label: 'Forum',     badge: { text: 'În curând', type: 'soon' as const },  action: () => navigate(ROUTES.FORUM),  isTab: false },
    ] as const;

    const isNavActive = (item: (typeof NAV_ITEMS)[number]): boolean => {
        if (!('id' in item)) return false;
        if (item.isTab) return tab === item.id;
        return location.pathname === ROUTES.FORUM;
    };

    return (
        <>
            <style>{CSS}</style>
            <Navbar/>
            <div className="fm">


                {/* ── TOP NAV ── */}


                {/* ── BODY ── */}
                <div className="fm-body">

                    {/* ── LEFT NAV ── */}
                    <aside className="fm-leftnav">
                        {/* Profile chip */}
                        <div className="profile-chip" onClick={() => navigate(ROUTES.PROFILE)}>
                            <div className="profile-chip-ava">{userAvatar}</div>
                            <div>
                                <div className="profile-chip-name">{userName}</div>
                                <div className="profile-chip-tag">{userTag}</div>
                            </div>
                        </div>

                        <div className="leftnav-section-title">Comunitate</div>

                        {NAV_ITEMS.map((item, i) => {
                            if ('divider' in item) return <div key={i} className="nav-divider" />;

                            const active = isNavActive(item);

                            return (
                                <button
                                    key={item.id}
                                    className={[
                                        'nav-item',
                                        active ? 'nav-item--active' : '',
                                    ].join(' ')}
                                    onClick={item.action}
                                >
                                    <span className="nav-item__icon">{item.icon}</span>
                                    {item.label}
                                    {item.badge && (
                                        <span className={`nav-item__badge nav-item__badge--${item.badge.type}`}>
                      {item.badge.text}
                    </span>
                                    )}
                                </button>
                            );
                        })}
                    </aside>

                    {/* ── CENTER CONTENT ── */}
                    <div className="fm-center">

                        {/* ════ FEED ════ */}
                        {tab === 'feed' && (
                            <>
                                {/* Create Post */}
                                <div className="card">
                                    <div className="create-row">
                                        <div className="user-ava">{userAvatar}</div>
                                        <div className="create-body">
                      <textarea
                          className="create-textarea"
                          placeholder="Distribuie antrenamentul tău, un sfat sau o realizare…"
                          value={postInput}
                          onChange={(e) => setPostInput(e.target.value)}
                      />
                                            <div className="create-actions">
                                                <select
                                                    className="select-sport"
                                                    value={postSport}
                                                    onChange={(e) => setPostSport(e.target.value as Sport)}
                                                >
                                                    {SPORTS.map((s) => <option key={s}>{s}</option>)}
                                                </select>
                                                <button className="media-btn" onClick={() => setPostInput((v) => v + ' 📸')}>📸 Foto</button>
                                                <button className="media-btn" onClick={() => setPostInput((v) => v + ' 💪')}>💪 Workout</button>
                                                <button
                                                    className="btn btn-solid"
                                                    style={{ marginLeft: 'auto', padding: '7px 18px' }}
                                                    onClick={handlePublish}
                                                >
                                                    Publică
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sport filter */}
                                <div className="card" style={{ padding: '14px 18px' }}>
                                    <div className="chips">
                                        {SPORT_CHIPS.map((c) => (
                                            <button
                                                key={c.value}
                                                className={`chip${filter === c.value ? ' chip--active' : ''}`}
                                                onClick={() => setFilter(c.value)}
                                            >
                                                {c.emoji} {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Posts */}
                                <div className="feed">
                                    {filteredPosts.length === 0 ? (
                                        <div className="empty">
                                            <div className="empty__icon">{following.size === 0 ? '👥' : '📭'}</div>
                                            <div className="empty__title">
                                                {following.size === 0 ? 'Urmărește membri' : 'Nicio postare încă'}
                                            </div>
                                            <div className="empty__sub">
                                                {following.size === 0 ? (
                                                    <>Mergi la tabul <strong>Membri</strong> și urmărește sportivi<br />pentru a le vedea postările aici în feed.</>
                                                ) : (
                                                    <>Membrii urmăriți nu au postări la acest filtru.<br />Scrie tu ceva sau schimbă filtrul de sport.</>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        filteredPosts.map((p) => (
                                            <div className="post" key={p.id}>
                                                <div className="post__header">
                                                    <div className="post__ava" style={{ background: p.color }}>
                                                        {getInitials(p.author)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="post__author">{p.author}</div>
                                                        <div className="post__time">{p.time}</div>
                                                    </div>
                                                    <span className="post__badge">{p.sport}</span>
                                                </div>
                                                <div className="post__tag">#{p.sport}</div>
                                                <div className="post__content">{p.content}</div>
                                                <div className="post__actions">
                                                    <button
                                                        className={`post-btn${p.liked ? ' post-btn--liked' : ''}`}
                                                        onClick={() => handleLike(p.id)}
                                                    >
                                                        {p.liked ? '❤️' : '🤍'} {p.likes}
                                                    </button>
                                                    <button className="post-btn">💬 {p.comments}</button>
                                                    <button className="post-btn">🔗 Distribuie</button>
                                                    <button className="post-btn" style={{ marginLeft: 'auto' }}>🔖 Salvează</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {/* ════ PROVOCĂRI ════ */}
                        {tab === 'challenges' && (
                            <>
                                <div>
                                    <div className="sec-title">Provocări Active 🔥</div>
                                    <div className="sec-sub">Alătură-te și câștigă puncte în clasament</div>
                                </div>
                                <div className="feed">
                                    {challenges.map((c) => (
                                        <div className="challenge" key={c.id}>
                                            <div>
                                                <div className="ch__emoji">{c.sport}</div>
                                                <div className="ch__title">{c.title}</div>
                                                <div className="ch__desc">{c.desc}</div>
                                                <div className="ch__meta">
                                                    <div className="ch__pill">
                                                        <div className="ch__dot" style={{ background: '#00e676' }} />
                                                        {c.participants.toLocaleString()} participanți
                                                    </div>
                                                    <div className="ch__pill">
                                                        <div className="ch__dot" style={{ background: '#ff9100' }} />
                                                        {c.days} zile rămase
                                                    </div>
                                                </div>
                                                <button
                                                    className={`ch__join ${c.joined ? 'ch__join--joined' : 'ch__join--default'}`}
                                                    onClick={() => handleJoin(c.id)}
                                                >
                                                    {c.joined ? '✓ Înrolat' : 'Alătură-te'}
                                                </button>
                                            </div>
                                            <CircleProgress pct={c.progress} uid={String(c.id)} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ════ MEMBRI ════ */}
                        {tab === 'members' && (
                            <>
                                <div>
                                    <div className="sec-title">Membri Comunitate 👥</div>
                                    <div className="sec-sub">Sportivi activi din Moldova</div>
                                </div>
                                <div className="member-grid">
                                    {MEMBERS.map((m) => (
                                        <div
                                            className="member-card"
                                            key={m.name}
                                            onClick={() => setSelectedMember(m)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="m__ava" style={{ background: m.color, boxShadow: `0 0 14px ${m.color}44` }}>
                                                {getInitials(m.name)}
                                            </div>
                                            <div className="m__name">{m.name}</div>
                                            <div className="m__sub">📍 {m.city} · {m.sport}</div>
                                            <div className="m__rank">{m.rank}</div>
                                            <div className="m__pts">{m.points.toLocaleString()} <span>pts</span></div>
                                            <div style={{ marginTop: 10, fontSize: '.72rem', color: 'var(--cyan)', textAlign: 'center', opacity: .7 }}>
                                                Vezi profil →
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ════ CLUBURI ════ */}
                        {tab === 'clubs' && (
                            <>
                                <div>
                                    <div className="sec-title">Cluburi Sportive 🏟️</div>
                                    <div className="sec-sub">Cluburile tale și toate opțiunile disponibile în Moldova</div>
                                </div>

                                <div className="cv-layout">

                                    {/* ── Left: joined clubs ── */}
                                    <aside className="cv-joined">
                                        <div className="cv-joined-head">
                                            <span className="cv-joined-title">Cluburile mele</span>
                                            <span className="cv-joined-badge">{cluburiJoined.length}</span>
                                        </div>
                                        <div className="cv-joined-list">
                                            {cluburiJoined.length === 0 ? (
                                                <div className="cv-joined-empty">
                                                    <div className="cv-joined-empty-icon">🏟️</div>
                                                    <div className="cv-joined-empty-text">
                                                        Nu ești în niciun club.<br />Explorează și alătură-te!
                                                    </div>
                                                </div>
                                            ) : (
                                                cluburiJoined.map((c) => (
                                                    <div className="cv-jclub" key={c.id}>
                                                        <div
                                                            className="cv-jclub-bar"
                                                            style={{ background: CLUB_CAT_GRADIENTS[c.category] ?? CLUB_CAT_GRADIENTS.default }}
                                                        />
                                                        <span className="cv-jclub-icon">{c.icon}</span>
                                                        <div className="cv-jclub-info">
                                                            <div className="cv-jclub-name">{c.name}</div>
                                                            <div className="cv-jclub-meta">
                                                                📍 {c.location.split(',')[0]} · {c.members} membri
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="cv-jclub-leave"
                                                            onClick={() => handleLeaveClub(c.id)}
                                                        >
                                                            Ieși
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </aside>

                                    {/* ── Right: explore ── */}
                                    <div className="cv-explore">

                                        {/* Search bar */}
                                        <div className="cv-search-row">
                                            <span className="cv-search-icon">🔍</span>
                                            <input
                                                className="cv-search-input"
                                                placeholder="Caută cluburi după nume sau oraș…"
                                                value={clubSearch}
                                                onChange={(e) => setClubSearch(e.target.value)}
                                            />
                                        </div>

                                        {/* Category filter chips */}
                                        <div className="cv-cats">
                                            {CLUB_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    className={`cv-cat${clubCat === cat ? ' cv-cat--active' : ''}`}
                                                    onClick={() => setClubCat(cat)}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Results count */}
                                        <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                                            {filteredClubs.length} club{filteredClubs.length !== 1 ? 'uri' : ''} găsite
                                        </div>

                                        {/* Grid or empty state */}
                                        {filteredClubs.length === 0 ? (
                                            <div className="cv-empty">
                                                <div className="cv-empty-icon">🔍</div>
                                                <div className="cv-empty-title">Niciun club găsit</div>
                                                <div className="cv-empty-sub">
                                                    Încearcă alt termen de căutare sau o altă categorie.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="cv-grid">
                                                {filteredClubs.map((c) => {
                                                    const isJoined = cluburiJoined.some((j) => j.id === c.id);
                                                    const gradient = CLUB_CAT_GRADIENTS[c.category] ?? CLUB_CAT_GRADIENTS.default;
                                                    return (
                                                        <div
                                                            className={`cv-card${isJoined ? ' cv-card--joined' : ''}`}
                                                            key={c.id}
                                                        >
                                                            <div className="cv-card-hero" style={{ background: gradient }}>
                                                                <span className="cv-card-hero-icon">{c.icon}</span>
                                                                {isJoined && <span className="cv-hero-joined">✓ Membru</span>}
                                                            </div>
                                                            <div className="cv-card-body">
                                                                <div className="cv-card-name">{c.name}</div>
                                                                <div className="cv-card-loc">📍 {c.location}</div>
                                                                <div className="cv-card-desc">{c.description}</div>
                                                                {c.nextEvent && (
                                                                    <div className="cv-next-event">
                                                                        <span>📅</span>
                                                                        <span>{c.nextEvent}</span>
                                                                    </div>
                                                                )}
                                                                <div className="cv-card-chips">
                                                                    <span className="cv-chip cv-chip--cat">{c.category}</span>
                                                                    <span className="cv-chip">{c.level}</span>
                                                                    <span className="cv-chip">{c.schedule}</span>
                                                                </div>
                                                                <div className="cv-card-footer">
                                                                    <div className="cv-card-stats">
                                                                        <div className="cv-card-members">👥 {c.members} membri</div>
                                                                        <div className="cv-card-rating">★ {c.rating.toFixed(1)}</div>
                                                                    </div>
                                                                    <button
                                                                        className={`cv-join-btn${isJoined ? ' cv-join-btn--leave' : ''}`}
                                                                        onClick={() => isJoined ? handleLeaveClub(c.id) : handleJoinClub(c)}
                                                                    >
                                                                        {isJoined ? 'Ieși' : 'Alătură-te'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* ── MEMBER MODAL ── */}
                {selectedMember && (
                    <div className="mp-backdrop" onClick={() => setSelectedMember(null)}>
                        <div className="mp-panel" onClick={(e) => e.stopPropagation()}>
                            <button className="mp-close" onClick={() => setSelectedMember(null)} aria-label="Închide">✕</button>

                            {/* Hero */}
                            <div className="mp-hero">
                                <div className="mp-ava" style={{ background: selectedMember.color, boxShadow: `0 0 32px ${selectedMember.color}55` }}>
                                    {getInitials(selectedMember.name)}
                                </div>
                                <div className="mp-name">{selectedMember.name}</div>
                                <div className="mp-meta">📍 {selectedMember.city} · {selectedMember.sport}</div>
                                <div className="mp-rank">{selectedMember.rank}</div>
                                <button
                                    className={`mp-follow-btn${following.has(selectedMember.name) ? ' mp-follow-btn--active' : ''}`}
                                    onClick={() => handleFollow(selectedMember)}
                                >
                                    {following.has(selectedMember.name) ? '✓ Urmăresc' : '+ Urmărește'}
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="mp-stats">
                                <div className="mp-stat">
                                    <div className="mp-stat-val">{selectedMember.points.toLocaleString()}</div>
                                    <div className="mp-stat-lbl">Puncte</div>
                                </div>
                                <div className="mp-stat">
                                    <div className="mp-stat-val">{selectedMember.activities}</div>
                                    <div className="mp-stat-lbl">Activități</div>
                                </div>
                                <div className="mp-stat">
                                    <div className="mp-stat-val">{selectedMember.daysActive}</div>
                                    <div className="mp-stat-lbl">Zile Active</div>
                                </div>
                                <div className="mp-stat">
                                    <div className="mp-stat-val">{selectedMember.challenges}</div>
                                    <div className="mp-stat-lbl">Provocări</div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mp-section">
                                <div className="mp-section-title">Despre</div>
                                <div className="mp-bio">{selectedMember.bio}</div>
                            </div>

                            {/* Achievements */}
                            <div className="mp-section">
                                <div className="mp-section-title">🏆 Realizări ({selectedMember.achievements.length})</div>
                                <div className="mp-achievements">
                                    {selectedMember.achievements.map((ach, i) => (
                                        <div className="mp-ach" key={i} style={{ animationDelay: `${i * 50}ms` }}>
                                            <span className="mp-ach-icon">{ach.icon}</span>
                                            <div className="mp-ach-info">
                                                <div className="mp-ach-title">{ach.title}</div>
                                                <div className="mp-ach-date">{ach.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mp-footer">Activ din {selectedMember.joinedDate}</div>
                        </div>
                    </div>
                )}

                {/* ── TOAST ── */}
                <div className={`toast${toast.visible ? ' toast--show' : ''}`}>
                    <span style={{ fontSize: '1.2rem' }}>{toast.icon}</span>
                    <span>{toast.msg}</span>
                </div>

            </div>
        </>
    );
}
