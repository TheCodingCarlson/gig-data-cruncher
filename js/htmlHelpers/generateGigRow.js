export default function generateGigRow(gig, bandName = '') {
    let pay = gig.pay ? gig.pay : 'NA';

    let html = `
        <tr>
            <td>${ gig.date }</td>
            <td>${ gig.venue }</td>
            <td>${ gig.city }</td>
            <td>${ gig.state }</td>
            ${ bandName !== '' ? `<td>${ bandName }</td>` : '' }
            <td>${ pay }</td>
        </tr>
    `;

    return html;
}
