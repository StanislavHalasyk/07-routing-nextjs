import axios from "axios";
import type { Note, NewNote } from "@/types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

// Интерфейс параметров запроса нотаток:
// perPage удалён (не обязателен по требованиям)
interface FetchNotesParams {
  page: number;
  search?: string;
  tag?: string;
}

// Хелпер для создания axios-инстанса с токеном
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

// Получить все заметки (поддержка поиска и фильтрации по tag)
export const fetchNotes = async (
  params: FetchNotesParams
): Promise<NotesHttpResponse> => {
  const api = getApiInstance();

  const queryParams: Record<string, string | number> = {
    page: params.page,
  };

  if (params.search) queryParams.search = params.search;
  if (params.tag && params.tag !== "all") queryParams.tag = params.tag;

  const res = await api.get<NotesHttpResponse>("/notes", {
    params: queryParams,
  });
  return res.data;
};

// Получить заметку по ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

// Создать новую заметку
export const createNote = async (newNote: NewNote): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.post<Note>("/notes", newNote);
  return res.data;
};

// Удалить заметку по ID
export const deleteNote = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
