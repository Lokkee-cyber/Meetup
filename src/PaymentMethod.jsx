import { Box, Typography, Card, Button, Alert, Grid, IconButton } from '@mui/material';
import { AccountBalanceWallet, CurrencyBitcoin, ArrowBack, Payments } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <Typography p={3} color="error">
        Order data not found.
      </Typography>
    );
  }

  const { profile, hours, customer } = state;

  const paymentOptions = [
    {
      key: 'cashapp',
      title: 'CashApp',
      desc: 'Pay with CashApp balance',
      icon: AccountBalanceWallet,
      iconColor: '#00d632',
      iconBg: 'rgba(0, 214, 50, 0.12)',
    },
    {
      key: 'paypal',
      title: 'PayPal',
      desc: 'Pay with PayPal',
      icon: Payments,
      iconColor: '#003087',
      iconBg: 'rgba(0, 48, 135, 0.12)',
    },
    {
      key: 'bitcoin',
      title: 'Bitcoin',
      desc: 'Cryptocurrency payment',
      icon: CurrencyBitcoin,
      iconColor: '#f7931a',
      iconBg: 'rgba(247, 147, 26, 0.12)',
    },
  ];
  
  const getTotal = () => {
    if (!profile || !hours) return 0;
    if (profile.prices && profile.prices[hours]) {
      return profile.prices[hours];
    }
    if (profile.rate) {
      const hourMap = {
        '1 hour': profile.rate,
        '2 hours': profile.rate * 2,
        '3 hours': profile.rate * 3,
        'overnight': profile.rate * 8,
        'weekend': profile.rate * 24,
        'hour': profile.rate,
        'twoHours': profile.rate * 2,
        'fullNight': profile.rate * 8
      };
      return hourMap[hours] || profile.rate;
    }
    return 0;
  };
  
  const total = getTotal();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 50%, #fce7f3 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Box p={3} maxWidth={800} mx="auto">
      {/* Back Button at Top */}
      <IconButton 
        onClick={() => navigate(-1)} 
        sx={{ mb: 2, bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}
      >
        <ArrowBack />
      </IconButton>

      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        mb={2}
        sx={{
          background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Select Payment Method
      </Typography>

      {/* Price at Top */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          color: 'white',
          p: 2, 
          borderRadius: 2, 
          mb: 4,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(236, 72, 153, 0.28)'
        }}
      >
        <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
          Total Amount
        </Typography>
        <Typography variant="h4" fontWeight={800}>
          ${total}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        <Grid item xs={12}>
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.key}
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 4px 16px rgba(17, 24, 39, 0.06)',
                  '&:hover': { boxShadow: '0 10px 24px rgba(236, 72, 153, 0.16)', borderColor: '#fbcfe8' },
                }}
                onClick={() => navigate(`/pay/${option.key}`, { state })}
              >
                <Box
                  sx={{
                    mr: 2,
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: option.iconBg,
                  }}
                >
                  <Icon sx={{ color: option.iconColor }} />
                </Box>
                <Box flexGrow={1}>
                  <Typography fontWeight="bold">{option.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{option.desc}</Typography>
                </Box>
                <Alert severity="success" sx={{ ml: 1 }}>Available</Alert>
              </Card>
            );
          })}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            borderColor: '#ec4899',
            color: '#db2777',
            '&:hover': { borderColor: '#db2777', backgroundColor: '#fff1f8' },
          }}
        >
          Back to Checkout
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default PaymentMethod;
