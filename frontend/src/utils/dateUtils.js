/**
 * Utility function to extract formatted date and month from a date string
 * @param {string} dateString - ISO date string or any valid date format
 * @returns {Object} Object containing day and month strings
 */
export const formatDate = (dateString) => {
  if (!dateString) return { day: '01', month: 'Jan' };
  
  const date = new Date(dateString); // create a Date object from the input string (Read Readme.md)

  const day = date.getDate().toString().padStart(2, '0'); // get numeric day (1-31), convert to string, pad left with '0' to ensure 2 chars
  const months = [  // array of short month names (index 0 = Jan)
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = months[date.getMonth()];  // get month index (0-11) from Date and map to short name
  
  return { day, month };  // return an object with the padded day and month name
};

/**
 * Utility function for Diffrence in Date (Commentcard component)
 * @param {string} dateString - ISO date string or any valid date format
 * @returns {string} String of diffrence betweeen posted and current time
 */
export const formatDateDiff = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};

