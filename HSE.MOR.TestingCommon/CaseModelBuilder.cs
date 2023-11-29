using Castle.Core.Resource;
using HSE.MOR.API.Models.Dynamics;

namespace HSE.MOR.TestingCommon;

public class CaseModelBuilder
{
    private string modelWhatToSubmit = "building_or_person";
    private string modelBuildingName = "building_or_person";
    private string modelEmailAddress = "building_or_person";
    private string modelCaseNumber = "building_or_person";
    private string modelCustomerId = "building_or_person";
    private string modelMorId = "building_or_person";
    

    public CaseModelBuilder WithWhatToSubmit(string whatToSubmit)
    {
        modelWhatToSubmit = whatToSubmit;
        return this;
    }
    public CaseModelBuilder WithBuildingName(string buildingName)
    {
        modelBuildingName = buildingName;
        return this;
    }
    public CaseModelBuilder WithEmailAddress(string emailAddress)
    {
        modelEmailAddress = emailAddress;
        return this;
    }
    public CaseModelBuilder WithCaseNumber(string caseNumber)
    {
        modelCaseNumber = caseNumber;
        return this;
    }
    public CaseModelBuilder WithCustomerId(string customerId)
    {
        modelCustomerId = customerId;
        return this;
    }
    public CaseModelBuilder WithMorId(string morId)
    {
        modelMorId = morId;
        return this;
    }

    public IncidentModel Build()
    {
        var model = new IncidentModel();
        model.WhatToSubmit = modelWhatToSubmit;
        model.BuildingName = modelBuildingName;
        model.EmailAddress = modelEmailAddress;
        model.CaseNumber = modelCaseNumber;
        model.CustomerId = modelCustomerId;
        model.MorId = modelMorId;
        return model;
    }
}
