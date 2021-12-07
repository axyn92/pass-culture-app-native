import { t } from '@lingui/macro'
import React from 'react'

import { CenteredTitle } from 'features/identityCheck/atoms/CenteredTitle'
import { Declaration } from 'features/identityCheck/atoms/Declaration'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { useIdentityCheckNavigation } from 'features/identityCheck/useIdentityCheckNavigation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const IdentityCheckHonor = () => {
  const { navigateToNextScreen } = useIdentityCheckNavigation()

  return (
    <PageWithHeader
      title={t`Confirmation`}
      fixedTopChildren={
        <CenteredTitle title={t`Les informations que tu as renseignées sont-elles correctes ?`} />
      }
      scrollChildren={
        <Declaration
          text={t`Je déclare que l'ensemble des informations que j’ai renseignées sont correctes.`}
          description={t`Des contrôles aléatoires seront effectués et un justificatif de domicile devra être fourni. En cas de fraude, des poursuites judiciaires pourraient être engagées.`}
        />
      }
      fixedBottomChildren={
        <ButtonPrimary onPress={navigateToNextScreen} title={t`Valider et continuer`} />
      }
    />
  )
}