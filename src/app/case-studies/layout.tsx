import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Kuhandran SamudraPandiyan — ACS Assessed Technical Delivery Manager | Australia, UK, USA, NZ",
  description:
    "Real-world case studies by Kuhandran SamudraPandiyan — ACS assessed, IELTS certified Technical Delivery Manager targeting Australian banks (CBA, ANZ, Westpac, NAB), UK banks, USA, and NZ. React Native, Power BI, and enterprise banking solutions from FWD Insurance and Maybank.",
  keywords: [
    "Kuhandran SamudraPandiyan case studies",
    "ACS assessed software engineer case study",
    "banking software case study Australia",
    "CBA developer portfolio",
    "ANZ bank engineer portfolio",
    "Westpac software engineer portfolio",
    "NAB technology engineer portfolio",
    "Macquarie bank developer portfolio",
    "UK bank developer portfolio",
    "Barclays engineer portfolio",
    "HSBC developer case study",
    "React Native case study",
    "Power BI dashboard case study",
    "FWD Insurance technology case study",
    "Maybank software case study",
    "banking application case study",
    "enterprise software delivery portfolio",
    "technical delivery manager portfolio",
    "UOW graduate engineer portfolio",
    "Cardiff Met MBA engineer portfolio",
    "fintech Australia case study",
    "digital transformation banking case study",
  ].join(", "),
  openGraph: {
    title: "Case Studies | Kuhandran SamudraPandiyan — ACS Assessed | Available for Australian Banks",
    description:
      "Enterprise banking & insurance case studies: React Native apps, Power BI dashboards, and Agile delivery by Kuhandran SamudraPandiyan. ACS assessed, IELTS certified, UOW graduate.",
    url: "https://www.kuhandranchatbot.info/case-studies",
    siteName: "Kuhandran SamudraPandiyan",
    images: [
      {
        url: "https://www.kuhandranchatbot.info/image/profile.png",
        width: 1200,
        height: 630,
        alt: "Kuhandran SamudraPandiyan Case Studies",
      },
    ],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Kuhandran SamudraPandiyan",
    description:
      "Real-world enterprise projects in banking, insurance, and fintech by Kuhandran SamudraPandiyan.",
    images: ["https://www.kuhandranchatbot.info/image/profile.png"],
    creator: "@kuhan_samudra",
  },
  alternates: {
    canonical: "https://www.kuhandranchatbot.info/case-studies",
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
