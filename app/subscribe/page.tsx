import React from 'react';
import Base from '@/components/base';
import {NewsletterSection} from '@/components/newsletter';
import {Metadata} from 'next';
import {appConfigs} from "@/resources/resources";
import {dictionary} from "@/resources/dictionary";

export const metadata: Metadata = {
  title: `${dictionary.subscribe.title} | ${appConfigs["app-name"]}`,
  description: dictionary.subscribe.description,
};

export default function SubscribePage() {
  return (
    <Base hideNewsletter={true} hideInstagram={true} wrapperClassName="text-gray-900 font-sans" mainClassName="bg-blue-600 pt-20 flex items-center justify-center">
      <div className={"mb-16 mt-20 pb-28"}>
        <NewsletterSection/>
      </div>
    </Base>
  );
}
