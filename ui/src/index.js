import './styles.css';
import { useState } from 'preact/hooks';
import usePromise from './hooks/use-promise';
import { getNameDetails } from './data';
import TLDBadge from './components/tld-badge';
import { TLDResponseMapping, ProviderTLDMapping } from './constants';

function App() {
  const [name, setName] = useState();

  const [nameDetails, { isFetching }] = usePromise(() => getNameDetails(name), {
    conditions: [name],
    dependencies: [name],
    cacheKey: name,
    cachePeriodInSecs: 60,
  });

  function onNameChange(e) {
    const newName = e.target.value;
    setName(newName);
  }

  return (
    <div id="app">
      <div className="container">

        <input
          type="text"
          className="input input-domain"
          onInput={onNameChange}
          value={name}
        />

        <div className="tld-container">
          {Object.keys(ProviderTLDMapping).map((provider) => (
            <div className="provider-container">
              {ProviderTLDMapping[provider].map((tld) => {
                const isReady = !isFetching && name;
                const tldInfo = nameDetails && nameDetails[TLDResponseMapping[tld]];

                return (
                  <TLDBadge
                    isReady={isReady}
                    name={name}
                    provider={provider}
                    tld={tld}
                    tldInfo={tldInfo}
                  />
                );
              })}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
