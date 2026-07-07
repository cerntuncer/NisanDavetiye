using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NisanDavetiye.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddRsvpAdminListedenGizli : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AdminListedenGizli",
                table: "RsvpKayitlari",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "DavetiyeAyarlari",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Adres", "EtkinlikTarihi", "HaritaEmbedUrl", "HaritaLink", "MekanAdi" },
                values: new object[] { "Cumhuriyet Mah. Malatya Cad. Hazar Dağlı Kavşağı, Merkez / Elazığ", new DateTime(2026, 7, 24, 19, 0, 0, 0, DateTimeKind.Unspecified), "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3062.886!2d39.1768327!3d38.666045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4076c1bca9e9b6c1%3A0xf6d1059611873dee!2sWinner%27s%20Davet%20Evi!5e0!3m2!1str!2str!4v1", "https://maps.app.goo.gl/6peSAmVGAKMruPxo6", "Winner's Davet Evi" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "DavetiyeAyarlari",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Adres", "EtkinlikTarihi", "HaritaEmbedUrl", "HaritaLink", "MekanAdi" },
                values: new object[] { "Bebek, Cevdet Paşa Cd. No:12, Beşiktaş/İstanbul", new DateTime(2026, 8, 15, 19, 0, 0, 0, DateTimeKind.Unspecified), "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.0!2d29.043!3d41.077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzM3LjIiTiAyOcKwMDInMzQuOCJF!5e0!3m2!1str!2str!4v1", "https://maps.google.com/?q=Bebek+İstanbul", "Grand Bosphorus Salon" });

            migrationBuilder.DropColumn(
                name: "AdminListedenGizli",
                table: "RsvpKayitlari");
        }
    }
}
