import React from 'react'

function Footer() {
  return (
    <div className='p-10 md:p-20 flex justify-center bg-slate-800 z-30'>
    <div className="container mx-auto px-4">
    <div className="flex flex-wrap justify-center">
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-bold text-white mb-4">ที่อยู่</h2>
        <p className="text-gray-300 leading-loose">
        เลขที่ 212/25 เซ็นทาร่าซิตี้ ถ.ชาตะผดุง ตำบลในเมือง  อำเภอเมืองขอนแก่น จังหวัดขอนแก่น 40000 
        </p>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-bold text-white mb-4">ติดต่อเรา</h2>
        <ul className="list-unstyled">
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              email: bridgethegapschool@gmail.com
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              โทร: 083 235 2828 
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-300 hover:text-white">
              line id: 083 235 2828 
            </a>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/3">
        <h2 className="text-lg font-bold text-white mb-4">Connect with Us</h2>
        <img src="/lineqr.jpg" alt=""  width="200"/>
      </div>
    </div>
    <div className="flex justify-center mt-8">
      <p className="text-gray-100 text-sm">
        &copy; {new Date().getFullYear()} Bridge the Gap School. All rights reserved.
      </p>
    </div>
  </div>
</div>
  )
}

export default Footer