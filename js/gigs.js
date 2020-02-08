'use-strict'

const gigTableBody = document.querySelector('.gig-table-body');
const bandTableBody = document.querySelector('.band-table-body');
const dataTableBody = document.querySelector('.data-table-body');
const bandGigsTableBody = document.querySelector('.band-gigs-table-body');
const yearTableBody = document.querySelector('.year-table-body');

const radioButtons = document.querySelectorAll('input[type="radio"]');
const years = Array.from(radioButtons).map(radio => radio.value);
const yearSpan = document.querySelector('.year');

const modalInner = document.querySelector('.modal-inner');
const modalOuter = document.querySelector('.modal-outer');
const modalCloseButton = document.querySelector('.modal-close-button');
const modalBandName = document.querySelector('.modal-band-name');
let modalButtons;

const data = {
    selectedYear: Array.from(radioButtons).find(radio => radio.checked).value,
    years: [],
    bands: []
};

class GigYear {
    constructor() {
        this.gigData = [];
        this.bandData = [];
        this.bands = [];
        this.cities = [];
        this.states = [];
        this.totalPay = 0;
        this.totalGigs = 0;
        this.paidGigs = 0;
        this.unpaidGigs = 0;
        this.averagePayPerGig = 0;
    }
};

function generateGigRow(gig, bandName = '') {
    let html = `
        <tr>
            <td>${ gig.date }</td>
            <td>${ gig.venue }</td>
            <td>${ gig.city }</td>
            <td>${ gig.state }</td>
            ${ bandName !== '' ? `<td>${ bandName }</td>` : '' }
            <td>${ gig.pay ? gig.pay : 'NA' }</td>
        </tr>
    `;

    return html;
}

function createGigTable(yearData) {
    yearData.gigData.map(gig => {
        let bandName = data.bands.find(band => band.code === gig.bandCode).name;
        let html = generateGigRow(gig, bandName);
        gigTableBody.insertAdjacentHTML('beforeend', html);
    });
}

function createBandTable(bandData) {
    bandData.map((band, index) => {
        let html = `
            <tr>
                <td>${ band.name }</td>
                <td>${ band.gigCount }</td>
                <td>${ band.totalPay }</td>
                <td>${ band.averagePayPerGig }</td>
                <td><button id="m-button-${ index }" class="modal-button">See Gigs</button></td>
            </tr>
        `;

        bandTableBody.insertAdjacentHTML('beforeend', html);
    });
}

function createDataTable(data) {
    const html = `
        <tr>
            <td>Total # of Gigs</td>
            <td>${ data.gigData.length }</td>
        </tr>
        <tr>
            <td>Total # of Paid Gigs</td>
            <td>${ data.paidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Unpaid Gigs</td>
            <td>${ data.unpaidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Bands</td>
            <td>${ data.bands.length }</td>
        </tr>
        <tr>
            <td>Total # of Cities</td>
            <td>${ data.cities.length }</td>
        </tr>
        <tr>
            <td>Total # of States</td>
            <td>${ data.states.length }</td>
        </tr>
        <tr>
            <td>Total Pay</td>
            <td>${ data.totalPay }</td>
        </tr>
        <tr>
            <td>Average Pay (paid gigs only)</td>
            <td>${ data.averagePayPerGig }</td>
        </tr>
    `;
    
    dataTableBody.insertAdjacentHTML('beforeend', html);
}

function createYearTable(years) {
    years.forEach(year => {
        const html = `
            <tr>
                <td>${ year.year }</td>
                <td>${ year.data.totalGigs }</td>
                <td>${ year.data.bands.length }</td>
                <td>${ year.data.cities.length }</td>
                <td>${ year.data.states.length }</td>
                <td>${ year.data.totalPay }</td>
            </tr>
        `;

        yearTableBody.insertAdjacentHTML('beforebegin', html);
    });
}

function findDataByYear() {
    return yearData = data.years.find(year => year.year === data.selectedYear);
}

async function fetchData() {
    const yearDataPomises = years.map(year => fetch(`./json/gig-data/${year}.json`).then(value => value.json()));
    const bandDataPromise = fetch('./json/band-data.json').then(value => value.json());
    const promises = await Promise.all([...yearDataPomises, bandDataPromise]);
    return promises;
}

async function loadData() {
    const rawData = await fetchData();
    const bandData = rawData[rawData.length - 1]; // band data will always be the last item in the array

    data.bands = bandData;
    
    for (let i = 0; i < rawData.length - 1; i++) {
        let yearObj = {
            year: years[i],
            data: populateYearData(rawData[i], bandData)
        }

        data.years.push(yearObj);
    }
}

function populateYearData(gigData, bandData) {
    const gigYearObj = new GigYear();

    gigYearObj.gigData = gigData;
    gigYearObj.bands = [ ...new Set(gigData.map(gig => gig.bandCode)) ];
    gigYearObj.cities = [ ...new Set(gigData.map(gig => gig.city)) ];
    gigYearObj.states = [ ...new Set(gigData.map(gig => gig.state)) ];

    gigYearObj.totalGigs = gigData.length;
    gigYearObj.totalPay = gigData.reduce((total, gig) => {
        let pay = gig.pay ? gig.pay : 0;
        return total + pay;
    }, 0);

    gigYearObj.paidGigs = gigData.filter(gig => gig.pay).length;
    gigYearObj.unpaidGigs = gigData.filter(gig => !gig.pay).length;
    gigYearObj.averagePayPerGig = Math.round(gigYearObj.totalPay / gigYearObj.paidGigs);

    gigData.map(gig => {
        let bandName = bandData.find(band => band.code === gig.bandCode).name;
        let band = gigYearObj.bandData.find(band => band.name === bandName);

        if (!band) {
            band = {
                name: bandName,
                gigCount: 1,
                totalPay: gig.pay ? gig.pay : 0,
                averagePayPerGig: gig.pay ? gig.pay : 0,
                gigs: [ gig ]
            }

            gigYearObj.bandData.push(band);
        } else {
            band.gigCount++;
            band.totalPay = band.totalPay + (gig.pay ? gig.pay : 0);
            band.averagePayPerGig = Math.round(band.totalPay / band.gigCount);
            band.gigs.push(gig);
        }
    }); 
    
    gigYearObj.bandData.sort((a, b) => a.gigCount < b.gigCount ? 1 : -1);
    return gigYearObj;
}

async function renderData(data) {
    clearTables([gigTableBody, bandTableBody, dataTableBody]);
    createGigTable(data.data);
    createBandTable(data.data.bandData);
    createDataTable(data.data);
    
    modalButtons = document.querySelectorAll('.modal-button');
    modalButtons.forEach(button => button.addEventListener('click', handleModalButtonClick));
}

function handleRadioButtonChange(e) {
    const year = e.currentTarget.value;
    data.selectedYear = year;
    renderData(findDataByYear());
    yearSpan.innerText = year;
}

function handleModalButtonClick(e) {
    const id = e.currentTarget.id;
    const index = parseInt(id.slice(9, id.length));
    const bandData = data.years.find(year => year.year === data.selectedYear).data.bandData[index];

    bandData.gigs.forEach(gig => {
        let html = generateGigRow(gig);
        bandGigsTableBody.insertAdjacentHTML('beforeend', html);
    });

    modalBandName.innerText = `${bandData.name} Gigs - ${ data.selectedYear }`;
    modalOuter.classList.add('open');
}

function closeModal() {
    modalOuter.classList.remove('open');
    clearTables([bandGigsTableBody]);
}

function clearTables(tables) {
    tables.forEach(table => table.innerHTML = '');
}

radioButtons.forEach(radio => radio.addEventListener('change', handleRadioButtonChange));
modalCloseButton.addEventListener('click', closeModal);

modalOuter.addEventListener('click', function(e) {
    const isOutside = !e.target.closest('.modal-inner');

    if (isOutside) {
        closeModal();
    }
});

window.addEventListener('load', async function() {
    await loadData();
    renderData(findDataByYear());
    createYearTable(data.years);
    yearSpan.innerText = data.selectedYear;
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
