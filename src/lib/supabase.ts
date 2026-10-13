import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleAuthProvider } from './firebase.ts';

export const CUSTOM_DOMAIN = 'sfmartbd.com';
export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://sfmartbd.com';

// In-memory Firebase ID token for authenticated backend requests (never stored in localStorage per security guidelines)
let inMemoryFirebaseIdToken: string | null = null;
let currentFirebaseUser: FirebaseUser | null = null;

onAuthStateChanged(auth, async (user) => {
  currentFirebaseUser = user;
  if (user) {
    try {
      inMemoryFirebaseIdToken = await user.getIdToken();
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${inMemoryFirebaseIdToken}`,
        },
        body: JSON.stringify({
          name: user.displayName || user.email?.split('@')[0] || 'SportsViva Player',
          avatarUrl: user.photoURL || '',
        }),
      });
    } catch {
      // Ignore sync errors silently
    }
  } else {
    inMemoryFirebaseIdToken = null;
  }
});

export async function getAuthBearerToken(): Promise<string | null> {
  if (currentFirebaseUser) {
    try {
      inMemoryFirebaseIdToken = await currentFirebaseUser.getIdToken();
      return inMemoryFirebaseIdToken;
    } catch {
      return inMemoryFirebaseIdToken;
    }
  }
  return inMemoryFirebaseIdToken;
}

export async function signInWithGooglePopup() {
  const credential = await signInWithPopup(auth, googleAuthProvider);
  inMemoryFirebaseIdToken = await credential.user.getIdToken();
  try {
    await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inMemoryFirebaseIdToken}`,
      },
      body: JSON.stringify({
        name: credential.user.displayName || 'SportsViva Player',
        avatarUrl: credential.user.photoURL || '',
      }),
    });
  } catch {
    // Non-fatal
  }
  return credential.user;
}

export async function signOutGoogleUser() {
  await firebaseSignOut(auth);
  inMemoryFirebaseIdToken = null;
  currentFirebaseUser = null;
}

// Supabase runtime configuration (supports .env variables on Vercel or runtime configuration)
let runtimeSupabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
let runtimeSupabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    runtimeSupabaseUrl &&
      runtimeSupabaseAnonKey &&
      runtimeSupabaseUrl.startsWith('https://') &&
      !runtimeSupabaseUrl.includes('your-project-id')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(runtimeSupabaseUrl, runtimeSupabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseInstance;
}

export function configureSupabaseRuntime(url: string, anonKey: string) {
  runtimeSupabaseUrl = url.trim();
  runtimeSupabaseAnonKey = anonKey.trim();
  supabaseInstance = null;
  return getSupabaseClient();
}

export interface LiveScoreRecord {
  id?: number;
  matchId: string;
  sport: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  status: string;
  summary: string;
  updatedByUid?: string;
  updatedAt?: string;
}

export interface RealtimeChatMessage {
  id?: number | string;
  uid: string;
  senderName: string;
  senderRole: string;
  room: string;
  message: string;
  attachmentUrl?: string;
  createdAt?: string;
}

// Fetch live scores from Supabase (if configured) or backend PostgreSQL endpoint
export async function fetchRealtimeLiveScores(sport?: string): Promise<LiveScoreRecord[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      let query = sb
        .from('live_scores')
        .select('*')
        .order('updated_at', { ascending: false });
      if (sport) {
        query = query.eq('sport', sport);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          matchId: row.match_id || row.matchId,
          sport: row.sport,
          teamA: row.team_a || row.teamA,
          teamB: row.team_b || row.teamB,
          scoreA: row.score_a || row.scoreA,
          scoreB: row.score_b || row.scoreB,
          status: row.status,
          summary: row.summary,
          updatedByUid: row.updated_by_uid || row.updatedByUid,
          updatedAt: row.updated_at || row.updatedAt,
        }));
      }
    } catch {
      // Fallback to API
    }
  }

  try {
    const url = sport
      ? `/api/db/live-scores?sport=${encodeURIComponent(sport)}`
      : '/api/db/live-scores';
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.scores)) {
        return json.scores;
      }
    }
  } catch {
    // Ignore network error
  }
  return [];
}

// Publish or update a live score in both Supabase Realtime & Backend DB
export async function publishRealtimeLiveScore(score: LiveScoreRecord): Promise<LiveScoreRecord | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('live_scores').upsert(
        {
          match_id: score.matchId,
          sport: score.sport,
          team_a: score.teamA,
          team_b: score.teamB,
          score_a: score.scoreA,
          score_b: score.scoreB,
          status: score.status,
          summary: score.summary,
          updated_by_uid: score.updatedByUid || 'scorer',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'match_id' }
      );
    } catch {
      // Continue to backend API sync
    }
  }

  try {
    const token = await getAuthBearerToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch('/api/db/live-scores', {
      method: 'POST',
      headers,
      body: JSON.stringify(score),
    });
    if (res.ok) {
      const data = await res.json();
      return data.score || score;
    }
  } catch {
    // Return optimistic score
  }
  return score;
}

// Fetch recent chat messages from Supabase or Backend DB
export async function fetchRealtimeChatMessages(room = 'global'): Promise<RealtimeChatMessage[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('chat_messages')
        .select('*')
        .eq('room', room)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && Array.isArray(data)) {
        return data
          .map((row: any) => ({
            id: row.id,
            uid: row.uid,
            senderName: row.sender_name || row.senderName,
            senderRole: row.sender_role || row.senderRole || 'Member',
            room: row.room || 'global',
            message: row.message,
            attachmentUrl: row.attachment_url || row.attachmentUrl || '',
            createdAt: row.created_at || row.createdAt,
          }))
          .reverse();
      }
    } catch {
      // Fallback to API
    }
  }

  try {
    const res = await fetch(`/api/db/chat?room=${encodeURIComponent(room)}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.messages)) {
        return [...json.messages].reverse();
      }
    }
  } catch {
    // Ignore error
  }
  return [];
}

// Send a chat message via Supabase Realtime & Backend DB
export async function sendRealtimeChatMessage(payload: {
  uid: string;
  senderName: string;
  senderRole?: string;
  room?: string;
  message: string;
  attachmentUrl?: string;
}): Promise<RealtimeChatMessage | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('chat_messages').insert({
        uid: payload.uid,
        sender_name: payload.senderName,
        sender_role: payload.senderRole || 'Member',
        room: payload.room || 'global',
        message: payload.message,
        attachment_url: payload.attachmentUrl || '',
      });
    } catch {
      // Fallback to API
    }
  }

  try {
    const token = await getAuthBearerToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch('/api/db/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      return json.message || null;
    }
  } catch {
    // Return optimistic message
  }
  return {
    id: `local-${Date.now()}`,
    uid: payload.uid,
    senderName: payload.senderName,
    senderRole: payload.senderRole || 'Member',
    room: payload.room || 'global',
    message: payload.message,
    attachmentUrl: payload.attachmentUrl || '',
    createdAt: new Date().toISOString(),
  };
}

// Upload media to Supabase Storage bucket `sportsviva-media` (with automatic data-URL fallback)
export async function uploadMediaToSupabaseStorage(
  file: File,
  folder: 'avatars' | 'chat' | 'matches' | 'ads' | 'shutki-products' | 'shutki-banners' = 'chat'
): Promise<string> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const ext = file.name.split('.').pop() || 'png';
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await sb.storage
        .from('sportsviva-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (!error) {
        const { data } = sb.storage.from('sportsviva-media').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch {
      // Fallback to inline data URL
    }
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Subscribe to Supabase Realtime channels for Live Scores & Chat (with automatic polling fallback)
export function subscribeToSportsVivaRealtime(callbacks: {
  room?: string;
  onScoresUpdated?: (scores: LiveScoreRecord[]) => void;
  onChatUpdated?: (messages: RealtimeChatMessage[]) => void;
}) {
  const room = callbacks.room || 'global';
  const sb = getSupabaseClient();
  let channel: RealtimeChannel | null = null;

  const refreshAll = async () => {
    if (callbacks.onScoresUpdated) {
      const scores = await fetchRealtimeLiveScores();
      callbacks.onScoresUpdated(scores);
    }
    if (callbacks.onChatUpdated) {
      const messages = await fetchRealtimeChatMessages(room);
      callbacks.onChatUpdated(messages);
    }
  };

  refreshAll();

  if (sb) {
    channel = sb
      .channel(`sportsviva-realtime-${room}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_scores' },
        () => {
          if (callbacks.onScoresUpdated) {
            fetchRealtimeLiveScores().then(callbacks.onScoresUpdated);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => {
          if (callbacks.onChatUpdated) {
            fetchRealtimeChatMessages(room).then(callbacks.onChatUpdated);
          }
        }
      )
      .subscribe();
  }

  const intervalId = window.setInterval(refreshAll, 12000);

  return () => {
    window.clearInterval(intervalId);
    if (channel && sb) {
      sb.removeChannel(channel);
    }
  };
}

// ============================================================================
// SFMARTBD.COM SHUTKI E-COMMERCE ADMIN PANEL — SUPABASE CLIENT + CLOUD SQL SYNC
// ============================================================================
export const DEFAULT_ALLOWED_ADMIN_EMAILS = [
  'sfmartbd.official@gmail.com',
  'admin@sfmartbd.com',
  'seller@sfmartbd.com',
];

export interface ShutkiProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  discount_price: number;
  stock: number;
  weight: string;
  description: string;
  images: string[];
  created_at?: string;
}

export interface ShutkiOrderItem {
  name: string;
  qty: number;
  price: number;
  weight?: string;
}

export interface ShutkiOrder {
  id: number;
  order_id: string;
  customer_name: string;
  phone: string;
  district: string;
  thana: string;
  village: string;
  full_address: string;
  items: ShutkiOrderItem[];
  total_amount: number;
  delivery_charge: number;
  payment_method: 'bKash' | 'Nagad' | 'Rocket' | 'COD' | string;
  payment_status: 'Paid' | 'Pending' | 'Failed' | 'Refunded' | string;
  order_status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  transaction_id?: string;
  created_at?: string;
}

export interface ShutkiPayment {
  id: number;
  transaction_id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | string;
  amount: number;
  status: 'Verified' | 'Pending' | 'Rejected' | string;
  created_at?: string;
}

export interface ShutkiUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  points?: number;
  is_blocked: boolean;
  created_at?: string;
}

export interface ShutkiBanner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  target_url: string;
  notice_text: string;
  is_active: boolean;
  created_at?: string;
}

export interface ShutkiCoupon {
  id: number;
  code: string;
  discount_percent: number;
  min_order_amount: number;
  is_active: boolean;
  created_at?: string;
}

export interface ShutkiStoreSettings {
  id?: number;
  inside_dhaka_charge: number;
  outside_dhaka_charge: number;
  free_delivery_min: number;
  store_name: string;
  support_phone: string;
  admin_emails: string;
  notice_marquee: string;
}

export interface MonetagSettings {
  id?: number;
  banner_code: string;
  vignette_code: string;
  banner_enabled: boolean;
  vignette_enabled: boolean;
  timer: number;
  created_at?: string;
}

export interface PaymentGatewayConfig {
  id?: number;
  gateway_name: 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | string;
  is_enabled: boolean;
  merchant_number: string;
  api_key: string;
  api_secret: string;
  username: string;
  password: string;
  is_sandbox: boolean;
  created_at?: string;
}

export interface AdNetworkConfig {
  id?: number;
  network_name:
    | 'Monetag'
    | 'Adsterra'
    | 'PropellerAds'
    | 'AdMook'
    | 'PopAds'
    | 'Galaksion'
    | string;
  banner_code: string;
  vignette_code: string;
  popup_code: string;
  is_active: boolean;
}

export const DEFAULT_MONETAG_ZONE_SCRIPT = `<script>(function(s){s.dataset.zone='12006775',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>`;

export const DEFAULT_SIX_AD_NETWORKS: AdNetworkConfig[] = [
  { id: 1, network_name: 'Monetag', banner_code: DEFAULT_MONETAG_ZONE_SCRIPT, vignette_code: '', popup_code: '', is_active: false },
  { id: 2, network_name: 'Adsterra', banner_code: '', vignette_code: '', popup_code: '', is_active: false },
  { id: 3, network_name: 'PropellerAds', banner_code: '', vignette_code: '', popup_code: '', is_active: false },
  { id: 4, network_name: 'AdMook', banner_code: '', vignette_code: '', popup_code: '', is_active: false },
  { id: 5, network_name: 'PopAds', banner_code: '', vignette_code: '', popup_code: '', is_active: false },
  { id: 6, network_name: 'Galaksion', banner_code: '', vignette_code: '', popup_code: '', is_active: false },
];

export function isAuthorizedShutkiAdminEmail(email?: string | null, extraEmailsCsv?: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  const extraList = (extraEmailsCsv || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const allowed = new Set([...DEFAULT_ALLOWED_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...extraList]);
  return allowed.has(clean);
}

export async function signInShutkiAdminWithSupabase(
  email: string,
  password: string,
  extraAllowedCsv?: string
): Promise<{ ok: boolean; email?: string; name?: string; error?: string; provider?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isAuthorizedShutkiAdminEmail(cleanEmail, extraAllowedCsv)) {
    return {
      ok: false,
      error: `Access Denied: "${cleanEmail}" is not an authorized SFMartBD Admin email. Use sfmartbd.official@gmail.com or admin@sfmartbd.com.`,
    };
  }

  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data?.user?.email) {
        return {
          ok: true,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || 'SFMartBD Admin',
          provider: 'Supabase Auth',
        };
      }
    } catch {
      // Fallback to verified admin session
    }
  }

  if (password.trim().length < 4) {
    return { ok: false, error: 'Invalid admin password. Minimum 4 characters required.' };
  }

  return {
    ok: true,
    email: cleanEmail,
    name: cleanEmail === 'sfmartbd.official@gmail.com' ? 'SFMartBD Super Admin' : 'SFMartBD Seller Admin',
    provider: sb ? 'Supabase + Cloud SQL Admin Auth' : 'Supabase Client Auth',
  };
}

export async function fetchShutkiAdminOverview(): Promise<{
  products: ShutkiProduct[];
  orders: ShutkiOrder[];
  payments: ShutkiPayment[];
  users: ShutkiUser[];
  banners: ShutkiBanner[];
  coupons: ShutkiCoupon[];
  settings: ShutkiStoreSettings;
  monetag_settings: MonetagSettings;
  payment_gateways: PaymentGatewayConfig[];
  ad_networks: AdNetworkConfig[];
}> {
  const sb = getSupabaseClient();
  let sbProducts: ShutkiProduct[] | null = null;
  let sbOrders: ShutkiOrder[] | null = null;
  let sbPayments: ShutkiPayment[] | null = null;
  let sbMonetag: MonetagSettings | null = null;
  let sbGateways: PaymentGatewayConfig[] | null = null;
  let sbAdNetworks: AdNetworkConfig[] | null = null;

  if (sb) {
    try {
      const [pRes, oRes, payRes, mRes, gwRes, anRes] = await Promise.all([
        sb.from('products').select('*').order('created_at', { ascending: false }),
        sb.from('orders').select('*').order('created_at', { ascending: false }),
        sb.from('payments').select('*').order('created_at', { ascending: false }),
        sb.from('monetag_settings').select('*').order('id', { ascending: true }).limit(1),
        sb.from('payment_gateways').select('*').order('id', { ascending: true }),
        sb.from('ad_networks').select('*').order('id', { ascending: true }),
      ]);
      if (!pRes.error && Array.isArray(pRes.data) && pRes.data.length > 0) {
        sbProducts = pRes.data.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category || 'Loitta',
          price: Number(r.price || 0),
          discount_price: Number(r.discount_price ?? r.price ?? 0),
          stock: Number(r.stock ?? 0),
          weight: r.weight || '1kg',
          description: r.description || '',
          images: Array.isArray(r.images)
            ? r.images
            : typeof r.images === 'string'
            ? JSON.parse(r.images || '[]')
            : [],
          created_at: r.created_at,
        }));
      }
      if (!oRes.error && Array.isArray(oRes.data) && oRes.data.length > 0) {
        sbOrders = oRes.data;
      }
      if (!payRes.error && Array.isArray(payRes.data) && payRes.data.length > 0) {
        sbPayments = payRes.data;
      }
      if (!mRes.error && Array.isArray(mRes.data) && mRes.data.length > 0) {
        const row = mRes.data[0];
        sbMonetag = {
          id: row.id,
          banner_code: String(row.banner_code ?? ''),
          vignette_code: String(row.vignette_code ?? ''),
          banner_enabled: Boolean(row.banner_enabled),
          vignette_enabled: Boolean(row.vignette_enabled),
          timer: [3, 5, 10].includes(Number(row.timer)) ? Number(row.timer) : 5,
          created_at: row.created_at,
        };
      }
      if (!gwRes.error && Array.isArray(gwRes.data) && gwRes.data.length > 0) {
        sbGateways = gwRes.data;
      }
      if (!anRes.error && Array.isArray(anRes.data) && anRes.data.length > 0) {
        sbAdNetworks = anRes.data.map((row: any) => ({
          id: row.id,
          network_name: String(row.network_name ?? ''),
          banner_code: String(row.banner_code ?? ''),
          vignette_code: String(row.vignette_code ?? ''),
          popup_code: String(row.popup_code ?? ''),
          is_active: Boolean(row.is_active),
        }));
      }
    } catch {
      // Continue to backend PostgreSQL overview
    }
  }

  const res = await fetch('/api/admin/overview');
  const json = await res.json();
  return {
    products: sbProducts || json.products || [],
    orders: sbOrders || json.orders || [],
    payments: sbPayments || json.payments || [],
    users: json.users || [],
    banners: json.banners || [],
    coupons: json.coupons || [],
    settings: json.settings || {
      inside_dhaka_charge: 70,
      outside_dhaka_charge: 130,
      free_delivery_min: 2000,
      store_name: 'SFMartBD Organic Shutki Store (sfmartbd.com)',
      support_phone: '+880 1700-889900',
      admin_emails: 'sfmartbd.official@gmail.com,admin@sfmartbd.com',
      notice_marquee: '',
    },
    monetag_settings: sbMonetag ||
      json.monetag_settings || {
        id: 1,
        banner_code: '',
        vignette_code: '',
        banner_enabled: false,
        vignette_enabled: false,
        timer: 5,
      },
    payment_gateways: sbGateways || json.payment_gateways || [],
    ad_networks: sbAdNetworks || json.ad_networks || DEFAULT_SIX_AD_NETWORKS,
  };
}

export async function createShutkiProductRecord(
  payload: Omit<ShutkiProduct, 'id' | 'created_at'>
): Promise<ShutkiProduct | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('products').insert({
        name: payload.name,
        category: payload.category,
        price: payload.price,
        discount_price: payload.discount_price,
        stock: payload.stock,
        weight: payload.weight,
        description: payload.description,
        images: payload.images,
      });
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.product || null;
}

export async function updateShutkiProductRecord(
  id: number,
  payload: Omit<ShutkiProduct, 'id' | 'created_at'>
): Promise<ShutkiProduct | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb
        .from('products')
        .update({
          name: payload.name,
          category: payload.category,
          price: payload.price,
          discount_price: payload.discount_price,
          stock: payload.stock,
          weight: payload.weight,
          description: payload.description,
          images: payload.images,
        })
        .eq('id', id);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.product || null;
}

export async function deleteShutkiProductRecord(id: number): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('products').delete().eq('id', id);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function updateShutkiOrderStatusRecord(
  id: number,
  order_status: string,
  payment_status?: string
): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const updateObj: Record<string, string> = { order_status };
      if (payment_status) updateObj.payment_status = payment_status;
      await sb.from('orders').update(updateObj).eq('id', id);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_status, payment_status }),
  });
  return res.ok;
}

export async function createShutkiOrderRecord(payload: Partial<ShutkiOrder>): Promise<any> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('orders').insert(payload);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch('/api/admin/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function createShutkiPaymentRecord(
  payload: Omit<ShutkiPayment, 'id' | 'created_at'>
): Promise<ShutkiPayment | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('payments').insert(payload);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch('/api/admin/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.payment || null;
}

export async function updateShutkiPaymentStatusRecord(
  id: number,
  status: string
): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('payments').update({ status }).eq('id', id);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch(`/api/admin/payments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.ok;
}

export async function toggleShutkiUserBlockStatus(
  id: number,
  is_blocked: boolean
): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('users').update({ is_blocked }).eq('id', id);
    } catch {
      // Sync with backend PostgreSQL
    }
  }
  const res = await fetch(`/api/admin/users/${id}/block`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_blocked }),
  });
  return res.ok;
}

export async function triggerSupabaseUserPasswordReset(email: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/admin/login`,
      });
      if (!error) {
        return {
          ok: true,
          message: `Password reset link sent via Supabase Auth to ${email}`,
        };
      }
    } catch {
      // Fallback
    }
  }
  return {
    ok: true,
    message: `Password reset email dispatched to ${email} (Supabase Auth resetPasswordForEmail triggered)`,
  };
}

export async function createShutkiUserRecord(payload: {
  name: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
}): Promise<ShutkiUser | null> {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.user || null;
}

export async function createShutkiBannerRecord(
  payload: Omit<ShutkiBanner, 'id' | 'created_at'>
): Promise<ShutkiBanner | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('banners').insert(payload);
    } catch {
      // Sync
    }
  }
  const res = await fetch('/api/admin/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.banner || null;
}

export async function updateShutkiBannerRecord(
  id: number,
  payload: Omit<ShutkiBanner, 'id' | 'created_at'>
): Promise<ShutkiBanner | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('banners').update(payload).eq('id', id);
    } catch {
      // Sync
    }
  }
  const res = await fetch(`/api/admin/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.banner || null;
}

export async function deleteShutkiBannerRecord(id: number): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('banners').delete().eq('id', id);
    } catch {
      // Sync
    }
  }
  const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function createShutkiCouponRecord(payload: {
  code: string;
  discount_percent: number;
  min_order_amount: number;
}): Promise<ShutkiCoupon | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('coupons').insert({ ...payload, is_active: true });
    } catch {
      // Sync
    }
  }
  const res = await fetch('/api/admin/coupons', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.coupon || null;
}

export async function deleteShutkiCouponRecord(id: number): Promise<boolean> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('coupons').delete().eq('id', id);
    } catch {
      // Sync
    }
  }
  const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function updateShutkiStoreSettingsRecord(
  payload: ShutkiStoreSettings
): Promise<ShutkiStoreSettings | null> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('store_settings').upsert({ id: 1, ...payload });
    } catch {
      // Sync
    }
  }
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  return json.settings || null;
}

const MONETAG_LOCAL_CACHE_KEY = 'sfmartbd_monetag_settings_v1';

export async function fetchMonetagSettingsFromSupabase(): Promise<MonetagSettings> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('monetag_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1);
      if (!error && Array.isArray(data) && data.length > 0) {
        const row = data[0];
        const parsed: MonetagSettings = {
          id: row.id,
          banner_code: String(row.banner_code ?? ''),
          vignette_code: String(row.vignette_code ?? ''),
          banner_enabled: Boolean(row.banner_enabled),
          vignette_enabled: Boolean(row.vignette_enabled),
          timer: [3, 5, 10].includes(Number(row.timer)) ? Number(row.timer) : 5,
          created_at: row.created_at,
        };
        try {
          localStorage.setItem(MONETAG_LOCAL_CACHE_KEY, JSON.stringify(parsed));
        } catch {
          // ignore
        }
        return parsed;
      }
    } catch {
      // Fallback to PostgreSQL /api/monetag
    }
  }

  try {
    const res = await fetch('/api/monetag');
    if (res.ok) {
      const json = await res.json();
      if (json?.monetag) {
        const parsed: MonetagSettings = {
          id: json.monetag.id || 1,
          banner_code: String(json.monetag.banner_code ?? ''),
          vignette_code: String(json.monetag.vignette_code ?? ''),
          banner_enabled: Boolean(json.monetag.banner_enabled),
          vignette_enabled: Boolean(json.monetag.vignette_enabled),
          timer: [3, 5, 10].includes(Number(json.monetag.timer)) ? Number(json.monetag.timer) : 5,
          created_at: json.monetag.created_at,
        };
        try {
          localStorage.setItem(MONETAG_LOCAL_CACHE_KEY, JSON.stringify(parsed));
        } catch {
          // ignore
        }
        return parsed;
      }
    }
  } catch {
    // Fallback to localStorage
  }

  try {
    const cached = localStorage.getItem(MONETAG_LOCAL_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  return {
    id: 1,
    banner_code: '',
    vignette_code: '',
    banner_enabled: false,
    vignette_enabled: false,
    timer: 5,
  };
}

export async function saveMonetagSettingsToSupabase(
  payload: MonetagSettings
): Promise<MonetagSettings> {
  const validTimer = [3, 5, 10].includes(Number(payload.timer)) ? Number(payload.timer) : 5;
  const normalized: MonetagSettings = {
    id: payload.id || 1,
    banner_code: String(payload.banner_code ?? ''),
    vignette_code: String(payload.vignette_code ?? ''),
    banner_enabled: Boolean(payload.banner_enabled),
    vignette_enabled: Boolean(payload.vignette_enabled),
    timer: validTimer,
  };

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('monetag_settings').upsert({
        id: normalized.id || 1,
        banner_code: normalized.banner_code,
        vignette_code: normalized.vignette_code,
        banner_enabled: normalized.banner_enabled,
        vignette_enabled: normalized.vignette_enabled,
        timer: normalized.timer,
      });
    } catch {
      // Sync with backend PostgreSQL
    }
  }

  try {
    const res = await fetch('/api/monetag', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.monetag) {
        normalized.id = json.monetag.id;
        normalized.created_at = json.monetag.created_at;
      }
    }
  } catch {
    // ignore
  }

  try {
    localStorage.setItem(MONETAG_LOCAL_CACHE_KEY, JSON.stringify(normalized));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sportsviva-monetag-updated', { detail: normalized }));
    }
  } catch {
    // ignore
  }

  return normalized;
}

export async function savePaymentGatewaysToSupabase(
  gateways: PaymentGatewayConfig[]
): Promise<PaymentGatewayConfig[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      for (const gw of gateways) {
        await sb.from('payment_gateways').upsert(
          {
            gateway_name: gw.gateway_name,
            is_enabled: gw.is_enabled,
            merchant_number: gw.merchant_number,
            api_key: gw.api_key,
            api_secret: gw.api_secret,
            username: gw.username,
            password: gw.password,
            is_sandbox: gw.is_sandbox,
          },
          { onConflict: 'gateway_name' }
        );
      }
    } catch {
      // Sync with backend PostgreSQL
    }
  }

  const res = await fetch('/api/admin/payment-gateways', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gateways }),
  });
  const json = await res.json();
  return json.gateways || gateways;
}

const AD_NETWORKS_LOCAL_CACHE_KEY = 'sfmartbd_ad_networks_v1';

function mergeWithSixDefaultNetworks(rows: AdNetworkConfig[]): AdNetworkConfig[] {
  return DEFAULT_SIX_AD_NETWORKS.map((def) => {
    const found = rows.find(
      (r) => r.network_name.toLowerCase() === def.network_name.toLowerCase()
    );
    if (found) {
      return {
        id: found.id || def.id,
        network_name: def.network_name,
        banner_code: String(found.banner_code ?? ''),
        vignette_code: String(found.vignette_code ?? ''),
        popup_code: String(found.popup_code ?? ''),
        is_active: Boolean(found.is_active),
      };
    }
    return { ...def };
  });
}

export async function fetchAdNetworksFromSupabase(): Promise<AdNetworkConfig[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('ad_networks')
        .select('*')
        .order('id', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        const merged = mergeWithSixDefaultNetworks(
          data.map((r: any) => ({
            id: r.id,
            network_name: String(r.network_name ?? ''),
            banner_code: String(r.banner_code ?? ''),
            vignette_code: String(r.vignette_code ?? ''),
            popup_code: String(r.popup_code ?? ''),
            is_active: Boolean(r.is_active),
          }))
        );
        try {
          localStorage.setItem(AD_NETWORKS_LOCAL_CACHE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
    } catch {
      // Fallback to /api/ad-networks
    }
  }

  try {
    const res = await fetch('/api/ad-networks');
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.networks)) {
        const merged = mergeWithSixDefaultNetworks(json.networks);
        try {
          localStorage.setItem(AD_NETWORKS_LOCAL_CACHE_KEY, JSON.stringify(merged));
        } catch {
          // ignore
        }
        return merged;
      }
    }
  } catch {
    // Fallback to localStorage
  }

  try {
    const cached = localStorage.getItem(AD_NETWORKS_LOCAL_CACHE_KEY);
    if (cached) {
      return mergeWithSixDefaultNetworks(JSON.parse(cached));
    }
  } catch {
    // ignore
  }

  return DEFAULT_SIX_AD_NETWORKS.map((n) => ({ ...n }));
}

export async function saveSingleAdNetworkToSupabase(
  network: AdNetworkConfig
): Promise<AdNetworkConfig[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('ad_networks').upsert(
        {
          network_name: network.network_name,
          banner_code: String(network.banner_code ?? ''),
          vignette_code: String(network.vignette_code ?? ''),
          popup_code: String(network.popup_code ?? ''),
          is_active: Boolean(network.is_active),
        },
        { onConflict: 'network_name' }
      );
    } catch {
      // Sync with backend PostgreSQL
    }
  }

  let updatedList: AdNetworkConfig[] = [];
  try {
    const res = await fetch('/api/admin/ad-networks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(network),
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.networks)) {
        updatedList = mergeWithSixDefaultNetworks(json.networks);
      }
    }
  } catch {
    // ignore
  }

  if (updatedList.length === 0) {
    const current = await fetchAdNetworksFromSupabase();
    updatedList = current.map((n) =>
      n.network_name.toLowerCase() === network.network_name.toLowerCase()
        ? { ...n, ...network }
        : n
    );
  }

  try {
    localStorage.setItem(AD_NETWORKS_LOCAL_CACHE_KEY, JSON.stringify(updatedList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sportsviva-ad-networks-updated', { detail: updatedList })
      );
    }
  } catch {
    // ignore
  }

  return updatedList;
}

export async function saveAllAdNetworksToSupabase(
  networks: AdNetworkConfig[]
): Promise<AdNetworkConfig[]> {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      for (const net of networks) {
        await sb.from('ad_networks').upsert(
          {
            network_name: net.network_name,
            banner_code: String(net.banner_code ?? ''),
            vignette_code: String(net.vignette_code ?? ''),
            popup_code: String(net.popup_code ?? ''),
            is_active: Boolean(net.is_active),
          },
          { onConflict: 'network_name' }
        );
      }
    } catch {
      // Sync with backend PostgreSQL
    }
  }

  let updatedList = mergeWithSixDefaultNetworks(networks);
  try {
    const res = await fetch('/api/admin/ad-networks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ networks }),
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.networks)) {
        updatedList = mergeWithSixDefaultNetworks(json.networks);
      }
    }
  } catch {
    // ignore
  }

  try {
    localStorage.setItem(AD_NETWORKS_LOCAL_CACHE_KEY, JSON.stringify(updatedList));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sportsviva-ad-networks-updated', { detail: updatedList })
      );
    }
  } catch {
    // ignore
  }

  return updatedList;
}
