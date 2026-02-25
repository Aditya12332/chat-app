import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useAiStore } from "../store/useAiStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { showAiPanel } = useAiStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    /*
      Width strategy:
        Always  → w-16 (icon-only on mobile)
        lg+     → w-72 normally, w-52 when AI panel is open (to make room)
        The transition gives a smooth shrink when AI panel opens.
    */
    <aside
      className={`
        h-full border-r border-base-300 flex flex-col shrink-0
        transition-all duration-300 ease-in-out
        w-16
        ${showAiPanel ? "lg:w-52" : "lg:w-72"}
      `}
    >
      <div className="border-b border-base-300 w-full p-3 lg:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-5 lg:size-6 shrink-0" />
          <span className="font-medium hidden lg:block truncate">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2 flex-wrap">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs"
            />
            <span className="text-xs">Online only</span>
          </label>
          <span className="text-xs text-zinc-500">({Math.max(0, onlineUsers.length - 1)} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            {/* Avatar */}
            <div className="relative mx-auto lg:mx-0 shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 lg:size-11 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full ring-2 ring-base-100" />
              )}
            </div>

            {/* Name + status — hidden on small, shown on lg */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate text-sm">{user.fullName}</div>
              <div className="text-xs text-zinc-400 truncate">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-6 text-sm px-2">
            No {showOnlineOnly ? "online" : ""} users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;