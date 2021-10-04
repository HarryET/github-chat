import { Box } from "@primer/components";
import { CustomHeader } from "./CustomHeader";

export const Root: React.FC = ({ children }) => (
  <Box height="100%" width="100%" display="flex" flexDirection="column">
    <CustomHeader showAvatar={true} />
    {children}
  </Box>
);
