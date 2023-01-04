import { useAppSelector, useAppDispatch } from "../../api/store/hooks";
import { toggleShowWidgetLib } from "../../api/store";

interface IWidgetLib {
    showWidgetLib: boolean;
    toggleWidgetLib: () => void;
}

export const useWidgetLib: () => IWidgetLib = () => {
    const dispatch = useAppDispatch();

    const showWidgetLib = useAppSelector((state) => state.ui.showWidgetLib);

    const toggleWidgetLib = () => dispatch(toggleShowWidgetLib());

    return {
        showWidgetLib,
        toggleWidgetLib,
    };
};
