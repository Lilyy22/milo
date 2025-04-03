import Link from 'next/link'
import Image from 'next/image'
import UserImage07 from '@/public/images/applications-image-24.jpg'
import { notFound } from 'next/navigation'

type Props = {
  params: { videoId: string }
}

type ClientInfo = {
  name: string
  pictoryJobId: string;
  project: {
    clientName: string
  }
}

async function getClientInfo(name: string): Promise<ClientInfo> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-stage-by-name?name=${name}`, { cache: 'no-store' });
  console.log('Fetching client info for:', name); 
  console.log('Response status:', res.status); 
  if (!res.ok) throw new Error('Failed to fetch client info');
  return res.json();
}

async function getVideoUrl(pictoryJobId: string): Promise<string> {
  return `https://rep-rhino-videos.nyc3.digitaloceanspaces.com/videos/${pictoryJobId}.mp4`;
}

export default async function MeetupPost({ params }: Props) {
  const videoId = decodeURIComponent(params.videoId)
  console.log('Video ID:', videoId); 

  let clientInfo: ClientInfo | null = null

  try {
    clientInfo = await getClientInfo(videoId)
    console.log('Client Info:', clientInfo); 
  } catch (error) {
    console.error('Error fetching client info:', error)
    notFound()
  }
  const videoUrl = await getVideoUrl(clientInfo?.pictoryJobId || 'defaultJobId');
  console.log('Video URL:', videoUrl); 

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
        <div>
          <div className="mb-6">
            <Link className="btn-sm px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" href="/projects">
              <svg className="fill-current text-slate-400 dark:text-slate-500 mr-2" width="7" height="12" viewBox="0 0 7 12">
                <path d="M5.4.6 6.8 2l-4 4 4 4-1.4 1.4L0 6z" />
              </svg>
              <span>Back To Clients</span>
            </Link>
          </div>
          
          <header className="mb-4">
            <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-2">{videoId}</h1>
            <p>
              {/* Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts. */}
              </p>
          </header>

          <div className="space-y-3 sm:flex sm:items-center sm:justify-between sm:space-y-0 mb-6">
            <div className="flex items-center sm:mr-4">
              <a className="block mr-2 shrink-0" href="#0">
                <Image className="rounded-full" src={UserImage07} width={32} height={32} alt="User 04" />
              </a>
              <div className="text-sm whitespace-nowrap">
                Video for {' '}
                <a className="font-semibold text-slate-800 dark:text-slate-100" href="#0">
                  {clientInfo?.project?.clientName}
                </a>
              </div>
              
            </div>
          </div>
          <div className="mb-6">
          <video controls className="w-full rounded-sm">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
          <div>
            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-2">Video description</h2>
            <p className="mb-6"></p>
            <p className="mb-6">
              {/* There is so much happening in the AI space. Advances in the economic sectors have seen automated business practices rapidly
              increasing economic value. While the realm of the human sciences has used the power afforded by computational capabilities to
              solve many human based dilemmas. Even the art scene has adopted carefully selected ML applications to usher in the technological
              movement. */}
            </p>
            <p className="mb-6">
              {/* Join us every second Wednesday as we host an open discussion about the amazing things happening in the world of AI and machine
              learning. Feel free to share your experiences, ask questions, ponder the possibilities, or just listen as we explore new topics
              and revisit old ones. */}
            </p>
          </div>
          <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

        </div>

        {/* Video Player */}
        
      </div>
    </div>
  )
}
