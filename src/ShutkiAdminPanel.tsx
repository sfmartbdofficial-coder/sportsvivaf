import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  MapPin,
  Upload,
  RefreshCw,
  Tag,
  ShieldCheck,
  Ban,
  KeyRound,
  Copy,
  Check,
  ChevronRight,
  Store,
  X,
  Printer,
  ArrowLeft,
  Megaphone,
  Clock,
  Code2,
  Sparkles,
  Power,
  Play,
  Layers,
} from 'lucide-react';
import {
  ShutkiProduct,
  ShutkiOrder,
  ShutkiPayment,
  ShutkiUser,
  ShutkiBanner,
  ShutkiCoupon,
  ShutkiStoreSettings,
  MonetagSettings,
  PaymentGatewayConfig,
  AdNetworkConfig,
  DEFAULT_SIX_AD_NETWORKS,
  fetchShutkiAdminOverview,
  signInShutkiAdminWithSupabase,
  signInWithGooglePopup,
  isAuthorizedShutkiAdminEmail,
  createShutkiProductRecord,
  updateShutkiProductRecord,
  deleteShutkiProductRecord,
  updateShutkiOrderStatusRecord,
  createShutkiOrderRecord,
  createShutkiPaymentRecord,
  updateShutkiPaymentStatusRecord,
  toggleShutkiUserBlockStatus,
  triggerSupabaseUserPasswordReset,
  createShutkiUserRecord,
  createShutkiBannerRecord,
  updateShutkiBannerRecord,
  deleteShutkiBannerRecord,
  createShutkiCouponRecord,
  deleteShutkiCouponRecord,
  updateShutkiStoreSettingsRecord,
  saveMonetagSettingsToSupabase,
  savePaymentGatewaysToSupabase,
  saveSingleAdNetworkToSupabase,
  saveAllAdNetworksToSupabase,
  uploadMediaToSupabaseStorage,
  isSupabaseConfigured,
  configureSupabaseRuntime,
} from './lib/supabase';
import { MonetagVignetteFullscreenModal } from './MonetagAdSystem';

export type AdminRouteTab =
  | '/admin/login'
  | '/admin'
  | '/admin/products'
  | '/admin/payment-gateways'
  | '/admin/monetag'
  | '/admin/ads-manager'
  | '/admin/orders'
  | '/admin/payments'
  | '/admin/users'
  | '/admin/banners'
  | '/admin/settings';

const SHUTKI_CATEGORIES = [
  'Loitta',
  'Chingri',
  'Rupchanda',
  'Churi',
  'Coral / Lakhua',
  'Kechki',
  'Shutki Balachao',
];

const SHUTKI_WEIGHT_OPTIONS = ['250g', '500g', '1kg', '2kg', '5kg Wholesale'];

const PRESET_SHUTKI_IMAGES = [
  {
    label: 'Loitta Shutki (Bombay Duck)',
    url: '/src/assets/images/shutki_loitta_premium_1791713348819.jpg',
  },
  {
    label: 'Golden Chingri Shutki',
    url: '/src/assets/images/shutki_chingri_gold_1791713367897.jpg',
  },
  {
    label: 'Whole Rupchanda Shutki',
    url: '/src/assets/images/shutki_rupchanda_whole_1791713380168.jpg',
  },
  {
    label: 'Organic Churi Shutki',
    url: '/src/assets/images/shutki_churi_ribbon_1791713392569.jpg',
  },
  {
    label: 'Coxs Bazar Shutki Hero Banner',
    url: '/src/assets/images/sfmart_shutki_hero_banner_1791713408382.jpg',
  },
];

const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    gateway_name: 'bKash',
    is_enabled: true,
    merchant_number: '01799-554433',
    api_key: 'bkash_live_app_key_sfmartbd_9921',
    api_secret: 'bkash_live_app_secret_88412x',
    username: 'sfmartbd_bkash_merchant',
    password: 'bk_pass_2026',
    is_sandbox: false,
  },
  {
    gateway_name: 'Nagad',
    is_enabled: true,
    merchant_number: '01888-554433',
    api_key: 'nagad_merchant_pub_key_7731',
    api_secret: 'nagad_merchant_priv_key_9910',
    username: 'MP009281',
    password: 'ng_pass_2026',
    is_sandbox: false,
  },
  {
    gateway_name: 'Rocket',
    is_enabled: true,
    merchant_number: '01977-5544338',
    api_key: 'dbbl_rocket_api_key_5512',
    api_secret: 'dbbl_rocket_secret_3319',
    username: 'sfmartbd_dbbl',
    password: 'rk_pass_2026',
    is_sandbox: false,
  },
  {
    gateway_name: 'Upay',
    is_enabled: false,
    merchant_number: '01611-554433',
    api_key: 'upay_merchant_key_1120',
    api_secret: 'upay_merchant_secret_4490',
    username: 'sfmartbd_upay',
    password: 'up_pass_2026',
    is_sandbox: true,
  },
];

const SUPABASE_SQL_SCHEMA_SCRIPT = `-- Supabase SQL Schema for Admin Panel (ad_networks, monetag_settings, payment_gateways, products)
CREATE TABLE IF NOT EXISTS public.ad_networks (
  id BIGSERIAL PRIMARY KEY,
  network_name TEXT UNIQUE NOT NULL,
  banner_code TEXT NOT NULL DEFAULT '',
  vignette_code TEXT NOT NULL DEFAULT '',
  popup_code TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO public.ad_networks (network_name, banner_code, vignette_code, popup_code, is_active) VALUES
('Monetag', '', '', '', false),
('Adsterra', '', '', '', false),
('PropellerAds', '', '', '', false),
('AdMook', '', '', '', false),
('PopAds', '', '', '', false),
('Galaksion', '', '', '', false)
ON CONFLICT (network_name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.monetag_settings (
  id BIGSERIAL PRIMARY KEY,
  banner_code TEXT NOT NULL DEFAULT '',
  vignette_code TEXT NOT NULL DEFAULT '',
  banner_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  vignette_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  timer INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.monetag_settings (id, banner_code, vignette_code, banner_enabled, vignette_enabled, timer)
VALUES (1, '', '', false, false, 5)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id BIGSERIAL PRIMARY KEY,
  gateway_name TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  merchant_number TEXT NOT NULL DEFAULT '01799-554433',
  api_key TEXT NOT NULL DEFAULT '',
  api_secret TEXT NOT NULL DEFAULT '',
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  is_sandbox BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Loitta',
  price INTEGER NOT NULL,
  discount_price INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 50,
  weight TEXT NOT NULL DEFAULT '1kg',
  description TEXT DEFAULT '',
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

function normalizeAdminPath(pathname: string): AdminRouteTab {
  const clean = pathname.replace(/\/+$/, '') || '/admin';
  if (clean === '/admin/login') return '/admin/login';
  if (clean === '/admin/products') return '/admin/products';
  if (clean === '/admin/payment-gateways') return '/admin/payment-gateways';
  if (clean === '/admin/monetag') return '/admin/monetag';
  if (clean === '/admin/ads-manager') return '/admin/ads-manager';
  if (clean === '/admin/orders') return '/admin/orders';
  if (clean === '/admin/payments') return '/admin/payment-gateways';
  if (clean === '/admin/users') return '/admin/users';
  if (clean === '/admin/banners') return '/admin/banners';
  if (clean === '/admin/settings') return '/admin/settings';
  return '/admin';
}

interface AdminSession {
  email: string;
  name: string;
  provider: string;
  loggedInAt: string;
}

export const ShutkiAdminPanel: React.FC<{
  onBackToMainApp?: () => void;
  initialRoute?: AdminRouteTab;
}> = ({ onBackToMainApp, initialRoute }) => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('sfmartbd_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && isAuthorizedShutkiAdminEmail(parsed.email)) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentRoute, setCurrentRoute] = useState<AdminRouteTab>(() => {
    if (initialRoute) return initialRoute;
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return normalizeAdminPath(window.location.pathname);
    }
    return '/admin';
  });

  const navigateAdmin = (route: AdminRouteTab) => {
    const targetRoute = !adminSession && route !== '/admin/login' ? '/admin/login' : route;
    setCurrentRoute(targetRoute);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', targetRoute);
      } catch {
        // ignore in iframe
      }
    }
  };

  useEffect(() => {
    if (!adminSession && currentRoute !== '/admin/login') {
      navigateAdmin('/admin/login');
    }
  }, [adminSession, currentRoute]);

  useEffect(() => {
    const onPopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        const nextRoute = normalizeAdminPath(window.location.pathname);
        if (!adminSession && nextRoute !== '/admin/login') {
          setCurrentRoute('/admin/login');
        } else {
          setCurrentRoute(nextRoute);
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [adminSession]);

  // Core Data States from Supabase + Cloud SQL PostgreSQL
  const [products, setProducts] = useState<ShutkiProduct[]>([]);
  const [orders, setOrders] = useState<ShutkiOrder[]>([]);
  const [payments, setPayments] = useState<ShutkiPayment[]>([]);
  const [users, setUsers] = useState<ShutkiUser[]>([]);
  const [banners, setBanners] = useState<ShutkiBanner[]>([]);
  const [coupons, setCoupons] = useState<ShutkiCoupon[]>([]);
  const [settings, setSettings] = useState<ShutkiStoreSettings>({
    inside_dhaka_charge: 70,
    outside_dhaka_charge: 130,
    free_delivery_min: 2000,
    store_name: 'SportsViva & SFMartBD Store (sfmartbd.com)',
    support_phone: '+880 1700-889900',
    admin_emails: 'sfmartbd.official@gmail.com,admin@sfmartbd.com',
    notice_marquee:
      'বাংলাদেশের ১ নম্বর লাইভ স্পোর্টস, গেমিং ও অর্গানিক শুঁটকি ই-কমার্স প্ল্যাটফর্ম!',
  });

  // 4. Monetag Ads Management State (`monetag_settings` table in Supabase)
  // Kept empty by default so admin can paste Monetag codes anytime
  const [monetagSettings, setMonetagSettings] = useState<MonetagSettings>({
    id: 1,
    banner_code: '',
    vignette_code: '',
    banner_enabled: false,
    vignette_enabled: false,
    timer: 5,
  });
  const [savingMonetag, setSavingMonetag] = useState(false);
  const [previewVignetteOpen, setPreviewVignetteOpen] = useState(false);

  // 3. Payment Gateways State (`payment_gateways` table: bKash, Nagad, Rocket, Upay)
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(DEFAULT_PAYMENT_GATEWAYS);
  const [savingGateways, setSavingGateways] = useState(false);

  // 5. Ad Network Manager State (`ad_networks` table: Monetag, Adsterra, PropellerAds, AdMook, PopAds, Galaksion)
  // Pre-inserted 6 networks with is_active = false by default
  const [adNetworks, setAdNetworks] = useState<AdNetworkConfig[]>(DEFAULT_SIX_AD_NETWORKS);
  const [savingNetworkName, setSavingNetworkName] = useState<string | null>(null);
  const [savingAllNetworks, setSavingAllNetworks] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const data = await fetchShutkiAdminOverview();
      setProducts(data.products);
      setOrders(data.orders);
      setPayments(data.payments);
      setUsers(data.users);
      setBanners(data.banners);
      setCoupons(data.coupons);
      setSettings(data.settings);
      if (data.monetag_settings) {
        setMonetagSettings({
          id: data.monetag_settings.id || 1,
          banner_code: String(data.monetag_settings.banner_code ?? ''),
          vignette_code: String(data.monetag_settings.vignette_code ?? ''),
          banner_enabled: Boolean(data.monetag_settings.banner_enabled),
          vignette_enabled: Boolean(data.monetag_settings.vignette_enabled),
          timer: [3, 5, 10].includes(Number(data.monetag_settings.timer))
            ? Number(data.monetag_settings.timer)
            : 5,
          created_at: data.monetag_settings.created_at,
        });
      }
      if (Array.isArray(data.payment_gateways) && data.payment_gateways.length > 0) {
        const merged = ['bKash', 'Nagad', 'Rocket', 'Upay'].map((gwName) => {
          const found = data.payment_gateways.find(
            (g) => g.gateway_name.toLowerCase() === gwName.toLowerCase()
          );
          if (found) return found;
          return (
            DEFAULT_PAYMENT_GATEWAYS.find((d) => d.gateway_name === gwName) ||
            DEFAULT_PAYMENT_GATEWAYS[0]
          );
        });
        setGateways(merged);
      }
      if (Array.isArray(data.ad_networks) && data.ad_networks.length > 0) {
        const mergedNets = DEFAULT_SIX_AD_NETWORKS.map((def) => {
          const found = data.ad_networks.find(
            (n) => n.network_name.toLowerCase() === def.network_name.toLowerCase()
          );
          return found ? { ...def, ...found } : { ...def };
        });
        setAdNetworks(mergedNets);
      }
    } catch {
      showToast('Failed to synchronize data from Supabase.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // ============================================================================
  // 1. LOGIN STATE & HANDLERS (/admin/login)
  // ============================================================================
  const [loginEmail, setLoginEmail] = useState('sfmartbd.official@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await signInShutkiAdminWithSupabase(
        loginEmail,
        loginPassword,
        settings.admin_emails
      );
      if (!res.ok || !res.email) {
        setLoginError(res.error || 'Unauthorized admin email.');
        setLoginSubmitting(false);
        return;
      }
      const sessionObj: AdminSession = {
        email: res.email,
        name: res.name || 'SFMartBD Admin',
        provider: res.provider || 'Supabase Auth',
        loggedInAt: new Date().toLocaleTimeString(),
      };
      setAdminSession(sessionObj);
      try {
        sessionStorage.setItem('sfmartbd_admin_session', JSON.stringify(sessionObj));
      } catch {
        // ignore
      }
      showToast(`Welcome back, ${sessionObj.name}!`);
      navigateAdmin('/admin');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoginError(null);
    try {
      const user = await signInWithGooglePopup();
      if (!isAuthorizedShutkiAdminEmail(user.email, settings.admin_emails)) {
        setLoginError(
          `Access Denied: Google account "${user.email}" is not an authorized Admin.`
        );
        return;
      }
      const sessionObj: AdminSession = {
        email: user.email || 'sfmartbd.official@gmail.com',
        name: user.displayName || 'SFMartBD Super Admin',
        provider: 'Google + Supabase Auth',
        loggedInAt: new Date().toLocaleTimeString(),
      };
      setAdminSession(sessionObj);
      sessionStorage.setItem('sfmartbd_admin_session', JSON.stringify(sessionObj));
      showToast(`Logged in as ${sessionObj.email}`);
      navigateAdmin('/admin');
    } catch {
      setLoginError('Google popup sign-in was cancelled or blocked by browser.');
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    try {
      sessionStorage.removeItem('sfmartbd_admin_session');
    } catch {
      // ignore
    }
    navigateAdmin('/admin/login');
    showToast('Signed out of Admin Panel.');
  };

  // ============================================================================
  // 2. MONETAG ADS MANAGEMENT HANDLERS (/admin/monetag)
  // ============================================================================
  const handleSaveMonetagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMonetag(true);
    try {
      const saved = await saveMonetagSettingsToSupabase(monetagSettings);
      setMonetagSettings(saved);
      showToast(
        `Saved Monetag Settings to Supabase! Banner: ${
          saved.banner_enabled ? 'ON (Every 2 Cards)' : 'OFF'
        } · Vignette: ${saved.vignette_enabled ? `ON (${saved.timer}s Timer)` : 'OFF'}`
      );
    } catch {
      showToast('Failed to save monetag_settings to Supabase.', 'error');
    } finally {
      setSavingMonetag(false);
    }
  };

  // ============================================================================
  // 3. PAYMENT GATEWAYS HANDLERS (/admin/payment-gateways)
  // ============================================================================
  const handleToggleGateway = (gatewayName: string) => {
    setGateways((prev) =>
      prev.map((gw) =>
        gw.gateway_name === gatewayName ? { ...gw, is_enabled: !gw.is_enabled } : gw
      )
    );
  };

  const handleUpdateGatewayField = (
    gatewayName: string,
    field: keyof PaymentGatewayConfig,
    value: string | boolean
  ) => {
    setGateways((prev) =>
      prev.map((gw) =>
        gw.gateway_name === gatewayName ? { ...gw, [field]: value } : gw
      )
    );
  };

  const handleSaveGatewaysSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGateways(true);
    try {
      const updated = await savePaymentGatewaysToSupabase(gateways);
      setGateways(updated);
      showToast('Saved bKash, Nagad, Rocket & Upay Gateway configurations to Supabase!');
    } catch {
      showToast('Failed to save payment gateway settings.', 'error');
    } finally {
      setSavingGateways(false);
    }
  };

  // ============================================================================
  // 3B. AD NETWORK MANAGER HANDLERS (/admin/ads-manager -> table: ad_networks)
  // ============================================================================
  const handleToggleAdNetwork = (networkName: string) => {
    setAdNetworks((prev) =>
      prev.map((net) =>
        net.network_name === networkName ? { ...net, is_active: !net.is_active } : net
      )
    );
  };

  const handleUpdateAdNetworkField = (
    networkName: string,
    field: 'banner_code' | 'vignette_code' | 'popup_code',
    value: string
  ) => {
    setAdNetworks((prev) =>
      prev.map((net) =>
        net.network_name === networkName ? { ...net, [field]: value } : net
      )
    );
  };

  const handleSaveSingleAdNetwork = async (network: AdNetworkConfig) => {
    setSavingNetworkName(network.network_name);
    try {
      const updatedList = await saveSingleAdNetworkToSupabase(network);
      setAdNetworks(updatedList);
      showToast(
        `Saved ${network.network_name} to Supabase ad_networks! Status: ${
          network.is_active ? 'ON (Active)' : 'OFF (Inactive)'
        }`
      );
    } catch {
      showToast(`Failed to save ${network.network_name} settings.`, 'error');
    } finally {
      setSavingNetworkName(null);
    }
  };

  const handleSaveAllSixAdNetworks = async () => {
    setSavingAllNetworks(true);
    try {
      const updatedList = await saveAllAdNetworksToSupabase(adNetworks);
      setAdNetworks(updatedList);
      const activeCount = updatedList.filter((n) => n.is_active).length;
      showToast(
        `Saved all 6 Ad Networks to Supabase! Active Networks: ${activeCount}/6`
      );
    } catch {
      showToast('Failed to save ad networks to Supabase.', 'error');
    } finally {
      setSavingAllNetworks(false);
    }
  };

  // ============================================================================
  // 4. PRODUCT MANAGEMENT STATE & HANDLERS (/admin/products)
  // ============================================================================
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [showProductFormModal, setShowProductFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShutkiProduct | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Loitta');
  const [prodPrice, setProdPrice] = useState<number>(950);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number>(780);
  const [prodStock, setProdStock] = useState<number>(100);
  const [prodWeight, setProdWeight] = useState('1kg');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([
    '/src/assets/images/shutki_loitta_premium_1791713348819.jpg',
  ]);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Loitta');
    setProdPrice(950);
    setProdDiscountPrice(780);
    setProdStock(80);
    setProdWeight('1kg');
    setProdDescription(
      '১০০% কেমিক্যাল ও ডিডিটি মুক্ত কক্সবাজারের অর্গানিক রোদে শুকানো প্রিমিয়াম শুঁটকি।'
    );
    setProdImages(['/src/assets/images/shutki_loitta_premium_1791713348819.jpg']);
    setShowProductFormModal(true);
  };

  const openEditProductModal = (product: ShutkiProduct) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price);
    setProdDiscountPrice(product.discount_price);
    setProdStock(product.stock);
    setProdWeight(product.weight || '1kg');
    setProdDescription(product.description || '');
    setProdImages(
      product.images?.length
        ? product.images
        : ['/src/assets/images/shutki_loitta_premium_1791713348819.jpg']
    );
    setShowProductFormModal(true);
  };

  const handleMultipleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const url = await uploadMediaToSupabaseStorage(fileList[i], 'shutki-products');
        if (url) uploadedUrls.push(url);
      }
      setProdImages((prev) => [...prev, ...uploadedUrls]);
      showToast(`Uploaded ${uploadedUrls.length} product image(s) to Supabase Storage.`);
    } catch {
      showToast('Failed to upload image file.', 'error');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const payload = {
      name: prodName.trim(),
      category: prodCategory,
      price: Number(prodPrice),
      discount_price: Number(prodDiscountPrice),
      stock: Number(prodStock),
      weight: prodWeight,
      description: prodDescription.trim(),
      images:
        prodImages.length > 0
          ? prodImages
          : ['/src/assets/images/shutki_loitta_premium_1791713348819.jpg'],
    };

    if (editingProduct) {
      const updated = await updateShutkiProductRecord(editingProduct.id, payload);
      if (updated) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? updated : p)));
        showToast(`Updated product "${updated.name}" in Supabase.`);
      }
    } else {
      const created = await createShutkiProductRecord(payload);
      if (created) {
        setProducts((prev) => [created, ...prev]);
        showToast(`Added new product "${created.name}" to Supabase.`);
      }
    }
    setShowProductFormModal(false);
  };

  const handleDeleteProduct = async (product: ShutkiProduct) => {
    const ok = await deleteShutkiProductRecord(product.id);
    if (ok) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Deleted "${product.name}" from catalog.`);
    }
  };

  // ============================================================================
  // 5. ORDER MANAGEMENT STATE & HANDLERS (/admin/orders)
  // ============================================================================
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderModal, setSelectedOrderModal] = useState<ShutkiOrder | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const [newOrdCustomer, setNewOrdCustomer] = useState('');
  const [newOrdPhone, setNewOrdPhone] = useState('');
  const [newOrdDistrict, setNewOrdDistrict] = useState('Dhaka');
  const [newOrdThana, setNewOrdThana] = useState('Mirpur');
  const [newOrdVillage, setNewOrdVillage] = useState('Block C, Road 5, House 14');
  const [newOrdProductIdx, setNewOrdProductIdx] = useState(0);
  const [newOrdQty, setNewOrdQty] = useState(1);
  const [newOrdPaymentMethod, setNewOrdPaymentMethod] = useState<'bKash' | 'Nagad' | 'COD'>('bKash');
  const [newOrdTrxId, setNewOrdTrxId] = useState('');

  const handleOrderStatusChange = async (
    order: ShutkiOrder,
    nextStatus: string,
    nextPayStatus?: string
  ) => {
    const ok = await updateShutkiOrderStatusRecord(order.id, nextStatus, nextPayStatus);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                order_status: nextStatus,
                payment_status: nextPayStatus || o.payment_status,
              }
            : o
        )
      );
      if (selectedOrderModal?.id === order.id) {
        setSelectedOrderModal((prev) =>
          prev
            ? {
                ...prev,
                order_status: nextStatus,
                payment_status: nextPayStatus || prev.payment_status,
              }
            : null
        );
      }
      showToast(`Order ${order.order_id} updated to ${nextStatus}`);
    }
  };

  const handleCreateManualOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosenProd = products[newOrdProductIdx] || products[0];
    if (!chosenProd) return;
    const isInsideDhaka = newOrdDistrict.trim().toLowerCase() === 'dhaka';
    const deliv = isInsideDhaka
      ? settings.inside_dhaka_charge
      : settings.outside_dhaka_charge;
    const itemSubtotal = chosenProd.discount_price * newOrdQty;
    const finalDeliv = itemSubtotal >= settings.free_delivery_min ? 0 : deliv;
    const totalAmt = itemSubtotal + finalDeliv;
    const ordCode = `SFM-${Math.floor(1050 + Math.random() * 8900)}`;
    const fullAddr = `${newOrdVillage}, ${newOrdThana}, ${newOrdDistrict}`;

    await createShutkiOrderRecord({
      order_id: ordCode,
      customer_name: newOrdCustomer.trim() || 'কাস্টমার অর্ডার',
      phone: newOrdPhone.trim() || '01700-000000',
      district: newOrdDistrict.trim(),
      thana: newOrdThana.trim(),
      village: newOrdVillage.trim(),
      full_address: fullAddr,
      items: [
        {
          name: `${chosenProd.name} (${chosenProd.weight})`,
          qty: newOrdQty,
          price: chosenProd.discount_price,
        },
      ],
      total_amount: totalAmt,
      delivery_charge: finalDeliv,
      payment_method: newOrdPaymentMethod,
      payment_status: newOrdPaymentMethod === 'COD' ? 'Pending' : 'Paid',
      order_status: 'Pending',
      transaction_id:
        newOrdPaymentMethod === 'COD'
          ? `COD-${ordCode}`
          : newOrdTrxId.trim().toUpperCase() || `BKA${Date.now().toString().slice(-6)}`,
    });

    if (newOrdPaymentMethod !== 'COD') {
      await createShutkiPaymentRecord({
        transaction_id:
          newOrdTrxId.trim().toUpperCase() || `TRX${Date.now().toString().slice(-7)}`,
        order_id: ordCode,
        customer_name: newOrdCustomer.trim() || 'কাস্টমার অর্ডার',
        phone: newOrdPhone.trim() || '01700-000000',
        method: newOrdPaymentMethod,
        amount: totalAmt,
        status: 'Verified',
      });
    }

    await loadAllAdminData();
    setShowNewOrderModal(false);
    setNewOrdCustomer('');
    setNewOrdPhone('');
    setNewOrdTrxId('');
    showToast(`Order ${ordCode} created and synced to Supabase!`);
  };

  // ============================================================================
  // 6. PAYMENT TRANSACTIONS STATE & HANDLERS
  // ============================================================================
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [newPayTrxId, setNewPayTrxId] = useState('');
  const [newPayOrderId, setNewPayOrderId] = useState('SFM-1043');
  const [newPayCustomer, setNewPayCustomer] = useState('');
  const [newPayPhone, setNewPayPhone] = useState('');
  const [newPayMethod, setNewPayMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay'>('bKash');
  const [newPayAmount, setNewPayAmount] = useState<number>(1250);

  const handleAddPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayTrxId.trim()) return;
    const created = await createShutkiPaymentRecord({
      transaction_id: newPayTrxId.trim().toUpperCase(),
      order_id: newPayOrderId.trim() || 'SFM-1050',
      customer_name: newPayCustomer.trim() || 'Verified Buyer',
      phone: newPayPhone.trim() || '01711-000000',
      method: newPayMethod,
      amount: Number(newPayAmount),
      status: 'Verified',
    });
    if (created) {
      setPayments((prev) => [created, ...prev]);
      setNewPayTrxId('');
      setNewPayCustomer('');
      setNewPayPhone('');
      showToast(`Transaction ${created.transaction_id} logged in Supabase payments.`);
    }
  };

  const handlePaymentStatusChange = async (payment: ShutkiPayment, nextStatus: string) => {
    const ok = await updateShutkiPaymentStatusRecord(payment.id, nextStatus);
    if (ok) {
      setPayments((prev) =>
        prev.map((p) => (p.id === payment.id ? { ...p, status: nextStatus } : p))
      );
      showToast(`Transaction ${payment.transaction_id} marked as ${nextStatus}.`);
    }
  };

  // ============================================================================
  // 7. USER MANAGEMENT STATE & HANDLERS (/admin/users)
  // ============================================================================
  const [userSearch, setUserSearch] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserAddress, setNewUserAddress] = useState('');

  const handleToggleUserBlock = async (u: ShutkiUser) => {
    const nextBlocked = !u.is_blocked;
    const ok = await toggleShutkiUserBlockStatus(u.id, nextBlocked);
    if (ok) {
      setUsers((prev) =>
        prev.map((item) => (item.id === u.id ? { ...item, is_blocked: nextBlocked } : item))
      );
      showToast(
        nextBlocked
          ? `Blocked user ${u.name} (${u.email})`
          : `Unblocked user ${u.name} (${u.email})`
      );
    }
  };

  const handleResetUserPassword = async (u: ShutkiUser) => {
    const res = await triggerSupabaseUserPasswordReset(u.email);
    showToast(res.message);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const created = await createShutkiUserRecord({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '01700-000000',
      address: newUserAddress.trim() || 'Dhaka, Bangladesh',
      role: 'Customer',
    });
    if (created) {
      setUsers((prev) => [created, ...prev]);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPhone('');
      setNewUserAddress('');
      showToast(`Added user ${created.name} to database.`);
    }
  };

  // ============================================================================
  // 8. BANNER & NOTICE + COUPONS STATE & HANDLERS (/admin/banners)
  // ============================================================================
  const [editingBanner, setEditingBanner] = useState<ShutkiBanner | null>(null);
  const [banTitle, setBanTitle] = useState('');
  const [banSubtitle, setBanSubtitle] = useState('');
  const [banImageUrl, setBanImageUrl] = useState(
    '/src/assets/images/sfmart_shutki_hero_banner_1791713408382.jpg'
  );
  const [banNoticeText, setBanNoticeText] = useState('');
  const [banActive, setBanActive] = useState(true);

  const [couponCode, setCouponCode] = useState('');
  const [couponPercent, setCouponPercent] = useState<number>(15);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(500);

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadMediaToSupabaseStorage(file, 'shutki-banners');
    if (url) {
      setBanImageUrl(url);
      showToast('Banner image uploaded to Supabase Storage.');
    }
  };

  const handleSaveBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTitle.trim()) return;
    const payload = {
      title: banTitle.trim(),
      subtitle: banSubtitle.trim(),
      image_url: banImageUrl.trim(),
      target_url: '/store',
      notice_text: banNoticeText.trim(),
      is_active: banActive,
    };
    if (editingBanner) {
      const updated = await updateShutkiBannerRecord(editingBanner.id, payload);
      if (updated) {
        setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? updated : b)));
        showToast('Homepage banner updated.');
      }
      setEditingBanner(null);
    } else {
      const created = await createShutkiBannerRecord(payload);
      if (created) {
        setBanners((prev) => [created, ...prev]);
        showToast('New homepage banner added.');
      }
    }
    setBanTitle('');
    setBanSubtitle('');
    setBanNoticeText('');
  };

  const handleDeleteBanner = async (id: number) => {
    const ok = await deleteShutkiBannerRecord(id);
    if (ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showToast('Banner deleted.');
    }
  };

  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const created = await createShutkiCouponRecord({
      code: couponCode.trim().toUpperCase(),
      discount_percent: Number(couponPercent),
      min_order_amount: Number(couponMinOrder),
    });
    if (created) {
      setCoupons((prev) => [created, ...prev]);
      setCouponCode('');
      showToast(`Coupon "${created.code}" (${created.discount_percent}% OFF) created!`);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    const ok = await deleteShutkiCouponRecord(id);
    if (ok) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast('Coupon removed.');
    }
  };

  // ============================================================================
  // 9. SETTINGS STATE & HANDLERS (/admin/settings)
  // ============================================================================
  const [sbUrlInput, setSbUrlInput] = useState('');
  const [sbKeyInput, setSbKeyInput] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateShutkiStoreSettingsRecord(settings);
    if (updated) {
      setSettings(updated);
      showToast(
        `Saved Delivery Charges: Inside Dhaka ৳${updated.inside_dhaka_charge} • Outside Dhaka ৳${updated.outside_dhaka_charge}`
      );
    }
  };

  const dashboardMetrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalSalesTk = orders
      .filter((o) => o.order_status !== 'Cancelled')
      .reduce((acc, o) => acc + Number(o.total_amount || 0), 0);
    const totalProducts = products.length;
    const totalStockKg = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    const totalUsers = users.length;
    const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;
    const deliveredOrdersCount = orders.filter((o) => o.order_status === 'Delivered').length;
    const activeGatewaysCount = gateways.filter((g) => g.is_enabled).length;
    const activeAdNetworksCount = adNetworks.filter((n) => n.is_active).length;
    return {
      totalOrders,
      totalSalesTk,
      totalProducts,
      totalStockKg,
      totalUsers,
      pendingOrdersCount,
      deliveredOrdersCount,
      activeGatewaysCount,
      activeAdNetworksCount,
    };
  }, [orders, products, users, gateways, adNetworks]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        productCategoryFilter === 'ALL' ||
        p.category.toLowerCase() === productCategoryFilter.toLowerCase();
      const q = productSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, productCategoryFilter, productSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === 'ALL' || o.order_status === orderStatusFilter;
      const q = orderSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.district.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const matchesMethod =
        paymentMethodFilter === 'ALL' || pay.method === paymentMethodFilter;
      const q = paymentSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        pay.transaction_id.toLowerCase().includes(q) ||
        pay.order_id.toLowerCase().includes(q) ||
        pay.phone.toLowerCase().includes(q) ||
        pay.customer_name.toLowerCase().includes(q);
      return matchesMethod && matchesQuery;
    });
  }, [payments, paymentMethodFilter, paymentSearch]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  // ============================================================================
  // RENDER 1: PROTECTED ADMIN LOGIN PAGE (/admin/login) — HOMEPAGE DESIGN
  // ============================================================================
  if (!adminSession || currentRoute === '/admin/login') {
    return (
      <div className="min-h-screen bg-[#021A0A] text-white flex flex-col justify-between font-sans">
        {/* Top Bar Contract matching Homepage */}
        <header className="bg-gradient-to-b from-[#04280D] via-[#03200A] to-[#021A0A] border-b border-[#00FF66]/40 px-6 py-3.5 flex items-center justify-between gap-8 shadow-[0_4px_20px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#090D0A] border-2 border-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.55)] flex items-center justify-center font-display font-black text-lg text-[#FFD700]">
              S
            </div>
            <span className="font-display font-black italic text-lg tracking-tight">
              <span className="text-white">Sports</span>
              <span className="text-[#FFD700]">Viva</span>
              <span className="text-xs font-sans font-bold text-[#00FF66] ml-2 not-italic">
                ADMIN PORTAL
              </span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-emerald-200">
            <span>sfmartbd.com</span>
            <span>·</span>
            <span>Supabase Auth Guard</span>
            <span>·</span>
            <span>Monetag &amp; Payment Gateways</span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {onBackToMainApp && (
              <button
                onClick={onBackToMainApp}
                className="px-4 py-2 text-xs font-display font-black text-[#021A0A] bg-gradient-to-r from-[#FFE54C] via-[#FFD700] to-[#00FF66] rounded-xl hover:brightness-110 transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Homepage</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#04240B] border-2 border-[#FFD700] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,102,0.25)]">
            {/* Left Showcase */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#062E12] via-[#041F0C] to-[#021407] p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#00FF66]/30">
              <img
                src="/src/assets/images/sfmart_shutki_hero_banner_1791713408382.jpg"
                alt="SportsViva & SFMartBD Admin"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 space-y-4">
                <div className="text-xs font-display font-black text-[#00FF66] tracking-wide">
                  SFMARTBD.COM · SUPABASE ADMIN
                </div>
                <h1 className="text-2xl font-display font-black leading-snug text-[#FFD700]">
                  Full Website Admin Control Center
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Manage Dashboard metrics, Products, Payment Gateways (bKash, Nagad, Rocket, Upay
                  On/Off + API keys), and Monetag Ads (`banner_code`, `vignette_code`, 3/5/10s
                  timer) synced directly with Supabase.
                </p>
              </div>

              <div className="relative z-10 pt-8 border-t border-[#00FF66]/30 space-y-1.5 text-xs text-emerald-200">
                <div className="font-bold text-[#FFD700]">Protected Route: /admin/login</div>
                <div>Authorized Admin Emails (Supabase Auth):</div>
                <div className="font-mono text-[#00FF66]">sfmartbd.official@gmail.com</div>
                <div className="font-mono text-[#00F0FF]">admin@sfmartbd.com</div>
              </div>
            </div>

            {/* Right Login Form */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6 bg-[#021A0A]/90">
              <div>
                <h2 className="text-xl font-display font-black text-[#FFD700]">
                  Admin Sign In (/admin/login)
                </h2>
                <p className="text-xs text-emerald-200 mt-1">
                  Enter your Supabase Admin credentials to unlock Dashboard, Products, Payment
                  Gateways &amp; Monetag Ads Management.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1.5">
                    Admin Email Address (Supabase Auth)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="sfmartbd.official@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04240B] border border-[#00FF66]/50 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFD700] mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#04240B] border border-[#00FF66]/50 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('sfmartbd.official@gmail.com');
                      setLoginPassword('sfmartbd2026');
                      setLoginError(null);
                    }}
                    className="text-xs font-bold text-[#00FF66] hover:underline cursor-pointer"
                  >
                    Auto-Fill Admin Credentials (sfmartbd.official@gmail.com)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('guest.buyer@gmail.com');
                      setLoginPassword('guest1234');
                    }}
                    className="text-xs text-emerald-300/70 hover:underline cursor-pointer"
                  >
                    Test Unauthorized Email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-sm shadow-[0_0_16px_rgba(255,215,0,0.5)] hover:brightness-110 transition-all cursor-pointer"
                >
                  {loginSubmitting ? 'Verifying Admin Credentials...' : 'Sign In to Admin Panel →'}
                </button>
              </form>

              <div className="pt-4 border-t border-[#00FF66]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleGoogleAdminLogin}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#04240B] border border-[#FFD700]/60 hover:border-[#00FF66] text-xs font-bold text-[#FFD700] cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
                  <span>Verify with Google OAuth (sfmartbd.official@gmail.com)</span>
                </button>
                <span className="text-xs text-emerald-300/70">Supabase Auth Protected</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-[#04240B] border-t border-[#00FF66]/30 px-6 py-3 text-xs text-emerald-200 flex items-center justify-between">
          <span>© 2026 SportsViva &amp; sfmartbd.com — Supabase Admin Panel</span>
          <span className="font-mono text-[#FFD700]">Route: /admin/login</span>
        </footer>
      </div>
    );
  }

  // ============================================================================
  // RENDER 2: FULL ADMIN WORKSPACE (/admin/*) — HOMEPAGE EMERALD & GOLD DESIGN
  // ============================================================================
  // Primary 4 Sidebar Menus requested by user:
  // 1. Dashboard
  // 2. Products
  // 3. Payment Gateways (Bkash, Nagad, Rocket, Upay On/Off + API keys)
  // 4. Monetag Ads Management
  const primaryNavItems: {
    num: string;
    route: AdminRouteTab;
    label: string;
    bangla: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      num: '01',
      route: '/admin',
      label: 'Dashboard',
      bangla: 'ড্যাশবোর্ড ওভারভিউ',
      icon: LayoutDashboard,
    },
    {
      num: '02',
      route: '/admin/products',
      label: 'Products',
      bangla: 'পণ্য তালিকা ও স্টক',
      icon: Package,
      badge: `${products.length}`,
    },
    {
      num: '03',
      route: '/admin/payment-gateways',
      label: 'Payment Gateways',
      bangla: 'bKash, Nagad, Rocket, Upay + API',
      icon: CreditCard,
      badge: `${dashboardMetrics.activeGatewaysCount}/4 ON`,
    },
    {
      num: '04',
      route: '/admin/monetag',
      label: 'Monetag Ads Management',
      bangla: 'ব্যানার ও ভিগনেট পপআপ অ্যাড',
      icon: Megaphone,
      badge:
        monetagSettings.banner_enabled || monetagSettings.vignette_enabled
          ? 'ACTIVE'
          : 'READY',
    },
    {
      num: '05',
      route: '/admin/ads-manager',
      label: 'Ad Network Manager',
      bangla: '৬টি অ্যাড নেটওয়ার্ক রোটেশন',
      icon: Layers,
      badge: `${dashboardMetrics.activeAdNetworksCount}/6 ON`,
    },
  ];

  const secondaryNavItems: {
    route: AdminRouteTab;
    label: string;
    bangla: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    {
      route: '/admin/orders',
      label: 'Orders & Delivery',
      bangla: 'অর্ডার ও কাস্টমার ঠিকানা',
      icon: ShoppingCart,
      count: orders.length,
    },
    {
      route: '/admin/users',
      label: 'Users',
      bangla: 'ইউজার ও পাসওয়ার্ড রিসেট',
      icon: Users,
      count: users.length,
    },
    {
      route: '/admin/banners',
      label: 'Banners & Coupons',
      bangla: 'হোমপেজ ব্যানার ও কুপন',
      icon: ImageIcon,
      count: banners.length + coupons.length,
    },
    {
      route: '/admin/settings',
      label: 'Settings & SQL',
      bangla: 'ডেলিভারি চার্জ ও সুপাবেস',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#021A0A] text-white flex flex-col lg:flex-row font-sans">
      {/* Toast Notification matching Homepage */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border-2 text-xs font-display font-black flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,255,102,0.5)] ${
            toastMessage.type === 'error'
              ? 'bg-red-950 border-red-500 text-red-200'
              : 'bg-[#0A3A0A] border-[#00FF66] text-[#FFD700]'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#00FF66] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Fullscreen Vignette Preview Modal for testing inside Admin */}
      <MonetagVignetteFullscreenModal
        isOpen={previewVignetteOpen}
        settings={monetagSettings}
        targetPageName="Homepage / Next Page Preview"
        onCloseAndNavigate={() => {
          setPreviewVignetteOpen(false);
          showToast('Vignette timer finished & Close button clicked!');
        }}
      />

      {/* ====================================================================
          LEFT SIDEBAR — HOMEPAGE EMERALD & GOLD DESIGN
         ==================================================================== */}
      <aside className="w-full lg:w-72 bg-gradient-to-b from-[#04280D] via-[#03200A] to-[#021406] text-white flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-[#00FF66]/40 shadow-[4px_0_24px_rgba(0,0,0,0.6)]">
        <div>
          {/* Brand Header */}
          <div className="px-5 py-4 border-b border-[#00FF66]/35 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#090D0A] border-2 border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.55)] flex items-center justify-center font-display font-black text-base text-[#FFD700] shrink-0">
                S
              </div>
              <div className="min-w-0">
                <div className="font-display font-black italic text-base leading-none">
                  <span className="text-white">Sports</span>
                  <span className="text-[#FFD700]">Viva</span>
                </div>
                <div className="text-[11px] text-emerald-300 truncate mt-0.5">
                  sfmartbd.com · Admin Panel
                </div>
              </div>
            </div>
          </div>

          {/* Primary 4 Menus (1. Dashboard, 2. Products, 3. Payment Gateways, 4. Monetag Ads Management) */}
          <div className="p-3 space-y-1.5">
            <div className="px-2 py-1 text-[10px] font-display font-black text-[#FFD700] tracking-wider">
              MAIN ADMIN MENU (1 – 4)
            </div>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateAdmin(item.route)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0A4218] via-[#0E5220] to-[#073012] border-[#FFD700] text-white shadow-[0_0_14px_rgba(255,215,0,0.3)]'
                      : 'bg-[#021A0A]/60 border-[#00FF66]/20 text-emerald-100 hover:border-[#00FF66]/60 hover:bg-[#062E12]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FFE54C] via-[#FFD700] to-[#FF8A00] text-[#021A0A] font-mono-num font-black text-[11px] flex items-center justify-center shrink-0">
                      {item.num}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#FFD700]' : 'text-[#00FF66]'
                      }`}
                    />
                    <div className="truncate">
                      <div className="text-xs font-display font-black leading-tight text-white">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-emerald-200 leading-tight mt-0.5 truncate">
                        {item.bangla}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#FFD700] text-[#021A0A]'
                          : 'bg-[#04280D] text-[#00FF66] border border-[#00FF66]/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Store Operations Menu */}
          <div className="px-3 pt-2 pb-3 space-y-1 border-t border-[#00FF66]/20">
            <div className="px-2 py-1 text-[10px] font-display font-bold text-emerald-300/80">
              STORE &amp; USER OPERATIONS
            </div>
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigateAdmin(item.route)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#0A3A0A] border-[#FFD700] text-[#FFD700] font-semibold'
                      : 'border-transparent text-emerald-200 hover:bg-[#04240B] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 text-[#00FF66]" />
                    <div className="truncate">
                      <div className="text-xs leading-tight">{item.label}</div>
                      <div className="text-[10px] text-emerald-300/70 leading-tight">
                        {item.bangla}
                      </div>
                    </div>
                  </div>
                  {typeof item.count === 'number' && (
                    <span className="text-xs font-mono tabular-nums text-[#FFD700]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Admin Profile & Logout */}
        <div className="p-4 border-t border-[#00FF66]/35 space-y-3 bg-[#021406]">
          <div className="text-xs">
            <div className="font-display font-bold text-[#FFD700] truncate">
              {adminSession.name}
            </div>
            <div className="text-emerald-200 truncate font-mono text-[11px]">
              {adminSession.email}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {onBackToMainApp && (
              <button
                onClick={onBackToMainApp}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FFE54C] via-[#FFD700] to-[#00FF66] text-[#021A0A] text-xs font-display font-black flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Back to Homepage</span>
              </button>
            )}
            <button
              onClick={handleAdminLogout}
              className="w-full py-2 px-3 rounded-xl bg-red-950/70 hover:bg-red-900/80 text-red-200 border border-red-500/50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out (/admin/login)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          RIGHT MAIN WORKSPACE CANVAS — HOMEPAGE EMERALD & GOLD DESIGN
         ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract */}
        <header className="bg-gradient-to-r from-[#04280D] via-[#063312] to-[#04280D] border-b border-[#00FF66]/40 px-6 py-3.5 flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-sm text-emerald-100 whitespace-nowrap shrink-0">
            <span className="font-display font-black text-[#FFD700]">Admin Panel</span>
            <span>/</span>
            <span className="font-mono text-xs text-[#00FF66]">{currentRoute}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadAllAdminData}
              className="px-3.5 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/60 hover:border-[#FFD700] text-xs font-semibold text-emerald-100 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00FF66] ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Supabase</span>
            </button>

            <button
              onClick={() => navigateAdmin('/admin/ads-manager')}
              className="px-3.5 py-2 rounded-xl bg-[#021A0A] border border-[#FFD700] text-[#FFD700] text-xs font-display font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 hover:bg-[#062E12]"
            >
              <Layers className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Ad Network Manager ({dashboardMetrics.activeAdNetworksCount}/6)</span>
            </button>

            <button
              onClick={() => navigateAdmin('/admin/monetag')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE54C] via-[#FFD700] to-[#FF8A00] text-[#021A0A] text-xs font-display font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(255,215,0,0.5)]"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Monetag Ads</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* ================================================================
              MENU 1: DASHBOARD (/admin)
             ================================================================ */}
          {currentRoute === '/admin' && (
            <div className="space-y-6">
              {/* Top Welcome Banner matching Homepage */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062E12] via-[#0B3B2D] to-[#1E1035] border-2 border-[#FFD700] p-4 sm:p-5 shadow-[0_0_20px_rgba(0,255,102,0.28)] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-display font-black text-[#00FF66]">
                    ⚡ SUPABASE ADMIN CONTROL CENTER · SFMARTBD.COM
                  </div>
                  <h1 className="text-lg sm:text-xl font-display font-black text-[#FFD700]">
                    Dashboard, Products, Payment Gateways &amp; Monetag Ads
                  </h1>
                  <p className="text-xs text-emerald-100">
                    All settings sync in real time with your Supabase database and Homepage cards.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateAdmin('/admin/payment-gateways')}
                    className="px-3.5 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66] text-[#00FF66] text-xs font-display font-black cursor-pointer hover:bg-[#04280D]"
                  >
                    3. Payment Gateways →
                  </button>
                  <button
                    onClick={() => navigateAdmin('/admin/monetag')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] text-xs font-display font-black cursor-pointer shadow-lg"
                  >
                    4. Monetag Ads Setup →
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards matching Homepage style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => navigateAdmin('/admin/products')}
                  className="bg-gradient-to-b from-[#062E12] to-[#031B0A] border border-[#00FF66]/50 hover:border-[#FFD700] rounded-2xl p-5 cursor-pointer transition-all shadow-[0_0_16px_rgba(0,255,102,0.15)]"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                    <span>Total Products</span>
                    <Package className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <div className="text-2xl font-display font-black text-[#FFD700] font-mono tabular-nums mt-2">
                    {dashboardMetrics.totalProducts.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-300 mt-2">
                    Stock Available: {dashboardMetrics.totalStockKg} kg
                  </div>
                </div>

                <div
                  onClick={() => navigateAdmin('/admin/payment-gateways')}
                  className="bg-gradient-to-b from-[#062E12] to-[#031B0A] border border-[#00FF66]/50 hover:border-[#FFD700] rounded-2xl p-5 cursor-pointer transition-all shadow-[0_0_16px_rgba(0,255,102,0.15)]"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                    <span>Payment Gateways</span>
                    <CreditCard className="w-4 h-4 text-[#00FF66]" />
                  </div>
                  <div className="text-2xl font-display font-black text-[#00FF66] font-mono tabular-nums mt-2">
                    {dashboardMetrics.activeGatewaysCount} / 4 Active
                  </div>
                  <div className="text-xs text-emerald-300 mt-2">
                    bKash · Nagad · Rocket · Upay
                  </div>
                </div>

                <div
                  onClick={() => navigateAdmin('/admin/monetag')}
                  className="bg-gradient-to-b from-[#062E12] to-[#031B0A] border border-[#00FF66]/50 hover:border-[#FFD700] rounded-2xl p-5 cursor-pointer transition-all shadow-[0_0_16px_rgba(0,255,102,0.15)]"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                    <span>Monetag Ads Status</span>
                    <Megaphone className="w-4 h-4 text-[#00F0FF]" />
                  </div>
                  <div className="text-lg font-display font-black text-white mt-2">
                    Banner: {monetagSettings.banner_enabled ? 'ON' : 'OFF'} · Vignette:{' '}
                    {monetagSettings.vignette_enabled ? 'ON' : 'OFF'}
                  </div>
                  <div className="text-xs text-[#FFD700] font-mono tabular-nums mt-2">
                    Vignette Timer: {monetagSettings.timer} sec
                  </div>
                </div>

                <div
                  onClick={() => navigateAdmin('/admin/orders')}
                  className="bg-gradient-to-b from-[#062E12] to-[#031B0A] border border-[#00FF66]/50 hover:border-[#FFD700] rounded-2xl p-5 cursor-pointer transition-all shadow-[0_0_16px_rgba(0,255,102,0.15)]"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-200 font-semibold">
                    <span>Total Sales &amp; Orders</span>
                    <ShoppingCart className="w-4 h-4 text-[#FFD700]" />
                  </div>
                  <div className="text-2xl font-display font-black text-[#FFD700] font-mono tabular-nums mt-2">
                    ৳{dashboardMetrics.totalSalesTk.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-300 mt-2">
                    {dashboardMetrics.totalOrders} Orders · {dashboardMetrics.totalUsers} Users
                  </div>
                </div>
              </div>

              {/* Quick Launch Cards for the 4 Main Admin Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-display font-black text-[#FFD700]">
                      02 · PRODUCTS CATALOG
                    </div>
                    <h2 className="text-base font-display font-black text-white">
                      Manage Store Products &amp; Stock
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Add, edit, or delete products with multiple images, discount prices, and stock
                      quantities in Supabase.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateAdmin('/admin/products')}
                    className="w-full py-2.5 rounded-xl bg-[#0A3A0A] border border-[#00FF66] text-[#FFD700] font-display font-black text-xs cursor-pointer hover:bg-[#0E4D1B]"
                  >
                    Open Products Management →
                  </button>
                </div>

                <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-display font-black text-[#00FF66]">
                      03 · PAYMENT GATEWAYS
                    </div>
                    <h2 className="text-base font-display font-black text-white">
                      bKash, Nagad, Rocket &amp; Upay API Keys
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Turn each payment gateway ON/OFF and configure Merchant Numbers, API Keys, and
                      Secret Keys.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateAdmin('/admin/payment-gateways')}
                    className="w-full py-2.5 rounded-xl bg-[#0A3A0A] border border-[#00FF66] text-[#FFD700] font-display font-black text-xs cursor-pointer hover:bg-[#0E4D1B]"
                  >
                    Configure Payment Gateways →
                  </button>
                </div>

                <div className="bg-[#04240B] border border-[#FFD700]/60 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-xs font-display font-black text-[#00F0FF]">
                      04 · MONETAG ADS MANAGEMENT
                    </div>
                    <h2 className="text-base font-display font-black text-[#FFD700]">
                      Homepage Banner &amp; Vignette Popup
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Paste your Monetag banner_code (after every 2 cards) and vignette_code
                      (fullscreen popup with 3/5/10s countdown).
                    </p>
                  </div>
                  <button
                    onClick={() => navigateAdmin('/admin/monetag')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer hover:brightness-110"
                  >
                    Open Monetag Ads (/admin/monetag) →
                  </button>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#00FF66]/30 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-display font-black text-[#FFD700]">
                      Recent Orders &amp; Delivery Queue
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Synced from Supabase orders table
                    </p>
                  </div>
                  <button
                    onClick={() => navigateAdmin('/admin/orders')}
                    className="text-xs font-display font-bold text-[#00FF66] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#021A0A] border-b border-[#00FF66]/30 text-emerald-300">
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Customer &amp; Phone</th>
                        <th className="py-3 px-4 font-semibold">District / Thana</th>
                        <th className="py-3 px-4 font-semibold text-right">Amount</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF66]/20">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#062E12]/60">
                          <td className="py-3 px-4 font-mono font-bold text-[#FFD700] tabular-nums">
                            {ord.order_id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{ord.customer_name}</div>
                            <div className="font-mono text-emerald-300 tabular-nums">
                              {ord.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-emerald-100">
                            {ord.district} · {ord.thana}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#00FF66] tabular-nums">
                            ৳{ord.total_amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-white font-medium">{ord.order_status}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderModal(ord)}
                              className="px-3 py-1 rounded-lg bg-[#021A0A] border border-[#FFD700]/60 text-[#FFD700] hover:border-[#00FF66] font-semibold cursor-pointer"
                            >
                              Address
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              MENU 2: PRODUCTS (/admin/products)
             ================================================================ */}
          {currentRoute === '/admin/products' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-display font-black text-[#FFD700]">
                    02. Products Management (শুঁটকি ও স্টোর পণ্য তালিকা)
                  </h1>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Supabase table: <span className="font-mono text-[#00FF66]">products</span> (id,
                    name, category, price, discount_price, stock, weight, description, images[],
                    created_at)
                  </p>
                </div>
                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] text-xs font-display font-black flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Product</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', ...SHUTKI_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold transition-colors cursor-pointer ${
                        productCategoryFilter === cat
                          ? 'bg-[#FFD700] text-[#021A0A]'
                          : 'bg-[#021A0A] text-emerald-200 border border-[#00FF66]/30 hover:border-[#FFD700]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search Loitta, Chingri, Rupchanda..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#021A0A] border-b border-[#00FF66]/30 text-emerald-300">
                        <th className="py-3.5 px-4 font-semibold">ID</th>
                        <th className="py-3.5 px-4 font-semibold">Product</th>
                        <th className="py-3.5 px-4 font-semibold">Category</th>
                        <th className="py-3.5 px-4 font-semibold">Weight</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Regular Price</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Discount Price</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Stock (kg)</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF66]/20">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-[#062E12]/60">
                          <td className="py-3.5 px-4 font-mono text-emerald-300 tabular-nums">
                            #{product.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  product.images?.[0] ||
                                  '/src/assets/images/shutki_loitta_premium_1791713348819.jpg'
                                }
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-10 rounded-lg object-cover border border-[#FFD700]/50 shrink-0"
                              />
                              <div className="min-w-0 max-w-md">
                                <div className="font-semibold text-white truncate">
                                  {product.name}
                                </div>
                                <div className="text-[11px] text-emerald-200 truncate mt-0.5">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-[#FFD700]">
                            {product.category}
                          </td>
                          <td className="py-3.5 px-4 font-mono tabular-nums text-emerald-100">
                            {product.weight}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400/60 line-through">
                            ৳{product.price.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-[#00FF66]">
                            ৳{product.discount_price.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-white">
                            {product.stock} kg
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditProductModal(product)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#021A0A] border border-[#00FF66]/50 hover:border-[#FFD700] text-emerald-100 font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#FFD700]" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/50 hover:bg-red-900 text-red-200 font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              MENU 3: PAYMENT GATEWAYS (/admin/payment-gateways)
              (bKash, Nagad, Rocket, Upay On/Off + API Keys + Transactions)
             ================================================================ */}
          {currentRoute === '/admin/payment-gateways' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-display font-black text-[#FFD700]">
                    03. Payment Gateways (bKash, Nagad, Rocket, Upay On/Off + API Keys)
                  </h1>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Supabase table:{' '}
                    <span className="font-mono text-[#00FF66]">payment_gateways</span> — Enable or
                    disable mobile banking gateways and manage live/sandbox API keys
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveGatewaysSubmit}
                  disabled={savingGateways}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-[0_0_16px_rgba(255,215,0,0.5)] hover:brightness-110"
                >
                  {savingGateways ? 'Saving to Supabase...' : 'Save All Payment Gateways to Supabase'}
                </button>
              </div>

              {/* 4 Payment Gateway Cards: bKash, Nagad, Rocket, Upay */}
              <form onSubmit={handleSaveGatewaysSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {gateways.map((gw) => {
                    const accentColor =
                      gw.gateway_name === 'bKash'
                        ? 'border-[#E2136E]'
                        : gw.gateway_name === 'Nagad'
                        ? 'border-[#F7941D]'
                        : gw.gateway_name === 'Rocket'
                        ? 'border-[#8C3494]'
                        : 'border-[#00F0FF]';
                    const headerBadgeBg =
                      gw.gateway_name === 'bKash'
                        ? 'bg-[#E2136E] text-white'
                        : gw.gateway_name === 'Nagad'
                        ? 'bg-[#F7941D] text-[#021A0A]'
                        : gw.gateway_name === 'Rocket'
                        ? 'bg-[#8C3494] text-white'
                        : 'bg-[#00F0FF] text-[#021A0A]';

                    return (
                      <div
                        key={gw.gateway_name}
                        className={`bg-[#04240B] border-2 ${
                          gw.is_enabled ? accentColor : 'border-emerald-900/60 opacity-80'
                        } rounded-2xl p-5 space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.4)]`}
                      >
                        {/* Gateway Top Bar + ON/OFF Toggle Switch */}
                        <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#00FF66]/25">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1.5 rounded-xl font-display font-black text-sm ${headerBadgeBg}`}
                            >
                              {gw.gateway_name}
                            </span>
                            <div>
                              <div className="text-sm font-display font-black text-white">
                                {gw.gateway_name} Payment Gateway
                              </div>
                              <div className="text-[11px] text-emerald-200">
                                Status:{' '}
                                <span
                                  className={
                                    gw.is_enabled
                                      ? 'text-[#00FF66] font-bold'
                                      : 'text-red-400 font-bold'
                                  }
                                >
                                  {gw.is_enabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleGateway(gw.gateway_name)}
                            className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer p-1 flex items-center ${
                              gw.is_enabled
                                ? 'bg-[#00FF66] justify-end'
                                : 'bg-[#021A0A] border border-emerald-700 justify-start'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full shadow-md ${
                                gw.is_enabled ? 'bg-[#021A0A]' : 'bg-emerald-400'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Gateway Configuration Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-[#FFD700] mb-1">
                              Merchant / Agent Number
                            </label>
                            <input
                              type="text"
                              value={gw.merchant_number}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'merchant_number',
                                  e.target.value
                                )
                              }
                              placeholder="017XXXXXXXX"
                              className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/40 text-white font-mono focus:outline-none focus:border-[#FFD700]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#FFD700] mb-1">
                              Merchant Username / ID
                            </label>
                            <input
                              type="text"
                              value={gw.username}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'username',
                                  e.target.value
                                )
                              }
                              placeholder={`${gw.gateway_name.toLowerCase()}_merchant_id`}
                              className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/40 text-white font-mono focus:outline-none focus:border-[#FFD700]"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-bold text-[#00FF66] mb-1">
                              API Key / App Key (Public Key)
                            </label>
                            <input
                              type="text"
                              value={gw.api_key}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'api_key',
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${gw.gateway_name} API Key / App Key`}
                              className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/40 text-white font-mono focus:outline-none focus:border-[#FFD700]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-emerald-200 mb-1">
                              API Secret / App Secret Key
                            </label>
                            <input
                              type="password"
                              value={gw.api_secret}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'api_secret',
                                  e.target.value
                                )
                              }
                              placeholder="Enter Secret Key"
                              className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/40 text-white font-mono focus:outline-none focus:border-[#FFD700]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-emerald-200 mb-1">
                              Merchant Password / PIN
                            </label>
                            <input
                              type="password"
                              value={gw.password}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'password',
                                  e.target.value
                                )
                              }
                              placeholder="Enter Password"
                              className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/40 text-white font-mono focus:outline-none focus:border-[#FFD700]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#00FF66]/20 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer text-emerald-200">
                            <input
                              type="checkbox"
                              checked={gw.is_sandbox}
                              onChange={(e) =>
                                handleUpdateGatewayField(
                                  gw.gateway_name,
                                  'is_sandbox',
                                  e.target.checked
                                )
                              }
                              className="rounded border-emerald-500"
                            />
                            <span>Sandbox / Test Environment Mode</span>
                          </label>
                          <span className="font-mono text-[11px] text-[#FFD700]">
                            {gw.is_sandbox ? 'SANDBOX' : 'LIVE PRODUCTION'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingGateways}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-sm cursor-pointer shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:brightness-110"
                  >
                    {savingGateways
                      ? 'Saving Gateways...'
                      : '💾 Save bKash, Nagad, Rocket & Upay Settings to Supabase'}
                  </button>
                </div>
              </form>

              {/* Payment Transactions Log Section below Gateways */}
              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-display font-black text-[#FFD700]">
                      Recent Payment Transactions (bKash / Nagad / Rocket / Upay TrxID)
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Verify incoming customer Transaction IDs
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {['ALL', 'bKash', 'Nagad', 'Rocket', 'Upay'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethodFilter(m)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          paymentMethodFilter === m
                            ? 'bg-[#FFD700] text-[#021A0A]'
                            : 'bg-[#021A0A] text-emerald-200 border border-[#00FF66]/30'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#021A0A] border-b border-[#00FF66]/30 text-emerald-300">
                        <th className="py-3 px-4 font-semibold">Transaction ID (TrxID)</th>
                        <th className="py-3 px-4 font-semibold">Gateway</th>
                        <th className="py-3 px-4 font-semibold">Order ID</th>
                        <th className="py-3 px-4 font-semibold">Customer &amp; Phone</th>
                        <th className="py-3 px-4 font-semibold text-right">Amount (TK)</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF66]/20">
                      {filteredPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-[#062E12]/60">
                          <td className="py-3 px-4 font-mono font-bold text-[#FFD700] tabular-nums">
                            {pay.transaction_id}
                          </td>
                          <td className="py-3 px-4 font-semibold text-white">{pay.method}</td>
                          <td className="py-3 px-4 font-mono text-emerald-200 tabular-nums">
                            {pay.order_id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-white">{pay.customer_name}</div>
                            <div className="font-mono text-emerald-300 tabular-nums">
                              {pay.phone}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-[#00FF66] tabular-nums">
                            ৳{pay.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={pay.status}
                              onChange={(e) => handlePaymentStatusChange(pay, e.target.value)}
                              className="px-2.5 py-1 rounded-lg bg-[#021A0A] border border-[#00FF66]/50 text-xs font-semibold text-[#FFD700] cursor-pointer"
                            >
                              <option value="Verified">Verified</option>
                              <option value="Pending">Pending</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              MENU 4: MONETAG ADS MANAGEMENT (/admin/monetag)
              Supabase table: monetag_settings
              Columns: id, banner_code, vignette_code, banner_enabled, vignette_enabled, timer, created_at
              UI: 2 big textareas, 2 toggle switches, 1 dropdown for timer (3, 5, 10 sec), Save button
             ================================================================ */}
          {currentRoute === '/admin/monetag' && (
            <div className="space-y-6 max-w-5xl">
              <div className="bg-gradient-to-r from-[#062E12] via-[#0B3B2D] to-[#1E1035] border-2 border-[#FFD700] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_24px_rgba(0,255,102,0.28)]">
                <div className="space-y-1">
                  <div className="text-xs font-display font-black text-[#00FF66]">
                    04 · MONETAG ADS MANAGEMENT · ROUTE: /admin/monetag
                  </div>
                  <h1 className="text-xl font-display font-black text-[#FFD700]">
                    Monetag Banner &amp; Fullscreen Vignette Ad Controller
                  </h1>
                  <p className="text-xs text-emerald-100">
                    Supabase Table:{' '}
                    <code className="font-mono text-[#00F0FF]">monetag_settings</code> (
                    <code className="font-mono text-emerald-200">
                      id, banner_code, vignette_code, banner_enabled, vignette_enabled, timer,
                      created_at
                    </code>
                    )
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreviewVignetteOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#021A0A] border-2 border-[#00F0FF] text-[#00F0FF] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#062E12]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test Vignette Popup ({monetagSettings.timer}s)</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveMonetagSubmit} className="space-y-6">
                {/* TOP CONTROLS ROW: 2 Toggle Switches + 1 Timer Dropdown (3, 5, 10 sec) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Toggle Switch 1: banner_enabled */}
                  <div className="bg-[#04240B] border-2 border-[#00FF66]/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-display font-black text-[#FFD700]">
                        1. HOMEPAGE BANNER AD
                      </div>
                      <div className="text-sm font-bold text-white">
                        banner_enabled:{' '}
                        <span
                          className={
                            monetagSettings.banner_enabled ? 'text-[#00FF66]' : 'text-red-400'
                          }
                        >
                          {monetagSettings.banner_enabled ? 'TRUE (ON)' : 'FALSE (OFF)'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-200">
                        Renders after every 2 cards on Homepage
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setMonetagSettings((prev) => ({
                          ...prev,
                          banner_enabled: !prev.banner_enabled,
                        }))
                      }
                      className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 flex items-center shrink-0 ${
                        monetagSettings.banner_enabled
                          ? 'bg-[#00FF66] justify-end shadow-[0_0_12px_rgba(0,255,102,0.6)]'
                          : 'bg-[#021A0A] border border-emerald-700 justify-start'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full shadow-md ${
                          monetagSettings.banner_enabled ? 'bg-[#021A0A]' : 'bg-emerald-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle Switch 2: vignette_enabled */}
                  <div className="bg-[#04240B] border-2 border-[#00FF66]/50 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-display font-black text-[#00F0FF]">
                        2. VIGNETTE POPUP AD
                      </div>
                      <div className="text-sm font-bold text-white">
                        vignette_enabled:{' '}
                        <span
                          className={
                            monetagSettings.vignette_enabled ? 'text-[#00FF66]' : 'text-red-400'
                          }
                        >
                          {monetagSettings.vignette_enabled ? 'TRUE (ON)' : 'FALSE (OFF)'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-200">
                        Fullscreen popup on every page navigation
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setMonetagSettings((prev) => ({
                          ...prev,
                          vignette_enabled: !prev.vignette_enabled,
                        }))
                      }
                      className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 flex items-center shrink-0 ${
                        monetagSettings.vignette_enabled
                          ? 'bg-[#00FF66] justify-end shadow-[0_0_12px_rgba(0,255,102,0.6)]'
                          : 'bg-[#021A0A] border border-emerald-700 justify-start'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full shadow-md ${
                          monetagSettings.vignette_enabled ? 'bg-[#021A0A]' : 'bg-emerald-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dropdown 3: timer (3, 5, 10 sec) */}
                  <div className="bg-[#04240B] border-2 border-[#FFD700]/70 rounded-2xl p-4 flex flex-col justify-between gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-display font-black text-[#FFD700]">
                        3. VIGNETTE COUNTDOWN TIMER
                      </span>
                      <Clock className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <select
                      value={monetagSettings.timer}
                      onChange={(e) =>
                        setMonetagSettings((prev) => ({
                          ...prev,
                          timer: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#FFD700] text-sm font-mono font-bold text-[#FFD700] focus:outline-none cursor-pointer"
                    >
                      <option value={3}>3 Seconds (3 sec)</option>
                      <option value={5}>5 Seconds (5 sec)</option>
                      <option value={10}>10 Seconds (10 sec)</option>
                    </select>
                    <div className="text-[11px] text-emerald-200">
                      User sees countdown ({monetagSettings.timer}s) before Close button appears
                    </div>
                  </div>
                </div>

                {/* 2 BIG TEXTAREAS FOR PASTING MONETAG CODES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Textarea 1: banner_code */}
                  <div className="bg-[#04240B] border-2 border-[#00FF66]/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-display font-black text-[#FFD700] flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#00FF66]" />
                          <span>Monetag Banner Code (banner_code)</span>
                        </label>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          If <code className="text-[#00FF66]">banner_enabled = true</code>, this
                          code renders automatically after every 2 cards on the Homepage.
                        </p>
                      </div>
                    </div>

                    <textarea
                      rows={9}
                      value={monetagSettings.banner_code}
                      onChange={(e) =>
                        setMonetagSettings((prev) => ({
                          ...prev,
                          banner_code: e.target.value,
                        }))
                      }
                      placeholder="Paste your Monetag Banner / In-Page Push / Script HTML code here when ready..."
                      className="w-full p-4 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 focus:border-[#FFD700] focus:outline-none text-xs font-mono text-[#00FF66] leading-relaxed resize-y"
                    />

                    <div className="flex items-center justify-between text-[11px] text-emerald-300">
                      <span>Column: monetag_settings.banner_code (TEXT)</span>
                      <span>
                        {monetagSettings.banner_code.trim().length > 0
                          ? `${monetagSettings.banner_code.length} chars`
                          : 'Currently Empty (Ready for your code)'}
                      </span>
                    </div>
                  </div>

                  {/* Textarea 2: vignette_code */}
                  <div className="bg-[#04240B] border-2 border-[#00F0FF]/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-display font-black text-[#00F0FF] flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#FFD700]" />
                          <span>Monetag Vignette Code (vignette_code)</span>
                        </label>
                        <p className="text-xs text-emerald-200 mt-0.5">
                          If <code className="text-[#00FF66]">vignette_enabled = true</code>, shows
                          in a fullscreen popup on every page navigation with a{' '}
                          <strong className="text-[#FFD700]">{monetagSettings.timer}s</strong>{' '}
                          countdown before Close.
                        </p>
                      </div>
                    </div>

                    <textarea
                      rows={9}
                      value={monetagSettings.vignette_code}
                      onChange={(e) =>
                        setMonetagSettings((prev) => ({
                          ...prev,
                          vignette_code: e.target.value,
                        }))
                      }
                      placeholder="Paste your Monetag Vignette / Interstitial Script or HTML code here when ready..."
                      className="w-full p-4 rounded-xl bg-[#021A0A] border border-[#00F0FF]/50 focus:border-[#FFD700] focus:outline-none text-xs font-mono text-[#00F0FF] leading-relaxed resize-y"
                    />

                    <div className="flex items-center justify-between text-[11px] text-emerald-300">
                      <span>Column: monetag_settings.vignette_code (TEXT)</span>
                      <span>
                        {monetagSettings.vignette_code.trim().length > 0
                          ? `${monetagSettings.vignette_code.length} chars`
                          : 'Currently Empty (Ready for your code)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SAVE BUTTON TO SUPABASE */}
                <div className="bg-[#04240B] border-2 border-[#FFD700] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-emerald-100 space-y-0.5">
                    <div className="font-display font-bold text-[#FFD700]">
                      Real-Time Supabase Frontend Integration Active
                    </div>
                    <div>
                      Saving immediately updates <code className="font-mono">monetag_settings</code>{' '}
                      in Supabase and syncs with the Homepage &amp; Page Navigation.
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingMonetag}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-sm cursor-pointer shadow-[0_0_24px_rgba(255,215,0,0.65)] hover:brightness-110 transition-all"
                  >
                    {savingMonetag
                      ? 'Saving to Supabase...'
                      : '💾 Save Monetag Settings to Supabase'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================
              MENU 5: AD NETWORK MANAGER (/admin/ads-manager)
              Supabase table: ad_networks
              Columns: id, network_name (text), banner_code (text), vignette_code (text), popup_code (text), is_active (boolean)
              Pre-inserted 6 networks with is_active = false:
              1. Monetag, 2. Adsterra, 3. PropellerAds, 4. AdMook, 5. PopAds, 6. Galaksion
             ================================================================ */}
          {currentRoute === '/admin/ads-manager' && (
            <div className="space-y-6">
              {/* Top Header Card */}
              <div className="bg-gradient-to-r from-[#062E12] via-[#0B3B2D] to-[#1E1035] border-2 border-[#FFD700] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_24px_rgba(0,255,102,0.28)]">
                <div className="space-y-1">
                  <div className="text-xs font-display font-black text-[#00FF66]">
                    05 · AD NETWORK MANAGER · ROUTE: /admin/ads-manager
                  </div>
                  <h1 className="text-xl font-display font-black text-[#FFD700]">
                    Multi-Company Ad Network Manager &amp; Smart Rotation (6 Networks)
                  </h1>
                  <p className="text-xs text-emerald-100">
                    Supabase Table: <code className="font-mono text-[#00F0FF]">ad_networks</code> (
                    <code className="font-mono text-emerald-200">
                      id, network_name, banner_code, vignette_code, popup_code, is_active
                    </code>
                    ) · Active Networks:{' '}
                    <strong className="text-[#FFD700]">
                      {dashboardMetrics.activeAdNetworksCount} / 6 ON
                    </strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveAllSixAdNetworks}
                    disabled={savingAllNetworks}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-[0_0_16px_rgba(255,215,0,0.5)] hover:brightness-110"
                  >
                    {savingAllNetworks
                      ? 'Saving All 6 Networks...'
                      : '💾 Save All 6 Networks to Supabase'}
                  </button>
                </div>
              </div>

              {/* Frontend Rotation Logic Status Bar */}
              <div className="bg-[#04240B] border border-[#00FF66]/45 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-display font-black text-[#FFD700]">
                    Smart Frontend Ad Rotation Logic (সব কোম্পানি এক জায়গায় নিয়ন্ত্রণ)
                  </div>
                  <div className="text-emerald-200">
                    • Only networks where <code className="text-[#00FF66]">is_active = true</code>{' '}
                    will load ads · If multiple networks are ON, ads rotate automatically (1 network
                    per page load) · If all 6 are OFF, zero ads are shown.
                  </div>
                </div>
                <div className="font-mono font-bold text-[#00FF66] shrink-0">
                  {dashboardMetrics.activeAdNetworksCount === 0
                    ? 'ALL 6 OFF → NO ADS SHOWN'
                    : dashboardMetrics.activeAdNetworksCount === 1
                    ? `1 ACTIVE (${
                        adNetworks.find((n) => n.is_active)?.network_name
                      }) → SHOWING THIS NETWORK`
                    : `${dashboardMetrics.activeAdNetworksCount} ACTIVE → ROTATING 1 PER PAGE LOAD`}
                </div>
              </div>

              {/* Grid of 6 Pre-Inserted Ad Network Cards */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {adNetworks.map((net, idx) => {
                  const isSavingThis = savingNetworkName === net.network_name;
                  return (
                    <div
                      key={net.network_name}
                      className={`bg-[#04240B] border-2 ${
                        net.is_active
                          ? 'border-[#00FF66] shadow-[0_0_24px_rgba(0,255,102,0.28)]'
                          : 'border-[#FFD700]/35'
                      } rounded-2xl p-5 space-y-4 transition-all`}
                    >
                      {/* Card Header: Network Name + On/Off Toggle Switch */}
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#00FF66]/25">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFE54C] via-[#FFD700] to-[#FF8A00] text-[#021A0A] font-mono-num font-black text-xs flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <div>
                            <h2 className="text-base font-display font-black text-[#FFD700]">
                              {idx + 1}. {net.network_name}
                            </h2>
                            <div className="text-[11px] text-emerald-200">
                              is_active:{' '}
                              <span
                                className={
                                  net.is_active
                                    ? 'text-[#00FF66] font-bold'
                                    : 'text-red-400 font-bold'
                                }
                              >
                                {net.is_active ? 'TRUE (ON)' : 'FALSE (OFF)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* On/Off Toggle Switch */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-display font-bold text-emerald-100">
                            {net.is_active ? 'ON' : 'OFF'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleAdNetwork(net.network_name)}
                            className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer p-1 flex items-center shrink-0 ${
                              net.is_active
                                ? 'bg-[#00FF66] justify-end shadow-[0_0_12px_rgba(0,255,102,0.6)]'
                                : 'bg-[#021A0A] border border-emerald-700 justify-start'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full shadow-md ${
                                net.is_active ? 'bg-[#021A0A]' : 'bg-emerald-400'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* 3 Textareas: Banner Code, Vignette Code, Popup Code */}
                      <div className="space-y-3 text-xs">
                        {/* Textarea 1: Banner Code */}
                        <div>
                          <label className="block font-display font-bold text-[#FFD700] mb-1">
                            1. Banner Code (banner_code) — {net.network_name}
                          </label>
                          <textarea
                            rows={3}
                            value={net.banner_code}
                            onChange={(e) =>
                              handleUpdateAdNetworkField(
                                net.network_name,
                                'banner_code',
                                e.target.value
                              )
                            }
                            placeholder={`Paste ${net.network_name} Banner HTML / Script code here...`}
                            className="w-full p-3 rounded-xl bg-[#021A0A] border border-[#00FF66]/45 focus:border-[#FFD700] focus:outline-none font-mono text-xs text-[#00FF66] resize-y"
                          />
                        </div>

                        {/* Textarea 2: Vignette Code */}
                        <div>
                          <label className="block font-display font-bold text-[#00F0FF] mb-1">
                            2. Vignette Code (vignette_code) — {net.network_name}
                          </label>
                          <textarea
                            rows={3}
                            value={net.vignette_code}
                            onChange={(e) =>
                              handleUpdateAdNetworkField(
                                net.network_name,
                                'vignette_code',
                                e.target.value
                              )
                            }
                            placeholder={`Paste ${net.network_name} Vignette / Interstitial code here...`}
                            className="w-full p-3 rounded-xl bg-[#021A0A] border border-[#00F0FF]/45 focus:border-[#FFD700] focus:outline-none font-mono text-xs text-[#00F0FF] resize-y"
                          />
                        </div>

                        {/* Textarea 3: Popup Code */}
                        <div>
                          <label className="block font-display font-bold text-amber-300 mb-1">
                            3. Popup Code (popup_code) — {net.network_name}
                          </label>
                          <textarea
                            rows={3}
                            value={net.popup_code}
                            onChange={(e) =>
                              handleUpdateAdNetworkField(
                                net.network_name,
                                'popup_code',
                                e.target.value
                              )
                            }
                            placeholder={`Paste ${net.network_name} Popunder / Popup Script code here...`}
                            className="w-full p-3 rounded-xl bg-[#021A0A] border border-amber-400/45 focus:border-[#FFD700] focus:outline-none font-mono text-xs text-amber-200 resize-y"
                          />
                        </div>
                      </div>

                      {/* Card Footer: Save Button */}
                      <div className="pt-2 border-t border-[#00FF66]/20 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-emerald-300 font-mono">
                          Table: ad_networks · ID #{net.id || idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSaveSingleAdNetwork(net)}
                          disabled={isSavingThis}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] via-[#FFE54C] to-[#FFD700] text-[#021A0A] font-display font-black text-xs cursor-pointer shadow-[0_0_14px_rgba(255,215,0,0.45)] hover:brightness-110"
                        >
                          {isSavingThis
                            ? `Saving ${net.network_name}...`
                            : `💾 Save ${net.network_name}`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 5: ORDER MANAGEMENT (/admin/orders)
             ================================================================ */}
          {currentRoute === '/admin/orders' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-display font-black text-[#FFD700]">
                    Order Management (অর্ডার ও কাস্টমার ঠিকানা)
                  </h1>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Supabase table: <span className="font-mono text-[#00FF66]">orders</span> — View
                    District, Thana, Village address &amp; update order status
                  </p>
                </div>
                <button
                  onClick={() => setShowNewOrderModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] text-xs font-display font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Order</span>
                </button>
              </div>

              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {['ALL', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          orderStatusFilter === st
                            ? 'bg-[#FFD700] text-[#021A0A]'
                            : 'bg-[#021A0A] text-emerald-200 border border-[#00FF66]/30'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, Phone, District..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-xs text-white"
                  />
                </div>
              </div>

              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#021A0A] border-b border-[#00FF66]/30 text-emerald-300">
                        <th className="py-3.5 px-4 font-semibold">Order ID</th>
                        <th className="py-3.5 px-4 font-semibold">Customer &amp; Phone</th>
                        <th className="py-3.5 px-4 font-semibold">
                          Full Address (District, Thana, Village)
                        </th>
                        <th className="py-3.5 px-4 font-semibold">Products Ordered</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Total (TK)</th>
                        <th className="py-3.5 px-4 font-semibold">Order Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Delivery Slip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF66]/20">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#062E12]/60 align-top">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#FFD700] tabular-nums">
                            {ord.order_id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{ord.customer_name}</div>
                            <div className="font-mono text-emerald-300 tabular-nums mt-0.5">
                              {ord.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-semibold text-emerald-100">
                              District: {ord.district} · Thana: {ord.thana}
                            </div>
                            <div className="text-emerald-300/80 mt-0.5">
                              Village/Area: {ord.village}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            {Array.isArray(ord.items) &&
                              ord.items.map((it, idx) => (
                                <div key={idx} className="text-emerald-100">
                                  • {it.name} ×{' '}
                                  <span className="font-mono font-bold text-[#FFD700]">
                                    {it.qty}
                                  </span>
                                </div>
                              ))}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-[#00FF66] tabular-nums">
                            ৳{ord.total_amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ord.order_status}
                              onChange={(e) => handleOrderStatusChange(ord, e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#021A0A] border border-[#00FF66]/50 text-xs font-semibold text-[#FFD700] cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderModal(ord)}
                              className="px-3 py-1.5 rounded-lg bg-[#021A0A] border border-[#FFD700] text-[#FFD700] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Address</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 6: USER MANAGEMENT (/admin/users)
             ================================================================ */}
          {currentRoute === '/admin/users' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-display font-black text-[#FFD700]">
                  User Management (Supabase auth.users &amp; Customers)
                </h1>
                <p className="text-xs text-emerald-200 mt-0.5">
                  View customer Name, Email, Phone, Address · Reset Password · Block or Unblock User
                </p>
              </div>

              <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#021A0A] border-b border-[#00FF66]/30 text-emerald-300">
                        <th className="py-3.5 px-4 font-semibold">Name &amp; Role</th>
                        <th className="py-3.5 px-4 font-semibold">Email &amp; Phone</th>
                        <th className="py-3.5 px-4 font-semibold">Delivery Address</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF66]/20">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#062E12]/60">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-emerald-300">{u.role}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono text-[#FFD700]">{u.email}</div>
                            <div className="font-mono text-emerald-200 tabular-nums mt-0.5">
                              {u.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-emerald-100 max-w-xs">{u.address}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`font-bold ${
                                u.is_blocked ? 'text-red-400' : 'text-[#00FF66]'
                              }`}
                            >
                              {u.is_blocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleResetUserPassword(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#021A0A] border border-[#00FF66]/50 text-emerald-100 font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-[#FFD700]" />
                                <span>Reset Password</span>
                              </button>
                              <button
                                onClick={() => handleToggleUserBlock(u)}
                                className={`px-2.5 py-1.5 rounded-lg border font-medium inline-flex items-center gap-1 cursor-pointer ${
                                  u.is_blocked
                                    ? 'border-[#00FF66] text-[#00FF66]'
                                    : 'border-red-500/60 text-red-300'
                                }`}
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>{u.is_blocked ? 'Unblock' : 'Block'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 7: BANNERS & COUPONS (/admin/banners)
             ================================================================ */}
          {currentRoute === '/admin/banners' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-display font-black text-[#FFD700]">
                  Banner, Notice &amp; Coupon Management (/admin/banners)
                </h1>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Add/Edit/Delete homepage banners &amp; create discount coupon codes
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-5 space-y-4">
                    <h2 className="text-sm font-display font-black text-[#FFD700]">
                      {editingBanner ? 'Edit Homepage Banner' : 'Add New Homepage Banner'}
                    </h2>
                    <form onSubmit={handleSaveBannerSubmit} className="space-y-3 text-xs">
                      <input
                        type="text"
                        required
                        value={banTitle}
                        onChange={(e) => setBanTitle(e.target.value)}
                        placeholder="Banner Headline Title"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                      />
                      <input
                        type="text"
                        value={banSubtitle}
                        onChange={(e) => setBanSubtitle(e.target.value)}
                        placeholder="Banner Subtitle"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                      />
                      <input
                        type="text"
                        value={banImageUrl}
                        onChange={(e) => setBanImageUrl(e.target.value)}
                        placeholder="Banner Image URL"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black cursor-pointer"
                      >
                        {editingBanner ? 'Update Banner' : '+ Publish Banner'}
                      </button>
                    </form>
                  </div>

                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={b.image_url}
                          alt={b.title}
                          referrerPolicy="no-referrer"
                          className="w-24 h-14 rounded-lg object-cover border border-[#FFD700]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{b.title}</div>
                          <div className="text-[11px] text-emerald-200 truncate">{b.subtitle}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-500/50 text-xs text-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-5 space-y-4">
                    <h2 className="text-sm font-display font-black text-[#FFD700]">
                      Create Coupon Code
                    </h2>
                    <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs">
                      <input
                        type="text"
                        required
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="SHUTKI20"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono uppercase"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          required
                          value={couponPercent}
                          onChange={(e) => setCouponPercent(Number(e.target.value))}
                          placeholder="Discount %"
                          className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                        />
                        <input
                          type="number"
                          required
                          value={couponMinOrder}
                          onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                          placeholder="Min Order TK"
                          className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black cursor-pointer"
                      >
                        + Create Coupon
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              VIEW 8: SETTINGS & SUPABASE SQL (/admin/settings)
             ================================================================ */}
          {currentRoute === '/admin/settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-xl font-display font-black text-[#FFD700]">
                  Delivery Settings &amp; Supabase SQL Schema (/admin/settings)
                </h1>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Configure Inside/Outside Dhaka Delivery Charges &amp; Copy Supabase SQL Schema for
                  monetag_settings &amp; payment_gateways
                </p>
              </div>

              <form
                onSubmit={handleSaveSettingsSubmit}
                className="bg-[#04240B] border border-[#00FF66]/40 rounded-2xl p-6 space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1">
                      Inside Dhaka Delivery (৳)
                    </label>
                    <input
                      type="number"
                      value={settings.inside_dhaka_charge}
                      onChange={(e) =>
                        setSettings({ ...settings, inside_dhaka_charge: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1">
                      Outside Dhaka Delivery (৳)
                    </label>
                    <input
                      type="number"
                      value={settings.outside_dhaka_charge}
                      onChange={(e) =>
                        setSettings({ ...settings, outside_dhaka_charge: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#FFD700] mb-1">
                      Free Delivery Min Order (৳)
                    </label>
                    <input
                      type="number"
                      value={settings.free_delivery_min}
                      onChange={(e) =>
                        setSettings({ ...settings, free_delivery_min: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black cursor-pointer"
                >
                  Save Delivery Settings
                </button>
              </form>

              {/* Supabase SQL Script for monetag_settings & payment_gateways */}
              <div className="bg-[#04240B] border border-[#FFD700]/60 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-display font-black text-[#FFD700]">
                      Supabase SQL Schema (monetag_settings, payment_gateways, products)
                    </h2>
                    <p className="text-xs text-emerald-200">
                      Run in your Supabase SQL Editor if creating a fresh external Supabase project
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA_SCRIPT);
                      setCopiedSql(true);
                      showToast('Copied Supabase SQL schema to clipboard!');
                      setTimeout(() => setCopiedSql(false), 2500);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#021A0A] border border-[#00FF66]/30 text-[11px] font-mono text-[#00FF66] overflow-x-auto max-h-64">
                  {SUPABASE_SQL_SCHEMA_SCRIPT}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====================================================================
          MODAL A: ADD / EDIT PRODUCT MODAL
         ==================================================================== */}
      {showProductFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#04240B] border-2 border-[#FFD700] rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-3">
              <h2 className="text-base font-display font-black text-[#FFD700]">
                {editingProduct ? `Edit Product #${editingProduct.id}` : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowProductFormModal(false)}
                className="text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#FFD700] mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. কক্সবাজারের অর্গানিক লইট্টা শুঁটকি"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFD700] mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                  >
                    {SHUTKI_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFD700] mb-1">Weight</label>
                  <select
                    value={prodWeight}
                    onChange={(e) => setProdWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                  >
                    {SHUTKI_WEIGHT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#FFD700] mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#00FF66] mb-1">Discount Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFD700] mb-1">Stock (kg)</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#FFD700] mb-1">
                    Upload Multiple Images
                  </label>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#021A0A] border border-dashed border-[#FFD700] cursor-pointer text-[#FFD700]">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingImages ? 'Uploading...' : 'Select Image Files'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleProductImagesUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#FFD700] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#00FF66]/20">
                <button
                  type="button"
                  onClick={() => setShowProductFormModal(false)}
                  className="px-4 py-2 rounded-xl border border-emerald-500 text-emerald-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black cursor-pointer"
                >
                  Save Product to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL B: ORDER ADDRESS MODAL
         ==================================================================== */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#04240B] border-2 border-[#FFD700] rounded-2xl max-w-xl w-full p-6 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-3">
              <div>
                <div className="text-xs font-mono text-[#00FF66] font-bold">
                  DELIVERY DISPATCH SLIP · {selectedOrderModal.order_id}
                </div>
                <h2 className="text-lg font-display font-black text-[#FFD700]">
                  Customer Delivery Address
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#021A0A] border border-[#00FF66]/40 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-[#FFD700] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00FF66]" />
                <span>
                  {selectedOrderModal.customer_name} ({selectedOrderModal.phone})
                </span>
              </div>
              <div className="text-emerald-100">
                District: <strong>{selectedOrderModal.district}</strong> · Thana:{' '}
                <strong>{selectedOrderModal.thana}</strong>
              </div>
              <div className="text-white">
                Village / House: <strong>{selectedOrderModal.village}</strong>
              </div>
              <div className="text-emerald-300">
                Total: ৳{selectedOrderModal.total_amount.toLocaleString()} (
                {selectedOrderModal.payment_method})
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#FFD700] text-[#021A0A] font-display font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL C: CREATE NEW ORDER MODAL
         ==================================================================== */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#04240B] border-2 border-[#FFD700] rounded-2xl max-w-lg w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-3">
              <h2 className="text-base font-display font-black text-[#FFD700]">
                Create New Order (Supabase orders)
              </h2>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-emerald-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="space-y-3 text-xs">
              <input
                type="text"
                required
                value={newOrdCustomer}
                onChange={(e) => setNewOrdCustomer(e.target.value)}
                placeholder="Customer Name"
                className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
              />
              <input
                type="tel"
                required
                value={newOrdPhone}
                onChange={(e) => setNewOrdPhone(e.target.value)}
                placeholder="Phone Number (017XXXXXXXX)"
                className="w-full px-3 py-2.5 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white font-mono"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={newOrdDistrict}
                  onChange={(e) => setNewOrdDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                />
                <input
                  type="text"
                  required
                  value={newOrdThana}
                  onChange={(e) => setNewOrdThana(e.target.value)}
                  placeholder="Thana"
                  className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                />
                <input
                  type="text"
                  required
                  value={newOrdVillage}
                  onChange={(e) => setNewOrdVillage(e.target.value)}
                  placeholder="Village"
                  className="w-full px-3 py-2 rounded-xl bg-[#021A0A] border border-[#00FF66]/50 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#FFD700] text-[#021A0A] font-display font-black cursor-pointer"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
