import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Header(props) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      alert(error.message);
    }
  };

  return (
    <div className="navbar bg-primary fixed p-5 z-50">
      <div className="flex-1">
        <a className="p-0 text-xl font-bold text-slate-200" href="/">
          Bridge the Gap School
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
                />
              </svg>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            {user == null && (
              <ul className="menu  w-80 min-h-full bg-base-200 text-base-content">
                <li>
                  <a href="/login" className="text-lg capitalize">
                    login
                  </a>
                </li>
              </ul>
            )}
            {user != null && (
              <ul className="menu flex flex-col gap-2 items-center  w-80 min-h-full bg-base-200 text-base-content">
                <li>
                  <a href="/profile" className="text-lg lowercase p-5">
                    {user.username}
                    <div className=" badge badge-neutral">{user.role}</div>
                  </a>
                </li>
                <li>
                  <div  onClick={handleLogout} className=" capitalize btn btn-error btn-sm btn-  ">
                    logout
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
