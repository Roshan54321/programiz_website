'use client'
import Image from 'next/image'
import useSWR from 'swr'
import axios from 'axios'
import { RxCross2 } from 'react-icons/rx'
import { useState } from 'react'


export default function Home() {
  const [keywords, setKeywords] = useState([])

  const { data } = useSWR("https://storage.googleapis.com/programiz-static/hiring/software/job-listing-page-challenge/data.json", async url => await axios(url))
  console.log(data)

  function getTimeDifference(milliseconds) {
    const msPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    const currentDate = new Date().getTime(); // Current timestamp
    const givenDate = new Date(milliseconds).getTime(); // timestamp

    const timeDifference = currentDate - givenDate;
    const daysAgo = Math.floor(timeDifference / msPerDay);

    return daysAgo;
  }

  return (
    <main className="bg-background">
      <div className='h-[100px] overflow-hidden relative'>
        <Image className='absolute object-cover'
          src="/back.jpg"
          fill
          alt="Picture of the author"
        />
      </div>


      <div className='p-20 flex flex-col gap-10 relative'>
        {keywords.length != 0 &&
          < div className='shadow-sm flex gap-5 inset-x-0 mx-20 p-3 px-7 bg-background absolute -top-[20px] rounded-sm' >
            {
              keywords.map((keyword, i) =>
                <div className='w-fit flex items-center'>
                  <div className='bg-faint/20 p-1 rounded-sm text-xs font-medium'>
                    {keyword}
                  </div>
                  <div className='bg-secondary p-1 rounded-sm rounded-l-none'>
                    <div><RxCross2 /></div>
                  </div>
                </div>
              )
            }
          </div>
        }
        <>
          {data && data.data?.map((one, i) =>
            <div className='justify-between flex shadow-faint/20 shadow-sm p-5 group hover:shadow-xl hover:border-l-[3px] hover:rounded-l-sm hover:border-l-secondary'>
              <div className='flex gap-2'>
                <div className='h-[50px] w-[50px] rounded-full overflow-hidden relative border-blue-100 border-[1px]'>
                  <Image className='absolute object-contain object-center w-full h-full'
                    src={one.company_logo}
                    width={100}
                    height={100}
                    alt="Picture of the author"
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='text-base'>{one.company}</div>
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
              <div className='flex gap-2 items-center text-xs font-medium'>
                {one.keywords?.map((key, j) => <div className='bg-faint/20 hover:bg-faint/60 cursor-pointer p-1 rounded-md' onClick={() => {
                  setKeywords([...keywords, key])
                }}>{key}</div>)}
              </div>
            </div>
          )}
        </>
      </div>
    </main >
  )
}
