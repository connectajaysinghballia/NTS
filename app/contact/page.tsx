import { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | NOVALYTIX Technology Services',
  description: "Get in touch with NOVALYTIX Technology Services. Reach out to us for project inquiries, partnerships, or any questions about our specialized technology solutions.",
};

export default function ContactPage() {
  return <ContactClient />;
}
