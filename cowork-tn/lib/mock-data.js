export const mockMembers = [
  {
    id: "MEM-001",
    fullName: "Syrine Haddad",
    plan: "Premium",
    status: "active",
    nextInvoiceAt: "2025-12-01",
    qrCode: "https://example.com/qr/mem-001",
  },
  {
    id: "MEM-002",
    fullName: "Oussama Fourati",
    plan: "Pro",
    status: "pending",
    nextInvoiceAt: "2025-12-05",
    qrCode: "https://example.com/qr/mem-002",
  },
];

export const mockBookings = [
  {
    id: "BOOK-101",
    member: "Syrine Haddad",
    resource: "Salle Atlas",
    start: "2025-11-27T09:00:00",
    end: "2025-11-27T11:00:00",
    status: "confirmed",
  },
  {
    id: "BOOK-109",
    member: "Oussama Fourati",
    resource: "Desk B12",
    start: "2025-11-27T13:00:00",
    end: "2025-11-27T18:00:00",
    status: "pending",
  },
];

export const mockInvoices = [
  {
    id: "INV-2025-001",
    member: "Syrine Haddad",
    amount: 149,
    status: "paid",
    issuedAt: "2025-11-01",
  },
  {
    id: "INV-2025-012",
    member: "Oussama Fourati",
    amount: 99,
    status: "due",
    issuedAt: "2025-11-15",
  },
];
