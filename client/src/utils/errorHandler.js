// utils/errorHandler.js
export const errorHandler = (error, setAlertMessage, setAlertColor, handleClick) => {
    console.error(error);
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    setAlertMessage(errorMessage);
    setAlertColor('error');
    handleClick();
  };
  