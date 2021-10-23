import { User, UserFlags } from "types";
import { Box, Label } from "@primer/components";
import Twemoji from "react-twemoji";

const UserSystemFlag = 1 << 1;
const UserStaffFlag = 1 << 2;
const UserSupabaseTeamFlag = 1 << 3;

export const getUserFlags = (user: User): UserFlags[] => {
  const flags: UserFlags[] = [];

  if ((user.flags & UserStaffFlag) != 0) { flags.push(UserFlags.Staff) }
  if ((user.flags & UserSystemFlag) != 0) { flags.push(UserFlags.System) }
  if ((user.flags & UserSupabaseTeamFlag) != 0) { flags.push(UserFlags.Supabase) }

  return flags;
}

export const getFlagComponent = (flag: UserFlags, key = 0) => {
  switch (flag) {
    case UserFlags.Staff:
      return (<Label variant="small" sx={{ bg: "canvas.secondary", m: 1 }} key={key}>
          <Box display="flex" alignItems="center" justifyContent="center">
            👨🏻‍💻 <Box ml={1.5}>team</Box>
          </Box>
        </Label>);
    case UserFlags.System:
      return (<Label variant="small" sx={{ bg: "canvas.secondary", m: 1 }} key={key}>
          <Box display="flex" alignItems="center" justifyContent="center">
            🤖 <Box ml={1.5}>system</Box>
          </Box>
        </Label>);
    case UserFlags.Supabase:
      return (<Label variant="small" sx={{ bg: "#2c9c6a", m: 1 }} key={key}>
          <Box display="flex" alignItems="center" justifyContent="center">
            ⚡ <Box ml={1.5}>supabase</Box>
          </Box>
        </Label>);
    default:
      break;
  }
}