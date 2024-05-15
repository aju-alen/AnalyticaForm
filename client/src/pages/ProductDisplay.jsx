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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Link } from 'react-router-dom';



const tiers = [
  {
    title: 'Monthly Subscription',
    price: '170.00',
    description: [
      'Access to creating unlimited surveys',
      'Access to unlimited responses',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
];


const ProductDisplayy = () => {

    const [emailId, setEmailId] = useState('');

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('userAccessToken'))?.email;
        setEmailId(email);
    }, []);

    console.log(emailId, 'emailId');
 
  return (
    <div className="h-auto w-auto bg-slate-200 ">

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
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" color="text.primary">
            Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary">
          </Typography>
        </Box>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  border: tier.title === '' ? '1px solid' : undefined,
                  borderColor:
                    tier.title === '' ? 'primary.main' : undefined,
                  background:
                    tier.title === ''
                      ? 'linear-gradient(#f4dea7, #000000)'
                      : undefined,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: tier.title === '' ? 'grey.100' : '',
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.title === '' && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={tier.subheader}
                        size="small"
                        sx={{
                          background: (theme) =>
                            theme.palette.mode === 'light' ? '' : 'none',
                          backgroundColor: 'primary.contrastText',
                          '& .MuiChip-label': {
                            color: 'primary.dark',
                          },
                          '& .MuiChip-icon': {
                            color: 'primary.dark',
                          },
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      color: tier.title === '' ? 'grey.50' : undefined,
                    }}
                  >
                    <Typography component="h3" variant="h2">
                      AED{tier.price}
                    </Typography>
                    
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
                        py: 1,
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center',
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          width: 20,
                          color:
                            tier.title === 'Professional'
                              ? 'primary.light'
                              : 'primary.main',
                        }}
                      />
                      <Typography
                        component="text"
                        variant="subtitle2"
                        sx={{
                          color:
                            tier.title === '' ? 'grey.200' : undefined,
                        }}
                      >
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
                <CardActions>
                  <form action="https://analyticaform.onrender.com/api/stripe/create-checkout-session" method="POST">
                    {/* Add a hidden field with the lookup_key of your Price */}
                    <input type="hidden" name="DubaiAnalyticaTestKey" value={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY} />
                    <input type="hidden" name="emailId" value={emailId} />
                    <Button id="checkout-and-portal-button" type="submit">
                      Checkout now
                    </Button>
                  </form>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>


  )
}
export default ProductDisplayy;

const SuccessDisplay = ({ sessionId }) => {
    return (
      <section>
        <div className="product Box-root">
          <Logo />
          <div className="description Box-root">
            <h3>Subscription to starter plan successful!</h3>
          </div>
        </div>
        <form action="/create-portal-session" method="POST">
          <input
            type="hidden"
            id="session-id"
            name="session_id"
            value={sessionId}
          />
          <button id="checkout-and-portal-button" type="submit">
            Manage your billing information
          </button>
        </form>
      </section>
    );
  };