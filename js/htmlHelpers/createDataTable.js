import { dataTableBody } from '../elements.js';

export default function createDataTable(year) {
    const html = `
        <tr>
            <td>Total # of Gigs</td>
            <td>${ year.gigyear.length }</td>
        </tr>
        <tr>
            <td>Total # of Paid Gigs</td>
            <td>${ year.paidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Unpaid Gigs</td>
            <td>${ year.unpaidGigs }</td>
        </tr>
        <tr>
            <td>Total # of Bands</td>
            <td>${ year.bandyear.length }</td>
        </tr>
        <tr>
            <td>Total # of Cities</td>
            <td>${ year.cities.length }</td>
        </tr>
        <tr>
            <td>Total # of States</td>
            <td>${ year.states.length }</td>
        </tr>
        <tr>
            <td>Total Pay</td>
            <td>${ year.totalPay }</td>
        </tr>
        <tr>
            <td>Average Pay (paid gigs only)</td>
            <td>${ year.averagePayPerGig }</td>
        </tr>
    `;
    
    dataTableBody.insertAdjacentHTML('beforeend', html);
}