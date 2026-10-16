export const contactEmail=(import.meta.env.PUBLIC_CONTACT_EMAIL || '').trim();
export const contactEndpoint=(import.meta.env.PUBLIC_CONTACT_ENDPOINT || '').trim();
export const privacyUrl=(import.meta.env.PUBLIC_PRIVACY_URL || '').trim();
export const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
export const secureEndpoint=/^https:\/\//.test(contactEndpoint);
export const validPrivacy=/^https:\/\//.test(privacyUrl)||privacyUrl.startsWith('/');
export const contactEnabled=validEmail&&secureEndpoint&&validPrivacy;
