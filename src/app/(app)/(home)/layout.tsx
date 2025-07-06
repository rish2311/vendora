import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Category } from '@/payload-types'
import { Navbar } from './navbar';
import { Footer } from './footer';
import { SearchFilters } from './search-filters';

interface Props {
    children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, // Populate subcategories, subctaegories[0] will be type of categories
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // Becaue of depth 1 we are confident "doc" will be of type Category.
      ...(doc as Category),
      subcategories: undefined,
    }))
  }));

  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar />
        <SearchFilters data={formattedData} />
        <div className='flex-1 bg-[#f4f4f0]'>{ children }
        </div>
        
        <Footer />
    </div>
  );
};

export default Layout