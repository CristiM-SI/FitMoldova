/**
 * Shared Forum/Feed/Saved/Notifications styling tokens
 * Replaces inline CSS strings that were in each page component.
 * All values are compatible with MUI's sx prop.
 */
// ── Design tokens (forum dark-blue palette) ──────────────
export const ft = {
  bg: '#050d1a',
  card: '#0a1628',
  card2: '#0d1f3a',
  blue: '#1a6fff',
  cyan: '#00c8ff',
  cdim: 'rgba(0,200,255,0.10)',
  bdim: 'rgba(26,111,255,0.12)',
  text: '#e8f0fe',
  muted: '#5a7aa0',
  border: 'rgba(0,200,255,0.08)',
  border2: 'rgba(0,200,255,0.14)',
  radius: '16px',
  red: '#ff4d6d',
  green: '#00b894',
  contentColor: '#c8daf0',
  font: "'Barlow', sans-serif",
  fontCondensed: "'Barlow Condensed', sans-serif",
  fontImport:
    "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap",
} as const;

// ── Reusable SX blocks ───────────────────────────────────

/** Main page container (.fx / .fd / .sv / .nt) */
export const sxPageRoot = {
  fontFamily: ft.font,
  bgcolor: ft.bg,
  color: ft.text,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  // grid overlay
  '&::before': {
    content: '""',
    position: 'fixed',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0,200,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.02) 1px, transparent 1px)`,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },
} as const;

/** Body wrapper (flex row, centered) */
export const sxBody = {
  position: 'relative',
  zIndex: 1,
  flex: 1,
  display: 'flex',
  maxWidth: 1200,
  mx: 'auto',
  width: '100%',
} as const;

/** Left sidebar */
export const sxSidebar = {
  width: 270,
  flexShrink: 0,
  position: 'sticky',
  top: 72,
  height: 'calc(100vh - 72px)',
  overflowY: 'auto',
  p: '20px 16px',
  borderRight: `1px solid ${ft.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '@media (max-width:850px)': {
    width: 72,
    p: '16px 8px',
    '& .sidebar-text, & .nav-badge': { display: 'none' },
    '& .nav-item': { justifyContent: 'center', p: '14px' },
  },
  '@media (max-width:600px)': {
    display: 'none',
  },
  // scrollbar
  '&::-webkit-scrollbar': { width: 4 },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(0,200,255,.15)', borderRadius: 100 },
} as const;

/** Sidebar nav item (button) */
export const sxNavItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  p: '12px 16px',
  borderRadius: 100,
  background: 'transparent',
  border: 'none',
  color: ft.text,
  fontFamily: ft.font,
  fontSize: '.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all .15s',
  width: '100%',
  textAlign: 'left',
  '&:hover': { background: 'rgba(0,200,255,0.06)' },
} as const;

export const sxNavItemActive = {
  ...sxNavItem,
  fontWeight: 800,
  color: '#fff',
} as const;

/** Nav icon wrapper */
export const sxNavIcon = {
  width: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: ft.muted,
} as const;

export const sxNavIconActive = {
  ...sxNavIcon,
  color: ft.cyan,
} as const;

/** Nav badge */
export const sxNavBadge = {
  ml: 'auto',
  bgcolor: ft.blue,
  color: '#fff',
  borderRadius: 100,
  p: '2px 8px',
  fontSize: '.68rem',
  fontWeight: 700,
} as const;

/** Post button */
export const sxPostBtn = {
  mt: 2,
  width: '100%',
  p: '14px',
  borderRadius: 100,
  border: 'none',
  background: `linear-gradient(135deg, ${ft.blue}, #0099ff)`,
  color: '#fff',
  fontFamily: ft.fontCondensed,
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all .2s',
  boxShadow: `0 4px 20px rgba(26,111,255,.3)`,
  '&:hover': {
    background: `linear-gradient(135deg, #2a7fff, #00aaff)`,
    transform: 'translateY(-1px)',
  },
  '@media (max-width:850px)': { display: 'none' },
} as const;

/** Main content area */
export const sxMain = {
  flex: 1,
  minWidth: 0,
  borderRight: `1px solid ${ft.border}`,
  '@media (max-width:600px)': { borderRight: 'none' },
} as const;

/** Sticky header */
export const sxHeader = {
  position: 'sticky',
  top: 72,
  zIndex: 10,
  bgcolor: 'rgba(5,13,26,0.85)',
  backdropFilter: 'blur(16px)',
  borderBottom: `1px solid ${ft.border}`,
  p: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
} as const;

export const sxHeaderTitle = {
  fontFamily: ft.fontCondensed,
  fontWeight: 800,
  fontSize: '1.25rem',
  letterSpacing: '.5px',
} as const;

/** Thread item */
export const sxThread = {
  p: '16px 20px',
  borderBottom: `1px solid ${ft.border}`,
  transition: 'background .15s',
  cursor: 'pointer',
  '&:hover': { bgcolor: 'rgba(0,200,255,0.02)' },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(8px)' },
    to: { opacity: 1, transform: 'none' },
  },
  animation: 'fadeIn .3s ease both',
} as const;

export const sxThreadRow = { display: 'flex', gap: '12px' } as const;

export const sxThreadAva = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: '.85rem',
  color: '#fff',
} as const;

export const sxThreadBody = { flex: 1, minWidth: 0 } as const;

export const sxThreadMeta = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
  mb: '4px',
} as const;

export const sxAuthor = { fontWeight: 700, fontSize: '.92rem', color: '#fff' } as const;
export const sxHandle = { color: ft.muted, fontSize: '.82rem' } as const;
export const sxDot = { color: ft.muted, fontSize: '.72rem' } as const;
export const sxTime = { color: ft.muted, fontSize: '.82rem' } as const;

export const sxCategoryTag = {
  ml: 'auto',
  bgcolor: ft.bdim,
  color: ft.blue,
  borderRadius: 100,
  p: '2px 10px',
  fontSize: '.68rem',
  fontWeight: 700,
} as const;

export const sxContent = {
  fontSize: '.93rem',
  lineHeight: 1.6,
  color: ft.contentColor,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  mb: '12px',
} as const;

export const sxHashtag = { color: ft.cyan, fontWeight: 600 } as const;

/** Actions row */
export const sxActions = {
  display: 'flex',
  justifyContent: 'space-between',
  mt: '2px',
  maxWidth: 420,
} as const;

export const sxAction = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'none',
  border: 'none',
  color: ft.muted,
  fontSize: '.78rem',
  fontWeight: 600,
  p: '6px 10px',
  borderRadius: 100,
  cursor: 'pointer',
  transition: 'all .15s',
  '&:hover': { bgcolor: 'rgba(0,200,255,0.06)' },
} as const;

/** Empty state */
export const sxEmpty = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  p: '80px 32px',
  textAlign: 'center',
} as const;

export const sxEmptyIcon = { fontSize: '3rem', mb: 2, opacity: 0.5 } as const;

export const sxEmptyTitle = {
  fontFamily: ft.fontCondensed,
  fontSize: '1.3rem',
  fontWeight: 800,
  color: '#fff',
  mb: 1,
} as const;

export const sxEmptySub = {
  fontSize: '.88rem',
  color: ft.muted,
  lineHeight: 1.6,
  maxWidth: 320,
} as const;

export const sxEmptyBtn = {
  mt: '20px',
  p: '10px 28px',
  borderRadius: 100,
  border: 'none',
  bgcolor: ft.blue,
  color: '#fff',
  fontFamily: ft.fontCondensed,
  fontWeight: 700,
  fontSize: '.9rem',
  letterSpacing: '.5px',
  cursor: 'pointer',
  transition: 'all .15s',
  '&:hover': { bgcolor: '#2a7fff', transform: 'translateY(-1px)' },
} as const;

/** Toast */
export const sxToast = (visible: boolean) =>
  ({
    position: 'fixed',
    bottom: 28,
    left: '50%',
    zIndex: 300,
    bgcolor: ft.blue,
    borderRadius: '8px',
    p: '12px 20px',
    fontSize: '.86rem',
    fontWeight: 600,
    color: '#fff',
    boxShadow: '0 8px 32px rgba(0,0,0,.5)',
    transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 80px)',
    opacity: visible ? 1 : 0,
    transition: 'all .4s cubic-bezier(.34,1.56,.64,1)',
    pointerEvents: 'none',
  } as const);

/** Right sidebar */
export const sxRightSidebar = {
  width: 320,
  flexShrink: 0,
  position: 'sticky',
  top: 72,
  height: 'calc(100vh - 72px)',
  overflowY: 'auto',
  p: '20px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '@media (max-width:1100px)': { display: 'none' },
  '&::-webkit-scrollbar': { width: 4 },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(0,200,255,.15)', borderRadius: 100 },
} as const;

/** Search box */
export const sxSearchBox = { position: 'relative' } as const;

export const sxSearchIcon = {
  position: 'absolute',
  left: 14,
  top: '50%',
  transform: 'translateY(-50%)',
  color: ft.muted,
  display: 'flex',
  pointerEvents: 'none',
} as const;

export const sxSearchInput = {
  width: '100%',
  p: '12px 14px 12px 42px',
  bgcolor: ft.card2,
  border: `1px solid ${ft.border}`,
  borderRadius: 100,
  color: ft.text,
  fontFamily: ft.font,
  fontSize: '.88rem',
  outline: 'none',
  transition: 'all .15s',
  '&:focus': { borderColor: ft.cyan, bgcolor: ft.bg },
  '&::placeholder': { color: ft.muted },
} as const;

/** Suggest box (users panel) */
export const sxSuggestBox = {
  bgcolor: ft.card,
  border: `1px solid ${ft.border}`,
  borderRadius: ft.radius,
  overflow: 'hidden',
} as const;

export const sxSuggestHeader = {
  p: '16px 18px',
  fontFamily: ft.fontCondensed,
  fontWeight: 800,
  fontSize: '1.1rem',
  letterSpacing: '.5px',
} as const;

export const sxSuggestUser = {
  p: '12px 18px',
  borderTop: `1px solid ${ft.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'background .15s',
  '&:hover': { bgcolor: 'rgba(0,200,255,0.03)' },
} as const;

export const sxSuggestAva = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 900,
  fontSize: '.8rem',
  color: '#fff',
} as const;

export const sxSuggestInfo = { flex: 1, minWidth: 0 } as const;

export const sxSuggestName = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 700,
  fontSize: '.88rem',
} as const;

export const sxSuggestHandle = { fontSize: '.76rem', color: ft.muted } as const;

export const sxSuggestBio = {
  fontSize: '.76rem',
  color: ft.muted,
  mt: '2px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

export const sxFollowBtn = (isFollowing: boolean) =>
  ({
    p: '6px 16px',
    borderRadius: 100,
    border: isFollowing ? `1.5px solid rgba(0,200,255,0.3)` : `1.5px solid ${ft.text}`,
    bgcolor: isFollowing ? 'transparent' : ft.text,
    color: isFollowing ? ft.text : ft.bg,
    fontFamily: ft.fontCondensed,
    fontWeight: 700,
    fontSize: '.78rem',
    cursor: 'pointer',
    transition: 'all .15s',
    '&:hover': isFollowing
      ? { borderColor: ft.red, color: ft.red }
      : { bgcolor: '#cde0ff', borderColor: '#cde0ff' },
  } as const);

/** Filter chips / tabs */
export const sxFilterBar = {
  display: 'flex',
  gap: 1,
  p: '12px 20px',
  borderBottom: `1px solid ${ft.border}`,
  overflowX: 'auto',
  '&::-webkit-scrollbar': { display: 'none' },
  scrollbarWidth: 'none',
} as const;

export const sxFilterChip = (active: boolean) =>
  ({
    p: '6px 16px',
    borderRadius: 100,
    border: `1.5px solid ${active ? ft.cyan : ft.border2}`,
    bgcolor: active ? 'rgba(0,200,255,0.06)' : 'transparent',
    color: active ? ft.cyan : ft.muted,
    fontFamily: ft.font,
    fontSize: '.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
    '&:hover': { borderColor: ft.cyan, color: ft.text },
  } as const);

export const sxTab = (active: boolean) =>
  ({
    flex: 1,
    minWidth: 'max-content',
    p: '14px 20px',
    background: 'none',
    border: 'none',
    borderBottom: active ? `2px solid ${ft.cyan}` : '2px solid transparent',
    color: active ? '#fff' : ft.muted,
    fontFamily: ft.font,
    fontSize: '.82rem',
    fontWeight: active ? 700 : 600,
    letterSpacing: '.5px',
    cursor: 'pointer',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
    '&:hover': { bgcolor: 'rgba(0,200,255,0.04)', color: ft.text },
  } as const);

export const sxTabs = {
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
} as const;

/** Font import style tag content */
export const fontImportCSS = `@import url('${ft.fontImport}');`;

/** Keyframes CSS (minimal, needed for animations) */
export const keyframesCSS = `
@keyframes forumFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
@keyframes heartPop { 0%{transform:scale(1)} 30%{transform:scale(1.3)} 60%{transform:scale(0.95)} 100%{transform:scale(1)} }
`;
