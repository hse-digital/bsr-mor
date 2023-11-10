using HSE.MOR.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HSE.MOR.Domain.DynamicsDefinitions
{
    public class MORModelDefinition : DynamicsModelDefinition<Mor, DynamicsMor>
    {
        public override string Endpoint => "bsr_mors";
        private DynamicsMor dynamicsMor;

        public override DynamicsMor BuildDynamicsEntity(Mor entity)
        {
            this.dynamicsMor = new DynamicsMor();
            this.dynamicsMor.incidentReference = string.IsNullOrWhiteSpace(entity.IncidentReference) ? null : $"/incidents({entity.IncidentReference})";
            this.dynamicsMor.bsr_briefdescription = entity.DescribeRiskIncident;
            this.dynamicsMor.bsr_immediateactionstaken = entity.ActionsToKeepSafe;
            this.dynamicsMor.bsr_noticesubmittedon = DateTime.UtcNow;
            this.dynamicsMor.bsr_morstage = MorStage.NoticeSubmitted;
            this.dynamicsMor.bsr_noticesubmittedbyrole = RoleSubmittingNotice(entity.NoticeOrgRole);
            this.dynamicsMor.bsr_noticeorganisationname = entity.NoticeOrganisationName;
            this.dynamicsMor.bsr_occurrenceidentifiedon = entity.WhenBecomeAware != null ? GetDate(entity.WhenBecomeAware.Year, entity.WhenBecomeAware.Month, entity.WhenBecomeAware.Day, entity.WhenBecomeAware.Hour, entity.WhenBecomeAware.Minute) : null;
            this.dynamicsMor.bsr_bsr_identifybuildingcode = entity.BuildingModel != null ? IdentifyBuilding(entity.BuildingModel.IdentifyBuilding) : null;
            this.dynamicsMor.bsr_howwouldyoudescribethebuilding = entity.BuildingModel != null ? HowDescribeBuilding(entity.BuildingModel.BuildingType) : null;
            this.dynamicsMor.bsr_buildinglocation = entity.BuildingModel != null && !string.IsNullOrWhiteSpace(entity.BuildingModel.LocateBuilding) ? entity.BuildingModel.LocateBuilding : null;
            this.dynamicsMor.bsr_typeofoccurrence = entity.IncidentReported.Length > 0 ? WhatHappened(entity.IncidentReported) : null;
            this.dynamicsMor.bsr_incidentorsituation = !string.IsNullOrWhiteSpace(entity.WhatToReport) ? WhatToReport(entity.WhatToReport) : null;
            this.dynamicsMor.bsr_reportorganisationname = !string.IsNullOrWhiteSpace(entity.ReportOrganisationName) ? entity.ReportOrganisationName : null;

            IncidentRiskDetails(entity);
            AddingContactReference(entity);

            return this.dynamicsMor;
        }

        public override Mor BuildEntity(DynamicsMor dynamicsEntity)
        {
            throw new NotImplementedException();
        }

        private void IncidentRiskDetails(Mor entity) {
            if (!entity.IsNotice)
            {
                if (entity.WhatToReport == "incident")
                {
                    this.dynamicsMor = dynamicsMor with { bsr_occurrencedescription = !string.IsNullOrWhiteSpace(entity.AboutIncident) ? entity.AboutIncident : null };
                    this.dynamicsMor = dynamicsMor with { bsr_cause = !string.IsNullOrWhiteSpace(entity.CauseOfIncident) ? entity.CauseOfIncident : null };
                    this.dynamicsMor = dynamicsMor with { bsr_affected = !string.IsNullOrWhiteSpace(entity.WhoAffectedByIncident) ? entity.WhoAffectedByIncident : null };
                    this.dynamicsMor = dynamicsMor with { bsr_actionstokeeppeoplesafe = !string.IsNullOrWhiteSpace(entity.IncidentKeepPeopleSafe) ? entity.IncidentKeepPeopleSafe : null };
                    this.dynamicsMor = dynamicsMor with { bsr_howdiscovered = !string.IsNullOrWhiteSpace(entity.OccurrenceDiscovered) ? entity.OccurrenceDiscovered : null };
                    this.dynamicsMor = dynamicsMor with { bsr_infotobeshared = !string.IsNullOrWhiteSpace(entity.SharedWithOthers) ? entity.SharedWithOthers : null };
                }
                else
                {
                    this.dynamicsMor = dynamicsMor with { bsr_occurrencedescription = !string.IsNullOrWhiteSpace(entity.AboutRisk) ? entity.AboutRisk : null };
                    this.dynamicsMor = dynamicsMor with { bsr_cause = !string.IsNullOrWhiteSpace(entity.CauseOfRisk) ? entity.CauseOfRisk : null };
                    this.dynamicsMor = dynamicsMor with { bsr_affected = !string.IsNullOrWhiteSpace(entity.WhoAffectedByRisk) ? entity.WhoAffectedByRisk : null };
                    this.dynamicsMor = dynamicsMor with { bsr_actionstokeeppeoplesafe = !string.IsNullOrWhiteSpace(entity.RiskKeepPeopleSafe) ? entity.RiskKeepPeopleSafe : null };
                    this.dynamicsMor = dynamicsMor with { bsr_howdiscovered = !string.IsNullOrWhiteSpace(entity.OrganisationFindOut) ? entity.OrganisationFindOut : null };
                    this.dynamicsMor = dynamicsMor with { bsr_infotobeshared = !string.IsNullOrWhiteSpace(entity.SharedWithOthers) ? entity.SharedWithOthers : null };
                }
            }
            else 
            {
                this.dynamicsMor = dynamicsMor with { bsr_occurrencedescription = null };
                this.dynamicsMor = dynamicsMor with { bsr_cause =  null };
                this.dynamicsMor = dynamicsMor with { bsr_affected = null };
                this.dynamicsMor = dynamicsMor with { bsr_actionstokeeppeoplesafe = null };
                this.dynamicsMor = dynamicsMor with { bsr_howdiscovered =  null };
                this.dynamicsMor = dynamicsMor with { bsr_infotobeshared = null };
            }
            
        }

        private void AddingContactReference(Mor entity)
        {
            this.dynamicsMor = dynamicsMor with { customerNoticeReferenceId = !string.IsNullOrWhiteSpace(entity.CustomerNoticeReferenceId) ? $"/contacts({entity.CustomerNoticeReferenceId})" : null };
            this.dynamicsMor = dynamicsMor with { customerReportReferenceId = !string.IsNullOrWhiteSpace(entity.CustomerReportReferenceId) ? $"/contacts({entity.CustomerReportReferenceId})" : null };
        }

        private string WhatHappened(string[] types)
        {
            string typeOfOccurrence = string.Empty;
            List<string> selectedOccurencies = new List<string>();
            foreach (string typeItem in types)
            {
                if (occurencies.TryGetValue(typeItem, out typeOfOccurrence)) {
                    selectedOccurencies.Add(typeOfOccurrence);
                }
            }
            return string.Join(",", selectedOccurencies);           
        }

        private NoticeRole? RoleSubmittingNotice(string role)
        {
            switch (role)
            {
                case "acc_person": return NoticeRole.AccountablePerson;
                case "principal_acc_person": return NoticeRole.PrincipalAccountablePerson;
                case "principal_contractor": return NoticeRole.PrincipalContractor;
                case "principal_designer": return NoticeRole.PrincipalDesigner;
                case "on_behalf": return NoticeRole.ActingOnBehalf;
                case "other": return NoticeRole.Other;
                case null: return null;
            }

            throw new ArgumentException();
        }

        private BuildingCode? IdentifyBuilding(string code)
        {
            switch (code)
            {
                case "building_registration": return BuildingCode.HRBNumber;
                case "building_reference": return BuildingCode.BCAReference;
                case null: return null;
            }

            throw new ArgumentException();
        }

        private IncidentOrSituation? WhatToReport(string code)
        {
            switch (code)
            {
                case "incident": return IncidentOrSituation.Incident;
                case "risk": return IncidentOrSituation.Risk;
                case null: return null;
            }

            throw new ArgumentException();
        }

        private BuildingType? HowDescribeBuilding(string type)
        {
            switch (type)
            {
                case "occupied": return BuildingType.Occupied;
                case "complete_not_occupied": return BuildingType.CompleteNotOccupied;
                case "in_construction": return BuildingType.InConstruction;
                case "in_design": return BuildingType.InDesign;
                case null: return null;
            }

            throw new ArgumentException();
        }

        private DateTime? GetDate(string year, string month, string day, string hour, string minutes)
        {
            var dateString = $"{year}-{month}-{day}T{hour}:{minutes}:00";
            var dateTime = DateTime.UtcNow;
            var isDate = DateTime.TryParse(dateString, new CultureInfo("en-GB"), out dateTime);
            return isDate ? dateTime : null;
        }

        private Dictionary<string, string?> occurencies = new Dictionary<string, string?>
        {
            {"structural_failure", "760810000" },
            { "fire_spread", "760810001" },
            { "fire_safety", "760810002" }
        };
    }
}
