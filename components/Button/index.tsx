import React from "react";

import "./Button.less";

export type ButtonProps = {
    label?: string
};

export const Button: React.FC<ButtonProps> = ({label}) => {
    return (
        <div className={"ghc_button"}>
            <p className={"ghc_button_label"}>{label ?? "Button"}</p>
        </div>
    );
}