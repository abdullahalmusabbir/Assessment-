using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLotteryEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionCirculars_AcademicYears_AcademicYearId",
                table: "AdmissionCirculars");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_AdmissionCirculars_AdmissionCircularId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_ClassShifts_ClassShiftId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_StudentIds_StudentIdId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassShifts_SchoolClasses_SchoolClassId",
                table: "ClassShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AdmissionHolds_AdmissionHoldId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_StudentIds_StudentIdId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentIds_AdmissionCirculars_AdmissionCircularId",
                table: "StudentIds");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentIds_ClassShifts_ClassShiftId",
                table: "StudentIds");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_StudentIds_UserId",
                table: "StudentIds");

            migrationBuilder.DropIndex(
                name: "IX_ClassShifts_SchoolClassId",
                table: "ClassShifts");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ClassShift_TotalSeats",
                table: "ClassShifts");

            migrationBuilder.DropIndex(
                name: "IX_AdmissionCirculars_AcademicYearId",
                table: "AdmissionCirculars");

            migrationBuilder.AlterColumn<string>(
                name: "RegistrationNumber",
                table: "StudentIds",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(30)",
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SchoolClasses",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "SchoolClasses",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentMethod",
                table: "Payments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "IdempotencyKey",
                table: "Payments",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "Payments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "ShiftName",
                table: "ClassShifts",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "MinimumAge",
                table: "ClassShifts",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MaximumAge",
                table: "ClassShifts",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AdmissionCirculars",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaymentDeadline",
                table: "AdmissionCirculars",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AcademicYears",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.CreateTable(
                name: "LotteryDraws",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AdmissionCircularId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassShiftId = table.Column<Guid>(type: "uuid", nullable: false),
                    DrawDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    DrawnByUserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TotalEligibleStudents = table.Column<int>(type: "integer", nullable: false),
                    TotalSelectedStudents = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LotteryDraws", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LotteryDraws_AdmissionCirculars_AdmissionCircularId",
                        column: x => x.AdmissionCircularId,
                        principalTable: "AdmissionCirculars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LotteryDraws_ClassShifts_ClassShiftId",
                        column: x => x.ClassShiftId,
                        principalTable: "ClassShifts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LotteryResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LotteryDrawId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentIdId = table.Column<Guid>(type: "uuid", nullable: false),
                    Position = table.Column<int>(type: "integer", nullable: false),
                    IsSelected = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LotteryResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LotteryResults_LotteryDraws_LotteryDrawId",
                        column: x => x.LotteryDrawId,
                        principalTable: "LotteryDraws",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LotteryResults_StudentIds_StudentIdId",
                        column: x => x.StudentIdId,
                        principalTable: "StudentIds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentIds_UserId_ClassShiftId_AdmissionCircularId",
                table: "StudentIds",
                columns: new[] { "UserId", "ClassShiftId", "AdmissionCircularId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SchoolClasses_ClassNumber",
                table: "SchoolClasses",
                column: "ClassNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_IdempotencyKey",
                table: "Payments",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClassShifts_SchoolClassId_ShiftName",
                table: "ClassShifts",
                columns: new[] { "SchoolClassId", "ShiftName" },
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "CK_ClassShifts_TotalSeats",
                table: "ClassShifts",
                sql: "\"TotalSeats\" >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_AdmissionCirculars_AcademicYearId_Title",
                table: "AdmissionCirculars",
                columns: new[] { "AcademicYearId", "Title" });

            migrationBuilder.CreateIndex(
                name: "IX_AcademicYears_Year",
                table: "AcademicYears",
                column: "Year",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LotteryDraws_AdmissionCircularId",
                table: "LotteryDraws",
                column: "AdmissionCircularId");

            migrationBuilder.CreateIndex(
                name: "IX_LotteryDraws_ClassShiftId",
                table: "LotteryDraws",
                column: "ClassShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_LotteryResults_LotteryDrawId",
                table: "LotteryResults",
                column: "LotteryDrawId");

            migrationBuilder.CreateIndex(
                name: "IX_LotteryResults_StudentIdId",
                table: "LotteryResults",
                column: "StudentIdId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionCirculars_AcademicYears_AcademicYearId",
                table: "AdmissionCirculars",
                column: "AcademicYearId",
                principalTable: "AcademicYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_AdmissionCirculars_AdmissionCircularId",
                table: "AdmissionHolds",
                column: "AdmissionCircularId",
                principalTable: "AdmissionCirculars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_ClassShifts_ClassShiftId",
                table: "AdmissionHolds",
                column: "ClassShiftId",
                principalTable: "ClassShifts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_StudentIds_StudentIdId",
                table: "AdmissionHolds",
                column: "StudentIdId",
                principalTable: "StudentIds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassShifts_SchoolClasses_SchoolClassId",
                table: "ClassShifts",
                column: "SchoolClassId",
                principalTable: "SchoolClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AdmissionHolds_AdmissionHoldId",
                table: "Payments",
                column: "AdmissionHoldId",
                principalTable: "AdmissionHolds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_StudentIds_StudentIdId",
                table: "Payments",
                column: "StudentIdId",
                principalTable: "StudentIds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentIds_AdmissionCirculars_AdmissionCircularId",
                table: "StudentIds",
                column: "AdmissionCircularId",
                principalTable: "AdmissionCirculars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentIds_ClassShifts_ClassShiftId",
                table: "StudentIds",
                column: "ClassShiftId",
                principalTable: "ClassShifts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionCirculars_AcademicYears_AcademicYearId",
                table: "AdmissionCirculars");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_AdmissionCirculars_AdmissionCircularId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_ClassShifts_ClassShiftId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_AdmissionHolds_StudentIds_StudentIdId",
                table: "AdmissionHolds");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassShifts_SchoolClasses_SchoolClassId",
                table: "ClassShifts");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_AdmissionHolds_AdmissionHoldId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_StudentIds_StudentIdId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentIds_AdmissionCirculars_AdmissionCircularId",
                table: "StudentIds");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentIds_ClassShifts_ClassShiftId",
                table: "StudentIds");

            migrationBuilder.DropTable(
                name: "LotteryResults");

            migrationBuilder.DropTable(
                name: "LotteryDraws");

            migrationBuilder.DropIndex(
                name: "IX_StudentIds_UserId_ClassShiftId_AdmissionCircularId",
                table: "StudentIds");

            migrationBuilder.DropIndex(
                name: "IX_SchoolClasses_ClassNumber",
                table: "SchoolClasses");

            migrationBuilder.DropIndex(
                name: "IX_Payments_IdempotencyKey",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_ClassShifts_SchoolClassId_ShiftName",
                table: "ClassShifts");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ClassShifts_TotalSeats",
                table: "ClassShifts");

            migrationBuilder.DropIndex(
                name: "IX_AdmissionCirculars_AcademicYearId_Title",
                table: "AdmissionCirculars");

            migrationBuilder.DropIndex(
                name: "IX_AcademicYears_Year",
                table: "AcademicYears");

            migrationBuilder.AlterColumn<string>(
                name: "RegistrationNumber",
                table: "StudentIds",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "SchoolClasses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "SchoolClasses",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PaymentMethod",
                table: "Payments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "IdempotencyKey",
                table: "Payments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "Payments",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ShiftName",
                table: "ClassShifts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "MinimumAge",
                table: "ClassShifts",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "MaximumAge",
                table: "ClassShifts",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AdmissionCirculars",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<DateTime>(
                name: "PaymentDeadline",
                table: "AdmissionCirculars",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "AcademicYears",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentIds_UserId",
                table: "StudentIds",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassShifts_SchoolClassId",
                table: "ClassShifts",
                column: "SchoolClassId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ClassShift_TotalSeats",
                table: "ClassShifts",
                sql: "\"TotalSeats\" >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_AdmissionCirculars_AcademicYearId",
                table: "AdmissionCirculars",
                column: "AcademicYearId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionCirculars_AcademicYears_AcademicYearId",
                table: "AdmissionCirculars",
                column: "AcademicYearId",
                principalTable: "AcademicYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_AdmissionCirculars_AdmissionCircularId",
                table: "AdmissionHolds",
                column: "AdmissionCircularId",
                principalTable: "AdmissionCirculars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_ClassShifts_ClassShiftId",
                table: "AdmissionHolds",
                column: "ClassShiftId",
                principalTable: "ClassShifts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AdmissionHolds_StudentIds_StudentIdId",
                table: "AdmissionHolds",
                column: "StudentIdId",
                principalTable: "StudentIds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassShifts_SchoolClasses_SchoolClassId",
                table: "ClassShifts",
                column: "SchoolClassId",
                principalTable: "SchoolClasses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_AdmissionHolds_AdmissionHoldId",
                table: "Payments",
                column: "AdmissionHoldId",
                principalTable: "AdmissionHolds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_StudentIds_StudentIdId",
                table: "Payments",
                column: "StudentIdId",
                principalTable: "StudentIds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentIds_AdmissionCirculars_AdmissionCircularId",
                table: "StudentIds",
                column: "AdmissionCircularId",
                principalTable: "AdmissionCirculars",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentIds_ClassShifts_ClassShiftId",
                table: "StudentIds",
                column: "ClassShiftId",
                principalTable: "ClassShifts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
