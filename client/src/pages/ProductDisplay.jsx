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



const tiers = [
  {
    title: 'Monthly Subscription',
    price: '200.00',
    description: [
      'Access to creating unlimited surveys',
      'Access to unlimited responses',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    lookup_key: 'dubai_analytica_monthly',
  },
  {
    title: 'Annual Subscription',
    originalPrice: '2400.00',
    discountedPrice: (2400 * 0.83).toFixed(2), // Apply 17% discount
    description: [
      'Access to creating unlimited surveys',
      'Access to unlimited responses',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    lookup_key: 'dubai_analytica_annual',
  },
];


const ProductDisplayy = () => {

    const [emailId, setEmailId] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userAccessToken'));

        setEmailId(userDetails?.email);
        setUserId(userDetails?.id);

    }, []);

    console.log(emailId, 'emailId');
    console.log(userId, 'userId');
 
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
              borderColor: tier.title === '' ? 'primary.main' : undefined,
              background: tier.title === '' ? 'linear-gradient(#f4dea7, #000000)' : undefined,
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
                      background: (theme) => theme.palette.mode === 'light' ? '' : 'none',
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
                {tier.originalPrice ? (
                  <>
                    <Typography component="h3" variant="p" sx={{ textDecoration: 'line-through', mr: 1 }}>
                      AED{tier.originalPrice}
                    </Typography>
                    <Typography component="h3" variant="p">
                      AED{tier.discountedPrice}
                    </Typography>
                    <Chip
                      label="17% OFF"
                      size="small"
                      sx={{
                        ml: 2,
                        backgroundColor: 'secondary.main',
                        color: 'secondary.contrastText',
                      }}
                    />
                  </>
                ) : (
                  <Typography component="h3" variant="p">
                    AED{tier.price}
                  </Typography>
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
                    py: 1,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <CheckCircleRoundedIcon
                    sx={{
                      width: 20,
                      color: tier.title === 'Professional' ? 'primary.light' : 'primary.main',
                    }}
                  />
                  <Typography
                    component="text"
                    variant="subtitle2"
                    sx={{
                      color: tier.title === '' ? 'grey.200' : undefined,
                    }}
                  >
                    {line}
                  </Typography>
                </Box>
              ))}
            </CardContent>
                <CardActions>
                  <form action="https://analyticaform-api.onrender.com/api/stripe/create-checkout-session" method="POST">
                  {/* <form action="http://localhost:3001/api/stripe/create-checkout-session" method="POST"> */}
                    {/* Add a hidden field with the lookup_key of your Price */}
                    <input type="hidden" name="lookup_key" value={tier.lookup_key} />
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="emailId" value={emailId} />
                    <Button id="checkout-and-portal-button" type="submit">
                      Proceed to checkout
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

