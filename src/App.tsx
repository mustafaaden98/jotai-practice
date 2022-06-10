import React from "react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import "./App.css";
import { usersListAtom } from "./atoms/user";


function App() {
  const [{ fetching, data: data }, fetchUserList] = useAtom(usersListAtom);

  useEffect(() => {
    void fetchUserList("https://jsonplaceholder.typicode.com/users");
  }, [fetchUserList]);
  return (
    <>
      <h3 style = {{display:'flex', justifyContent:'center', borderBottom: '1px solid black'}}>JOTAI PRACTICE</h3>
      <div className="App">
        {fetching && <div>Data Loading</div>}
        {data
          ? data.map((user) => (
              <div key={user.id} className="App-UserName">
                {user.name}
              </div>
            ))
          : null}
      </div>
    </>
  );
}

export default App;
