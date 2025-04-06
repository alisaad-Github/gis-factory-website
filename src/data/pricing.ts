
const pricingPlans = [
    {
      id: 0,
      name: "Project Basis",
      price: "Variable",
      period: "/ project",
      description: "Benefit from our expertise in the GIS and Data domain to reach your project goals.",
      features: [
        "Suits all types of businesses and industries",
        "Includes all services required for your project",
        "Switch to retainer anytime",
      ],
      recommended: false,
    },
    {
      id: 1,
      name: "Essential Retainer",
      price: "$1,500",
      period: "/ month",
      description: "Secure regular support for your organization regardless of projects and tasks.",
      features: [
        "For organizations requiring basic support and maintenance",
        "Includes all our services",
        "Up to 12 hours of support every week",
      ],
      recommended: false,
    },
    {
      id: 2,
      name: "Standard Retainer",
      price: "$3,000",
      period: "/ month",
      description: "Strengthen your organization by adding GIS and Data capacity to your team.",
      features: [
        "For medium to large scale organizations",
        "Includes all our services",
        "Up to 24 hours of support every week",
      ],
      recommended: true,
    },
    {
      id: 3,
      name: "Premium Retainer",
      price: "$5,000",
      period: "/ month",
      description: "Outsource your GIS and Data team and save your expansion costs.",
      features: [
        "For specialized companies looking for inhouse-like support",
        "Includes all our services",
        "5 days of support every week",
      ],
      recommended: false,
    },
  ]
  export default pricingPlans;