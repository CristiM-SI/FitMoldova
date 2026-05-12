using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FitMoldova.DataAccesLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddPostBookmarks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRepost",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "OriginalPostId",
                table: "Posts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PollOptions",
                table: "Posts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Reposts",
                table: "Posts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PostBookmarks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostBookmarks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostBookmarks_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostBookmarks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostPollVotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    OptionIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostPollVotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostPollVotes_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostPollVotes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostReplyLikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ReplyId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReplyLikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostReplyLikes_PostReplies_ReplyId",
                        column: x => x.ReplyId,
                        principalTable: "PostReplies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostReplyLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostReposts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PostId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReposts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostReposts_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PostReposts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostBookmarks_PostId",
                table: "PostBookmarks",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostBookmarks_UserId_PostId",
                table: "PostBookmarks",
                columns: new[] { "UserId", "PostId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PostPollVotes_PostId",
                table: "PostPollVotes",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostPollVotes_UserId_PostId",
                table: "PostPollVotes",
                columns: new[] { "UserId", "PostId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PostReplyLikes_ReplyId",
                table: "PostReplyLikes",
                column: "ReplyId");

            migrationBuilder.CreateIndex(
                name: "IX_PostReplyLikes_UserId_ReplyId",
                table: "PostReplyLikes",
                columns: new[] { "UserId", "ReplyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PostReposts_PostId",
                table: "PostReposts",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostReposts_UserId_PostId",
                table: "PostReposts",
                columns: new[] { "UserId", "PostId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostBookmarks");

            migrationBuilder.DropTable(
                name: "PostPollVotes");

            migrationBuilder.DropTable(
                name: "PostReplyLikes");

            migrationBuilder.DropTable(
                name: "PostReposts");

            migrationBuilder.DropColumn(
                name: "IsRepost",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "OriginalPostId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "PollOptions",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Reposts",
                table: "Posts");
        }
    }
}
