import React, { useState } from "react";
import { FaThLarge, FaTasks, FaChartBar, FaCog, FaSignOutAlt, FaCamera, FaTrash, FaExclamationTriangle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import axios from "axios";
const Sidebar = ({ userName, setUserName, userPhoto, setUserPhoto, level, xp }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Local state for edits in the settings modal until saved
  const [draftName, setDraftName] = useState(userName);
  const [draftPhoto, setDraftPhoto] = useState(userPhoto);

  // Sync draft states when modal opens
  const handleOpenSettings = () => {
    setDraftName(userName);
    setDraftPhoto(userPhoto);
    setShowSettingsModal(true);
  };

  // Cropper state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    navigate("/login");
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImgUrl = async () => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise(resolve => image.onload = resolve);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      // Resolve as a universal Base64 string so it permanently persists in the database instead of a temporary session blob
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    });
  };

  const handleCropSave = async () => {
    try {
      const url = await getCroppedImgUrl();
      setDraftPhoto(url);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("https://habitforge-3rb4.onrender.com/api/users/settings", {
        name: draftName,
        profilePicture: draftPhoto
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserName(draftName);
      setUserPhoto(draftPhoto);
      setShowSettingsModal(false);
    } catch (err) {
      console.error("Failed to save settings: ", err);
    }
  };

  const confirmDeleteAccount = async () => {
    // 1. Ask the user for explicit permission
    const hasPermission = window.confirm("Are you absolutely sure you want to delete your account? All your data will be permanently removed.");

    // 2. If they click "Cancel", stop the deletion process
    if (!hasPermission) {
      return;
    }

    // 3. If they click "OK", proceed with deletion
    try {
      const token = localStorage.getItem("token");

      // Make API request to delete user data from DB
      await axios.delete("https://habitforge-3rb4.onrender.com/api/users/settings", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear token from local storage and redirect
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account: ", err);
    }
  };



  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-5 left-5 z-[70] p-2.5 bg-[#1A2035] rounded-xl text-white border border-[#2A344A] shadow-lg focus:outline-none"
      >
        {isMobileOpen ? <FaTimes className="text-xl text-red-400" /> : <FaBars className="text-xl text-[#818CF8]" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <div className={`w-64 bg-[#0B0F19] h-screen p-5 flex flex-col justify-between border-r border-[#1e293b] fixed md:relative z-[65] transition-transform duration-300 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* TOP SECTION */}
        <div>
          {/* Logo */}
          <h1 className="text-2xl font-bold text-[#818CF8] mb-8 px-3 tracking-wide flex items-center gap-2">
            HabitForge
          </h1>

          {/* Level + Progress */}
          <div className="mb-8 px-3">
            <p className="text-xs text-gray-400 mb-2 font-semibold tracking-wider">LEVEL {level || 1}</p>

            <div className="h-1.5 bg-[#1A2035] rounded-full mb-2">
              <div
                className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, ((xp || 0) % 20) / 20 * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-500">{20 - ((xp || 0) % 20)} XP to Level {(level || 1) + 1}</p>
          </div>

          {/* Menu */}
          <ul className="space-y-2 text-gray-400 font-semibold text-sm tracking-wide">

            {/* Active / Optional Conditional Styling */}
            <li
              onClick={() => { setIsMobileOpen(false); navigate("/dashboard"); }}
              className="flex items-center gap-4 bg-gradient-to-r from-[#202946] to-[#141A2E] text-white p-3 px-4 rounded-xl cursor-pointer border border-[#2A344A]"
            >
              <FaThLarge className="text-lg" /> DASHBOARD
            </li>

            <li
              onClick={() => { setIsMobileOpen(false); navigate("/habits"); }}
              className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition"
            >
              <FaTasks className="text-lg" /> HABITS
            </li>

            <li
              onClick={() => { setIsMobileOpen(false); navigate("/stats"); }}
              className={`flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition ${window.location.pathname === '/stats'
                ? 'bg-gradient-to-r from-[#202946] to-[#141A2E] text-white border border-[#2A344A]'
                : 'text-gray-400'
                }`}
            >
              <FaChartBar className="text-lg" /> STATS
            </li>

            <li
              onClick={() => { setIsMobileOpen(false); handleOpenSettings(); }}
              className="flex items-center gap-4 p-3 px-4 hover:bg-[#1A2035] hover:text-white rounded-xl cursor-pointer transition"
            >
              <FaCog className="text-lg" /> SETTINGS
            </li>
          </ul>
        </div>

        {/*Bottom Section*/}
        <div
          onClick={handleLogoutClick}
          className="flex items-center gap-4 p-3 px-4 text-red-500 cursor-pointer hover:bg-red-500/10 transition rounded-xl"
        >
          <FaSignOutAlt className="text-lg" /> LOGOUT
        </div>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121623] border border-[#2A344A] rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
              <FaSignOutAlt className="text-4xl translate-x-1" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3 tracking-wide">Ready to leave?</h2>
            <p className="text-gray-400 text-[15px] font-medium text-center mb-8 px-4">
              Are you sure you want to log out of your HabitForge account?
            </p>
            <div className="flex gap-4 w-full font-semibold tracking-wide">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-2xl border border-[#2A344A] text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#1A2035] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121623] border border-[#2A344A] rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative">

            {isCropping ? (
              <div className="w-full flex flex-col items-center">
                <h2 className="text-white text-xl font-bold mb-4">Crop Photo</h2>
                <div className="relative w-full h-[300px] mb-4 bg-black rounded-2xl overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(croppedArea, croppedAreaPixels) => {
                      setCroppedAreaPixels(croppedAreaPixels);
                    }}
                  />
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full mb-6 accent-purple-500"
                />
                <div className="flex gap-4 w-full font-semibold">
                  <button
                    onClick={() => setIsCropping(false)}
                    className="flex-1 py-3 rounded-2xl border border-[#2A344A] text-gray-400 hover:text-white hover:bg-[#1A2035] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="flex-1 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white transition"
                  >
                    Crop & Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-white text-2xl font-bold mb-6 tracking-wide w-full text-center">Profile Settings</h2>

                {/* Photo Upload */}
                <div className="relative mb-6 group cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-[#1A2035] border-2 border-[#2A344A] flex flex-col items-center justify-center overflow-hidden shadow-inner">
                    {draftPhoto ? (
                      <img src={draftPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-3xl text-gray-500 mb-1" />
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <FaCamera className="text-white text-xl mb-1" />
                    <span className="text-white text-[10px] font-bold">UPLOAD</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <p className="text-gray-400 text-xs mb-8 -mt-3">Click to upload & crop photo</p>

                {/* Name Change */}
                <div className="w-full mb-8">
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Display Name</label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full bg-[#1A2035] border border-[#2A344A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#818CF8] transition"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex flex-col gap-3 w-full font-semibold tracking-wide">
                  <button
                    onClick={handleSaveChanges}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-[#7C3AED] hover:opacity-90 text-white shadow-lg shadow-purple-500/20 transition"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full py-3 rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete Account
                  </button>

                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="w-full py-2 text-gray-400 hover:text-white transition mt-2 text-sm"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121623] border border-[#2A344A] rounded-3xl p-8 w-[420px] shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner">
              <FaExclamationTriangle className="text-4xl" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3 tracking-wide text-center">Delete Account?</h2>
            <p className="text-gray-400 text-[15px] font-medium text-center mb-8 px-2">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-4 w-full font-semibold tracking-wide">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-2xl border border-[#2A344A] text-gray-400 hover:text-white hover:border-gray-500 hover:bg-[#1A2035] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
