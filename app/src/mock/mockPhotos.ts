// src/features/gallery/data/mockPhotos.ts
import { Photo } from "../types/gallery.types";

export const mockPhotos: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
    userName: "John Doe",
    userId: "user1",
    location: "Tromsø, Norway",
    createdAt: "2024-03-15T12:00:00Z",
    visibility: "public",
    likes: 42,
    description: "Amazing Northern Lights display over the fjords",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1579033461380-adb47c3eb938",
    userName: "Jane Smith",
    userId: "user2",
    location: "Reykjavik, Iceland",
    createdAt: "2024-03-14T15:30:00Z",
    visibility: "public",
    likes: 35,
    description: "Green auroras dancing in the night sky",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1512156840305-f33f7f79e16e",
    userName: "Mike Wilson",
    userId: "user3",
    location: "Fairbanks, Alaska",
    createdAt: "2024-03-13T22:15:00Z",
    visibility: "public",
    likes: 28,
    description: "Purple and green aurora display",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1494243762909-b498c7e440eb",
    userName: "Sarah Johnson",
    userId: "user4",
    location: "Rovaniemi, Finland",
    createdAt: "2024-03-12T20:45:00Z",
    visibility: "public",
    likes: 31,
    description: "Winter wonderland under the aurora",
  },
];
