export const getUserMetaQuery = `query UserMeta($address: String = "") {
    hic_et_nunc_holder(where: { address: { _eq: $address } }) {
        name
        metadata
    }
}`

export const getAvailableCollabAddresses = `query GetCollabContracts($address: String!) {
  hic_et_nunc_splitcontract(where: {administrator: {_eq: $address}}) {
    contract {
      address
      shares {
        shareholder(where: {holder_type: {_eq: "core_participant"}}) {
          holder {
            name
          }
        }
      }
    }
  }
}`

export const getCollabCreations = `query GetCollabCreations($address: String!) {
  hic_et_nunc_token(where: {creator: {is_split: {_eq: true}, address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
    id
    artifact_uri
    display_uri
    thumbnail_uri
    timestamp
    mime
    title
    description
    supply
    token_tags {
      tag {
        tag
      }
    }
  }

  hic_et_nunc_splitcontract(where: {contract_id: {_eq: $address}}) {
    administrator
    shareholder {
      holder {
        address
        name
      }
      holder_type
    }
    contract {
      name
      description
      address
    }
  }
}`

export const getCollabTokensForAddress = `query GetCollabTokens($address: String!) {
  hic_et_nunc_shareholder(where: {holder_id: {_eq: $address}, holder_type: {_eq: "core_participant"}}) {
    split_contract {
      contract {
        address
        name
        tokens {
          id
          is_signed
          artifact_uri
          display_uri
          thumbnail_uri
          timestamp
          mime
          title
          description
          supply
          royalties
          creator {
            address
          }
        }
      }
    }
  }
}`

export const getCollabsForAddress = `query GetCollabs($address: String!) {
  hic_et_nunc_shareholder(where: {holder_id: {_eq: $address}, holder_type: {_eq: "core_participant"}}) {
    split_contract {
      contract {
        address
        name
      }
      administrator
      shareholder {
        shares
        holder {
          name
          address
        }
        holder_type
      }
    }
  }
}`

export const getNameForAddress = `query GetNameForAddress($address: String!) {
  hic_et_nunc_holder(where: {address: {_eq: $address}}) {
    name
  }
}`

export async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    process.env.REACT_APP_GRAPHQL_API,
    {
      method: "POST",
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  console.log(JSON.stringify({
    query: operationsDoc,
    variables: variables,
    operationName: operationName
  }))

  return await result.json()
}

