'use client';

import { getComponent } from '@/registry/components';
import { useLanguage } from '@/context/LanguageContext';

export const DynamicRenderer = ({ components }: { components: any[] }) => {
  const { t } = useLanguage();

  return (
    <div className="container">
      {components.map((config) => {
        const Component = getComponent(config.type);
        if (!Component) {
          return (
            <div key={config.id} className="card" style={{ border: '1px solid red' }}>
              <p style={{ color: 'red' }}>Unknown component type: {config.type}</p>
            </div>
          );
        }
        return <Component key={config.id} {...config.props} />;
      })}
    </div>
  );
};
