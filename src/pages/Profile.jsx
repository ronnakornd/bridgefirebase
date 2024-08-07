import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Breadcrumbs from "../components/Breadcrumbs";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
    setUpdating(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-24">
      <Breadcrumbs
        items={[
          { name: "หน้าแรก", link: "/" },
          { name: "ข้อมูลสมาชิก", link: "/profile" },
        ]}
      />
      <div className="container mx-auto p-4 pt-22 pb-24">
        <h1 className="text-5xl font-bold mb-4">ข้อมูลสมาชิก</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.username}
              onChange={handleChange}
              className="input mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="input mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className=" block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 input block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
              disabled
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="mt-1 input block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="btn btn-neutral"
              disabled={updating}
            >
              {updating ? "กำลังอัพเดท..." : "อัพเดทข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
