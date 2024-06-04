import React from 'react'
import Bulletin from '../components/Bulletin'

function Home() {
    return (
        <div className='flex justify-center flex-col items-center min-h-screen  p-5'>
        <div className="hero h-screen bg-base-500 z-0 absolute" style={{backgroundImage: `url('/learn.jpg')`,filter: 'blur(2px)' }} >   
        </div>
        <div className="hero-content w-screen flex justify-center items-center text-center z-30 ">
                <div className=" max-w-md  p-5 rounded-lg z-20" >
                    <h1 className="text-3xl  font-bold text-teal-100">โรงเรียนกวดวิชาบริดจ์</h1>
                    <p className=" font-medium text-teal-200">สำหรับเตรียมตัวสอบเข้า ม.1 และ ม.4 และติวเพิ่มเกรดตั้งแต่ชั้น อนุบาล 3 ถึง ชั้น ม.3</p>
                    <button className="btn btn-secondary mt-5">ดูคอร์สทั้งหมด</button>
                </div>
        </div>
        <div className="w-full pt-50 z-30 h-72">
                  <Bulletin></Bulletin>
        </div>
        </div>
        
    )
}

export default Home