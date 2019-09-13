const {mainPool, mysql} = require('../db-connection');
const config = require('config');
const logger = require('../lib/logger');
const utils = require('../lib/data-utils');
const documents = require('./Documents');
const incidents = require('./Incidents');

const moment = require('moment');
const addressParser = require('parse-address');
const fs = require('fs').promises;
const path = require('path');

class Claims {


    /**
     * Retrieves all time records for a specified claim.
     * @param {string} claimId - Id of the claim
     * @returns {Object} status object with data or error,
     */
    async getAllClaimTimeRecords(claimId) {
        let sql = 'SELECT * FROM sccom_time_records WHERE claimId = ?';
        let params = [claimId];
        let result = {};
        try {
            let [timeRecords, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: timeRecords};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async getAllClaimTimeRecordsSummary(claimId) {
        let sql = 'SELECT id, activity, scAssociate, recordDate, recordStartTime, invoiceDescription,';
        sql += ' isInvoiced, rulesType FROM sccom_time_records WHERE claimId = ?';
        let params = [claimId];
        //logger.debug('getAllClaimTimeRecordsSummary', sql, params);
        let result = {};
        try {
            let [timeRecords, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: timeRecords};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async getTimeRecordActivitySets() {
        let sql = 'SELECT * FROM sccom_time_record_activity_sets';
        let params = [];
        //logger.debug('getAllClaimTimeRecordsSummary', sql, params);
        let result = {};
        try {
            let [timeRecordActivities, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: timeRecordActivities};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    async getAllClaimContacts(claimIndex) {
        let sql = 'SELECT * FROM sccom_claim_contacts WHERE claimIndex = ?';
        let params = [claimIndex];
        //logger.debug('getAllClaimTimeRecordsSummary', sql, params);
        let result = {};
        try {
            let [clientContacts, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: clientContacts};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async getClaimContact(contactId) {
        let sql = 'SELECT * FROM sccom_claim_contacts WHERE id = ?';
        let params = [contactId];
        //logger.debug('getAllClaimTimeRecordsSummary', sql, params);
        let result = {};
        try {
            let [clientContacts, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: clientContacts.length ? clientContacts[0] : null};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async scanClaimContacts(query) {
        let sql = `SELECT id, contactTypeId, contactName, company, city, state
                        FROM sccom_claim_contacts
                        WHERE contactName LIKE ?
                            OR company LIKE ?
                            OR city LIKE ?
                            OR state LIKE ?
                        ORDER BY contactName LIMIT 201`;
        let queryWildcard = '%' + query + '%';
        let params = [queryWildcard, queryWildcard, queryWildcard, queryWildcard];

        //logger.debug('getAllClaimTimeRecordsSummary', sql, params);
        let result = {};
        try {
            let [claimContacts, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: claimContacts};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    /**
     * Retrieves a single time record for a claim.  This is designed to walk
     * through the set of time records in indexed (arrival) order (based on the
     * auto-assigned row id)  so you provide a starting point reference and it will
     * locate either the requested record or an adjacent time record.
     * @param {string} claimId - Id of the claim
     * @param {int} indexId - Reference point for the set of time records (use 0 to start)
     * @param {string} nextPrev - Either 'next', 'prev', 'equal' to retrieve the appropriate adjacent
     * time record.
     * @returns {Object} status object with data or error.  Data is null for no match.
     */
    async getSingleClaimTimeRecord(claimId, indexId, prevNext) {
        let sql = 'SELECT * FROM sccom_time_records WHERE claimId = ?';
        if (prevNext == 'prev') {
            sql += ' AND id < ?';
        } else if (prevNext == 'next') {
            sql += ' AND id > ?';
        } else if (prevNext == 'equal') {
            sql += ' AND id = ?';
        }
        sql += ' LIMIT 1';
        let params = [claimId, indexId];
        let result = {};
        try {
            let [claims, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: claims.length ? claims[0] : null};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async saveClaimTimeRecord(op, timeRecord) {
        let sql;
        let params = [];
        let result;

        // Prepare record for MySQL

        // Stringify JSON objects
        let jsonFields = ['customInfo'];
        jsonFields.forEach((f) => {
            timeRecord[f] = timeRecord.hasOwnProperty(f) ? JSON.stringify(timeRecord[f]) : '{}';
        });

        // Get rid of extraneous fields
        let extraneousFields = [];
        extraneousFields.forEach((f) => {
            if (timeRecord.hasOwnProperty(f)) {
                delete timeRecord[f];
            }
        });

        if (op == 'add') {
            sql = 'INSERT INTO sccom_time_records SET ?';
            params.push(timeRecord);
        } else {
            sql = 'UPDATE sccom_time_records SET ? WHERE id = ?';
            params.push(timeRecord);
            params.push(timeRecord.id);
        }

        try {
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, dbStatus: dbStatus};
            if (op == 'add') {
                result.id = dbStatus.insertId;
            } else {
                result.id = timeRecord.id;
            }
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async scanClaimRecords(query) {
        let sql = `SELECT id, claimId, incidentCity, contactInfo->'$.company' as company,
                            contactInfo->'$.contactDisplay' as contactName,
                            incidentDate,
                            status
                      FROM sccom_claims`;
        let params = [];
        let sqlOrder = '';
        if (query.toLowerCase() == 'recent') {
            sqlOrder = ` ORDER BY id DESC LIMIT 20`;
        } else {
            sql += ` WHERE claimId LIKE ? OR LOWER(contactInfo->'$.company') LIKE LOWER(?) OR
                        LOWER(contactInfo->'$.contactDisplay') LIKE LOWER(?) OR
                        LOWER(incidentCity) LIKE LOWER(?)`;

            sqlOrder = ` ORDER BY id DESC LIMIT 100`;
            let queryWildcard = '%' + query + '%';

            params = [query+'%', queryWildcard, queryWildcard, queryWildcard];
        }
        let result = {};
        // If the query is a number, serach the id space
        if (!isNaN(query)) {
            sql += ' OR id = ? ';
            params.push(query);
        }
        sql += sqlOrder;
        try {
            let [claims, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: claims};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }




    /**
     * Retrieves an augmented set of incident claim records based on a filter specification.
     * The filter can have the following (optional) properties:
     *     afterIncidentDate
     *     beforeIncidentDate
     *     scAssociate
     *     clientContact
     *     clientCompany
     *     claimId
     *     status
     *
     * Queries in the filter are ANDed together.
     *
     * @param {Object} filter - specification of what records to retrieve.
     * @returns {Object} status object with data or error,
     */
    async getClaims(filter) {
        let sql = "SELECT C.*, K1.mapValue AS incidentMaterialName ";
        sql += " FROM sccom_claims AS C ";
        sql += " LEFT JOIN sccom_kvmap AS K1 ON K1.mapId = 'material' AND K1.mapKey = C.materialId ";

        let where = '';
        let params = [];

        if (filter.hasOwnProperty('afterIncidentDate') && filter.afterIncidentDate.length) {
            where = utils.appendWhere(where, 'and', "incidentDate >= ?");
            params.push(filter.afterIncidentDate);
        }

        if (filter.hasOwnProperty('beforeIncidentDate') && filter.beforeIncidentDate.length) {
            where = utils.appendWhere(where, 'and', "incidentDate <= ?");
            params.push(filter.beforeIncidentDate)
        }

        if (filter.hasOwnProperty('scAssociate') && filter.scAssociate.length) {
            where = utils.appendWhere(where, 'and', "scAssociate = ?");
            params.push(filter.scAssociate);
        }

        if (filter.hasOwnProperty('clientContact') && filter.clientContact.length) {
            where = utils.appendWhere(where, 'and', "contactInfo->'$.contactDisplay' = ?");
            params.push(filter.clientContact);
        }

        if (filter.hasOwnProperty('clientCompany') && filter.clientCompany.length) {
            where = utils.appendWhere(where, 'and', "contactInfo->'$.company' = ?");
            params.push(filter.clientCompany);
        }

        if (filter.hasOwnProperty('claimId') && filter.claimId.length) {
            where = utils.appendWhere(where, 'and', "claimId = ?");
            params.push(filter.claimId);
        }

        if (filter.hasOwnProperty('status') && filter.status.length) {
            where = utils.appendWhere(where, 'and', "contactInfo->'$.status' = ?");
            params.push(filter.status);
        }

        sql += where;

        logger.debug(sql);

        let result = {};
        try {
            let [incidents, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: incidents};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }

    async scanClaimsClientNeeds(query) {
        let sql = "SELECT DISTINCT clientNeeds FROM sccom_claims WHERE clientNeeds LIKE ? ORDER BY clientNeeds";
        let params = ['%' + query + '%'];

        let result = {};
        try {
            let [incidents, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: incidents};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async getFullClaimRecord(claimId) {
        let sql = `SELECT C.*, K1.mapValue AS incidentMaterialName,
                (SELECT COUNT(*) FROM sccom_client_documents AS cd WHERE cd.clientId = C.customerId) AS docCount
            FROM sccom_claims AS C
            LEFT JOIN sccom_kvmap AS K1 ON K1.mapId = 'material' AND K1.mapKey = C.materialId
            WHERE claimId = ? LIMIT 1`;



        let params = [claimId];

        let result = {};
        try {
            let [claim, _fields] = await mainPool.query(sql, params);
            result = {
                success: true,
                claim: claim.length ? claim[0] : null,
                timeRecordsSummary: [],
                claimContacts: [],
                incident: null
            };
        } catch(err) {
            result = {success: false, error: err};
        }

        if (result.claim) {
            // Now we have the core claim information.  Time to augment it a bit.
            // First, time records
            let timeRecordsResult = await this.getAllClaimTimeRecordsSummary(claimId);
            if (timeRecordsResult.success) {
                result.timeRecordsSummary = timeRecordsResult.data;
            }
            // Then claim contacts
            let contactsResult = await this.getAllClaimContacts(result.claim.id);
            if (contactsResult.success) {
                result.claimContacts = contactsResult.data;
            }
            // Incident
            let incidentResult = await incidents.get(result.claim.incomingId);
            if (incidentResult.success) {
                result.incident = incidentResult.data;
            }
        }

        return result;
    }

    async saveClaimRecord(op, claimRecord) {
        let sql;
        let params = [];
        let newClaimId;
        let result;

        // Prepare record for MySQL

        // Stringify JSON objects
        let jsonFields = [
            'shipperInfo','consigneeInfo','originInfo','destinationInfo','spillInfo',
            'impactInfo','NRCInfo','transportationInfo','contactInfo','adjusterInfo',
            'customInfo','HMIRPInfo','miscInfo'
        ];
        jsonFields.forEach((f) => {
            claimRecord[f] = claimRecord.hasOwnProperty(f) ? JSON.stringify(claimRecord[f]) : '{}';
        });

        // Get rid of extraneous fields
        let extraneousFields = ['incidentMaterialName', 'incidentStateName'];
        extraneousFields.forEach((f) => {
            if (claimRecord.hasOwnProperty(f)) {
                delete claimRecord[f];
            }
        });

        claimRecord.lastActivity = new Date();
        if (op == 'add') {
            sql = 'INSERT INTO sccom_claims SET ?';
            // Allocate a new claimId ... temporary hack
            let startOfDay = moment().startOf('day');
            let now = moment();
            let secondsOfDay = now.diff(startOfDay,'seconds');
            newClaimId = 'X'+moment().format('YYMMDD')+secondsOfDay;
            logger.info('generated claim id', newClaimId);
            claimRecord.claimId = newClaimId;
            claimRecord.claimCreated = new Date();
            claimRecord.status = 'open';
            params.push(claimRecord);
        } else {
            sql = 'UPDATE sccom_claims SET ? WHERE id = ?';
            params.push(claimRecord);
            params.push(claimRecord.id);
        }

        try {
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, dbStatus: dbStatus};
            if (op == 'add') {
                result.claimId = newClaimId;
                result.id = dbStatus.insertId;
            } else {
                result.claimId = claimRecord.claimId;
                result.id = claimRecord.id;
            }
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    async createClaimFromIncident(incidentId) {

        logger.debug('creating claim from', incidentId);
        let incidentResult = await incidents.get(incidentId);
        if (!incidentResult.success) {
            logger.debug('incident retrieval error', incidentResult);
            return incidentResult;
        }
        if (incidentResult.data == null) {
            logger.debug('incident retrieval: no incident', incidentResult);
            return incidentResult;
        }
        let incident = incidentResult.data;
        logger.debug('working with incident', incident);
        // Create a shell of a claim record
        let claim = {
            adjusterInfo: {},
            contactInfo: {
            },
            status: 'open',
            transportationInfo: {},
            spillInfo: {},
            impactInfo: {},
            NRCInfo: {},
            totalCost: 0.00,
            incidentCounty: '',
            incidentPostalCode: '',
            incidentDivisionLocation: '',
            clientEIN: '',
            isVoided: 0,
            isWebRequest: 0,
            invoiceLock: 0,
            isReallyInvoiced: 0,
            isRulesEnginePassed: 0,
            isRulesEngineLocked: 0
        }

        // Now begins the mysterious process of shuffling intake data into claim data...

        claim.incomingId = incident.incomingId;
        claim.intakeSkinId = incident.skinId;

        if (incident.skinId == 'chubbcyber') {
            claim.claimFlow = 'Cyber';
        } else {
            claim.claimFlow = 'EnvSpill';
        }

        claim.incidentDate = incident.timeStamp;
        claim.incidentTime = moment(incident.timeStamp).format('hh:mm');

        // Divine the location and break it up into pieces
        let location = '';
        if (incident.geoDetails.address) {
            location = incident.geoDetails.address;
        } else {
            location = incident.intakeDetails.incLocation;
        }
        if (location) {
            let parsedLocation = addressParser.parseLocation(location);
            logger.debug('parsed address', location, parsedLocation);
            // Defaulting to US for now
            claim.incidentCountryCode = 'US';
            if (parsedLocation.city) { claim.incidentCity = parsedLocation.city; }
            if (parsedLocation.state) { claim.incidentStateCode = parsedLocation.state; }
            if (parsedLocation.zip) { claim.incidentPostalCode = parsedLocation.zip; }
            claim.incidentAddress = '';
            if (parsedLocation.number) { claim.incidentAddress += parsedLocation.number + ' '}
            if (parsedLocation.prefix) { claim.incidentAddress += parsedLocation.prefix + ' '}
            if (parsedLocation.street) { claim.incidentAddress += parsedLocation.street + ' '}
            if (parsedLocation.type) { claim.incidentAddress += parsedLocation.type + ' '};
            claim.incidentAddress = claim.incidentAddress.trim();
        }


        if (incident.intakeDetails.incNeeds) {
            claim.clientNeeds = incident.intakeDetails.incNeeds;
        }


        // Cyber claims have fixed materials.
        if (claim.claimFlow == 'Cyber') {
            claim.materialId = 3434;
            claim.materialTypeId = 2;
        }

        logger.debug('proposed claim', claim);

        let createResult = await this.saveClaimRecord('add', claim);
        if (!createResult.success) {
            return createResult;
        }
        //logger.debug('created', createResult);

        // Add in some contacts

        let callerRecord = {
            claimIndex: createResult.id,
            contactTypeId: 15
        }
        let anyCallerInfo = false;
        if (incident.intakeDetails.callerName) {
            callerRecord.contactName = incident.intakeDetails.callerName;
            anyCallerInfo = true;
        }
        if (incident.intakeDetails.callerCompany) {
            callerRecord.company = incident.intakeDetails.callerCompany;
            anyCallerInfo = true;
        }
        if (incident.intakeDetails.callerPhone) {
            callerRecord.phoneNumber = incident.intakeDetails.callerPhone;
            anyCallerInfo = true;
        }
        if (incident.intakeDetails.callerEmail) {
            callerRecord.emailAddress = incident.intakeDetails.callerEmail;
            anyCallerInfo = true;
        }

        if (anyCallerInfo) {
            logger.debug('proposed contact', callerRecord);
            let contactStatus = await this.saveClaimContactRecord('add', callerRecord);
            logger.debug('contact status', contactStatus);
        }

        return createResult;

    }


    async getFullClientContactRecord(contactId) {
        let sql = "SELECT * FROM sccom_client_contacts ";
        sql += " WHERE id = ? LIMIT 1";

        let params = [contactId];

        let result = {};
        try {
            let [contacts, _fields] = await mainPool.query(sql, params);
            result = {
                success: true,
                contact: contacts.length ? contacts[0] : null,
                subscriptionFeeSchedule: []
            };
        } catch(err) {
            result = {success: false, error: err};
        }

        // Now we have the core claim contact information.  Time to augment it a bit.
        // Subscription fee schedule:
        let subscriptionResult = await this.getAllContactSubscriptionInfo(contactId);
        if (subscriptionResult.success) {
            result.subscriptionFeeSchedule = subscriptionResult.data;
        }

        return result;
    }


    async scanClientContacts(query) {
        let sql = "SELECT id, displayName, companyName, title FROM sccom_client_contacts ";
        sql +=       "WHERE companyName LIKE ? OR displayName LIKE ? ORDER BY displayName LIMIT 201";
        let queryWildcard = '%' + query + '%';
        let params = [queryWildcard, queryWildcard];

        let result = {};
        try {
            let [contacts, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: contacts};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }

    async getCarrier(carrierId) {
        let sql = 'SELECT * FROM sccom_carriers WHERE id = ?';
        let params = [carrierId];
        let result = {};
        logger.debug('getCarrier', sql, params);
        try {
            let [carrier, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: carrier.length ? carrier[0] : null};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    /**
     * Retrieves a set of client contacts for display in an index.
     * Returned fields are currently fixed (easy enough to add to or change)
     * Supports string searches, sorting and pagination.
     *
     * @param {string} activeFilter - active, inactive or all.  Defaults to all.
     * @param {string} sortField - which column to sort results by.  See sortableColumns array for permitted fields.
     * @param {string} sortOrder - A:ascending, D:descending
     * @param {string} filter - A string to search content by.  Only a subset of columns are searched.
     * @param {number} pageSize - How many rows to return per request
     * @param {number} pageNumber - Which page to display.  First page is 1.
     * @returns {success: {Boolean}, maxrows: {number}, data: [rows] - Returns matching rows and a maximum count for the conditions
     */
    async listClientContacts(activeFilter, sortField, sortOrder, filter, pageSize, pageNumber) {

        // Limit columns to sort by
        let sortableColumns = [
            'id', 'displayName', 'firstName', 'lastName', 'companyName', 'phoneNumber',
            'clientEIN', 'city', 'stateCode', 'countryCode', 'postalCode',
            'lastEdited', 'createdOn'
        ];

        // Set up base queries: one for total rows, the other returning the data

        let countSql = `SELECT COUNT(*) AS c FROM sccom_client_contacts`;
        let countParams = [];

        let sql = `SELECT id, isActive, displayName, companyName, phoneNumber, emailAddress, clientEIN, lastEdited,
                    (SELECT COUNT(*) FROM sccom_client_documents AS cd WHERE cd.clientId = con.id) AS chiDocs
                    FROM sccom_client_contacts AS con`;
        let params = [];

        // Build the WHERE clause for filtering

        let whereClause = ' WHERE';

        if (activeFilter == 'active') {
            whereClause += ' isActive = 1';
        } else if (activeFilter == 'inactive') {
            whereClause += ' isActive = 1';
        } else {
            whereClause += ' 1'
        }
        if (filter) {
            whereClause += ' AND (';
            let queryWildcard = '%' + filter + '%';

            whereClause += ' displayName LIKE ?';
            params.push(queryWildcard);
            countParams.push(queryWildcard);

            for (const col of ['companyName','phoneNumber', 'emailAddress', 'clientEIN']) {
                whereClause += ' OR ' + col + ' LIKE ?';
                params.push(queryWildcard);
                countParams.push(queryWildcard);
            }

            // If we filter for just a number, include id in the search criteria
            if (!isNaN(filter)) {
                whereClause += ' OR id = ?';
                params.push(filter);
                countParams.push(filter);
            }
            whereClause += ')';

        }

        // Apply WHERE clause to queries
        countSql += whereClause;
        sql += whereClause;

        // Apply paging and sorting to primary query
        let orderDirection = (sortOrder == 'D') ? "DESC" : "ASC";
        let orderBy = 'id'; // Default order
        if (sortableColumns.includes(sortField)) {
            orderBy = sortField;
        }
        sql += ' ORDER BY ' + orderBy + ' ' + orderDirection;
        let limit1 = (pageNumber - 1) * pageSize;
        let limit2 = pageSize;
        sql += ' LIMIT ?,?';
        params.push(limit1, limit2);

        //logger.debug(sql, params);

        let result = {};
        try {
            let [countResult] = await mainPool.query(countSql, countParams);
            let [contacts, _fields] = await mainPool.query(sql, params);
            result = {success: true, maxRows: countResult[0].c, data: contacts};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    /**
     * Adds a document (typically a PDF file) for a client contact.  Stores a versioned copy in
     * the sccom_client_documents table.
     *
     * @param {number} clientId - id from sccom_client_contacts
     * @param {string} documentType - type of document (e.g., ClaimHandlingInstructions)
     * @param {string} fileName - Ideally the original file name of the source document
     * @param {string} mimeType - MIME type of the content (e.g., application/pdf)
     * @param {number} version - Version number to assign this document.  If 0 the version number is auto incremented
     * @param {Buffer} content - Buffer with file content (binary)
     * @returns {success: {Boolean}, version: {number}, id: {number} - Returns version number assigned and generated id.
     */
    async addClientContactDocument(clientId, documentType, fileName, mimeType, version, content) {
        let versionSql = `SELECT version FROM sccom_client_documents
                                WHERE clientId = ? AND documentType = ?
                                ORDER BY version DESC
                                LIMIT 1`;
        let versionParams = [clientId, documentType];

        let sql = `INSERT INTO sccom_client_documents SET ?`;
        let result;
        let dataSet = {
            clientId: clientId,
            documentType: documentType,
            fileName: fileName,
            mimeType: mimeType,
            version: version,
            notes: '',
            content: content
        }
        let params = [dataSet];
        try {
            // Autoincrement the version number
            if (version <= 0) {
                let [versionsAudit] = await mainPool.query(versionSql, versionParams);
                if (versionsAudit.length) {
                    dataSet.version = parseInt(versionsAudit[0].version) + 1;
                } else {
                    dataSet.version = 1;
                }
            }
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, version: dataSet.version, id: dbStatus.insertId, dbStatus: dbStatus};
            result.id = dbStatus.insertId;
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    /**
     * Deletes a document (typically a PDF file) for a client contact.
     *
     * @param {number} clientId - id from sccom_client_contacts
     * @param {string} documentType - type of document (e.g., ClaimHandlingInstructions)
     * @param {number} version - Version number to assign this document.  If 0 the version number is auto incremented
     * @returns {success: {Boolean}, dbStatus: {Object} - Returns status
     */
    async deleteClientContactDocument(clientId, documentType, version) {
        let sql = `DELETE FROM sccom_client_documents
                        WHERE clientId = ? AND documentType = ? AND version = ?`;
        let result;
        let params = [clientId, documentType, version];
        try {
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, dbStatus: dbStatus};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    /**
     * Retrieves a versioned document (typically a PDF file) for a client contact.
     *
     * @param {number} clientId - id from sccom_client_contacts
     * @param {string} documentType - type of document (e.g., ClaimHandlingInstructions)
     * @param {number} version - Desired version number for the document.  If 0 the highest version number is returned.
     * @param {Boolean} docBoolean - If true, don't return the content, return if it exists or not.
     * @returns {success: {Boolean}, versionCount: {number}, versions: [number], doc: {something} - Returns document record or
     * null if it doesn't exist (or true/false if docBoolean was requested).  Also returns how many total versions there are and
     * an array of the version numbers present.
     */
    async getClientContactDocument(clientId, documentType, version, docBoolean=false) {
        // Get count and list of available versions for this documentType
        let countSql = `SELECT version FROM sccom_client_documents WHERE clientId = ? AND documentType = ?`;
        let countParams = [clientId, documentType];

        let sql;
        // Version 0 (or negative) returns the most recent version of the documentType.
        let params = [clientId, documentType];
        if (version <= 0) {
            sql = `SELECT * FROM sccom_client_documents WHERE clientId = ? AND documentType = ? ORDER BY version DESC LIMIT 1`;
        } else {
            sql = `SELECT * FROM sccom_client_documents WHERE clientId = ? AND documentType = ? AND version = ? LIMIT 1`;
            params.push(version);
        }

        let result = {};
        try {
            let [versionsAudit] = await mainPool.query(countSql, countParams);
            let [document, _fields] = await mainPool.query(sql, params);
            let versions = [];
            for (const v of versionsAudit) {
                versions.push(v.version);
            }
            result = {
                success: true,
                versionCount: versions.length,
                versions: versions,
                doc: document.length ? document[0] : null
            };
            // Change the doc to a presence boolean vs binary content.
            if (docBoolean) {
                result.doc = result.doc ? true : false;
            }
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    /**
     * Retrieves list of all documents metadata (no content)
     *
     * @param {number} clientId - id from sccom_client_contacts
     * @param {string} documentType - type of document (e.g., ClaimHandlingInstructions), if empty return all docTypes
     * @returns {success: {Boolean}, docs: [rows] - matching rows (minus content)
     */
    async getClientContactDocumentSet(clientId, documentType) {

        let sql = `SELECT clientId, documentType, version, fileName, createdOn, mimeType
                FROM sccom_client_documents
                WHERE clientId = ? `;
        let params = [clientId];
        if (documentType.length) {
            sql += `AND documentType = ? `;
            params.push(documentType);
        }
        sql += `ORDER BY documentType, version`;
        let result = {};
        try {
            let [documents, _fields] = await mainPool.query(sql, params);
            result = {
                success: true,
                docs: documents.length ? documents : null
            };
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }




    async saveClaimContactRecord(op, contactRecord) {
        let sql;
        let params = [];
        let result;

        // Prepare record for MySQL

        // Get rid of extraneous fields
        let extraneousFields = [];
        extraneousFields.forEach((f) => {
            if (contactRecord.hasOwnProperty(f)) {
                delete contactRecord[f];
            }
        });

        if (op == 'add') {
            sql = 'INSERT INTO sccom_claim_contacts SET ?';
            if (contactRecord.hasOwnProperty('id')) { delete contactRecord['id']; }
            params.push(contactRecord);
        } else {
            sql = 'UPDATE sccom_claim_contacts SET ? WHERE id = ?';
            params.push(contactRecord);
            params.push(contactRecord.id);
        }

        try {
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, dbStatus: dbStatus};
            if (op == 'add') {
                result.id = dbStatus.insertId;
            } else {
                result.id = contactRecord.id;
            }
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    async getAllContactSubscriptionInfo(contactId) {
        let sql = 'SELECT * FROM sccom_client_subscriptions WHERE clientId = ?';
        let params = [contactId];
        let result = {};
        try {
            let [subscriptions, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: subscriptions};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }




    // TODO:  THIS CODESET STUFF REALLY BELONGS IN ITS OWN MODEL CLASS

    /**
     * Retrieves code mappings from the sccom_kvmap table based on a filter.
     * The filter needs the following property:
     *     mapId
     *
     * @param {Object} filter.mapId - Which code map to return.
     * @returns {Object} status object with data or error,
     */
    async getCodeMaps(filter) {
        let sql = "SELECT mapKey, mapValue, mapInfo FROM sccom_kvmap ";

        let where = '';
        let params = [];
        let mapId = '';

        if (filter.hasOwnProperty('mapId') && filter.mapId.length) {
            mapId = filter.mapId;
        }

        where = utils.appendWhere(where, 'and', "mapId = ?");
        params.push(mapId);

        sql += where;

        logger.debug(sql, params);

        let result = {};
        try {
            let [kvmaps, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: kvmaps};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    /**
     * Translates a mapId/mapKey to the value and info.
     * @param {String} mapId - Which code map to access
     * @param {String} mapKey - Which map key to translate
     * @returns {Object} status object with data or error, returns null data if no match.
     */
    async translateCode(mapId, mapKey) {
        let sql = "SELECT mapValue, mapInfo FROM sccom_kvmap WHERE mapId = ? AND mapKey = ?";
        let params = [mapId, mapKey];
        let result = {};
        try {
            let [kvmaps, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: kvmaps.length ? kvmaps[0] : null};
        } catch(err) {
            result = {success: false, error: err};
            logger.warn('translateCode', err);
        }
        return result;
    }


    /**
     * Retrieves code mappings from the sccom_kvmap table based on a filter.
     * The filter can have the following optional properties:
     *     mapId
     *
     * @param {string} incidentId - Id of the incident
     * @returns {Object} status object with data or error,
     */
    async scanCodeMap(filter) {
        let sql = "SELECT mapKey, mapValue, mapInfo FROM sccom_kvmap ";

        let where = '';
        let params = [];
        let mapId = '';

        if (filter.hasOwnProperty('mapId') && filter.mapId.length) {
            mapId = filter.mapId;
        }

        where = utils.appendWhere(where, 'and', "mapId = ?");
        params.push(mapId);

        if (filter.hasOwnProperty('query') && filter.query.length) {
            where = utils.appendWhere(where, 'and', "mapValue LIKE ?");
            params.push('%' + filter.query + '%');
        }

        sql += where;

        logger.debug(sql, params);

        let result = {};
        try {
            let [kvmaps, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: kvmaps};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }


    /**
     * Updates (add/delete/update) an entry in the sccom_kvmap table
     *
     * @param {string} op - 'add', 'update', 'delete'
     * @param {string} mapId - Id the code map
     * @param {int} mapKey - Key into the code map
     * @param {string} mapValue - Value for the code map key entry
     * @param {Object} mapInfo - Information object (stored as JSON) associated with kvmap
     * @returns {Object} status object
     */
    async updateCodeMap(op, mapId, mapKey, mapValue, mapInfo) {

        let sql;
        let updates;
        let params;

        if (op == 'update') {
            sql = 'UPDATE sccom_kvmap SET ? WHERE mapId = ? AND mapKey = ?';
            updates = { mapValue: mapValue, mapInfo: JSON.stringify(mapInfo) };
            params = [updates, mapId, mapKey];
        } else if (op == 'add') {
            sql = 'INSERT INTO sccom_kvmap SET ? ';
            updates = { mapId: mapId, mapKey: mapKey, mapValue: mapValue, mapInfo: JSON.stringify(mapInfo) };
            params = [updates];
        } else if (op == 'delete') {
            sql = 'DELETE FROM sccom_kvmap WHERE mapId = ? AND mapKey = ?';
            params = [mapId, mapKey];
        } else {
            return {success: false, error: {message: 'bad update op code', code: 'SCBADOPCODE'}};
        }

        let result = {};
        try {
            let [dbStatus, _fields] = await mainPool.query(sql, params);
            result = {success: true, dbStatus: dbStatus};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }

    /**
     * Retrieves Claim Letter Index
     * @returns {Object} status object and standard/custom letter lists.
     */
    async getClaimLetters() {
        let sql = "SELECT * FROM sccom_claim_letters ORDER BY letterName";
        let params = [];

        logger.debug(sql, params);

        let result = {};
        try {
            let [letters, _fields] = await mainPool.query(sql, params);
            result = {success: true, letterTemplates: letters};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }



    /**
     * Returns the template content for a specified claim letter.
     * @param {int} letterId - Letter ID to retrieve
     * @returns {Object} status: true/false
     * @returns {Object} content: Buffer or null
     */
    async getClaimLetterTemplate(letterId) {
        let sql = "SELECT * FROM sccom_claim_letters WHERE id = ?";
        let params = [letterId];

        logger.debug(sql, params);

        let result = {success: true, letterMeta: null, content: null};
        let letterMeta = {};
        try {
            let [letters, _fields] = await mainPool.query(sql, params);
            letterMeta = letters.length ? letters[0] : null;
        } catch(err) {
            return {success: false, error: err};
        }
        if (!letterMeta) {
            return {success: true, letterMeta: null, content: null};
        }
        result.letterMeta = letterMeta;

        try {
            let letterName = letterMeta.letterName + '.docx';
            let letterPath = path.join(config.sccom.fileSystem.templateLettersDirectory, letterName);
            logger.debug(letterPath);
            let letterContent = await fs.readFile(letterPath, 'binary');
            result.content = letterContent;
        } catch(err) {
            return {success: false, error: err};
        }

        return result;

    }


    async generateClaimLetter(letterId, claimId) {
        // This will scan the claim contacts for the matching type (e.g., contractor)
        // and setup replacement fields in a predetermined pattern.
         function contactReplacement(contactTypeId, replacementPrefix) {
             let contactMatch = null;
             for (let contact of claim.claimContacts) {
                 if (contact.contactTypeId == contactTypeId) {
                     contactMatch = contact;
                     break;
                 }
             }

             if (contactMatch) {
                 replacements[replacementPrefix + 'Company'] = contactMatch.company;
                 replacements[replacementPrefix + 'ContactName'] = contactMatch.contactName;
                 replacements[replacementPrefix + 'Contactname'] = contactMatch.contactName;
                 replacements[replacementPrefix + 'Address1'] = contactMatch.address1;
                 replacements[replacementPrefix + 'City'] = contactMatch.city;
                 replacements[replacementPrefix + 'State'] = contactMatch.state;
                 replacements[replacementPrefix + 'Zip'] = contactMatch.postalCode;
                 replacements[replacementPrefix + 'Phone'] = contactMatch.phoneNumber;
                 replacements[replacementPrefix + 'Agency'] = contactMatch.company;
                 replacements[replacementPrefix + 'AgencyName'] = contactMatch.company;
                 replacements[replacementPrefix + 'AgencyCompany'] = contactMatch.company;
                 replacements[replacementPrefix + 'Incident_'] = contactMatch.incidentNumber;
                 replacements[replacementPrefix + 'Fax'] = contactMatch.faxNumber;
                 replacements[replacementPrefix + 'Date_Contacted'] = moment(contactMatch.contactedOn).format('M/D/YYYY');
                 replacements[replacementPrefix + 'Time_Contacted'] = moment(contactMatch.contactedOn).format('LTS');

             }
         }

         //Will replace true statements with a blank and false statements with not
         //to allow for correct formatting
         function notsReplacement(replacementField, booleanStatement) {
           if(booleanStatement) replacements['Nots' + replacementField] = '';
           else replacements['Nots' + replacementField] = 'not';
         }


        let result = {success: false, generatedLetter: null};

        let claim = await this.getFullClaimRecord(claimId);
        if (!claim.success) return claim;
        if (!claim.claim) return {success: false, error: {code: 'NOSUCHCLAIM', message: 'No claim with that id'}};

        //logger.debug(claim.claim);

        let template = await this.getClaimLetterTemplate(letterId);
        if (!template.success) {
            if (template.error.code == 'ENOENT') {
                return {success: false, error: {code: 'NOTEMPLATEFILE', message: 'The requested letter does not have a template file'}};
            } else {
                return template; // Pass through other errors
            }
        }
        if (!template.letterMeta) return {success: false, error: {code: 'NOSUCHCLAIMLETTER', message: 'No claim letter template with that id'}};

        // Let the mappings begin...
        let replacements = {};

        replacements.ClaimCd = claim.claim.claimId;
        replacements.Client_Claim = claim.claim.clientClaimId;
        replacements.IncidentId = claim.claim.claimId;
        replacements.ClientNeeds = claim.claim.clientNeeds;
        replacements.DateClaimClosed = claim.claim.claimClosed;

        replacements.AdjusterContactName = claim.claim.adjusterInfo.firstName + " " + claim.claim.adjusterInfo.lastName;
        replacements.ADJUSTER = claim.claim.adjusterInfo.firstName + " " + claim.claim.adjusterInfo.lastName;

        replacements.LetterheadDate = moment().format('MMMM D, YYYY');

        let date = new Date(claim.claim.incidentDate)
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let incidentDay = days[date.getDay()];
        replacements.IncidentDay = incidentDay;

        replacements.IncidentDt = moment(claim.claim.incidentDate).format('M/D/YYYY');
        replacements.IncidentTm = claim.claim.incidentTime;
        replacements.IncidentCity = claim.claim.incidentCity;
        replacements.IncidentCounty = claim.claim.incidentCounty;
        replacements.IncidentState = claim.claim.incidentStateCode;
        replacements.IncidentAddress = claim.claim.incidentAddress;
        replacements.IncidentZip = claim.claim.incidentPostalCode;
        replacements.ReportedTm = claim.claim.reportedTime;
        replacements.ReportedDt = claim.claim.reportedDate;
        replacements.EventDescription = claim.claim.eventDescription;

        replacements.Contact_Fax = claim.claim.contactInfo.fax;
        replacements.CallerFax = claim.claim.contactInfo.fax;
        replacements.ContactName = claim.claim.contactInfo.contactDisplay;
        replacements.CallerContactName = claim.claim.contactInfo.contactDisplay;
        replacements.ContactDisplay = claim.claim.contactInfo.contactDisplay;
        replacements.ContactNameFirst = claim.claim.contactInfo.firstName;
        replacements.ContactNameLast = claim.claim.contactInfo.lastName;
        replacements.Contact_Company = claim.claim.contactInfo.company;
        replacements.Company = claim.claim.contactInfo.company;
        replacements.CallerCompany = claim.claim.contactInfo.company;
        replacements.Division = claim.claim.contactInfo.title;
        replacements.Contact_Title = claim.claim.contactInfo.title;
        replacements.ContactPhone = claim.claim.contactInfo.phone;
        replacements.CallerPhone = claim.claim.contactInfo.phone;
        replacements.ContactAddress1 = claim.claim.contactInfo.address;
        replacements.Address1 = claim.claim.contactInfo.address;
        replacements.CallerAddress = claim.claim.contactInfo.address;
        replacements.ContactAddress2 = claim.claim.contactInfo.address2;
        replacements.Address2 = claim.claim.contactInfo.address2;
        replacements.ContactCity = claim.claim.contactInfo.city;
        replacements.City = claim.claim.contactInfo.city;
        replacements.CallerCity = claim.claim.contactInfo.city;
        replacements.ContactState = claim.claim.contactInfo.stateCode;
        replacements.State = claim.claim.contactInfo.stateCode;
        replacements.CallerState = claim.claim.contactInfo.stateCode;
        replacements.ContactZip = claim.claim.contactInfo.postalCode;
        replacements.Zip = claim.claim.contactInfo.postalCode;
        replacements.CallerZip = claim.claim.contactInfo.postalCode;
        replacements.ContactSalutation = claim.claim.contactInfo.salutation;
        replacements.ContactSal = claim.claim.contactInfo.contactSalutation;


        let materialNameInfo = await this.translateCode('material', claim.claim.materialId);
        if (materialNameInfo.success && materialNameInfo.data) {
            replacements.ProperShipName = materialNameInfo.data.mapValue;
            replacements.MaterialName = materialNameInfo.data.mapValue;
        }

        replacements.DriverNameFirst = claim.claim.transportationInfo.driverNameFirst;
        replacements.DriverNameLast = claim.claim.transportationInfo.driverNameLast;
        replacements.TractorCd = claim.claim.transportationInfo.tractorCode;
        replacements.TrailerCd = claim.claim.transportationInfo.trailerCode;
        replacements.ImproperLoadTrailerCd = claim.claim.transportationInfo.improperLoadTrailerCd;
        replacements.DIVLOC = claim.claim.transportationInfo.divisionLocation;
        replacements.TerminalName = claim.claim.transportationInfo.driverTerminal;

        replacements.REPORTING_ASSISTANT = claim.claim.scContactNameFirst + " " + claim.claim.scContactNameLast;
        replacements.RAEmail = claim.claim.scAssociateEmail;
        replacements.RAPhone = claim.claim.scAssociatePhone;
        replacements.RAInitials = claim.claim.scAssociateInitials;

        replacements.QuantityReleased = claim.claim.spillInfo.estQuantityReleased;
        replacements.TANK_NUMBER = claim.claim.spillInfo.tankNumber;
        replacements.HazardClassNm = claim.claim.spillInfo.harzardClassId;

        replacements.ProNumber = claim.claim.miscInfo.proNumber;

        replacements.ShippingPaperNbr = claim.claim.shipperInfo.paperNumber;
        replacements.ShipperName = claim.claim.shipperInfo.name;

        replacements.DURATION_OF_RELEASE = claim.claim.causeOfIncident;

        replacements.NRC_ContactSalutation = claim.claim.NRCInfo.contactSalutation;
        replacements.NRC_MainContactName = claim.claim.NRCInfo.contactFirstName + claim.claim.NRCInfo.contactLastName;
        replacements.NRC_REPORT = claim.claim.NRCInfo.reportNumber;

        replacements.ConsigneeCompany = claim.claim.consigneeInfo.name;
        replacements.ConsigneeCity = claim.claim.consigneeInfo.city;
        replacements.ConsigneeState = claim.claim.consigneeInfo.stateCode;

        //Replacements for various contactTypeId fields
        contactReplacement(1, 'CleanupContractor');
        contactReplacement(10, 'Generator');
        contactReplacement(13, 'StateEPA');
        contactReplacement(9, 'StateERC');
        contactReplacement(17, 'StateLEPC');
        contactReplacement(11, 'StateDistrictOffice');
        contactReplacement(3, 'Fire');
        contactReplacement(8, 'Property');

        //Replacements for boolean fields
        let impact_info = claim.claim.impactInfo;
        notsReplacement('WaterwayInd', impact_info.isWaterway)
        notsReplacement('SOIL_EFFECTED_OR_NOT', impact_info.isSoilEffected);
        notsReplacement('VEGETATION_DAMAGE_OR_NOT', impact_info.isVegetationDamaged);
        notsReplacement('HEALTH_EFFECTS_OR_NOT', impact_info.isHealthEffects);
        notsReplacement('MEDICAL_ADVICE_OR_NOT', impact_info.isMedicalAdvice);
        notsReplacement('PUBLIC_WARNED_OR_NOT', impact_info.isPublicWarned);
        notsReplacement('Airborne', impact_info.isAirborne);


        if(claim.claim.transportationInfo.carrierId) {
          let carrierInfo = await this.getCarrier(claim.claim.transportationInfo.carrierId);
          if(carrierInfo.data) {
            replacements.CarrierName = carrierInfo.data.carrierName;
            replacements.CarrierAddress = carrierInfo.data.carrierAddress;
            replacements.CarrierCity = carrierInfo.data.carrierCity;
            replacements.CarrierZip = carrierInfo.data.carrierPostalCode;
            replacements.CarrierContactName = carrierInfo.data.contactName;
          }
        }


        //logger.debug(replacements);
        let processedDocResult = await documents.applyTemplateData(template.content, replacements);
        if (!processedDocResult.success) return processedDocResult;
        return {
            success: true,
            generatedLetter: processedDocResult.renderDocContent,
            missingPlaceholders: processedDocResult.missingPlaceholders
        };

    }


    /**
     * Retrieves code mappings from the sccom_states table.
     *
     * @returns {Object} status object with data or error,
     */
    async getStateMap() {
        let sql = "SELECT * FROM sccom_states";

        let params = [];
        let result = {};
        try {
            let [states, _fields] = await mainPool.query(sql, params);
            result = {success: true, data: states};
        } catch(err) {
            result = {success: false, error: err};
        }
        return result;
    }

}


module.exports = new Claims();
