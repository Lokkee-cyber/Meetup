import { useEffect, useState } from 'react';
import { 
  Search, 
  LocationOn, 
  CreditCard, 
  ContentCopy, 
  Email, 
  ArrowBack,
  FilterList,
  Shield,
  Star,
  VerifiedUser
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import mockProfiles from './data/mockProfiles';

const ethnicities = ['All', 'Latin', 'Asian', 'Mixed', 'African American'];
const hairColors = ['All', 'Blonde', 'Brunette', 'Black', 'Red', 'Auburn'];
const ages = ['All', '18-22', '23-26', '27-30', '31+'];
const rates = ['All', 'Under $300', '$300-$500', '$500-$700', '$700+'];
const categoryOptions = [
  { label: 'All', value: 'All' },
  { label: 'Women', value: 'Straight Women' },
  { label: 'Men', value: 'Straight Men' },
  { label: 'Gay', value: 'Gay Men' },
  { label: 'Lesbian', value: 'Lesbian Women' },
];

const CASHAPP_ACCOUNT = '$meetup123';
const PAYPAL_ACCOUNT = 'meetup@paypal.com';
const BTC_ADDRESS = 'bc1qgxp7rx9793c4660j4t4se8djup6uyjjl9tv456d';
const ORGANIZATION_EMAIL = 'halliehallie169@gmail.com';

const colors = {
  primary: '#ec4899',
  primaryLight: '#fbcfe8',
  primaryDark: '#db2777',
  secondary: '#8b5cf6',
  success: '#10b981',
  verified: '#3b82f6',
  dark: '#1f2937',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  grayLighter: '#e5e7eb',
  background: '#fdf2f8',
  white: '#ffffff',
};

const styles = {
  app: { minHeight: '100vh', background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { position: 'sticky', top: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', zIndex: 1000, borderBottom: '1px solid #f3f4f6' },
  headerContent: { maxWidth: 1400, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  tagline: { fontSize: 12, color: colors.gray, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 },
  searchContainer: { flex: 1, maxWidth: 500, position: 'relative' },
  searchInput: { width: '100%', padding: '14px 20px 14px 50px', borderRadius: 50, border: '2px solid #e5e7eb', backgroundColor: '#f9fafb', fontSize: 14, outline: 'none', transition: 'all 0.3s' },
  searchIcon: { position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' },
  filterBtn: { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, border: 'none', padding: '12px 24px', borderRadius: 50, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)' },
  heroSection: { background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)', padding: '40px 40px', borderBottom: '1px solid #f3f4f6' },
  heroContent: { maxWidth: 1400, margin: '0 auto', textAlign: 'center' },
  heroTitle: { fontSize: 32, fontWeight: 800, color: '#111827', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#4b5563', marginBottom: 24 },
  categoryTabs: { display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 26 },
  categoryTab: { padding: '10px 20px', borderRadius: 9999, border: '2px solid #f3f4f6', backgroundColor: colors.white, color: '#4b5563', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
  categoryTabActive: { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', borderColor: '#db2777', color: colors.white, boxShadow: '0 6px 16px rgba(236, 72, 153, 0.25)' },
  heroStats: { display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statNumber: { fontSize: 28, fontWeight: 800, color: colors.primary },
  statLabel: { fontSize: 13, color: '#6b7280' },
  mainContainer: { maxWidth: 1400, margin: '0 auto', padding: '40px' },
  resultsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, padding: '20px 24px', backgroundColor: colors.white, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  resultsTitle: { fontSize: 18, fontWeight: 700, color: '#1f2937', margin: 0 },
  sortSelect: { padding: '10px 16px', borderRadius: 12, border: '2px solid #e5e7eb', fontSize: 14, cursor: 'pointer', backgroundColor: colors.white, fontWeight: 500, color: '#374151' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 28 },
  card: { backgroundColor: colors.white, borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', border: '1px solid #f3f4f6' },
  cardImageContainer: { position: 'relative', height: 320, overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' },
  cardBadges: { position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  featuredTag: { padding: '6px 14px', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, borderRadius: 50, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  verifiedTag: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: colors.white, borderRadius: 50, fontSize: 11, fontWeight: 600 },
  availabilityTag: { position: 'absolute', bottom: 16, left: 16, padding: '6px 14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: colors.white, borderRadius: 50, fontSize: 11, fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' },
  cardBody: { padding: 24 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 700, margin: '0 0 4px 0', color: '#111827' },
  location: { fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 },
  price: { textAlign: 'right' },
  priceAmount: { fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  priceUnit: { fontSize: 12, color: '#6b7280' },
  rating: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  ratingText: { fontWeight: 700, fontSize: 14, color: '#1f2937' },
  reviewsText: { color: '#6b7280', fontSize: 13 },
  services: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  serviceTag: { backgroundColor: '#fdf2f8', color: '#db2777', padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 600 },
  cardActions: { display: 'flex', gap: 12 },
  viewBtn: { flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #ec4899', backgroundColor: 'transparent', color: colors.primary, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.3s' },
  bookBtn: { flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)' },
  filterOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 2000 },
  filterSidebar: { position: 'fixed', top: 0, right: 0, width: 420, height: '100%', backgroundColor: colors.white, boxShadow: '-10px 0 40px rgba(0,0,0,0.15)', zIndex: 2001, overflowY: 'auto' },
  filterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #f3f4f6' },
  filterTitle: { fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' },
  filterSection: { marginBottom: 28 },
  filterLabel: { fontSize: 14, fontWeight: 700, marginBottom: 14, color: '#1f2937' },
  filterChips: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  filterChip: { padding: '10px 18px', borderRadius: 50, border: '2px solid #e5e7eb', backgroundColor: colors.white, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#4b5563', transition: 'all 0.2s' },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary, color: colors.white, boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' },
  filterActions: { display: 'flex', gap: 12, padding: 24, borderTop: '1px solid #f3f4f6', position: 'sticky', bottom: 0, background: colors.white },
  clearBtn: { flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #e5e7eb', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: '#4b5563' },
  applyBtn: { flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, cursor: 'pointer', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 2000, padding: 40, overflowY: 'auto' },
  modalContent: { backgroundColor: colors.white, borderRadius: 24, maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f3f4f6' },
  modalTitle: { fontSize: 28, fontWeight: 800, margin: 0, color: '#111827' },
  closeBtn: { background: '#f3f4f6', border: 'none', width: 40, height: 40, borderRadius: 12, fontSize: 20, cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBody: { padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 },
  modalImage: { width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 400 },
  modalDetails: { padding: '0 0' },
  modalSection: { marginBottom: 24 },
  modalSectionTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280', marginBottom: 12 },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  detailLabel: { color: '#6b7280', fontSize: 14, fontWeight: 500 },
  detailValue: { fontWeight: 700, fontSize: 14, color: '#1f2937' },
  modalActions: { display: 'flex', gap: 16, padding: '24px 32px', borderTop: '1px solid #f3f4f6' },
  modalBookBtn: { flex: 1, padding: '16px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)' },
  paymentContainer: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 40, background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4f46e5 100%)', position: 'relative', overflow: 'hidden', paddingTop: 60 },
  paymentBgPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 40%)', pointerEvents: 'none' },
  paymentCard: { background: colors.white, borderRadius: 24, maxWidth: 480, width: '100%', padding: 40, boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)', position: 'relative', zIndex: 1, marginTop: 40 },
  paymentHeader: { textAlign: 'center', marginBottom: 32 },
  paymentIcon: { width: 80, height: 80, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32, fontWeight: 800, color: colors.white, background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
  paymentTitle: { fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#111827' },
  paymentSubtitle: { color: '#6b7280', fontSize: 15, margin: 0 },
  paymentOption: { display: 'flex', alignItems: 'center', padding: 20, borderRadius: 16, border: '2px solid #e5e7eb', marginBottom: 14, cursor: 'pointer', transition: 'all 0.3s', backgroundColor: colors.white },
  paymentOptionSelected: { borderColor: colors.primary, backgroundColor: 'rgba(236, 72, 153, 0.05)' },
  paymentOptionIcon: { width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16, fontSize: 22, fontWeight: 700, color: colors.white },
  paymentOptionInfo: { flex: 1 },
  paymentOptionTitle: { fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0 },
  paymentOptionDesc: { fontSize: 13, color: '#6b7280', margin: '4px 0 0' },
  accountModalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: 20 },
  accountModalContent: { backgroundColor: colors.white, borderRadius: 24, maxWidth: 440, width: '100%', padding: 36, boxShadow: '0 25px 80px rgba(0,0,0,0.3)', position: 'relative' },
  accountModalHeader: { textAlign: 'center', marginBottom: 28 },
  accountModalIcon: { width: 72, height: 72, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28, fontWeight: 800, color: colors.white },
  accountModalTitle: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#111827' },
  accountModalSubtitle: { color: '#6b7280', fontSize: 14, margin: 0 },
  accountModalBody: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 20, marginBottom: 20 },
  accountModalLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#6b7280', marginBottom: 8, textAlign: 'center' },
  accountModalValue: { fontSize: 18, fontWeight: 700, color: '#111827', fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center' },
  accountModalSummary: { backgroundColor: '#fff7fb', borderRadius: 16, padding: 20, margin: '0 0 16px', border: '1px solid #f3e0f9' },
  accountModalSummaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  accountModalSummaryLabel: { fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: '#6b7280' },
  accountModalSummaryValue: { fontSize: 15, fontWeight: 700, color: '#111827' },
  accountInstructionList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  accountInstruction: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', borderRadius: 12, backgroundColor: '#fff5f9', border: '1px solid #ffe4f3' },
  accountInstructionIndex: { width: 30, height: 30, borderRadius: 9999, backgroundColor: '#ffe4f3', color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  accountInstructionText: { fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 },
  copyButton: { background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, border: 'none', padding: '16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 15, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(236, 72, 153, 0.3)', marginBottom: 16 },
  accountModalClose: { position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', width: 32, height: 32, borderRadius: 10, fontSize: 18, cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  amountBox: { backgroundColor: '#fdf2f8', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, border: '2px solid rgba(236, 72, 153, 0.2)' },
  amountLabel: { fontSize: 14, color: '#4b5563', fontWeight: 600 },
  amountValue: { fontSize: 32, fontWeight: 800, color: colors.primary },
  submitBtn: { width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: colors.white, cursor: 'pointer', fontWeight: 700, fontSize: 16, boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)' },
  footer: { backgroundColor: '#111827', color: '#d1d5db', padding: '60px 40px 30px', marginTop: 80 },
  footerContent: { maxWidth: 1200, margin: '0 auto' },
  footerGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 },
  footerLogo: { fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16, display: 'inline-block' },
  footerText: { color: '#9ca3af', fontSize: 14, lineHeight: 1.7 },
  footerTitle: { fontSize: 14, fontWeight: 700, marginBottom: 18, color: colors.white, textTransform: 'uppercase', letterSpacing: 0.5 },
  footerLink: { color: '#9ca3af', fontSize: 14, display: 'block', marginBottom: 12, cursor: 'pointer', textDecoration: 'none' },
  footerBottom: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center', color: '#6b7280', fontSize: 13 },
  snackbar: { position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1f2937', color: colors.white, padding: '14px 28px', borderRadius: 12, zIndex: 4000, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', fontWeight: 600 },
  bookingHeader: { background: 'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)', padding: 24, borderRadius: 16, marginBottom: 24 },
  bookingPrice: { fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
  bookingSubtitle: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  bookingSummary: { backgroundColor: '#fdf2f8', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid #f3f4f6' },
  bookingSummaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  bookingSummaryLabel: { fontSize: 11, letterSpacing: 0.5, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 },
  bookingSummaryValue: { fontSize: 15, fontWeight: 700, color: '#111827' },
  bookingForm: { display: 'flex', flexDirection: 'column' },
  bookingFooterNote: { fontSize: 13, color: '#6b7280', marginTop: 12 },
};

function StarRating({ rating }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(<span key={i} style={{ color: i < Math.floor(rating) ? '#fbbf24' : '#e5e7eb', fontSize: 14 }}>★</span>);
  }
  return <span style={{ display: 'flex', gap: 2 }}>{stars}</span>;
}

function App() {
  const navigate = useNavigate();
  const [profiles] = useState(mockProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filters, setFilters] = useState({ ethnicity: 'All', hairColor: 'All', age: 'All', rate: 'All', verified: false, available: false });
  const [sortBy, setSortBy] = useState('rating');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', date: 'Flexible', duration: '1 hour', notes: '', agreeToTerms: false });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountModalMethod, setAccountModalMethod] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const applyFilters = () => {
    let result = [...profiles];
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.location.toLowerCase().includes(query));
    }
    if (filters.ethnicity !== 'All') result = result.filter(p => p.ethnicity === filters.ethnicity);
    if (filters.hairColor !== 'All') result = result.filter(p => p.hairColor.includes(filters.hairColor));
    if (filters.age !== 'All') {
      const [minAge, maxAge] = filters.age === '31+' ? [31, 100] : filters.age.split('-').map(Number);
      result = result.filter(p => p.age >= minAge && p.age <= maxAge);
    }
    if (filters.rate !== 'All') {
      const rateRanges = { 'Under $300': [0, 300], '$300-$500': [300, 500], '$500-$700': [500, 700], '$700+': [700, 10000] };
      const [minRate, maxRate] = rateRanges[filters.rate];
      result = result.filter(p => p.rate >= minRate && p.rate < maxRate);
    }
    if (filters.verified) result = result.filter(p => p.verified);
    if (filters.available) result = result.filter(p => p.availability.includes('Available'));
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviews - a.reviews;
        case 'price_low': return a.rate - b.rate;
        case 'price_high': return b.rate - a.rate;
        default: return 0;
      }
    });
    setFilteredProfiles(result);
  };

  useEffect(() => {
    applyFilters();
  }, [profiles, searchQuery, filters, sortBy, selectedCategory]);

  const handleFilterChange = (key, value) => { setFilters({ ...filters, [key]: value }); };
  const clearFilters = () => { setFilters({ ethnicity: 'All', hairColor: 'All', age: 'All', rate: 'All', verified: false, available: false }); setSearchQuery(''); setSelectedCategory('All'); };
  const handleSearch = (e) => { setSearchQuery(e.target.value); };
  const handleViewProfile = (profile) => { setSelectedProfile(profile); setDetailsOpen(true); };
  const handleOrder = (profile) => { setSelectedProfile(profile); setOrderOpen(true); };
  const handleSubmitOrder = () => {
    if (!orderForm.name.trim() || !orderForm.email.trim() || !orderForm.agreeToTerms) {
      setSnackbar({ open: true, message: 'Please fill in all required fields' });
      return;
    }

    if (!selectedProfile) {
      setSnackbar({ open: true, message: 'No profile selected for booking' });
      return;
    }

    setOrderOpen(false);
    navigate('/payment-method', {
      state: {
        profile: selectedProfile,
        hours: orderForm.duration,
        customer: {
          name: orderForm.name,
          email: orderForm.email,
          phone: orderForm.phone,
          date: orderForm.date,
          notes: orderForm.notes,
        },
      },
    });
  };
  const getPaymentTotal = () => { if (!selectedProfile) return 0; const hours = parseInt(orderForm.duration) || 1; return selectedProfile.rate * hours; };
  const getMethodConfig = (method) => ({ paypal: { name: 'PayPal', color: '#0070ba', icon: 'P', desc: 'Pay with your PayPal account' }, cashapp: { name: 'Cash App', color: '#00d632', icon: '$', desc: 'Pay with Cash App' }, bitcoin: { name: 'Bitcoin', color: '#f7931a', icon: '₿', desc: 'Send cryptocurrency' } }[method] || { name: 'Bitcoin', color: '#f7931a', icon: '₿', desc: 'Send cryptocurrency' });
  const getAccountDetails = (method) => { switch (method) { case 'cashapp': return CASHAPP_ACCOUNT; case 'paypal': return PAYPAL_ACCOUNT; case 'bitcoin': return BTC_ADDRESS; default: return ''; } };
  const handlePaymentClick = (method) => { setSelectedPaymentMethod(method); setAccountModalMethod(method); setShowAccountModal(true); };
  const handleCopyAccount = () => {
    const details = getAccountDetails(accountModalMethod);
    if (!details) return;
    navigator.clipboard.writeText(details);
    setCopiedAccount(true);
    setSnackbar({ open: true, message: 'Account details copied!' });
    setTimeout(() => setSnackbar({ open: false, message: '' }), 2000);
    setTimeout(() => setCopiedAccount(false), 1800);
  };
  const handlePaymentSubmit = () => {
    if (!selectedPaymentMethod) { setSnackbar({ open: true, message: 'Please select a payment method' }); return; }
    const subject = encodeURIComponent(`Payment Proof - Booking with ${selectedProfile?.name}`);
    const body = encodeURIComponent(`Hello,\n\nI have made a payment for my booking.\n\nCompanion: ${selectedProfile?.name}\nAmount: $${getPaymentTotal()}\nPayment Method: ${getMethodConfig(selectedPaymentMethod).name}\nDate: ${orderForm.date}\nDuration: ${orderForm.duration}\n\nPlease find my payment proof attached.\n\nThank you.`);
    window.open(`mailto:${ORGANIZATION_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setSnackbar({ open: true, message: 'Gmail opened! Please send payment proof.' });
    setTimeout(() => { setShowPayment(false); setSelectedPaymentMethod(null); setOrderForm({ name: '', email: '', phone: '', date: 'Flexible', duration: '1 hour', notes: '', agreeToTerms: false }); setCopiedAccount(false); setSnackbar({ open: false, message: '' }); }, 2000);
  };

  const activePaymentMethodName = accountModalMethod ? getMethodConfig(accountModalMethod).name : 'selected payment method';
  const paymentSteps = [
    `Copy the ${activePaymentMethodName} details and send the exact amount requested (including any gratuity).`,
    'Capture a screenshot or confirmation once the transaction completes for your records.',
    'Tap “I\'ve Made Payment” to open your inbox with a pre-composed email so you can attach proof right away.'
  ];

  const filterCount = Object.values(filters).filter(v => v !== 'All' && v !== false).length;
  const orderReady = orderForm.name.trim() && orderForm.email.trim() && orderForm.agreeToTerms;

  if (showPayment) {
    return (
      <div style={styles.app}>
        <div style={styles.paymentContainer}>
          <div style={styles.paymentBgPattern} />
          <div style={styles.paymentCard} className="payment-card">
            <IconButton onClick={() => { setShowPayment(false); setSelectedPaymentMethod(null); }} style={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#f3f4f6', padding: 8 }} className="back-button">
              <ArrowBack style={{ color: '#374151' }} />
            </IconButton>
            <div style={styles.paymentHeader} className="payment-header">
              <div style={styles.paymentIcon} className="payment-icon"><CreditCard style={{ color: colors.white, fontSize: 32 }} /></div>
              <h2 style={styles.paymentTitle} className="payment-title">Complete Your Booking</h2>
              <p style={styles.paymentSubtitle} className="payment-subtitle">with {selectedProfile?.name}</p>
            </div>
            {selectedProfile && (
              <div style={styles.amountBox} className="total-amount">
                <span style={styles.amountLabel} className="amount-label">Total Amount</span>
                <span style={styles.amountValue} className="amount-value">${getPaymentTotal()}</span>
              </div>
            )}
            <div className="payment-methods">
              {['paypal', 'cashapp', 'bitcoin'].map((method) => {
                const config = getMethodConfig(method);
                return (
                  <div 
                    key={method} 
                    style={{ ...styles.paymentOption, ...(selectedPaymentMethod === method ? styles.paymentOptionSelected : {}) }} 
                    className={`payment-option ${selectedPaymentMethod === method ? 'selected' : ''}`}
                    onClick={() => handlePaymentClick(method)}
                  >
                    <div style={{ ...styles.paymentOptionIcon, backgroundColor: config.color }} className="method-icon">
                      {config.icon === 'P' ? <Email style={{ color: colors.white }} /> : <span style={{ color: colors.white, fontSize: 24, fontWeight: 700 }}>{config.icon}</span>}
                    </div>
                    <div style={styles.paymentOptionInfo} className="method-info">
                      <h4 style={styles.paymentOptionTitle}>{config.name}</h4>
                      <p style={styles.paymentOptionDesc}>{config.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {showAccountModal && accountModalMethod && (
            <div style={styles.accountModalOverlay} className="account-modal" onClick={() => { setShowAccountModal(false); setCopiedAccount(false); }}>
            <div style={styles.accountModalContent} className="account-content" onClick={(e) => e.stopPropagation()}>
              <button style={styles.accountModalClose} className="account-close" onClick={() => { setShowAccountModal(false); setCopiedAccount(false); }}>×</button>
                <div style={styles.accountModalHeader} className="account-header">
                  <div style={{ ...styles.accountModalIcon, backgroundColor: getMethodConfig(accountModalMethod).color }} className="account-icon">
                    {accountModalMethod === 'paypal' ? <Email style={{ color: colors.white, fontSize: 28 }} /> : <span style={{ color: colors.white, fontSize: 28, fontWeight: 700 }}>{getMethodConfig(accountModalMethod).icon}</span>}
                  </div>
                  <h3 style={styles.accountModalTitle} className="account-title">{getMethodConfig(accountModalMethod).name}</h3>
                  <p style={styles.accountModalSubtitle} className="account-subtitle">Send payment to this account</p>
                </div>
                <div style={styles.accountModalSummary} className="account-summary">
                  <div style={styles.accountModalSummaryRow}>
                    <span style={styles.accountModalSummaryLabel}>Companion</span>
                    <span style={styles.accountModalSummaryValue}>{selectedProfile?.name}</span>
                  </div>
                  <div style={styles.accountModalSummaryRow}>
                    <span style={styles.accountModalSummaryLabel}>Duration</span>
                    <span style={styles.accountModalSummaryValue}>{orderForm.duration}</span>
                  </div>
                  <div style={styles.accountModalSummaryRow}>
                    <span style={styles.accountModalSummaryLabel}>Location</span>
                    <span style={styles.accountModalSummaryValue}>{selectedProfile?.location?.split(',')[0]}</span>
                  </div>
                </div>
                <div style={styles.accountModalBody} className="account-detail-box">
                  <p style={styles.accountModalLabel} className="account-detail-label">Amount to Pay</p>
                  <div style={styles.accountModalValue} className="account-detail-value">
                    <span style={{ fontSize: 28, color: colors.primary, fontWeight: 800 }}>${getPaymentTotal()}</span>
                  </div>
                </div>
                <div style={{ ...styles.accountModalBody, marginTop: 16 }} className="account-detail-box">
                  <p style={styles.accountModalLabel} className="account-detail-label">Account Details</p>
                  <div style={styles.accountModalValue} className="account-detail-value">{getAccountDetails(accountModalMethod)}</div>
                </div>
                <div style={styles.accountInstructionList} className="account-instructions">
                  {paymentSteps.map((step, idx) => (
                    <div key={step} style={styles.accountInstruction} className="account-instruction">
                      <span style={styles.accountInstructionIndex}>{idx + 1}</span>
                      <p style={styles.accountInstructionText}>{step}</p>
                    </div>
                  ))}
                </div>
                <button style={styles.copyButton} className="copy-button" onClick={handleCopyAccount}>
                  <ContentCopy style={{ fontSize: 18 }} /> {copiedAccount ? 'Details copied!' : 'Copy Account Details'}
                </button>
                <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 1.6, marginBottom: 16 }} className="instructions">After completing the steps above, tap "I've Made Payment" to open your inbox with a pre-filled email for uploading proof.</p>
                <button style={styles.submitBtn} className="submit-button" onClick={handlePaymentSubmit}><Email style={{ marginRight: 8 }} /> I've Made Payment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header} className="app-header">
        <div style={styles.headerContent} className="header-container">
          <div style={styles.logoWrapper} className="logo-section">
            <h1 style={styles.logo} className="logo">Meetup</h1>
            <span style={styles.tagline} className="logo-subtitle">Premium Companion Network</span>
          </div>
          <div style={styles.searchContainer} className="search-section">
            <div style={{ position: 'relative' }} className="search-wrapper">
              <Search style={styles.searchIcon} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                value={searchQuery} 
                onChange={handleSearch} 
                style={styles.searchInput} 
                className="search-input"
                onFocus={(e) => { e.target.style.borderColor = colors.primary; e.target.style.backgroundColor = colors.white; }}
                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#f9fafb'; }}
              />
            </div>
          </div>
          <div className="header-actions">
            <button style={{ ...styles.filterBtn, backgroundColor: filterCount > 0 ? colors.secondary : styles.filterBtn.background }} className="filter-button" onClick={() => setFilterOpen(true)}>
              <FilterList /> Filters {filterCount > 0 && `(${filterCount})`}
            </button>
          </div>
        </div>
      </header>

      <section style={styles.heroSection} className="hero-section">
        <div style={styles.heroContent} className="hero-content">
          <h2 style={styles.heroTitle} className="hero-title">Find Your Perfect Companion</h2>
          <p style={styles.heroSubtitle} className="hero-subtitle">Safe, secure, and verified connections with premium companions across the USA</p>
          <div style={styles.categoryTabs} className="category-tabs">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                style={{
                  ...styles.categoryTab,
                  ...(selectedCategory === option.value ? styles.categoryTabActive : {}),
                }}
                className={`category-tab ${selectedCategory === option.value ? 'active' : ''}`}
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div style={styles.heroStats} className="hero-stats">
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber} className="stat-number">500+</div>
              <div style={styles.statLabel} className="stat-label">Verified Members</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber} className="stat-number">98%</div>
              <div style={styles.statLabel} className="stat-label">Satisfaction Rate</div>
            </div>
            <div style={styles.statItem} className="stat-item">
              <div style={styles.statNumber} className="stat-number">24/7</div>
              <div style={styles.statLabel} className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <main style={styles.mainContainer} className="main-content">
        <div style={styles.resultsBar} className="results-bar">
          <h2 style={styles.resultsTitle} className="results-count">{filteredProfiles.length} Companions Available</h2>
          <select style={styles.sortSelect} className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviewed</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
        <div style={styles.grid} className="profiles-grid">
          {filteredProfiles.map((profile) => (
            <div 
              key={profile.id} 
              style={styles.card} 
              className="profile-card"
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; e.currentTarget.style.borderColor = colors.primaryLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'; e.currentTarget.style.borderColor = '#f3f4f6'; }}
            >
              <div style={styles.cardImageContainer} className="card-image-container">
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  style={styles.cardImage} 
                  className="card-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }} 
                />
                <div style={styles.cardBadges} className="card-badges">
                  {profile.featured && <span style={styles.featuredTag} className="featured-tag">Featured</span>}
                  {profile.verified && (
                    <span style={styles.verifiedTag} className="verified-tag">
                      <VerifiedUser style={{ fontSize: 12 }} /> Verified
                    </span>
                  )}
                </div>
                <span style={styles.availabilityTag} className="availability-tag">{profile.availability}</span>
              </div>
              <div style={styles.cardBody} className="card-body">
                <div style={styles.cardHeader} className="card-header">
                  <div>
                    <h3 style={styles.name} className="profile-name">{profile.name}, {profile.age}</h3>
                    <p style={styles.location} className="profile-location">
                      <LocationOn style={{ fontSize: 14 }} /> {profile.location}
                    </p>
                  </div>
                  <div style={styles.price} className="profile-price">
                    <p style={styles.priceAmount} className="price-amount">${profile.rate}</p>
                    <p style={styles.priceUnit} className="price-unit">/ {profile.rateUnit}</p>
                  </div>
                </div>
                <div style={styles.rating} className="card-rating">
                  <StarRating rating={profile.rating} />
                  <span style={styles.ratingText} className="rating-value">{profile.rating}</span>
                  <span style={styles.reviewsText} className="reviews-count">({profile.reviews} reviews)</span>
                </div>
                <div style={styles.services} className="card-services">
                  {profile.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} style={styles.serviceTag} className="service-tag">{service}</span>
                  ))}
                </div>
                <div style={styles.cardActions} className="card-actions">
                  <button 
                    style={styles.viewBtn} 
                    className="btn-view"
                    onClick={() => handleViewProfile(profile)}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = colors.primary; e.target.style.color = colors.white; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.primary; }}
                  >
                    View Profile
                  </button>
                  <button 
                    style={styles.bookBtn} 
                    className="btn-book"
                    onClick={() => handleOrder(profile)}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.02)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {filterOpen && (
        <>
          <div style={styles.filterOverlay} className="filter-overlay" onClick={() => setFilterOpen(false)} />
          <div style={styles.filterSidebar} className="filter-drawer">
            <div style={styles.filterHeader} className="filter-header">
              <h2 style={styles.filterTitle} className="filter-title">Filters</h2>
              <button style={styles.closeBtn} className="close-btn" onClick={() => setFilterOpen(false)}>×</button>
            </div>
            <div style={{ padding: 24 }} className="filter-content">
              {[{ label: 'Ethnicity', options: ethnicities, key: 'ethnicity' }, { label: 'Hair Color', options: hairColors, key: 'hairColor' }, { label: 'Age', options: ages, key: 'age' }, { label: 'Rate', options: rates, key: 'rate' }].map(({ label, options, key }) => (
                <div key={key} style={styles.filterSection} className="filter-group">
                  <p style={styles.filterLabel} className="filter-label">{label}</p>
                  <div style={styles.filterChips} className="filter-chips">
                    {options.map(opt => (
                      <button 
                        key={opt} 
                        style={{ ...styles.filterChip, ...(filters[key] === opt ? styles.filterChipActive : {}) }}
                        className={`chip ${filters[key] === opt ? 'active' : ''}`}
                        onClick={() => handleFilterChange(key, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={styles.filterSection} className="filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 0' }} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={filters.verified} 
                    onChange={(e) => handleFilterChange('verified', e.target.checked)} 
                    style={{ width: 20, height: 20, accentColor: colors.primary }} 
                  />
                  <span style={{ fontWeight: 600, color: '#1f2937' }}>Verified Only</span>
                </label>
              </div>
              <div style={styles.filterSection} className="filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 0' }} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={filters.available} 
                    onChange={(e) => handleFilterChange('available', e.target.checked)} 
                    style={{ width: 20, height: 20, accentColor: colors.primary }} 
                  />
                  <span style={{ fontWeight: 600, color: '#1f2937' }}>Available Now</span>
                </label>
              </div>
            </div>
            <div style={styles.filterActions} className="filter-actions">
              <button style={styles.clearBtn} className="btn-clear" onClick={clearFilters}>Clear All</button>
              <button style={styles.applyBtn} className="btn-apply" onClick={() => setFilterOpen(false)}>Apply Filters</button>
            </div>
          </div>
        </>
      )}

      {detailsOpen && selectedProfile && (
        <div style={styles.modalOverlay} className="modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div style={styles.modalContent} className="modal-content profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader} className="modal-header">
              <h2 style={styles.modalTitle} className="modal-title">{selectedProfile.name}, {selectedProfile.age}</h2>
              <button style={styles.closeBtn} className="close-btn" onClick={() => setDetailsOpen(false)}>×</button>
            </div>
            <div style={styles.modalBody} className="modal-body">
              <div>
                <img 
                  src={selectedProfile.image} 
                  alt={selectedProfile.name} 
                  style={styles.modalImage} 
                  className="modal-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=No+Image'; }} 
                />
              </div>
              <div style={styles.modalDetails} className="modal-details">
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LocationOn style={{ fontSize: 16 }} /> {selectedProfile.location}
                </p>
                <div style={{ display: 'flex', gap: 40, marginBottom: 24 }}>
                  <div>
                    <p style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>${selectedProfile.rate}</p>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>/ {selectedProfile.rateUnit}</p>
                  </div>
                  <div>
                    <div style={styles.rating} className="card-rating">
                      <StarRating rating={selectedProfile.rating} />
                      <span style={styles.ratingText} className="rating-value">{selectedProfile.rating}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>{selectedProfile.reviews} reviews</p>
                  </div>
                </div>
                <div style={styles.modalSection} className="detail-section">
                  <p style={styles.modalSectionTitle} className="detail-section-title">About Me</p>
                  <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7 }}>{selectedProfile.about}</p>
                </div>
                <div style={styles.modalSection} className="detail-section">
                  <p style={styles.modalSectionTitle} className="detail-section-title">Personal Details</p>
                  {[
                    { label: 'Height', value: selectedProfile.height },
                    { label: 'Weight', value: selectedProfile.weight },
                    { label: 'Measurements', value: selectedProfile.measurements },
                    { label: 'Ethnicity', value: selectedProfile.ethnicity },
                    { label: 'Hair', value: selectedProfile.hairColor },
                    { label: 'Eyes', value: selectedProfile.eyeColor },
                    { label: 'Languages', value: selectedProfile.languages.join(', ') }
                  ].map((row, idx) => (
                    <div key={idx} style={styles.detailRow} className="detail-row">
                      <span style={styles.detailLabel} className="detail-label">{row.label}</span>
                      <span style={styles.detailValue} className="detail-value">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.modalSection} className="detail-section">
                  <p style={styles.modalSectionTitle} className="detail-section-title">Services</p>
                  <div style={styles.services} className="card-services">
                    {selectedProfile.services.map((service, idx) => (
                      <span key={idx} style={{ ...styles.serviceTag, backgroundColor: '#fdf2f8', color: '#db2777' }} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.modalActions} className="modal-actions">
              <button 
                style={{ ...styles.viewBtn, flex: 'none', padding: '12px 24px' }} 
                className="btn-close"
                onClick={() => setDetailsOpen(false)}
              >
                Close
              </button>
              <button 
                style={styles.modalBookBtn} 
                className="btn-book-now"
                onClick={() => { setDetailsOpen(false); handleOrder(selectedProfile); }}
              >
                Book Now - ${selectedProfile.rate}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderOpen && selectedProfile && (
        <div style={styles.modalOverlay} className="modal-overlay booking-modal" onClick={() => setOrderOpen(false)}>
          <div style={{ ...styles.modalContent, maxWidth: 560 }} className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader} className="modal-header">
              <h2 style={styles.modalTitle} className="modal-title">Book {selectedProfile.name}</h2>
              <button style={styles.closeBtn} className="close-btn" onClick={() => setOrderOpen(false)}>×</button>
            </div>
            <div style={{ padding: 32 }}>
              <div style={styles.bookingHeader} className="booking-header">
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 6px' }}>Booking Details</p>
                <p style={styles.bookingPrice} className="booking-price">${selectedProfile.rate} / hour</p>
                <p style={styles.bookingSubtitle} className="booking-subtitle">{selectedProfile.name}, {selectedProfile.age} • {selectedProfile.location}</p>
              </div>
              <form id="booking-form" style={styles.bookingForm} onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }}>
                <div style={styles.bookingSummary}>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Companion</span>
                    <span style={styles.bookingSummaryValue}>{selectedProfile.name}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Location</span>
                    <span style={styles.bookingSummaryValue}>{selectedProfile.location.split(',')[0]}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Duration</span>
                    <span style={styles.bookingSummaryValue}>{orderForm.duration}</span>
                  </div>
                  <div style={styles.bookingSummaryRow}>
                    <span style={styles.bookingSummaryLabel}>Rate</span>
                    <span style={styles.bookingSummaryValue}>${selectedProfile.rate} / hour</span>
                  </div>
                </div>
                {[
                  { placeholder: 'Your Name *', key: 'name' },
                  { placeholder: 'Email Address *', key: 'email' },
                  { placeholder: 'Phone Number', key: 'phone' }
                ].map(({ placeholder, key }) => (
                  <input
                    key={key}
                    type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                    placeholder={placeholder}
                    value={orderForm[key]}
                    onChange={(e) => setOrderForm({ ...orderForm, [key]: e.target.value })}
                    style={{ ...styles.searchInput, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px' }}
                    className="form-input"
                  />
                ))}
                <select
                  value={orderForm.duration}
                  onChange={(e) => setOrderForm({ ...orderForm, duration: e.target.value })}
                  style={{ ...styles.searchInput, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px', background: colors.white }}
                  className="form-select"
                >
                  <option value="1 hour">1 Hour - ${selectedProfile.rate}</option>
                  <option value="2 hours">2 Hours - ${selectedProfile.rate * 2}</option>
                  <option value="3 hours">3 Hours - ${selectedProfile.rate * 3}</option>
                  <option value="overnight">Overnight - ${selectedProfile.rate * 8}</option>
                </select>
                <textarea
                  placeholder="Additional Notes"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  style={{ ...styles.searchInput, minHeight: 100, marginBottom: 16, borderRadius: 12, border: '2px solid #e5e7eb', padding: '14px 16px' }}
                  className="form-textarea"
                />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginBottom: 12 }} className="terms-label">
                  <input
                    type="checkbox"
                    checked={orderForm.agreeToTerms}
                    onChange={(e) => setOrderForm({ ...orderForm, agreeToTerms: e.target.checked })}
                    style={{ marginTop: 4, width: 18, height: 18, accentColor: colors.primary }}
                  />
                  <span style={{ fontSize: 14, color: '#4b5563' }}>I understand that payment is required for booking appointments *</span>
                </label>
              </form>
              <p style={styles.bookingFooterNote}>A Meetup concierge will follow up within 12 hours to lock in the date and assist with any requests.</p>
            </div>
            <div style={styles.modalActions} className="modal-actions">
              <button 
                style={{ ...styles.viewBtn, flex: 1, borderRadius: 12 }} 
                className="btn-close"
                onClick={() => setOrderOpen(false)}
              >
                Cancel
              </button>
              <button 
                style={{ ...styles.modalBookBtn, flex: 1, borderRadius: 12, opacity: orderReady ? 1 : 0.6, cursor: orderReady ? 'pointer' : 'not-allowed' }} 
                className="btn-book-now"
                onClick={handleSubmitOrder}
                disabled={!orderReady}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {snackbar.open && <div style={styles.snackbar} className="snackbar">{snackbar.message}</div>}

      <footer style={styles.footer} className="app-footer">
        <div style={styles.footerContent} className="footer-content">
          <div style={styles.footerGrid} className="footer-grid">
            <div>
              <h3 style={styles.footerLogo} className="footer-logo">Meetup</h3>
              <p style={styles.footerText} className="footer-description">Premium companion network connecting discerning individuals with elegant companions. Your trust and satisfaction are our top priorities.</p>
            </div>
            <div>
              <h4 style={styles.footerTitle} className="footer-title">Quick Links</h4>
              <ul style={styles.footerLink} className="footer-links">
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</a></li>
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>Browse</a></li>
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle} className="footer-title">Support</h4>
              <ul style={styles.footerLink} className="footer-links">
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a></li>
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>FAQ</a></li>
                <li><a style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle} className="footer-title">Connect</h4>
              <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>WhatsApp: +1 234 567 8900</p>
              <p style={{ color: '#9ca3af', fontSize: 13 }}>Instagram: @meetup</p>
            </div>
          </div>
          <div style={styles.footerBottom} className="footer-bottom">
            © 2024 Meetup. All rights reserved. This is a demo application.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


