﻿
namespace HSE.MOR.API.Models.LocalAuthority;

public record DynamicsOrganisationsSearchResponse(DynamicsOrganisation[] value);
public record DynamicsOrganisation(string name, string accountid);
