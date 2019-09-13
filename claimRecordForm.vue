<template>
    <div>
        <b-modal :active.sync="isStartupModalActive" has-modal-card full-screen
            v-on:use-incident="startNewClaimFromIncident"
            v-on:new-claim="startNewClaim">
            <claim-startup-modal></claim-startup-modal>
        </b-modal>
        <section v-if="isUIActive">
            <form v-on:submit.prevent>
                <div class="columns" style="background-color: #f0f0f0; margin-bottom: 3px">
                    <div class="column is-half">
                        <div class="columns">
                            <div class="column is-one-third">
                                <b-field label="Claim Number" custom-class="is-small">
                                    <div>{{claim.claimId}} ({{claim.id}})</div>
                                </b-field>
                            </div>
                            <div class="column is-one-third">
                                <b-field label="Client ID" custom-class="is-small">
                                    <div>{{claim.customerId}}</div>
                                </b-field>
                            </div>
                            <div class="column is-one-third">
                                <b-field label="Client Claim" custom-class="is-small">
                                    <div>{{claim.clientClaimId}}</div>
                                </b-field>
                            </div>
                        </div>
                    </div>
                    <div class="column is-half">
                        <div class="columns">
                            <div class="column is-three-fifths">
                                <b-field label="Contact Company" custom-class="is-small">
                                    <div>{{claim.contactInfo.company}}</div>
                                </b-field>
                            </div>
                            <div class="column is-two-fifths">
                                <b-field label="Client Contact" custom-class="is-small">
                                    <div>{{claim.contactInfo.contactDisplay}}</div>
                                </b-field>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <section  v-if="isUIActive">
            <b-tabs v-model="activeTab">
                <b-tab-item label="Client Contact">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">
                                <b-field horizontal label="Salutation" custom-class="is-small">
                                    {{claim.contactInfo.contactSalutation}}
                                </b-field>
                                <b-field horizontal label="First Name" custom-class="is-small">
                                    {{claim.contactInfo.firstName}}
                                </b-field>
                                <b-field horizontal label="Last Name" custom-class="is-small">
                                    {{claim.contactInfo.lastName}}
                                </b-field>
                                <b-field horizontal label="Company" custom-class="is-small">
                                    {{claim.contactInfo.company}}
                                </b-field>
                                <b-field horizontal label="Address 1" custom-class="is-small">
                                    {{claim.contactInfo.address}}
                                </b-field>
                                <b-field horizontal label="Address 2" custom-class="is-small">
                                    {{claim.contactInfo.address2}}
                                </b-field>
                                <b-field horizontal label="City" custom-class="is-small">
                                    {{claim.contactInfo.city}}
                                </b-field>
                                <b-field horizontal label="State" custom-class="is-small">
                                    {{claim.contactInfo.stateCode}}, {{claim.contactInfo.countryCode}}
                                </b-field>
                                <b-field horizontal label="Postal Code" custom-class="is-small">
                                    {{claim.contactInfo.postalCode}}
                                </b-field>
                                <b-field horizontal label="Phone" custom-class="is-small">
                                    {{claim.contactInfo.phone}}
                                </b-field>
                                <b-field horizontal label="Fax" custom-class="is-small">
                                    {{claim.contactInfo.fax}}
                                </b-field>
                                <b-field horizontal label="Callback Phone" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.contactInfo.callbackPhone"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Documents" custom-class="is-small">
                                    <a v-if="claimHasDocuments && !viewContactDocuments" class="button" @click="viewContactDocuments = true">
                                        Show {{claim.docCount}} Document
                                    </a>
                                    <a v-if="claimHasDocuments && viewContactDocuments" class="button" @click="viewContactDocuments = false">
                                        Hide Documents
                                    </a>
                                    <div v-if="!claimHasDocuments">No Documents Available</div>
                                </b-field>
                            </div>
                            <div class="column is-half">
                                <b-field horizontal label="Manager" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.contactInfo.managerName"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Mgr Phone" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.contactInfo.managerPhone"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Client Claim" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.clientClaimId"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Client EIN" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.clientEIN"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="EC Contact" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.contactInfo.EnvCoordContact"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <div style="margin-top:30px; margin-bottom: 10px;">Claim Adjuster Info</div>
                                <b-field horizontal label="Company" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.adjusterInfo.company"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="First Name" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.adjusterInfo.firstName"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Last Name" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.adjusterInfo.lastName"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <div style="margin-top: 30px; text-align: center">
                                    <button type="button" class="button is-primary"
                                        v-show="claim.customerId && claim.customerId > 0"
                                        @click="findClientContactModal">
                                        CHANGE TO AN EXISTING CLIENT CONTACT
                                    </button>
                                    <button type="button" class="button is-primary"
                                        v-show="!claim.customerId"
                                        @click="findClientContactModal">
                                        USE AN EXISTING CLIENT CONTACT
                                    </button>
                                    <button type="button" class="button is-primary"
                                        @click="addClientContact">
                                        ADD NEW CONTACT
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <ContactDocuments v-if="viewContactDocuments" contact-type="client" v-bind:contactInfo="contactMeta"/>
                        </div>
                    </form>
                </b-tab-item>

                <b-tab-item label="Spill Center">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">
                                <div>SC Associate Info</div>
                                <b-field horizontal label="Full Name" custom-class="is-small">
                                    <b-autocomplete
                                        expanded
                                        v-model="claim.scAssociate"
                                        :data="scAssociateAC.value"
                                        placeholder="-none-"
                                        field="name"
                                        :loading="scAssociateAC.loading"
                                        @keyup.native="autocompleteScAssociate"
                                        @select="fillScAssociate">
                                    </b-autocomplete>
                                </b-field>
                                <b-field horizontal label="First Name" custom-class="is-small">
                                    {{claim.scContactNameFirst}}
                                </b-field>
                                <b-field horizontal label="Last Name" custom-class="is-small">
                                    {{claim.scContactNameLast}}
                                </b-field>
                                <b-field horizontal label="Initials" custom-class="is-small">
                                    {{claim.scAssociateInitials}}
                                </b-field>
                                <b-field horizontal label="Phone/ext:" custom-class="is-small">
                                    {{claim.scAssociatePhone}}
                                </b-field>
                                <b-field horizontal label="Email:" custom-class="is-small">
                                    {{claim.scAssociateEmail}}
                                </b-field>
                                <b-field horizontal label="Date Transferred:" custom-class="is-small">
                                    <b-datepicker
                                        v-model="claim.dateTransferred"
                                        placeholder="Click to select...">
                                        <button class="button is-primary"
                                            @click="claim.dateTransferred = new Date()">
                                            <b-icon icon="calendar-today"></b-icon>
                                            <span>Today</span>
                                        </button>
                                    </b-datepicker>
                                </b-field>
                            </div>
                            <div class="column is-half">
                                <div>Claim / Misc. Status Information</div>
                                <b-field horizontal label="Claim Status" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.status"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Claim Created" custom-class="is-small">
                                    <div>{{$displayDateMDY(this.claim.claimCreated)}}</div>
                                </b-field>

                                <b-field horizontal label="Claim Closed" custom-class="is-small">
                                    <b-datepicker
                                        v-model="claim.claimClosed"
                                        placeholder="Click to select...">
                                        <button class="button is-primary"
                                            @click="claim.claimClosed = new Date()">
                                            <b-icon icon="calendar-today"></b-icon>
                                            <span>Today</span>
                                        </button>
                                    </b-datepicker>
                                </b-field>
                                <b-field horizontal label="Client Needs" custom-class="is-small">
                                    <b-autocomplete
                                        expanded
                                        v-model="claim.clientNeeds"
                                        :data="clientNeedsAC.value"
                                        placeholder="Cleanup"
                                        :loading="clientNeedsAC.loading"
                                        @keyup.native="autocompleteClientNeeds"
                                        @select="option => claim.clientNeeds = option">
                                    </b-autocomplete>
                                </b-field>
                                <div style="margin-top: 30px; text-align: center">
                                    <button type="button" class="button is-primary">VOID THIS CLAIM</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </b-tab-item>

                <b-tab-item label="Loss">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">
                                <div>Loss Info</div>
                                <b-field horizontal label="State" custom-class="is-small">
                                    <StateProvinceSelector
                                        v-on:state-code="claim.incidentStateCode = $event"
                                        v-on:country-code="claim.incidentCountryCode = $event"
                                        v-on:state-name="claim.incidentStateName = $event">
                                        {{claim.incidentStateName}}, {{claim.incidentCountryCode}}
                                    </StateProvinceSelector>
                                </b-field>
                                <b-field horizontal label="City" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentCity"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="County" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentCounty"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Route / Street" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentAddress"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Zip" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentPostalCode"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Reported Date" custom-class="is-small">
                                    <b-datepicker
                                        v-model="claim.reportedDate"
                                        placeholder="Click to select...">
                                        <button class="button is-primary"
                                            @click="claim.reportedDate = new Date()">
                                            <b-icon icon="calendar-today"></b-icon>
                                            <span>Today</span>
                                        </button>
                                    </b-datepicker>
                                </b-field>
                                <b-field horizontal label="Reported Time" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.reportedTime"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Incident Date" custom-class="is-small">
                                    <b-datepicker
                                        v-model="claim.incidentDate"
                                        placeholder="Click to select...">
                                        <button class="button is-primary"
                                            @click="claim.incidentDate = new Date()">
                                            <b-icon icon="calendar-today"></b-icon>
                                            <span>Today</span>
                                        </button>
                                    </b-datepicker>
                                </b-field>
                                <b-field horizontal label="Incident Time" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentTime"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field v-if="isCyberClaim" horizontal label="DIV-LOC" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentDivisionLocation"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                            </div>
                            <div class="column is-half">
                                <b-field label="Event Description" custom-class="is-small">
                                    <b-input type="textarea" rows="7"
                                        v-model="claim.eventDescription">
                                    </b-input>
                                </b-field>
                                <div v-if="isSpillClaim">
                                    <b-field horizontal label="Released Amt" custom-class="is-small">
                                        <b-input
                                            type="number"
                                            v-model="claim.spillInfo.estQuantityReleased"
                                            placeholder="-none-">
                                        </b-input>
                                        <b-select
                                            v-model="claim.spillInfo.estQuantityReleasedUnit">
                                            <option
                                                v-for="option in $store.state.ops.quantityUnit"
                                                :key="option.mapKey"
                                                :value="option.mapKey">{{option.mapValue}}</option>
                                        </b-select>
                                    </b-field>
                                    <b-field horizontal label="Duration of Release" custom-class="is-small">
                                        <b-input
                                            type="number"
                                            placeholder="????">
                                        </b-input>
                                    </b-field>
                                    <div style="margin-top: 20px; margin-bottom: 5px">On Scene</div>

                                    <b-field>
                                        <b-checkbox
                                            type="is-success"
                                            v-model="claim.impactInfo.isFireOnScene">
                                            Fire On Scene
                                        </b-checkbox>
                                    </b-field>
                                    <b-field>
                                        <b-checkbox
                                            type="is-success"
                                            v-model="claim.impactInfo.isPoliceOnScene">
                                            Police On Scene
                                        </b-checkbox>
                                    </b-field>
                                    <b-field>
                                        <b-checkbox
                                            type="is-success"
                                            v-model="claim.impactInfo.cleanUpContractorOnScene">
                                            Cleanup Contractor On Scene
                                        </b-checkbox>
                                    </b-field>
                                    <b-field>
                                        <b-checkbox
                                            type="is-success"
                                            v-model="claim.impactInfo.isOtherResponseOnScene">
                                            Other Response Agency on Scene
                                        </b-checkbox>
                                    </b-field>
                                    <b-field>
                                        <b-checkbox
                                            type="is-success"
                                            v-model="claim.impactInfo.isMediaPresent">
                                            Media Present
                                        </b-checkbox>
                                    </b-field>
                                </div>
                            </div>
                        </div>
                    </form>
                </b-tab-item>

                <b-tab-item label="Driver" :visible="isSpillClaim">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">
                                <div>Driver Info</div>
                                <b-field horizontal label="First Name" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.driverNameFirst"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Last Name" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.driverNameLast"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Tractor Number" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.tractorCode"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Trailer Number" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.trailerCode"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Responsible Location" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.responsibleLocation"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Home Terminal" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.driverTerminal"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="Home / Orig" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.transportationInfo.homeOrigin"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="DIV-LOC" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.incidentDivisionLocation"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                            </div>
                        </div>
                    </form>
                </b-tab-item>


                <b-tab-item label="Material"  :visible="isSpillClaim">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">

                                <b-field label="Lookup Material" custom-class="is-small">
                                    <b-field>
                                        <b-autocomplete
                                            expanded
                                            v-model="materialAC.query"
                                            :data="materialAC.value"
                                            placeholder="e.g. Diesel Fuel"
                                            field="mapValue"
                                            :loading="materialAC.loading"
                                            @keyup.native="autocompleteMaterial"
                                            @select="option => materialAC.selected = option">
                                        </b-autocomplete>
                                        <p class="control">
                                            <button class="button is-primary" @click="useMaterial">Use</button>
                                        </p>
                                    </b-field>
                                </b-field>

                                <b-field label="Material" custom-class="is-small">
                                    <div>{{ claimMaterialName }}</div>
                                </b-field>
                                <b-field label="Material Type" custom-class="is-small">
                                    <b-select
                                        v-model="claim.materialTypeId">
                                        <option
                                            v-for="option in $store.state.ops.materialType"
                                            :key="option.mapKey"
                                            :value="option.mapKey">{{option.mapValue}}</option>
                                    </b-select>
                                </b-field>
                            </div>
                            <div class="column is-half">

                            </div>
                        </div>
                        <div>
                            <div>Add Additional Materials Spilled</div>
                            <b-field label="Additional Materials for Letter Merge" custom-class="is-small">
                                <b-input type="textarea"
                                    v-model="claim.spillInfo.additionalMaterialMerge">
                                </b-input>
                            </b-field>
                        </div>
                    </form>
                </b-tab-item>

                <b-tab-item label="Regulatory" :visible="isSpillClaim">
                    <form v-on:submit.prevent>
                        <div class="columns">
                            <div class="column is-half">
                                <div class="box">
                                    <div>NRC</div>
                                    <b-field horizontal label="NRC Reason" custom-class="is-small">
                                        <b-select
                                            v-model="claim.NRCInfo.reason">
                                            <option value="">-none-</option>
                                            <option value="WATER">WATER</option>
                                            <option value="DOT">DOT</option>
                                            <option value="RQ">RQ</option>
                                        </b-select>
                                    </b-field>
                                    <b-field horizontal label="NRC Report #" custom-class="is-small">
                                        <b-input
                                            type="text"
                                            v-model="claim.NRCInfo.reportNumber"
                                            placeholder="-none-">
                                        </b-input>
                                    </b-field>
                                    <b-field horizontal label="NRC Salutation" custom-class="is-small">
                                        <b-select
                                            v-model="claim.NRCInfo.contactSalutation">
                                            <option
                                                v-for="option in salutationOptions"
                                                :key="option"
                                                :value="option">{{option}}</option>
                                        </b-select>
                                    </b-field>
                                    <b-field horizontal label="NRC First Name" custom-class="is-small">
                                        <b-input
                                            type="text"
                                            v-model="claim.NRCInfo.contactFirstName"
                                            placeholder="-none-">
                                        </b-input>
                                    </b-field>
                                    <b-field horizontal label="NRC Last Name" custom-class="is-small">
                                        <b-input
                                            type="text"
                                            v-model="claim.NRCInfo.ContactLastName"
                                            placeholder="-none-">
                                        </b-input>
                                    </b-field>
                                </div>
                                <div class="box">
                                    <div>Regulations and Review</div>
                                    <b-checkbox
                                        v-model="claim.impactInfo.isRegulationsReviewed">
                                        Regulations Reviewed
                                    </b-checkbox>
                                    <b-field label="Review of Regulations" custom-class="is-small">
                                        <b-input type="textarea"
                                            v-model="claim.reviewOfRegulations">
                                        </b-input>
                                    </b-field>
                                </div>
                            </div>
                            <div class="column is-half">
                                <div>Primary Material and Regulations</div>
                                <b-field horizontal label="CAS Number" custom-class="is-small">
                                    <b-input
                                        type="text"
                                        v-model="claim.spillInfo.CASNumber"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="SARA Listed" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.spillInfo.isSARAListed">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="CERCLA Listed" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.spillInfo.isCERCLAListed">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="RQ in LBS" custom-class="is-small">
                                    <b-input
                                        type="number"
                                        v-model="claim.spillInfo.reportableQuantityPounds"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                                <b-field horizontal label="RQ Met?" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.spillInfo.isReportableQuantity">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="Is Hazardous Substance?" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.spillInfo.isHazardous">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="NRC Report Required?" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.impactInfo.NRCReportRequired">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="State Telephone Reports Completed?" custom-class="is-small">
                                    <b-checkbox
                                        v-model="claim.impactInfo.isStateTelephoneReportsCompleted">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="Written Notification Required?" custom-class="is-small">
                                    <b-checkbox
                                    v-model="claim.impactInfo.isStateRegulationsRequired">
                                    </b-checkbox>
                                </b-field>
                                <b-field horizontal label="Written Notification Timeline" custom-class="is-small">
                                    <b-input
                                        type="number"
                                        v-model="claim.spillInfo.stateRegTimeFrame"
                                        placeholder="-none-">
                                    </b-input>
                                </b-field>
                            </div>
                        </div>
                    </form>
                </b-tab-item>

                <b-tab-item label="All Contacts">
                    <div v-if="formMode == 'add'">
                        <div style="padding: 20px; text-align:center; font-size: 1.5em">
                            You must save the new claim before adding contacts.
                        </div>
                    </div>
                    <div v-else>
                        <form v-on:submit.prevent>
                            <div class="columns no-column-bottom-margin">
                                <div class="column is-half">
                                    <button type="button" class="button is-small" @click="findContactModal">Find Claim Contact</button>
                                    <button type="button" @click="findKORContactModal" class="button is-small">Find SCKOR Contact</button>
                                    <button v-if="allContactsView == 'detail'" type="button" class="button is-small" @click="setAllContactsView('summary')">Summary View</button>
                                    <button v-if="allContactsView == 'summary'" type="button" class="button is-small" @click="setAllContactsView('detail')">Detail View</button>
                                </div>
                            </div>
                            <div v-if="allContactsView == 'detail'">
                                <div class="columns no-column-bottom-margin">
                                    <div class="column is-half">
                                        <div class="columns no-column-bottom-margin">
                                            <div class="column is-one-third">
                                                <b-field label="Contact Type" custom-class="is-small">
                                                    <b-select
                                                        v-model="currClaimContact.contactTypeId">
                                                        <option
                                                            v-for="option in $store.state.ops.contactType"
                                                            :key="option.mapKey"
                                                            :value="option.mapKey">{{option.mapValue}}</option>
                                                    </b-select>
                                                </b-field>
                                            </div>
                                            <div class="column is-two-thirds">
                                                <b-field label="Agency/Company" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.company"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column is-half">
                                        <div class="columns no-column-bottom-margin">
                                            <div class="column is-two-thirds">
                                                <b-field label="Division" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.division"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-one-third">
                                                <b-field label="Claim #" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.claimId"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="columns no-column-bottom-margin">
                                    <div class="column is-half">
                                        <b-field label="Contact Name" custom-class="is-small">
                                            <b-input
                                                type="text"
                                                v-model="currClaimContact.contactName"
                                                placeholder="-none-">
                                            </b-input>
                                        </b-field>

                                        <b-field label="Address Line 1" custom-class="is-small">
                                            <b-input
                                                type="text"
                                                v-model="currClaimContact.address1"
                                                placeholder="-none-">
                                            </b-input>
                                        </b-field>

                                        <b-field label="Address Line 2" custom-class="is-small">
                                            <b-input
                                                type="text"
                                                v-model="currClaimContact.address2"
                                                placeholder="-none-">
                                            </b-input>
                                        </b-field>
                                        <div class="columns">
                                            <div class="column is-three-fifths">
                                                <b-field label="City" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.city"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-one-fifth">
                                                <b-field label="State" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        style="width: 5em"
                                                        v-model="currClaimContact.state"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-one-fifth">
                                                <b-field label="Postal Code" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        style="width: 5em"
                                                        v-model="currClaimContact.postalCode"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column is-half">
                                        <div class="columns no-column-bottom-margin">
                                            <div class="column is-half">
                                                <b-field label="Contacted on" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.contactedOn"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-half">
                                                <b-field label="Incident #" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.incidentNumber"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                        <div class="columns no-column-bottom-margin">
                                            <div class="column is-half">
                                                <b-field label="Phone" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.phoneNumber"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-half">
                                                <b-field label="Mobile" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.mobileNumber"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>
                                        <div class="columns no-column-bottom-margin">
                                            <div class="column is-three-fifths">
                                                <b-field label="Email" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.emailAddress"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                            <div class="column is-two-fifths">
                                                <b-field label="Fax" custom-class="is-small">
                                                    <b-input
                                                        type="text"
                                                        v-model="currClaimContact.faxNumber"
                                                        placeholder="-none-">
                                                    </b-input>
                                                </b-field>
                                            </div>
                                        </div>

                                        <b-field label="Comments" custom-class="is-small">
                                            <b-input
                                                type="text"
                                                v-model="currClaimContact.comments"
                                                placeholder="-none-">
                                            </b-input>
                                        </b-field>
                                    </div>
                                </div>
                                <div class="box">
                                    <div class="columns no-column-bottom-margin">
                                        <div class="column is-one-third">
                                            <div v-if="currClaimContactMode == 'update'">
                                                <span class="icon is-medium" @click="walkContacts('first')"><i class="mdi mdi-page-first mdi-dark" v-bind:class="claimContactsFirst"></i></span>
                                                <span class="icon is-medium" @click="walkContacts('prev')"><i class="mdi mdi-chevron-left mdi-dark" v-bind:class="claimContactsFirst"></i></span>
                                                <span class="pageNavBox">{{currClaimContactIndex + 1}}/{{claimContactsSize}}</span>
                                                <span class="icon is-medium" @click="walkContacts('next')"><i class="mdi mdi-chevron-right mdi-dark" v-bind:class="claimContactsLast"></i></span>
                                                <span class="icon is-medium" @click="walkContacts('last')"><i class="mdi mdi-page-last mdi-dark" v-bind:class="claimContactsLast"></i></span>
                                            </div>
                                            <div v-else>
                                                Adding Contact
                                            </div>
                                        </div>
                                        <div class="column is-one-quarter">
                                            <button type="button" class="button is-small is-success" @click="saveContact">Save</button>
                                            <span v-if="currClaimContactMode == 'update'">
                                                <button type="button" class="button is-small">Delete</button>
                                            </span>
                                        </div>
                                        <div class="column is-one-quarter">
                                            <span v-if="currClaimContactMode == 'update'">
                                                <button type="button" class="button is-small" @click="addContact">Add</button>
                                            </span>
                                            <span v-if="currClaimContactMode == 'add'">
                                                <button type="button" class="button is-small" @click="cancelAddContact">Cancel</button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="allContactsView == 'summary'">
                                <b-table
                                    :data="claimContacts"
                                    :selected.sync="selectedContact"
                                    @dblclick="showSelectedContact">>
                                    <template slot-scope="props">
                                        <b-table-column field="contactTypeId" label="Type" sortable>
                                            {{ contactTypeText(props.row.contactTypeId) }}
                                        </b-table-column>
                                        <b-table-column field="company" label="Company" sortable>
                                            {{ props.row.company }}
                                        </b-table-column>
                                        <b-table-column field="contactName" label="Contact Name" sortable>
                                            {{ props.row.contactName }}
                                        </b-table-column>
                                        <b-table-column field="city" label="Location" sortable>
                                            {{ prettyLocation(props.row.city, props.row.state) }}
                                        </b-table-column>
                                    </template>
                                </b-table>

                            </div>
                        </form>
                    </div>
                </b-tab-item>

                <b-tab-item label="Letters">
                    <div v-if="formMode == 'add'">
                        <div style="padding: 20px; text-align:center; font-size: 1.5em">
                            You must save the new claim before generating letters.
                        </div>
                    </div>
                    <div v-else>
                        <form v-on:submit.prevent>
                            <div class="columns letters-select">
                                <div class="column is-half">
                                    <b-field label="Letter Templates">
                                        <b-select
                                            v-model="selectedStandardLetter">
                                            <option
                                                v-for="option in claimLetters"
                                                :key="option.id"
                                                :value="option.id">{{option.letterName}}</option>
                                        </b-select>
                                    </b-field>
                                    <button type="button" @click="mergeLetter" class="button is-primary">Merge and Download</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </b-tab-item>

                <b-tab-item label="Time Records">
                    <div v-if="formMode == 'add'">
                        <div style="padding: 20px; text-align:center; font-size: 1.5em">
                            You must save the new claim before adding time records.
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="timeRecordsSummary.length == 0" style="padding: 20px; text-align:center; font-size: 1.5em">
                            No Time Records
                        </div>
                        <div class="timeRecordsSummaryTable">
                            <b-table
                                :data="timeRecordsSummary"
                                :columns="timeRecordsSummaryColumns"
                                :selected.sync="selectedTimeRecord"
                                @dblclick="editSelectedTimeRecord">
                            </b-table>
                        </div>
                        <div style="margin-top: 10px">
                            <button type="button" class="button" @click="editSelectedTimeRecord">EDIT</button>
                        </div>
                    </div>
                </b-tab-item>

                <b-tab-item :visible="claimIncident.incomingId.length > 0" label="Incident">
                    <div class="columns">
                        <div class="column is-half content">
                            <h3>Incident</h3>
                            <table>
                                <tr><th>Incoming ID</th><td>{{claimIncident.incomingId}}</td></tr>
                                <tr><th>Timestamp</th><td>{{claimIncident.timeStamp}}</td></tr>
                                <tr><th>Source</th><td>{{claimIncident.source}} / {{claimIncident.skinId}}</td></tr>
                                <tr><th>Reported Lang</th><td>{{claimIncident.reportedLangCode}}</td></tr>
                                <tr><th>Calling Number</th><td>{{claimIncident.callingNumber}}</td></tr>
                                <tr><th>Called</th><td>{{claimIncident.calledNumber}}</td></tr>
                            </table>
                        </div>
                        <div class="column is-half content">
                            <h3>Intake Details</h3>
                            <table>
                                <tr v-for="(value, propertyName) in claimIncident.intakeDetails"  v-bind:key="propertyName">
                                    <th>{{propertyName}}</th><td>{{value}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </b-tab-item>
            </b-tabs>
        </section>
        <section v-if="isUIActive">
            <div class="columns" style="margin-top: 5px; border-top: 2px solid #ccc">
                <div class="column is-three-fifths" style="font-size: 0.8em; text-align: center">
                    <span v-if="formMode == 'update'">Last Activity: {{ $displayDateTime(claim.lastActivity) }}</span>
                    <span v-else>New Claim</span>
                </div>
                <div class="column">
                    <button v-if="formMode == 'update'" type="button" class="button is-primary" @click='saveClaim'>Save Claim Changes</button>
                    <button v-if="formMode == 'add'" type="button" class="button is-primary" @click='saveClaim'>Add New Claim</button>
                    <button type="button" class="button" @click="$emit('close')">Close</button>
                </div>
            </div>
        </section>
    </div>
</template>


<style>


div.timeRecordsSummaryTable table.table {
    table-layout: fixed;
}

div.timeRecordsSummaryTable table.table td  {
    font-size: 11px;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden
}

.b-tabs .tab-content {
    overflow: visible;
}

.pageNavBox {
    display: inline-block;
    border: 1px solid #666;
    color: #666;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 0.9em;
    min-width: 4em;
    text-align: center;
    padding: 1px 3px 1px 3px;
}

.no-column-bottom-margin {
    margin-bottom: 0;
}

</style>


<script>

import ClaimStartupModal from '~/components/ops/claimStartupModal.vue';
import TimeRecordModal from '~/components/ops/timeRecordFormModalWrapper.vue';
import ClientContactFinderModal from '~/components/ops/clientContactFinderModal.vue';
import ClaimContactFinderModal from '~/components/ops/claimContactFinderModal.vue';
import KORtile from '~/components/incident/KORResourcesTile.vue';
import StateProvinceSelector from '~/components/ops/stateProvinceSelector.vue';
import ContactDocuments from '~/components/ops/contactDocuments.vue';
import moment from 'moment';
import debounce from 'debounce-promise';
import fileDownload from 'js-file-download';


export default {

    components: {
        StateProvinceSelector,
        ClaimStartupModal,
        ContactDocuments
    },

    props: ['claimId'],

    data: function () {
        return {
            isUIActive: false,
            isStartupModalActive: false,
            isSpillClaim: true,
            isCyberClaim: false,
            formMode: '',
            claim: {
                adjusterInfo: {},
                contactInfo: {
                    firstName: '',
                },
                transportationInfo: {},
                spillInfo: {},
                impactInfo: {},
                NRCInfo: {}
            },
            timeRecordsSummary: [],
            timeRecordsSummaryColumns: [
                    {
                        field: 'isInvoiced',
                        label: '',
                        width: '20'
                    },
                    {
                        field: 'invoiceDescription',
                        label: '',
                        width: '250'
                    },
                    {
                        field: 'scAssociate',
                        label: '',
                        width: '80'
                    },
                    {
                        field: 'activity',
                        label: '',
                        width: '80'
                    },
                    {
                        field: 'rulesType',
                        label: '',
                        width: '50'
                    },
                    {
                        field: 'recordDate',
                        label: '',
                        width: '50'
                    },
                    {
                        field: 'recordStartTime',
                        label: '',
                        width: '50'
                    }
                ],
            selectedTimeRecord: {},
            activeTab: 0,
            materialLevelUnknown: 'Cargo',
            NRCReportRequiredUnknown: 0,
            mediaPresentUnknown: 0,
            allContactsView: 'detail',
            claimIncident: {
                incomingId: ''
            },
            claimContacts: [],
            currClaimContact: {},
            currClaimGeo: {},
            currClaimAddress: '',
            currClaimContactIndex: 0,
            currClaimContactMode: 'update',
            claimContactsSize: 0,
            selectedContact: {},
            salutationOptions: ['','Mr.','Ms.','Dr.','Capt.'],
            claimLetters: {},
            selectedStandardLetter: 0,
            selectedCustomLetter: 0,
            materialAC: {query: '', value: [], loading: false, selected: {}},
            claimMaterialName: '',
            clientNeedsAC: {query: '', value: [], loading: false, selected: {}},
            scAssociateAC: {query: '', value: [], loading: false, selected: {}},
            viewContactDocuments: false
        }
    },

    computed: {

        claimContactsFirst: function () {
            return {
                'mdi-inactive': this.currClaimContactIndex == 0
            }
        },
        claimContactsLast: function () {
            return {
                'mdi-inactive': this.currClaimContactIndex == this.claimContactsSize - 1
            }
        },

        contactMeta: function () {
            return {
                id: this.claim.customerId
            }
        },

        claimHasDocuments: function () {
            if (this.claim.docCount) {
                return true;
            } else {
                return false;
            }
        }
    },

    watch: {
    },

    mounted: async function () {
        this.claimLetters = await this.getClaimLetters();
        if (this.claimId == '-new-') {
            this.formMode = 'add';
            this.isStartupModalActive = true;
        } else {
            this.formMode = 'update';
            this.getClaim(this.claimId);
            this.isUIActive = true;
        }
    },

    methods: {

        startupModal: function() {
            let ctx = this;
            this.$modal.open({
                parent: this,
                component: ClaimStartupModal,
                width: '100%',
                props: {
                },
                events: {
                    close: function () {
                        ctx.showUI = true;
                    }
                },
                hasModalCard: true,
                canCancel: true
            })
        },

        startNewClaim: function (event) {
            console.log('Event: startNewClaim', event);
            this.setClaimFlowUI(event.claimFlow);
            this.isStartupModalActive = false;
            this.isUIActive = true;
        },

        setClaimFlowUI: function (flow) {
            if (flow == 'Cyber') {
                this.isCyberClaim = true;
                this.isSpillClaim = false;
            } else { // Assuming EnvSpill for now
                this.isCyberClaim = false;
                this.isSpillClaim = true;
            }
        },

        startNewClaimFromIncident: async function (event) {
            console.log('Event: startNewClaimFromIncident', event);
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/createclaimfromincident', {
                opsToken: this.$store.state.ops.opsToken,
                incidentId: event.incidentId
            });
            if (result.success) {
                if (result.claimId) {
                    await this.getClaim(result.claimId);
                    this.isStartupModalActive = false;
                    this.isUIActive = true;
                    this.formMode = 'update';
                } else {
                    this.$dialog.alert({
                        title: 'Unable to create claim.  Show error to engineering',
                        message: JSON.stringify(result),
                        type: 'is-danger',
                    });
                }
            } else {
                this.$dialog.alert({
                    title: 'Serious error creating claim',
                    message: result.error.message,
                    type: 'is-danger',
                });
            }
        },


        getClaim: async function (claimId) {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/getclaimfull', {
                opsToken: this.$store.state.ops.opsToken,
                claimId: claimId
            });
            if (result.success) {
                if (result.claim) {
                    let dateFields = ['reportedDate', 'incidentDate', 'claimCreated', 'claimClosed', 'dateTransferred'];
                    this.$processDateFields(result.claim, dateFields);
                    result.claim.incidentStateName = this.$stateName(result.claim.incidentStateCode, result.claim.incidentCountryCode);
                    this.claim = result.claim;
                    this.claimMaterialName = result.claim.incidentMaterialName;

                    if (result.incident) {
                        this.currClaimGeo = result.incident.location;
                        this.claimIncident = result.incident;
                    }  else {
                        this.claimIncident = {incomingId: ''}; // Empty shell
                        this.currClaimAddress = result.claim.incidentAddress + ' ' + result.claim.incidentCounty + ' ' + result.claim.incidentCity + ' ' + result.claim.incidentStateCode + ' ' + result.claim.incidentCountryCode;
                    }

                    this.timeRecordsSummary = this.timeRecordSummaryDisplay(result.timeRecordsSummary);
                    this.claimContacts = result.claimContacts;
                    if (this.claimContacts.length) {
                        this.currClaimContact = this.claimContacts[0];
                    }
                    this.currClaimContactIndex = 0;
                    this.claimContactsSize = this.claimContacts.length;
                    this.currClaimContactMode = this.claimContactsSize == 0 ? 'add' : 'update';

                    this.setClaimFlowUI(result.claim.claimFlow);
                }
            }
        },

        timeRecordSummaryDisplay(trsRecords) {
            let displayRecords = [];
            trsRecords.forEach((trsRecord) => {
                let trs = trsRecord;
                trs.recordDate = moment(trs.recordDate).format('MM/DD/YYYY');
                trs.recordStartTime = moment(trs.recordStartTime, 'H:mm:ss').format('HH:mm');
                displayRecords.push(trs);
            });
            return displayRecords;
        },

        saveClaim: async function () {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/saveclaim', {
                opsToken: this.$store.state.ops.opsToken,
                op: this.formMode,
                claim: this.claim
            });
            if (result.success) {
                let toastMessage;
                if (this.formMode == 'update') {
                    toastMessage = 'Claim ' + result.claimId + ' updated.';
                } else {
                    toastMessage = 'Successfully created new claim: ' +
                        result.claimId + '(' + result.id + ')';
                    history.replaceState(history.state, 'Claim Management', '/ops/claim/' + result.claimId);
                }
                this.$toast.open({
                    message: toastMessage,
                    type: 'is-success'
                });
                this.formMode = 'update';
                this.getClaim(result.claimId);
            } else {
                this.$dialog.alert({
                    title: 'Error adding claim',
                    message: result.error.message,
                    type: 'is-danger',
                });
            }
        },

        setAllContactsView: function (view) {
            this.allContactsView = view;
        },

        showSelectedContact: function () {
            let index = 0
            for (const contact of this.claimContacts) {
                if (this.selectedContact.id == contact.id) {
                    break;
                }
                index++;
            }
            this.currClaimContactIndex = index;
            this.currClaimContact = this.claimContacts[this.currClaimContactIndex];
            this.allContactsView = 'detail';
        },

        prettyLocation(city, state) {
            let result = city;
            if (state) {
                result += ', ' + state;
            }
            return result;
        },

        walkContacts: function (op) {
            if (op == "next") {
                if (this.currClaimContactIndex < this.claimContactsSize-1) {
                    this.currClaimContactIndex++;
                }
            } else if (op == "prev") {
                if (this.currClaimContactIndex > 0) {
                    this.currClaimContactIndex--;
                }
            } else if (op == "first") {
                this.currClaimContactIndex = 0;
            } else if (op == "last") {
                this.currClaimContactIndex = this.claimContactsSize - 1;
            }
            this.currClaimContact = this.claimContacts[this.currClaimContactIndex];
            //console.log(JSON.parse(JSON.stringify(this.currClaimContact)));
        },

        addContact: function () {
            this.currClaimContact = {};
            this.currClaimContactMode = 'add';
        },

        loadContact: async function (contactId) {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/getclaimcontact', {
                opsToken: this.$store.state.ops.opsToken,
                contactId: contactId
            });
            this.currClaimContact = result.data;
            this.currClaimContactMode = 'add';
            this.setAllContactsView('detail');
        },


        cancelAddContact: function () {
            this.currClaimContactMode = 'update';
            if (this.claimContactsSize) {
                this.currClaimContact = this.claimContacts[this.currClaimContactIndex];
            }
        },

        saveContact: async function () {
            if (this.currClaimContactMode == 'add') {
                this.currClaimContact.claimIndex = this.claim.id;
            }
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/saveclaimcontact', {
                opsToken: this.$store.state.ops.opsToken,
                op: this.currClaimContactMode,
                contact: this.currClaimContact
            });
            if (result.success) {
                let toastMessage;
                if (this.currClaimContactMode == 'update') {
                    toastMessage = 'Contact updated.';
                } else {
                    toastMessage = 'Contact added.'
                }
                this.$toast.open({
                    message: toastMessage,
                    type: 'is-success'
                });
                if (this.currClaimContactMode == 'add') {
                    this.currClaimContact.id = result.id;
                    this.claimContacts.push(this.currClaimContact);
                    this.claimContactsSize = this.claimContacts.length;
                    this.currClaimContactIndex = this.claimContactsSize - 1;
                }
                this.currClaimContactMode = 'update';

            } else {
                this.$dialog.alert({
                    title: 'Error adding claim',
                    message: result.error.message,
                    type: 'is-danger',
                });
            }
        },

        findContactModal: function() {
            let ctx = this;
            this.$modal.open({
                parent: this,
                component: ClaimContactFinderModal,
                props: {
                    inModal: true
                },
                events: {
                    useclaimcontact: function(contactId) {
                        console.log('useClaimContact', contactId, ctx);
                        ctx.loadContact(contactId);
                    }
                },
                hasModalCard: true,
                canCancel: true
            })
        },



        contactTypeText: function (typeId) {
            let text = "(UNKNOWN!)";
            for (const ct of this.$store.state.ops.contactType) {
                if (ct.mapKey == typeId) {
                    text = ct.mapValue;
                    break;
                }
            }
            return text;
        },

        getCodeMap: async function(mapId) {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/getcodemaps', {
                opsToken: this.$store.state.ops.opsToken,
                mapId: mapId
            });
            return result.data;
        },

        getClaimLetters: async function() {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/getclaimletters', {
                opsToken: this.$store.state.ops.opsToken,
            });
            return result.letterTemplates;
        },

        editSelectedTimeRecord: function () {
            this.timeRecordModal(this.claim.claimId, this.selectedTimeRecord.id);
        },

        timeRecordModal: function(claimId, recordIndex) {
            this.$modal.open({
                parent: this,
                component: TimeRecordModal,
                props: {
                    updateMode: true,
                    loadClaimId: claimId,
                    loadIndex: recordIndex,
                    claimEmbed: true
                },
                hasModalCard: true,
                canCancel: true
            })
        },

        autocompleteMaterial: debounce(
            async function () {
                if (!this.materialAC.query.length) {
                    this.materialAC.value = [];
                    return;
                }
                this.materialAC.loading = true;
                let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/scancodemap', {
                    opsToken: this.$store.state.ops.opsToken,
                    mapId: 'material',
                    query: this.materialAC.query
                });
                this.materialAC.loading = false;
                if (result.success) {
                    this.materialAC.value = result.data;
                } else {
                    this.materialAC.value = [];
                    console.log('AutoComplete error', result);
                    return;
                }
            },
        500),

        useMaterial: function() {
            this.claimMaterialName = this.materialAC.selected.mapValue;
            this.claim.materialId = this.materialAC.selected.mapKey;
            this.claim.materialTypeId = this.materialAC.selected.mapInfo.materialTypeId;
        },

        autocompleteClientNeeds: debounce(
            async function () {
                if (!this.claim.clientNeeds.length) {
                    this.clientNeedsAC.value = [];
                    return;
                }
                this.clientNeedsAC.loading = true;
                let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/scanclientneeds', {
                    opsToken: this.$store.state.ops.opsToken,
                    query: this.claim.clientNeeds
                });
                this.clientNeedsAC.loading = false;
                if (result.success) {
                    this.clientNeedsAC.value = [];
                    result.data.forEach((match) => this.clientNeedsAC.value.push(match.clientNeeds));
                } else {
                    this.clientNeedsAC.value = [];
                    console.log('AutoComplete error', result);
                    return;
                }
            },
        500),


        autocompleteScAssociate: debounce(
            async function () {
                if (!this.claim.scAssociate.length) {
                    this.scAssociateAC.value = [];
                    return;
                }
                this.scAssociateAC.loading = true;
                let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/scanscassociates', {
                    opsToken: this.$store.state.ops.opsToken,
                    query: this.claim.scAssociate
                });
                this.scAssociateAC.loading = false;
                if (result.success) {
                    this.scAssociateAC.value = result.data;
                } else {
                    this.scAssociateAC.value = [];
                    console.log('AutoComplete error', result);
                    return;
                }
            },
        500),

        fillScAssociate(option) {
            console.log('fillScAssociate', option);
            if (option) {
                this.claim.scContactNameFirst = option.firstName;
                this.claim.scContactNameLast = option.lastName;
                this.claim.scAssociateInitials = option.initials;
                this.claim.scAssociateEmail = option.email;
                this.claim.scAssociatePhone = (option.phone + ' ' + option.publicExtension).trim();
            }
        },

        findClientContactModal: function() {
            let ctx = this;
            this.$modal.open({
                parent: this,
                component: ClientContactFinderModal,
                props: {
                    inModal: true
                },
                events: {
                    useclientcontact: function(contactId) {
                        //console.log('useClientContact', contactId, ctx);
                        ctx.loadClaimContact(contactId);
                    }
                },
                hasModalCard: true,
                canCancel: true
            })
        },

        findKORContactModal: function() {
          let ctx = this;
          this.$modal.open({
              parent: this,
              component: KORtile,
              props: {
                  geolocation: this.currClaimGeo,
                  address: this.currClaimAddress,
                  context: 'selectable'
              },
              events: {
                  useclientcontact: function(KORrow) {
                      //console.log('useClientContact', KORrow, ctx);
                      ctx.loadKORContact(KORrow);
                  }
              },
              hasModalCard: false,
              canCancel: true
          })
        },

        loadKORContact: function(KORrow) {
          this.addContact();
          this.currClaimContact.contactTypeId = 1;
          this.currClaimContact.company = KORrow.contractorName;
          this.currClaimContact.division = '';
          this.currClaimContact.claimId = '';
          this.currClaimContact.contactName = KORrow.KORContactName;
          this.currClaimContact.address1 = KORrow.address1;
          this.currClaimContact.address2 = KORrow.address2;
          this.currClaimContact.city = KORrow.city;
          this.currClaimContact.state = KORrow.state;
          this.currClaimContact.postalCode = KORrow.postalCode;
          this.currClaimContact.contactedOn = '';
          this.currClaimContact.phoneNumber = KORrow.phoneBusiness;
          this.currClaimContact.mobileNumber = KORrow.phoneCell;
          this.currClaimContact.emailAddress = KORrow.phoneEmail;
          this.currClaimContact.faxNumber = KORrow.phooneFax;
          this.currClaimContact.comments = '';

        },

        addClientContact: function () {
            this.$toast.open({
                    duration: 3000,
                    message: `This feature has not been implemented yet.`,
                    position: 'is-bottom',
                    type: 'is-danger'
                });
        },

        loadClaimClientContact: async function (contactId) {
            let result = await this.$axios.$post(this.$store.state.ajaxPrefix + '/ops/getcontactfull', {
                opsToken: this.$store.state.ops.opsToken,
                contactId: contactId,
            });
            if (result.success) {
                if (result.contact) {
                    console.log('loadClaimClientContact', contactId, result.contact.displayName);
                    this.claim.customerId = contactId;
                    this.claim.contactInfo.company = result.contact.companyName;
                    this.claim.contactInfo.contactSalutation = result.contact.salutation;
                    this.claim.contactInfo.contactDisplay = result.contact.displayName;
                    this.claim.contactInfo.firstName = result.contact.firstName;
                    this.claim.contactInfo.lastName = result.contact.lastName;
                    this.claim.contactInfo.address = result.contact.address1;
                    this.claim.contactInfo.address2 = result.contact.address2;
                    this.claim.contactInfo.city = result.contact.city;
                    this.claim.contactInfo.stateCode = result.contact.stateCode;
                    this.claim.contactInfo.countryCode = result.contact.countryCode;
                    this.claim.contactInfo.postalCode = result.contact.postalCode;
                    this.claim.contactInfo.phone = result.contact.phoneNumber;
                    this.claim.contactInfo.fax = result.contact.faxNumber;
                    console.log(this.claim);
                }
            }
        },

        mergeLetter: async function () {
            let letterId = this.selectedStandardLetter;
            try {
                let documentResponse = await this.$axios({
                    method: 'post',
                    url: this.$store.state.ajaxPrefix + '/ops/getclaimletter',
                    data: {
                        opsToken: this.$store.state.ops.opsToken,
                        claimId: this.claimId,
                        letterId: letterId
                    },
                    responseType: 'arraybuffer'
                });
                //console.log(documentResponse);
                fileDownload(documentResponse.data, this.claimId + '.docx');
                if (documentResponse.headers['x-missing-placeholders']) {
                    this.$toast.open({
                        duration: 5000,
                        message: 'Letter downloaded, but detected ' +
                                    documentResponse.headers['x-missing-placeholders'] + ' missing placeholder(s)',
                        position: 'is-bottom',
                        type: 'is-warning'
                    });
                } else {
                    this.$toast.open({
                        duration: 3000,
                        message: `Your letter has been downloaded.`,
                        position: 'is-bottom',
                        type: 'is-success'
                    });
                }
            } catch (err) {
                let errorMessage = 'Unexpected server error';
                console.log(err.response);
                if (err.response.status == 404) {
                    var dataView = new DataView(err.response.data);
                    var decoder = new TextDecoder('utf-8');
                    var decodedError = JSON.parse(decoder.decode(dataView));
                    console.log('decoded', decodedError);
                    errorMessage = 'Unable to generate letter: ' + decodedError.error.message;
                }
                this.$toast.open({
                    duration: 5000,
                    message: errorMessage,
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            }
        }

    }


}

</script>
