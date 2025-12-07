import axios from "axios";
import type { Note, NewNote } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: string;
}

const getApiInstance = () => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is missing!");

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<NotesHttpResponse> => {
  const api = getApiInstance();

  const queryParams: Record<string, string | number | undefined> = {
    page: params.page,
    search: params.search,
    tag: params.tag && params.tag !== "all" ? params.tag : undefined,
  };

  const res = await api.get<NotesHttpResponse>("/notes", {
    params: queryParams,
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.post<Note>("/notes", newNote);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
