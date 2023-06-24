'use client'
import Image from 'next/image'
import { RxCross2 } from 'react-icons/rx'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'


export default function Home() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [keywords, setKeywords] = useState([]) //filters
  const [error, setError] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('filterBy');
    if (param) {
      const filters = param.split(',');
      setKeywords(filters);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (keywords.length) {
      params.set('filterBy', keywords.join(','));
      router.replace(`/?${params.toString()}`);
    } else {
      router.replace(`/`);
    }
  }, [keywords]);

  const showError = (err) => {
    setError(err)
    setTimeout(() => {
      setError("")
    }, 3000)
    console.log(err)
  }

  useEffect(() => {
    const fetchData = async () => {
      fetch('https://storage.googleapis.com/programiz-static/hiring/software/job-listing-page-challenge/data.json')
        .then(response => response.json())
        .then(info => {
          let filtered = info
          if (keywords.length) {
            filtered = info.filter(obj => keywords.every(key => obj.keywords.includes(key)));
          }
          setData(filtered)
          if (!filtered.length) {
            showError("Jobs not found.")
          }
        })
        .catch(error => {
          showError("Error while fetching data.")
        });
    }
    fetchData()
  }, [keywords])

  //convert delta milliseconds into days
  function getTimeDifference(milliseconds) {
    const msPerDay = 24 * 60 * 60 * 1000; // number of milliseconds in a day
    const currentDate = new Date().getTime(); // current timestamp
    const givenDate = new Date(milliseconds).getTime(); // timestamp of given date

    const timeDifference = currentDate - givenDate;
    const daysAgo = Math.floor(timeDifference / msPerDay);

    return daysAgo;
  }

  return (
    <main className="bg-background min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>

      {/* error component */}
      {error &&
        <div className='bg-warning fixed bottom-5 left-5 p-1 px-2 rounded-sm z-10'>
          {error}
        </div>
      }

      <div className='h-[100px] overflow-hidden relative'>
        <Image className='absolute object-cover'
          src="/back.jpg"
          fill
          alt="Picture of the author"
        />
      </div>

      {/* the selection criteria*/}
      <div className='p-20 flex flex-col gap-10 relative'>
        {keywords.length != 0 &&
          < div className='shadow-sm flex justify-between inset-x-0 mx-20 p-3 px-7 bg-white absolute -top-[20px] rounded-md items-center' >
            <div className='flex gap-5'>
              {
                keywords.map((keyword, i) =>
                  <div key={i} className='w-fit flex items-center'>
                    <div className='bg-faint/20 p-1 rounded-sm text-xs font-medium'>
                      {keyword}
                    </div>
                    <div className='bg-secondary p-1 rounded-sm rounded-l-none hover:bg-black hover:text-white cursor-pointer' onClick={() => {
                      let tempKeys = keywords
                      tempKeys.splice(i, 1)
                      setKeywords([...tempKeys])
                    }}>
                      <div><RxCross2 /></div>
                    </div>
                  </div>
                )
              }
            </div>
            <div className='text-xs text-faint hover:underline hover:text-secondary cursor-pointer' onClick={() => {
              setKeywords([])
            }}>
              Clear
            </div>
          </div>
        }

        {/* list of fetched items */}
        <>
          {data && data.map((one, i) =>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.1
              }}
              key={i} className='justify-between bg-white flex shadow-faint/20 shadow-sm p-5 group hover:shadow-xl hover:border-l-[3px] hover:rounded-l-sm hover:border-l-secondary'>
              <div className='flex gap-2'>
                <div className='h-[50px] w-[50px] rounded-full overflow-hidden relative border-faint/20 border-[1px]'>
                  <Image className='absolute object-contain object-center w-full h-full'
                    src={one.company_logo}
                    width={100}
                    height={100}
                    alt="Picture of the author"
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='text-sm text-faint'>{one.company}</div>
                  <div className='text-lg font-semibold'>{one.position}</div>
                  <div className='flex gap-2 text-xs text-faint'>
                    <div>{getTimeDifference(one.posted_on)} days ago</div>
                    -
                    <div>{one.timing}</div>
                    -
                    <div>{one.location}</div>
                  </div>
                </div>
              </div>

              {/* keywords */}
              <div className='flex gap-2 items-center text-xs font-medium'>
                {one.keywords?.map((key, j) => <div key={j} className='bg-faint/20 hover:bg-faint/60 cursor-pointer p-1 rounded-md' onClick={() => {
                  if (!keywords?.includes(key)) {
                    setKeywords([...keywords, key])
                  }
                }}>{key}</div>)}
              </div>

            </motion.div>
          )
          }
        </>
      </div>
    </main >
  )
}
