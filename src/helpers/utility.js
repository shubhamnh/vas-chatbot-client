import idb from './idb'

let dbPromise = idb.open('messages-store', 1, function (db) {
  if (!db.objectStoreNames.contains('messages')) {
    db.createObjectStore('messages');
  }
});

function writeData(dbPromise, st, data, i) {
  return dbPromise
    .then(function(db) {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.put(data, i);
      return tx.complete;
    });
}

function readAllData(dbPromise, st) {
  return dbPromise
    .then(function(db) {
      let tx = db.transaction(st, 'readonly');
      let store = tx.objectStore(st);
      return store.getAll();
    });
}

function clearAllData(dbPromise, st) {
  return dbPromise
    .then(function(db) {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    });
}

function deleteItemFromData(dbPromise, st, id) {
  dbPromise
    .then(function(db) {
      let tx = db.transaction(st, 'readwrite');
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      console.log('Item deleted!');
    });
}

export {
  dbPromise,
  writeData,
  clearAllData,
  readAllData,
  deleteItemFromData
}