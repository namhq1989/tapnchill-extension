const INDEXEDDB_NAME = 'notes'

const openNotesIndexedDB = async () => {
  const dbName = 'NotesDB'
  const dbVersion = 3

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion)

    request.onupgradeneeded = (event) => {
      const db = request.result
      const { oldVersion } = event

      if (oldVersion < 1) {
        const store = db.createObjectStore(INDEXEDDB_NAME, { keyPath: 'id' })
        store.createIndex('updatedAtIndex', 'updatedAt', { unique: false })
      }
      if (oldVersion < 2) {
        const store = request.transaction?.objectStore(INDEXEDDB_NAME)
        if (store && !store.indexNames.contains('pageDomainIndex')) {
          store.createIndex('pageDomainIndex', 'data.pageDomain', {
            unique: false,
          })
        }
      }
      if (oldVersion < 3) {
        db.createObjectStore('syncProgress', { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Failed to open IndexedDB'))
  })
}

const getNotesLastSyncAt = async () => {
  const db = await openNotesIndexedDB()
  const tx = db.transaction('syncProgress', 'readonly')
  const store = tx.objectStore('syncProgress')

  return new Promise((resolve, reject) => {
    const request = store.get('lastSyncedAt')
    request.onsuccess = () => resolve(request.result ? request.result.value : 0)
    request.onerror = () => reject(new Error('Failed to fetch lastSyncedAt.'))
  })
}

const updateNotesLastSyncAt = async (lastSyncedAt) => {
  const db = await openNotesIndexedDB()
  const tx = db.transaction('syncProgress', 'readwrite')
  const store = tx.objectStore('syncProgress')

  return new Promise((resolve, reject) => {
    const request = store.put({ key: 'lastSyncedAt', value: lastSyncedAt })
    request.onsuccess = resolve
    request.onerror = () => reject(new Error('Failed to update lastSyncedAt.'))
  })
}

const fetchNotesFromIndexedDB = async (page, pageSize) => {
  try {
    const db = await openNotesIndexedDB()
    const tx = db.transaction(INDEXEDDB_NAME, 'readonly')
    const store = tx.objectStore(INDEXEDDB_NAME)
    const index = store.index('updatedAtIndex')

    const start = page * pageSize
    const end = start + pageSize

    let currentIndex = 0
    const fetchedNotes = []

    const request = index.openCursor(null, 'prev')
    await new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor && currentIndex < end) {
          if (currentIndex >= start) {
            fetchedNotes.push(cursor.value) // Add note within range
          }
          currentIndex++
          cursor.continue()
        } else {
          resolve()
        }
      }
      request.onerror = () => reject(new Error('Failed to fetch notes'))
    })

    return fetchedNotes
  } catch (err) {
    console.error('Error fetching notes:', err.message)
    return []
  }
}

const persistNotesWithOrderInIndexedDB = async (notes) => {
  if (!notes || notes.length === 0) {
    console.log('No notes to persist.')
    return
  }

  const sortedNotes = notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const db = await openNotesIndexedDB()
  const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
  const store = tx.objectStore(INDEXEDDB_NAME)

  for (const note of sortedNotes) {
    store.put(note)
  }

  await new Promise((resolve, reject) => {
    tx.oncomplete = () => {
      resolve()
    }
    tx.onerror = () =>
      reject(new Error('Failed to persist notes in IndexedDB.'))
  })
}

const createNoteInIndexedDB = async (note) => {
  try {
    const db = await openNotesIndexedDB()
    const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_NAME)

    await new Promise((resolve, reject) => {
      const request = store.add(note)
      request.onsuccess = () => resolve()
      request.onerror = () =>
        reject(new Error('Failed to create note in IndexedDB.'))
    })

    console.log(`Note created successfully: ${note.id}`)
  } catch (error) {
    console.error('Error creating note in IndexedDB:', error)
    throw error
  }
}

const updateNoteInIndexedDB = async (note) => {
  try {
    const db = await openNotesIndexedDB()
    const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_NAME)

    await new Promise((resolve, reject) => {
      const request = store.put(note)
      request.onsuccess = () => resolve()
      request.onerror = () =>
        reject(new Error('Failed to update note in IndexedDB.'))
    })

    console.log(`Note updated successfully: ${note.id}`)
  } catch (error) {
    console.error('Error updating note in IndexedDB:', error)
    throw error
  }
}

const deleteNoteFromIndexedDB = async (noteId) => {
  try {
    const db = await openNotesIndexedDB()
    const tx = db.transaction(INDEXEDDB_NAME, 'readwrite')
    const store = tx.objectStore(INDEXEDDB_NAME)

    await new Promise((resolve, reject) => {
      const request = store.delete(noteId)
      request.onsuccess = () => resolve()
      request.onerror = () =>
        reject(new Error('Failed to delete note in IndexedDB.'))
    })

    console.log(`Note deleted successfully: ${noteId}`)
  } catch (error) {
    console.error('Error deleting note in IndexedDB:', error)
    throw error
  }
}

const countNotesInDomain = async (domain) => {
  const db = await openNotesIndexedDB()
  const tx = db.transaction(INDEXEDDB_NAME, 'readonly')
  const store = tx.objectStore(INDEXEDDB_NAME)
  const index = store.index('pageDomainIndex')

  return new Promise((resolve, reject) => {
    const request = index.count(domain)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(new Error('Failed to count notes for the domain.'))
  })
}

const getNotesInDomain = async (domain) => {
  const db = await openNotesIndexedDB()
  const tx = db.transaction(INDEXEDDB_NAME, 'readonly')
  const store = tx.objectStore(INDEXEDDB_NAME)
  const index = store.index('pageDomainIndex')

  return new Promise((resolve, reject) => {
    const notes = []
    const request = index.openCursor(domain)

    request.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        notes.push(cursor.value) // Add the current note to the result list
        cursor.continue() // Continue to the next match
      } else {
        resolve(notes) // Resolve with the complete list of notes
      }
    }

    request.onerror = () => {
      reject(new Error('Failed to fetch notes for the domain.'))
    }
  })
}

export {
  openNotesIndexedDB,
  getNotesLastSyncAt,
  updateNotesLastSyncAt,
  fetchNotesFromIndexedDB,
  persistNotesWithOrderInIndexedDB,
  createNoteInIndexedDB,
  updateNoteInIndexedDB,
  deleteNoteFromIndexedDB,
  countNotesInDomain,
  getNotesInDomain,
}
