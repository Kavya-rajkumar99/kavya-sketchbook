const { configureStore } = require("@reduxjs/toolkit");
import menuReducer from "@/slice/menuSlice";
import toolboxReducer from "./slice/toolboxSlice";
const store = configureStore({
  reducer: {
    menu: menuReducer,
    toolbox: toolboxReducer,
  },
});

export default store;
