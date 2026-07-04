import type { FC, ReactNode } from "react";
import { useAndroidBackButton } from "@/hooks/use-android-back-button";

type AndroidBackButtonHandlerProps = {
    children: ReactNode;
};

const AndroidBackButtonHandler: FC<AndroidBackButtonHandlerProps> = ({
    children,
}) => {
    useAndroidBackButton();

    return children;
};

export default AndroidBackButtonHandler;
