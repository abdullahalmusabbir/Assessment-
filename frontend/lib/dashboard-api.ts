export const dashboardEndpoints = {
    studentProfile: "/api/students/me",
    studentApplications: "/api/student-applications/my-applications",
    studentPayments: "/api/payments/my-payments",
    studentResults: "/api/lottery/my-results",
    admissionApplications: "/api/student-applications",
    admissionCirculars: "/api/admission-circulars",
    publicAdmissionCirculars: "/api/admission-circulars",
    users: "/api/admin/users",
    classes: "/api/classes",
    academicYears: "/api/academic-years",
    adminCirculars: "/api/admission-circulars",
    lottery: "/api/lottery",
    reports: "/api/reports/admissions",
};

export type ResourceField = {
    name: string;
    label: string;
    type?: "text" | "email" | "number" | "date" | "textarea" | "select" | "password";
    required?: boolean;
    options?: { label: string; value: string }[];
    optionsEndpoint?: string;
};

export type ResourceColumn = {
    key: string;
    label: string;
};

export type ResourceConfig = {
    title: string;
    description: string;
    endpoint: string;
    columns: ResourceColumn[];
    fields: ResourceField[];
    searchableFields: string[];
    allowCreate?: boolean;
};

export const resourceConfigs: Record<string, ResourceConfig> = {
    users: {
        title: "User Management",
        description: "Create and manage user accounts.",
        endpoint: dashboardEndpoints.users,
        columns: [
            { key: "firstName", label: "First Name" },
            { key: "lastName", label: "Last Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
        ],
        fields: [
            { name: "firstName", label: "First Name", required: true },
            { name: "lastName", label: "Last Name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "password", label: "Password", type: "password", required: true },
            {
                name: "role",
                label: "Role",
                type: "select",
                required: true,
                options: [
                    { label: "Student", value: "Student" },
                    { label: "Admission Office", value: "AdmissionOffice" },
                    { label: "Admin", value: "Admin" },
                ],
            },
        ],
        searchableFields: ["firstName", "lastName", "email"],
    },
    classes: {
        title: "Class Management",
        description: "Manage school classes and their information.",
        endpoint: dashboardEndpoints.classes,
        columns: [
            { key: "name", label: "Class Name" },
            { key: "description", label: "Description" },
            { key: "isActive", label: "Active" },
        ],
        fields: [
            { name: "name", label: "Class Name", required: true },
            { name: "classNumber", label: "Class Number", type: "number", required: true },
            { name: "description", label: "Description", type: "textarea" },
            { name: "displayOrder", label: "Display Order", type: "number" },
        ],
        searchableFields: ["name", "description"],
    },
    academicYears: {
        title: "Academic Years",
        description: "Manage academic sessions.",
        endpoint: dashboardEndpoints.academicYears,
        columns: [
            { key: "name", label: "Academic Year" },
            { key: "startDate", label: "Start Date" },
            { key: "endDate", label: "End Date" },
            { key: "isActive", label: "Active" },
        ],
        fields: [
            { name: "name", label: "Academic Year", required: true },
            { name: "year", label: "Year", type: "number", required: true },
            { name: "startDate", label: "Start Date", type: "date", required: true },
            { name: "endDate", label: "End Date", type: "date", required: true },
        ],
        searchableFields: ["name"],
    },
    circulars: {
        title: "Admission Circulars",
        description: "Create and manage admission circulars.",
        endpoint: dashboardEndpoints.adminCirculars,
        columns: [
            { key: "title", label: "Title" },
            { key: "applicationStartDate", label: "Start Date" },
            { key: "applicationEndDate", label: "End Date" },
            { key: "isPublished", label: "Published" },
            { key: "isActive", label: "Active" },
        ],
        fields: [
            { name: "title", label: "Circular Title", required: true },
            { name: "description", label: "Description", type: "textarea" },
            {
                name: "academicYearId",
                label: "Academic Year",
                type: "select",
                required: true,
                optionsEndpoint: "/api/academic-years",
            },
            {
                name: "applicationStartDate",
                label: "Application Start",
                type: "date",
                required: true,
            },
            {
                name: "applicationEndDate",
                label: "Application End",
                type: "date",
                required: true,
            },
            {
                name: "paymentDeadline",
                label: "Payment Deadline",
                type: "date",
                required: true,
            },
        ],
        searchableFields: ["title", "description"],
    },
    lottery: {
        title: "Lottery Management",
        description: "Manage admission lottery.",
        endpoint: dashboardEndpoints.lottery,
        columns: [
            { key: "circularTitle", label: "Circular" },
            { key: "shiftName", label: "Class / Shift" },
            { key: "drawDate", label: "Draw Date" },
            { key: "isPublished", label: "Published" },
            { key: "totalEligibleStudents", label: "Eligible" },
            { key: "totalSelectedStudents", label: "Selected" },
        ],
        fields: [],
        allowCreate: false,
        searchableFields: ["circularTitle", "shiftName"],
    },
    reports: {
        title: "Reports",
        description: "View dashboard reports.",
        endpoint: dashboardEndpoints.reports,
        columns: [
            { key: "circularTitle", label: "Circular" },
            { key: "shiftName", label: "Class / Shift" },
            { key: "totalSeats", label: "Total Seats" },
            { key: "totalApplications", label: "Applications" },
            { key: "confirmedAdmissions", label: "Confirmed" },
            { key: "lotterySelected", label: "Lottery Selected" },
            { key: "totalCollectedAmount", label: "Collected (৳)" },
        ],
        fields: [],
        allowCreate: false,
        searchableFields: ["circularTitle", "shiftName"],
    },
};