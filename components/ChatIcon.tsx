import {Box, Text, Avatar} from "@primer/components";

type ChatIconProps = {
    icon?: string;
    name: string;
    iconSize: number
}

export const ChatIcon = ({name, icon, iconSize}: ChatIconProps) => {
    if(icon != null) {
        return (
            <Avatar src={icon || ""} size={iconSize} square alt={name} mr={2} />
        );
    }

    return (
            <Box
              width={iconSize}
              height={iconSize}
              borderRadius={iconSize && iconSize <= 24 ? "4px" : "6px"}
              borderColor="border.default"
              borderWidth={2}
              borderStyle="solid"
              bg={"canvas.inset"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={2}
            >
              <Text fontWeight="bold">{name[0].toUpperCase()}</Text>
            </Box>
    );
}