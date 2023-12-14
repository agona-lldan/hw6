import ObserverList from "./components/ObserverList/ObserverList.tsx";

const list = Array.from({ length: 10000000 }).map((_, i) => i);

function App() {
  return (
    <>
      <ObserverList items={list} height={200} gap={20} />
    </>
  );
}

export default App;
