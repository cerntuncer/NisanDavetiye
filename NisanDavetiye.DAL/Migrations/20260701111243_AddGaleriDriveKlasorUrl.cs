using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NisanDavetiye.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddGaleriDriveKlasorUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GaleriDriveKlasorUrl",
                table: "DavetiyeAyarlari",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GaleriDriveKlasorUrl",
                table: "DavetiyeAyarlari");
        }
    }
}
