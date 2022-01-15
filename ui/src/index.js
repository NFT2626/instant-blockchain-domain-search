import './styles.css';
import { useState } from 'preact/hooks';
import usePromise from './hooks/use-promise';
import { getNameDetails } from './data';


const App = () => {
  const [name, setName] = useState();

  const [nameDetails] = usePromise(() => getNameDetails(name), {
    conditions: [name],
    dependencies: [name],
  });

  function onNameChange(e) {
    const newName = e.target.value;
    setName(newName);
  }

  console.log(nameDetails);

  return (
    <div id="app">

      <div className="container">

        <input type="text"
          className="input input-domain"
          onInput={onNameChange}
          value={name}>
        </input>

      </div>

    </div>
  )
}

export default App;
