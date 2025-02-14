import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const VerticalImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  return (
    <Box
      sx={{
        position: 'relative',
        height: {
          xs: '300px',
          sm: '400px',
          md: '500px'
        },
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
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
          alt={`Slide ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* Navigation Dots - Vertical */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: 2, sm: 3, md: 4 },
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: { xs: 8, sm: 10 },
              height: { xs: 8, sm: 10 },
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
          />
        ))}
      </Box>

      {/* Touch swipe area */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          touchAction: 'pan-x pinch-zoom',
        }}
        component="div"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          setTouchStart(touch.clientY);
        }}
        onTouchMove={(e) => {
          if (!touchStart) return;

          const touch = e.touches[0];
          const diff = touchStart - touch.clientY;

          if (Math.abs(diff) > 50) {
            if (diff > 0) {
              setCurrentIndex((prev) => (prev + 1) % images.length);
            } else {
              setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
            setTouchStart(null);
          }
        }}
        onTouchEnd={() => {
          setTouchStart(null);
        }}
      />

      {/* Navigation Arrows - Vertical */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          pointerEvents: 'none',
        }}
      >
        {['up', 'down'].map((direction) => (
          <IconButton
            key={direction}
            onClick={() => {
              if (direction === 'up') {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
              } else {
                setCurrentIndex((prev) => (prev + 1) % images.length);
              }
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              pointerEvents: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              },
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            {direction === 'up' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default VerticalImageSlider;