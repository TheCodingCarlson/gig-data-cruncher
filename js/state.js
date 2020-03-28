import radioButtons from './elements.js';

export const state = {
    selectedYear: Array.from(radioButtons).find(radio => radio.checked).value,
    years: [],
    bands: []
};
