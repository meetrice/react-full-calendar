import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, User, Users, Sparkles, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth";
import { getInitials } from "@/lib/helpers";

export function SidebarFooter() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/signin");
  };

  // Get user display name
  const displayName = user?.fullname || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "User";
  const initials = getInitials(displayName, 2) || "U";

  return (
    <div className="flex items-center shrink-0 px-2.5 py-5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-3 py-6 hover:bg-muted text-foreground rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                {user?.pic ? (
                  <AvatarImage src={user.pic} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{displayName}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="top"
          className="w-57 rounded-xl p-1"
        >
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4 opacity-80" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4 opacity-80" />
            Accounts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Sparkles className="mr-2 h-4 w-4 opacity-80" />
            Upgrade
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 opacity-80" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
