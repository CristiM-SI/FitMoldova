using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddPostsAndComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClubId",
                table: "Posts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Posts",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "PostReplies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ClubId_CreatedAt",
                table: "Posts",
                columns: new[] { "ClubId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_IsDeleted",
                table: "Posts",
                column: "IsDeleted");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Posts_ClubId_CreatedAt",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_IsDeleted",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "PostReplies");
        }
    }
}
