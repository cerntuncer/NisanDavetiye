using NisanDavetiye.BLL.DTOs;
using NisanDavetiye.DAL.Entities;
using NisanDavetiye.DAL.Repositories;

namespace NisanDavetiye.BLL.Services;

public class DavetiyeService : IDavetiyeService
{
    private readonly IDavetiyeRepository _repo;

    public DavetiyeService(IDavetiyeRepository repo) => _repo = repo;

    public async Task<DavetiyeDto> GetDavetiyeByUidAsync(string uid)
    {
        if (string.IsNullOrWhiteSpace(uid) || uid.Length != 32)
            throw new KeyNotFoundException();

        var ayar = await _repo.GetAyarlariByUidAsync(uid.Trim())
            ?? throw new KeyNotFoundException();

        var timeline = await _repo.GetTimelineAsync();
        var galeri = await _repo.GetGaleriAsync();

        return MapPublic(ayar, timeline, galeri);
    }

    public async Task<DavetiyeAdminDto> GetDavetiyeForAdminAsync()
    {
        var ayar = await _repo.GetAyarlariAsync()
            ?? throw new InvalidOperationException("Davetiye ayarları bulunamadı.");

        var timeline = await _repo.GetTimelineAsync();
        var galeri = await _repo.GetGaleriAsync();

        return MapAdmin(ayar, timeline, galeri);
    }

    public async Task<DavetiyeAdminDto> GuncelleAsync(DavetiyeGuncelleDto dto)
    {
        var ayar = await _repo.GetAyarlariAsync()
            ?? throw new InvalidOperationException("Davetiye ayarları bulunamadı.");

        ayar.GelinAdi = dto.GelinAdi.Trim();
        ayar.DamatAdi = dto.DamatAdi.Trim();
        ayar.BasHarpler = dto.BasHarpler.Trim();
        ayar.Baslik = dto.Baslik.Trim();
        ayar.HosgeldinMetni = dto.HosgeldinMetni.Trim();
        ayar.EtkinlikTarihi = dto.EtkinlikTarihi;
        ayar.MekanAdi = dto.MekanAdi.Trim();
        ayar.Adres = dto.Adres.Trim();
        ayar.HaritaEmbedUrl = dto.HaritaEmbedUrl.Trim();
        ayar.HaritaLink = dto.HaritaLink.Trim();
        ayar.KapakGorselUrl = dto.KapakGorselUrl.Trim();
        ayar.CiftFotoUrl = dto.CiftFotoUrl.Trim();
        ayar.AcilisVideoUrl = dto.AcilisVideoUrl.Trim();
        ayar.MuzikUrl = dto.MuzikUrl.Trim();
        ayar.ZarfArkaPlanUrl = dto.ZarfArkaPlanUrl.Trim();
        ayar.GaleriDriveKlasorUrl = dto.GaleriDriveKlasorUrl.Trim();

        await _repo.UpdateAyarlariAsync(ayar);

        var timeline = dto.Timeline
            .Select((t, i) => new TimelineOgesi
            {
                Id = t.Id > 0 ? t.Id : i + 1,
                Baslik = t.Baslik.Trim(),
                Aciklama = t.Aciklama.Trim(),
                Saat = t.Saat.Trim(),
                Sira = i + 1
            })
            .ToList();

        var galeri = dto.Galeri
            .Select((g, i) => new GaleriResmi
            {
                Id = g.Id > 0 ? g.Id : i + 1,
                Url = g.Url.Trim(),
                AltMetin = g.AltMetin.Trim(),
                Sira = i + 1
            })
            .ToList();

        await _repo.ReplaceTimelineAsync(timeline);
        await _repo.ReplaceGaleriAsync(galeri);

        return MapAdmin(ayar, timeline, galeri);
    }

    private static DavetiyeDto MapPublic(
        DavetiyeAyarlari ayar,
        IReadOnlyList<TimelineOgesi> timeline,
        IReadOnlyList<GaleriResmi> galeri) =>
        new(
            ayar.GelinAdi,
            ayar.DamatAdi,
            ayar.BasHarpler,
            ayar.Baslik,
            ayar.HosgeldinMetni,
            ayar.EtkinlikTarihi,
            ayar.MekanAdi,
            ayar.Adres,
            ayar.HaritaEmbedUrl,
            ayar.HaritaLink,
            ayar.KapakGorselUrl,
            ayar.CiftFotoUrl,
            ayar.AcilisVideoUrl,
            ayar.MuzikUrl,
            ayar.ZarfArkaPlanUrl,
            ayar.GaleriDriveKlasorUrl,
            timeline.Select(t => new TimelineDto(t.Id, t.Baslik, t.Aciklama, t.Saat, t.Sira)).ToList(),
            galeri.Select(g => new GaleriDto(g.Id, g.Url, g.AltMetin, g.Sira)).ToList());

    private static DavetiyeAdminDto MapAdmin(
        DavetiyeAyarlari ayar,
        IReadOnlyList<TimelineOgesi> timeline,
        IReadOnlyList<GaleriResmi> galeri) =>
        new(
            ayar.DavetUid,
            ayar.GelinAdi,
            ayar.DamatAdi,
            ayar.BasHarpler,
            ayar.Baslik,
            ayar.HosgeldinMetni,
            ayar.EtkinlikTarihi,
            ayar.MekanAdi,
            ayar.Adres,
            ayar.HaritaEmbedUrl,
            ayar.HaritaLink,
            ayar.KapakGorselUrl,
            ayar.CiftFotoUrl,
            ayar.AcilisVideoUrl,
            ayar.MuzikUrl,
            ayar.ZarfArkaPlanUrl,
            ayar.GaleriDriveKlasorUrl,
            timeline.Select(t => new TimelineDto(t.Id, t.Baslik, t.Aciklama, t.Saat, t.Sira)).ToList(),
            galeri.Select(g => new GaleriDto(g.Id, g.Url, g.AltMetin, g.Sira)).ToList());
}
