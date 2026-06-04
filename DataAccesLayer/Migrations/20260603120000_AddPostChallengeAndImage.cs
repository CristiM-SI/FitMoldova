using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddPostChallengeAndImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AttachedChallengeId",
                table: "Posts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AttachedChallengeProgress",
                table: "Posts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageThumbnailUrl",
                table: "Posts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Posts",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_AttachedChallengeId",
                table: "Posts",
                column: "AttachedChallengeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Challenges_AttachedChallengeId",
                table: "Posts",
                column: "AttachedChallengeId",
                principalTable: "Challenges",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Challenges_AttachedChallengeId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_AttachedChallengeId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AttachedChallengeId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "AttachedChallengeProgress",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "ImageThumbnailUrl",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Posts");
        }
    }
}
