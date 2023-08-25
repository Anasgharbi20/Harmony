import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn, signOut,  useSession } from 'next-auth/react';
import Head from 'next/head';
import { api } from '@/utils/api';
import PostCard from '@/components/PostCard';
import LoadingDots from '@/components/LoadingDots';

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const postsQuery = api.post.getAll.useQuery();

  const handleClick = () => {
    router.push('/posts/new')
      .then(() => console.log('Redirection successful'))
      .catch(() => console.error('Error while redirection to creation page'));
  };

  return (
    <>
      <Head>
        <title>Manel qrcode</title>
        <meta
          name="description"
          content="application to guide people with visual impairment in public or private places by redirecting them to a web page with audio to guide them."
        />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="flex flex-col items-center justify-center bg-white">
        <div className="container flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 px-4 py-2 sm:py-16">
          {!!sessionData && (
            <>
              <div className="flex flex-col-reverse space-y-3 space-y-reverse sm:items-center sm:justify-between sm:space-y-0 md:flex-row">
                <h3 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-[2rem]">
                  Posts List
                </h3>
                {Array.isArray(postsQuery.data) && postsQuery.data?.length > 0 && (
                  <button
                    onClick={handleClick}
                    className="flex items-center justify-center gap-x-2 rounded-lg border-2 border-blue-600 px-5 py-2 text-sm tracking-wide bg-blue-600 text-white transition-colors duration-200 hover:bg-blue-800 hover:text-white sm:w-auto"
                  >
                    Add New Post
                  </button>
                )}
              </div>
              <div className="w-full max-w-2xl">
                {postsQuery.isLoading ? (
                  <LoadingDots />   
                               ) : !Array.isArray(postsQuery.data) || postsQuery.data?.length === 0 ? (
                  <button
                    onClick={handleClick}
                    type="button"
                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <div className="flex flex-row justify-center items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="blue"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#ffffff"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="ml-2 block text-sm font-semibold text-dark-900">
                       New Post
                      </span>
                    </div>
                  </button>
                ) : (
                  <>
                    {(postsQuery.data || []).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </>
                )}
              </div>
            </>
          )}
          <div style={{ margin: '45px 0px 45px' }}>
            <h1 className="text-5xl font-bold tracking-tight text-gray-800 sm:text-[5rem] ">
              Create
              <a className="text-5xl font-bold text-[#4169e1] sm:text-[4rem]">.QR.</a>Sound''
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-gray-700 px-10 py-3 font-semibold text-white transition hover:bg-gray-500"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Log out' : 'Log in'}
      </button>
    </div>
  );
};
