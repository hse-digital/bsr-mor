﻿

using AutoMapper;
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.API.Models.Dynamics;

public class MORDynamicsResponseProfile : Profile
{
    public MORDynamicsResponseProfile() 
    {
        CreateMap<IncidentModel, Mor>()
            .ForMember(m => m.Id, m => m.Ignore())
            .ForMember(m => m.ReportFirstName, m => m.MapFrom(m => m.Report.FirstName))
            .ForMember(m => m.ReportLastName, m => m.MapFrom(m => m.Report.LastName))
            .ForMember(m => m.ReportContactNumber, m => m.MapFrom(m => m.Report.ContactNumber))
            .ForMember(m => m.YourSupportInfo, m => m.MapFrom(m => m.Report.YourSupportInfo))
            .ForMember(m => m.OccurrenceDiscovered, m => m.MapFrom(m => m.Report.OccurrenceDiscovered))
            .ForMember(m => m.NoticeReference, m => m.MapFrom(m => m.Report.NoticeReference))
            .ForMember(m => m.AboutIncident, m => m.MapFrom(m => m.Report.AboutIncident))
            .ForMember(m => m.CauseOfIncident, m => m.MapFrom(m => m.Report.CauseOfIncident))
            .ForMember(m => m.IncidentKeepPeopleSafe, m => m.MapFrom(m => m.Report.IncidentKeepPeopleSafe))
            .ForMember(m => m.IncidentReported, m => m.MapFrom(m => m.Report.IncidentReported))
            .ForMember(m => m.ReportOrganisationName, m => m.MapFrom(m => m.Report.OrganisationName))
            .ForMember(m => m.ReportOrgRole, m => m.MapFrom(m => m.Report.OrgRole))
            .ForMember(m => m.SharedWithOthers, m => m.MapFrom(m => m.Report.SharedWithOthers))
            .ForMember(m => m.SubmittedNotice, m => m.MapFrom(m => m.Report.SubmittedNotice))
            .ForMember(m => m.WhoAffectedByIncident, m => m.MapFrom(m => m.Report.WhoAffectedByIncident))
            .ForMember(m => m.NoticeFirstName, m => m.MapFrom(m => m.Notice.FirstName))
            .ForMember(m => m.NoticeLastName, m => m.MapFrom(m => m.Notice.LastName))
            .ForMember(m => m.NoticeContactNumber, m => m.MapFrom(m => m.Notice.ContactNumber))
            .ForMember(m => m.DescribeRiskIncident, m => m.MapFrom(m => m.Notice.DescribeRiskIncident))
            .ForMember(m => m.ActionsToKeepSafe, m => m.MapFrom(m => m.Notice.ActionsToKeepSafe))
            .ForMember(m => m.NoticeOrganisationName, m => m.MapFrom(m => m.Notice.OrganisationName))
            .ForMember(m => m.NoticeOrgRole, m => m.MapFrom(m => m.Notice.OrgRole))
            .ForMember(m => m.WhenBecomeAware, m => m.MapFrom(m => m.Notice))
            .ForMember(m => m.BuildingModel, m => m.MapFrom(m => m.Building))
            .ForMember(m => m.IsNotice, m => m.MapFrom(m => m.WhatToSubmit == "notice" ? true : false));

        CreateMap<IncidentModel, Incident>()
            .ForMember(m => m.Id, m => m.Ignore())
            .ForMember(m => m.IncidentId, m => m.MapFrom(m => m.Id))
            .ForMember(m => m.CaseNumber, m => m.MapFrom(m => m.CaseNumber))
            .ForMember(m => m.EmailAddress, m => m.MapFrom(m => m.EmailAddress))
            .ForMember(m => m.WhatToSubmit, m => m.MapFrom(m => m.WhatToSubmit))
            .ForMember(m => m.CustomerId, m => m.MapFrom(m => m.CustomerId))
            .ForMember(m => m.MorId, m => m.MapFrom(m => m.MorId))
            .ForMember(m => m.MorModelDynamics, m => m.MapFrom(m => m))
            .ForMember(m => m.BuildingModelDynamics, m => m.MapFrom(m => m));

        CreateMap<IncidentModel, Building>()
            .ForMember(m => m.NumberOfFloorsProf, m => m.MapFrom(m => m.Building.NumberOfFloorsProf))
            .ForMember(m => m.NumberOfUnitsProf, m => m.MapFrom(m => m.Building.NumberOfUnitsProf))
            .ForMember(m => m.BuildingHeight, m => m.MapFrom(m => m.Building.BuildingHeight))
            .ForMember(m => m.BuildingName, m => m.MapFrom(m => m.Building.BuildingName))
            .ForMember(m => m.BcaReference, m => m.MapFrom(m => m.Building.BcaReference))
            .ForMember(m => m.BuildingType, m => m.MapFrom(m => m.Building.BuildingType))
            .ForMember(m => m.HasAddress, m => m.MapFrom(m => m.Building.HasAddress))
            .ForMember(m => m.AddressRegion, m => m.MapFrom(m => m.Building.AddressRegion))
            .ForMember(m => m.IdentifyBuilding, m => m.MapFrom(m => m.Building.IdentifyBuilding))
            .ForMember(m => m.LocateBuilding, m => m.MapFrom(m => m.Building.LocateBuilding))
            .ForMember(m => m.SubmittedDesignBca, m => m.MapFrom(m => m.Building.SubmittedDesignBca))
            .ForMember(m => m.Address, m => m.MapFrom(m => m.Building));

        CreateMap<AddressModel, Domain.Entities.AddressModel>()
            .ForMember(m => m.Address, m => m.MapFrom(m => m.Address))
            .ForMember(m => m.Number, m => m.MapFrom(m => m.Number))
            .ForMember(m => m.USRN, m => m.MapFrom(m => m.USRN))
            .ForMember(m => m.IsManual, m => m.MapFrom(m => m.IsManual))
            .ForMember(m => m.AddressLineTwo, m => m.MapFrom(m => m.AddressLineTwo))
            .ForMember(m => m.AccountablePerson, m => m.MapFrom(m => m.AccountablePerson))
            .ForMember(m => m.AdministrativeArea, m => m.MapFrom(m => m.AdministrativeArea))
            .ForMember(m => m.StructureId, m => m.MapFrom(m => m.StructureId))
            .ForMember(m => m.BuildingApplicationId, m => m.MapFrom(m => m.BuildingApplicationId))
            .ForMember(m => m.BuildingHeight, m => m.MapFrom(m => m.BuildingHeight))
            .ForMember(m => m.BuildingId, m => m.MapFrom(m => m.BuildingId))
            .ForMember(m => m.BuildingName, m => m.MapFrom(m => m.BuildingName))
            .ForMember(m => m.ContactId, m => m.MapFrom(m => m.ContactId))
            .ForMember(m => m.ParentUPRN, m => m.MapFrom(m => m.ParentUPRN))
            .ForMember(m => m.Postcode, m => m.MapFrom(m => m.Postcode))
            .ForMember(m => m.HrbApplicationId, m => m.MapFrom(m => m.HrbApplicationId))
            .ForMember(m => m.BuildingControlAppId, m => m.MapFrom(m => m.BuildingControlAppId))
            .ForMember(m => m.ResidentialUnits, m => m.MapFrom(m => m.ResidentialUnits))
            .ForMember(m => m.Street, m => m.MapFrom(m => m.Street));

        CreateMap<BuildingModel, Building>()
           .ForMember(m => m.NumberOfFloorsProf, m => m.MapFrom(m => m.NumberOfFloorsProf))
           .ForMember(m => m.NumberOfUnitsProf, m => m.MapFrom(m => m.NumberOfUnitsProf))
           .ForMember(m => m.AddressRegion, m => m.MapFrom(m => m.AddressRegion))
           .ForMember(m => m.BcaReference, m => m.MapFrom(m => m.BcaReference))
           .ForMember(m => m.BuildingHeight, m => m.MapFrom(m => m.BuildingHeight))
           .ForMember(m => m.BuildingName, m => m.MapFrom(m => m.BuildingName))
           .ForMember(m => m.BuildingType, m => m.MapFrom(m => m.BuildingType))
           .ForMember(m => m.HasAddress, m => m.MapFrom(m => m.HasAddress))
           .ForMember(m => m.IdentifyBuilding, m => m.MapFrom(m => m.IdentifyBuilding))
           .ForMember(m => m.LocateBuilding, m => m.MapFrom(m => m.LocateBuilding))
           .ForMember(m => m.SubmittedDesignBca, m => m.MapFrom(m => m.SubmittedDesignBca))
           .ForMember(m => m.Address, m => m.MapFrom(m => m));

        CreateMap<BuildingModel, Domain.Entities.AddressModel>()
           .ForMember(m => m.Address, m => m.MapFrom(m => m.Address.Address))
           .ForMember(m => m.Street, m => m.MapFrom(m => m.Address.Street))
           .ForMember(m => m.AddressLineTwo, m => m.MapFrom(m => m.Address.AddressLineTwo))
           .ForMember(m => m.AddressLineTwo, m => m.MapFrom(m => m.Address.AddressLineTwo))
           .ForMember(m => m.Town, m => m.MapFrom(m => m.Address.Town))
           .ForMember(m => m.AdministrativeArea, m => m.MapFrom(m => m.Address.AdministrativeArea))
           .ForMember(m => m.Postcode, m => m.MapFrom(m => m.Address.Postcode))
           .ForMember(m => m.IsManual, m => m.MapFrom(m => m.Address.IsManual))
           .ForMember(m => m.BuildingName, m => m.MapFrom(m => m.Address.BuildingName))
           .ForMember(m => m.Number, m => m.MapFrom(m => m.Address.Number))
           .ForMember(m => m.BuildingApplicationId, m => m.MapFrom(m => m.Address.BuildingApplicationId))
           .ForMember(m => m.AccountablePerson, m => m.MapFrom(m => m.Address.AccountablePerson))
           .ForMember(m => m.NumberOfFloors, m => m.MapFrom(m => m.Address.NumberOfFloors))
           .ForMember(m => m.ResidentialUnits, m => m.MapFrom(m => m.Address.ResidentialUnits))
           .ForMember(m => m.BuildingHeight, m => m.MapFrom(m => m.Address.BuildingHeight))
           .ForMember(m => m.UPRN, m => m.MapFrom(m => m.Address.UPRN))
           .ForMember(m => m.ParentUPRN, m => m.MapFrom(m => m.Address.ParentUPRN))
           .ForMember(m => m.USRN, m => m.MapFrom(m => m.Address.USRN))
           .ForMember(m => m.StructureId, m => m.MapFrom(m => m.Address.StructureId))
           .ForMember(m => m.BuildingId, m => m.MapFrom(m => m.Address.BuildingId))
           .ForMember(m => m.HrbApplicationId, m => m.MapFrom(m => m.Address.HrbApplicationId))
           .ForMember(m => m.BuildingControlAppId, m => m.MapFrom(m => m.Address.BuildingControlAppId))
           .ForMember(m => m.ContactId, m => m.MapFrom(m => m.Address.ContactId))
           .ForMember(m => m.IsManual, m => m.MapFrom(m => m.Address.IsManual));

        CreateMap<NoticeModel, TimeModel>()
            .ForMember(m => m.Year, m => m.MapFrom(m => m.WhenBecomeAware.Year))
            .ForMember(m => m.Month, m => m.MapFrom(m => m.WhenBecomeAware.Month))
            .ForMember(m => m.Day, m => m.MapFrom(m => m.WhenBecomeAware.Day))
            .ForMember(m => m.Hour, m => m.MapFrom(m => m.WhenBecomeAware.Hour))
            .ForMember(m => m.Minute, m => m.MapFrom(m => m.WhenBecomeAware.Minute));

    }
}
