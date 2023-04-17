import { create } from "zustand";

type State = {
  isAddCragFormOpen: boolean;
  isAddRouteFormOpen: boolean
};

type Action = {
  setIsAddCragFormOpen: (boolean: boolean) => void;
  setIsAddRouteFormOpen: (boolean: boolean) => void;
};

// Create Store
const useStore = create<State & Action>()((set) => ({
  isAddCragFormOpen: false,
  setIsAddCragFormOpen: (boolean) => set(() => ({ isAddCragFormOpen: boolean })),
  isAddRouteFormOpen: false,
  setIsAddRouteFormOpen: (boolean) => set(() => ({ isAddRouteFormOpen: boolean }))
}));

export default useStore;
