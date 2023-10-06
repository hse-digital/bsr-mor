using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSE.MOR.Domain.Entities;

public record BuildingDetails(string Id = null) : Entity(Id);

public record DynamicsBuildingDetails(string bsr_buildingdetailsid = null,
    string bsr_address1_line1 = null,
    string bsr_address1_postalcode = null,
    string bsr_name = null,
    string bsr_address1_city = null,
    string bsr_address1_line2 = null
    ) : DynamicsEntity<BuildingDetails>;
