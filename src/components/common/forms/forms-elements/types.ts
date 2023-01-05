/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IFeedback {
    $state?: "success" | "warning" | "error";
    $showState?: boolean;
    $showErrorOnly?: boolean;
}

export type TInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type TCustomStyle = "noborder" | "nofocus";


