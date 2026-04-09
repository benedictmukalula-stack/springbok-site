export type Programme = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  basePrice: number;
  currency: string;
};

export const programmes: Programme[] = [
  {
    id: "leadership-management-development",
    title: "Leadership Management Development",
    slug: "leadership-management-development",
    summary: "Build stronger leaders, managers, and decision-makers.",
    description:
      "A premium leadership and management development programme designed to strengthen execution, people leadership, communication, and accountability in modern organisations.",
    basePrice: 5000,
    currency: "ZAR",
  },
  {
    id: "customer-service-excellence",
    title: "Customer Service Excellence",
    slug: "customer-service-excellence",
    summary: "Improve service culture, responsiveness, and client experience.",
    description:
      "A practical service excellence programme focused on communication, service standards, responsiveness, and client retention.",
    basePrice: 3500,
    currency: "ZAR",
  },
  {
    id: "sales-business-development",
    title: "Sales and Business Development",
    slug: "sales-business-development",
    summary: "Strengthen pipeline generation, conversion, and strategic selling.",
    description:
      "A practical programme for teams that need stronger prospecting, conversion discipline, proposal quality, and account growth.",
    basePrice: 4500,
    currency: "ZAR",
  },
];
