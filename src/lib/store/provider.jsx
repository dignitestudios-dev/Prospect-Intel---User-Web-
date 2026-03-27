import { Provider } from "react-redux";
import { store } from "./index";

export function ReduxProvider({ children }) {
    // plain provider (redux-persist removed)
    return <Provider store={store}>{children}</Provider>;
}
