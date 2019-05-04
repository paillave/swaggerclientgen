
export interface IEntityModel {
    entityType?: number;
    id?: number;
    email?: string;
    address?: string;
    countryCode?: string;
    phoneNumber?: string;
    isActive?: boolean;
    entityGroupId?: number;
    name?: string;
    contactId?: number;
    vat?: number;
    url?: string;
    registrationNumber?: string;
    people?: [number];
    regulated?: boolean;
    cssfEquivalentSupervision?: boolean;
    financialInstitutionType?: number;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    idCardNumber?: string;
    passportNumber?: string;
    companies?: [number];
    collectiveManagement?: boolean;
    discretionaryManagement?: boolean;
    aifm?: boolean;
}



export interface IProfileModel {
    id?: number;
    firstName?: string;
    lastName?: string;
    culture?: string;
    isActive?: boolean;
    entities?: object;
}


export interface IProfileEntityModel {
    id?: number;
    name?: string;
    groupId?: number;
    groupName?: string;
    roles?: IRolesModel;
}


export interface IRolesModel {
    administrator?: boolean;
    powerUser?: boolean;
    advisor?: boolean;
    client?: boolean;
    banker?: boolean;
    awaitingUser?: boolean;
}


export interface IWeatherForecast {
    dateFormatted?: string;
    temperatureC?: number;
    summary?: string;
    myProperty?: [Date];
    temperatureF?: number;
}



export interface ISecurityModel {
    securityType?: number;
    id?: number;
    internalCode?: string;
    isin?: string;
    name?: string;
    benchmarkId?: number;
    currencyIso?: string;
    countryCode?: string;
    pricingFrequency?: number;
    classificationStrategy?: string;
    marketPlaceId?: number;
    creationDate?: Date;
    lastModifiedDate?: Date;
    couponType?: string;
    couponRate?: number;
    faceValue?: number;
    notional?: number;
    maturityDate?: Date;
    isPerpetual?: boolean;
    firstPaymentDate?: Date;
    nextCouponDate?: Date;
    paymentFrequency?: number;
    issueAmount?: number;
    isOtc?: boolean;
    counterpartyId?: number;
    underlyingIsin?: string;
    contractSize?: number;
    strikePrice?: number;
    currencyToIso?: string;
    optionType?: number;
    fundAdminId?: number;
    custodianId?: number;
    navFrequency?: number;
    isManaged?: boolean;
    sicavId?: number;
    transferAgentId?: number;
    url?: string;
    domicileIso?: string;
    subscriptionContactId?: number;
    recommendedTimeHorizon?: number;
    settlementNbDays?: number;
    isLiquidated?: boolean;
    liquidationDate?: Date;
    investmentProcess?: number;
    shortExposure?: boolean;
    leverage?: boolean;
    closedEnded?: boolean;
    subFundId?: number;
    isPrimary?: boolean;
    distributionType?: number;
    investorType?: number;
    inceptionDate?: Date;
    closingDate?: Date;
    minimumInvestment?: number;
    entryFee?: number;
    exitFee?: number;
    managementFee?: number;
    performanceFee?: number;
    dividendPeriodicity?: number;
    isOpenForInvestment?: boolean;
    gicsSectorId?: number;
    icbSectorId?: number;
}



