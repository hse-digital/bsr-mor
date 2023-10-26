
using HSE.MOR.Domain.Entities;
using System.Globalization;

namespace HSE.MOR.Domain.DynamicsDefinitions;

public class IncidentModelDefinition : DynamicsModelDefinition<Incident, DynamicsIncident>
{
    public override string Endpoint => "incidents";
    private DynamicsIncident dynamicsIncident;

    public override DynamicsIncident BuildDynamicsEntity(Incident entity)
    {
        this.dynamicsIncident = new DynamicsIncident()
        {
            customerReferenceId = $"/contacts({entity.CustomerId})",
            primaryContactReferenceId = $"/contacts({entity.CustomerId})",           
            bsr_contactfirstname = entity.FirstName,
            bsr_contactlastname = entity.LastName,
            bsr_contactphone = entity.ContactNumber,
            bsr_contactemail = entity.Email,
            bsr_yoursupportinginformation = entity.YourSupportInfo,
            statecode = 0,
            statuscode = 2,
            caseorigincode = 3,
            incidentstagecode = 1,
            casetypecode = 3
        };      
        AddBuildingInScopeProf(entity);
        AddBuildingAddress(entity);
        AddBuildingAndStructure(entity);

        return this.dynamicsIncident;
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
        throw new NotImplementedException();
    }
    public void AddBuildingAndStructure(Incident entity)
    {
        if ((!string.IsNullOrWhiteSpace(entity.RequestType) && entity.RequestType == "complaint")
            && entity.Reason == "building_or_person")
        {
            this.dynamicsIncident = dynamicsIncident with { buildingReferenceId = string.IsNullOrWhiteSpace(entity.Address.BuildingId) ? null : $"/bsr_buildings({entity.Address.BuildingId})" };
            this.dynamicsIncident = dynamicsIncident with { structureReferenceId = string.IsNullOrWhiteSpace(entity.Address.StructureId) ? null : $"/bsr_blocks({entity.Address.StructureId})" };
            this.dynamicsIncident = dynamicsIncident with { regionReferenceId = string.IsNullOrWhiteSpace(entity.Address.Postcode) ? null : $"/bsr_countries(65eeb151-30b8-ed11-b597-0022481b5e4f)" };
        }
        else
        {
            this.dynamicsIncident = dynamicsIncident with { buildingReferenceId = null };
            this.dynamicsIncident = dynamicsIncident with { structureReferenceId = null };
            this.dynamicsIncident = dynamicsIncident with { regionReferenceId = null };
        }
    }
    private void AddBuildingAddress(Incident entity)
    {
        if ((!string.IsNullOrWhiteSpace(entity.RequestType) && entity.RequestType == "complaint")
            && entity.Reason == "building_or_person")
        {
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingaddressline1 = entity.Address.Street };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingaddressline2 = entity.Address.AddressLineTwo };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingtowncity = entity.Address.Town };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingcounty = entity.Address.AdministrativeArea };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingpostcode = entity.Address.Postcode };
            this.dynamicsIncident = dynamicsIncident with { bsr_ismanualaddress = entity.Address.IsManual };
        }
        else
        {
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingaddressline1 = null };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingaddressline2 = null };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingtowncity = null };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingcounty = null };
            this.dynamicsIncident = dynamicsIncident with { bsr_buildingpostcode = null };
            this.dynamicsIncident = dynamicsIncident with { bsr_ismanualaddress = null };
        }
    }
    private void AddBuildingInScopeProf(Incident entity)
    {
        if ((!string.IsNullOrWhiteSpace(entity.RequestType) && entity.RequestType == "complaint")
            && entity.Reason == "building_or_person" && entity.WhoAreYou == "building_professional")
        {

            if (entity.Address.IsManual)
            {
                this.dynamicsIncident = dynamicsIncident with { bsr_numberoffloors = TryGetInt(entity.NumberOfFloorsProf) };
                this.dynamicsIncident = dynamicsIncident with { bsr_buildingheight = TryGetDouble(entity.BuildingHeight) };
                this.dynamicsIncident = dynamicsIncident with { bsr_numberofresidentialunits = TryGetInt(entity.NumberOfUnitsProf) };
                this.dynamicsIncident = dynamicsIncident with { bsr_howbigisthebuilding = null };
                this.dynamicsIncident = dynamicsIncident with { bsr_2ormoreresidencesinbuilding = null };

            }
            else
            {
                this.dynamicsIncident = dynamicsIncident with { bsr_numberoffloors = null };
                this.dynamicsIncident = dynamicsIncident with { bsr_buildingheight = null };
                this.dynamicsIncident = dynamicsIncident with { bsr_numberofresidentialunits = null };
            }
        }

    }
   
}
