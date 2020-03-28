export const gigTableBody = document.querySelector('.gig-table-body');
export const bandTableBody = document.querySelector('.band-table-body');
export const dataTableBody = document.querySelector('.data-table-body');
export const bandGigsTableBody = document.querySelector('.band-gigs-table-body');
export const yearTableBody = document.querySelector('.year-table-body');

export const radioButtons = document.querySelectorAll('input[type="radio"]');
export const years = Array.from(radioButtons).map(radio => radio.value);

export const modalInner = document.querySelector('.modal-inner');
export const modalOuter = document.querySelector('.modal-outer');
export const modalCloseButton = document.querySelector('.modal-close-button');
export const modalBandName = document.querySelector('.modal-band-name');
