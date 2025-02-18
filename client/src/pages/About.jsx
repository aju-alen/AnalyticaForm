import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import any icons you plan to use
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "MultiScale Questions",
      description: "Collect detailed responses for deeper insights."
    },
    {
      title: "Sentiment Analysis",
      description: "Decode emotions through emojis, star ratings, and more."
    },
    {
      title: "Ready-Made templates",
      description: "Launch professional-grade surveys in minutes."
    },
    {
      title: "Advanced Inputs",
      description: "Gather complex mathematical or structured data effortlessly."
    },
    {
      title: "Targeted Respondents Database",
      description: "Get real feedback from verified, high-quality participants"
    }
  ];

  const advantages = [
    {
      icon: <LanguageIcon fontSize="large" />,
      title: "Built for Global & Regional Research",
      description: "We're headquartered in Dubai, a city known for its innovation, diversity, and business excellence. Our solutions cater to a global audience while ensuring deep insights tailored for MENA, GCC, and international markets."
    },
    {
      icon: <AnalyticsIcon fontSize="large" />,
      title: "Data-Driven Insights & Real-Time Analytics",
      description: "Our platform doesn't just collect data—it transforms it into actionable intelligence with advanced analytics and machine learning."
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: "Security & Compliance First",
      description: "We prioritize data privacy, security, and regulatory compliance so you can trust your insights are protected."
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', pt: 8, pb: 12, backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)', }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" align="center" gutterBottom fontWeight="bold">
            Empowering Decisions. Driving Innovation.
          </Typography>
          
          <Typography variant="h5" align="center" color="text.secondary" sx={{ mt: 4, mb: 8 }}>
            Dubai Analytica is a company that believes data isn't just numbers—it's the foundation of every great decision.
          </Typography>
        </motion.div>

        {/* Mission Section */}
        <Paper elevation={3} sx={{ p: 4, mb: 8, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="h6">
            To revolutionize the way organizations gather and interpret data, enabling them to make smarter, faster, and more impactful decisions.
          </Typography>
        </Paper>

        {/* Who We Are Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Who We Are
            </Typography>
            <Typography variant="body1" paragraph>
              Founded at the heart of Dubai's tech and innovation hub, Dubai Analytica was created to solve one fundamental challenge: bridging the gap between raw data and meaningful insights.
            </Typography>
            <Typography variant="body1">
              Our platform is built for business leaders, data scientists, students, marketers, and decision-makers who need precision, speed, and reliability in their research.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom color="primary">
                What We Do
              </Typography>
              <Typography variant="h6" gutterBottom>
                Advanced Survey & Research Solutions
              </Typography>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircleIcon color="primary" />
                      <Typography variant="body1">
                        <strong>{feature.title}</strong> - {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Why Dubai Analytica Section */}
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          Why Dubai Analytica?
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {advantages.map((advantage, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {advantage.icon}
                    <Typography variant="h6" align="center">
                      {advantage.title}
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary">
                      {advantage.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Join the future of Data Intelligence
          </Typography>
          <Typography variant="body1" paragraph>
            UAE businesses, researchers, and analysts trust Dubai Analytica to unlock the power of data. Whether you're looking to understand customers, optimize strategies, or predict trends, we're here to help you make data-driven decisions that matter.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Get Started Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default About;