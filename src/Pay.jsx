import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CurrencyBitcoin from '@mui/icons-material/CurrencyBitcoin';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Payments from '@mui/icons-material/Payments';
import CreditCard from '@mui/icons-material/CreditCard';
import ArrowBack from '@mui/icons-material/ArrowBack';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const BTC_ADDRESS = 'bc1qgxp7rx9793c4660j4t4se8djup6uyjjl9tv456d';
const CASHAPP_ACCOUNT = '$meetup123';
const PAYPAL_ACCOUNT = 'meetup@paypal.com';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const methodConfig = {
  bitcoin: {
    name: 'Bitcoin',
    icon: CurrencyBitcoin,
    color: '#f7931a',
    bgColor: 'rgba(247, 147, 26, 0.1)',
    address: BTC_ADDRESS,
    label: 'Bitcoin Address',
  },
  cashapp: {
    name: 'CashApp',
    icon: AccountBalanceWallet,
    color: '#00d632',
    bgColor: 'rgba(0, 214, 50, 0.1)',
    address: CASHAPP_ACCOUNT,
    label: 'CashApp Tag',
  },
  paypal: {
    name: 'PayPal',
    icon: Payments,
    color: '#003087',
    bgColor: 'rgba(0, 48, 135, 0.1)',
    address: PAYPAL_ACCOUNT,
    label: 'PayPal Email',
  },
  card: {
    name: 'Credit/Debit Card',
    icon: CreditCard,
    color: '#667eea',
    bgColor: 'rgba(102, 126, 234, 0.1)',
    address: '',
    label: 'Card Payment',
  },
};

const Pay = () => {
  const navigate = useNavigate();
  const { method } = useParams();
  const { state } = useLocation();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [proofImage, setProofImage] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const { profile, hours, customer } = state || {};

  const getTotal = () => {
    if (!profile) return 0;
    const hourMap = {
      '1 hour': profile.rate || 500,
      '2 hours': (profile.rate || 500) * 2,
      '3 hours': (profile.rate || 500) * 3,
      overnight: (profile.rate || 500) * 8,
      weekend: (profile.rate || 500) * 24,
      hour: profile.rate || 500,
      twoHours: (profile.rate || 500) * 2,
      fullNight: (profile.rate || 500) * 8,
    };
    return hourMap[hours] || profile.rate || 500;
  };

  const total = getTotal();
  const requiresProof = ['bitcoin', 'cashapp', 'paypal'].includes(method);
  const requiresCard = method === 'card';

  const config = methodConfig[method] || methodConfig.bitcoin;
  const MethodIcon = config.icon;

  const copyAddress = () => {
    navigator.clipboard.writeText(config.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(total.toString());
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handlePayment = () => {
    if (!customer || !profile || !hours) {
      setError('Missing order details. Please restart checkout.');
      return;
    }
    setError('');
    if (requiresCard) {
      handleSubmitPayment();
      return;
    }

    // Prevent focus from remaining on an element that becomes aria-hidden.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setDetailsOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (requiresCard) {
      if (!cardDetails.cardholderName.trim()) {
        setError('Cardholder name is required.');
        return;
      }
      if (!cardDetails.cardNumber.trim()) {
        setError('Card number is required.');
        return;
      }
      if (!cardDetails.expiry.trim()) {
        setError('Card expiry is required.');
        return;
      }
      if (!cardDetails.cvv.trim()) {
        setError('Card CVV is required.');
        return;
      }
    }
    if (requiresProof && !proofImage) {
      setError('Please upload a payment screenshot.');
      return;
    }
    setError('');

    if (requiresProof) {
      // Prevent focus from staying on a hidden element while switching dialogs.
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      setDetailsOpen(false);
      setStatus('waiting');
      setTimeout(() => setStatusOpen(true), 200);
      
      try {
        // Create FormData to send image and data
        const formData = new FormData();
        formData.append('customerName', customer?.name || '');
        formData.append('customerEmail', customer?.email || '');
        formData.append('customerPhone', customer?.phone || '');
        formData.append('companionName', profile?.name || '');
        formData.append('duration', hours || '');
        formData.append('amount', total.toString());
        formData.append('paymentMethod', config.name);
        formData.append('date', customer?.date || 'Flexible');
        formData.append('notes', customer?.notes || '');
        
        // Convert base64 image to blob and append
        if (proofImage) {
          const response = await fetch(proofImage);
          const blob = await response.blob();
          const fileName = proofFileName || 'payment-screenshot.jpg';
          const file = new File([blob], fileName, { type: blob.type });
          formData.append('screenshot', file);
        }

        // Send to backend
        const result = await fetch(`${API_BASE_URL}/api/send-order`, {
          method: 'POST',
          body: formData
        });

        const contentType = result.headers.get('content-type') || '';
        let data = null;
        let textBody = '';

        if (contentType.includes('application/json')) {
          try {
            data = await result.json();
          } catch {
            data = null;
          }
        } else {
          textBody = await result.text();
        }

        if (!result.ok) {
          const normalizedText = textBody.trim();
          const isLikelyProxyBackendDown =
            result.status === 500 &&
            !data?.message &&
            !normalizedText;
          const isExternalRouterError = textBody.includes('ROUTER_EXTERNAL_TARGET_ERROR');
          const isUpstreamUnavailable = [502, 503, 504].includes(result.status);
          const safeServerMessage =
            normalizedText && !normalizedText.startsWith('<!DOCTYPE html') ? normalizedText : '';

          setStatusOpen(false);
          setError(
            (isExternalRouterError
              ? 'The app could not reach the backend service. Please try again in 30-60 seconds.'
              : '') ||
            (isUpstreamUnavailable
              ? 'Backend service is temporarily unavailable. Please wait a moment and try again.'
              : '') ||
            (isLikelyProxyBackendDown
              ? 'Payment API is unreachable. Start the backend server (npm run server) and try again.'
              : '') ||
            data?.message ||
            safeServerMessage ||
            `Failed to submit order (HTTP ${result.status}). Please try again.`
          );
          return;
        }

        if (data?.success) {
          setStatus('success');
        } else {
          setStatusOpen(false);
          setError(data?.message || 'Failed to submit order. Please try again.');
        }
      } catch (err) {
        console.error('Error submitting order:', err);
        setStatusOpen(false);
        setError('Network error. Please check your connection and try again.');
      }
      return;
    }

    setDetailsOpen(false);
    setStatusOpen(true);
    setStatus('waiting');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  const handleCloseDialog = () => {
    setStatusOpen(false);
    if (status === 'success') {
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  const handleCardChange = (field) => (event) => {
    setCardDetails((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleProofChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('Screenshot must be under 4MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(String(reader.result || ''));
      setProofFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1040,
          mx: 'auto',
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          background: '#ffffff',
          border: '1px solid #f3f4f6',
          boxShadow: '0 18px 40px rgba(236, 72, 153, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mr: 1, bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e8e8e8' } }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>
            Complete Payment
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' } }}>
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: 2.5,
                  bgcolor: config.bgColor,
                  mb: 2,
                  border: `1px solid ${config.color}45`,
                }}
              >
                <MethodIcon sx={{ fontSize: 32, color: config.color }} />
              </Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                {config.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure and encrypted transaction
              </Typography>
            </Box>

            {(method === 'bitcoin' || method === 'cashapp' || method === 'paypal') && (
              <>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
                  Send payment to
                </Typography>
                <Box
                  sx={{
                    bgcolor: config.bgColor,
                    p: 2.5,
                    borderRadius: 2,
                    border: `2px solid ${config.color}40`,
                    mb: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': { borderColor: config.color, boxShadow: `0 4px 20px ${config.color}30` },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ color: config.color, textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                      {config.label}
                    </Typography>
                    {method === 'bitcoin' && (
                      <Button
                        size="small"
                        startIcon={<QrCode2Icon />}
                        onClick={() => setShowQr(!showQr)}
                        sx={{ textTransform: 'none', fontSize: '0.75rem', color: config.color }}
                      >
                        {showQr ? 'Hide QR' : 'Show QR'}
                      </Button>
                    )}
                  </Box>
                  {showQr && method === 'bitcoin' && (
                    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 2, mb: 2, textAlign: 'center' }}>
                      <QrCode2Icon sx={{ fontSize: 160, color: config.color }} />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1, wordBreak: 'break-all', fontSize: '0.65rem' }}
                      >
                        {config.address}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        wordBreak: 'break-all',
                        fontWeight: 500,
                        fontFamily: 'monospace',
                      }}
                    >
                      {config.address}
                    </Typography>
                    <Button
                      size="small"
                      onClick={copyAddress}
                      sx={{ minWidth: 'auto', p: 0.5, color: copied ? '#22c55e' : config.color }}
                    >
                      {copied ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </Button>
                  </Box>
                </Box>
              </>
            )}

            {requiresCard && (
              <Box sx={{ display: 'grid', gap: 2, mb: 2 }}>
                <TextField
                  label="Cardholder Name"
                  value={cardDetails.cardholderName}
                  onChange={handleCardChange('cardholderName')}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  label="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange('cardNumber')}
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Expiry (MM/YY)"
                    value={cardDetails.expiry}
                    onChange={handleCardChange('expiry')}
                    fullWidth
                    placeholder="MM/YY"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField
                    label="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange('cvv')}
                    fullWidth
                    placeholder="123"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Box>
            <Box
              sx={{
                bgcolor: config.bgColor,
                p: 2,
                borderRadius: 2,
                mb: 3,
                border: `2px solid ${config.color}40`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: config.color, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                Total Amount
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: config.color }}>${total}</Typography>
            </Box>

            <Box sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1}>
                Order Summary
              </Typography>
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {profile?.name || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {hours || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #e2e8f0' }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="primary">
                    ${total}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {!requiresCard && (
              <>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" mb={1.5}>
                  Amount to pay
                </Typography>
                <Box
                  sx={{
                    bgcolor: '#f1f5f9',
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700 }}>${total}</Typography>
                  <Button
                    size="small"
                    onClick={copyAmount}
                    sx={{ minWidth: 'auto', p: 0.5, color: copiedAmount ? '#22c55e' : 'text.secondary' }}
                  >
                    {copiedAmount ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </Button>
                </Box>
              </>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handlePayment}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
                boxShadow: `0 4px 14px 0 ${config.color}40`,
              }}
            >
              {requiresCard ? 'Pay Now' : "I've Made Payment"}
            </Button>

            
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        disableRestoreFocus
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', border: '1px solid #f3f4f6' } }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid #eef2f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
            Confirm Payment Details
          </Typography>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ bgcolor: '#f3f4f6' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box sx={{ bgcolor: '#fff7fb', borderRadius: 2, p: 2, mb: 2, border: '1px solid #f3e0f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', color: 'text.secondary' }}>
                Companion
              </Typography>
              <Typography fontWeight={700}>{profile?.name || 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', color: 'text.secondary' }}>
                Duration
              </Typography>
              <Typography fontWeight={700}>{hours || 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #f3e0f9' }}>
              <Typography variant="caption" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', color: 'text.secondary' }}>
                Amount To Pay
              </Typography>
              <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: config.color }}>${total}</Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {requiresProof && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Upload your payment confirmation screenshot.
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{ borderRadius: 2, borderColor: config.color, color: config.color }}
              >
                <QrCode2Icon sx={{ mr: 1 }} /> Choose Screenshot
                <input type="file" accept="image/*" hidden onChange={handleProofChange} />
              </Button>
              {proofFileName && (
                <Typography variant="body2" sx={{ mt: 2, color: '#22c55e', fontWeight: 500 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  {proofFileName}
                </Typography>
              )}
              {proofImage && (
                <Box
                  component="img"
                  src={proofImage}
                  alt="Payment proof"
                  sx={{
                    mt: 2,
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                  }}
                />
              )}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                Max file size: 4MB
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #eef2f7' }}>
          <Button onClick={() => setDetailsOpen(false)} color="inherit" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitPayment}
            sx={{ borderRadius: 2, background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)` }}
          >
            I've Made Payment
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusOpen}
        onClose={handleCloseDialog}
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: 3, p: 1, minWidth: 340 } }}
      >
        <DialogContent sx={{ textAlign: 'center', px: 4, py: 5 }}>
          {status === 'waiting' && (
            <>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: config.bgColor,
                  mb: 3,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  },
                }}
              >
                <HourglassEmptyIcon sx={{ fontSize: 24, color: config.color }} />
              </Box>
              <Typography fontWeight={700} mb={1} sx={{ fontSize: '1.25rem' }}>
                Processing Payment
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Please wait while we send your booking details and payment proof...
              </Typography>
            </>
          )}
          {status === 'success' && (
            <>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: 'rgba(34, 197, 94, 0.1)',
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 48, color: '#22c55e' }} />
              </Box>
              <Typography fontWeight={700} mb={1} sx={{ fontSize: '1.25rem', color: '#22c55e' }}>
                Order Submitted Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Your booking details and payment proof have been sent. We will contact you soon with your <strong>BOOKING CODE!</strong>.
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseDialog}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', px: 4 }}
              >
                Back to Home
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Pay;
