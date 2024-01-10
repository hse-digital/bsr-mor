using System.Text;

namespace HSE.MOR.API.Utils;

public static  class SpecialCharCleaner
{
    public static string RemoveSpecialCharacters(string str)
    {
        StringBuilder sb = new StringBuilder();
        foreach (char c in str)
        {
            if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '-' || c == '_' || c == '.')
            {
                sb.Append(c);
            }
        }
        if (sb.ToString() == "")
        {
            return "Invalid Name";
        }
        return sb.ToString();
    }
}
