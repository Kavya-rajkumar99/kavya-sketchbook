import { COLORS, MENU_ITEMS } from "@/constants";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  [MENU_ITEMS.PENCIL]: {
    color: COLORS.BLACK,
    size: 3,
  },
  [MENU_ITEMS.ERASER]: {
    color: COLORS.WHITE,
    size: 3,
  },
  [MENU_ITEMS.UNDO]: {},
  [MENU_ITEMS.REDO]: {},
  [MENU_ITEMS.DOWNLOAD]: {},
};
const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeSize: (state, action) => {
      state[action.payload.item].size = action.payload.size;
    },
    changeColor: (state, action) => {
      state[action.payload.item].color = action.payload.color;
    },
  },
});

export default toolboxSlice.reducer;
export const { changeSize, changeColor } = toolboxSlice.actions;
