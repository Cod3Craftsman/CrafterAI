import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
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
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conv) =>
        conv._id === conversationId ? { ...conv, title } : conv,
      );

      if (state.selectedConversation?._id === conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title };
      }
    },  
  },
});

export const { setConversations, addConversation, setSelectConversation , setConvTitle} =
  conversationSlice.actions;
export default conversationSlice.reducer;
