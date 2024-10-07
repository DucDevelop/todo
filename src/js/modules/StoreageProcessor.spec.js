import createStorageProcessor from "./StoreageProcessor";


test("Storage processor", () => {
  const a = 1;
  const b = 2;
  const c = 3;
  
  const testData = [
    { a, b, c },
    { a, b, c },
    { a, b, c },
  ];

  const storage = createStorageProcessor()
  storage.storeTasks(testData);
  let storedTask = storage.loadTasks();
  expect(storedTask).toEqual(testData);
  storage.deleteTasks();
  storedTask = storage.loadTasks();
  expect(storedTask).toEqual(null);
});


