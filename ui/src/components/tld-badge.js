import { getRegistrationUrl, validateName } from '../utils';

function TLDBadge(props) {
  const {
    provider, name, isReady, tld, tldInfo,
  } = props;

  let isAvailable = !tldInfo;
  let className = 'tld-badge';

  if (isReady) {
    const isExpired = tldInfo && tldInfo.expires !== 0 && (tldInfo.expires < (new Date().getTime() / 1000));

    if (isAvailable) {
      className += ' is-available';
    } else {
      className += ' is-taken';
    }

    const isValid = validateName(provider, name, tld);

    if (!isValid || isExpired) {
      isAvailable = false;
      className += ' is-expired';
    }
  }

  return (
    <a
      className={className}
      href={getRegistrationUrl(provider, name, tld)}
      target="_blank"
      rel="noreferrer"
    >
      {tld}
    </a>
  );
}

export default TLDBadge;
