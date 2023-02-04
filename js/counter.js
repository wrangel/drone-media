// This is pure cliient-side, using the Web Storage API (window.localStorage()). Across user persistence is not given.
// IndexedDB (window.indexedDB()) will not help either, because it is still  on client side

// Global variable (with NULL coalescing: either take existing count, or start from 0)
let count = +localStorage.getItem('count') ?? 0;
            
// Save the present count
const saveCount = () => localStorage.setItem('count', count); // reset by replacing count by 0
            
// Fill in the html div element
const updateCount = () => document.getElementById('media-counter').innerText = count + ' views';
 
// Count one up, update count, and save global page count on this element
const countUp = () => {
      count = count + 1;
      updateCount();
      saveCount();
      }
            
updateCount();