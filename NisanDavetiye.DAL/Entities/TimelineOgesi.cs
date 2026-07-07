namespace NisanDavetiye.DAL.Entities;

public class TimelineOgesi
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public string Saat { get; set; } = string.Empty;
    public int Sira { get; set; }
}
