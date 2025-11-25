import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Check, Users, BarChart } from "lucide-react";
import { Region, Industries, EducationLevels, Experience, Position } from "../utils/user-mock-count";
import { axiosWithAuth } from "../utils/customAxios";
import { backendUrl } from "../utils/backendUrl";
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import HomeNavBar from "../components/HomeNavBar";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
const images = [
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner1.jpg', // Replace with your image URLs
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner2.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner3.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner4.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner5.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner6.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner7.jpg',
];

const verticalImages = [
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT1.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT2.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT3.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT4.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT5.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/ANALYTICA-POTRAIT6.jpg',
];

const UserMarket = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [finalUsersCount, setFinalUsersCount] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [userData, setUserData] = useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [verticalIndex, setVerticalIndex] = React.useState(0);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isCalculating && finalUsersCount === 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 11000);

    return () => clearInterval(interval);
  }, [isCalculating, finalUsersCount]);

  React.useEffect(() => {
    const verticalInterval = setInterval(() => {
      if (!isCalculating && finalUsersCount === 0) {
        setVerticalIndex((prevIndex) =>
          prevIndex === verticalImages.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 21000);

    return () => clearInterval(verticalInterval);
  }, [isCalculating, finalUsersCount]);

  console.log(selectedRegions,
    selectedIndustries,
    selectedEducationLevels,
    selectedPositions,
    selectedExperience, 'zzzzzzzzz_----__------');

  const getUser = async () => {
    try {
      const getUserData = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user`);
      setUserData(getUserData.data);

    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {

    getUser();
  }, []);


  const calculateUsersCount = () => {
    setIsCalculating(true);
    const totalPopulation = 100000;

    const regionPercent = selectedRegions.reduce((sum, region) => {
      const found = Region.find((r) => r.region === region);
      return sum + (found ? found.populationPercent : 0);
    }, 0);

    const industryPercent = selectedIndustries.reduce((sum, industry) => {
      const found = Industries.find((i) => i.industry === industry);
      return sum + (found ? found.industryPercent : 0);
    }, 0);

    const educationPercent = selectedEducationLevels.reduce((sum, level) => {
      const found = EducationLevels.find((e) => e.educationLevel === level);
      return sum + (found ? found.educationLevelPercent : 0);
    }, 0);

    const positionPercent = selectedPositions.reduce((sum, position) => {
      const found = Position.find((p) => p.position === position);
      return sum + (found ? found.positionPercent : 0);
    }, 0);

    const experiencePercent = selectedExperience.reduce((sum, exp) => {
      const found = Experience.find((e) => e.experience === exp);
      return sum + (found ? found.experiencePercent : 0);
    }, 0);

    const result = Math.floor(
      (totalPopulation * regionPercent / 100) *
      (industryPercent / 100) *
      (educationPercent / 100) *
      (positionPercent / 100) *
      (experiencePercent / 100)
    );

    setTimeout(() => {
      if (result >= 1000 && result <= 14000) {
      setFinalUsersCount(result);
      } else {
        setFinalUsersCount(()=> Math.floor(Math.random() * (15000 - 5000) + 5000))
      }
      setIsCalculating(false);
    }, 1000);
  };
  const steps = [
    { title: "Regions", icon: <Users className="w-5 h-5" />, data: Region, key: "region" },
    { title: "Industries", icon: <BarChart className="w-5 h-5" />, data: Industries, key: "industry" },
    { title: "Education", icon: <Users className="w-5 h-5" />, data: EducationLevels, key: "educationLevel" },
    { title: "Position", icon: <Users className="w-5 h-5" />, data: Position, key: "position" },
    { title: "Experience", icon: <Users className="w-5 h-5" />, data: Experience, key: "experience" }
  ];

  const getSelectionState = (step) => {
    switch (step) {
      case 0: return [selectedRegions, setSelectedRegions];
      case 1: return [selectedIndustries, setSelectedIndustries];
      case 2: return [selectedEducationLevels, setSelectedEducationLevels];
      case 3: return [selectedPositions, setSelectedPositions];
      case 4: return [selectedExperience, setSelectedExperience];
      default: return [[], () => { }];
    }
  };

  const SelectionStep = ({ step }) => {
    const [selections, setSelections] = getSelectionState(step);
    const currentStep = steps[step];
    const data = currentStep.data;

    const toggleSelection = (value) => {
      if (selections.includes(value)) {
        setSelections(selections.filter(item => item !== value));
      } else {
        setSelections([...selections, value]);
      }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {data.map((item) => {
            const value = item[currentStep.key];
            const isSelected = selections.includes(value);
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleSelection(value)}
                className={`
                  p-4 rounded-lg cursor-pointer border-2 transition-all
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{value}</span>
                  {isSelected ? (
                    <Check className="w-5 h-5 text-blue-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.title}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full
              ${index === activeStep ? 'bg-blue-500 text-white' :
                index < activeStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
            `}
          >
            {index < activeStep ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 ${index < activeStep ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const calculatePrice = (users) => {
    if (users <= 300) {
      return users * 30;
    } else if (users <= 600) {
      return users * 25;
    } else if (users <= 900) {
      return users * 20;
    } else {
      return users * 10;
    }
  };

  const ResultsView = () => {
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");
    const [price, setPrice] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showGuestEmailModal, setShowGuestEmailModal] = useState(false);
    const [guestEmail, setGuestEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showPurchaseDiv, setShowPurchaseDiv] = useState(false);

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const handleGuestCheckout = async (e) => {
      e.preventDefault();
      setEmailError("");
      if (!validateEmail(guestEmail)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      
      try {
        setLoading(true);
        const createRegisterInDb = await axiosWithAuth.post(`${backendUrl}/api/auth/create-register-guest`, {
          email: guestEmail,
          firstName: firstName,
          lastName: lastName,
        });
        console.log(createRegisterInDb.data.user, 'createRegisterInDb');
        
        // After successful registration, submit the checkout form
        const checkoutForm = document.createElement('form');
        checkoutForm.method = 'POST';
        checkoutForm.action = `${import.meta.env.VITE_BACKEND_URL}/api/stripe/market/create-checkout-session`;

        // Create and append hidden inputs
        const formInputs = {
          userId: createRegisterInDb.data.user.id,
          emailId: guestEmail,
          amount: price,
          unit: userInput,
          selectedRegions: selectedRegions,
          selectedIndustries: selectedIndustries,
          selectedEducationLevels: selectedEducationLevels,
          selectedPositions: selectedPositions,
          selectedExperience: selectedExperience,
          currency: 'aed'
        };

        Object.entries(formInputs).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          checkoutForm.appendChild(input);
        });

        document.body.appendChild(checkoutForm);
        checkoutForm.submit();
        document.body.removeChild(checkoutForm);
        setLoading(false);
      } catch (error) {
        console.error('Error handling guest checkout:', error);
        setEmailError(error.response.data.message);
        setLoading(false);
      }
    };

    const handleInputChange = (e) => {
      const value = e.target.value;
      setUserInput(value);

      if (value === "") {
        setError("");
        setPrice(0);
        return;
      }

      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
        setPrice(0);
      } else if (numValue < 1) {
        setError("Value must be at least 1");
        setPrice(0);
      } else if (numValue > finalUsersCount) {
        setError(`Value cannot exceed ${finalUsersCount.toLocaleString()}`);
        setPrice(0);
      } else {
        setError("");
        setPrice(calculatePrice(numValue));
      }
    };

    const handleCheckoutClick = (e) => {
      e.preventDefault();
      const userAccess = localStorage.getItem('dubaiAnalytica-userAccess');
      
      if (userAccess === null) {
        setShowAuthModal(true);
        return;
      }
      
      e.target.closest('form').submit();
    };

    return (
      <div className="text-center space-y-4 md:space-y-6">
   <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg text-white">
          <h2 className="text-2xl font-semibold mb-2">Total AvailableSample Size</h2>
          <div className="text-5xl font-bold">{finalUsersCount.toLocaleString()}</div>
          <p className="text-blue-100 mt-4">Estimated Users</p>
          {/*  */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg text-white">
            <h6 className="text-lg font-semibold mb-2">Yes! We can cater to your needs</h6>
            <h6 className="text-lg font-semibold mb-4">If you face any challenge</h6>
            <Button
              variant="contained"
              className="text-blue-100 mt-2"
              onClick={() => navigate('/contact-us')}
            >Contact Sales</Button>
            <h2 className="text-2xl font-semibold my-4">OR</h2>

            <Button
              variant="contained"
              className="text-blue-100 mt-2"
              onClick={() => setShowPurchaseDiv(true)}
            >Proceed to purchase</Button>
          </div>
{/*  */}
        </div>
        

       { showPurchaseDiv && <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-2">Input your target sample size to purchase</h2>
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter number of users (1 - {finalUsersCount.toLocaleString()})
          </label> */}
          <input
            type="number"
            value={userInput}
            onChange={handleInputChange}
            min={1}
            max={finalUsersCount}
            className={`
              px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none w-56
              ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
            `}
            placeholder="Enter number of users"
          />
          {error && (
            <div
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </div>
          )}
          {userInput && !error && (
            <div
              className="mt-4 space-y-3"
            >
              <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                <p className="text-sm">
                  Selected: {parseInt(userInput).toLocaleString()} respondants
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                <p className="text-sm font-semibold">
                  Total Price: {price.toLocaleString()} AED
                </p>
                <div className="mt-2 text-xs text-blue-600 text-left">
                  <p>Pricing Breakdown:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {parseInt(userInput) <= 300 ? (
                      <li>{userInput} respondants × 30 AED</li>
                    ) : parseInt(userInput) <= 600 ? (
                      <li>{userInput} respondants × 25 AED</li>
                    ) : parseInt(userInput) <= 900 ? (
                      <li>{userInput} respondants × 20 AED</li>
                    ) : (
                      <li>{userInput} respondants × 10 AED</li>
                    )}
                  </ul>
                </div>
                <form action={`${import.meta.env.VITE_BACKEND_URL}/api/stripe/market/create-checkout-session`} method="POST">
                  <input type="hidden" name="purchaseType" value="user-market" />
                  <input type="hidden" name="userId" value={userData.id} />
                  <input type="hidden" name="emailId" value={userData.email} />
                  <input type="hidden" name="amount" value={price} />
                  <input type="hidden" name="unit" value={userInput} />
                  <input type="hidden" name="selectedRegions" value={selectedRegions} />
                  <input type="hidden" name="selectedIndustries" value={selectedIndustries} />
                  <input type="hidden" name="selectedEducationLevels" value={selectedEducationLevels} />
                  <input type="hidden" name="selectedPositions" value={selectedPositions} />
                  <input type="hidden" name="selectedExperience" value={selectedExperience} />
                  <input type="hidden" name="currency" value='aed' />
                  <button 
                    id="checkout-and-portal-button" 
                    onClick={handleCheckoutClick}
                    className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg
                      font-medium transition-all duration-200 hover:bg-blue-600
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md
                      flex items-center justify-center gap-2"
                  >
                    Proceed to checkout
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
              </div>
            
          )}
        </div>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {[
            { label: "Regions", count: selectedRegions.length },
            { label: "Industries", count: selectedIndustries.length },
            { label: "Education Levels", count: selectedEducationLevels.length },
            { label: "Positions", count: selectedPositions.length },
            { label: "Experience Levels", count: selectedExperience.length }
          ].map(({ label, count }) => (
            <div key={label} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-semibold">{count}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setActiveStep(0);
            setSelectedRegions([]);
            setSelectedIndustries([]);
            setSelectedEducationLevels([]);
            setSelectedPositions([]);
            setSelectedExperience([]);
            setFinalUsersCount(0);
            setUserInput("");
            setError("");
            setPrice(0);
          }}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start New Calculation
        </button>

        {showAuthModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div 
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all animate-modalSlideIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                {/* <h3 className="text-2xl font-semibold text-gray-800">Continue as</h3> */}
                <p className="text-xl font-bold text-gray-600 mt-2">Choose how you'd like to proceed</p>
              </div>

              {/* Buttons Container */}
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                    font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="relative flex items-center gap-4 my-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setShowGuestEmailModal(true);
                  }}
                  className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg 
                    hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 
                    transform hover:scale-[1.02] active:scale-[0.98]
                    text-gray-700 font-medium flex items-center justify-center space-x-2"
                >
                  <span>Continue as Guest</span>
                  <Users className="w-4 h-4" />
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                  transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {showGuestEmailModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div 
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl transform transition-all animate-modalSlideIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Enter Your Details</h3>
                <p className="text-gray-600 mt-2 text-sm">We'll use this to send your order details</p>
              </div>

              <form onSubmit={handleGuestCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-200"
                    placeholder="First Name"
                    required
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none border-gray-300 focus:ring-blue-200"
                    placeholder="Last Name"
                    required
                  />
                </div>
                
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    setEmailError("");
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none
                    ${emailError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                  placeholder="your@email.com"
                  required
                />
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}

                <button
                  type="submit"
                  className="w-full mt-4 py-3 px-4 bg-blue-500 text-white rounded-lg
                    hover:bg-blue-600 transition-all duration-200 
                    transform hover:scale-[1.02] active:scale-[0.98]
                    font-medium flex items-center justify-center space-x-2"
                >
                  <span>Continue to Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <button
                onClick={() => setShowGuestEmailModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 
                  transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="">
      <HomeNavBar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      {/* Horizontal Slider Banner with improved shadows and rounded corners */}
      <Box
        sx={{
          position: 'relative',
          height: {
            xs: '200px',
            sm: '300px',
            md: '400px'
          },
          minHeight: {
            xs: '200px',
            sm: '300px',
            md: '400px'
          },
          overflow: 'hidden',
          width: '100%',
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mx: 'auto',
          maxWidth: '1400px',
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{
              duration: 0.7,
              ease: 'easeInOut'
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              position: 'absolute',
            }}
            alt={`Slide ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        {/* <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 8, sm: 12, md: 16 },
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 0.5, sm: 0.75, md: 1 },
            zIndex: 1,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: 6, sm: 8, md: 8 },
                height: { xs: 6, sm: 8, md: 8 },
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.2)',
                  backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
                },
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              onClick={() => setCurrentIndex(index)} // Add this if you want clickable dots
            />
          ))}
        </Box> */}

        {/* Optional: Touch swipe area for mobile */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            touchAction: 'pan-y pinch-zoom',
          }}
          component="div"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            setTouchStart(touch.clientX);
          }}
          onTouchMove={(e) => {
            if (!touchStart) return;

            const touch = e.touches[0];
            const diff = touchStart - touch.clientX;

            // Minimum swipe distance threshold
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                // Swipe left - next image
                setCurrentIndex((prev) => (prev + 1) % images.length);
              } else {
                // Swipe right - previous image
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
              }
              setTouchStart(null);
            }
          }}
          onTouchEnd={() => {
            setTouchStart(null);
          }}
        />

        {/* Optional: Navigation Arrows */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: { xs: 'none', sm: 'flex' }, // Hide on mobile
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { sm: 2, md: 3 },
            pointerEvents: 'none', // Allows clicking through to the swipe area
          }}
        >
          {['left', 'right'].map((direction) => (
            <IconButton
              key={direction}
              onClick={() => {
                if (direction === 'left') {
                  setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                } else {
                  setCurrentIndex((prev) => (prev + 1) % images.length);
                }
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                pointerEvents: 'auto', // Re-enable clicking
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                },
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          ))}
        </Box>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Info Card - Show on all devices */}
        <Card 
          className="subscription-card"
          sx={{ 
            display: 'flex',
            position: { xs: 'relative', md: 'absolute' },
            width: { xs: '100%', sm: '300px', md: '300px' },
            maxHeight: { xs: 'auto', sm: '200px', md: '200px' },
            backgroundColor: '#2196f3',
            color: 'white',
            transform: { 
              xs: 'rotate(0deg)',
              sm: 'rotate(-6deg)',
              md: 'rotate(-6deg)'
            },
            mb: { xs: 3, md: 0 },
            zIndex: 1,
            top: { md: '20px' },  // Add positioning for desktop
            left: { md: '20px' }, // Add positioning for desktop
            transition: 'all 0.3s ease', // Smooth transition for transform
            '&:hover': {
              transform: {
                xs: 'rotate(0deg)',
                sm: 'rotate(-8deg)',
                md: 'rotate(-8deg)'
              },
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }
          }}
        >
          <CardContent sx={{ 
            width: '100%',
            p: { xs: 2, sm: 3, md: 3 } // Adjust padding for different screens
          }}>
            <Button sx={{ 
              textTransform: 'none', 
              textDecoration: 'none', 
              color: '#fff',
              width: '100%',
              p: { xs: 1, sm: 2, md: 2 },
              '&:hover': {
                backgroundColor: 'transparent' // Prevent button hover effect
              }
            }}>
              <div className="flex flex-col w-full">
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' },
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Did you know?
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1rem' },
                    lineHeight: 1.5
                  }}
                >
                  You can purchase a sample size of 1000 which is the same as 400 respondants. More the quantity, the cheaper the price😉.
                </Typography>
              </div>
            </Button>
          </CardContent>
        </Card>

        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 md:p-8 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Sample Size Calculator
            </h1>

            {activeStep < steps.length && (
              <div className="mb-6 sm:mb-8 md:mb-12 overflow-x-auto">
                <ProgressIndicator />
              </div>
            )}

            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px]"
            >
              {activeStep === steps.length ? (
                <ResultsView />
              ) : (
                <>
                  <SelectionStep step={activeStep} />
                  <div className="flex justify-between mt-4 sm:mt-6 md:mt-8">
                    <button
                      onClick={() => setActiveStep(prev => prev - 1)}
                      disabled={activeStep === 0}
                      className={`
                        flex items-center px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base
                        ${activeStep === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                          'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                      `}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Back
                    </button>

                    <button
                      onClick={() => {
                        if (activeStep === steps.length - 1) {
                          calculateUsersCount();
                        }
                        setActiveStep(prev => prev + 1);
                      }}
                      disabled={getSelectionState(activeStep)[0].length === 0}
                      className={`
                        flex items-center px-2 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base
                        ${getSelectionState(activeStep)[0].length === 0 ?
                          'bg-gray-100 text-gray-400 cursor-not-allowed' :
                          'bg-blue-500 text-white hover:bg-blue-600'}
                      `}
                    >
                      {activeStep === steps.length - 1 ? 'Calculate' : 'Next'}
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Vertical/Horizontal Slider - Show on all devices */}
        {window.innerWidth > 768 && <Box
            sx={{
              display: 'block',
              position: 'relative',
              width: { xs: '100%', lg: '159px' },
              height: { xs: '200px', sm: '300px', lg: '1015px' },
              overflow: 'hidden',
              borderRadius: { xs: '12px', md: '16px' },
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              },
            }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={verticalIndex}
                src={verticalImages[verticalIndex]}
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-100%' }}
                transition={{
                  duration: 0.7,
                  ease: 'easeInOut'
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                }}
                alt={`Slide ${verticalIndex + 1}`}
              />
            </AnimatePresence>

            {/* Navigation Dots - Horizontal on mobile, Vertical on desktop */}
            <Box
              sx={{
                position: 'absolute',
                right: { xs: '50%', lg: '12px' },
                bottom: { xs: '12px', lg: 'auto' },
                top: { xs: 'auto', lg: '50%' },
                transform: { 
                  xs: 'translateX(50%)',
                  lg: 'translateY(-50%)'
                },
                display: 'flex',
                flexDirection: { xs: 'row', lg: 'column' },
                gap: 1.5,
                zIndex: 1,
                padding: '8px',
                borderRadius: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {verticalImages.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: { xs: 8, sm: 10 },
                    height: { xs: 8, sm: 10 },
                    borderRadius: '50%',
                    backgroundColor: index === verticalIndex 
                      ? 'primary.main' 
                      : 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.3)',
                      backgroundColor: index === verticalIndex 
                        ? 'primary.main' 
                        : 'rgba(255, 255, 255, 0.9)',
                    },
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  onClick={() => setVerticalIndex(index)}
                />
              ))}
            </Box>
          </Box>}
        </div>
      </Box>
    </div>
    </div>
  );
};

export default UserMarket;