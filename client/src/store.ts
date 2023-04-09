import { create } from "zustand";

type State = {
  mapMode: "search" | "setCoordinates";
};

type Action = {
  updateMapMode: (mapMode: State["mapMode"]) => void;
};

// Create Store
const useStore = create<State & Action>()((set) => ({
  mapMode: "search",
  updateMapMode: (mapMode) => set(() => ({ mapMode: mapMode })),
}));

export default useStore;
