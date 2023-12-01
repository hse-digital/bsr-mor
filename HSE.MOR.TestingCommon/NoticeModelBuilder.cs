﻿using HSE.MOR.API.Models.Dynamics;
using HSE.MOR.Domain.Entities;

namespace HSE.MOR.TestingCommon;

public class NoticeModelBuilder
{
    private string modelFirstName = "building_or_person";
    private string modelLastName = "building_or_person";
    private string modelContactNumber = "building_or_person";
    private string modelActionsToKeepSafe = "building_or_person";
    private string modelDescribeRiskIncident = "building_or_person";
    private string modelOrganisationName = "building_or_person";
    private string modelOrgRole = "building_or_person";
    private TimeModel modelWhenBecomeAware = new TimeModel();

    public NoticeModelBuilder WithFirstName(string firstName)
    {
        modelFirstName = firstName;
        return this;
    }
    public NoticeModelBuilder WithLastName(string lastName)
    {
        modelLastName = lastName;
        return this;
    }
    public NoticeModelBuilder WithActionsToKeepSafe(string actionsToKeepSafe)
    {
        modelActionsToKeepSafe = actionsToKeepSafe;
        return this;
    }
    public NoticeModelBuilder WithContactNumber(string contactNumber)
    {
        modelContactNumber = contactNumber;
        return this;
    }
    public NoticeModelBuilder WithDescribeRiskIncident(string describeRiskIncident)
    {
        modelDescribeRiskIncident = describeRiskIncident;
        return this;
    }
    public NoticeModelBuilder WithOrganisationName(string organisationName)
    {
        modelOrganisationName = organisationName;
        return this;
    }

    public NoticeModelBuilder WithOrgRole(string orgRole)
    {
        modelOrgRole = orgRole;
        return this;
    }

    public NoticeModelBuilder WithTimeModel(TimeModel whenBecomeAware)
    {
        modelWhenBecomeAware = whenBecomeAware;
        return this;
    }

    public NoticeModel Build()
    {
        var model = new NoticeModel();
        model.FirstName = modelFirstName;
        model.LastName = modelLastName;
        model.ContactNumber = modelContactNumber;
        model.ActionsToKeepSafe = modelActionsToKeepSafe;
        model.DescribeRiskIncident = modelDescribeRiskIncident;
        model.OrganisationName = modelOrganisationName;
        model.OrgRole = modelOrgRole;
        model.WhenBecomeAware = modelWhenBecomeAware;
        return model;
    }
}
