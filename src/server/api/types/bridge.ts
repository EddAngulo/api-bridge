export type ReportRow = {
	DateAdded: string;
	LeadSource?: string;
	AgencyLeadID?: number;
	VelocifyLeadID?: number;
	CVueStudentNumber?: string;
	Email1?: string;
	Phone1?: string;
	FirstName?: string;
	LastName?: string;
	Campus?: string;
	LeadVendor?: string;
	IsDuplicate?: boolean;
	ParentLeadId?: number;
	Status?: string;
};

export type Report = {
	"?xml": string;
	ReportResults: {
		Result: ReportRow[];
	};
};
