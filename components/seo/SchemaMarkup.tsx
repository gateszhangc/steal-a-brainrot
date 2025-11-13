'use client';

import React from 'react';

interface SchemaMarkupProps {
  schemas: string[]; // Pass pre-generated JSON strings
}

export function SchemaMarkup({ schemas }: SchemaMarkupProps) {
  if (!schemas || schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.map((schemaString, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaString }}
        />
      ))}
    </>
  );
}

// Component for individual schema types (these should be generated server-side)
export function WebSiteSchema({ schemaString }: { schemaString: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
}

export function FAQSchema({ schemaString }: { schemaString: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
}

export function VideoGameSchema({ schemaString }: { schemaString: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
}

export default SchemaMarkup;