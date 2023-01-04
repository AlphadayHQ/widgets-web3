import { FC, useState } from "react";
import { AlphaDialog } from "../../components/common/dialog/AlphaDialog";
import { AlphaInput } from "../../components/common/input/AlphaInput";

interface IAddressInput {
    onChange: (addr: string) => void;
    onAddAddress: (addr: string) => void;
    show: boolean;
    onClose: () => void;
    disabled: boolean;
}

const AddressInput: FC<IAddressInput> = ({
    onChange,
    onAddAddress,
    show,
    onClose,
    disabled,
}) => {
    const [value, setValue] = useState("");

    return (
        <AlphaDialog
            title="Add a Wallet Address"
            show={show}
            onClose={onClose}
            saveButtonText="Save"
            showXButton
            onSave={() => {
                onAddAddress(value);
                setValue("");
                onClose();
            }}
            disableSave={disabled}
        >
            <AlphaInput
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                id="wallet input"
                name="walletInput"
                placeholder="Enter an Ethereum or ENS address"
            />
        </AlphaDialog>
    );
};

export default AddressInput;
