'use-strict'

const gigTableBody = document.querySelector('.gig-table-body');
const bandTableBody = document.querySelector('.band-table-body');
const dataTableBody = document.querySelector('.data-table-body');
const radioButtons = document.querySelectorAll('input[type="radio"]');

// State
const state = {
    selectedYear: Array.from(radioButtons).find(radio => radio.checked).value,
    gigData: [],
    bandData: [],
    bandGigData: [],
    bands: [],
    cities: [],
    states: [],
    totalPay: 0,
    totalGigs: 0,
    paidGigs: 0,
    unpaidGigs: 0,
    averagePayPerGig: 0,
};

function clearTables(tables) {
    tables.forEach(table => table.innerHTML = '');
}

function createGigTable(gigData) {
    gigData.map(gig => {
        let bandName = state.bandData.find(band => band.code === gig.bandCode).name;
        let html = `
            <tr>
                <td>${ gig.date }</td>
                <td>${ gig.venue }</td>
                <td>${ gig.city }</td>
                <td>${ gig.state }</td>
                <td>${ bandName }</td>
                <td>${ gig.pay ? gig.pay : 'NA' }</td>
            </tr>
        `;

        gigTableBody.insertAdjacentHTML('beforeend', html);
    });
}

function createBandTable(bandGigData) {
    bandGigData.map(band => {
        let bandHtml = `
            <tr>
                <td>${ band.name }</td>
                <td>${ band.gigCount }</td>
                <td>${ band.totalPay }</td>
                <td>${ band.averagePayPerGig }</td>
                <td><button>See Gigs</button></td>
            </tr>
        `;

        bandTableBody.insertAdjacentHTML('beforeend', bandHtml);
    });
}

function createDataTable(state) {
    const dataHtml = `
        <tr>
            <td>Total # of Gigs</td>
            <td>${ state.gigData.length }</td>
        </tr>
        <tr>
            <td>Total # of Paid Gigs</td>
            <td>${ state.paidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Unpaid Gigs</td>
            <td>${ state.unpaidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Bands</td>
            <td>${ state.bands.length }</td>
        </tr>
        <tr>
            <td>Total # of Cities</td>
            <td>${ state.cities.length }</td>
        </tr>
        <tr>
            <td>Total # of States</td>
            <td>${ state.states.length }</td>
        </tr>
        <tr>
            <td>Total Pay</td>
            <td>${ state.totalPay }</td>
        </tr>
        <tr>
            <td>Average Pay (paid gigs only)</td>
            <td>${ state.averagePayPerGig }</td>
        </tr>
    `;
    
    dataTableBody.insertAdjacentHTML('beforeend', dataHtml);
}

async function fetchData(url) {
    const value = await fetch(url);
    return value.json();
}

async function populateState(year) {
    state.gigData = await fetchData(`./json/gig-data/${year}.json`);
    state.bandData = await fetchData('./json/band-data.json');
    state.bandGigData = [];

    state.bands = [ ...new Set(state.gigData.map(gig => gig.bandCode)) ];
    state.cities = [ ...new Set(state.gigData.map(gig => gig.city)) ];
    state.states = [ ...new Set(state.gigData.map(gig => gig.state)) ];

    state.totalPay = state.gigData.reduce((total, gig) => {
        let pay = gig.pay ? gig.pay : 0;
        return total + pay;
    }, 0);

    state.totalGigs = state.gigData.length;
    state.paidGigs = state.gigData.filter(gig => gig.pay).length;
    state.unpaidGigs = state.gigData.filter(gig => !gig.pay).length;
    state.averagePayPerGig = Math.round(state.totalPay / state.paidGigs);

    state.gigData.map(gig => {
        let bandName = state.bandData.find(band => band.code === gig.bandCode).name;
        let band = state.bandGigData.find(band => band.name === bandName);

        if (!band) {
            band = {
                name: bandName,
                gigCount: 1,
                totalPay: gig.pay ? gig.pay : 0,
                averagePayPerGig: gig.pay ? gig.pay : 0,
                gigs: [ gig ]
            }

            state.bandGigData.push(band);
        } else {
            band.gigCount++;
            band.totalPay = band.totalPay + (gig.pay ? gig.pay : 0);
            band.averagePayPerGig = Math.round(band.totalPay / band.gigCount);
            band.gigs.push(gig);
        }
    }); 
    
    state.bandGigData.sort((a, b) => a.gigCount < b.gigCount ? 1 : -1);
    console.log(state);
    return state;
}

async function renderData(year) {
    await populateState(year);
    clearTables([gigTableBody, bandTableBody, dataTableBody]);
    createGigTable(state.gigData);
    createBandTable(state.bandGigData);
    createDataTable(state);
}

function handleRadioButtonChange(e) {
    const year = e.currentTarget.value;
    state.selectedYear = year;
    renderData(state.selectedYear);
}

radioButtons.forEach(radio => radio.addEventListener('change', handleRadioButtonChange));
window.addEventListener('load', renderData(state.selectedYear));
