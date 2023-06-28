using FluentAssertions;
using Xunit;

namespace HSE.MOR.API.UnitTests;

public class WhenTestPassing
{
    [Fact]
    public void PassingTest()
    {
        true.Should().BeTrue();
    }
}
