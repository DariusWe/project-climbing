import { create } from "zustand";

type State = {
  addCragFormOpen: boolean;
};

type Action = {
  setAddCragFormOpen: (boolean: boolean) => void;
};

// Create Store
const useStore = create<State & Action>()((set) => ({
  addCragFormOpen: false,
  setAddCragFormOpen: (boolean) => set(() => ({ addCragFormOpen: boolean })),
}));

export default useStore;
