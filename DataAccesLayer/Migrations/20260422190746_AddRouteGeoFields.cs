using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddRouteGeoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BestSeason",
                table: "Routes",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "EndLat",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "EndLng",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Routes",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "StartLat",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "StartLng",
                table: "Routes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateTable(
                name: "RouteCoords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteId = table.Column<int>(type: "integer", nullable: false),
                    Lat = table.Column<double>(type: "double precision", nullable: false),
                    Lng = table.Column<double>(type: "double precision", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteCoords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteCoords_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RouteHighlights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RouteId = table.Column<int>(type: "integer", nullable: false),
                    Text = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteHighlights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteHighlights_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RouteCoords_RouteId",
                table: "RouteCoords",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteHighlights_RouteId",
                table: "RouteHighlights",
                column: "RouteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RouteCoords");

            migrationBuilder.DropTable(
                name: "RouteHighlights");

            migrationBuilder.DropColumn(
                name: "BestSeason",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "EndLat",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "EndLng",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "StartLat",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "StartLng",
                table: "Routes");
        }
    }
}
