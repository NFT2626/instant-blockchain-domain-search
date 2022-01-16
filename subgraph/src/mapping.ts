import { BigInt } from "@graphprotocol/graph-ts"
import {
  NameRegistered,
  NameRenewed,
} from "../generated/ENSRegistrarController/ENSRegistrarController"
import { NewURI } from "../generated/UnstoppableCNS/UnstoppableCNS"
import { NewURI as NewURI_UNS } from "../generated/UnstoppableUNS/UnstoppableUNS"
import { DomainName, DomainTLD } from "../generated/schema"

export function handleEnsNameRegistered(event: NameRegistered): void {
  const name = event.params.name;

  let entity = DomainName.load(name);

  if (!entity) {
    entity = new DomainName(name);
    entity.name = name;
  }

  const tldId = `${name}_eth`;
  let tld = DomainTLD.load(tldId)
  if (!tld) {
    tld = new DomainTLD(tldId);
    tld.tld = 'eth';
    tld.owner = event.params.owner.toHex();
    tld.expires = event.params.expires;
    entity.eth = tld.id;

    tld.save();
  }

  entity.save()
}

export function handleEnsNameRenewed(event: NameRenewed): void { 
  const name = event.params.name;
  let entity = DomainName.load(name);

  if (!entity) {
    return;
  }

  const tldId = `${name}_eth`;
  let tld = DomainTLD.load(tldId)

  if (!tld) {
    return;
  }

  tld.expires = event.params.expires;
  tld.save();
}

export function handleCnsNameRenewed(event: NewURI): void {
  if (!event.params.uri) {
    return;
  }

  event.params.tokenId

  const domainParts = event.params.uri.split('.');

  if (domainParts.length !== 2) {
    return;
  }

  const name = domainParts[0];
  const tldName = domainParts[1];

  let entity = DomainName.load(name);
  if (!entity) {
    entity = new DomainName(name);
    entity.name = name;
  }

  const tldId = `${name}_${tldName}`;
  let tld = DomainTLD.load(tldId)
  if (!tld) {
    tld = new DomainTLD(tldId);
    tld.tld = tldName;
    tld.owner = event.transaction.from.toHex();
    tld.expires = new BigInt(0);
  }

  if (tldName == 'crypto') {
    entity.crypto = tld.id;
  }

  tld.save();
  entity.save()
}


export function handleUnsNameRenewed(event: NewURI_UNS): void {
  if (!event.params.uri) {
    return;
  }

  const domainParts = event.params.uri.split('.');

  if (domainParts.length !== 2) {
    return;
  }

  const name = domainParts[0];
  const tldName = domainParts[1];

  let entity = DomainName.load(name);
  if (!entity) {
    entity = new DomainName(name);
    entity.name = name;
  }

  const tldId = `${name}_${tldName}`;
  let tld = DomainTLD.load(tldId)
  if (!tld) {
    tld = new DomainTLD(tldId);
    tld.tld = tldName;
    tld.owner = event.transaction.from.toHex();
    tld.expires = new BigInt(0);
  }

  if (tldName == 'crypto') {
    entity.crypto = tld.id;
  }
  if (tldName == 'zil') {
    entity.zil = tld.id;
  }
  if (tldName == 'coin') {
    entity.coin = tld.id;
  }
  if (tldName == 'wallet') {
    entity.wallet = tld.id;
  }
  if (tldName == 'bitcoin') {
    entity.bitcoin = tld.id;
  }
  if (tldName == 'x') {
    entity.x = tld.id;
  }
  if (tldName == '888') {
    entity._888 = tld.id;
  }
  if (tldName == 'nft') {
    entity.nft = tld.id;
  }
  if (tldName == 'dao') {
    entity.dao = tld.id;
  }
  if (tldName == 'blockchain') {
    entity.blockchain = tld.id;
  }

  tld.save();
  entity.save()
}

