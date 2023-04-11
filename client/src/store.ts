import { create } from "zustand";

type State = {
  addCragPopupOpen: boolean;
};

type Action = {
  setAddCragPopupOpen: (boolean: boolean) => void;
};

// Create Store
const useStore = create<State & Action>()((set) => ({
  addCragPopupOpen: false,
  setAddCragPopupOpen: (boolean) => set(() => ({ addCragPopupOpen: boolean })),
}));

export default useStore;
