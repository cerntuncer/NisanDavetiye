namespace NisanDavetiye.BLL.DTOs;

public record TimelineDto(int Id, string Baslik, string Aciklama, string Saat, int Sira);

public record GaleriDto(int Id, string Url, string AltMetin, int Sira);

public record DavetiyeDto(
    string GelinAdi,
    string DamatAdi,
    string BasHarpler,
    string Baslik,
    string HosgeldinMetni,
    DateTime EtkinlikTarihi,
    string MekanAdi,
    string Adres,
    string HaritaEmbedUrl,
    string HaritaLink,
    string KapakGorselUrl,
    string CiftFotoUrl,
    string AcilisVideoUrl,
    string MuzikUrl,
    string ZarfArkaPlanUrl,
    string GaleriDriveKlasorUrl,
    IReadOnlyList<TimelineDto> Timeline,
    IReadOnlyList<GaleriDto> Galeri);

public record DavetiyeAdminDto(
    string DavetUid,
    string GelinAdi,
    string DamatAdi,
    string BasHarpler,
    string Baslik,
    string HosgeldinMetni,
    DateTime EtkinlikTarihi,
    string MekanAdi,
    string Adres,
    string HaritaEmbedUrl,
    string HaritaLink,
    string KapakGorselUrl,
    string CiftFotoUrl,
    string AcilisVideoUrl,
    string MuzikUrl,
    string ZarfArkaPlanUrl,
    string GaleriDriveKlasorUrl,
    IReadOnlyList<TimelineDto> Timeline,
    IReadOnlyList<GaleriDto> Galeri);

public record DavetiyeGuncelleDto(
    string GelinAdi,
    string DamatAdi,
    string BasHarpler,
    string Baslik,
    string HosgeldinMetni,
    DateTime EtkinlikTarihi,
    string MekanAdi,
    string Adres,
    string HaritaEmbedUrl,
    string HaritaLink,
    string KapakGorselUrl,
    string CiftFotoUrl,
    string AcilisVideoUrl,
    string MuzikUrl,
    string ZarfArkaPlanUrl,
    string GaleriDriveKlasorUrl,
    IReadOnlyList<TimelineDto> Timeline,
    IReadOnlyList<GaleriDto> Galeri);

public record RsvpOlusturDto(string AdSoyad, string Telefon, bool Katilacak, int KisiSayisi, string Mesaj);

public record RsvpDto(int Id, string AdSoyad, string Telefon, bool Katilacak, int KisiSayisi, string Mesaj, DateTime OlusturmaTarihi);
