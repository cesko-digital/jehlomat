import ConfirmationModal from "Components/ConfirmationModal";
import { createContext, createRef, RefObject } from "react";
const ref = createRef();

export const ConfirmationModalContext = createContext<RefObject<ConfirmationModal | unknown>>(ref)