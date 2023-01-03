import { Modal, ModalHeader, ModalTitle } from "../../../elements/modal/modal";
import styled from "../../../styles";
import CONFIG from "../../../config";

const { Z_INDEX_REGISTRY } = CONFIG.UI;

export const StyledModal = styled(({ ...props }) => <Modal {...props} />)`
  z-index: ${Z_INDEX_REGISTRY.ERROR_MODAL};
  background-color: ${({ theme }) => theme.colors.btnBackgroundVariant1900};
  .modal-content {
    background-color: ${({ theme }) => theme.colors.backgroundVariant100};
  }
`;

export const StyledModalHeader = styled(({ ...props }) => (
  <ModalHeader {...props} />
))`
  background-color: ${({ theme, variant }) =>
    variant === "warning" ? theme.colors.secondaryOrange : theme.colors.danger};
  .modal-header {
    background-color: ${({ theme, variant }) =>
      variant === "warning"
        ? theme.colors.secondaryOrange
        : theme.colors.danger};
  }
`;

export const StyledModalTitle = styled(({ ...props }) => (
  <ModalTitle {...props} />
))``;

export const StyledCenteredBlock = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
`;
