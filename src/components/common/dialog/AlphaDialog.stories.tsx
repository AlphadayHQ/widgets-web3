import { useState } from "react";
import { AlphaDialog } from "./AlphaDialog";

export default {
    title: "Widgets/AlphaDialog",
    component: AlphaDialog,
    argTypes: {},
};

const Template = () => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((isOpen) => !isOpen);
    return (
        <>
            <AlphaDialog
                show={open}
                title="Test"
                saveButtonText="Close"
                onClose={toggleOpen}
                showXButton
            >
                Test Dialog
            </AlphaDialog>
        </>
    );
};

export const Sample = Template.bind({});
