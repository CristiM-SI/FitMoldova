using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    public partial class AddActivityFieldsAndParticipants : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Adaugă Description în Activities
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Activities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            // 2. Adaugă ImageUrl în Activities
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Activities",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            // 3. Adaugă CreatedAt în Activities
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Activities",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            // 4. Creează tabela ActivityParticipants
            migrationBuilder.CreateTable(
                name: "ActivityParticipants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActivityId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false,
                        defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityParticipants_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityParticipants_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Index unic: un user nu poate fi de două ori la aceeași activitate
            migrationBuilder.CreateIndex(
                name: "IX_ActivityParticipants_ActivityId_UserId",
                table: "ActivityParticipants",
                columns: new[] { "ActivityId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityParticipants_UserId",
                table: "ActivityParticipants",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "ActivityParticipants");
            migrationBuilder.DropColumn(name: "Description", table: "Activities");
            migrationBuilder.DropColumn(name: "ImageUrl", table: "Activities");
            migrationBuilder.DropColumn(name: "CreatedAt", table: "Activities");
        }
    }
}
