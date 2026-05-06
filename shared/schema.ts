export type FieldType = 'text' | 'number' | 'email' | 'password' | 'date' | 'select' | 'boolean';

export interface FieldDefinition {
  name: string;
  label: Record<string, string>;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface ComponentConfig {
  id: string;
  type: string;
  props: any;
  actions?: Record<string, any>;
}

export interface PageConfig {
  id: string;
  route: string;
  title: Record<string, string>;
  components: ComponentConfig[];
  protected?: boolean;
}

export interface TableConfig {
  name: string;
  fields: FieldDefinition[];
}

export interface AppConfig {
  name: string;
  defaultLanguage: string;
  languages: string[];
  pages: PageConfig[];
  tables: TableConfig[];
}
