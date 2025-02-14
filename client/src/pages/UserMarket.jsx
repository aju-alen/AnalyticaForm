import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Check, X, AlertCircle, Users, BarChart } from "lucide-react";
import { Region, Industries, EducationLevels, Experience, Position } from "../utils/user-mock-count";
import { axiosWithAuth } from "../utils/customAxios";
import { backendUrl } from "../utils/backendUrl";
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
const images = [
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner1.jpg', // Replace with your image URLs
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner2.jpg',
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner3.jpg',
];

const verticalImages = [
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/ANALYTICA-POTRAIT1.jpg',
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/ANALYTICA-POTRAIT1.jpg',
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/ANALYTICA-POTRAIT1.jpg',
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
  console.log(userData, 'userData');

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [verticalIndex, setVerticalIndex] = React.useState(0);

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
    }, 4000);

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
      setFinalUsersCount(result);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    let totalPrice = 0;

    if (users <= 500) {
      totalPrice = users * 30;
    } else if (users <= 1000) {
      totalPrice = (500 * 30) + ((users - 500) * 20);
    } else {
      totalPrice = (500 * 30) + (500 * 20) + ((users - 1000) * 10);
    }

    return totalPrice;
  };

  const ResultsView = () => {
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState("");
    const [price, setPrice] = useState(0);

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

    return (
      <div
        className="text-center space-y-6"
      >
{ finalUsersCount < 1000 || finalUsersCount > 14000 ?(
   <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg text-white">
   <h2 className="text-xl font-semibold mb-2">Yes! We can cater to your needs</h2>
   <div className="text-xl font-bold">Talk to our sales team to get you sorted</div>
   <Button
    variant="contained"
   className="text-blue-100 mt-2"
   onClick={() => navigate('/contact-us')}
   >Contact Sales</Button>
 </div>
)
:       <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-lg text-white">
          <h2 className="text-2xl font-semibold mb-2">Total Addressable Market</h2>
          <div className="text-5xl font-bold">{finalUsersCount.toLocaleString()}</div>
          <p className="text-blue-100 mt-2">Estimated Users</p>
        </div>
        }

       {finalUsersCount >= 1000 && finalUsersCount <=14000 && <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter number of users (1 - {finalUsersCount.toLocaleString()})
          </label>
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
                  Selected: {parseInt(userInput).toLocaleString()} users
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                <p className="text-sm font-semibold">
                  Total Price: {price.toLocaleString()} AED
                </p>
                <div className="mt-2 text-xs text-blue-600 text-left">
                  <p>Pricing Breakdown:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {parseInt(userInput) <= 500 ? (
                      <li>{userInput} users × 30 AED</li>
                    ) : (
                      <>
                        <li>First 500 users × 30 AED</li>
                        {parseInt(userInput) <= 1000 ? (
                          <li>{parseInt(userInput) - 500} users × 20 AED</li>
                        ) : (
                          <>
                            <li>Next 500 users × 20 AED</li>
                            <li>{parseInt(userInput) - 1000} users × 10 AED</li>
                          </>
                        )}
                      </>
                    )}
                  </ul>
                </div>
                {/* <form action="https://analyticaform-api.onrender.com/api/stripe/market/create-checkout-session" method="POST"> */}
                <form action="http://localhost:3001/api/stripe/market/create-checkout-session" method="POST">
                  {/* Add a hidden field with the lookup_key of your Price */}
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
                  <button id="checkout-and-portal-button" type="submit" variant='contained'>
                    Proceed to checkout
                  </button>
                </form>
              </div>
              </div>
            
          )}
        </div>}
        {/* 
        selectedRegions,
  selectedIndustries,
  selectedEducationLevels,
  selectedPositions,
  selectedExperience, */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      </div>
    );
  };



  return (
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
              objectFit: 'cover',
              position: 'absolute',
            }}
            alt={`Slide ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Navigation Dots */}
        <Box
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
        </Box>

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
      <div className="max-w-6xl mx-auto px-4 flex gap-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 flex-1 transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Market Size Calculator
          </h1>

          {activeStep < steps.length && (
            <div className="mb-12">
              <ProgressIndicator />
            </div>
          )}

          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="min-h-[400px]"
          >
            {activeStep === steps.length ? (
              <ResultsView />
            ) : (
              <>
                <SelectionStep step={activeStep} />

                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setActiveStep(prev => prev - 1)}
                    disabled={activeStep === 0}
                    className={`
                      flex items-center px-4 py-2 rounded-lg transition-colors
                      ${activeStep === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                        'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
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
                      flex items-center px-4 py-2 rounded-lg transition-colors
                      ${getSelectionState(activeStep)[0].length === 0 ?
                        'bg-gray-100 text-gray-400 cursor-not-allowed' :
                        'bg-blue-500 text-white hover:bg-blue-600'}
                    `}
                  >
                    {activeStep === steps.length - 1 ? 'Calculate' : 'Next'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Vertical Slider with improved styling */}
        <Box
          sx={{
            position: 'relative',
            width: '159px',
            height: '1015px',
            overflow: 'hidden',
            borderRadius: '16px',
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
              alt={`Vertical Slide ${verticalIndex + 1}`}
            />
          </AnimatePresence>

          {/* Improved Navigation Dots */}
          <Box
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
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
                  width: 10,
                  height: 10,
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
        </Box>
      </div>
    </div>
  );
};

export default UserMarket;