namespace NisanDavetiye.DAL.Entities;

public class RsvpKayit
{
    public int Id { get; set; }
    public string AdSoyad { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public bool Katilacak { get; set; }
    public int KisiSayisi { get; set; } = 1;
    public string Mesaj { get; set; } = string.Empty;
    public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;
    public bool AdminListedenGizli { get; set; }
}
