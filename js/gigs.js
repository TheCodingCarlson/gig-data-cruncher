'use-strict'

const gigTableBody = document.querySelector('.gig-table-body');
const bandTableBody = document.querySelector('.band-table-body');
const dataTableBody = document.querySelector('.data-table-body');
const radioButtons = document.querySelectorAll('input[type="radio"]');

function createTables(year) {
    gigTableBody.innerHTML = '';
    bandTableBody.innerHTML = '';
    dataTableBody.innerHTML = '';

    try {
        (async() => {
            let [ gigData, bandData ] = await Promise.all([
                fetch(`./json/gig-data/${year}.json`).then(value => value.json()),
                fetch('./json/band-data.json').then(value => value.json())
            ]);
    
            const bands = [ ...new Set(gigData.map(gig => gig.bandCode)) ];
            const cities = [ ...new Set(gigData.map(gig => gig.city)) ];
            const states = [ ...new Set(gigData.map(gig => gig.state)) ];
            const bandGigData = [];
    
            let total = 0;
            let paidGigs = 0;
    
            gigData.map(gig => {
                let bandName = bandData.find(band => band.code === gig.bandCode).name;
                const html = `
                    <tr>
                        <td>${ gig.date }</td>
                        <td>${ gig.venue }</td>
                        <td>${ gig.city }</td>
                        <td>${ gig.state }</td>
                        <td>${ bandName }</td>
                        <td>${ gig.pay ? gig.pay : 'NA' }</td>
                    </tr>
                `;
    
                if (Object.getOwnPropertyNames(gig).indexOf('pay') > 0) {
                    paidGigs++;
                }
    
                if (!bandGigData.find(band => band.name === bandName)) {
                    let band = {
                        name: bandName,
                        gigCount: 1
                    }
    
                    bandGigData.push(band);
                } else {
                    bandGigData.find(band => band.name === bandName).gigCount++;
                }
    
                total = gig.pay ? total += gig.pay : total += 0;
                gigTableBody.insertAdjacentHTML('beforeend', html);
            });
    
            bandGigData.sort((a, b) => a.gigCount < b.gigCount ? 1 : -1);
    
            bandGigData.map(band => {
                let bandHtml = `
                    <tr>
                        <td>${ band.name }</td>
                        <td>${ band.gigCount }</td>
                    </tr>
                `;
    
                bandTableBody.insertAdjacentHTML('beforeend', bandHtml);
            });
    
            const dataHtml = `
                <tr>
                    <td>Total # of Gigs</td>
                    <td>${ gigData.length }</td>
                </tr>
                <tr>
                    <td>Total # of Paid Gigs</td>
                    <td>${ gigData.filter(gig => gig.pay).length }</td>
                </tr>
                <tr>
                    <td>Total # of Unpaid Gigs</td>
                    <td>${ gigData.filter(gig => !gig.pay).length }</td>
                </tr>
                <tr>
                    <td>Total # of Bands</td>
                    <td>${ bands.length }</td>
                </tr>
                <tr>
                    <td>Total # of Cities</td>
                    <td>${ cities.length }</td>
                </tr>
                <tr>
                    <td>Total # of States</td>
                    <td>${ states.length }</td>
                </tr>
                <tr>
                    <td>Total Pay</td>
                    <td>${ total }</td>
                </tr>
                <tr>
                    <td>Average Pay (paid gigs only)</td>
                    <td>${ Math.round(total / paidGigs) }</td>
                </tr>
            `;
    
            dataTableBody.insertAdjacentHTML('beforeend', dataHtml);
        })();
    }
    catch (err) {
        console.log(err);
    }
}

const handleRadioButtonChange = (e) => {
    let year = e.currentTarget.value;

    createTables(year);
}

radioButtons.forEach(radio => radio.addEventListener('change', handleRadioButtonChange));
window.addEventListener('load', createTables('2020'));
