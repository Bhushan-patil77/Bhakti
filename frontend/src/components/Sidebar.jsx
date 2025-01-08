import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCloudinaryStore from '../store/useCloudinaryStore'
import useAuthStore from '../store/useAuthStore'
import useMessageStore from '../store/useMessageStore'

function Sidebar() {
    const [email, setEmail] = useState('')
    const navigate = useNavigate(null)
    

    const { uploadImages, uploadedUrls, setUploadedUrls, loading, error, numberOfFileSelected } = useCloudinaryStore()
    const { logout, check, loggedInUser, onlineUsers, socket } = useAuthStore()
    const { sendMessage, sendMessageWithUploadedImages, getMessages, convertImagesToBase64Urls, isImagesConverting, base64Images, emitTyping, emitNotTyping, usersTyping, messages, searchUsers, users, setUsers, setSelectedUser, selectedUser, getSelectedUser, listenToMessages, dontListenToMessages, recentChats, emitSeen } = useMessageStore()


    return (

        <div className="SIDEBAR flex flex-col xl:w-[30%] w-full h-full border-r border-gray-700 bg-gray-800">

            <div className="flex items-center justify-between p-4 bg-gray-800">
                <span className='flex items-center gap-4'>
                    <Link to={'/profile'} > <img src={loggedInUser?.profileImage} alt="" className='w-[50px] h-[50px] rounded-full object-cover' /> </Link>
                    <h2 className="text-lg font-semibold text-gray-200 capitalize">{loggedInUser?.name}</h2>
                </span>
                <button className="text-blue-400 hover:text-blue-600" onClick={() => { logout(navigate) }}>Log out</button>
            </div>

            <div className="SEARCHBAR p-4">
                <div className="flex items-center bg-gray-700 p-2 rounded-lg mt-2">
                    <input
                        id="search-email"
                        type="text"
                        className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
                        placeholder="Search by email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                </div>

                <ul className=' w-[100%]  flex flex-col gap-2'>
                    {
                        users.length > 0 && users.map((user, index) => {
                            if (user._id !== loggedInUser._id) {
                                return <li key={index} className='cursor-pointer flex items-center gap-2 text-white text-sm shadow-lg p-2 rounded-md truncate capitalize ' onClick={() => { setSelectedUser(user); setEmail('') }}> <img className='min-w-[30px] max-h-[30px] object-cover border-black border-2 rounded-full' src={user.profileImage} alt="" /> {`${user.name} ${user.surname} - ( ${user.email} )`} </li>
                            }
                        })
                    }
                </ul>
            </div>


            <div className="RECENT-CHATS   overflow-y-auto no-scrollbar ">

                {
                    recentChats && recentChats.length > 0 && recentChats.map((chat, index) => {
                        const lastMessageTime = new Date(chat.lastMessageTime).toLocaleTimeString()
                        return <div key={index} className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700" onClick={() => { getSelectedUser(chat._id) }}>
                            <div className="flex items-center">
                                <div className='w-12 h-12 relative '>
                                    <img className={`w-12 h-12  rounded-full object-cover relative `} src={chat.profileImage !== '' ? chat.profileImage : "https://via.placeholder.com/40"} alt="Profile" />
                                    <p className={`w-3 h-3  rounded-full absolute top-[0.5%] shadow-inner shadow-black ${onlineUsers.includes(chat._id) ? 'bg-green-500' : 'bg-red-600'}`}></p>
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-200">{chat.name}</h3>
                                        <span className="text-xs text-gray-400">{lastMessageTime}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{usersTyping.includes(chat._id) ? <span className='text-green-500'>typing...</span> : chat.lastMessage == '' ? 'Image' : chat.lastMessage}</p>
                                </div>
                            </div>
                        </div>
                    })
                }



            </div>

        </div>
    )
}

export default Sidebar