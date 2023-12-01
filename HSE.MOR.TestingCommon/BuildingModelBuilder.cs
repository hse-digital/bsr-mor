

using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.TestingCommon;

public class BuildingModelBuilder
{
    private string modelBuildingName = "building_or_person";
    private string modelAddressRegion = "building_or_person";
    private string modelBcaReference = "building_or_person";
    private string modelBuildingHeight = "building_or_person";
    private string modelBuildingType = "building_or_person";
    private string modelIdentifyBuilding = "building_or_person";
    private string modelLocateBuilding = "building_or_person";
    private string modelNumberOfFloorsProf = "building_or_person";
    private string modelNumberOfUnitsProf = "building_or_person";
    private string modelSubmittedDesignBca = "building_or_person";


    public BuildingModelBuilder WithBuildingName(string buildingName)
    {
        modelBuildingName = buildingName;
        return this;
    }
    public BuildingModelBuilder WithAddressRegion(string addressRegion)
    {
        modelAddressRegion = addressRegion;
        return this;
    }
    public BuildingModelBuilder WithBcaReference(string bcaReference)
    {
        modelBcaReference = bcaReference;
        return this;
    }
    public BuildingModelBuilder WithBuildingHeight(string buildingHeight)
    {
        modelBuildingHeight = buildingHeight;
        return this;
    }
    public BuildingModelBuilder WithBuildingType(string buildingType)
    {
        modelBuildingType = buildingType;
        return this;
    }
    public BuildingModelBuilder WithIdentifyBuilding(string identifyBuilding)
    {
        modelIdentifyBuilding = identifyBuilding;
        return this;
    }

    public BuildingModelBuilder WithLocateBuilding(string locateBuilding)
    {
        modelLocateBuilding = locateBuilding;
        return this;
    }

    public BuildingModelBuilder WithNumberOfFloorsProf(string numberOfFloorsProf)
    {
        modelNumberOfFloorsProf = numberOfFloorsProf;
        return this;
    }
    public BuildingModelBuilder WithNumberOfUnitsProf(string numberOfUnitsProf)
    {
        modelNumberOfUnitsProf = numberOfUnitsProf;
        return this;
    }
    public BuildingModelBuilder WithSubmittedDesignBca(string submittedDesignBca)
    {
        modelSubmittedDesignBca = submittedDesignBca;
        return this;
    }

    public BuildingModel Build()
    {
        var model = new BuildingModel();
        model.BuildingName = modelBuildingName;
        model.AddressRegion = modelAddressRegion;
        model.BcaReference = modelBcaReference;
        model.BuildingHeight = modelBuildingHeight;
        model.BuildingType = modelBuildingType;
        model.IdentifyBuilding = modelIdentifyBuilding;
        model.LocateBuilding = modelLocateBuilding;
        model.NumberOfFloorsProf = modelNumberOfFloorsProf;
        model.NumberOfUnitsProf = modelNumberOfUnitsProf;
        model.SubmittedDesignBca = modelSubmittedDesignBca;
        return model;
    }
}
