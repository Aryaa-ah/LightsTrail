// src/mocks/api.ts
import { Photo } from "../types/gallery.types";

export const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "/app/src/assets/aurora-borealis.png",
    userName: "testuser",
    userId: "user1",
    location: "Norway",
    createdAt: new Date().toISOString(),
    visibility: "public",
    likes: [],
  },
];
