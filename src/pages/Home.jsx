import React from 'react'
import Bulletin from '../components/Bulletin'
import SimpleParallax from "simple-parallax-js";
import Teacher from "./Teacher";

function Home() {
    return (
        <>
        <div className='flex justify-center flex-col items-center h-screen'>
            <SimpleParallax>
              <img src="/learn.jpg" alt="image" width={"100vw"} height={"100vh"} className='h-full w-screen' />
            </SimpleParallax>
            <div className="hero-content w-screen flex justify-center items-center text-center z-30 absolute">
                <div className=" max-w-lg  p-5 rounded-lg z-20" >
                    <h1 className="text-5xl  font-bold text-teal-100">โรงเรียนกวดวิชาบริดจ์</h1>
                    <p className=" font-medium text-xl text-teal-200">สำหรับเตรียมตัวสอบเข้า ม.1 และ ม.4 และติวเพิ่มเกรดตั้งแต่ชั้น อนุบาล 3 ถึง ชั้น ม.3</p>
                    <a className="btn btn-secondary mt-5" href="/courses">ดูคอร์สทั้งหมด</a>
                </div>
           </div>
        </div>
        <div>
           <Bulletin></Bulletin>
        </div>
        <div>
              <Teacher></Teacher>
        </div>
        </>
        
    )
}

export default Home