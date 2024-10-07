import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Assuming you have a root reducer file

export default configureStore({
  reducer: rootReducer, // Pass your root reducer here
});
