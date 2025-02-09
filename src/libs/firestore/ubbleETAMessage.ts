import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { QueryKeys } from 'libs/queryKeys'

const defaultUbbleETAMessage = 'Environ 3 heures'

export const getUbbleETAMessage = () =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.UBBLE)
    .doc(env.ENV)
    .get()
    .then((collection) => collection.data())
    .then((data) =>
      data &&
      typeof data[RemoteStoreDocuments.UBBLE_ETA_MESSAGE] === 'string' &&
      !!data[RemoteStoreDocuments.UBBLE_ETA_MESSAGE]
        ? data[RemoteStoreDocuments.UBBLE_ETA_MESSAGE]
        : defaultUbbleETAMessage
    )

export const useUbbleETAMessage = () => {
  const networkInfo = useNetInfo()

  return useQuery<string>(QueryKeys.FIRESTORE_UBBLE_ETA_MESSAGE, () => getUbbleETAMessage(), {
    enabled: networkInfo.isConnected,
  })
}
