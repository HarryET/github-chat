import { Box, ButtonPrimary, Spinner, Text } from "@primer/components";
import { ComponentProps } from "react";

type Props = {
  isLoading: boolean;
  onClick: () => void;
} & ComponentProps<typeof ButtonPrimary>;

export const LoginButton = ({ isLoading, onClick, ...buttonProps }: Props) => (
  <ButtonPrimary mt={6} disabled={isLoading} variant="large" onClick={onClick} {...buttonProps}>
    <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" height="100%" width="100%">
      {isLoading && <Spinner size="small" mr={2} />}
      <Text fontWeight={500}>Login with GitHub</Text>
    </Box>
  </ButtonPrimary>
);
