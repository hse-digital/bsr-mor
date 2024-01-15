
using HSE.MOR.Domain.Entities;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class IncidentModelDefinition : DynamicsModelDefinition<Incident, DynamicsIncident>
{
    public override string Endpoint => "incidents";
    private DynamicsIncident dynamicsIncident;

    public override DynamicsIncident BuildDynamicsEntity(Incident entity)
    {
        this.dynamicsIncident = new DynamicsIncident();
        this.dynamicsIncident.customerReferenceId = $"/contacts({entity.CustomerId})";
        this.dynamicsIncident.primaryContactReferenceId = $"/contacts({entity.CustomerId})";
        this.dynamicsIncident.morReferenceId = string.IsNullOrWhiteSpace(entity.MorId) ? null : $"/bsr_mors({entity.MorId})";
        this.dynamicsIncident.bsr_contactfirstname = entity.WhatToSubmit == "notice" ? entity.MorModelDynamics.NoticeFirstName : entity.MorModelDynamics.ReportFirstName;
        this.dynamicsIncident.bsr_contactlastname = entity.WhatToSubmit == "notice" ? entity.MorModelDynamics.NoticeLastName : entity.MorModelDynamics.ReportLastName;
        this.dynamicsIncident.bsr_contactphone = entity.WhatToSubmit == "notice" ? entity.MorModelDynamics.NoticeContactNumber : entity.MorModelDynamics.ReportContactNumber;
        this.dynamicsIncident.bsr_contactemail = entity.EmailAddress;
        this.dynamicsIncident.bsr_yoursupportinginformation = entity.WhatToSubmit == "notice" ? null : entity.MorModelDynamics.YourSupportInfo;
        this.dynamicsIncident.statecode = 0;
        this.dynamicsIncident.statuscode = 2;
        this.dynamicsIncident.caseorigincode = 3;
        this.dynamicsIncident.incidentstagecode = 1;
        this.dynamicsIncident.casetypecode = 3;
               
        AddFunctionReference(entity);
        AddStructureOrBuilding(entity);
        AddBuildingAddress(entity);

        return this.dynamicsIncident;
    }

    private void AddBuildingAddress(Incident entity) {

        if (entity.BuildingModelDynamics is not null) 
        {
            if (!string.IsNullOrWhiteSpace(entity.BuildingModelDynamics.BuildingType))
            {
                this.dynamicsIncident.bsr_buildingaddressline1 = entity.BuildingModelDynamics.Address.Address;
                this.dynamicsIncident.bsr_buildingaddressline2 = entity.BuildingModelDynamics.Address.AddressLineTwo;
                this.dynamicsIncident.bsr_buildingtowncity = entity.BuildingModelDynamics.Address.Town;
                this.dynamicsIncident.bsr_buildingcounty = entity.BuildingModelDynamics.Address.AdministrativeArea;
                this.dynamicsIncident.bsr_buildingpostcode = entity.BuildingModelDynamics.Address.Postcode;
                this.dynamicsIncident.bsr_ismanualaddress = entity.BuildingModelDynamics.Address.IsManual;
                this.dynamicsIncident.regionReferenceId = string.IsNullOrWhiteSpace(entity.BuildingModelDynamics.Address.Postcode) ? null : $"/bsr_countries(65eeb151-30b8-ed11-b597-0022481b5e4f)";
            }
            if (!string.IsNullOrWhiteSpace(entity.BuildingModelDynamics.LocateBuilding) || entity.BuildingModelDynamics.Address.IsManual) 
            {
                this.dynamicsIncident.bsr_numberoffloors = TryGetInt(entity.BuildingModelDynamics.NumberOfFloorsProf);
                this.dynamicsIncident.bsr_numberofresidentialunits = TryGetInt(entity.BuildingModelDynamics.NumberOfUnitsProf);
                this.dynamicsIncident.bsr_buildingheight = TryGetDouble(entity.BuildingModelDynamics.BuildingHeight);
            }
        }       
    }

    private void AddStructureOrBuilding(Incident entity) {
        
        if (!string.IsNullOrWhiteSpace(entity.BuildingModelDynamics?.Address?.BuildingId) || !string.IsNullOrWhiteSpace(entity.BuildingModelDynamics?.Address?.StructureId)) 
        {
            this.dynamicsIncident.buildingReferenceId = string.IsNullOrWhiteSpace(entity.BuildingModelDynamics?.Address?.BuildingId) ? null : $"/bsr_buildings({entity.BuildingModelDynamics?.Address?.BuildingId})";
            this.dynamicsIncident.structureReferenceId = string.IsNullOrWhiteSpace(entity.BuildingModelDynamics?.Address?.StructureId) ? null : $"/bsr_blocks({entity.BuildingModelDynamics?.Address?.StructureId})";
            this.dynamicsIncident.bsrBuildingApplicationFunctionReference = null;
            this.dynamicsIncident.bsrBuildingControlApplicationFunctionReference = null;        
        }
        else 
        {
            this.dynamicsIncident.buildingReferenceId = null;
            this.dynamicsIncident.structureReferenceId = null;

        }
    }

    private void AddFunctionReference(Incident entity)
    {
        if (entity.BuildingModelDynamics?.IdentifyBuilding == "building_registration" && !string.IsNullOrWhiteSpace(entity.BuildingModelDynamics.Address.HrbApplicationId))
        {
            //this.dynamicsIncident.bsrBuildingControlApplicationFunctionReference = string.IsNullOrWhiteSpace(entity.BuildingModel?.Address?.BuildingControlAppId) ? null : $"/bsr_buildingcontrolapplications({entity.BuildingModel.Address.BuildingControlAppId})";
            this.dynamicsIncident.bsrBuildingApplicationFunctionReference = $"/bsr_buildingapplications({entity.BuildingModelDynamics.Address.HrbApplicationId})";

        }
        else if (entity.BuildingModelDynamics?.IdentifyBuilding == "building_reference" && !string.IsNullOrWhiteSpace(entity.BuildingModelDynamics.Address.BuildingControlAppId))
        {
            //this.dynamicsIncident.bsrBuildingApplicationFunctionReference = string.IsNullOrWhiteSpace(entity.BuildingModel?.Address?.HrbApplicationId) ? null : $"/bsr_buildingapplications({entity.BuildingModel.Address.HrbApplicationId})";
            this.dynamicsIncident.bsrBuildingControlApplicationFunctionReference = $"/bsr_buildingcontrolapplications({entity.BuildingModelDynamics.Address.BuildingControlAppId})";

        }
        else
        {
            this.dynamicsIncident.bsrBuildingApplicationFunctionReference = null;
            this.dynamicsIncident.bsrBuildingControlApplicationFunctionReference = null;
            //this.dynamicsIncident = dynamicsIncident with { _bsr_relevantbsrfunctionid_value = null };
        }
    }

    private int? TryGetInt(string number)
    {
        var integer = Int32.TryParse(number, out var value);
        if (integer)
        {
            return value;
        }
        else
        {
            return null;
        }
    }
    private double? TryGetDouble(string number)
    {
        var integer = Double.TryParse(number, out var value);
        if (integer)
        {
            return value;
        }
        else
        {
            return null;
        }
    }

    private DateTime? GetDate(string year, string month, string day)
    {
        var dateString = $"{year}/{month}/{day}";
        var dateTime = DateTime.UtcNow;
        var isDate = DateTime.TryParse(dateString, new CultureInfo("en-GB"), out dateTime);
        return isDate ? dateTime : null;
    }

    public override Incident BuildEntity(DynamicsIncident dynamicsEntity)
    {
        var incident =  new Incident();
        incident.IncidentId = dynamicsEntity.incidentid;
        incident.CaseNumber = dynamicsEntity.title;
        incident.CustomerId = dynamicsEntity._primarycontactid_value;
        incident.FirstName = dynamicsEntity.bsr_contactfirstname ;
        incident.LastName = dynamicsEntity.bsr_contactlastname;
        incident.ContactNumber = dynamicsEntity.bsr_contactphone;
        incident.EmailAddress = dynamicsEntity.bsr_contactemail;
        incident.MorId = dynamicsEntity._bsr_mor_value;
        incident.BuildingModelDynamics = new Building();
        incident.BuildingModelDynamics.Address = new AddressModel();
        incident.BuildingModelDynamics.Address.Street = dynamicsEntity.bsr_buildingaddressline1;
        incident.BuildingModelDynamics.Address.AddressLineTwo = dynamicsEntity.bsr_buildingaddressline2;
        incident.BuildingModelDynamics.Address.Town = dynamicsEntity.bsr_buildingtowncity;
        incident.BuildingModelDynamics.Address.AdministrativeArea = dynamicsEntity.bsr_buildingcounty;
        incident.BuildingModelDynamics.Address.Postcode = !string.IsNullOrWhiteSpace(dynamicsEntity.bsr_buildingpostcode) ? dynamicsEntity.bsr_buildingpostcode.Replace(" ", "") : dynamicsEntity.bsr_buildingpostcode;
        incident.BuildingModelDynamics.Address.IsManual = dynamicsEntity.bsr_ismanualaddress.GetValueOrDefault();
        incident.BuildingModelDynamics.Address.NumberOfFloors = dynamicsEntity.bsr_numberoffloors.GetValueOrDefault().ToString();
        incident.BuildingModelDynamics.Address.ResidentialUnits = dynamicsEntity.bsr_numberofresidentialunits.GetValueOrDefault().ToString();
        incident.BuildingModelDynamics.Address.BuildingHeight = dynamicsEntity.bsr_buildingheight.GetValueOrDefault().ToString();
        incident.BuildingModelDynamics.Address.BuildingId = dynamicsEntity._bsr_building_value;
        incident.BuildingModelDynamics.Address.StructureId = dynamicsEntity._bsr_block_incidentid_value;
        incident.BuildingModelDynamics.Address.HrbApplicationId = dynamicsEntity._bsr_relevantbsrfunctionid_value;
        incident.BuildingModelDynamics.Address.BuildingControlAppId = dynamicsEntity._bsr_relevantbsrfunctionid_value;

        return incident;
    }
      
}
