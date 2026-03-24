import { Metadata } from 'next';
import { CareersClient } from './CareersClient';

export const metadata: Metadata = {
  title: 'Careers | NOVALYTIX Technology Services',
  description: 'Join a team of passionate innovators working on cutting-edge technology solutions at NOVALYTIX.',
};

export default function CareersPage() {
  return <CareersClient />;
}
