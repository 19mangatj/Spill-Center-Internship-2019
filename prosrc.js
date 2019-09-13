const Report = require('fluentreports').Report;
const claims = require('../models/Claims');
const moment = require('moment');
const path = require('path');

function prosrcSection(report, prosrcReport) {
  console.log('in prosrcSection', prosrcReport.claim.claimId);
  report.newLine();
  report.band(
    [
      {data: 'Claim Number:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.claimId, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Client Contact', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.contactDisplay, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Date of Loss:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.incidentDate, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Company:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.company, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Time of Loss:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.incidentTime, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Client Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.phone, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Reported Date:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.reportedDate, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Contact Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.fax, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Reported Time:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.reportedTime, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Client Claim #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.clientEIN.clientClaimId, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'SC Associate:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.scAssociate, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Material Spilled:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.phone, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Date Transferred:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.dateTransferred, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Other Material:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.contactInfo.phone, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.newLine();
  report.band(
    [
      {data: 'Claim Status:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.status, width: 80, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Date Claim Closed:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.claimClosed, width: 80, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'State Telephone Rpts:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.impactInfo.isStateTelephoneReportsCompleted, width: 80, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'DOTReq:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.miscInfo.isDOTRequired, width: 80, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.newLine();
  report.band(
    [
      {data: 'Loss City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.incidentCity, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Loss Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.incidentAddress, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
  report.band(
    [
      {data: 'Loss State:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.incidentStateCode, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      {data: 'Adjuster:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
      {data: prosrcReport.claim.adjusterInfo.company, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
    ]
  );
    report.newLine();
    report.band(
      [
        {data: 'Home Terminal:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.incidentStateCode, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      ]
    );
    report.band(
      [
        {data: 'Driver First Name:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.transportationInfo.driverNameFirst, width: 90, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Trailer #:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.transportationInfo.trailerCode, width: 90, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'DIV-LOC:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.incidentDivisionLocation, width: 90, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Driver Last Name:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.transportationInfo.driverNameLast, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Tractor #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.transportationInfo.tractorCode, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Quantity Released:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.spillInfo.estQuantityReleased, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Tank Number:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.spillInfo.tankNumber, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Client Needs:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.clientNeeds, width: 400, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Duration of Release:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.causeOfIncident, width: 400, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();

    report.band(
      [
        {data: 'Generator:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: console.log(contactClaimAccess(10, 'company')), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Generator Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: console.log(contactClaimAccess(10, 'contact')), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(10, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Caller:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.company, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Caller Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.contactDisplay, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.address, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.phone, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.city, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.stateCode, width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.fax, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.contactInfo.postalCode, width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Property Name:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Property Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(8, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Cleanup Comany:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Cleanup Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Data Contacted:', width: 170, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'date'), width: 170, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Time Contacted:', width: 170, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(1, 'time'), width: 170, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}

      ]
    );
    report.band(
      [
        {data: 'KOR On Scene:', width: 170, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.impactInfo.isCleanupComplete, width: 170, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Other Courtesy Response Agency:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'CR Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'CR Division:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(6, 'division'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Police / State Police:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Police Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(4, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Police On Scene:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.impactInfo.isPoliceOnScene, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Fire:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fire Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(3, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fire On Scene:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.impactInfo.isFireOnScene, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'NRC Salutation:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.NRCInfo.contactSalutation, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'NRC Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.NRCInfo.contactFirstName + prosrcReport.claim.NRCInfo.contactLastName, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'NRC Reason:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.NRCInfo.reason, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'NRC Report #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: prosrcReport.claim.NRCInfo.reportNumber, width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'FEMA:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'FEMA Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(12, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'State LEPC:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'LEPC Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Incident #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(17, 'incident'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'State EPA:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Incident #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'incident'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(13, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'State ERC:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State ERC Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Incident #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(9, 'incident'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'State District Office:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'SD Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 160, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'zip'), width: 160, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Incident #:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(11, 'incident'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
        {data: 'Second Response:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'company'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'SR Contact:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'contact'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Address:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'address'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Phone:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'phone'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'City:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'city'), width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'State:', width: 25, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'state'), width: 25, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'Fax:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'fax'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: 'Zip:', width: 80, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'zip'), width: 80, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'SR Claim:', width: 45, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'claim'), width: 45, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: 'SR Division:', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: contactClaimAccess(7, 'division'), width: 150, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
    report.band(
      [
          {data: 'Activity', width: 100, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
          {data: 'Date', width: 60, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
          {data: 'Start Time', width: 60, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
          {data: 'Stop Time', width: 60, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
          {data: 'Hours', width: 40, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
          {data: 'Associate', width: 180, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'}
      ]
    );
    report.band(
      [
          {data: prosrcReport.timeRecordsSummary.activity, width: 100, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
          {data: moment(prosrcReport.timeRecordsSummary.logDate).format('MM/DD/YYYY'), width: 60, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
          {data: prosrcReport.timeRecordsSummary.recordDate, width: 60, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
          {data: prosrcReport.timeRecordsSummary.stopTime, width: 60, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
          {data: prosrcReport.timeRecordsSummary.hours, width: 40, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
          {data: prosrcReport.timeRecordsSummary.scAssociate, width: 180, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.band(
      [
        {data: moment(prosrcReport.timeRecordsSummary.recordDate).format('MM/DD/YYYY') + prosrcReport.timeRecordsSummary.recordStartTime, width: 300, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'},
        {data: 'Invoice Description:', width: 200, border:1, padding: 2, textColor: '#000000', fill: '#F3F3F3'}
      ]
    );
    report.band(
      [
        {data: prosrcReport.incident.intakeDetails.incDescription, width: 300, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'},
        {data: prosrcReport.timeRecordsSummary.invoiceDescription, width: 200, border:1, padding: 2, textColor: '#000000', fill: '#ffffff'}
      ]
    );
    report.newLine();
}


function claimHeader(report, prosrcReport) {

  if (prosrcReport.hasOwnProperty('claim')) {
    report.setCurrentY(40);
    report.print('ATTACHMENT/PROSRC Report', {fontSize: 18, fontBold: true, textColor: '#0A2280', x:350});
    report.setCurrentY(14);
    report.image(path.resolve(__dirname, 'sccom-logo.png'), {width: 200, x: 72});
    report.setCurrentY(80);
    report.newLine();
    report.band(
      [
        {data: 'Claim Number:', width: 100},
      ],
      {border:1, width: 0, wrap: 1, padding: 2, fill: '#DFFBE0', textColor: '#000000'}
    );
    report.band(
      [
        {data: prosrcReport.claim.claimId, width: 100}
      ],
       {border:1, width: 0, wrap: 1, padding: 2, fill: '#ffffff', textColor: '#000000'}
    );
  } else {
    console.log('skipping empty claimheader')
  }
}

function claimFooter(report, prosrcReport, state) {
  report.newLine();
  report.print('Attachments', {fontSize: 18, fontBold: true, textColor: '#163401', x:350});
  report.newLine();
  report.band(
    [
      ["Total hours for claim " + prosrcReport.claimId, 180],
      [report.totals.hours.toFixed(2), 60]
    ],
    {
      border:1, width: 0, wrap: 1, padding: 5, fill: '#ddffdd',
      fontSize: 16, fontBold: true, textColor: '#000000', addY: 10, addX: 200
    }
  );
}

function contactClaimAccess(contactTypeId, contactClaimField) {
    let contactMatch = null;
    if(prosrcReport.claimContacts.contactTypeId == contactTyeId) {
      contactMatch = prosrcReport.claimContacts;
      break;
    }
    if(contactMath) {
      if(contactClaimField == 'company') return contactMatch.company;
      if(contactClaimField == 'contact') return contactMatch.contactName;
      if(contactClaimField == 'address') return contactMatch.address1;
      if(contactClaimField == 'phone') return contactMatch.phoneNumber;
      if(contactClaimField == 'city') return contactMatch.city;
      if(contactClaimField == 'state') return contactMatch.state;
      if(contactClaimField == 'fax') return contactMatch.faxNumber;
      if(contactClaimField == 'zip') return contactMatch.postalCode;
      if(contactClaimField == 'date') return moment(contactMatch.contactedOn).format('M/D/YYYY');
      if(contactClaimField == 'time') return moment(contactMatch.contactedOn).format('LTS');
      if(contactClaimField == 'division') return contactMatch.division;
      if(contactClaimField == 'incident') return contactMatch.incidentNumber;
      if(contactClaimField == 'claim') return contactMatch.claimId;
    }
}

(async () => {
  try {
    let args = process.argv.slice(2);
    if(args.length != 1) {
      throw 'node prosrc.js claimId';
    }
    console.log('Processing claim', args[0]);

    let pdfFilePath = path.resolve(__dirname, '../../pdfs/prosrc.pdf');
    if (typeof(args[1]) != 'undefined') {
          pdfFilePath = args[1];
    }


    let prosrcReports = await claims.getFullClaimRecord(args[0]);
    if(!prosrcReports.success) {
      console.log(prosrcReports);
      throw 'Claim access error';
    }

    console.log(prosrcReports);

    // Create a reportTitle
    var rpt = new Report(pdfFilePath)
      .fontSize(10)
      .landscape(false)
      .data(prosrcReports)

      .detail(prosrcSection);
    rpt.groupBy('claimId')
      .sum('hours')
      .header(claimHeader)
      .footer(claimFooter);
    rpt.render(function () {
      console.log('Report rendered');
      process.exit();
    });
  } catch(err) {
      console.log("Report task failed:", err);
  }
})();
