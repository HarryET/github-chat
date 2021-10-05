import { Box } from "@primer/components";
import { CustomHeader } from "./CustomHeader";

export const Root: React.FC = ({ children }) => (
  <Box
    maxHeight="100%"
    height="100%"
    width="100%"
    display="flex"
    flexDirection="column"
    overflowY="hidden"
  >
    <CustomHeader showAvatar={true} />
    {children}
  </Box>
);
