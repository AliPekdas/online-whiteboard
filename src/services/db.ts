import { openDB } from 'idb';
import type { Shape } from '../types';

const DB_NAME = 'whiteboard-db';
const STORE_NAME = 'shapes-store';

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveShapesToDB = async (shapes: Shape[]) => {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, shapes, 'current-board');
  } catch (error) {
    console.error('Failed to save to IndexedDB', error);
  }
};

export const loadShapesFromDB = async (): Promise<Shape[]> => {
  try {
    const db = await initDB();
    const shapes = await db.get(STORE_NAME, 'current-board');
    return shapes || [];
  } catch (error) {
    console.error('Failed to load from IndexedDB', error);
    return [];
  }
};
