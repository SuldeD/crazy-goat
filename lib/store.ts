import { create } from "zustand";

interface Store {
  tournoment: any;
  pointsData: any;
  myAddress: string;
  pointId: string;
  setAddTournoment: (tournomentData: any) => void;
  setAddPointsData: (pointsData: any) => void;
  setAddMyAddress: ({ myAddress }: { myAddress: string }) => void;
  setAddPointId: ({ pointId }: { pointId: string }) => void;
}

export const useTournomentStore = create<Store>()((set) => ({
  tournoment: null,
  pointsData: null,
  myAddress: "",
  pointId: "",
  setAddTournoment: ({ tournomentData }: { tournomentData: any }) =>
    set({ tournoment: tournomentData }),
  setAddPointsData: ({ pointsData }: { pointsData: any }) =>
    set({ pointsData: pointsData }),
  setAddMyAddress: ({ myAddress }: { myAddress: string }) => set({ myAddress }),
  setAddPointId: ({ pointId }: { pointId: string }) => set({ pointId }),
}));
