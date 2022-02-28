using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AssetManagement.Migrations
{
    public partial class FixRequestBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RequestBy",
                table: "RequestReturns",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RequestReturns_RequestBy",
                table: "RequestReturns",
                column: "RequestBy");

            migrationBuilder.AddForeignKey(
                name: "FK_RequestReturns_Users_RequestBy",
                table: "RequestReturns",
                column: "RequestBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RequestReturns_Users_RequestBy",
                table: "RequestReturns");

            migrationBuilder.DropIndex(
                name: "IX_RequestReturns_RequestBy",
                table: "RequestReturns");

            migrationBuilder.DropColumn(
                name: "RequestBy",
                table: "RequestReturns");
        }
    }
}
