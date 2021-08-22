export const getUserMetaQuery = `query UserMeta($address: String = "") {
    hic_et_nunc_holder(where: { address: { _eq: $address } }) {
        name
        metadata
    }
}`

export const getCollabObjkts = `query CollabObjkts {
    hic_et_nunc_token(where: {creator: {is_split: {_eq: true}}}) {
      title
      creator {
        address
        shares {
          administrator
          total_shares
          shareholder {
            holder {
              name
              address
            }
          }
        }
      }
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

export async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://api.hicdex.com/v1/graphql",
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


