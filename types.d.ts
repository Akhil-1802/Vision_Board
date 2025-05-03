// types/global.d.ts
import type { Connection } from 'mongoose';

declare global {
  // Extend the global object
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}
// types.d.ts (in project root)

// Override the module typing if necessary
declare module 'app/(ideas)/create/[id]/page' {
  export interface PageProps {
    params: {
      id: string;
    };
    searchParams?: any;
  }

  const Page: (props: PageProps) => JSX.Element;
  export default Page;
}


export {};
