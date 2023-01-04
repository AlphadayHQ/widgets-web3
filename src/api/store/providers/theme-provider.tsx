import { FC } from "react";
import { ThemeProvider, themes } from "../../../styles";
import { GlobalStyle } from "../../../styles/globalStyle";
import { useAppSelector } from "../hooks";

interface IProps {
    children?: React.ReactNode;
}

const Theme: FC<IProps> = ({ children }) => {
    const { theme } = useAppSelector((state) => state.ui);

    return (
        <ThemeProvider theme={themes[theme]}>
            <GlobalStyle />
            {children}
        </ThemeProvider>
    );
};

export default Theme;
