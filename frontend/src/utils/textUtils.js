/**
 * Utility function to strip HTML tags from a string
 * @param {string} html - HTML string to strip tags from
 * @returns {string} Plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  // console.log('textContent:', tempDiv.textContent);
  // console.log('innerText:', tempDiv.innerText);
  return tempDiv.textContent || tempDiv.innerText || '';  // read "https://www.freecodecamp.org/news/innerhtml-vs-innertext-vs-textcontent/"
};

/**
 * Utility function to truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation (default: 200)
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 200) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Combined utility to strip HTML and truncate in one step
 * @param {string} html - HTML string to process
 * @param {number} maxLength - Maximum length after stripping HTML
 * @returns {string} Plain text, truncated if necessary
 */
export const stripAndTruncate = (html, maxLength = 200) => {
  const plainText = stripHtml(html);
  return truncateText(plainText, maxLength);
};

/**
 * Combine intials of first and last name
 * @param {string} firstname - Firstname string of user
 * @param {string} lastname - lastname string of user
 * @returns {string} comined initials of firstname and lastname
 */
export const getInitials = (firstname, lastname) => {
    const first = firstname?.charAt(0) || '';
    const last = lastname?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || '?';
};