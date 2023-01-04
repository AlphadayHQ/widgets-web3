import { FC } from "react";
import { Spinner } from "../../../components/common/spinner/spinner";
import { StyledLoader } from "./style";

interface IProps {
    height: string;
    collapse?: boolean;
}
const ModuleLoader: FC<IProps> = ({ height, collapse }) => {
    return (
        <StyledLoader
            data-testid="alpha-test-loading"
            $height={height}
            collapse={!!collapse}
        >
            <Spinner size="lg" color="primary" />
        </StyledLoader>
    );
};

export default ModuleLoader;
