import { useState } from "react";
import dashboard from "../assets/dashboard.png"
import { useNavigate } from "react-router";
export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const Menus = [
     { title: "Dashboard", src: require("../assets/img/Chart_fill.png"),path:""},
     // { title: "Inbox", src: require("../assets/img/Chat.png") },
     // { title: "Accounts", src: require("../assets/img/User.png"),  },
     { title: "Appointements ", src: require("../assets/img/Calendar.png"),gap: true,path:"/appointementManagment"},
     // { title: "Search", src: require("../assets/img/Search.png") },
     // { title: "Analytics", src: require("../assets/img/Chart.png") },
     { title: "Offers ", src: require("../assets/img/Folder.png"),path:"/offersManagment" },
     // { title: "Setting", src: require("../assets/img/Setting.png") },
   ];
  return (
    <div className="flex sticky">   
      <div
        className={` ${open ? "w-72" : "w-20 "} bg-dark-purple h-screen p-5 pt-8 relative duration-300`}
      >
        <img
          src={require("../assets/img/control.png")}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        {/* <div className="flex gap-x-4 items-center">
          <img
            src={require("../assets/img/logo.png")}    
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Designer
          </h1>
        </div> */}
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
              onClick={() => navigate(Menu.path)}
            >
              <img src={Menu.src} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
   
 
 </div>
  );
}
