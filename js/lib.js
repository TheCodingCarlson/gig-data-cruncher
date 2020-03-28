import { modalButtons } from './elements.js';
import createGigTable from './htmlHelpers/createGigTable.js';
import createBandTable from './htmlHelpers/createBandTable.js';
import createDataTable from './htmlHelpers/createDataTable.js';
import { handleModalButtonClick, closeModal } from './handlers.js';

async function fetchData() {
    const yearDataPomises = years.map(year => fetch(`./json/gig-data/${year}.json`).then(value => value.json()));
    const bandDataPromise = fetch('./json/band-data.json').then(value => value.json());
    const promises = await Promise.all([...yearDataPomises, bandDataPromise]);
    return promises;
}

export function findBandName(bands, gig) {
    const bandName = bands.find(band => band.code === gig.bandCode).name;
    return bandName;
}

export function findDataByYear(years, selectedYear) {
    const yearData = years.find(year => year.year === selectedYear);
    return yearData;
}

export async function loadData(state) {
    const rawData = await fetchData();
    const bandData = rawData[rawData.length - 1]; // band data will always be the last item in the array

    state.bands = bandData;
    
    for (let i = 0; i < rawData.length - 1; i++) {
        let yearObj = {
            year: years[i],
            data: populateYearData(rawData[i], bandData)
        }

        data.years.push(yearObj);
    }
}

export async function renderData(data) {
    clearTables([gigTableBody, bandTableBody, dataTableBody]);
    createGigTable(data.data);
    createBandTable(data.data.bandData);
    createDataTable(data.data);
    
    modalButtons = document.querySelectorAll('.modal-button');
    modalButtons.forEach(button => button.addEventListener('click', handleModalButtonClick));
}
