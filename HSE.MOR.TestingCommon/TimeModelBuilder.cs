
using HSE.MOR.Domain.Entities;
namespace HSE.MOR.TestingCommon;

public class TimeModelBuilder
{
    private string modelYear = "building_or_person";
    private string modelMonth = "building_or_person";
    private string modelDay = "building_or_person";
    private string modelHour = "building_or_person";
    private string modelMinute = "building_or_person";

    public TimeModelBuilder WithYear(string year)
    {
        modelYear = year;
        return this;
    }
    public TimeModelBuilder WithMonth(string month)
    {
        modelMonth = month;
        return this;
    }
    public TimeModelBuilder WithDay(string day)
    {
        modelDay = day;
        return this;
    }
    public TimeModelBuilder WithHour(string hour)
    {
        modelHour = hour;
        return this;
    }
    public TimeModelBuilder WithMinute(string minute)
    {
        modelMinute = minute;
        return this;
    }
    
    public TimeModel Build() 
    {
        var model = new TimeModel();
        model.Year = modelYear;
        model.Month = modelMonth;
        model.Day = modelDay;
        model.Hour = modelHour;
        model.Minute = modelMinute;
        return model;
    }
}
