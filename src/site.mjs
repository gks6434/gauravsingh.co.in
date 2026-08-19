// Single source of truth for site-wide values. Edit here, rebuild, done.
export const site = {
  name: 'Gaurav Kumar Singh',
  shortName: 'Gaurav Singh',
  domain: 'gauravsingh.co.in',
  url: 'https://gauravsingh.co.in',
  role: 'Digital Transformation · MarTech & Process Automation · AI-Enabled Solutions',
  tagline: 'Digital transformation, MarTech and applied AI.',
  description:
    'Gaurav Kumar Singh — digital transformation, MarTech and applied AI. Ten years building web platforms, CRM and lead lifecycle systems, workflow automation and AI-enabled customer experiences for B2B businesses.',

  // Contact — deliberately no phone number, and the address is shown obfuscated.
  // emailUser/emailDomain are assembled in the browser so the plain string never
  // appears in the served HTML for scrapers to lift.
  emailUser: 'gks.6434',
  emailDomain: 'gmail.com',
  emailDisplay: 'gks.6434 [at] gmail.com',

  location: 'Greater Noida West, Uttar Pradesh, India',
  linkedin: 'https://www.linkedin.com/in/gauravsingh0410/',
  employer: 'HORIBA India Pvt. Ltd.',
  jobTitle: 'Deputy Manager, Digital Marketing Lead',
  availability: 'Open to Digital Transformation & AI adoption roles',
  ogImage: '/assets/img/og.png',

  // Force HTTP -> HTTPS in .htaccess. Keep this false until the SSL
  // certificate is actually live: with no certificate, the redirect sends
  // every visitor to a handshake that fails (ERR_SSL_PROTOCOL_ERROR).
  // Flip to true once https://gauravsingh.co.in loads, then rebuild.
  forceHttps: false,

  nav: [
    { href: '/',         label: 'Home' },
    { href: '/about/',   label: 'About' },
    { href: '/work/',    label: 'Work' },
    { href: '/writing/', label: 'Writing' },
    { href: '/contact/', label: 'Contact' }
  ],
  alumniOf: [
    'Indian Institute of Management Kozhikode',
    'IMS Ghaziabad',
    'Visvesvaraya Technological University'
  ],
  knowsAbout: [
    'Digital Transformation', 'Marketing Technology', 'Business Process Automation',
    'Microsoft Power Automate', 'Salesforce', 'HubSpot', 'Google Analytics 4',
    'Google Tag Manager', 'Looker Studio', 'Lead Lifecycle Management',
    'Generative AI Adoption', 'Digital Product Management', 'Technical SEO'
  ]
};
