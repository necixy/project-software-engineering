import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  sortBy: string;
  category: string[];
  location: string|string[];
  grade: string|number[];
  price: string|number[];
  availability: {availabilityArray:string[],availabilityTimeArray:string[]}|string;
  applyFilter: boolean;
} = {
  sortBy:'Relevance',
category:['All'],
location:['All'],
grade:'All',
price:'All',
availability :'All',
applyFilter:false
};

const searchFilterSlice = createSlice({
  initialState,
  name: 'searchFilter',
  reducers: {
    updateSortBy(state: any, action: PayloadAction<string>) {
      state.sortBy = action?.payload
    },
    updateCategory(state: any, action: PayloadAction<string[]>) {
      state.category = action?.payload
    },
    updateLocation(state: any, action: PayloadAction<string>) {
      state.location = action?.payload
    },
    updateGrade(state: any, action: PayloadAction<string|number[]>) {
      state.grade = action?.payload
    },
    updatePrice(state: any, action: PayloadAction<string|number[]>) {
      state.price = action?.payload
    },
    updateAvailability(state: any, action: PayloadAction<{availabilityArray:string[],availabilityTimeArray:string[]}|string>) {
      state.availability = action?.payload
    },
    setInitial(state: any) {
        state.sortBy= 'Relevance';
        state.category= ['All'];
        state.location= ['All'];
        state.grade= 'All';
        state.price= 'All';
        state.availability ='All';
        state.applyFilter=false;
    },
    setApplyFilter(state:any,action: PayloadAction<boolean>) {
      state.applyFilter = action.payload;
    }
  },
});

export const { updateAvailability, updateCategory, updateGrade, updateLocation, updatePrice, updateSortBy, setInitial, setApplyFilter } = searchFilterSlice?.actions;
export default searchFilterSlice?.reducer;
