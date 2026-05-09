using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    public partial class AddImageUrlToEvents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // IF NOT EXISTS — idempotent: nu eșuează dacă coloana exista deja din ALTER TABLE manual
            migrationBuilder.Sql(@"
                ALTER TABLE ""Events""
                ADD COLUMN IF NOT EXISTS ""ImageUrl"" VARCHAR(500) NOT NULL DEFAULT '';
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name:  "ImageUrl",
                table: "Events");
        }
    }
}
