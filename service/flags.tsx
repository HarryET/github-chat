import { User, Flag } from "types";
import { Box, Label } from "@primer/components";

const SystemFlag = 1 << 1;
const StaffFlag = 1 << 2;
const SupabaseTeamFlag = 1 << 3;

export const getUserFlags = (user: User): Flag[] => {
  const flags: Flag[] = [];

  if ((user.flags & SystemFlag) != 0) { flags.push(Flag.System) }
  if ((user.flags & StaffFlag) != 0) { flags.push(Flag.Staff) }
  if ((user.flags & SupabaseTeamFlag) != 0) { flags.push(Flag.Supabase) }
  if (user.bot ?? false) { flags.push(Flag.Bot) }

  return flags;
}

export const hasFlag = (user: User, flag: Flag): boolean => {
  switch (flag) {
    case Flag.Staff:
      return (user.flags & StaffFlag) != 0;
    case Flag.System:
      return (user.flags & SystemFlag) != 0;
    case Flag.Supabase:
      return (user.flags & SupabaseTeamFlag) != 0;
    case Flag.Bot:
      return user.bot;
    default:
      return false;
  }
}

export const getFlagComponent = (flag: Flag, key = 0, variant: "small" | "large" | "medium" | "xl" | undefined = "small") => {
  switch (flag) {
    case Flag.Staff:
      return (<Label variant={variant} sx={{ bg: "#7b78f2", m: 1 }} key={key}>
        <Box display="flex" alignItems="center" justifyContent="center">
          👨🏻‍💻 <Box ml={1.5}>team</Box>
        </Box>
      </Label>);
    case Flag.System:
      return (<Label variant={variant} sx={{ bg: "#9358f7", m: 1 }} key={key}>
        <Box display="flex" alignItems="center" justifyContent="center">
          🤖 <Box ml={1.5}>system</Box>
        </Box>
      </Label>);
    case Flag.Supabase:
      return (<Label variant={variant} sx={{ bg: "#2c9c6a", m: 1 }} key={key}>
        <Box display="flex" alignItems="center" justifyContent="center">
          ⚡ <Box ml={1.5}>supabase</Box>
        </Box>
      </Label>);
    case Flag.Bot:
      return (<Label variant={variant} sx={{ bg: "#6197ee", m: 1 }} key={key}>
        <Box display="flex" alignItems="center" justifyContent="center">
          🤖 <Box ml={1.5}>bot</Box>
        </Box>
      </Label>);
    default:
      break;
  }
}