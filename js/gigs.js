'use-strict'

let modalButtons;

function GigYear() {
    this.gigs = [];
    this.bands = [];
    this.cities = [];
    this.states = [];
    this.totalPay = 0;
    this.totalGigs = 0;
    this.paidGigs = 0;
    this.unpaidGigs = 0;
    this.averagePayPerGig = 0;
};



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
    gigData.map(gig => {
        if (gig.city !== 'NA' && gigYearObj.cities.indexOf(gig.city) === -1) {
            gigYearObj.cities.push(gig.city);
           
        }
    });
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
        let cashPay = gig.paymentType && gig.paymentType === 'C' ? gig.pay : 0;


        if (!band) {
            band = {
                name: bandName,
                gigCount: 1,
                totalPay: gig.pay ? gig.pay : 0,
                totalCashPay: cashPay,
                averagePayPerGig: gig.pay ? gig.pay : 0,
                gigs: [ gig ]
            }

            gigYearObj.bandData.push(band);
        } else {
            band.gigCount++;
            band.totalPay = band.totalPay + (gig.pay ? gig.pay : 0);
            band.totalCashPay = band.totalCashPay + cashPay;
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
    renderData(findDataByYear(data.years, data.selectedYear));
    createYearTable(data.years);
});

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
