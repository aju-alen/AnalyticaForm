import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HomeNavBar from '../components/HomeNavBar';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { getUserAccess } from '../utils/userAccess';
import { useNavigate } from 'react-router-dom';

const isLiveStripe = String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').startsWith('pk_live_');

const YES = true;
const NO = false;

const tiers = [
  {
    id: 'free',
    title: 'Free',
    price: 'FREE',
    period: '',
    highlighted: false,
    cta: 'signup',
    description: [
      '5 surveys',
      '500 responses per survey',
      'Unlimited questions',
      '15+ question types, including consent and Zoom interviews',
      'Templates, preview, clone, share, embed, and QR',
      'Question analytics and Excel export (up to 500)',
      'Email support',
    ],
    lookup_key: 'dubai_analytica_monthly',
    dev_lookup_key: 'dev_monthly_dubai',
  },
  {
    id: 'monthly',
    title: 'Monthly',
    price: '200.00',
    period: '/month',
    highlighted: true,
    subheader: 'Most popular',
    cta: 'checkout',
    description: [
      'Unlimited surveys',
      'Unlimited responses',
      'Everything in Free',
      'Email invitations and campaigns',
      'Response dashboard',
      'Full Excel export',
      '24/7 chat support',
    ],
    lookup_key: 'dubai_analytica_monthly',
    dev_lookup_key: 'dev_monthly_dubai',
  },
  {
    id: 'annual',
    title: 'Annual',
    originalPrice: '2400.00',
    discountedPrice: (2400 * 0.83).toFixed(2),
    period: '/year',
    highlighted: false,
    subheader: '17% OFF',
    cta: 'checkout',
    description: [
      'Everything in Monthly',
      'Save AED 408',
      'Billed once a year',
      'Cancel anytime to stop renewal. Not refundable; access continues until the paid year ends',
    ],
    lookup_key: 'dubai_analytica_annual',
    dev_lookup_key: 'dev_yearly_dubai',
  },
];

const comparisonSections = [
  {
    category: 'Limits',
    rows: [
      { feature: 'Surveys', free: '5', premium: 'Unlimited' },
      { feature: 'Responses per survey', free: '500', premium: 'Unlimited' },
      { feature: 'Questions', free: 'Unlimited', premium: 'Unlimited' },
    ],
  },
  {
    category: 'Build',
    rows: [
      { feature: '15+ question types', free: YES, premium: YES },
      { feature: 'Consent forms (form, interview, dynamic)', free: YES, premium: YES },
      { feature: 'Zoom interview links', free: YES, premium: YES },
      { feature: 'Ready-made templates', free: YES, premium: YES },
      { feature: 'Preview and clone', free: YES, premium: YES },
      { feature: 'Password, close date, max responses', free: YES, premium: YES },
      { feature: 'One-page or one-question layout', free: YES, premium: YES },
    ],
  },
  {
    category: 'Collect',
    rows: [
      { feature: 'Share URL, embed, QR', free: YES, premium: YES },
      { feature: 'Email invitations and campaigns', free: NO, premium: YES },
    ],
  },
  {
    category: 'Analyze',
    rows: [
      { feature: 'Question analytics', free: YES, premium: YES },
      { feature: 'Response dashboard', free: NO, premium: YES },
      { feature: 'Excel export', free: 'Up to 500', premium: 'Unlimited' },
    ],
  },
  {
    category: 'Support',
    rows: [
      { feature: 'Email', free: YES, premium: YES },
      { feature: '24/7 chat', free: NO, premium: YES },
    ],
  },
];

function PlanValue({ value, tone }) {
  const isPremium = tone === 'premium';

  if (value === YES) {
    return (
      <CheckCircleRoundedIcon
        sx={{
          fontSize: 22,
          display: 'block',
          mx: 'auto',
          color: isPremium ? 'primary.main' : 'grey.400',
        }}
      />
    );
  }

  if (value === NO) {
    return (
      <Typography
        component="span"
        sx={{ color: 'grey.400', fontSize: 20, lineHeight: 1, fontWeight: 400 }}
      >
        –
      </Typography>
    );
  }

  const unlimited = String(value).toLowerCase() === 'unlimited';
  return (
    <Typography
      variant="body2"
      component="span"
      sx={{
        fontWeight: isPremium && unlimited ? 700 : 500,
        color: isPremium ? (unlimited ? 'primary.main' : '#0f172a') : '#94a3b8',
        letterSpacing: unlimited && isPremium ? 0.2 : 0,
      }}
    >
      {value}
    </Typography>
  );
}

function CheckoutActions({ tier, isProMember, userId, emailId, isLoading, navigate }) {
  if (isProMember) {
    return (
      <>
        <Alert severity="info" sx={{ width: '100%' }}>
          You already have an active subscription plan
        </Alert>
        <Button
          id="checkout-and-portal-button"
          variant="contained"
          disabled
          sx={{ width: '100%' }}
        >
          Proceed to checkout
        </Button>
      </>
    );
  }

  if (!userId) {
    return (
      <Button
        variant="contained"
        sx={{ width: '100%' }}
        onClick={() => navigate('/login')}
      >
        Log in to checkout
      </Button>
    );
  }

  return (
    <form
      action={`${import.meta.env.VITE_BACKEND_URL}/api/stripe/create-checkout-session`}
      method="POST"
      style={{ width: '100%' }}
    >
      <input type="hidden" name="lookup_key" value={isLiveStripe ? tier.lookup_key : tier.dev_lookup_key} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="emailId" value={emailId} />
      <Button
        id="checkout-and-portal-button"
        type="submit"
        variant="contained"
        sx={{ width: '100%' }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Proceed to checkout'}
      </Button>
    </form>
  );
}

const ProductDisplayy = () => {
  const [emailId, setEmailId] = useState('');
  const [userId, setUserId] = useState('');
  const [isProMember, setIsProMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserAccess();

    setEmailId(userDetails?.email);
    setUserId(userDetails?.id);

    const checkProMemberStatus = async () => {
      if (userDetails?.id) {
        try {
          const userProMember = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${userDetails.id}`);
          const date = new Date();
          const unixTimestamp = Math.floor(date.getTime() / 1000);

          if (userProMember?.data?.subscriptionPeriodEnd && userProMember.data.subscriptionPeriodEnd > unixTimestamp) {
            setIsProMember(true);
          }
        } catch (err) {
          console.log('Error checking pro member status:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkProMemberStatus();
  }, []);

  return (
    <Box>
      <HomeNavBar />
      <Box sx={{
        bgcolor: 'background.default',
        pt: 8,
        pb: 12,
        backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
      }}>
        <Container
          id="pricing"
          sx={{
            pt: { xs: 4, sm: 12 },
            pb: { xs: 8, sm: 16 },
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 3, sm: 6 },
          }}
        >
          <Box
            sx={{
              width: { sm: '100%', md: '70%' },
              textAlign: { sm: 'left', md: 'center' },
            }}
          >
            <Typography component="h2" variant="h4" color="text.primary" sx={{ fontWeight: 700 }}>
              Plans and Pricing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
              Start free. Upgrade when you need unlimited surveys, email invitations, and the response dashboard.
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch" justifyContent="center">
            {tiers.map((tier) => (
              <Grid item key={tier.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: tier.highlighted ? '2px solid' : '1px solid',
                    borderColor: tier.highlighted ? 'primary.main' : 'divider',
                    boxShadow: tier.highlighted
                      ? '0 16px 40px rgba(25, 118, 210, 0.22)'
                      : '0 8px 24px rgba(15, 23, 42, 0.08)',
                    transform: tier.highlighted ? { md: 'scale(1.04)' } : undefined,
                    zIndex: tier.highlighted ? 1 : 0,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>
                        {tier.title}
                      </Typography>
                      {tier.highlighted && (
                        <Chip
                          icon={<AutoAwesomeIcon />}
                          label={tier.subheader}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.main',
                            '& .MuiChip-label': {
                              color: 'primary.contrastText',
                              fontWeight: 600,
                            },
                            '& .MuiChip-icon': {
                              color: 'primary.contrastText',
                            },
                          }}
                        />
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        flexWrap: 'wrap',
                        gap: 1,
                        minHeight: 48,
                      }}
                    >
                      {tier.originalPrice ? (
                        <>
                          <Typography
                            component="span"
                            variant="body1"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through' }}
                          >
                            AED{tier.originalPrice}
                          </Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            AED{tier.discountedPrice}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {tier.period}
                          </Typography>
                          <Chip
                            label="17% OFF"
                            size="small"
                            sx={{
                              backgroundColor: 'secondary.main',
                              color: 'secondary.contrastText',
                              fontWeight: 700,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                            {tier.price === 'FREE' ? 'FREE' : `AED${tier.price}`}
                          </Typography>
                          {tier.period ? (
                            <Typography component="span" variant="body2" color="text.secondary">
                              {tier.period}
                            </Typography>
                          ) : null}
                        </>
                      )}
                    </Box>
                    <Divider
                      sx={{
                        my: 2,
                        opacity: 0.2,
                        borderColor: 'grey.500',
                      }}
                    />
                    {tier.description.map((line) => (
                      <Box
                        key={line}
                        sx={{
                          py: 0.75,
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'flex-start',
                        }}
                      >
                        <CheckCircleRoundedIcon
                          sx={{
                            width: 20,
                            mt: 0.2,
                            color: 'primary.main',
                          }}
                        />
                        <Typography variant="subtitle2">
                          {line}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                  <CardActions sx={{ flexDirection: 'column', gap: 2, alignItems: 'stretch', mt: 'auto', pt: 2 }}>
                    {tier.cta === 'signup' ? (
                      <Button
                        variant="outlined"
                        sx={{ width: '100%' }}
                        onClick={() => navigate(userId ? '/dashboard' : '/signup')}
                      >
                        Sign up for free
                      </Button>
                    ) : (
                      <CheckoutActions
                        tier={tier}
                        isProMember={isProMember}
                        userId={userId}
                        emailId={emailId}
                        isLoading={isLoading}
                        navigate={navigate}
                      />
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ width: '100%', mt: { xs: 2, sm: 4 } }}>
            <Typography component="h3" variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
              Compare plans
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              See what you get on Free versus Premium.
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflowX: 'auto',
                bgcolor: '#fff',
              }}
            >
              <Table
                stickyHeader
                aria-label="Compare Free and Premium plans"
                sx={{
                  minWidth: 640,
                  '& .MuiTableCell-root': {
                    borderColor: 'rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: '46%',
                        minWidth: 220,
                        bgcolor: '#fff',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 2.5,
                        pl: 3,
                      }}
                    />
                    <TableCell
                      align="center"
                      sx={{
                        width: '27%',
                        minWidth: 140,
                        bgcolor: '#fff',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 2.5,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Free
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        AED 0
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: '27%',
                        minWidth: 160,
                        bgcolor: 'rgba(25, 118, 210, 0.06)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        borderTop: '3px solid',
                        borderTopColor: 'primary.main',
                        py: 2,
                      }}
                    >
                      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
                        <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          Premium
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        From AED 200 / month
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonSections.map((section) => (
                    <React.Fragment key={section.category}>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{
                            py: 1.25,
                            pl: 3,
                            bgcolor: '#f8fafc',
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'text.secondary',
                          }}
                        >
                          {section.category}
                        </TableCell>
                      </TableRow>
                      {section.rows.map((row) => (
                        <TableRow
                          key={row.feature}
                          hover
                          sx={{
                            '&:hover td': { bgcolor: 'rgba(15, 23, 42, 0.02)' },
                            '&:hover td:last-of-type': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
                          }}
                        >
                          <TableCell
                            sx={{
                              pl: 3,
                              py: 1.75,
                              color: '#334155',
                              fontSize: 14.5,
                            }}
                          >
                            {row.feature}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.75, color: 'text.secondary' }}>
                            <PlanValue value={row.free} tone="free" />
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              py: 1.75,
                              bgcolor: 'rgba(25, 118, 210, 0.04)',
                            }}
                          >
                            <PlanValue value={row.premium} tone="premium" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Subscriptions auto-renew. You can cancel an annual plan at any time to stop the next charge. Annual fees are not refundable; you keep Premium access until the end of the year you already paid for.
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ProductDisplayy;
