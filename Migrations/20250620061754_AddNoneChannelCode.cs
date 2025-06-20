using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace News.Migrations
{
    /// <inheritdoc />
    public partial class AddNoneChannelCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:ChannelCode", "email,none,telegram")
                .Annotation("Npgsql:Enum:Frequency", "custom,every_day,every_month,every_quarter,every_week,every_year,once")
                .Annotation("Npgsql:Enum:StatusCode", "lost,sent")
                .OldAnnotation("Npgsql:Enum:ChannelCode", "email,telegram")
                .OldAnnotation("Npgsql:Enum:Frequency", "custom,every_day,every_month,every_quarter,every_week,every_year,once")
                .OldAnnotation("Npgsql:Enum:StatusCode", "lost,sent");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:Enum:ChannelCode", "email,telegram")
                .Annotation("Npgsql:Enum:Frequency", "custom,every_day,every_month,every_quarter,every_week,every_year,once")
                .Annotation("Npgsql:Enum:StatusCode", "lost,sent")
                .OldAnnotation("Npgsql:Enum:ChannelCode", "email,none,telegram")
                .OldAnnotation("Npgsql:Enum:Frequency", "custom,every_day,every_month,every_quarter,every_week,every_year,once")
                .OldAnnotation("Npgsql:Enum:StatusCode", "lost,sent");
        }
    }
}
