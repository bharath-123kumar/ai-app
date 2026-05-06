import { Hero } from '@/components/dynamic/Hero';
import { Form } from '@/components/dynamic/Form';
import { Table } from '@/components/dynamic/Table';
import { CsvImport } from '@/components/dynamic/CsvImport';

export const componentRegistry: Record<string, React.FC<any>> = {
  hero: Hero,
  form: Form,
  table: Table,
  'csv-import': CsvImport,
};

export const getComponent = (type: string) => {
  return componentRegistry[type] || null;
};
