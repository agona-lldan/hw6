import ObserverList from "./components/ObserverList/ObserverList.tsx";

const list = new Array(100000).fill(0);

function App() {
  return (
    <>
      <ObserverList
        maxLength={list.length}
        renderLength={1}
        renderFunction={(index: number) => <div>{list[index]}</div>}
      />
    </>
  );
}

export default App;
