export const CollaboratorType = {
  ADMIN: 'admin',
  CREATOR: 'creator',
  BENEFACTOR: 'benefactor',
  CORE_PARTICIPANT: 'core_participant',
}

export const ossProjects = [
  {
    name: 'WG3.2 (collab contract team)',
    address: 'KT1CSfR6kx3uwDEXpwuCPnqp3MhpzfPmnLKj',
  },
  {
    name: 'H=N Tezos Fountain',
    address: 'tz1eggoxCes1qYRGLc3E1bg4uzuCUUuuQBb9',
  },
  {
    name: 'three.js',
    address: 'tz1ZUohCAkGjp7vPjQcC4VWcpgYZR1t3Si5C',
  },
  {
    name: 'Processing',
    address: 'tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK',
  }
]

export const collaboratorTemplate = {
  address: '',
  shares: undefined,
}

export const tipOptions = [ 1, 5, 10 ]

export const mockData = [{
  address: 'tz1YJvMiZyXnzvV9pxtAiuCFvaG7XoBZhbUQ',
  shares: 50,
}, {
  address: 'tz1LKpeN8ZSSFNyTWiBNaE4u4sjaq7J1Vz2z',
  shares: 50,
}, {
  address: 'tz1f94uZ7SF2fLKnMjFzGQTbznd8qpAZ12is',
  shares: 50,
}];


export const createProxySchema = `
(map address (pair (bool %isCore) (nat %share))))
`