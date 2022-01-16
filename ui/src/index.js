import './styles.css';
import { useState } from 'preact/hooks';
import usePromise from './hooks/use-promise';
import {
  getDomainListings, getNameDetails, getNearNameDetails, getWeb2Details,
} from './data';
import TLDBadge from './components/tld-badge';
import { TLDResponseMapping, ProviderTLDMapping, Providers } from './constants';

function App() {
  const [name, setName] = useState('');

  const [ethNameDetails, { isFetching: ethIsFetching, error: ethError, fetchedAt: ethFetchedAt }] = usePromise(() => getNameDetails(name), {
    conditions: [name],
    dependencies: [name],
    cacheKey: `${name}_eth`,
    cachePeriodInSecs: 60,
  });

  const [nearNameDetails, { isFetching: nearIsFetching, error: nearError, fetchedAt: nearFetchedAt }] = usePromise(() => getNearNameDetails(name), {
    conditions: [name],
    dependencies: [name],
    cacheKey: `${name}_near`,
    cachePeriodInSecs: 60,
  });

  const [web2NameDetails, { isFetching: web2IsFetching, error: web2Error, fetchedAt: web2FetchedAt }] = usePromise(() => getWeb2Details(name), {
    conditions: [name],
    dependencies: [name],
    cacheKey: `${name}_web2`,
    cachePeriodInSecs: 60,
  });

  const [domainListings] = usePromise(() => getDomainListings(name), {
    conditions: [name],
    defaultValue: [],
  });

  function onNameChange(e) {
    const newName = e.target.value;
    setName(newName);
  }

  const allProvideResult = {
    ...ethNameDetails,
    ...nearNameDetails,
    ...web2NameDetails,
  };

  const isProviderReady = {
    [Providers.ENS]: (name !== '') && !ethIsFetching && ethFetchedAt && !ethError,
    [Providers.UnstoppableDomains]: (name !== '') && !ethIsFetching && ethFetchedAt && !ethError,
    [Providers.Near]: (name !== '') && !nearIsFetching && nearFetchedAt && !nearError,
    [Providers.Web2]: (name !== '') && !web2IsFetching && web2FetchedAt && !web2Error,
  };

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
                const domainListing = domainListings.find((d) => d.name === `${name}.${tld}`);

                return (
                  <TLDBadge
                    isReady={isProviderReady[provider]}
                    name={name}
                    provider={provider}
                    tld={tld}
                    tldInfo={allProvideResult[TLDResponseMapping[tld]]}
                    listing={domainListing}
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
