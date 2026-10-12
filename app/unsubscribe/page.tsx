import React from 'react';
import Base from '@/components/base';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

export const metadata: Metadata = {
  title: `${dictionary.unsubscribe.title} | ${appConfigs["app-name"]}`,
  description: dictionary.unsubscribe.description,
};

type UnsubscribePageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UnsubscribePage({searchParams}: UnsubscribePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const emailParam = typeof resolvedParams.email === 'string' ? resolvedParams.email : '';
  
  return (
    <Base
      marginBottom={false}
      hideNewsletter={true}
      hideInstagram={true}
      wrapperClassName="text-gray-900 font-sans"
      mainClassName="bg-blue-950 pt-20 flex items-center justify-center"
    >
      <div className="mb-16 mt-20 pb-28">
        <NewsletterSection mode="unsubscribe" initialEmail={emailParam}/>
      </div>
    </Base>
  );
}
