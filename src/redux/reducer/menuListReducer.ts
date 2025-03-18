import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: {menuRefList: string[]; menuList: menuListType[]} = {
  menuRefList: [],
  menuList: [],
};

const menuSlice = createSlice({
  initialState,
  name: 'menu',
  reducers: {
    updateMenuList(state: any, action: PayloadAction<menuListType>) {
      state.menuList = action?.payload
    },
    updateSubSectionList(
      state: any,
      action: PayloadAction<menuServiceDetails | menuListType>,
    ) {
      state.menuList = [
        ...state?.menuList,
        // {title: action?.title, subSection: [...state?.menuList]},
      ];
    },
    removeMenuList(state: any, action: PayloadAction<menuListType | any>) {
      state.menuList = action?.payload;
    },
    updateMenuRef(state: any, action: PayloadAction<string | any>) {
      state.menuRefList = action?.payload;
    },
  },
});

export const {updateMenuList, updateMenuRef} = menuSlice?.actions;
export default menuSlice?.reducer;
