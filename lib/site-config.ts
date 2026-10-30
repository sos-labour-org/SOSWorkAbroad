export const siteConfig = {
  name: "SOS Work Abroad",
  tagline: "Transfer to Transform",
    licence: "[Licence number to be added]",
      links: {
    soslabour: "https://soslabour.com",
  },

  // Placeholders until your boss sends the real details
  contact: {
    phone: "+1 (940) 977-1707",
    whatsapp: "+1 (940) 977-1707",
    email: "info@nekotechcenter.org",
  },
  social: {
    facebook: "SOS Work Abroad on Facebook",
    instagram: "@sosworkabroad_official",
    x: "@SOSWorkAbroad_7",
    tiktok: "@sosworkabroad_official",
    youtube: "SOS Work Abroad on YouTube",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Become an Agent", href: "/agents" },
    { label: "Contact Us", href: "/contact" },
  ],

  firstBatch: { label: "November 2026" },

    included: [
    "Flight ticket",
    "Medical examinations",
    "Documentation and processing",
    "Everything else you need to travel",
  ],

  packages: {
    uae: {
      name: "UAE Jobs",
      amount: 4990,
      currency: "GHS",
      href: "/apply/uae",
      badge: "First batch leaving November",
      highlight: true,
      note: "Working in the UAE also makes it easier to move on to European opportunities later.",
    },
    europe: {
      name: "European Jobs",
      amount: 4990,
      currency: "USD",
      href: "/apply/europe",
      badge: "",
      highlight: false,
      note: "The direct route to work in European countries.",
    },
  },
};