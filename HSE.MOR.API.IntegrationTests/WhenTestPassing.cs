using FluentAssertions;
using Xunit;


namespace HSE.MOR.API.IntegrationTests;

public class WhenTestPassing
{
    [Fact]
    public void PassingTest()
    {
        true.Should().BeTrue();
    }
}
