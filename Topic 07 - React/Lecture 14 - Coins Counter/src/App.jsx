import CreateCoin from "./CreateCoin";
import stores from "./Store";
import { Provider } from "react-redux";

function App() {
  return (
    <>
      <Provider store={stores}>
        <CreateCoin />
      </Provider>
    </>
  );
}

export default App;
