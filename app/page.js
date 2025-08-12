'use client';
import { useSession } from 'next-auth/react';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { SubtleSpinner } from '@/components/SubtleSpinner';
import LikeTracker from '@/components/utils/LikeTracker';
import CommentSlideUp from '@/components/CommentSlideUp';
import FormatRelativeTime from '@/components/utils/FormatRelativeTime';
import Masonry from 'react-masonry-css';


export default function HomePage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const router = useRouter()
  const pathname = usePathname()
  const [urlLoader, setUrlLoader] = useState(false)
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(null)
  const loaderRef = useRef();
  const [page, setPage] = useState(0); // skip = page * limit
  const isFetchingRef = useRef(false);
  const seenSlugsRef = useRef(new Set());
  const [firstLoadDone, setFirstLoadDone] = useState(false)

  let fetchPosts = async () => {

    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;

    const nextPage = page;
    try {
      let a = await fetch(`/api/blogs?skip=${nextPage * limit}&limit=${limit}`)
      let res = await a.json()
      if (Array.isArray(res)) {
        const newPosts = res.filter(p => !seenSlugsRef.current.has(p.slug));
        // Add new slugs to the set
        newPosts.forEach(p => seenSlugsRef.current.add(p.slug));
        // Add to state
        setPosts(prev => [...prev, ...newPosts]);
        setHasMore(res.length === limit);
        setPage(prev => prev + 1);

      } else {
        console.error("Invalid blog data:", res);
      }

    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setFirstLoadDone(true)
    }
  }



  useEffect(() => {
    function getLimitByScreenSize() {
      if (typeof window === "undefined") return 6; // default fallback during SSR

      const width = window.innerWidth; // ✅ FIXED from innerHeight to innerWidth
      console.log("Screen width:", width);

      if (width >= 1080) return 11; // Desktop
      if (width >= 640 && width <= 1079) return 6;  // Tablet
      return 4;                       // Mobile
    }
    setLimit(getLimitByScreenSize());
  }, []);


  useEffect(() => {
    if (limit == null) return;
    const timeout = setTimeout(() => {
      fetchPosts();
    }, 500); // 1s delay

    return () => clearTimeout(timeout);
  }, [limit]);

  


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      {
        rootMargin: "200px",
        threshold: 1.0,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [limit, page, hasMore]); // 👈 these dependencies should be included


  useEffect(() => {
    setUrlLoader(false)
  }, [pathname])

  if (loading || posts == undefined || limit == null && !firstLoadDone ) return <SubtleSpinner />

  if (urlLoader) return <SubtleSpinner />

  if (posts.length === 0 && firstLoadDone) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-400 text-lg">
        No blog posts yet. Be the first to publish one!
      </div>
    );
  }


  const breakpointColumnsObj = {
    default: 3,
    1024: 2,
    640: 1
  };

  return (
    <>
      {posts.length == 0 ? <div className=' z-50 flex justify-center items-center text-black'>No posts there</div> :

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-6 max-w-7xl mx-auto py-20 sm:pb-24"
          columnClassName="masonry-column"
        >

          {posts.map((post) => (
            <div
              key={post.slug}
              onClick={() => {setUrlLoader(true); router.push(`/post/${post.slug}`) }}
              className="break-inside-avoid cursor-pointer mx-2 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Top Section (Profile + Content) */}
              <div>
                <div
                  className="flex items-center gap-3 mb-3 hover:bg-[#00000017] rounded-2xl"
                  onClick={(e) => { e.stopPropagation(); setUrlLoader(true); router.push(`/public-pages/${post.authorId._id}/${session?.user?.id}`) }}
                >
                  <div
                    className="w-11 shrink-0 h-11 rounded-full p-[2px] cursor-pointer bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-900 hover:scale-105 transition"
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                      <Image
                        src={post.authorId.profileImage}
                        alt={post.authorId.name}
                        width={56}
                        height={56}
                        className="w-full h-full rounded-full object-cover border border-white dark:border-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {post.authorId.name}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      @{post.authorId.username}
                    </p>
                  </div>
                </div>

                <hr />

                <h2 className="pl-1 pt-2 text-xl overflow-ellipsis font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition line-clamp-2">
                  {post.title}
                </h2>

                <p className="pl-1 text-gray-600 break-words overflow-ellipsis dark:text-gray-300 mt-2 text-sm leading-relaxed  line-clamp-2">
                  {post.subject || "No description available."}
                </p>
              </div>

              {/* Footer Section */}
              <div
                className="pt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs">
                  <FormatRelativeTime dateString={post.createdAt} />
                </span>
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1">
                    <Eye size={16} /> {post.views || 0}
                  </span>
                  <LikeTracker slug={post.slug} initialLikes={post.likes} />
                  <CommentSlideUp slug={post.slug} commentsLength={post.comments} authorImage={post.authorId.profileImage} />
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      }
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center text-black py-2 dark:text-white">
          Loading...
        </div>
      )}

    </>
  );
}
