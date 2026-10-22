import { isReview } from './content';
export const contactEmail=(import.meta.env.PUBLIC_CONTACT_EMAIL || 'hello@thepacificedge.ca').trim();
export const contactEndpoint='/api/contact';
export const privacyUrl='/privacy';
export const turnstileSiteKey=(import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAFhZOFMZaIq7bLvM').trim();
export const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
export const contactConfigured=import.meta.env.PUBLIC_CONTACT_ENABLED==='true'&&validEmail&&Boolean(turnstileSiteKey);
export const isContactTest=isReview&&!import.meta.env.DEV&&import.meta.env.SITE_CONTACT_TEST==='true';
export const contactEnabled=(!isReview||isContactTest)&&contactConfigured;
