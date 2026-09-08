import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation : null,
  },

  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload; // overwrite the whole array
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload); // unshift-> adds conversation to the 0th index of array
    },

    setSelectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
});

export const { setConversations, addConversation , setSelectConversation} = conversationSlice.actions;
export default conversationSlice.reducer;
