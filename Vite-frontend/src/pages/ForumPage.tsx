import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { ROUTES } from '../routes/paths';
import { useAuth } from '../context/AuthContext';
import {
    FORUM_CATEGORIES,
    TRENDING_TOPICS,
    SUGGESTED_USERS,
    INITIAL_THREADS,
} from '../services/mock/forum';
import type {
    ForumCategory,
    ForumThread,
    ForumReply,
    SuggestedUser,
} from '../services/mock/forum';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const formatCount = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
};

// ─────────────────────────────────────────────
// SVG ICONS (X/Twitter style)
// ─────────────────────────────────────────────
const Icons = {
    reply: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
    ),
    repost: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 014-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 01-4 4H3" />
        </svg>
    ),
    heart: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    ),
    heartFilled: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    ),
    bookmark: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
    ),
    bookmarkFilled: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
    ),
    views: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    share: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
    ),
    verified: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a6fff">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            <circle cx="12" cy="12" r="11" fill="none" stroke="#1a6fff" strokeWidth="2" />
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" transform="scale(0.6) translate(8,8)" />
        </svg>
    ),
    pin: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
    ),
    search: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    trending: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
    ),
    image: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    gif: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none">GIF</text>
        </svg>
    ),
    poll: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    ),
    emoji: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
    ),
    close: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
};


// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');

  .fx *, .fx *::before, .fx *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .fx {
    --bg:       #050d1a;
    --card:     #0a1628;
    --card2:    #0d1f3a;
    --blue:     #1a6fff;
    --cyan:     #00c8ff;
    --cdim:     rgba(0,200,255,0.10);
    --bdim:     rgba(26,111,255,0.12);
    --text:     #e8f0fe;
    --muted:    #5a7aa0;
    --border:   rgba(0,200,255,0.08);
    --border2:  rgba(0,200,255,0.14);
    --radius:   16px;
    --red:      #ff4d6d;
    --green:    #00b894;
    font-family: 'Barlow', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .fx::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none; z-index: 0;
  }

  /* ── LAYOUT ── */
  .fx-body {
    position: relative; z-index: 1; flex: 1;
    display: flex; max-width: 1200px; margin: 0 auto;
    width: 100%;
  }

  /* ── LEFT SIDEBAR ── */
  .fx-sidebar {
    width: 270px; flex-shrink: 0;
    position: sticky; top: 72px; height: calc(100vh - 72px);
    overflow-y: auto; padding: 20px 16px;
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 4px;
  }

  .fx-sidebar-brand {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; margin-bottom: 12px;
  }
  .fx-sidebar-brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: .85rem; color: #fff;
  }
  .fx-sidebar-brand-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900; font-size: 1.25rem; letter-spacing: 1px; color: #fff;
  }
  .fx-sidebar-brand-text span { color: var(--cyan); }

  .fx-nav-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 16px; border-radius: 100px;
    background: transparent; border: none;
    color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: .95rem; font-weight: 600;
    cursor: pointer; transition: all .15s; width: 100%; text-align: left;
  }
  .fx-nav-item:hover { background: rgba(0,200,255,0.06); }
  .fx-nav-item--active { font-weight: 800; color: #fff; }
  .fx-nav-item--active::after { content: ''; }
  .fx-nav-icon { width: 24px; display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .fx-nav-item--active .fx-nav-icon { color: var(--cyan); }
  .fx-nav-badge {
    margin-left: auto; background: var(--blue); color: #fff;
    border-radius: 100px; padding: 2px 8px; font-size: .68rem; font-weight: 700;
  }

  .fx-post-btn {
    margin-top: 16px; width: 100%; padding: 14px;
    border-radius: 100px; border: none;
    background: linear-gradient(135deg, var(--blue), #0099ff);
    color: #fff; font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: 1rem; letter-spacing: 1px;
    text-transform: uppercase; cursor: pointer;
    transition: all .2s; box-shadow: 0 4px 20px rgba(26,111,255,.3);
  }
  .fx-post-btn:hover { background: linear-gradient(135deg, #2a7fff, #00aaff); box-shadow: 0 4px 28px rgba(26,111,255,.5); transform: translateY(-1px); }

  /* ── MAIN FEED ── */
  .fx-main {
    flex: 1; min-width: 0;
    border-right: 1px solid var(--border);
  }

  /* header bar */
  .fx-header {
    position: sticky; top: 72px; z-index: 10;
    background: rgba(5,13,26,0.85); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .fx-header-top {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px 12px;
  }
  .fx-header-back {
    background: none; border: none; color: var(--text);
    cursor: pointer; padding: 6px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s;
  }
  .fx-header-back:hover { background: rgba(255,255,255,0.08); }
  .fx-header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.25rem; letter-spacing: .5px;
  }

  /* tabs */
  .fx-tabs {
    display: flex; overflow-x: auto;
    scrollbar-width: none;
  }
  .fx-tabs::-webkit-scrollbar { display: none; }
  .fx-tab {
    flex: 1; min-width: max-content; padding: 14px 20px;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--muted); font-family: 'Barlow', sans-serif;
    font-size: .82rem; font-weight: 600; letter-spacing: .5px;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .fx-tab:hover { background: rgba(0,200,255,0.04); color: var(--text); }
  .fx-tab--active {
    color: #fff; font-weight: 700;
    border-bottom-color: var(--cyan);
  }

  /* ── COMPOSE ── */
  .fx-compose {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    display: flex; gap: 14px;
  }
  .fx-compose-ava {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .9rem; color: #fff;
    background: linear-gradient(135deg, var(--blue), var(--cyan));
  }
  .fx-compose-body { flex: 1; display: flex; flex-direction: column; }
  .fx-compose-input {
    width: 100%; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: 1.1rem; resize: none; min-height: 54px; padding: 8px 0;
    line-height: 1.5;
  }
  .fx-compose-input::placeholder { color: var(--muted); }
  .fx-compose-divider {
    height: 1px; background: var(--border); margin: 8px 0;
  }
  .fx-compose-bottom {
    display: flex; align-items: center; justify-content: space-between;
  }
  .fx-compose-tools { display: flex; gap: 2px; }
  .fx-compose-tool {
    background: none; border: none; color: var(--cyan); opacity: .6;
    padding: 8px; border-radius: 50%; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .fx-compose-tool:hover { opacity: 1; background: rgba(0,200,255,0.08); }
  .fx-compose-submit {
    padding: 8px 22px; border-radius: 100px; border: none;
    background: var(--blue); color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: .85rem; letter-spacing: .5px;
    cursor: pointer; transition: all .15s;
  }
  .fx-compose-submit:hover:not(:disabled) { background: #2a7fff; box-shadow: 0 0 16px rgba(26,111,255,.4); }
  .fx-compose-submit:disabled { opacity: .4; cursor: not-allowed; }
  .fx-char-count {
    font-size: .72rem; color: var(--muted); margin-right: 12px;
  }
  .fx-char-count--warn { color: #ff9100; }
  .fx-char-count--over { color: var(--red); }

  /* ── THREAD / POST ── */
  .fx-thread {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    transition: background .15s; cursor: pointer;
    animation: fxFadeIn .3s ease both;
  }
  .fx-thread:hover { background: rgba(0,200,255,0.02); }
  .fx-thread--expanded { background: transparent; cursor: default; }
  .fx-thread--expanded:hover { background: transparent; }

  .fx-pinned-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: .72rem; color: var(--muted); font-weight: 600;
    padding: 0 0 8px 58px;
  }

  .fx-thread-row { display: flex; gap: 12px; }
  .fx-thread-ava {
    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .85rem; color: #fff;
    transition: opacity .15s;
  }
  .fx-thread-ava:hover { opacity: .85; }
  .fx-thread-body { flex: 1; min-width: 0; }

  .fx-thread-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
  .fx-author {
    font-weight: 700; font-size: .92rem; color: #fff;
    transition: color .15s;
  }
  .fx-author:hover { color: var(--cyan); }
  .fx-verified { display: inline-flex; align-items: center; margin-left: -2px; }
  .fx-handle { color: var(--muted); font-size: .82rem; }
  .fx-time-dot { color: var(--muted); font-size: .72rem; }
  .fx-time { color: var(--muted); font-size: .82rem; }
  .fx-category-tag {
    margin-left: auto;
    background: var(--bdim); color: var(--blue);
    border-radius: 100px; padding: 2px 10px;
    font-size: .68rem; font-weight: 700; letter-spacing: .5px;
  }

  .fx-content {
    font-size: .93rem; line-height: 1.6; color: #c8daf0;
    white-space: pre-wrap; word-break: break-word; margin-bottom: 12px;
  }
  .fx-content-hashtag { color: var(--cyan); font-weight: 600; }

  /* Poll */
  .fx-poll { margin-bottom: 14px; display: flex; flex-direction: column; gap: 8px; }
  .fx-poll-option {
    position: relative; border-radius: 10px; overflow: hidden;
    border: 1px solid var(--border2); cursor: pointer;
    transition: border-color .15s;
  }
  .fx-poll-option:hover { border-color: var(--cyan); }
  .fx-poll-option--voted { cursor: default; }
  .fx-poll-bar {
    position: absolute; inset: 0; border-radius: 10px;
    background: rgba(26,111,255,0.12);
    transition: width .6s cubic-bezier(.22, 1, .36, 1);
  }
  .fx-poll-bar--winner { background: rgba(0,200,255,0.15); }
  .fx-poll-label {
    position: relative; z-index: 1; padding: 10px 14px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: .84rem; font-weight: 600;
  }
  .fx-poll-pct { color: var(--muted); font-size: .78rem; font-weight: 700; }
  .fx-poll-total { font-size: .74rem; color: var(--muted); margin-top: 4px; }

  /* Actions bar */
  .fx-actions { display: flex; justify-content: space-between; margin-top: 2px; max-width: 420px; }
  .fx-action {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--muted);
    font-size: .78rem; font-weight: 600; padding: 6px 10px;
    border-radius: 100px; cursor: pointer; transition: all .15s;
  }
  .fx-action:hover { background: rgba(0,200,255,0.06); }
  .fx-action--reply:hover { color: var(--cyan); }
  .fx-action--repost:hover, .fx-action--reposted { color: var(--green); }
  .fx-action--like:hover { color: var(--red); }
  .fx-action--liked { color: var(--red); }
  .fx-action--bookmark:hover { color: var(--cyan); }
  .fx-action--bookmarked { color: var(--cyan); }
  .fx-action--views:hover { color: var(--cyan); }

  /* expanded thread detail */
  .fx-detail-stats {
    display: flex; gap: 20px; padding: 14px 0;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    margin-top: 12px;
  }
  .fx-detail-stat { font-size: .84rem; color: var(--muted); }
  .fx-detail-stat strong { color: #fff; font-weight: 700; }

  /* Replies */
  .fx-replies { }
  .fx-reply {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; gap: 12px;
    animation: fxFadeIn .3s ease both;
  }
  .fx-reply-ava {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .75rem; color: #fff;
  }
  .fx-reply-body { flex: 1; min-width: 0; }
  .fx-reply-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
  .fx-reply-content { font-size: .88rem; line-height: 1.55; color: #c8daf0; margin-bottom: 8px; }
  .fx-reply-actions { display: flex; gap: 16px; }
  .fx-reply-action {
    display: flex; align-items: center; gap: 5px;
    background: none; border: none; color: var(--muted);
    font-size: .74rem; font-weight: 600; cursor: pointer;
    transition: color .15s; padding: 0;
  }
  .fx-reply-action:hover { color: var(--cyan); }
  .fx-reply-action--liked { color: var(--red); }

  /* Reply compose (inline) */
  .fx-reply-compose {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; gap: 12px; align-items: flex-start;
  }
  .fx-reply-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'Barlow', sans-serif;
    font-size: .92rem; resize: none; min-height: 40px; padding: 8px 0;
  }
  .fx-reply-input::placeholder { color: var(--muted); }
  .fx-reply-submit {
    padding: 7px 18px; border-radius: 100px; border: none;
    background: var(--blue); color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: .8rem; cursor: pointer;
    transition: all .15s; align-self: flex-end;
  }
  .fx-reply-submit:hover:not(:disabled) { background: #2a7fff; }
  .fx-reply-submit:disabled { opacity: .4; cursor: not-allowed; }

  /* ── RIGHT SIDEBAR ── */
  .fx-right {
    width: 320px; flex-shrink: 0;
    position: sticky; top: 72px; height: calc(100vh - 72px);
    overflow-y: auto; padding: 20px 16px;
    display: flex; flex-direction: column; gap: 20px;
  }

  /* Search */
  .fx-search {
    position: relative;
  }
  .fx-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); display: flex; pointer-events: none;
  }
  .fx-search-input {
    width: 100%; padding: 12px 14px 12px 42px;
    background: var(--card2); border: 1px solid var(--border);
    border-radius: 100px; color: var(--text);
    font-family: 'Barlow', sans-serif; font-size: .88rem;
    outline: none; transition: all .15s;
  }
  .fx-search-input:focus { border-color: var(--cyan); background: var(--bg); }
  .fx-search-input::placeholder { color: var(--muted); }

  /* Trending box */
  .fx-trending-box {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .fx-trending-header {
    padding: 16px 18px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.15rem; letter-spacing: .5px;
  }
  .fx-trend {
    padding: 12px 18px; border-top: 1px solid var(--border);
    cursor: pointer; transition: background .15s;
  }
  .fx-trend:hover { background: rgba(0,200,255,0.03); }
  .fx-trend-cat { font-size: .7rem; color: var(--muted); font-weight: 600; letter-spacing: .5px; }
  .fx-trend-tag { font-weight: 700; font-size: .92rem; margin: 2px 0; }
  .fx-trend-posts { font-size: .72rem; color: var(--muted); }
  .fx-trending-more {
    display: block; padding: 14px 18px; border-top: 1px solid var(--border);
    color: var(--cyan); font-size: .86rem; font-weight: 600;
    background: none; border: none; cursor: pointer; width: 100%; text-align: left;
    transition: background .15s;
  }
  .fx-trending-more:hover { background: rgba(0,200,255,0.04); }

  /* Suggested users */
  .fx-suggest-box {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .fx-suggest-header {
    padding: 16px 18px;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800; font-size: 1.15rem; letter-spacing: .5px;
  }
  .fx-suggest-user {
    padding: 12px 18px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: background .15s;
  }
  .fx-suggest-user:hover { background: rgba(0,200,255,0.03); }
  .fx-suggest-ava {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: .8rem; color: #fff;
  }
  .fx-suggest-info { flex: 1; min-width: 0; }
  .fx-suggest-name {
    display: flex; align-items: center; gap: 4px;
    font-weight: 700; font-size: .88rem;
  }
  .fx-suggest-handle { font-size: .76rem; color: var(--muted); }
  .fx-suggest-bio { font-size: .76rem; color: var(--muted); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .fx-follow-btn {
    padding: 6px 16px; border-radius: 100px;
    border: 1.5px solid var(--text); background: var(--text); color: var(--bg);
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 700; font-size: .78rem; cursor: pointer;
    transition: all .15s;
  }
  .fx-follow-btn:hover { background: #cde0ff; border-color: #cde0ff; }
  .fx-follow-btn--following {
    background: transparent; color: var(--text);
    border-color: rgba(0,200,255,0.3);
  }
  .fx-follow-btn--following:hover { border-color: var(--red); color: var(--red); }

  /* Footer */
  .fx-footer-links {
    display: flex; flex-wrap: wrap; gap: 6px 12px; padding: 0 4px;
  }
  .fx-footer-link {
    font-size: .7rem; color: var(--muted); text-decoration: none;
    transition: color .15s;
  }
  .fx-footer-link:hover { color: var(--text); text-decoration: underline; }

  /* ── ANIMATIONS ── */
  @keyframes fxFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  @keyframes fxHeartPop {
    0% { transform: scale(1); }
    30% { transform: scale(1.3); }
    60% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  .fx-heart-pop { animation: fxHeartPop .35s ease; }

  /* Toast */
  .fx-toast {
    position: fixed; bottom: 28px; left: 50%; z-index: 300;
    background: var(--blue); border-radius: 8px; padding: 12px 20px;
    font-size: .86rem; font-weight: 600; color: #fff;
    box-shadow: 0 8px 32px rgba(0,0,0,.5);
    transform: translate(-50%, 80px); opacity: 0;
    transition: all .4s cubic-bezier(.34, 1.56, .64, 1);
    pointer-events: none;
  }
  .fx-toast--show { transform: translate(-50%, 0); opacity: 1; }

  /* Scrollbar */
  .fx ::-webkit-scrollbar { width: 4px; }
  .fx ::-webkit-scrollbar-thumb { background: rgba(0,200,255,.15); border-radius: 100px; }

  /* ── MOBILE ── */
  @media (max-width: 1100px) {
    .fx-right { display: none; }
  }
  @media (max-width: 850px) {
    .fx-sidebar { width: 72px; padding: 16px 8px; }
    .fx-sidebar-brand-text, .fx-nav-item span:not(.fx-nav-icon), .fx-nav-badge, .fx-post-btn { display: none; }
    .fx-nav-item { justify-content: center; padding: 14px; }
    .fx-sidebar .fx-post-btn { display: flex; width: 48px; height: 48px; padding: 0; align-items: center; justify-content: center; font-size: 1.3rem; }
  }
  @media (max-width: 600px) {
    .fx-sidebar { display: none; }
    .fx-main { border-right: none; }
  }
`;


// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function ForumPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const composeRef = useRef<HTMLTextAreaElement>(null);
    const replyRef = useRef<HTMLTextAreaElement>(null);

    // ── State ──
    const [activeCategory, setActiveCategory] = useState<ForumCategory>('Toate');
    const [threads, setThreads] = useState<ForumThread[]>(INITIAL_THREADS);
    const [expandedThread, setExpandedThread] = useState<number | null>(null);
    const [composeText, setComposeText] = useState('');
    const [composeCategory, setComposeCategory] = useState<ForumCategory>('Antrenament');
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
    const [toast, setToast] = useState({ msg: '', visible: false });
    const [heartAnims, setHeartAnims] = useState<Set<number>>(new Set());

    const userAvatar = user ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'FM';
    const userName = user ? `${user.firstName} ${user.lastName}` : 'FitMoldova User';
    const userHandle = user ? `@${user.username}` : '@user';

    // ── Toast helper ──
    const showToast = useCallback((msg: string) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
    }, []);

    // ── Auto-resize textareas ──
    useEffect(() => {
        if (composeRef.current) {
            composeRef.current.style.height = 'auto';
            composeRef.current.style.height = composeRef.current.scrollHeight + 'px';
        }
    }, [composeText]);
    useEffect(() => {
        if (replyRef.current) {
            replyRef.current.style.height = 'auto';
            replyRef.current.style.height = replyRef.current.scrollHeight + 'px';
        }
    }, [replyText]);

    // ── Actions ──
    const handleLike = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setHeartAnims((prev) => new Set(prev).add(threadId));
        setTimeout(() => setHeartAnims((prev) => { const n = new Set(prev); n.delete(threadId); return n; }), 350);
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
                    : t
            )
        );
    }, []);

    const handleRepost = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? { ...t, reposted: !t.reposted, reposts: t.reposted ? t.reposts - 1 : t.reposts + 1 }
                    : t
            )
        );
        const thread = threads.find((t) => t.id === threadId);
        if (thread && !thread.reposted) showToast('Repostat cu succes!');
    }, [threads, showToast]);

    const handleBookmark = useCallback((threadId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId ? { ...t, bookmarked: !t.bookmarked } : t
            )
        );
        const thread = threads.find((t) => t.id === threadId);
        showToast(thread?.bookmarked ? 'Eliminat din salvate' : 'Adăugat la salvate');
    }, [threads, showToast]);

    const handleReplyLike = useCallback((threadId: number, replyId: number) => {
        setThreads((prev) =>
            prev.map((t) =>
                t.id === threadId
                    ? {
                        ...t,
                        replies: t.replies.map((r) =>
                            r.id === replyId
                                ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                                : r
                        ),
                    }
                    : t
            )
        );
    }, []);

    const handlePollVote = useCallback((threadId: number, optionIdx: number) => {
        setThreads((prev) =>
            prev.map((t) => {
                if (t.id !== threadId || !t.poll || t.poll.voted) return t;
                const newOptions = t.poll.options.map((o, i) =>
                    i === optionIdx ? { ...o, votes: o.votes + 1 } : o
                );
                return {
                    ...t,
                    poll: { ...t.poll, options: newOptions, totalVotes: t.poll.totalVotes + 1, voted: true },
                };
            })
        );
        showToast('Votul tău a fost înregistrat!');
    }, [showToast]);

    const handlePublish = useCallback(() => {
        if (!composeText.trim()) return;
        const newThread: ForumThread = {
            id: Date.now(),
            author: userName,
            avatar: userAvatar,
            color: '#1a6fff',
            handle: userHandle,
            verified: false,
            content: composeText.trim(),
            category: composeCategory,
            time: 'acum',
            likes: 0,
            liked: false,
            replies: [],
            reposts: 0,
            reposted: false,
            bookmarked: false,
            views: 0,
        };
        setThreads((prev) => [newThread, ...prev]);
        setComposeText('');
        showToast('Postarea ta a fost publicată!');
    }, [composeText, composeCategory, userName, userAvatar, userHandle, showToast]);

    const handleReplySubmit = useCallback(() => {
        if (!replyText.trim() || expandedThread === null) return;
        const newReply: ForumReply = {
            id: Date.now(),
            author: userName,
            avatar: userAvatar,
            color: '#1a6fff',
            handle: userHandle,
            content: replyText.trim(),
            time: 'acum',
            likes: 0,
            liked: false,
            verified: false,
        };
        setThreads((prev) =>
            prev.map((t) =>
                t.id === expandedThread
                    ? { ...t, replies: [newReply, ...t.replies] }
                    : t
            )
        );
        setReplyText('');
        showToast('Răspunsul tău a fost adăugat!');
    }, [replyText, expandedThread, userName, userAvatar, userHandle, showToast]);

    const handleFollow = useCallback((user: SuggestedUser) => {
        setFollowedUsers((prev) => {
            const next = new Set(prev);
            if (next.has(user.handle)) next.delete(user.handle);
            else next.add(user.handle);
            return next;
        });
    }, []);

    // ── Filter threads ──
    const filteredThreads = useMemo(() => {
        let result = threads;
        if (activeCategory !== 'Toate') {
            result = result.filter((t) => t.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.content.toLowerCase().includes(q) ||
                    t.author.toLowerCase().includes(q) ||
                    t.handle.toLowerCase().includes(q)
            );
        }
        // pin first
        return [...result].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }, [threads, activeCategory, searchQuery]);

    const expandedData = expandedThread !== null ? threads.find((t) => t.id === expandedThread) : null;

    // ── Render helpers ──
    const renderContent = (content: string) => {
        return content.split(/(#\S+)/g).map((part, i) =>
            part.startsWith('#') ? (
                <span key={i} className="fx-content-hashtag">{part}</span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    const MAX_CHARS = 500;
    const charsLeft = MAX_CHARS - composeText.length;

    // ────────────────────────────────────────────
    return (
        <>
            <style>{CSS}</style>
            <Navbar />
            <div className="fx">
                <div className="fx-body">

                    {/* ══════════ LEFT SIDEBAR ══════════ */}
                    <aside className="fx-sidebar">
                        <div className="fx-sidebar-brand" onClick={() => navigate(ROUTES.COMMUNITY)} style={{ cursor: 'pointer' }}>
                            <div className="fx-sidebar-brand-icon">FM</div>
                            <div className="fx-sidebar-brand-text">Fit<span>Forum</span></div>
                        </div>

                        <button className="fx-nav-item fx-nav-item--active">
                            <span className="fx-nav-icon">🏠</span>
                            <span>Feed</span>
                        </button>
                        <button className="fx-nav-item" onClick={() => navigate(ROUTES.COMMUNITY)}>
                            <span className="fx-nav-icon">👥</span>
                            <span>Comunitate</span>
                        </button>
                        <button className="fx-nav-item">
                            <span className="fx-nav-icon">🔔</span>
                            <span>Notificări</span>
                            <span className="fx-nav-badge">3</span>
                        </button>
                        <button className="fx-nav-item">
                            <span className="fx-nav-icon">✉️</span>
                            <span>Mesaje</span>
                        </button>
                        <button className="fx-nav-item">
                            <span className="fx-nav-icon">🔖</span>
                            <span>Salvate</span>
                        </button>
                        <button className="fx-nav-item" onClick={() => navigate(ROUTES.PROFILE)}>
                            <span className="fx-nav-icon">👤</span>
                            <span>Profil</span>
                        </button>

                        <button className="fx-post-btn" onClick={() => composeRef.current?.focus()}>
                            Postează
                        </button>
                    </aside>

                    {/* ══════════ MAIN FEED ══════════ */}
                    <main className="fx-main">
                        {/* Header */}
                        <div className="fx-header">
                            <div className="fx-header-top">
                                {expandedThread !== null ? (
                                    <button className="fx-header-back" onClick={() => { setExpandedThread(null); setReplyText(''); }}>
                                        {Icons.back}
                                    </button>
                                ) : null}
                                <div className="fx-header-title">
                                    {expandedThread !== null ? 'Postare' : 'Forum'}
                                </div>
                            </div>
                            {expandedThread === null && (
                                <div className="fx-tabs">
                                    {FORUM_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            className={`fx-tab${activeCategory === cat ? ' fx-tab--active' : ''}`}
                                            onClick={() => setActiveCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Expanded Thread View ── */}
                        {expandedData ? (
                            <>
                                <div className="fx-thread fx-thread--expanded">
                                    {expandedData.pinned && (
                                        <div className="fx-pinned-badge">
                                            {Icons.pin} Postare fixată
                                        </div>
                                    )}
                                    <div className="fx-thread-row">
                                        <div className="fx-thread-ava" style={{ background: expandedData.color }}>
                                            {expandedData.avatar}
                                        </div>
                                        <div className="fx-thread-body">
                                            <div className="fx-thread-meta">
                                                <span className="fx-author">{expandedData.author}</span>
                                                {expandedData.verified && <span className="fx-verified">{Icons.verified}</span>}
                                                <span className="fx-handle">{expandedData.handle}</span>
                                            </div>
                                            <div className="fx-content">{renderContent(expandedData.content)}</div>

                                            {expandedData.poll && (
                                                <div className="fx-poll">
                                                    {expandedData.poll.options.map((opt, idx) => {
                                                        const pct = expandedData.poll!.voted
                                                            ? Math.round((opt.votes / expandedData.poll!.totalVotes) * 100)
                                                            : 0;
                                                        const maxVotes = Math.max(...expandedData.poll!.options.map((o) => o.votes));
                                                        const isWinner = expandedData.poll!.voted && opt.votes === maxVotes;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`fx-poll-option${expandedData.poll!.voted ? ' fx-poll-option--voted' : ''}`}
                                                                onClick={() => !expandedData.poll!.voted && handlePollVote(expandedData.id, idx)}
                                                            >
                                                                {expandedData.poll!.voted && (
                                                                    <div
                                                                        className={`fx-poll-bar${isWinner ? ' fx-poll-bar--winner' : ''}`}
                                                                        style={{ width: `${pct}%` }}
                                                                    />
                                                                )}
                                                                <div className="fx-poll-label">
                                                                    <span>{opt.label}</span>
                                                                    {expandedData.poll!.voted && <span className="fx-poll-pct">{pct}%</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="fx-poll-total">{formatCount(expandedData.poll.totalVotes)} voturi</div>
                                                </div>
                                            )}

                                            <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginBottom: 4 }}>
                                                {expandedData.time} · <span className="fx-category-tag" style={{ marginLeft: 0, display: 'inline' }}>{expandedData.category}</span>
                                            </div>

                                            <div className="fx-detail-stats">
                                                <div className="fx-detail-stat"><strong>{formatCount(expandedData.reposts)}</strong> Reposturi</div>
                                                <div className="fx-detail-stat"><strong>{formatCount(expandedData.likes)}</strong> Aprecieri</div>
                                                <div className="fx-detail-stat"><strong>{formatCount(expandedData.views)}</strong> Vizualizări</div>
                                            </div>

                                            <div className="fx-actions" style={{ maxWidth: 'none', padding: '8px 0' }}>
                                                <button className="fx-action fx-action--reply">
                                                    {Icons.reply} <span>{expandedData.replies.length}</span>
                                                </button>
                                                <button
                                                    className={`fx-action fx-action--repost${expandedData.reposted ? ' fx-action--reposted' : ''}`}
                                                    onClick={(e) => handleRepost(expandedData.id, e)}
                                                >
                                                    {Icons.repost} <span>{formatCount(expandedData.reposts)}</span>
                                                </button>
                                                <button
                                                    className={`fx-action fx-action--like${expandedData.liked ? ' fx-action--liked' : ''} ${heartAnims.has(expandedData.id) ? 'fx-heart-pop' : ''}`}
                                                    onClick={(e) => handleLike(expandedData.id, e)}
                                                >
                                                    {expandedData.liked ? Icons.heartFilled : Icons.heart} <span>{formatCount(expandedData.likes)}</span>
                                                </button>
                                                <button
                                                    className={`fx-action fx-action--bookmark${expandedData.bookmarked ? ' fx-action--bookmarked' : ''}`}
                                                    onClick={(e) => handleBookmark(expandedData.id, e)}
                                                >
                                                    {expandedData.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                                                </button>
                                                <button className="fx-action fx-action--views">
                                                    {Icons.share}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reply compose */}
                                <div className="fx-reply-compose">
                                    <div className="fx-compose-ava" style={{ width: 36, height: 36, fontSize: '.75rem' }}>
                                        {userAvatar}
                                    </div>
                                    <textarea
                                        ref={replyRef}
                                        className="fx-reply-input"
                                        placeholder="Scrie un răspuns..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        rows={1}
                                    />
                                    <button
                                        className="fx-reply-submit"
                                        disabled={!replyText.trim()}
                                        onClick={handleReplySubmit}
                                    >
                                        Răspunde
                                    </button>
                                </div>

                                {/* Replies list */}
                                <div className="fx-replies">
                                    {expandedData.replies.map((reply, idx) => (
                                        <div className="fx-reply" key={reply.id} style={{ animationDelay: `${idx * 50}ms` }}>
                                            <div className="fx-reply-ava" style={{ background: reply.color }}>
                                                {reply.avatar}
                                            </div>
                                            <div className="fx-reply-body">
                                                <div className="fx-reply-meta">
                                                    <span className="fx-author" style={{ fontSize: '.86rem' }}>{reply.author}</span>
                                                    {reply.verified && <span className="fx-verified">{Icons.verified}</span>}
                                                    <span className="fx-handle">{reply.handle}</span>
                                                    <span className="fx-time-dot">·</span>
                                                    <span className="fx-time">{reply.time}</span>
                                                </div>
                                                <div className="fx-reply-content">{reply.content}</div>
                                                <div className="fx-reply-actions">
                                                    <button className="fx-reply-action">
                                                        {Icons.reply} {reply.likes > 0 ? '' : ''}
                                                    </button>
                                                    <button
                                                        className={`fx-reply-action${reply.liked ? ' fx-reply-action--liked' : ''}`}
                                                        onClick={() => handleReplyLike(expandedData.id, reply.id)}
                                                    >
                                                        {reply.liked ? Icons.heartFilled : Icons.heart} {reply.likes}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* ── Compose box ── */}
                                <div className="fx-compose">
                                    <div className="fx-compose-ava">{userAvatar}</div>
                                    <div className="fx-compose-body">
                                        <textarea
                                            ref={composeRef}
                                            className="fx-compose-input"
                                            placeholder="Ce se întâmplă în lumea fitness?"
                                            value={composeText}
                                            onChange={(e) => setComposeText(e.target.value.slice(0, MAX_CHARS + 50))}
                                            rows={1}
                                        />
                                        <div className="fx-compose-divider" />
                                        <div className="fx-compose-bottom">
                                            <div className="fx-compose-tools">
                                                <button className="fx-compose-tool" title="Imagine">{Icons.image}</button>
                                                <button className="fx-compose-tool" title="GIF">{Icons.gif}</button>
                                                <button className="fx-compose-tool" title="Sondaj">{Icons.poll}</button>
                                                <button className="fx-compose-tool" title="Emoji">{Icons.emoji}</button>
                                                <select
                                                    style={{
                                                        background: 'transparent', border: '1px solid var(--border)',
                                                        borderRadius: 100, padding: '4px 10px', color: 'var(--cyan)',
                                                        fontSize: '.74rem', fontWeight: 600, outline: 'none', cursor: 'pointer',
                                                        fontFamily: "'Barlow', sans-serif",
                                                    }}
                                                    value={composeCategory}
                                                    onChange={(e) => setComposeCategory(e.target.value as ForumCategory)}
                                                >
                                                    {FORUM_CATEGORIES.filter((c) => c !== 'Toate').map((c) => (
                                                        <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {composeText.length > 0 && (
                                                    <span className={`fx-char-count${charsLeft <= 50 ? (charsLeft <= 0 ? ' fx-char-count--over' : ' fx-char-count--warn') : ''}`}>
                                                        {charsLeft}
                                                    </span>
                                                )}
                                                <button
                                                    className="fx-compose-submit"
                                                    disabled={!composeText.trim() || charsLeft < 0}
                                                    onClick={handlePublish}
                                                >
                                                    Postează
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Threads ── */}
                                {filteredThreads.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--muted)' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: 14, opacity: .5 }}>🔍</div>
                                        <div style={{
                                            fontFamily: "'Barlow Condensed', sans-serif",
                                            fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: 6,
                                        }}>
                                            Nicio postare găsită
                                        </div>
                                        <div style={{ fontSize: '.85rem', lineHeight: 1.6 }}>
                                            Încearcă altă categorie sau scrie prima postare!
                                        </div>
                                    </div>
                                ) : (
                                    filteredThreads.map((thread, idx) => (
                                        <div key={thread.id}>
                                            {thread.pinned && (
                                                <div className="fx-pinned-badge" style={{ paddingTop: 12 }}>
                                                    {Icons.pin} Postare fixată
                                                </div>
                                            )}
                                            <div
                                                className="fx-thread"
                                                style={{ animationDelay: `${idx * 40}ms` }}
                                                onClick={() => setExpandedThread(thread.id)}
                                            >
                                                <div className="fx-thread-row">
                                                    <div className="fx-thread-ava" style={{ background: thread.color }}>
                                                        {thread.avatar}
                                                    </div>
                                                    <div className="fx-thread-body">
                                                        <div className="fx-thread-meta">
                                                            <span className="fx-author">{thread.author}</span>
                                                            {thread.verified && <span className="fx-verified">{Icons.verified}</span>}
                                                            <span className="fx-handle">{thread.handle}</span>
                                                            <span className="fx-time-dot">·</span>
                                                            <span className="fx-time">{thread.time}</span>
                                                            <span className="fx-category-tag">{thread.category}</span>
                                                        </div>
                                                        <div className="fx-content" style={{ marginBottom: 8 }}>
                                                            {renderContent(thread.content)}
                                                        </div>

                                                        {thread.poll && (
                                                            <div className="fx-poll" onClick={(e) => e.stopPropagation()}>
                                                                {thread.poll.options.map((opt, optIdx) => {
                                                                    const pct = thread.poll!.voted
                                                                        ? Math.round((opt.votes / thread.poll!.totalVotes) * 100)
                                                                        : 0;
                                                                    const maxVotes = Math.max(...thread.poll!.options.map((o) => o.votes));
                                                                    const isWinner = thread.poll!.voted && opt.votes === maxVotes;
                                                                    return (
                                                                        <div
                                                                            key={optIdx}
                                                                            className={`fx-poll-option${thread.poll!.voted ? ' fx-poll-option--voted' : ''}`}
                                                                            onClick={() => !thread.poll!.voted && handlePollVote(thread.id, optIdx)}
                                                                        >
                                                                            {thread.poll!.voted && (
                                                                                <div
                                                                                    className={`fx-poll-bar${isWinner ? ' fx-poll-bar--winner' : ''}`}
                                                                                    style={{ width: `${pct}%` }}
                                                                                />
                                                                            )}
                                                                            <div className="fx-poll-label">
                                                                                <span>{opt.label}</span>
                                                                                {thread.poll!.voted && <span className="fx-poll-pct">{pct}%</span>}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                                <div className="fx-poll-total">{formatCount(thread.poll.totalVotes)} voturi</div>
                                                            </div>
                                                        )}

                                                        <div className="fx-actions" onClick={(e) => e.stopPropagation()}>
                                                            <button className="fx-action fx-action--reply">
                                                                {Icons.reply} <span>{thread.replies.length}</span>
                                                            </button>
                                                            <button
                                                                className={`fx-action fx-action--repost${thread.reposted ? ' fx-action--reposted' : ''}`}
                                                                onClick={(e) => handleRepost(thread.id, e)}
                                                            >
                                                                {Icons.repost} <span>{formatCount(thread.reposts)}</span>
                                                            </button>
                                                            <button
                                                                className={`fx-action fx-action--like${thread.liked ? ' fx-action--liked' : ''} ${heartAnims.has(thread.id) ? 'fx-heart-pop' : ''}`}
                                                                onClick={(e) => handleLike(thread.id, e)}
                                                            >
                                                                {thread.liked ? Icons.heartFilled : Icons.heart} <span>{formatCount(thread.likes)}</span>
                                                            </button>
                                                            <button className="fx-action fx-action--views">
                                                                {Icons.views} <span>{formatCount(thread.views)}</span>
                                                            </button>
                                                            <button
                                                                className={`fx-action fx-action--bookmark${thread.bookmarked ? ' fx-action--bookmarked' : ''}`}
                                                                onClick={(e) => handleBookmark(thread.id, e)}
                                                            >
                                                                {thread.bookmarked ? Icons.bookmarkFilled : Icons.bookmark}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </>
                        )}
                    </main>

                    {/* ══════════ RIGHT SIDEBAR ══════════ */}
                    <aside className="fx-right">
                        {/* Search */}
                        <div className="fx-search">
                            <span className="fx-search-icon">{Icons.search}</span>
                            <input
                                className="fx-search-input"
                                placeholder="Caută în forum..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Trending */}
                        <div className="fx-trending-box">
                            <div className="fx-trending-header">🔥 Trending</div>
                            {TRENDING_TOPICS.slice(0, 4).map((topic) => (
                                <div
                                    key={topic.id}
                                    className="fx-trend"
                                    onClick={() => setSearchQuery(topic.tag)}
                                >
                                    <div className="fx-trend-cat">{topic.category}</div>
                                    <div className="fx-trend-tag">{topic.tag}</div>
                                    <div className="fx-trend-posts">{formatCount(topic.posts)} postări</div>
                                </div>
                            ))}
                            <button className="fx-trending-more">Arată mai mult</button>
                        </div>

                        {/* Suggested users */}
                        <div className="fx-suggest-box">
                            <div className="fx-suggest-header">Sugestii de urmărit</div>
                            {SUGGESTED_USERS.map((su) => {
                                const isFollowing = followedUsers.has(su.handle);
                                return (
                                    <div key={su.handle} className="fx-suggest-user">
                                        <div className="fx-suggest-ava" style={{ background: su.color }}>
                                            {getInitials(su.name)}
                                        </div>
                                        <div className="fx-suggest-info">
                                            <div className="fx-suggest-name">
                                                {su.name}
                                                {su.verified && Icons.verified}
                                            </div>
                                            <div className="fx-suggest-handle">{su.handle}</div>
                                            <div className="fx-suggest-bio">{su.bio}</div>
                                        </div>
                                        <button
                                            className={`fx-follow-btn${isFollowing ? ' fx-follow-btn--following' : ''}`}
                                            onClick={() => handleFollow(su)}
                                        >
                                            {isFollowing ? 'Urmăresc' : 'Urmărește'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer links */}
                        <div className="fx-footer-links">
                            <a className="fx-footer-link" href="#">Termeni</a>
                            <a className="fx-footer-link" href="#">Confidențialitate</a>
                            <a className="fx-footer-link" href="#">Cookies</a>
                            <a className="fx-footer-link" href="#">Accesibilitate</a>
                            <span className="fx-footer-link">© 2026 FitMoldova</span>
                        </div>
                    </aside>

                </div>

                {/* Toast */}
                <div className={`fx-toast${toast.visible ? ' fx-toast--show' : ''}`}>
                    {toast.msg}
                </div>
            </div>
        </>
    );
}
