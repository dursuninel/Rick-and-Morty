import { useState } from 'react';
import './App.css';
import Select from './components/Select';
import ListItem from './components/ListItems';

function App() {

  const [listValues, setListValues] = useState(sessionStorage.getItem("list") ? JSON.parse(sessionStorage.getItem("list")) : []);

  const delItem = (elem) => {
    let updatedList = listValues.filter((item) => item.id !== elem.id)
    setListValues(updatedList)
    sessionStorage.setItem("list", JSON.stringify(updatedList));
  }

  return (
    <div className="App">
      <h1>
        Rick And Morty
      </h1>
      <div className='multi-search-area'>
        <Select listValues={listValues}
          setListValues={setListValues} />

        <div className='list_style'>
          {listValues.map((data, key) => <ListItem key={key} data={data} delItem={delItem} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
