import React from 'react'


function Header() {
    return (
        <div className="navbar bg-primary fixed p-5 z-50">
            <div className="flex-1">
                <a className="p-0 text-xl font-bold" href="/">Bridge the Gap School</a>
            </div>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0}>
                             <button className='btn btn-neutral'>Login</button>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header