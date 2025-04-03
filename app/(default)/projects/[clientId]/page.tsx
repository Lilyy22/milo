'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ClientData } from '@/app/types';

export default function Jobs() {
  const params = useParams();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/clientdata?id=${params.clientId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setClientData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error('Error fetching client data:', error.message);
        } else {
          setError('An unknown error occurred');
          console.error('Error fetching client data:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    if (params.clientId) {
      fetchClientData();
    }
  }, [params.clientId]);

  const formatDate = (isoString: string | undefined): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <div className="px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="px-4 py-8 text-red-500">Error: {error}</div>;
  }

  if (!clientData) {
    return <div className="px-4 py-8">No data available.</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page content */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
        {/* Content */}
        <div>
          <div className="mb-6">
            <Link className="btn-sm px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" href="/clients">
              <svg className="fill-current text-slate-400 dark:text-slate-500 mr-2" width="7" height="12" viewBox="0 0 7 12">
                <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
              </svg>
              <span>Back To Clients</span>
            </Link>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 italic mb-2">Created at {formatDate(clientData.createdAt.toString())}</div>
          <header className="mb-4">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Client: {clientData.clientName}</h1>
            <div className='space-x-3'>
            <button className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300">
                    <svg className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 shrink-0" viewBox="0 0 16 16">
                      <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                    </svg>
                    <span className="ml-2">Edit info</span>
                  </button>
                  <button className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-rose-500">
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
                      <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                    </svg>
                    <span className="ml-2">Delete client</span>
                  </button> 
                  </div>
          </header>

          {/* Company information (mobile) */}
          <div className="bg-white dark:bg-slate-800 p-5 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 mb-6 lg:hidden">
            <div className="text-center mb-6">
              <div className="inline-flex mb-3">
                {/* <Image className="w-16 h-16 rounded-full" src={Image06} width={64} height={64} alt="Company 01" /> */}
              </div>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Revolut Ltd</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 italic">179 Jobs Posted</div>
            </div>
            <div className="space-y-2 sm:flex sm:space-y-0 sm:space-x-2">
              <button className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white">Apply Today -&gt;</button>
              <button className="btn w-full dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300">Company Profile</button>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center -m-1">
              <div className="m-1">
                <a className="text-xs inline-flex font-medium bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-full text-center px-2.5 py-1" href="#0">
                  Full-time
                </a>
              </div>
              <div className="m-1">
                <a className="text-xs inline-flex font-medium bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-full text-center px-2.5 py-1" href="#0">
                  Senior Engineer
                </a>
              </div>
              <div className="m-1">
                <a className="text-xs inline-flex font-medium bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-full text-center px-2.5 py-1" href="#0">
                  Remote
                </a>
              </div>
            </div>
          </div>

          <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

          {/* The Role */}
          <div>
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">The Role</h2>
            <div className="space-y-6">
              <p>In the world of AI, behavioural predictions are leading the charge to better machine learning.</p>
              <p>
                There is so much happening in the AI space. Advances in the economic sectors have seen automated business practices rapidly
                increasing economic value. While the realm of the human sciences has used the power afforded by computational capabilities to
                solve many human based dilemmas. Even the art scene has adopted carefully selected ML applications to usher in the technological
                movement.
              </p>
              <p>
                Join us every second Wednesday as we host an open discussion about the amazing things happening in the world of AI and machine
                learning. Feel free to share your experiences, ask questions, ponder the possibilities, or just listen as we explore new topics
                and revisit old ones.
              </p>
            </div>
          </div>

          <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

          {/* About You */}
          <div>
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">About You</h2>
            <div className="space-y-6">
              <p>
                You love building great software. Your work could be supporting new feature development, migrating existing features, and
                creating other mobile and web solutions for customers. You&apos;ll have a primary focus on frontend development using Javascript. Our
                client&apos;s tech stack is JavaScript, primarily using React. A strong understanding of JS core (ES2019+) is required, with some
                exposure in Java as back-end technology. We use modern tools, which means you&apos;ll have the opportunity to work with Webpack,
                Redux, Apollo, Styled Components, and much more.
              </p>
              <p>
                You love learning. Engineering is an ever-evolving world. You enjoy playing with new tech and exploring areas that you might not
                have experience with yet. You are self-driven, self-learner willing to share knowledge and participate actively in your
                community.
              </p>
              <p>
                Having overlap with your team is critical when working in a global remote team. Modus requires all team members to overlap with
                EST morning hours daily. In addition, reliable high speed internet is a must.
              </p>
            </div>
          </div>

          <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

          {/* Things You Might Do */}
          <div>
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">Generated article:</h2>
            <div className="space-y-6">
              <p>
                Here you can find the article that is gonna be generated using the info that was submitted.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>The article is not generated yet</li>
                {/* <li>
                  Travel and meet great people- as part of our remote-first lifestyle, it&apos;s important that we come together as needed to work
                  together, meet each other in person and have fun together. Please keep that in mind when you apply.
                </li>
                <li>
                  Teach and be taught: Modus creates active teams that work in internal and external projects together, giving opportunities to
                  stay relevant with the latest technologies and learning from experts worldwide
                </li>
                <li>Interact directly with internal and external clients to represent Modus and its values</li> */}
              </ul>
            </div>
          </div>

          {/* Apply section */}
          <div className="mt-6">
            {/* <p className="font-medium italic mb-6">Do you have what it takes?</p> */}
            <div className="flex justify-between items-center">
              {/* Apply button */}
              <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">Generate article -&gt;</button>
              {/* Share */}
              <div className="flex items-center">
                <div className="text-sm text-slate-500 dark:text-slate-400 italic mr-4">Share:</div>
                <div className="flex items-center space-x-3">
                  <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-500">
                    <span className="sr-only">Share on Twitter</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 3.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8Z" />
                    </svg>
                  </button>
                  <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-500">
                    <span className="sr-only">Share on Facebook</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.023 16 6 9H3V6h3V4c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V6H13l-1 3H9.28v7H6.023Z" />
                    </svg>
                  </button>
                  <button className="text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-500">
                    <span className="sr-only">Share on Linkedin</span>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 1.146C0 .514.53 0 1.182 0h13.635C15.471 0 16 .513 16 1.146v13.708c0 .633-.53 1.146-1.183 1.146H1.182C.53 16 0 15.487 0 14.854V1.146ZM4.862 13.39V6.187H2.468v7.203h2.394ZM3.666 5.203c.834 0 1.354-.553 1.354-1.244-.016-.707-.52-1.245-1.338-1.245-.82 0-1.355.538-1.355 1.245 0 .691.52 1.244 1.323 1.244h.015Zm2.522 8.187h2.394V9.368c0-.215.015-.43.078-.584.173-.43.567-.876 1.229-.876.866 0 1.213.66 1.213 1.629v3.853h2.394V9.26c0-2.213-1.181-3.242-2.756-3.242-1.292 0-1.86.722-2.174 1.213h.016V6.187H6.188c.03.676 0 7.203 0 7.203Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

          {/* Related Jobs */}
          {/* <div>
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-6">Related Jobs</h2>
            <div className="space-y-2 mt-6">
              {jobs.map(job => (
                <JobsItem
                  key={job.id}
                  job={job} />
              ))}
            </div>
          </div> */}
        </div>

        {/* Sidebar */}
        {/* <div className="hidden lg:block space-y-4"> */}

          {/* Company information (desktop) */}
          {/* <div className="bg-white dark:bg-slate-800 p-5 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 lg:w-[18rem] xl:w-[20rem]"> */}
            {/* <div className="text-center mb-6"> */}
              {/* <div className="inline-flex mb-3"> */}
                {/* <Image className="w-16 h-16 rounded-full" src={Image06} width={64} height={64} alt="Company 01" /> */}
              {/* </div> */}
              {/* <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Revolut Ltd</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 italic">179 Jobs Posted</div> */}
            {/* </div>
            <div className="space-y-2">
              <button className="btn w-full bg-indigo-500 hover:bg-indigo-600 text-white">Generate an article-&gt;</button>
              <button className="btn w-full dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300">Company Profile</button> */}
            {/* </div> */}
          {/* </div> */}

        {/* </div> */}

      </div>

    </div>
  )
}
